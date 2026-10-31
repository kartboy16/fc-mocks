# #726 Email list import and sending setup (onboarding step 3 of 5): build contract

For [#726](https://github.com/kartboy16/content-library/issues/726). Mocks: [hub](index.html), [A](a-steps.html), [B](b-one-page.html), [C](c-fix-later.html), [emails and pages](extra.html), [today](today.html). **Recommend A.** **Not agent-ready. Soft Dev hold until a direction is picked.**

## Where this lives today (read-only, staging `9a5a9bb`)

- **No onboarding flow exists in the app yet.** Step 3 is new. Steps 1 and 2 are #724 and #727, so the step header (5 bars, "Step 3 of 5") must match theirs.
- **CSV import:** `SESContacts.jsx` / `CSVImportModal.jsx` with `ContactCsvColumnMapping.jsx` and `utils/contactCsvImport.js`. Mapping is alias-based (Email, First name, Last name, Tags) with presets for Mailchimp, Outlook and Google Contacts **CSV exports**. There's no XLSX or vCard parsing.
- **Mailchimp import:** `MailchimpImportModal.jsx` + `api/helpers/mailchimp_import_helpers.js` (API key → audience → import with progress).
- **Unsubscribed guard (#388):** `api/helpers/ses_unsubscribe_guard.js` already skips unsubscribed contacts on import (`UNSUBSCRIBED_IMPORT_SKIP_REASON`). Reuse it.
- **Contacts:** `collections/ses_contacts.js` (`advisorId, email, firstName, lastName, lists, tags, status, unsubscribeToken…`). There are **no consent fields**.
- **Sender:** `utils/sesFromEmail.js`. `pickSubscriberSendFromEmail` already falls back to the platform default domain when the custom domain isn't verified. Reply-To is currently the From address.
- **Own domain:** `SESSettings.jsx` has a manual 4-step wizard (enter domain → add DNS records (TXT, 3 DKIM CNAMEs, SPF) → check → set sender). Methods: `ses.verifyDomain`, `ses.checkDomainVerification`. No Domain Connect.
- **Compliance email:** `complianceEmail` / `complianceOfficerName` / `complianceMode` (`email` / `external` / `off`) in advisor preferences, set in SESSettings.
- **SES region:** settings default `ca-central-1`.

## Directions

### A. Step by step ([a-steps.html](a-steps.html), recommended)
One job per screen: **Add** → **Check your list** → **One question** → **Your clients are in**. At the first **Create campaign**, a single "Before your first campaign" dialog asks for (1) the compliance email and (2) sending-domain setup. **Later** and **Continue to campaign** both go straight to the campaign, so nothing is blocked.

### B. One page ([b-one-page.html](b-one-page.html))
Add, review and the consent question are stacked on one page. **Import** stays disabled until the question is answered. The first campaign gets a **Ready to send** checklist card above the editor (Compliance email · Your own sending address) instead of a dialog. Domain setup opens in a side panel.

### C. Import now, fix later ([c-fix-later.html](c-fix-later.html))
After the drop, one short summary plus the consent question, then import. Contacts that need a fix and unsubscribed contacts are **held back** (not on any list) and wait in **Email › Lists › Needs a look**. The first campaign uses the same dialog as A.

### All directions share
- Step 3 screen: drop zone (CSV, XLSX, vCard) + **Connect** for Mailchimp, Outlook and Google Contacts, **Skip for now** and **Back**. Connectors that aren't built yet show **Coming soon** (state "Connectors phased").
- [Emails and pages](extra.html): the web-person email and steps page, and the reconfirm email and page.

## Screens and states

| Screen | States in the mock |
|---|---|
| Step 3 add | default, connectors phased, Mailchimp connect dialog, loading (reading/matching), error (can't read file), empty (no email column → "Pick the email column myself") |
| Check list (A/B), summary (C) | counts tiles, column map with AI chips + dropdown override, fix list (typo suggestion, edit, remove, keep shared inbox), duplicates, unsubscribed |
| Consent question | Current clients / People who asked to hear from me / A mix, or I'm not sure; note about contacts with no last business date |
| Import | progress, done (count, list name, reconfirm count, sender preview) |
| First campaign | prompt, no one-click provider, GoDaddy waiting, verified, GoDaddy error, steps sent, campaign editor with From |
| Web-person email/page | email, steps page, checking, not yet, done, expired link |
| Reconfirm email/page | email, page, yes, no thanks → unsubscribe, unsubscribed, already answered, expired |
| C only | Needs a look (8), nothing to fix |

## Data

- **Per contact (new fields on `sesContacts`):** `consentType` (`implied-client` | `express` | `unclear`), `consentDate`, `lastBusinessDate` (nullable), `consentExpiresAt` (implied: `lastBusinessDate` + 2 years), `consentSource` (`import:<importId>` / `reconfirm` / `public-subscribe-form`), `reconfirmStatus` (`none` | `sent` | `confirmed` | `declined` | `expired`), `reconfirmSentAt`.
- **Per import (new `contactImports` doc):** `advisorId`, source (file type / connector), file name, row count, mapping used, counts (ready, duplicates, fixed, removed, unsubscribed skipped, held), consent answer, `createdAt`, `createdBy`. Keep this as the consent audit trail. Store **no raw file** after import.
- **Sendable rule:** `status=subscribed` AND (`express` OR (`implied-client` AND `consentExpiresAt > now`) OR `reconfirmStatus=confirmed`). Expired or unclear contacts are excluded from campaign audiences, and the campaign recipient count says so ("12 not included: consent expired or unconfirmed").
- **Consent answer mapping:** Current clients → `implied-client` for rows with a last business date and `unclear` for rows without one. Asked to hear from me → `express`, `consentDate` = import date (or a mapped date column). A mix / not sure → `unclear` for everyone.
- **Nightly job:** flips `implied-client` past `consentExpiresAt` to excluded. Open question: do we send a reconfirm email before expiry?

## Mapping and dedupe rules

- **Parsing:** CSV (existing), XLSX (first sheet, or ask if there are several), vCard 3/4 (multiple EMAIL → first is primary).
- **Mapping:** existing aliases first. Then the AI suggests a field for unmatched columns from the header + 5 sample rows, sent without other rows. Fields: Email (required), First name, Last name, Last business date, Tag(s), Don't import. Every AI pick shows an **AI** chip and a dropdown to override.
- **Dedupe:** key = trimmed, lowercased email. Within the file, keep the row with the most non-empty fields and fill blanks from the others. Against existing contacts, update the empty fields only; never overwrite an advisor's edits.
- **Bad addresses:** syntax invalid → must fix or remove. Common domain typo (gmial.com etc.) → one-click suggestion. Missing TLD → inline edit. Known bounced or no MX → remove (reuse #700/#420 bounce data). Role or shared inbox (info@, office@) → flag, default keep.
- **Unsubscribed (#388):** never re-added; shown in a collapsed list with the existing message.

## Sending

- **Until the own domain is verified:** From name **"{Advisor name} via FinancialContent"**, From address on FC's own domain, **Reply-To = advisor's email**. The UI shows the name and "Replies go to …" only, never the FC address. `pickSubscriberSendFromEmail` already handles the fallback. Add Reply-To.
- **After verification:** From = advisor's own address and name, unchanged from today.

## Domain-auth flow

1. At the first **Create campaign** (A/C dialog, B checklist), detect the DNS provider from the advisor's domain NS records.
2. **One-click (Domain Connect, e.g. GoDaddy):** **Set up with GoDaddy** opens the provider's consent page in a new tab with our template (TXT verify, 3 DKIM CNAMEs, SPF). The app polls `ses.checkDomainVerification` and shows waiting → verified, or an error with **Try again** plus the email fallback.
3. **Otherwise:** **Email the steps to your web person** (email field, **Send steps** button). The email comes from the interim sender with Reply-To the advisor and contains **one link that only opens the steps page**. The page lists the 5 records with Copy buttons and a **Check my records** button (POST). Results: not yet / done (the advisor is emailed). The link is a signed token that expires after 14 days.
4. Campaigns never wait on DNS; they send with the interim sender until verified.
5. **Reconfirm email:** "Keep hearing from {Advisor}?" The email links only open a page. **Yes, keep sending me updates** and **Unsubscribe** are POST buttons (#657 scanner-safe). Already-answered and expired states are included.

## Security and residency

Contacts stay in the existing Mongo collection, encrypted at rest and scoped to `advisorId` (firm admins via the existing role checks). The uploaded file is parsed in memory and not kept. Only the header + 5 sample rows go to the AI for mapping. Software developer to document the Mongo/S3/SES regions (SES default is `ca-central-1`) on the issue before building.

## Out of scope

Two-way sync with Mailchimp/Outlook/Google (this is a one-time import); editing CASL copy in the app; Domain Connect providers beyond the first one; changing existing Email Lists / Campaigns / unsubscribe / approval flows (no regression); CRM sync (#130).

## Mobile (390)

Single column. The 5 count tiles wrap 2 per row. In the column map the Example column hides. Fix rows put the address on its own line with buttons below. Dialogs go full-screen with stacked full-width buttons. B's side panel goes full-width. All targets are ≥44 px.

## Estimate (agent time: cloud agent runs + FC Tester + fix loops)

Scale: #699 took about 30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| 1. Consent fields, import record, XLSX/vCard parse, AI mapping, dedupe, address checks, unsub guard | 1.5–2.5 h | 1.5–2.5 h | 1.5–2.5 h |
| 2. Onboarding step 3 screens + states (reuse Mailchimp import) | 1.25–2 h | 1–1.75 h | 1.25–2 h |
| 3. Sendable rule, expiry job, reconfirm email + POST page | 1–1.5 h | 1–1.5 h | 1–1.5 h |
| 4. Interim sender + Reply-To, first-campaign prompt, web-person email + steps page | 1–1.5 h | 1–1.75 h | 1–1.5 h |
| 5. Domain Connect one-click (first provider) | 1–1.75 h | 1–1.75 h | 1–1.75 h |
| C only: held contacts + Needs a look in Lists | | | 0.5–1 h |
| **Total** | **≈5.75–9.25 h** | **≈5.5–9.25 h** | **≈6.25–10.25 h** |

- Outlook + Google Contacts connectors (OAuth, read contacts) add about 1.5–2.5 h in any direction. The mock shows them as **Coming soon** if they're phased.
- Wall-clock is about 5–8 h. Runs 3–5 can follow run 1 in parallel.
- **Not agent time:** registering as a Domain Connect service provider with GoDaddy and Google/Microsoft app verification are outside approvals that can take days. Until then, the one-click button stays hidden and the email path is used.

## Recommendation

**A.** It has one decision per screen, which suits "drop the list, answer one question". It's the clearest at 390. The first-campaign dialog is one short, skippable interruption. B gets long once the fix list is open. C is fast but leaves cleanup that advisors tend to forget.

## Open questions

1. **CASL copy:** every **PLACEHOLDER** chip (option descriptions, "I don't need compliance review", reconfirm email body and footer) needs compliance-approved wording. Who supplies it?
2. **Current clients with no last business date:** treat them as unclear and send the reconfirm email (as mocked), or use the import date?
3. **"A mix / not sure":** should everyone get the reconfirm email (as mocked), or should the advisor be able to tag who's who?
4. **Reconfirm:** how many reminders if there's no answer, and when do we stop (for example one reminder after 7 days, then expired)? Should we also reconfirm before implied consent expires?
5. **Connectors:** ship CSV/XLSX/vCard + Mailchimp first and show Outlook and Google Contacts as **Coming soon**?
6. **Shared inboxes** (info@): keep by default (as mocked) or remove?
7. **Default list name** for imported contacts ("My clients")?
8. **One-click providers:** GoDaddy only at first, or Cloudflare/others too?
9. **Compliance email:** if the advisor already has `complianceMode` set (email/external), skip step 1 of the prompt?

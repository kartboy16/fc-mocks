# #700 Campaign report: bounced addresses (Mailchimp): build contract

For [#700](https://github.com/kartboy16/content-library/issues/700). Mocks: [hub](index.html), [A](a-tab.html), [B](b-drawer.html), [today](today.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Where this lives today (read-only, staging `64a794e`)

- **Mailchimp reports:** `imports/ui/EmailCampaigns/mailchimp/MailchimpReports.jsx`. **View** opens a "Campaign report" dialog that renders `MailchimpReportDetail.jsx`. The dialog shows a metrics grid where **Bounced** is a count with a "{n} hard · {n} soft" caption, plus Top links and Top openers. There's **no list of addresses**.
- **Data:** `server/mailchimp/reports-methods.js`. `fetchMailchimpReportData` calls `reports.getCampaignReport`, `getCampaignOpenDetails` and `getCampaignClickDetails`. There's an existing `mailchimp.getEmailActivity`, but it's **admin-only** (`assertAdminRole`) and fetches only `count: 100`.
- **#420 bounce UI (SES only):** `SESReports.jsx` has a report tab row "Opens (n) / Clicks (n) / **Bounces (n)** / Recipients (n)". `CampaignBounceGuidance.jsx` and `utils/bounceGuidance.js` provide the plain-language copy, including the empty copy "No bounces recorded for this campaign…".

## Data source

- **List:** `GET /3.0/reports/{campaign_id}/email-activity` (`mailchimp.reports.getEmailActivityForCampaign`). Use `count=1000`, page with `offset` until `total_items`, and pass `fields=emails.email_address,emails.activity,total_items`. Keep the emails with an `activity[]` item where `action === 'bounce'`. Its `type` is `hard` or `soft`, plus a `timestamp`.
- **Counts:** these stay as now, from `GET /3.0/reports/{campaign_id}` (`bounces.hard_bounces`, `soft_bounces`, `syntax_errors`).
- **Reason (caveat):** the Marketing API does **not** return the SMTP bounce reason. Mailchimp shows reasons only in its own UI, one address at a time, kept for 30 days, and they can't be exported. The mock's **Reason** column shows Mailchimp's own meaning of the type: hard is "Permanent: this address can't receive email" and soft is "Temporary: couldn't be delivered this time". See open question 1.
- **New method:** `mailchimp.getCampaignBounces(campaignId, advisorId, passphrase)` with `assertAdvisorOrAdmin`, the same as the other report methods. It returns `[{ email, type, bouncedAt }]`, sorted hard first, then by email. The admin-only `getEmailActivity` stays as it is.

## A: "Bounced (N)" tab in the report ([a-tab.html](a-tab.html), recommended)

- The Campaign report dialog gets tabs: **Overview** (today's content, unchanged) and **Bounced (N)**. This mirrors the SES report's **Bounces (n)** tab from #420.
- On Overview, the Bounced metric gets a small **View list** link that switches to the tab.
- **Tab content:** "Bounced (15) · 11 hard · 4 soft", then search (email contains), a filter (**All (15) / Hard (11) / Soft (4)**) and **Export CSV**.
  - Below that is a table with **Email | Type** (Hard/Soft chip) **| Reason | Bounced** (date and time), then "Showing n of N".
  - The list loads when the tab is first opened, not with the dialog, so Overview stays as fast as now.

## B: drawer from the bounce count ([b-drawer.html](b-drawer.html))

- The report dialog is unchanged except that the Bounced metric gets **View list**.
- **View list** opens a right-side drawer (560 px) over the dialog: "Bounced (15)", "11 hard · 4 soft · {campaign}", ← back and ×.
  - It has the same search, filter, Export CSV and list. The table drops the Bounced column to fit, and the date is in the CSV.
  - Esc or ← closes the drawer and returns to the report.
- At 390, the drawer is a full-screen sheet over the (already full-screen) dialog.

## States (both)

| State | Shows |
|---|---|
| `list` | Count and split, toolbar, list, and "Showing n of N". Search with no match shows "No addresses match your search." |
| `empty` | "**No bounces for this campaign**". Search and Export CSV are disabled, and the counts are 0. |
| `loading` | A spinner and "Loading bounced addresses…". The Overview counts stay visible (they come from the report call). |
| `error` | "Couldn't load bounced addresses from Mailchimp. The counts above are still correct." plus **Try again**. |

## Export CSV

- Exports the **current filtered view**, built client-side from the loaded list (no new endpoint).
- Columns: `Email, Type, Reason, Bounced at`. The file name is `bounced-{campaign-slug}.csv`. A toast confirms "Exported n addresses".

## In scope

- The new `mailchimp.getCampaignBounces` method with paging, plus a unit test using a stubbed Mailchimp response.
- A: tabs, View list, the bounced list component, search, filter, CSV, and the four states. B: a drawer or sheet instead of tabs.
- A phone layout at 390, and the existing report test updated.

## Out of scope

- Fetching SMTP reasons (not in the API), and changing member status in Mailchimp from FC.
- The SES Bounces tab (#420, done), bounce alerts, and the password-protected emailed report page (see open question 3).
- Syntax-error addresses: they're counted in Bounced but not returned as addresses by email-activity (see open question 4).

## Mobile notes (390)

- The dialog is full screen, as now. Search is full width.
- The filter is a full-width 3-way control with 44 px targets, and Export CSV sits on its own full-width row.
- The table becomes a list. Each item shows the email (wrapping at `@` or `-` if long), the Hard/Soft chip on the right, the reason, and the date.
- In B, the drawer becomes a full-screen sheet with ← back. Nothing depends on hover.

## Agent-time estimate (per Alex's Oct 30 rule)

This is how long a Cursor cloud agent takes to build it, plus FC Tester time. For calibration, #699 took about 30 min from handoff to tested. Each direction is one agent run: one new server method and one or two UI files.

| | A: tab | B: drawer |
|---|---|---|
| Cloud agent build: method with paging and test, list component, search, filter, CSV, states, phone | 30–40 min | 35–50 min (adds the drawer or sheet, back and Esc) |
| FC Tester: desktop and 390, the four states, filter, search, CSV contents | 15–25 min | 20–25 min |
| Review and fix loops (1–2) | 10–20 min | 15–25 min |
| **Total** | **≈55–85 min** | **≈70–100 min** |

**Dependency (not included):** FC Tester needs a Mailchimp test audience and a sent campaign with at least one hard and one soft bounce. Without one, QA runs against a stubbed response, and the real check waits until a test campaign exists.

## Pick: A

- It puts Mailchimp bounces in the same place as SES bounces (#420's **Bounces** tab), so advisors learn one pattern.
- It's one surface: B stacks a drawer on top of a modal dialog, which on a phone is a sheet over a full-screen dialog.
- It's about 15 min less agent time.

## Open questions

1. **Reason:** the API has no per-address reason. Is the type-based reason (Mailchimp's meaning of hard and soft) OK? Or should we add a "View bounce reasons in Mailchimp" link (they're kept 30 days there), or drop the Reason column?
2. #420's plain-language rule keeps the phrases "hard bounce" and "soft bounce" out of advisor copy. The mock uses Mailchimp's **Hard** and **Soft** type labels, the same as today's "{n} hard · {n} soft" caption. Is that OK?
3. Should the **password-protected emailed report** (the "Email report" link) also list the addresses? The default is no, because it's a privacy concern.
4. **Syntax errors** count toward Bounced but aren't returned as addresses. Should we show "+ n syntax errors (not listed)" under the count when it's above 0?
5. **Large campaigns:** paging email-activity is about 1 call per 1,000 recipients. Is a short server cache per campaign (for example 10 min) OK?

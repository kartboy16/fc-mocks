# #617 API form, simpler: build contract

> **✓ Direction A (one scroll) is locked.** Alex picked A at 12:58 AM PT on Oct 22, 2026, via Chief of Staff. B is kept for reference only. **Software developer is building A on staging.** The flow is staging first, then the FC Tester gate, and only Alex merges to main.

**Status:** A locked. Alex answered all five questions (section 9). Built on #617 Direction A (chooser first, one sign-up type per form).
**Scope:** FTT Mail only. The Create/Edit Subscription Form dialog (`imports/ui/EmailCampaigns/SESForms.jsx`) when the type is **Connect my own form** (`usageType: "api"`), as on staging at `fe28797`.

Mocks: [hub](index.html) · [Today](today.html) · [A, one scroll (picked)](a-one-scroll.html) · [B, two tabs (not picked)](b-two-tabs.html)

## 1. Problem (Alex's feedback)
The dialog is overwhelming and has too much text. The submit URL is hard to find: it's relative (`/api/ses/forms/submit/<id>`), sits in a sentence halfway down, and has no Copy button. Today there are about 260 words of helper text, a developer field table that's always open, and a locked double opt-in switch. Target list isn't marked required, and Attach tag looks required.

## 2. Recommendation
**A, one scroll.** The URL box sits at the top, then six advisor fields, then two collapsed sections: More options and Developer details. Everything stays on one screen, so nothing is hidden behind a tab, and only about 27 words of helper text show until you open something. B (Settings / Connect your website tabs) separates the roles more clearly but adds a click, and the URL appears twice.

## 3. Screen (A)
Top to bottom:
1. **How will you use this form?** The 3 type cards, each with a one-line description. Drop the "Need two ways…" note entirely (Alex, Oct 22).
2. **Your form's URL**
   - **Unsaved:** a grey dashed box that says "Save to get your form's URL."
   - **Saved:** a green box with the absolute URL in monospace (`https://financialcontent.ca/api/ses/forms/submit/<id>`) and a **Copy** button. The button shows **Copied** for 2 seconds.
3. **Settings**
   - Form name (Required)
   - Target list (Required on **all** form types, no "No list" option, placeholder "Choose a list")
   - Attach tag (Optional) + Create tag
   - Allowed websites with an ⓘ tooltip
   - Notify me at (Optional) + Add another address
   - Success message
4. **More options** (collapsed): consent wording with a one-line "Shows as: …" preview, and "Form is on (accepting sign-ups)" (saved forms only).
5. **Developer details** (collapsed):
   - A POST line with the full URL.
   - A field table (email, consent, name, interest, sourceUrl, website_url).
   - Spam-trap field name.
   - The Turnstile switch with a one-line note, and "Let sign-ups through if the bot check is down".
   - A **sample HTML/JS** snippet built with the full URL and the consent preview, with a **Copy code** button. Before the first save it says "Save first. The sample then includes your form's URL."
6. Actions: Cancel, then **Create Form** or **Update Form**.

**Removed:** the locked double opt-in switch, the "same thanks reply" paragraph, the interest-tags paragraph, the duplicate blocked-sign-ups lines and the www rules. The rules that still matter are in one tooltip.

**ⓘ Tooltip (Allowed websites).** It opens on hover, focus or tap, and closes on an outside tap.
- www.example.com and example.com count as the same site. Other subdomains need their own line.
- Sign-ups from websites not on the list are blocked and never email you.
- New subscribers always confirm by email first (double opt-in).
- Each `interest` value becomes a tag like "Interest: Retirement planning", made the first time it comes in.
- Lines that aren't a website address aren't saved. We'll show them to you.

## 4. States
| State | What shows |
|---|---|
| Unsaved (new form) | Title "Create Subscription Form". URL box says "Save to get your form's URL." The snippet is replaced with "Save first…". The button says Create Form. |
| Saved | Title "Edit Subscription Form". Green URL box with Copy. The snippet uses the full URL. The "Form is on" switch shows. The button says Update Form. Toast after create: "Form created. Your form's URL is ready to copy." Toast after update: "Saved. Changes apply to new sign-ups right away." |
| Copy success | The button turns green and says **Copied** for 2 seconds, then goes back. This applies to both Copy and Copy code. |
| Missing target list | Save is blocked. The top alert says "Choose a target list before saving." The Target list field gets a red border and the error "Choose a list. New sign-ups need a list to go to." It scrolls into view and clears once a list is picked. |
| Rejected website lines | Keep today's warning after save. Its wording is unchanged. |

## 5. Copy (all of it)
- **Type cards:** "Embed on my website / Paste our code", "Share a sign-up page / We host the page", "Connect my own form / Your site sends sign-ups".
- **URL box:** "Your form's URL", "Your website sends sign-ups here.", "Save to get your form's URL."
- **Field help:**
  - "One website per line. Only these sites can send sign-ups."
  - "We email you about each new subscriber."
  - "Shown after someone signs up."
- **Developer details:**
  - Header hint: "For whoever builds your website form."
  - Spam trap: "Change only if your site already uses website_url."
  - Turnstile: "Needed for new interest tags. Your developer adds the widget."

## 6. In scope / out of scope
**In scope:**
- The API-type branch of the dialog: layout, copy, collapses, tooltip, URL box and Copy, the snippet generator, and required-field validation for the target list on every form type (embed, sign-up page and API).
- Forms list: API rows get one **Copy form URL** action (copies the absolute URL, shows "Copied"), replacing Get Embed Code and Copy Hosted Link.
- The URL always uses `https://financialcontent.ca/api/ses/forms/submit/<id>` for now, even when a custom form hostname is set. Staging may show the staging host.

**Out of scope:**
- Server behaviour (allowlist, Turnstile, consent).
- Embed and sign-up page layouts.
- The open #617 questions (form key, embeds with an empty list, www rules, reCAPTCHA, consent switch, blocked sign-up emails).
- Custom form hostnames in the API URL (later).

## 7. Mobile
Below 600px the dialog goes full screen:
- The type cards stack.
- The URL wraps (break-all) and Copy turns into a full-width button under it.
- The tooltip opens on tap.
- The field table can scroll sideways.
- The snippet scrolls inside its box.

## 8. Estimate
- **A:** about 1.5–2 days. That's 1–1.5 days of UI (restructure the API branch, URL box and copy, two collapses, tooltip, snippet built from the form id and consent preview, required list validation) plus 0.5 day of tests and staging QA.
- **B:** about 2–2.5 days (tabs, plus keeping the URL bar in sync).

## 9. Alex's answers (Oct 22, 2026, replaces the open questions)
1. **Target list is required on all form types**: embed, sign-up page and API. Remove "No list (general subscribers)".
2. **Turnstile goes in Developer details**, as mocked.
3. **API rows in the forms list get a single "Copy form URL" action**, replacing Get Embed Code and Copy Hosted Link.
4. **Drop the "Need two ways?" note.** No tooltip.
5. **The URL always uses financialcontent.ca for now.**

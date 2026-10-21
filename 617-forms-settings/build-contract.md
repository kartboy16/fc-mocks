# #617 FTT Mail Forms settings: build contract

**Status:** Designer-first mock with generic sample data. **Not agent-ready. Soft Dev hold until Alex picks.**
**Scope:** FTT Mail only. The settings screen for Email Campaigns → Subscription Forms (`imports/ui/EmailCampaigns/SESForms.jsx`) as it is on staging at `f8ccc396` (PR #618).

Mocks: [hub](index.html) · [Today](today.html) · [A](a-chooser.html) · [B](b-tabs.html) · [C, recommended](c-core-panels.html)

## 1. Why it's confusing today
Every form is an embed, a hosted page and a public API endpoint **at the same time**, but there's no form type, so one long dialog (28 controls) mixes settings for all three. Helper text names a type ("Embed snippets ignore these", "The public subscribe API only…"), but nothing groups or hides settings by type. The API itself has no screen: no key, no snippet, and no field list. Those are only in `docs/public-subscribe-api.md`.

## 2. Settings inventory (today)

| Setting (today's label) | Stored as | Embed | Hosted page | API | Notes |
|---|---|---|---|---|---|
| Form Name | `name` | ✓ | ✓ (default heading) | ✓ | Internal |
| Target List | `listId` | ✓ | ✓ | ✓ | Shared |
| Attach tag | `tagId` | ✓ | ✓ | ✓ | Shared, fallback tag |
| Button Text | `styling.buttonText` | ✓ | ✓ | – | Unstyled embed uses it too |
| Button Color, Theme Preset | `styling.buttonColor/themePreset` | styled only | ✓ | – | Does nothing for unstyled or API |
| Logo, Page Heading, Page Blurb, Page Background Color | `styling.*` | – | ✓ | – | Grouped as "Hosted page branding" |
| Success Message | `settings.successMessage` | ✓ | ✓ | ✓ (in the JSON reply) | Shared |
| Redirect on success | `settings.redirectUrl` | – | ✓ | – | |
| Custom form hostname | `settings.customHostname` | – | ✓ | (that host is trusted) | |
| **Allowed site domains** (origin allowlist) | `settings.allowedSiteDomains` | **✓** | always allowed | ✓ | Copy says API only, but it also gates embeds (gap 1) |
| Consent wording | `settings.consentWording` (+ `gdprConsentText`) | ✓ | ✓ | ✓ (your form shows it, we record it) | Shared |
| **Notify these addresses when someone subscribes** | `settings.notifyEmails[]` | ✓ | ✓ | ✓ | Shared. Up to 20, invalid ones dropped silently |
| **Field mapping**: Interest values → tags | `settings.interestTagMap[]` | ✓ (drop-down) | ✓ | ✓ (`interest`) | The only part that's editable. The `name` split and the field names aren't shown in the UI. Form fields are fixed (email, first, last). |
| Honeypot field name | `settings.honeypotFieldName` | ✓ | ✓ | ✓ | Mostly matters for the API |
| Embed style (styled / unstyled) | `settings.embedStyle` | ✓ | – | – | |
| Require double opt-in (locked on) | `settings.doubleOptIn` | ✓ | ✓ | ✓ | Display only |
| Enable reCAPTCHA | `settings.enableRecaptcha` | styled only | ✓ | ✗ breaks | See gap 3 |
| Enable Cloudflare Turnstile | `settings.enableTurnstile` | ✓ | ✓ | ✓ | Needs Galaxy keys |
| Fail open if bot check unreachable | `settings.botCheckFailOpen` | ✓ | ✓ | ✓ | Shown even with no check on |
| Require consent checkbox (CASL) | `settings.requireGDPRConsent` | – | – | – | **Does nothing** (gap 4) |
| Form active | `settings.active` | ✓ | ✓ | ✓ | Edit only |
| **API key** | – | – | – | – | **Doesn't exist.** The API is identified only by the form id in the URL. |
| **Code snippet** | – | Get Embed Code dialog | Copy Hosted Link dialog | **docs only** | No API snippet in the UI |

**Shared:** name, list, tag, consent wording, double opt-in, notify addresses, interest → tag, success message, spam protection, active. **Embed + API:** allowed site domains, honeypot name. **Embed only:** embed style. **Embed + hosted:** button text, colour, theme. **Hosted only:** logo, heading, blurb, background, redirect, custom hostname.

## 3. Options

| | Idea | Where the API key, origins, field mapping, notify addresses and snippets go | UI days |
|---|---|---|---|
| A | "How will you use this form?" chooser first, then only that type's settings | Origins in "Your website" (embed and API). Key, field table and snippet in "Connect your form" (API). Embed code in "Look and code". Hosted link in "Your sign-up page". Notify in the shared section at the end. | 3–3.5 |
| B | Tabs: Basics · Embed on website · Sign-up page · Your own form (API) · Notifications | Origins repeated on the Embed and API tabs (one shared list, labelled as shared). Key, fields and snippet on the API tab. Notify on its own tab. | 3–3.5 |
| **C (recommended)** | One shared core, then "Where people sign up" with an on/off panel for Embed, Sign-up page and My own form | Core: list, tag, consent, double opt-in, interests, **notify addresses**, thank-you message, spam check, on/off. **Origins** sit above the panels and show which panels use them. API panel: **key (Show/Copy/Regenerate with warning)**, **field table**, honeypot name, **snippet**, test sign-up. Embed panel: look and **embed code**. Sign-up page panel: **link**, branding, redirect, custom address. | **3–4** |

**Why C:** a form really can be all three types at once, and C says so. It's the only option where shared settings appear once and per-type settings stay with their own code. A forces one type per form, so an advisor using both the embed and a page needs two forms (two consent wordings, two notify lists). B hides the shared settings on Basics and repeats the origin list on two tabs. **Take from A:** when creating a form, ask "How will you use this form?" to decide which panels start switched on.

**Backend (all options):** about 1–1.5 days for the "uses" flags, inline validation errors, the blocked-sign-up log and the bug fixes in §5. **The proposed form key adds about 1.5–2 days** (generation, hash storage, check on submit, regenerate, migration so existing API users aren't broken). **Totals:** A 4–5 days, B 4–5, C 4.5–5.5 (without the key) or 6–7.5 (with it).

## 4. States and copy (every option)
- **No forms:** "No sign-up forms yet. Create a form to collect newsletter sign-ups on your website, a hosted page, or your own form." + Create form.
- **Bad origin:** inline error for a bad entry ("…isn't a website address. Use something like www.example.com (no port or spaces).") and a www hint ("Visitors may also use example.com. Add it too if your site answers on both."). After a blocked sign-up: a banner "A sign-up was turned away. It came from example.com, which isn't on your list" with **Allow example.com** and the time of the last block (PT).
- **Save error:** "Couldn't save. Fix the 2 items marked in red", with the errors shown inside the editor and not behind it.
- **Saved:** "Saved. Changes apply to new sign-ups right away. You don't need to paste the code again."
- **Key regenerated:** a confirm dialog first ("Your website form stops working until you update it…"), then "New form key created. The old key stops working now. Paste the new snippet on your website."
- **Mobile (390px):** single column. The panels and type cards stack, and dialogs go full screen. Snippets scroll sideways inside their box.

## 5. Code gaps and bugs found (staging `f8ccc396`)
1. **The allowlist also blocks embeds.** The embed posts from the advisor's own site to `/api/ses/forms/submit/:id`. Trusted hosts are only the FC host, `formsBaseUrl` and the custom hostname, so an existing embed on a site that isn't listed now gets 403 "Origin not allowed". Check this before main.
2. **Exact host match:** `example.com` doesn't allow `www.example.com`. Bad lines (ports, paths with spaces) are dropped silently on save.
3. **reCAPTCHA plus the unstyled embed or API = every sign-up fails.** The unstyled builder passes `recaptchaEnabled=false`, so no token is sent and the server fails closed. "Fail open" doesn't help, because a missing token returns `ok:false` instead of throwing. Turnstile switched on without Galaxy keys fails the same way. Both checks can be on at once.
4. **"Require consent checkbox (CASL)" does nothing.** The checkbox is always rendered and the server always requires `consent`.
5. **The hosted page consent line shows the literal "Your Firm Name".** `buildHostedFormPage` calls `buildFormEmbedFragment` without `firmName`.
6. **Errors render behind the dialog.** The page-level `Alert` (e.g. "Form name is required") isn't inside the Dialog.
7. **No save confirmation**, and no feedback when invalid notify addresses or domains are dropped.
8. **No API key and no API snippet** in the UI. The doc says to copy the form id out of the hosted link. Requests with no `Origin` (server-to-server) skip the allowlist, so only the rate limit protects the API.
9. **Blocked sign-ups aren't visible** to the advisor (the `action` is computed but not stored).
10. The interest drop-down shows raw values (no label field). The form fields are fixed.
11. `fail open` shows when no check is on. The "double opt-in" label says "public site submissions" but it applies to every form.

## 6. In and out of scope
**In:** reorganising the settings, inline validation, states, the API panel (key, fields, snippet), the blocked-sign-up banner, and fixes 1–7 and 10–11. **Out:** other email providers (FTT Mail only), new form field types, a visual form builder, custom-domain automation (still manual DNS plus Galaxy), and analytics.

## 7. Questions for Alex
1. Do you want a **form key** at all? It would sit in public page code, so it's an identifier you can rotate, not a secret. The alternative is "regenerate form id". Or keep it keyless and rely on origins plus the rate limit.
2. Should existing embeds keep working with no allowlist? Options: trust the advisor's website address from their profile automatically, or treat an empty list as "embeds allowed" (API still blocked).
3. Should `example.com` automatically allow `www.example.com` (and the reverse)?
4. Can one form be used several ways (C), or one type per form (A)?
5. Drop the reCAPTCHA option for new forms and keep Turnstile only?
6. Remove the "Require consent checkbox" switch (always required under CASL)?
7. Should a blocked sign-up also email the notify addresses (e.g. a daily summary), or only show the banner?

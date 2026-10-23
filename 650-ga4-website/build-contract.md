# #650 Google Analytics (GA4) on Settings > Website: build contract

**Status:** Designer-first mock with generic sample data (example.com, `G-ABC1234XYZ`, advisor ID `abc123`). **Not agent-ready. Soft Dev hold until Alex picks.**
**Scope:** Content Library → Website → **Settings** (`imports/ui/WebsiteSettings.jsx`, `components/website-publishing/PhpServerSettingsPanel.jsx`) and the PHP renderer (`private/php-renderer/insights/lib.php`, `fci_head_common()`), as on staging at `e50f1db`. #644 "PHP on your server" **has landed** on staging: it's the third method card (Direction A), and the renderer is at version 1.2.

> **Revised Oct 23, 2026 (Alex's feedback):** he likes A, but it read like a 4th publishing method. A is now a **setting**, not a card, in two variants on the same page: [A1, a section and settings row](a-ga-card.html?v=1) and [A2, a strip attached under the PHP card (recommended)](a-ga-card.html?v=2). Coverage stays Insights pages only.

Mocks: [hub](index.html) · [Today](today.html) · [A, a setting (A1 / A2, recommended A2)](a-ga-card.html) · [B, inside the PHP card](b-in-php-card.html) · [C, Tracking & analytics card](c-tracking-card.html). Every page has a **Desktop / Phone** toggle (a 390px frame). Add `?phone` to the URL to open it in phone view.

## 1. Where the tag goes (matching the issue)
The issue asks for GA4 `gtag.js` in the `<head>` of every page, added once from a shared include or template partial, and skipped on preview/staging hosts and `noindex` pages.

For static sites, the pages FC controls are the **Insights pages**: the PHP renderer builds one shared `<head>` for `/insights` and every `/insights/<slug>` in `fci_head_common()`. The mock puts the snippet there once. It's skipped when the request host isn't the saved website, and on pages that carry `noindex` (the error and not-found pages already do).

The advisor's own header and footer files and the rest of their static pages **aren't touched** (see open question 1).

## 2. Recommendation
**A2: a settings strip attached directly under the PHP card.** It reads as part of PHP's setup, not as a choice, so it can't be mistaken for a 4th method. It follows the PHP card wherever it sits: first when PHP is active, last when it isn't (then it's dimmed and says "Available when you publish with PHP on your server"). It adds no new page section.
- **A1** (a section break, "Settings for your Insights pages", and a plain row under all three cards) is clear too, and it scales if more Insights settings come later. But it sits further from the PHP card it depends on, so it relies on a "Uses PHP on your server" tag to make the link.
- **B** (inside the PHP setup panel) and **C** (a "Tracking & analytics" card) are unchanged. C has the same "looks like a method" problem.

## 3. Screen (A, revised)
Both variants use **no card border, no radio and no selectable or hover look**. Each is a plain settings row: label on the left, then the field, Save and a status line. A purple accent (the same colour as the PHP card's "New" chip) ties it to PHP.

**A1: section and row**
- A 2px section break below the three method cards.
- Heading **"Settings for your Insights pages"**, with the subhead "These apply to the /insights pages that PHP on your server shows on your site."
- One row: **Google Analytics**, with the one-line help and a **"⚙ Uses PHP on your server"** tag on the left, and the Measurement ID field, Save and the status on the right. There's a left purple accent line.

**A2: strip under the PHP card (recommended)**
- A tinted strip tucked under the PHP card, indented, with a purple connector line from the card.
- Eyebrow: **"Insights page settings · for PHP on your server"**.
- The same Google Analytics row.

**Both variants:**
- Field: **Measurement ID** (placeholder `G-XXXXXXXXXX`). It trims and uppercases on blur. **[Save]** is enabled only when the value has changed and is valid.
- The status line covers not set up, saved/waiting, tracking (live), folder update needed and not available.
- Collapsed "Where do I find my ID?" and "Developer details (analytics)".
- The privacy placeholder, **not written**.
- Remove, with a confirm.

**Method not PHP:** the row or strip stays visible but dimmed, with the field disabled and the line "Available when you publish with PHP on your server."

**Phone:** the label stacks above the field, and Save is full width. A2's indent shrinks to 12px.

## 4. States
| State | Field | Status line / message |
|---|---|---|
| Empty | blank, Save disabled | "Not set up. Visits aren't tracked yet." |
| Invalid ID | red border, Save disabled | Not G-: "That doesn't look like a GA4 ID. It starts with G-, like G-ABC1234XYZ." UA-: "That's an old Universal Analytics ID. Paste your GA4 ID instead. It starts with G-." GTM-: "That's a Tag Manager ID. Paste your GA4 Measurement ID. It starts with G-." |
| Saved (waiting) | `G-ABC1234XYZ` | Toast: "Saved. Tracking starts on your Insights pages within 15 minutes." Line: "Saved. Waiting for your site to pick it up (up to 15 minutes). Remove" |
| Live | `G-ABC1234XYZ` | "Tracking on example.com/insights. Your site picked it up 3 min ago. Remove" (shown after the first renderer fetch on version 1.3+ following the save) |
| Folder update needed | `G-ABC1234XYZ` | "Update your insights folder to turn this on. Your site runs version 1.2; analytics needs 1.3. Download the update" |
| Method not static/PHP | disabled, blank | A1/A2: dimmed, "Available when you publish with PHP on your server." B: hidden (it lives in the PHP card). C: greyed out. |
| Removed | blank | Confirm: "Remove your Google Analytics ID? Tracking stops on your Insights pages within 15 minutes." Toast: "Removed. Tracking stops within 15 minutes." |

**What it applies to:** Insights pages on the saved website only (`/insights` and `/insights/<slug>`). It doesn't apply to preview or staging hosts, `noindex` pages or the rest of the site.

## 5. Copy
- One-line intro: "Paste your GA4 Measurement ID to track visits to your Insights pages."
- Everything else is in section 4.
- **Placeholder (not written):** privacy or cookie-consent wording.

## 6. In scope / out of scope
**In scope:**
- **UI:** the card, validation, Save and Remove, the status line, help and developer details, and greyed-out or hidden states for other methods.
- **Storage:** `advisorConfig.analytics.ga4MeasurementId`, with a server method that validates `^G-[A-Z0-9]{4,12}$`.
- **Delivery:** the ID goes out to the renderer with the posts response. A new field, so no re-download after version 1.3.
- **Renderer version 1.3:**
  - Injects the standard `gtag.js` snippet once in `fci_head_common()`.
  - Skips other hosts and `noindex` pages.
  - Reports in its fetch headers that it has the ID, so we can show "Live".
- **White-label:** the snippet only references googletagmanager.com.
- **Docs:** a verify step (GA4 Realtime / DebugView).

**Out of scope (optional in the issue, or not decided):**
- A Google Tag Manager container ID. C shows it as "Later".
- Sharing GA property access with the advisor.
- Pages outside `/insights`.
- WordPress and article-list analytics.
- Consent banners.
- Any privacy copy.
- GA reporting inside FC.

## 7. Mobile
Each direction has a Phone view:
- Card header buttons wrap under the title.
- The field and Save stack, with Save full width.
- The status line wraps.
- The collapsed sections stay collapsed.

## 8. Estimate
- **A1 or A2:** about 2.5–3 days in total (no change from the first A; it's a lighter row instead of a card):
  - 0.75–1 day of UI.
  - 0.25–0.5 day for storage and validation.
  - 0.75–1 day for renderer 1.3 and the API field ("live" detection, skip rules).
  - 0.5 day of tests and staging QA (including GA Realtime on a test property).
- **B:** about the same, 2.5–3 days.
- **C:** about 3–3.5 days (the extra card structure and the "Later" rows).

## 9. Open questions for Alex
1. **"Every page" vs Insights pages.** The issue says every page of the static site, but FC only builds the `<head>` for `/insights` pages. For the rest of the site, should we:
   - (a) keep it to Insights pages (as mocked),
   - (b) also show a copy-paste snippet for their other pages, or
   - (c) inject it on publish for sites FTT hosts (the #601 pilot)?
2. **The issue's "on save or publish".** With PHP, a change applies within the 15-minute cache with no publish step. Is that OK?
3. **Tag Manager.** Should a GTM container ID be in v1 (as an alternative field), or later?
4. **Privacy/consent.** Do we need any consent wording or a banner? The mock leaves a placeholder only.
5. **GA access.** Should advisors get read access to the GA property, or do we share reports the way we do for WordPress? Who owns the property?
6. **Other methods.** In A1 and A2 the setting stays visible but dimmed when PHP isn't the method. Is that OK, or should it be hidden?
7. **A1 or A2?** I recommend A2.

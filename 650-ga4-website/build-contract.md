# #650 Google Analytics (GA4) on Settings > Website: build contract

**Status:** Designer-first mock with generic sample data (example.com, `G-ABC1234XYZ`, advisor ID `abc123`). **Not agent-ready. Soft Dev hold until Alex picks.**
**Scope:** Content Library → Website → **Settings** (`imports/ui/WebsiteSettings.jsx`, `components/website-publishing/PhpServerSettingsPanel.jsx`) and the PHP renderer (`private/php-renderer/insights/lib.php`, `fci_head_common()`), as on staging at `e50f1db`. #644 "PHP on your server" **has landed** on staging: it's the third method card (Direction A), and the renderer is at version 1.2.

Mocks: [hub](index.html) · [Today](today.html) · [A, compact card (recommended)](a-ga-card.html) · [B, inside the PHP card](b-in-php-card.html) · [C, Tracking & analytics card](c-tracking-card.html). Every page has a **Desktop / Phone** toggle (a 390px frame). Add `?phone` to the URL to open it in phone view.

## 1. Where the tag goes (matching the issue)
The issue asks for GA4 `gtag.js` in the `<head>` of every page, added once from a shared include or template partial, and skipped on preview/staging hosts and `noindex` pages.

For static sites, the pages FC controls are the **Insights pages**: the PHP renderer builds one shared `<head>` for `/insights` and every `/insights/<slug>` in `fci_head_common()`. The mock puts the snippet there once. It's skipped when the request host isn't the saved website, and on pages that carry `noindex` (the error and not-found pages already do).

The advisor's own header and footer files and the rest of their static pages **aren't touched** (see open question 1).

## 2. Recommendation
**A: a compact "Google Analytics" card below the method cards.** It has one field, Save and a status line. It's always in the same place, it greys out when PHP isn't the method, and it's the cheapest.
- **B** (step 4 inside the PHP card) ties analytics to the PHP setup, but it's buried in a long panel and disappears for other methods.
- **C** (a "Tracking & analytics" card) leaves room for Tag Manager and future tags. It's slightly more UI, and the extra rows would be empty for now.

## 3. Screen (A)
**Card header:** "Google Analytics", then one line: "Paste your GA4 Measurement ID to track visits to your Insights pages."

**Field and button:**
- Field: **Measurement ID** (placeholder `G-XXXXXXXXXX`). It trims and uppercases on blur.
- **[Save]** is enabled only when the value has changed and is valid.

**Status line (one line):**
- Not set up
- Saved, waiting
- Tracking (live)
- Folder update needed
- Not available for this method

**Collapsed sections:**
- "Where do I find my ID?": Admin → Data streams → your website → Measurement ID.
- "Developer details": where the tag goes, the skip rules, white-label, how to check (GA4 Realtime / DebugView).

**Placeholder box:** privacy or cookie-consent wording, **not written**. It needs Alex or compliance.

**Remove:** a link in the status line, with a confirm.

## 4. States
| State | Field | Status line / message |
|---|---|---|
| Empty | blank, Save disabled | "Not set up. Visits aren't tracked yet." |
| Invalid ID | red border, Save disabled | Not G-: "That doesn't look like a GA4 ID. It starts with G-, like G-ABC1234XYZ." UA-: "That's an old Universal Analytics ID. Paste your GA4 ID instead. It starts with G-." GTM-: "That's a Tag Manager ID. Paste your GA4 Measurement ID. It starts with G-." |
| Saved (waiting) | `G-ABC1234XYZ` | Toast: "Saved. Tracking starts on your Insights pages within 15 minutes." Line: "Saved. Waiting for your site to pick it up (up to 15 minutes). Remove" |
| Live | `G-ABC1234XYZ` | "Tracking on example.com/insights. Your site picked it up 3 min ago. Remove" (shown after the first renderer fetch on version 1.3+ following the save) |
| Folder update needed | `G-ABC1234XYZ` | "Update your insights folder to turn this on. Your site runs version 1.2; analytics needs 1.3. Download the update" |
| Method not static/PHP | disabled, blank | A: "Available when you publish with PHP on your server." (greyed out). B: hidden (it lives in the PHP card). C: same as A. |
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
- **A:** about 2.5–3 days in total:
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
6. **Other methods.** Should the card be shown greyed out (A/C) or hidden (B) when PHP isn't the method?

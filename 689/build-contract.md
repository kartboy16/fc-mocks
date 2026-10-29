# #689 Advisor brand colours on calculators: build contract

Issue: [#689](https://github.com/kartboy16/content-library/issues/689). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Today (read-only, at `6499dd7`)

- **Colour setting:** the only colour advisors can set is `primaryColour` (default `#1976d2`). Its picker sits in the advisor setup **Customize & Deploy** step (`imports/ui/AdvisorConfigManager.jsx`, under the custom CSS box).
  - It's used for the article-list embed buttons (`server/api/embed.js`) and the Website hub. **It isn't used for calculators.**
- **Company Branding** step: logo, Company Name, Tagline, Disclaimer. **No colour.**
- **Admin "Edit advisor"** (`imports/ui/AdminUserEdit.jsx`): profile fields, profile photo and company logo. **No colour**, and no record of who changed what.
- **Calculators:** all 53 live calculators use the same two colours, main `#1F4E5F` and accent `#4A90A4`. Charts use them too. These live in the post content, not in the repo.
- **Serving:** `server/api/html-post-serve.js` serves `/html-post/:id`.
  - It wraps the HTML and adds a resize script.
  - It records a view when `?advisorId=` is present.
  - It sends `Cache-Control: no-store`.
  - **It doesn't read the advisor's settings.**
- **Surfaces:** every one already passes `advisorId`: WordPress embeds, the embed API, the FC post page, email links and the compliance PDF link (`server/website-compliance-pdf.js`).
- **Report name and logo:** these come from `?advisor=` and `?logo=` (`imports/utils/htmlPostFrameSrc.js`, which uses `safeCalculatorDisplayName` so emails are never shown). Only new links have them (PR #412), so older embeds print "your advisor" with no logo.

## Recommendation: A, a Brand colours card inside Company Branding

- **[A](directions/a-branding-card.html)** adds a **Brand colours** card under the logo in Company Branding:
  - On/off switch, main colour, and an optional accent.
  - Plain-words contrast messages.
  - A live **before/after** preview of a calculator and its chart.

  The old picker in Customize & Deploy becomes a pointer ("Brand colour has moved… Edit in Company Branding"). Colour sits next to the logo, which is where advisors look for it, and the issue asks for it there. It's the smallest UI change.
- **[B](directions/b-calculator-look.html):** a separate **Calculator look** section with a gallery of 4 calculators, plus a "Your colours / Standard teal" switch. Company Branding links to it.
  - Pros: a richer preview.
  - Cons: colour lives away from the logo, even though the same colour also drives the article list. It's one more place to find.
- **[C](directions/c-from-logo.html):** same as A, plus **colours suggested from the logo** (swatches, with click for main and shift-click for accent) and a manual override.
  - Pros: friendly, and gives good first picks.
  - Cons: extraction is unreliable for single-colour, tiny or transparent logos, and it's about 1.5–2 extra days.
  - It could be added to A later.

## Screens and states

### 1. Company Branding › Brand colours (A; the same fields appear in B and C)

| State | What shows |
|---|---|
| `off` | The switch is off: "Brand colours are off. Calculators use the standard teal #1f4e5f." Both preview columns are teal. |
| `good` | "✓ Looks good. White text is easy to read on #6a1b9a (contrast 9.4:1)." The right-hand preview is purple, and the chart uses purple plus a lighter shade. |
| `light` (auto-darkened) | "⚠ This main colour is a bit light for white text. We'll automatically use a darker shade of it: #f4c430 → #846507." The preview uses the darker shade. |
| `unusable` (fallback) | "⚠ This colour is too light to use, even darker. Calculators will keep the standard teal #1f4e5f. Try a deeper colour." The preview stays teal. |
| default blue | "#1976d2 is the app's default blue, not a brand colour, so we ignore it. Calculators stay in the standard teal until you pick your own colour." |
| `saved` | "✓ Saved Oct 29, 2026, 11:40 AM PT. Calculators pick it up the next time they load." |
| invalid code | "That isn't a colour code. Use a 6-digit code like #6a1b9a." |

- **Switch:** "Use my brand colours on calculators". Help text: "Calculators on your website, emails and reports, charts included."
- **Main colour:** a colour picker plus a hex field ("Headers, buttons, results").
- **Accent:** a tickbox, "Add an accent colour (optional). Without one we use a lighter shade of the main colour." The accent ("Second chart colour, highlights") gets its own message: "a bit light for chart bars… darker shade", or a fallback to the standard accent.
- **Explainer:** "Why a colour might change: calculators put white text on your main colour, so it has to be dark enough to read. If it's a bit light, we use a darker shade of it automatically. If it's far too light, calculators keep the standard teal. The app's default blue (#1976d2) isn't treated as a brand colour, so it's ignored."
- **Shared-use note:** "Your main colour is also used for your article list buttons (it was the 'Primary Colour' in Customize & Deploy)."
- **Preview:** "Today: standard teal" next to "With your colours". It updates on every input and covers the header, button, result, chart and report link.
- **Customize & Deploy** (`?v=deploy`): the old picker is replaced by a pointer box: "🎨 **Brand colour has moved.** Your brand colour is now in Company Branding. It's used for your article list and your calculators. Current colour: ■ #…", with an **Edit in Company Branding** button.

C adds:
- **Logo states:** `detecting`, `found` ("We found these colours in your logo…", with a suggested main and accent), `nologo` ("Upload a logo and we'll suggest colours from it") and `failed` ("We couldn't read colours from this logo… Pick your own below").
- **Manual override** is always available.

### 2. Admin › Edit advisor ([admin-edit-advisor.html](admin-edit-advisor.html))

- The same switch and fields, worded for staff ("Use this advisor's brand colours on calculators"), the same messages, and the same preview.
- A **last-changed note** (`?who=`):
  - "Last changed by **Jane Advisor** in Company Branding, Oct 28, 2026, 3:12 PM PT."
  - "Last changed by **Pat Staff** (staff) here in Edit advisor… The advisor sees 'Updated by FC support' in Company Branding."
  - "Never set. Calculators use the standard teal."
  - "Carried over from the old Customize & Deploy 'Primary Colour'… Switch left off until someone turns it on."
- An "Unsaved changes" chip, and Save changes.

### 3. Sample calculator and report ([calculator-report.html](calculator-report.html))

- **Calculator** (`?v=calc`): a Retirement savings calculator (example data: age 40, retire at 65, $50,000 saved, $500 a month, 5%), shown in standard teal and with brand colours side by side. It has a colour input so you can try any colour.
- **Report** (`?v=report`): a letter-size report page for each colour scheme.
  - **After:** "Prepared by Jane Advisor · Your Firm Name · jane@example.com · 604-555-0100", the placeholder logo, the inputs table, the result block, the chart, and a **PLACEHOLDER** disclaimer.
  - **Today** (`&rep=today`): "Prepared by your advisor", with no logo.
  - **Print or save as PDF** uses a print stylesheet, so only the report pages print, one page each.
- Every figure is **example data**. The logo is a generic placeholder, and the disclaimer is a marked placeholder. Nothing client-facing links to FC's own domain.

## In and out of scope

- **In:**
  - Colour fields (switch, accent) and moving the picker into Company Branding.
  - The Customize & Deploy pointer.
  - Admin fields and audit.
  - Server-side colour injection on `/html-post/:id?advisorId=`, including charts.
  - Contrast, darkening and fallback.
  - Server-side fill of the report name and logo for older links.
  - Migration and tests.
- **Out:**
  - Editing any calculator post or the 336 template links.
  - Colours in the URL.
  - Per-advisor calculator copies.
  - Fonts or other theme settings.
  - Theming non-calculator posts.
  - Logo colour extraction (unless C is picked).
  - Any wording on legal meaning (the report disclaimer stays as the calculator has it).

## Mobile (390px)

- The settings card and preview stack into one column, with the preview below the fields.
- The before/after calculators stack.
- The colour input and hex field stay on one row.
- Report pages become full-width cards.
- In B, the gallery turns into a single column.

## Build note

1. **Storage** on `advisor_configs`:
   - Keep `primaryColour` as the **main colour**. It's the existing field and still drives the article list, so there's no duplicate.
   - Add `calculatorColoursEnabled: Boolean` (default `false`) and `accentColour: String|null`.
   - Add audit fields: `brandColoursUpdatedAt`, `brandColoursUpdatedBy` (userId), and `brandColoursUpdatedVia` (`'company-branding'|'admin'|'migration'`).
   - Add the new fields to the `Match` schemas (lines 264 and 357), `toPublicAdvisorConfig` if the client needs them, and the AdminUserEdit save method.
2. **Validation:**
   - Accept only `#rgb` or `#rrggbb`, normalised to lowercase `#rrggbb`. Reject anything else on the server.
   - Treat `#1976d2` (any case) as **not set**.
   - Because only that pattern can reach the page, injection is safe.
3. **Contrast** (WCAG 2.x relative luminance):
   - The main colour must be **at least 4.5:1 against white** (white text on headers and buttons).
   - The accent must be **at least 3:1 against white** (chart bars and highlights, which are non-text, on a white page).
4. **Auto-darken:**
   - Convert to HSL and lower lightness by **5 points per step, for up to 6 steps** (30 points). Keep hue and saturation. The first step that passes wins.
   - If none pass, **fall back**: main to `#1F4E5F`, accent to `#4A90A4`.
   - With no accent set, use the main colour mixed 35% with white, darkened to 3:1, otherwise the main colour itself.
   - Results: `#f4c430` becomes `#846507` after 6 steps, and `#fdf3dc` falls back to teal.
   - Use one shared util (`imports/utils/brandColours.js`) on the client (messages and preview) and the server (injection), with unit tests covering the cases above.
5. **Injection** (`html-post-serve.js`):
   - When `advisorId` is present, load the advisor's config. If it's enabled and resolves, inject at the **top of `<head>`**, before any calculator script, `<style id="advisor-brand">:root{--…main:#..;--…accent:#..}</style>` plus `<script>window.__ADVISOR_BRAND={main:'#..',accent:'#..'}</script>`.
   - **To confirm in the post content:** how the 53 calculators read their two colours (CSS variables, or JS constants for Chart.js).
     - If they're hard-coded hex values, the fallback is a server-side, case-insensitive replace of `#1F4E5F` and `#4A90A4` in the served HTML only. The stored post is never edited.
   - Off, missing, invalid or default blue: serve the HTML **exactly as today**, byte for byte apart from the resize script. Add a test for that.
6. **Report name and logo:**
   - When `advisorId` is present but `?advisor=` or `?logo=` is missing, the server fills them from the config: the name through `safeCalculatorDisplayName` (never an email), and the logo from `companyLogoUpload` as an absolute URL.
   - Do this by injecting `window.__ADVISOR_REPORT={name,logo}` and having the calculators' existing query reader fall back to it, or by rewriting `location.search` before the scripts run. Pick whichever the calculators' code allows.
   - Values from the URL still win.
7. **What picks it up:** all 53 calculators and their charts, on every surface that goes through `/html-post/:id?advisorId=`: WordPress embeds, the embed API, the FC post page, email links and the compliance PDF link. The printed or PDF report uses the page's colours, because it's printed from the same page.
8. **Caching:**
   - `/html-post` stays `no-store`.
   - Cache the colour and name lookup per `advisorId` in memory for about 60 seconds, and clear that entry on save. A change shows on the next load.
   - WordPress page caches only hold the iframe tag, not the calculator HTML, so they aren't affected.
9. **Migration:**
   - Nothing to copy: existing `primaryColour` values become the main colour.
   - Values equal to `#1976d2` count as unset.
   - Set `calculatorColoursEnabled: false` for everyone, so no live calculator changes until the advisor or staff turns it on (open question).
   - Write `brandColoursUpdatedVia: 'migration'` for anyone who has a non-default colour.
10. **Customize & Deploy:** remove the `<input type="color">` and show the pointer box with the current swatch and a link to the Company Branding step.

## Estimate (days)

| Piece | A | B | C |
|---|---|---|---|
| Colour util (validate, contrast, darken, fallback, ignore the default blue) and tests | 0.5–0.75 | 0.5–0.75 | 0.5–0.75 |
| Schema fields, audit, migration | 0.5–0.75 | 0.5–0.75 | 0.5–0.75 |
| Server injection in `html-post-serve.js` and lookup cache | 1–1.5 | 1–1.5 | 1–1.5 |
| Confirm how the 53 calculators and charts read colours, plus the replace fallback | 1–2 | 1–2 | 1–2 |
| Report name and logo server fill | 1–1.5 | 1–1.5 | 1–1.5 |
| Settings UI and live preview | 1.5–2 (card) | 2–2.5 (section and gallery) | 1.5–2 (card) |
| Logo colour extraction and swatches | — | — | 1.5–2 |
| Customize & Deploy pointer | 0.25 | 0.25 | 0.25 |
| Admin Edit advisor fields and last-changed note | 0.75–1 | 0.75–1 | 0.75–1 |
| QA on staging (all 5 surfaces, print or PDF, off-path unchanged) | 1–1.5 | 1–1.5 | 1–1.5 |
| **Total** | **≈7.5–11.25** | **≈8–11.75** | **≈9–13.25** |

## Open questions

1. **Default for existing advisors:** should brand colours be off until turned on (as mocked), or on for anyone who already chose a non-default `primaryColour`?
2. Should the article list keep using the main colour, or should it get its own setting later?
3. Are 4.5:1 for the main colour and 3:1 for the accent the right bar? Should we allow a dark main colour with dark text instead of white?
4. Is the darkening limit right (up to 30 points of lightness), or should we fall back sooner so colours stay recognisable?
5. How do the 53 calculators read their colours (CSS variables or JS)? Is the hex-replace fallback acceptable?
6. Should advisors see "Updated by FC support" when staff change their colours, or the staff member's name?
7. Should the report logo use `companyLogoUpload` or a separate report logo? What should it do with very wide or very tall logos?
8. Should colours also apply to infographics and other posts later?
9. C: is logo colour suggestion worth about 1.5–2 days now, or should it come later?
10. The compliance PDF links to `/html-post` on the app's own domain. Is that acceptable (staff-facing), or should it be white-labelled too?
11. A, B or C?

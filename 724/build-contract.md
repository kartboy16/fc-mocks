# #724 No-click branding at signup (onboarding step 1 of 5): build contract

For [#724](https://github.com/kartboy16/content-library/issues/724). Mocks: [hub](index.html), [today](today.html), [A](a-inline.html), [B](b-preview.html). **Not agent-ready. Soft Dev hold until a direction is picked.**

## Today (read-only, main `14c9cce`)

- **Screen:** Settings › **Branding & contact** (`AccountSettingsHub.jsx`, which renders `AdvisorConfigManager` with `brandingHubOnly`). It has Profile & Contact (name, email, phone, website, office, CTA, social links) and Company Branding: logo upload (`companyLogoUpload`), Company Name, Tagline and Disclaimer.
- **Brand colours card** (`components/BrandColoursCard.jsx`, #689): "Use my brand colours on calculators" (`calculatorColoursEnabled`), **Main colour** (`primaryColour`), an optional accent (`accentColour`), a mini calculator preview, and an audit line from `brandColoursUpdatedAt/By/Via` (`via` is `company-branding | admin | migration`).
- `utils/brandColours.js` already has `darkenToContrast` (4.5:1 for white text on the main colour, 3:1 for the accent) and the standard colours `STANDARD_MAIN #1f4e5f` and `STANDARD_ACCENT #4a90a4`. `server/api/advisor-brand-lookup.js` serves calculator branding, with a cache.
- **Signup:** `advisor_configs` is created on first login (`LoginPage.ensureAdvisorConfig`, `server/oauth-config.js` `onCreateUser`). There's no brand lookup, no heading, text or background colour, and no fonts.
- "Changes save automatically" (no Save button).

## Directions

- **A. Slim banner + inline source badges ([a-inline.html](a-inline.html), recommended):** the banner shows on first landing. Branding & contact gets a **Brand source** line (source, version, Refresh from website, Reset all to auto). Every field has a small badge: **Auto from example-firm.ca**, **From uploaded logo**, **Standard** or **Edited by you**, and an edited field has **Reset to auto**.
- **B. Banner + brand preview and summary ([b-preview.html](b-preview.html)):** the same banner. The fields sit on the left, with only an **Edited** marker on fields the advisor changed. On the right are a **Brand preview** (a sample site header, heading, body text, button and calculator in their colours and fonts) and a **"Where your brand came from"** summary, grouped by source with Reset to auto, version, Refresh and Reset all.
- C (a compact Brand card on an onboarding dashboard, with a drawer) was dropped. Onboarding steps 2–5 and the dashboard don't exist yet, so it would mean designing a new surface first. It can be added when step 2 is designed.

## Screens and states (`?v=landing|brand&st=…&why=free|dealer|timeout&bn=on|off`, `&phone`)

| State | Banner (first landing; advisor-facing) | Branding & contact |
|---|---|---|
| `loading` (lookup in progress) | Spinner: "Setting up your brand from **example-firm.ca**…" with no Undo | A spinner line and skeleton fields. Signup never waits on it. |
| `auto` (success) | "✓ We set up your brand from **example-firm.ca**. Change anytime." with **Undo** and × (Change anytime links to Branding & contact) | Logo, logo URL, name, the 4 colours and 2 fonts, each **Auto from example-firm.ca**. A: "Darkened a little so white text stays readable." under the accent when the readability check changed it. |
| `logo` (from an uploaded logo, node-vibrant) | "✓ We set up your brand colours from your logo. Change anytime." with **Undo** | The colours are **From uploaded logo**, the fonts are Standard, and the logo and name are the advisor's. |
| `undone` (after Undo) | "Brand reverted. Your logo, colours and fonts are back to the standard look." with **Redo**. Toast: "Brand reverted". | Every auto-set field goes back to its value before the auto run: Standard for a new signup, or the previous values for a backfill. The name typed at signup stays. |
| `fallback`, `why=free` or `dealer` | "We started you with a standard look. Add your logo to use your own colours. Change anytime." with **Add your logo**. It doesn't mention free mail or the dealer. | All fields are **Standard**. Upload logo. |
| `fallback`, `why=timeout` (or a fetch error) | "We couldn't read **example-firm.ca** in time, so we started you with a standard look. Change anytime." with **Try again** | Standard, same as above. Try again re-runs the lookup (back to `loading`). |
| `edited` | (none) | Changing a colour auto-saves. Toast: "Saved. Accent colour is now yours, and refreshes won't change it." The field shows **Edited by you** with **Reset to auto** (A), or the **Edited** marker plus a summary row (B). The source becomes "Auto from example-firm.ca, 1 field edited by you", version 3. |
| `kept` (re-run or auto-refresh later) | (none) | "✓ Refreshed from example-firm.ca. Kept your Accent colour." Every auto field is updated. The edited accent is **unchanged**, version 4. |
| Empty | — | An advisor with no website and a free email is the `fallback` / `free` state. |

- **Undo** is one step and reverts only the fields that the auto run set. **Redo** re-applies the same saved result; it doesn't fetch again.
- The banner shows once, on first landing after the lookup finishes. It stays until it's dismissed or Undo/Redo is used. In the mock, × hides it (`bn=off`).
- **"FTT defaults"** is internal wording only (admin and this contract). Advisors see **"Standard"** or "the standard look".
- There's no FC domain on any advisor-facing surface. The logo and domain shown are the advisor's own.

## Data fields (`advisor_configs`)

| Field | Notes |
|---|---|
| `brandAccentColour` | **Proposed: reuse `primaryColour`** (Main colour), so calculators and article buttons keep working (see open question 1). |
| `brandHeadingColour`, `brandTextColour`, `brandBackgroundColour` | New, hex. |
| `brandLogoUrl` | New. It's the absolute URL of the logo found on the site. An uploaded logo stays in `companyLogoUpload`, which wins when present. |
| `brandTitleFont`, `brandBodyFont` | New. A name from a supported list. An unsupported site font maps to the nearest supported one. |
| `companyName` | Existing. It's only filled by auto when empty, so the name typed at signup wins. |
| `brandSource` | `auto-site` / `auto-logo` / `defaults` / `manual`, for the record as a whole. |
| `brandFieldSources` | `{ field: 'auto-site' / 'auto-logo' / 'defaults' / 'manual' }`, which drives the badges and the precedence. |
| `brandVersion`, `brandUpdatedAt`, `brandUpdatedVia` | Version goes up by 1 on every saved change. `via` adds `auto-signup`, `auto-backfill`, `auto-refresh` and `undo` to today's `company-branding`, `admin` and `migration`. |
| `brandAutoResult`, `brandPrevValues` | The last auto result (for Redo) and the values before the last auto run (for Undo). |
| `brandLookup` | `{ status: pending / done / fallback / timeout / error, domain, reason: free / dealer / timeout / error / no-site, at }` |

- **Shared brand style sheet:** one endpoint or helper serves CSS custom properties (`--brand-accent`, `--brand-heading`, `--brand-text`, `--brand-bg`, `--brand-title-font`, `--brand-body-font`, `--brand-logo`), building on `advisor-brand-lookup` and its cache. Calculators, html-post injection and the embed use it, so calculator brand links are no longer built by hand. The cache is cleared on every brand save.

## Precedence (manual > auto)

1. A field with `brandFieldSources[field] === 'manual'` is **never** written by signup auto, backfill, Refresh or any future auto-refresh. This also covers fields set by staff in admin Edit advisor.
2. Any save from the Branding & contact screen or admin marks that field `manual`.
3. **Reset to auto** (one field) re-applies the stored auto value and source. **Reset all to auto** does that for every field.
4. Auto fills gaps with defaults. The readability check (the existing `darkenToContrast`) runs on auto values before saving. Manual values aren't changed, but the existing card message still warns about them.
5. Backfill is the same function with `via: auto-backfill`. It only runs when the advisor has `websiteAddress`, skips `manual` fields, and is safe to re-run (same input, same output, so the version doesn't move).

## Free and dealer domain lists

- Kept as two constant lists in one module (`utils/brandDomains.js`), with the free and dealer lists from #724. The match is on the email domain, or any parent domain (for example `mail.example.ca` matches `example.ca`).
- A match gets defaults straight away, with no fetch. Admin can see the reason (`brandLookup.reason`).
- Staff extend the lists through a code change, for now (see open questions).

## Lookup (server, background)

- Triggered after signup or first login. It never blocks signup. Hard cap of about 20 s overall; any failure gives `fallback` / `timeout`.
- The site is the email domain, or `websiteAddress` when it's set. It reads the HTML: `og:image`, `apple-touch-icon` or the logo `<img>` for the logo, `theme-color` and the most-used CSS colours for colours, `font-family` for fonts, and `og:site_name` for the name.
- An uploaded logo uses **node-vibrant** to get the colours.
- Gaps are filled with defaults, then the readability check runs, then the result auto-saves with no Accept step.

## In scope

- The new fields, the source and version, the shared style sheet, the lookup job (site and logo), the domain lists, readability, fallback, auto-save, the banner with Undo/Redo, the badges or marker, Reset to auto (per field and all), Refresh from website, the backfill script, admin visibility of source and reason, and the phone layout.

## Out of scope

- Onboarding steps 2–5 and an onboarding dashboard (direction C).
- Dealer-specific brand kits (dealer emails get the standard look).
- Paid or self-hosted font files (the supported font list only).
- Brand kits for reveal.js decks (later).
- Any **legal or consent copy** about reading the advisor's site. If one is needed it's a **PLACEHOLDER**, not invented here.
- Changes to the Mailing & compliance or Billing tabs.

## Mobile (390px)

- The banner text wraps, and Undo, Redo, Try again and Add your logo are 44px buttons.
- Colour and font fields go one per row, and the logo preview goes full width.
- A: badges wrap under the label, and the Brand source buttons go full width.
- B: the preview and summary stack under the fields.

## Estimate (agent time, per Alex's Oct 30 rule)

This is the Cursor cloud agent build plus FC Tester time, plus fix loops, in minutes and hours. For calibration, #699 took about 30 min from handoff to tested. It's split into **3 runs**.

| Run | Covers | Build | FC Tester | Fix loops | Total |
|---|---|---|---|---|---|
| 1. Data, precedence and style sheet | New fields, `brandFieldSources`, version, the manual-wins helper with tests, the shared CSS-variables style sheet wired into calculators, html-post and embed, cache bust | 45–60 min | 15–20 min | 15–30 min | **≈1.25–1.75 h** |
| 2. Lookup, fallback and backfill | Domain lists, site fetch and parse, node-vibrant from logo, 20 s cap, readability, fill gaps, auto-save, `brandLookup` status, Try again, the idempotent backfill script | 60–90 min | 25–35 min (test sites, free, dealer, timeout) | 30–60 min | **≈2–3 h** |
| 3A. UI for A | Banner (all states), Undo/Redo, Brand source line, per-field badges, Reset to auto and Reset all, Refresh, new colour and font fields, phone | 40–60 min | 20–30 min | 15–30 min | **≈1.25–2 h** |
| 3B. UI for B (instead of 3A) | As 3A, but the Edited marker instead of badges, plus the live Brand preview and source summary panel | 55–75 min | 25–35 min | 20–40 min | **≈1.75–2.5 h** |
| **Total A** | | | | | **≈4.5–6.75 h** |
| **Total B** | | | | | **≈5–7.25 h** |

- **Order:** run 1 first. Runs 2 and 3 can then go in parallel (3 uses stored or stubbed results). That's about **3.25–4.75 h of wall-clock time** for A, or 3.75–5.25 h for B.
- **Test dependency (not in the total):** test domains with known logos, colours and fonts, one slow site for the timeout, a free-mail and a dealer-domain test signup, and a test advisor with a website on file for backfill. No real advisor data.

## Recommendation: A

- It adds to the screen advisors already use, and every field says where its value came from right where they'd change it. That makes "manual wins" easy to see.
- It's about 30 min less agent time than B and needs no new preview component. The existing mini calculator in the Brand colours card already gives a preview.
- B's live preview is nicer for a first impression. It can be added later on top of A without changing the data.

## Open questions

1. **Accent vs Main colour:** is the new "Accent colour" the existing **Main colour** (`primaryColour`, used by calculators and article buttons), with the old optional `accentColour` kept as a secondary? The mock assumes yes.
2. Should auto-branding also switch on **"Use my brand colours on calculators"** (`calculatorColoursEnabled`) for no-click? The mock assumes yes when auto succeeds.
3. How long does **Undo** stay available: until the banner is dismissed (as mocked), 7 days, or always as "Reset to standard"?
4. Should **Refresh from website** be a button only (as mocked), or also a scheduled auto-refresh (for example monthly)? Either way, manual fields are kept.
5. **Fonts:** which supported list (web-safe plus a few Google fonts)? A site font outside the list maps to the nearest one.
6. Should staff be able to edit the **free and dealer lists** in admin, or are they code-only for now?
7. Is any **consent or legal line** needed about reading the advisor's public website and logo? If so, the wording is needed from compliance (placeholder).

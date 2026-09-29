# Build contract · Infographic builder (in-house)

> **PROVISIONAL** — Recommend Direction A. Not locked. No GitHub issue number yet. Do **not** mark agent-ready; Soft Dev confirms feasibility later. This is the design recommendation first.

**Recommend:** Direction A — In-house template-driven builder in FC (content-library Meteor/React) as a first-class **Create Infographic** flow.

**Track:** Designer-first · publish under `/infographic-builder/`.

## One-liner

Let advisors create branded infographics **inside FC** from HTML/SVG templates, apply the brand kit (logo, colours, fonts, contact footer), rasterize to PNG, save to the library, and insert into email — Canva optional for one-offs only.

## Architecture recommendation

| Stance | Detail |
| --- | --- |
| **Where it lives** | In-house in FC, next to library / email — not a separate design tool. |
| **Generate model** | Template-driven: HTML/SVG layouts → rasterize PNG for social/email. **Do not** recolour finished Canva JPEGs as the primary path. |
| **Brand kit** | Logo + contact from existing Settings & Branding; **primary/secondary hex + heading/body fonts are NEW** (scout found no hex/font theme today). |
| **Publish** | Lands in library; insert via existing **Insert infographic**. |
| **Canva** | Optional escape hatch (upload) for one-offs — not the default. |
| **Compliance** | Treat generated PNGs like other library assets (open Q: same approval queue as posts?). |

## Brand kit fields

| Field | Source today | Provisional |
| --- | --- | --- |
| Logo | Settings & Branding (ships) | Reuse |
| Contact footer (name, phone, disclosure stub) | Settings / contact (ships) | Reuse |
| Primary colour (hex) | **Not found** | **NEW** — Settings & Branding and/or builder (open Q) |
| Secondary colour (hex) | **Not found** | **NEW** |
| Font headings / body | **Not found** | **NEW** — e.g. Inter/system pair |

## Recommended UI (Direction A)

1. **Library entry** — Create → Infographic (or Infographics tab) in FC chrome.
2. **Pick template** — FC-native starters: Stat card, Tips list, Quote/insight.
3. **Fill content** — Headline, body/stats, tips (plain editable fields).
4. **Brand kit** — Apply colours, font, logo, contact; live preview.
5. **Export / publish** — Save to library · Insert into email · optional Download PNG.
6. **Missing brand empty-state** — “Add company logo / colours in Settings & Branding.”

## Acceptance criteria (provisional)

- [ ] **AC-1:** Advisor can start Create Infographic from library without leaving FC.
- [ ] **AC-2:** ≥3 FC-native templates render as branded assets (not Canva-generic).
- [ ] **AC-3:** Content fields editable; sample copy stays educational / non-advice.
- [ ] **AC-4:** Brand kit (logo, primary, secondary, font, contact) updates live preview.
- [ ] **AC-5:** Export saves PNG to library and supports Insert into email.
- [ ] **AC-6:** Empty state when logo/colours missing → Settings & Branding.
- [ ] **AC-7:** Canva/upload remains available as optional one-off path.

## In scope

- Template-driven HTML/SVG → PNG generate inside FC
- Brand kit apply (reuse logo/contact; new colours/fonts)
- Save to library + Insert into email
- Missing-brand empty state
- Canva upload as escape hatch only

## Out of scope / non-goals

- Full Canva competitor / freeform design canvas in v1
- White-label of the whole FC app
- Recolouring finished JPEG uploads as the primary path
- Firm-level custom template authoring (unless product later says yes — open Q)

## Open product questions (do not invent lock)

1. Brand colours/fonts: new Settings & Branding fields vs only inside the builder?
2. Who authors templates — FC admin only?
3. Output sizes: square vs story vs email widths?
4. Does generated PNG go through compliance approval like posts?

## Alternatives (not recommended)

- **B — Canva-first + brand stamp:** Status quo+. No real colour/font theming. Weak for agencies keeping FC.
- **C — External FC Studio:** Separate micro-app + API brand sync. Extra login friction; wrong for this ICP.

## Reference

[Hub](index.html) · [Direction A](directions/a/) · [B](directions/b/) · [C](directions/c/) · Live: https://kartboy16.github.io/fc-mocks/infographic-builder/

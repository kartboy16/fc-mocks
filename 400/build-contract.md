# Build contract · #400 Infographic library: upload/manage + insert + branding

**PROVISIONAL.** One recommended direction (AFA-aligned library + positioner + Email/Social insert). **Alex has not locked.**

**Soft Dev hold · Designer-first · not agent-ready.** Soft Dev not woken. Do **not** mark `agent-ready`. No content-library / Meteor work until Alex locks and the Pages URL is on the issue.

Issue: https://github.com/kartboy16/content-library/issues/400

## One-liner
Advisors upload and manage their own infographics (JPG / PNG / PDF), place logo/card + footer on each (AFA-style positioner), then insert from that library into Email Campaigns and Social.

## Recommend
**Single polished flow (no A/B/C fork):**
1. **Manage** — dropzone + My Infographics grid (rename / delete / replace / preview / Set branding); empty state CTA.
2. **Positioner** — modal “Position the business card and footer” (AFA `post_infographic_setup`): card None / Full Card / Logo Only (default Logo Only); footer None or field-order presets; paper Letter / A4 / Custom; draggable card (x,y snap 5px) and footer (y-only). After upload or via Set branding.
3. **Email insert** — compose toolbar “Insert infographic” → same library picker → preview in body + caption/alt; Manage library link.
4. **Social insert** — “Choose from infographics” beside upload → same picker → image slot with remove/replace.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/400/
- Manage: https://kartboy16.github.io/fc-mocks/400/manage/
- Positioner: https://kartboy16.github.io/fc-mocks/400/positioner/
- Email insert: https://kartboy16.github.io/fc-mocks/400/email-insert/
- Social insert: https://kartboy16.github.io/fc-mocks/400/social-insert/

## Acceptance criteria (provisional · not locked)
- **AC-1:** Upload area accepts JPG / PNG / PDF (flag open if FC restricts types). Owner can remove.
- **AC-2:** My Infographics grid shows thumbnail, title, date; actions: rename, delete (confirm), replace, preview, Set branding.
- **AC-3:** Empty state: clear “Upload your first infographic” CTA.
- **AC-4:** Positioner modal after upload or Set branding: business card type, footer type, paper size, draggable placement with AFA-like defaults (card ~700,0; footer Y ~1330 on Letter ~1054×1364).
- **AC-5:** Placement saved with the infographic; card/footer/paper remembered as default branding (plain advisor copy). Confirm whether FC mirrors AFA’s dual save (content + AdvisorPreferences).
- **AC-6:** Footer email uses display email (fallback account email) — same idea as #393; show “Email shown: …”.
- **AC-7:** Email Campaigns compose: Insert infographic → library picker (search + grid) → inserted preview + caption/alt; Manage library link.
- **AC-8:** Social compose image attach: Choose from infographics → same picker → fills image slot; remove/replace.
- **AC-9:** Plain advisor-facing copy (no CDN / GridFS / stack jargon in UI).
- **AC-10:** Not #288; do not build AI/zero-click builder.

## Open decisions for Alex
1. Per-infographic placement vs preference defaults (AFA saves both — confirm for FC)
2. Include PDF upload? (AFA yes; mock assumes yes)
3. Logo Only vs Full Card default? (AFA Logo Only; mock assumes that)
4. Where Manage lives in nav (upload area / Settings / own Infographics item)
5. Firm-shared vs per-advisor library
6. Insert v1: Email + Social only, or Website/posts too?
7. Max file size / dimensions guidance in upload UI?

## Non-goals
- #288 AI / zero-click infographic builder (`288/`, `infographic-builder/`)
- In-FC graphic editing / Canva replacement
- Agent-ready / Soft Dev wake until Alex locks + Pages URL on issue
- Fictional advisor only (Jordan Blake · Pacific Ridge Wealth) — never Alex Hung / Angelina Hung as rows

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex lock + answers to open decisions.

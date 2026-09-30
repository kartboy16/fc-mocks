# Build contract · #288 Zero-click AI infographic

> **PROVISIONAL** — Recommend Direction A. Not locked. Soft Dev **hold**. Enhancement only. Do **not** mark agent-ready until Alex (and Angelina if looping) lock a direction and attach the Pages mock URL.

**Recommend:** Direction A — Prompt / voice / Pick for me → Generating → finished branded infographic; Use · Regenerate · Tweak copy (text only).

**Track:** Idea / playground → Designer-first. Soft Dev hold until lock. **Not** agent-ready.

## One-liner

Advisor expresses intent once (typed prompt, voice, or “Pick for me”). AI returns a **finished firm-branded infographic** in one shot. Primary actions after: **Use**, **Regenerate**, **Tweak copy** (text-only panel). No canvas, layers, template wizard, or advisor-facing model picker. Replaces the clicky `/infographic-builder/` happy path.

## Recommended UI (Direction A)

- **Entry:** Content Library → AI tools / Create → **Create Infographic** (one surface).
- **Step chips:** Prompt · Generating · Result (optional Tweak copy).
- **Prompt surface:** large prompt field + voice + **Pick for me** suggestion chips. No template grid.
- **Generating:** calm progress (“Writing layout… Applying your brand… Rendering…”).
- **Result:** polished branded graphic (logo, colours, disclaimer) + **Use** · **Regenerate** · **Tweak copy**.
- **Tweak copy:** text-only panel (headline / stats / disclaimer). No visual editor.
- **Brand:** firm brand kit applied automatically (mock uses Financial Tech Tools / financialtechtools.ca teal).
- **Compliance:** optional “Ready for Greenlight” note — not a blocker in the flow.
- **Models:** GPT Image 2 default / Nano Banana Pro alt — **product plumbing only**; never show advisors a model picker.

## Acceptance criteria

- [ ] **AC-1:** Advisor can go from intent → usable branded infographic with **zero structural clicks** (prompt / voice / one CTA only).
- [ ] **AC-2:** No drag-drop canvas, layer panel, or multi-step template wizard in the happy path.
- [ ] **AC-3:** Optional regenerate / text tweak only; mock makes clear model choice is product plumbing (not advisor-facing).
- [ ] **AC-4:** Clickable HTML mock on GitHub Pages (`fc-mocks/288/`) + short build contract.
- [ ] **AC-5:** Entry points from Content Library / AI tools / create-post called out.

## Build recommendations (provisional)

| Topic | Provisional stance |
| --- | --- |
| Happy path | Direction A one-shot generate |
| Brand | Auto-apply firm brand kit (logo + colours + contact) |
| Tweak | Text-only; re-render after apply |
| Models | Product-side default/alt; no advisor picker |
| Greenlight | Optional note / handoff — not a required step |
| Soft Dev | **HOLD** until direction lock |
| Agent-ready | **DO NOT APPLY** |

## Screens / states (Direction A)

| Screen | Purpose |
| --- | --- |
| Prompt | Intent capture (type / voice / Pick for me) |
| Generating | Calm progress with brand-aware copy |
| Result | Finished graphic + Use / Regenerate / Tweak copy |
| Tweak copy | Text-only panel → re-render |

## In scope

- Zero-click AI generate happy path (Dir A)
- Alt B (chat) and C (from post) for comparison
- Brand applied on result; Greenlight note optional
- Replace clicky builder as primary happy path

## Out of scope / non-goals

- NG-1: Shipping model API wiring in the mock
- NG-2: Full HeyGen / video avatar (#55)
- NG-3: Auto-merge / Soft Dev build until direction lock
- Advisor-facing model picker
- Canvas / layers / template wizard in happy path

## Open product questions (do not invent lock)

1. Where does **Use** land by default — library draft, social compose, or email insert?
2. Is Greenlight always shown, firm-gated, or advisor-opt-in?
3. Voice input: browser speech vs later native?
4. Pick for me: firm calendar topics vs advisor history vs library trending?

## Alternatives (not recommended as primary)

- **B — Chat-threaded:** Strong for iteration; weaker first-run clarity for 50s–60s advisors.
- **C — From post CTA:** Excellent companion entry; not the primary Create Infographic surface.
- **Old clicky builder** (`/infographic-builder/`): Contrast only — #288 replaces that happy path.

## Reference

[Hub](index.html) · [Direction A](directions/a/) · [B](directions/b/) · [C](directions/c/) · [Directions brief](directions-brief.md) · [Issue #288](https://github.com/kartboy16/content-library/issues/288) · Reporter: Alex Hung

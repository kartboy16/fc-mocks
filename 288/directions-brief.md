# #288 Directions brief — Zero-click AI infographic

> **Mocks only / Idea · playground.** Comparison for Alex / Angelina / Soft Dev / CoS — not a locked build contract. Working default = **Direction A**. Soft Dev **hold**. Do **not** mark agent-ready from this mock.

**Issue:** [content-library #288](https://github.com/kartboy16/content-library/issues/288)  
**Mocks:** https://kartboy16.github.io/fc-mocks/288/  
**Recommend (Designer):** Direction A — Prompt → Generate → Result  
**Replaces:** Clicky happy path in [`/infographic-builder/`](../infographic-builder/) (kept for contrast only)

---

## Shared context

| | |
|---|---|
| **Track** | Idea / playground — Soft Dev hold — **not** agent-ready |
| **North star** | **NO CLICKS** — AI generates the infographic |
| **Audience** | Advisors 50s–60s + assistants 30s–40s — large type, plain words |
| **Brand** | Firm kit auto-applied (mock: Financial Tech Tools / financialtechtools.ca) |
| **Models** | Product-side only (GPT Image 2 default; Nano Banana Pro alt) — **no advisor picker** |
| **Out of scope** | Canvas/layers wizard; model API in mock; HeyGen (#55); Soft Dev build until lock |

---

## Direction A — Prompt → Generate → Result *(recommend)*

**Thesis:** One Create Infographic surface. Advisor types, speaks, or taps Pick for me. Calm generating. Finished branded graphic. Use · Regenerate · Tweak copy (text only). Zero structural clicks after intent.

**Why recommend:** Matches Alex-locked NO CLICKS north star. Clearest first-run for less tech-savvy advisors. One mental model. Chat (B) and from-post (C) can layer later as companions.

**Screens:** Prompt · Generating · Result · optional Tweak copy

**Tradeoff:** Less freeform iteration than chat; regenerate / tweak covers most needs without a canvas.

**Live:** https://kartboy16.github.io/fc-mocks/288/directions/a/

---

## Direction B — Chat-threaded iteration

**Thesis:** Same zero-canvas rule, but the surface is a chat thread. Advisor: “make RRSP contribution limits graphic.” AI returns the image inline + follow-up chips. Regenerate via chat (“make the numbers bigger”).

**Screens:** Chat thread with image bubbles · follow-up suggestions · Use / Regenerate via message

**Tradeoff:** Strong for power tweakers and assistants who already chat with AI tools. Weaker first-run clarity; easier to feel “open-ended” for 50s–60s advisors. Still zero canvas clicks.

**Live:** https://kartboy16.github.io/fc-mocks/288/directions/b/

---

## Direction C — From existing library post / topic

**Thesis:** On a library post card or compose, one CTA **Make infographic**. AI uses the post’s topic / title / body as the brief → auto result with same Use / Regenerate / Tweak.

**Screens:** Library browse with CTA on card · Generating · Result (same as A)

**Tradeoff:** Excellent companion entry (AC-5). Not enough alone as the primary Create Infographic path when the advisor has no existing post.

**Live:** https://kartboy16.github.io/fc-mocks/288/directions/c/

---

## Comparison

| | A Prompt→Result | B Chat | C From post |
|---|---|---|---|
| Structural clicks after intent | **0** | 0 (chat turns OK) | 0 after CTA |
| First-run clarity (50s–60s) | **Best** | Medium | Good if post exists |
| Iteration | Regenerate + tweak copy | Chat follow-ups | Same as A |
| Canvas / layers | None | None | None |
| Primary Create surface | **Yes** | Alt | Companion |
| Recommend | **Yes** | No (alt) | No (alt / companion) |

---

## Why A wins

1. Alex locked **NO CLICKS** — A is the shortest path from intent to finished asset.
2. Audience fit: one big prompt, one big result, three plain buttons.
3. B and C remain valid companions once A ships; they do not replace A as the primary Create Infographic happy path.
4. Old clicky builder stays on Pages for contrast — #288 **replaces** that happy path, does not expand it.

---

## Soft Dev / agent-ready

- Soft Dev: **HOLD** until direction lock.
- Labels: enhancement / Idea playground only.
- **Do not** apply `agent-ready` from these mocks.

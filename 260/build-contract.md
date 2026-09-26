# Build contract · #260 My Media Library + compose media *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex/Angelina lock  
**Issue:** [content-library #260](https://github.com/kartboy16/content-library/issues/260)  
**Mocks:** https://kartboy16.github.io/fc-mocks/260/  
**Track:** Idea / playground (not staging/main)

## One-liner

Advisors get a **My Media Library** (drawer-first in Direction A) to browse/reuse prior image/video uploads, **pick from library** on Post Now / social compose, **upload** via picker or drop (into library and/or compose), with **#162-compliant** drag-over-only indicators and clear empty/loading/error/remove — until product locks otherwise.

## Acceptance criteria (refined from issue)

- **AC-1:** Advisors have a clear **My Media Library** (or equivalent) where previously uploaded images/videos live and can be browsed.
- **AC-2:** From Social Media create/edit (Post Now / compose), user can **pick from My Media Library** to attach media to a draft.
- **AC-3:** User can **upload** (file picker and/or drag-drop) into the library and/or directly onto the social compose surface; unsupported types show a clear error.
- **AC-4:** Drag-drop affordance on social compose is discoverable for images and videos (**consistent with #162:** no permanent giant drop panel when idle). If staging still feels hard to find, prefer **hint / tooltip / media-toolbar copy** — do not reinvent #153.
- **AC-5:** Empty / loading / error states for the library are designed; remove or replace attached media before schedule/publish.
- **AC-6:** Clickable HTML mock on GitHub Pages (`fc-mocks/260/`) + short build contract before `agent-ready`.

## Open product questions (must resolve before agent-ready)

1. Library scoped **per advisor only** vs firm-shared later?  
2. **Video size / format limits** copy?  
3. Does **upload-to-compose also auto-add** to My Media?  
4. Staging: is #153/#162 drag-drop actually findable, or only a **discoverability polish**?

Do not invent locked answers in implementation until product confirms.

## Working default (Direction A)

Until lock:

- **Primary surface:** My Media **drawer/modal** from Post Now media toolbar (“My Media” / “Library”)
- **Compose:** Idle = no giant drop zone; drag-over = overlay indicator (#162)
- **Discoverability:** Compact hint near media icon — “Drop image or video, or open My Media.”
- **Secondary:** Lightweight **Library** nav entry for browse/manage
- **Scope:** Advisor’s own uploads (per-advisor thesis — still open Q)
- **Non-goals:** Full DAM / team folders / permissions v1 (**NG-1**); AI image drawer (**NG-2**); live social publish (**NG-3**)

Directions B (page-first + coachmark) and C (compact rail) remain comparison mocks.

## States

| State | Required behavior |
|---|---|
| Compose idle | Media toolbar + hint; **no** permanent giant drop panel |
| Compose drag-over | Clear drop overlay for image/video only while dragging |
| Library browse (populated) | Grid of prior uploads; select to attach |
| Library empty | Empty copy + Upload / drop CTA |
| Library loading | Skeleton or spinner |
| Upload into library | File picker and/or drop into library surface |
| Pick → attached | Draft shows attachment; remove / replace works |
| Unsupported type | Clear error (toast or inline) |
| Discoverability gap | Note / hint if #153/#162 still hard to find on staging |

## In scope (provisional)

- My Media Library browse + upload (advisor-scoped default)  
- Pick from library on Post Now / social compose  
- Compose drag-over indicator (#162) + discoverability polish (hint/tooltip/copy)  
- Empty / loading / error / success (attach/remove) states  
- Desktop-first advisor chrome (~1280)

## Out of scope

- Full DAM / team shared assets / folders / permissions v1 (**flag NG DAM**)  
- AI image generation / Create AI image drawer changes  
- Live publish to Facebook / LinkedIn / Instagram during playground  
- Auto-merge to main / marking `agent-ready` from mock work  
- Re-speccing #153 wholesale  

## Desktop vs mobile

| | |
|---|---|
| **Desktop** | Primary design target (~1280); drawer / page / rail as mocked |
| **Mobile** | Brief note only — library likely full-screen sheet; drag-drop less primary (picker-first). Full mobile polish TBD after direction lock |

## Primary files *(guessed — TBD until codebase confirmed)*

Flag as **TBD** — confirm in content-library before implementation:

- Post Now / social compose media toolbar (**TBD**)  
- New My Media Library route or drawer component (**TBD**)  
- Media upload / attach helpers already used by #153/#162 (**TBD**)  
- Asset list API / storage for advisor uploads (**TBD**)

## Reference links

- Hub: https://kartboy16.github.io/fc-mocks/260/  
- Direction A: https://kartboy16.github.io/fc-mocks/260/directions/a/  
- Directions brief: [directions-brief.md](directions-brief.md)  
- Issue: https://github.com/kartboy16/content-library/issues/260  
- Related: #153 · #162

## Handoff

Provisional contract only. Parent / CoS posts Slack and GitHub updates. Do **not** mark agent-ready until Alex/Angelina pick a direction and confirm open questions.

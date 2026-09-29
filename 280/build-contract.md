# Build contract · #280 Dual-license advisor profiles *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex/Angelina lock  
**Issue:** [content-library #280](https://github.com/kartboy16/content-library/issues/280)  
**Mocks:** https://kartboy16.github.io/fc-mocks/280/  
**Track:** Idea / playground (not staging/main) · Designer-first

## One-liner

Dual-licensed advisors keep **one login** with three **branding kits** — Investments, Insurance, and Both (two logo slots). A clear **Working as** switcher drives compose/preview logos; missing logos show an empty state with a path to Profile; send confirms which kit applies. **Not** #209 Advisor Categories / affiliation.

## Recommend

**Direction A — License contexts on one advisor.** Both-logos path is an explicit third kit (not invent-at-send).

- **B** (separate profiles): hard isolation; **NG-1** seat/confusion risk — do not imply billing/seats rework.
- **C** (send-time checkboxes): smallest change; easy to forget; no sticky mode for browsing.

## Acceptance criteria (draft)

- **AC-1:** Clear investments vs insurance context (and/or combined both path) without wrong branding.
- **AC-2:** Designed path for sends needing both logos.
- **AC-3:** Logos assignable per profile/context; empty/missing logo states designed.
- **AC-4:** Obvious switcher in advisor UI; admin setup if ownership says so.
- **AC-5:** Pages mock + this provisional contract before `agent-ready`.

## Open product questions (must resolve before agent-ready)

1. Firm **admin** vs advisor **self-serve** for kits?  
2. Does **“Both”** need its own disclosures or concatenate Inv+Ins?  
3. Seat billing if Direction B (flag **NG-1**)?  
4. Does context switch also **filter library content** (#261 Source) or only branding?  
5. Website vs email vs social — **same kit switcher** everywhere?

Do not invent locked answers in implementation until product confirms.

## Working default (Direction A)

Until lock:

| Surface | Behavior |
|---|---|
| Firm admin | Enable Dual-licensed; attach / overview kits |
| Advisor profile | Three kits: Investments · Insurance · Both; dealer/MGA name + logo + disclosure stubs |
| App chrome | **Working as: {kit} ▾** switcher |
| Compose / preview | Active kit logos only; Both shows two logos |
| Missing logo | Empty state + “Add logo in Profile” |
| Send | Confirm strip naming active kit |

## States

| State | Required behavior |
|---|---|
| Admin dual-license off | Single kit / current single-logo behavior |
| Admin dual-license on | Kits overview; advisor can use switcher |
| Kit ready | Logo present; preview shows it |
| Kit missing logo | Empty preview slot + guided CTA |
| Switch mid-session | Preview updates; no leftover wrong logo |
| Send confirm | Strip shows which kit applies |

## In scope (provisional)

- Branding kits / license contexts on one advisor (Dir A default)  
- Switcher + compose/preview + missing-logo + send confirm  
- Admin enable dual-license stub  
- Comparison mocks B and C  
- #209 boundary callout  

## Out of scope

- **NG-1:** Billing / seats rework (flag if B implies seats)  
- **NG-2:** Live social/email/WP publish during playground  
- **NG-3:** Auto-merge to main / marking `agent-ready` from mock work  
- Advisor Categories / AdvisorSource (#209)  
- Content Source taxonomy (#261) unless product ties kit switch to library filter  

## Desktop vs mobile

| | |
|---|---|
| **Desktop** | Primary (~1280); switcher in top chrome; kit cards |
| **Mobile** | Brief note — switcher may collapse to sheet; polish after direction lock |

## Primary files *(guessed — TBD)*

Flag as **TBD** — confirm in content-library before implementation:

- Advisor profile / branding settings (**TBD**)  
- Compose / preview chrome (**TBD**)  
- Firm admin advisor config (**TBD**)  

## Reference

- Hub: https://kartboy16.github.io/fc-mocks/280/  
- Dir A: https://kartboy16.github.io/fc-mocks/280/directions/a/  
- Dir B: https://kartboy16.github.io/fc-mocks/280/directions/b/  
- Dir C: https://kartboy16.github.io/fc-mocks/280/directions/c/  
- Issue: https://github.com/kartboy16/content-library/issues/280  
- Related: #209 (not this) · #261 (content Source — open Q if kit filters library)

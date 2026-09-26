# Build contract · #261 Content Source + topic taxonomy *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex/Angelina lock  
**Issue:** [content-library #261](https://github.com/kartboy16/content-library/issues/261)  
**Mocks:** https://kartboy16.github.io/fc-mocks/261/  
**Track:** Idea / playground (not staging/main)

## One-liner

Content library posts get a first-class **Source** (carrier / FTT / FECBC / Other) **and** topic/product via **Master Categories**, with advisor **dual-facet filters** (AND, no Source×Topic mega-list), admin **Manage Sources** + Manage Categories, post edit Source + topics, and a recommended **Visibility: Advisor-only** flag — until product locks otherwise. **Not** #209 Advisor Categories. **Not** #260 My Media.

## Acceptance criteria (refined)

- **AC-1:** Content posts can be labeled with a **Source** (carrier / Financial Tech Tools / FECBC / Other — exact list open Q) independent of topic Master Categories.
- **AC-2:** Advisors can **browse/filter** the content library by Source **and** by topic/product with **independent facets** (AND logic); empty filter state is clear; no combinatorial Source×Topic mega-list.
- **AC-3:** Admins can **manage Sources** (CRUD or fixed enum — open Q) and continue to **manage topic Categories**; density mirrors existing Manage Categories.
- **AC-4:** Post / content **edit** assigns Source (single) + topics (multi) and surfaces **Advisor-only** (and group-benefits) as visibility flag **and/or** special category — mock shows both; recommend flag.
- **AC-5:** Advisor-only / gated content has a clear **labeled or gated** advisor-facing state; hub and directions include a **“not Advisor Categories (#209)”** callout.
- **AC-6:** Clickable HTML mock on GitHub Pages (`fc-mocks/261/`) + this provisional contract before `agent-ready`.

## Open product questions (must resolve before agent-ready)

1. Exact **Source list** — fixed enum vs admin-managed CRUD?  
2. **Advisor-only** = visibility flag vs category?  
3. Who edits Sources — **firm admin** vs **FC admin**?  
4. **Backfill** historical posts? (**Follow-up** — not v1)

Do not invent locked answers in implementation until product confirms.

## Working default (Direction A)

Until lock:

- **Schema:** First-class Source field + existing Master Categories (topics)
- **Advisor browse:** Source chips + Topic chips, AND, active-filter chips pattern (#243/#244)
- **Admin:** Manage Sources (simple CRUD, mirror Manage Categories) + Manage Categories (topics)
- **Post edit:** Source select + category multi-select + **Visibility: Advisor-only** flag (recommended over stuffing into topics)
- **Non-goals:** Full ontology rewrite (**NG-1**); historical backfill in v1 (**NG-2**, flag follow-up); live publish during playground (**NG-3**); #209 AdvisorSource changes (**NG-4**); #260 My Media (**NG-5**)

Directions B (grouped Master Categories) and C (Source hubs + All-sources escape) remain comparison mocks.

## States

| State | Required behavior |
|---|---|
| Advisor browse (populated) | Dual facets; cards show Source badge + topic tags |
| Filter empty | Clear empty copy + Clear filters CTA |
| Loading | Skeleton or spinner on library grid |
| Error | Inline / toast load failure |
| Post edit | Source + topics + advisor-only flag |
| Manage Sources | List + add/edit/archive stubs |
| Manage Categories | Existing topics admin + reuse callout |
| Advisor-only gated/labeled | Badge and/or restricted browse state |
| #209 callout | Explicit distinction on hub + directions |

## In scope (provisional)

- Content Source labeling + topic Master Categories  
- Advisor dual-facet (or sectioned / hub) browse filters  
- Admin Manage Sources (or grouped type column in B)  
- Post edit Source + topics + visibility affordance  
- Empty / loading / error notes; desktop-first (~1280)  
- #209 / #260 boundary callouts  

## Out of scope

- Full ontology rewrite / taxonomy migration tooling in v1  
- **Historical backfill** of existing posts (**flag follow-up**)  
- Live publish / staging cutover during playground  
- Changes to Advisor Categories / AdvisorSource (#209)  
- My Media Library (#260)  
- Auto-merge to main / marking `agent-ready` from mock work  

## Desktop vs mobile

| | |
|---|---|
| **Desktop** | Primary design target (~1280); dual chip facets, admin tables as mocked |
| **Mobile** | Brief note only — facets likely collapse to sheets / stacked filters; full mobile polish TBD after direction lock |

## Primary files *(guessed — TBD until codebase confirmed)*

Flag as **TBD** — confirm in content-library before implementation:

- Content / post model + edit form (**TBD**)  
- Master Categories admin (existing Manage Categories) (**TBD**)  
- New Manage Sources admin (Direction A) or type column on Categories (B) (**TBD**)  
- Advisor content library browse + active filter chips (**TBD**; related #240 / #243 / #244)  
- Visibility / advisor-only flag on post (**TBD**)

## Backfill follow-up

Historical posts without Source / topics are **out of v1**. Track a follow-up once Source list and ownership (firm vs FC admin) are locked.

## Reference links

- Hub: https://kartboy16.github.io/fc-mocks/261/  
- Direction A: https://kartboy16.github.io/fc-mocks/261/directions/a/  
- Directions brief: [directions-brief.md](directions-brief.md)  
- Issue: https://github.com/kartboy16/content-library/issues/261  
- Related: #209 (do not confuse) · #240 · #243/#244 · #260 (separate)

## Handoff

Provisional contract only. Parent / CoS posts Slack and GitHub updates. Do **not** mark agent-ready until Alex/Angelina pick a direction and confirm open questions. Do **not** wake Software developer from this mock alone.

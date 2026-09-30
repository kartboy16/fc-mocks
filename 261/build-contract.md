# Build contract · #261 Content Source + topic taxonomy *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex/Angelina lock  
**Issue:** [content-library #261](https://github.com/kartboy16/content-library/issues/261)  
**Mocks:** https://kartboy16.github.io/fc-mocks/261/  
**Track:** Idea / playground (not staging/main)

## One-liner

Content library posts get a first-class **Source** (FTT / FSB / **Carriers** rollup) **and** topic/product via **Master Categories** (7 Topics) **and** **Type** (3rd facet), with advisor **triple-facet filters** (AND), admin **Manage Sources** (exactly 3 rows) + Manage Categories + Manage Types, post edit Source + topics + Type, and a recommended **Visibility: Advisor-only** flag. Dropped FECBC / PPI / Ghostwritten. **Not** #209 Advisor Categories. **Not** #260 My Media.

## Acceptance criteria (refined)

- **AC-1:** Content posts can be labeled with a **Source** (FTT · FSB · Carriers — Carriers is one Source; 14 carrier names are nested detail / browse sub-picks, not separate Manage Sources rows) independent of Topics and Type.
- **AC-2:** Advisors can **browse/filter** by Source **and** Topic **and** Type with **independent facets** (AND logic); Carriers chip may expand to carrier sub-picks; empty filter state is clear; no combinatorial mega-list.
- **AC-3:** Admins can **manage Sources** (exactly **3 rows**: FTT · FSB · Carriers; CRUD vs enum still open Q), **Manage Categories** (Topics), and **Manage Types**; density mirrors existing Manage Categories.
- **AC-4:** Post / content **edit** assigns Source (single · FTT/FSB/or a Carrier under rollup) + Topics (multi · 7) + **Type** + **Advisor-only** visibility flag (recommended over stuffing into topics).
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

Directions B (grouped), C (Source hubs), and D (sidebar browse synthesizing Advisorstream + HeyAdvisor) remain comparison mocks.

### A · FC look (hi-fi view — not a new direction)

`directions/a-fc/` is an FC-fidelity view of **Direction A** for Angelina lock-list review. **Axes:** Source × Topic × Type AND · Manage Sources (**3 rows only**) + Manage Categories (Topics) + Manage Types · Advisor-only visibility flag. **Locked lists:** Topics (7) · Sources FTT/FSB/Carriers · Type (7) · Advisor-only = flag. Soft Dev playground PASS — hold main · not agent-ready. Audiences: **both**, advisor browse primary. Live: https://kartboy16.github.io/fc-mocks/261/directions/a-fc/



### Competitor refs + product choice (2026-09-29)

- **Advisorstream:** Sources · Publishers · Topics · Date/Saved → map Sources+Publishers to **Source**; Topics to Master Categories; Date/Saved optional later.
- **HeyAdvisor Library:** Life Events (radio) · Topics (multi) · Sharing · Type; no Source facet; active chips + Life Event tags on cards. Type/Sharing = optional follow-ups.
- **Product choice before agent-ready (do not invent a lock):**
  1. **Recommend v1:** Source + Topic only (Direction A).
  2. **Optional:** Source + Topic + Life Events if HeyAdvisor-style browse is desired (D explores; not locked).

## States

| State | Required behavior |
|---|---|
| Advisor browse (populated) | Dual facets; cards show Source badge + topic tags |
| Filter empty | Clear empty copy + Clear filters CTA |
| Loading | Skeleton or spinner on library grid |
| Error | Inline / toast load failure |
| Post edit | Source + topics + advisor-only flag |
| Manage Sources | **3 rows only** (FTT · FSB · Carriers) + nested carrier note; add/edit/archive stubs |
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
- Locking Life Events / Sharing as v1 without product decision (Type locked as 3rd facet for a-fc review)  

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
- Direction A · FC look (primary): https://kartboy16.github.io/fc-mocks/261/directions/a-fc/  
- Direction A (abstract): https://kartboy16.github.io/fc-mocks/261/directions/a/  
- Direction D: https://kartboy16.github.io/fc-mocks/261/directions/d/  
- Directions brief: [directions-brief.md](directions-brief.md)  
- Issue: https://github.com/kartboy16/content-library/issues/261  
- Related: #209 (do not confuse) · #240 · #243/#244 · #260 (separate)

## Handoff

Provisional contract only. Parent / CoS posts Slack and GitHub updates. Do **not** mark agent-ready until Alex/Angelina pick a direction and confirm open questions. Do **not** wake Software developer from this mock alone.

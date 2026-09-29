# #261 Directions brief — Content Source + topic taxonomy

> **Mocks only / Idea · playground.** Comparison for Alex / Angelina / Software / CoS — not a locked build contract. Working default = **Direction A** until product locks. Do not mark agent-ready from this mock.

**Issue:** [content-library #261](https://github.com/kartboy16/content-library/issues/261)  
**Mocks:** https://kartboy16.github.io/fc-mocks/261/  
**Recommend (Designer):** Direction A — Dual-facet filters (Source × Topic)  
**Not:** Advisor Categories / AdvisorSource ([#209](https://github.com/kartboy16/content-library/issues/209) closed) · My Media Library (#260 — separate)

---

## Open product questions (all directions)

Do **not** invent locked answers. Surface on hub + every direction.

1. Exact **Source list** — fixed enum vs admin-managed CRUD?
2. **Advisor-only** (and group-benefits sell) = **visibility flag** vs special category?
3. Who edits Sources — **firm admin** vs **FC admin**?
4. **Backfill** historical posts with Source + topics? (follow-up, not v1)

---

## Shared context

| | |
|---|---|
| **Track** | Idea / playground — **not** staging/main |
| **Ask** | Angelina: categorize by source (insurance/investment company, FTT, FECBC) **and** by topic/product (retirement, group benefits, advisor-only sell, etc.) (#fc-bugs `1790459762.463569`) |
| **Existing** | **Manage Categories** = MasterCategories / topic tags (sibling of Manage Advisor Categories) |
| **#209** | AdvisorSource affiliation — **do not confuse** with content Source |
| **Related UX** | Choose Services (#240), active-filters chips (#243/#244) — reuse filter patterns; avoid combo-list explosion |
| **Audience** | **Admin** labels + **advisor** browse/filter (specify per screen) |
| **Out of scope** | Full ontology rewrite / historical backfill in v1; live publish during playground; agent-ready from mock |

---


---

## Competitor references (2026-09-29 · Angelina)

| Ref | Pattern | Mapping to #261 |
|---|---|---|
| **Advisorstream** | Sidebar: Most Popular · Favorites · **Sources** (partner logos) · **Publishers** (media brands) · **Topics** (long alpha mix) · Date · Saved Searches | Sources + Publishers → our **Source** facet; Topics → Master Categories; Date/Saved = **optional later** |
| **HeyAdvisor Library** | Filter by: **Life Events** (radio/single) · **Topics** (multi checkboxes) · Sharing Options · Type; active chips + Clear all; Life Event colored tags on cards; **no Source facet** | Life Events = optional third axis; Topics ↔ Master Categories; Type / Sharing = **optional follow-ups** |

### Product choice before agent-ready *(do not invent a lock)*

1. **Recommend for v1:** **Source + Topic only** — Direction A dual-facet. Matches Angelina ask; clearest model.
2. **Optional:** **Source + Topic + Life Events** if product wants HeyAdvisor-style browse (Life Events radio as third axis). Direction D synthesizes both competitor sidebars for comparison only.

---
## Direction A — Dual-facet filters *(recommend)*

**Thesis:** First-class **Source** field separate from **Master Categories** (topics). Dual-facet chips AND. Logo/avatar chips can echo Advisorstream Sources without becoming a sidebar. Callout: their Sources · Publishers · Topics map to our two facets so cross-source topic search stays easy; Date/Saved later. Life Events (HeyAdvisor) = open product Q — not required on A. Admin Manage Sources + Manage Categories; Visibility: Advisor-only flag recommended.

**Screens:** Advisor browse (populated) · Filter empty · Post edit (Source + topics + flag) · Manage Sources · Manage Categories · Advisor-only gated/labeled · #209 distinction callout

**Tradeoff:** Clearest mental model (source ≠ topic). Slightly more schema/admin surface. Best default for browse + filter without Source×Topic explosion.

---

## Direction B — Source as Master Category group

**Thesis:** Reuse Master Categories with **grouped namespaces**. Echo Advisorstream **Sources vs Publishers** as two sections under Source group (still one content Source concept). Topics section separate. Sectioned chips — not a Source×Topic matrix. Less new schema; risk of mixing concepts.

**Screens:** Same must-haves; admin is one grouped Categories list; filters show Source section + Topic section

**Tradeoff:** Faster to ship on existing model; concepts can blur in admin and reporting. Good if product wants minimal schema change.

---

## Direction C — Browse by Source hubs

**Thesis:** Library home = **Source hubs** with logo tiles (Advisorstream Sources familiarity). Topic chips inside a hub. **All sources** + topic escape hatch. Browse-first like their sidebar; still weaker cross-source search than A — recommend stays A.

**Screens:** Same must-haves; hub home is the hero; escape hatch for cross-source topic search

**Tradeoff:** Best narrative for carrier/partner ownership; cross-source “retirement” browse needs the escape hatch or feels fragmented.

---


## Direction D — Sidebar browse *(alt · familiarity)*

**Thesis:** Advisorstream-inspired left rail **plus** HeyAdvisor Life Events (radio) + Topics (multi). **Keeps Source** section (HeyAdvisor has none) so D synthesizes both. Date / Saved / Type / Sharing = muted “Coming later”. Main pane: filtered cards with Life Event colored tags + active-filter chips (AND) so dual-facet isn’t abandoned. Under the hood still Source × Topic (+ optional Life Event).

**Screens:** Browse (sidebar) · Empty filter · Post edit · Manage Sources · #209 callout (thin stubs; don’t rebuild every admin screen)

**Tradeoff:** Highest competitor familiarity. Heavier chrome; Life Events as third axis is an open product choice. **Recommend stays A** for v1 Source+Topic clarity.

---
## Before → after (plain words)

| Today | After (any direction, once locked) |
|---|---|
| Topics via Manage Categories; no first-class content Source facet | Posts labeled by Source + topic(s) |
| Advisor browse hard to slice by carrier / FTT / FECBC | Independent Source + Topic filters (or hubs) |
| #209 AdvisorSource easy to confuse with content source | Explicit “not #209” callout; content taxonomy only |
| Advisor-only / group-benefits unclear as flag vs tag | Both options mocked; flag recommended in A |

---

## Clickable in mocks

- Direction step chips between the 7 must-have screens  
- Source / topic filter chips toggle (AND) + clear  
- Post edit Source select + multi-select topics + Visibility flag  
- Admin CRUD stubs (Sources / Categories)  
- Advisor-only gated/labeled state  
- #209 distinction callout  

---

## Recommendation

**Ship Direction A as working default** (Source + Topic) until Alex/Angelina lock. Keep B / C / D as comparison — D for Advisorstream + HeyAdvisor sidebar familiarity and the optional Life Events axis. Flag backfill, Type, Sharing, Date/Saved as follow-ups. Do not confuse with #209 or #260. **Not agent-ready.**

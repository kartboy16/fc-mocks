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

## Direction A — Dual-facet filters *(recommend)*

**Thesis:** First-class **Source** field (carrier / FTT / FECBC / Other) separate from **Master Categories** (topic/product). Advisor library browse: two independent filter facets (Source chips + Topic chips) — **AND** logic, no combinatorial mega-list. Admin: **Manage Sources** (simple CRUD, mirror Manage Categories density) + keep Manage Categories for topics. Post edit: Source select + category multi-select. Advisor-only / group-benefits = show both options; recommend a **Visibility: Advisor-only** flag separate from topic.

**Screens:** Advisor browse (populated) · Filter empty · Post edit (Source + topics + flag) · Manage Sources · Manage Categories · Advisor-only gated/labeled · #209 distinction callout

**Tradeoff:** Clearest mental model (source ≠ topic). Slightly more schema/admin surface. Best default for browse + filter without Source×Topic explosion.

---

## Direction B — Source as Master Category group

**Thesis:** Reuse Master Categories with **grouped namespaces** (Source group vs Topic group) — one admin list with type column, one filter UI with **sectioned chips**. Less new schema; risk of mixing concepts. Filters avoid explosion via sections, not a Source×Topic matrix.

**Screens:** Same must-haves; admin is one grouped Categories list; filters show Source section + Topic section

**Tradeoff:** Faster to ship on existing model; concepts can blur in admin and reporting. Good if product wants minimal schema change.

---

## Direction C — Browse by Source hubs

**Thesis:** Library home shows **Source hubs** (FTT / FECBC / Carriers…) then topic chips **inside** a hub. Admin still has Source + Categories. Strong for “whose content is this?”; weaker for cross-source topic search — include an **“All sources”** + topic filter escape hatch.

**Screens:** Same must-haves; hub home is the hero; escape hatch for cross-source topic search

**Tradeoff:** Best narrative for carrier/partner ownership; cross-source “retirement” browse needs the escape hatch or feels fragmented.

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

**Ship Direction A as working default** for playground demos until Alex/Angelina lock. Keep B (grouped categories) and C (source hubs) as comparison. Flag backfill as follow-up. Do not confuse with #209 or #260.

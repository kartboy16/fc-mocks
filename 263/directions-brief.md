# #263 Directions brief — Curate Master Categories (product | service kind)

> **Mocks only / Idea · playground.** Comparison for Alex / CoS / Software — not a locked build contract. Working default = **Direction A** until product locks. Do **not** mark agent-ready from this mock. Do **not** invent a second collection.

**Issue:** [content-library #263](https://github.com/kartboy16/content-library/issues/263)  
**Mocks:** https://kartboy16.github.io/fc-mocks/263/  
**Recommend (Designer):** Direction A — Dense table + Kind column  
**Product lock:** One collection `MasterCategories` only

---

## Shared context

| | |
|---|---|
| **Track** | Idea / playground — **not** staging/main / agent-ready |
| **Ask** | Alex / CoS: curate Master Categories — mark each as **product** or **service**, clean list so MAP Choose Services is trustworthy |
| **Today** | Admin Manage Categories = featured/visible only; MAP product vs service = **heuristic** (`PRODUCT_KIND_NEEDLES`), not stored |
| **MAP chrome** | Direction C row-anchored popover already live (#240) — **reuse**; feed Services / Products from **stored kind** |
| **Related** | #240 Choose Services · #261 Source+topic (separate) · #209 Advisor Categories (do not confuse) |
| **Out of scope** | New Mongo collection · changing `AdvisorConfigs.websiteServices` · #261 taxonomy · #209 AdvisorSource |

---

## Direction A — Dense table + Kind *(recommend)*

**Thesis:** Extend today’s Manage Categories table with a **Kind** column (segmented Product | Service), keep Featured + Visible toggles, add filter chips (All / Products / Services / Hidden / Unset), Hide/Remove for junk, Add category with **kind required**. Second screen: MAP Choose Services Direction-C popover with Services / Products sections from stored kind; note heuristic fallback only when kind unset (migration).

**Screens:** Admin Manage Categories (populated / empty / loading / error) · MAP Choose Services popover

**Tradeoff:** Lowest learning cost; best for bulk kind curation and ongoing admin. Matches existing AdminCategories density.

---

## Direction B — List + detail drawer

**Thesis:** Left filterable list, right detail drawer for kind / featured / visible / hide. Same MAP popover as A.

**Tradeoff:** Clearer single-row focus; slower for bulk kind assignment. Better if admins edit one category at a time.

---

## Direction C — Curate board

**Thesis:** Columns **Products | Services | Hidden/junk**. Drag or move between columns sets kind / visibility. Same MAP popover as A.

**Tradeoff:** Strong for one-time cleanup pass; weaker as day-to-day dense admin. Columns are **views**, not new collections.

---

## Before → after

| Today | After (once locked) |
|---|---|
| Kind = name heuristic only | Stored `kind: product \| service` on Master Category |
| Manage Categories: featured/visible | + kind control + filters + hide junk |
| MAP groups via needles | Groups prefer stored kind; heuristic if unset |
| Temptation: new products/services collection | **One** `MasterCategories` collection |

---

## Recommendation

**Ship Direction A as working default** for playground demos until Alex picks. Keep B and C as comparison. Provisional build contract covers A (AC-1…AC-5). Not agent-ready until lock.

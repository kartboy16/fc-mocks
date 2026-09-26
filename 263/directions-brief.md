# #263 Directions brief — Admin Type first, MAP preview only

> **Direction A LOCKED · Idea / playground.** Alex Hung locked Direction A on **2026-09-26 PT** (“263 looks good!”). This brief records the locked scope for CoS agent-ready review; do **not** add the `agent-ready` label from this mock. Do **not** invent a second collection.

**Issue:** [content-library #263](https://github.com/kartboy16/content-library/issues/263)
**Mocks:** https://kartboy16.github.io/fc-mocks/263/
**Locked direction:** **Direction A — dense table + Type column**
**Product lock:** One collection `MasterCategories` only

---

## Shared story

1. **Lead with Admin → Manage Categories.** This is the primary clickthrough and the place to set Type, filter, feature/visibility, and hide or clean up junk.
2. **Use Type in visible copy:** Product | Service. The implementation field is `kind` in the locked contract and technical notes.
3. **MAP Choose Services is a small secondary preview.** It shows how advisors will see Services / Products, grouped from the Admin-set Type. It is not a second app chrome, a second source of truth, or a place for advisors to edit Type.

| | |
|---|---|
| **Track** | Idea / playground — **not** staging/main / agent-ready |
| **Ask** | Admin curates `MasterCategories` Type and cleans the list so MAP grouping is trustworthy |
| **Today** | MAP product vs service is a name heuristic, not an Admin-curated field |
| **Source of truth** | Admin curates Type; MAP only groups from the stored value |
| **Related** | #240 Choose Services · #261 Source+topic (separate) · #209 Advisor Categories (do not confuse) |
| **Out of scope** | New collection · changing `AdvisorConfigs.websiteServices` · #261 taxonomy · #209 AdvisorSource |

---

## Direction A — Dense table + Type *(locked)*

**Thesis:** Extend today’s Admin → Manage Categories table with a **Type** column (Product | Service), keep Featured + Visible toggles, add filters (All / Products / Services / Hidden / Unset), Hide/Remove for junk, and require Type when adding a category. The secondary MAP tab is a compact “Advisor sees it like this” preview with Services / Products sections fed by stored Type.

**Screens:** Admin Manage Categories (populated / empty / loading / error) first · small MAP preview second

**Tradeoff:** Lowest learning cost; best for bulk Type curation and ongoing admin. Matches existing AdminCategories density.

---

## Direction B — List + detail drawer *(not chosen)*

**Thesis:** Left filterable list, right Admin detail drawer for Type / Featured / Visible / hide. Admin remains the primary surface; MAP is the same compact secondary preview as A and does not allow Type edits.

**Tradeoff:** Clearer single-row focus; slower for bulk Type assignment. Better if admins edit one category at a time.

---

## Direction C — Curate board *(not chosen)*

**Thesis:** Admin columns **Products | Services | Hidden/junk**. Drag or move between columns sets Type / visibility. MAP remains a compact secondary preview. Columns are views, not new collections.

**Tradeoff:** Strong for one-time cleanup; weaker as day-to-day dense admin. Direction A is locked.

---

## Before → after

| Today | After (once locked) |
|---|---|
| MAP uses name heuristics | Admin stores `kind: product \| service` on `MasterCategories` and visible UI calls it Type |
| Manage Categories: featured/visible | + Type control + filters + hide junk |
| MAP is a competing full surface | MAP is a small preview grouped from Admin-set Type |
| Temptation: new products/services collection | **One** `MasterCategories` collection |

---

## Recommendation

**Direction A is locked** for implementation: dense Admin table + Type, with MAP as a preview only. B and C are archived comparison mocks and were not chosen. The locked contract covers A. Handoff awaits CoS agent-ready review → Software developer.

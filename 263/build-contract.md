# Build contract · #263 Curate Master Categories (product|service kind) *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex locks  
**Issue:** [content-library #263](https://github.com/kartboy16/content-library/issues/263)  
**Mocks:** https://kartboy16.github.io/fc-mocks/263/  
**Track:** Idea / playground (not staging/main · **not agent-ready**)

## One-liner

Keep **one** `MasterCategories` collection. Add admin-settable **`kind: product | service`**, cleanup/hide junk, and update MAP Choose Services to group from **stored kind** (heuristic fallback only when unset during migration). Reuse Direction C row popover chrome (#240). Do **not** create a second collection.

## Acceptance criteria (from issue)

- **AC-1:** Master Category docs can store `kind: 'product' | 'service'`; Admin Categories can set/change it.
- **AC-2:** One-time or lazy migration: existing categories get a default kind (heuristic OK) so nothing blank-breaks MAP.
- **AC-3:** MAP Choose Services (popover/panel) groups and chips use stored `kind` when present.
- **AC-4:** Admin can hide/remove categories that should not appear as advisor products/services without breaking HTML-post tagging for categories that remain.
- **AC-5:** No second master collection; document that MasterCategories remains the source of truth.

## Working default (Direction A)

Until lock:

- **Admin:** Dense Manage Categories table + Kind segmented control + Featured/Visible + filter chips + Hide/Remove + Add with kind required
- **MAP:** Direction C row-anchored popover; Services / Products sections from stored kind; migration note when any unset
- **Schema:** `kind` on existing MasterCategories docs only
- **Non-goals:** New collection (**NG-1**); #261 Source+topic merge (**NG-2**); change `AdvisorConfigs.websiteServices` storage (**NG-3**); #209 AdvisorSource (**NG-4**); mark agent-ready from mock (**NG-5**)

Directions B (drawer) and C (board) remain comparison mocks.

## States

| State | Required behavior |
|---|---|
| Admin populated | Table with Kind / Featured / Visible; filters work |
| Admin empty | Clear empty + Add with kind required |
| Admin loading | Skeleton / spinner on table |
| Admin error | Inline error + Retry |
| Unset kind (migration) | Amber highlight; heuristic shown; settable |
| Hide / Remove junk | Hidden omitted from MAP checklist; remove confirms |
| MAP popover | Services + Products from stored kind; chips wrap (no +N) |
| MAP heuristic note | Visible only when some eligible cats lack kind |
| Success | Toast on save / kind change / hide |

## In scope (provisional)

- `kind` field + Admin UI (Direction A default)
- Cleanup hide/remove + filters by kind / hidden
- MAP Choose Services grouping from stored kind
- Migration path (heuristic default / fallback)
- Empty / loading / error / success notes
- Desktop-first (~1280); mobile note below

## Out of scope

- New Mongo collection for products/services  
- #261 Content Source + topic taxonomy  
- Changing `AdvisorConfigs.websiteServices` storage  
- Advisor Categories / AdvisorSource (#209)  
- Galaxy / playground app deploy from this mock  
- Auto `agent-ready` / waking Software developer from mock alone  

## Desktop vs mobile

| | |
|---|---|
| **Desktop** | Primary (~1280); dense table + row popover as mocked |
| **Mobile** | Brief note — table may collapse to stacked cards / drawer (B-like); popover already mobile-aware width; full polish TBD after direction lock |

## Primary files *(guessed — TBD)*

- `AdminCategories.jsx` (Manage Categories)  
- MasterCategories collection / schema  
- `imports/utils/advisorManualServices.js` (`PRODUCT_KIND_NEEDLES` → prefer stored kind)  
- MAP Choose Services popover (#240 Direction C)

## Reference links

- Hub: https://kartboy16.github.io/fc-mocks/263/  
- Direction A: https://kartboy16.github.io/fc-mocks/263/directions/a/  
- Directions brief: [directions-brief.md](directions-brief.md)  
- Issue: https://github.com/kartboy16/content-library/issues/263  
- Related: #240 · #261 (separate) · #209 (do not confuse)

## Handoff

Provisional contract only. Parent / CoS owns Slack. Do **not** mark agent-ready until Alex picks a direction. Do **not** wake Software developer from this mock alone. Do **not** deploy Galaxy/playground from FC Designer mock work.

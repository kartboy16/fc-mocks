# Build contract · #263 Admin Type first, MAP preview only *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex locks
**Issue:** [content-library #263](https://github.com/kartboy16/content-library/issues/263)
**Mocks:** https://kartboy16.github.io/fc-mocks/263/
**Track:** Idea / playground (not staging/main · **not agent-ready**)

## One-liner

Keep **one** `MasterCategories` collection. Lead with **Admin → Manage Categories**, where admins curate the visible **Type: Product | Service**, featured/visible state, filters, and junk cleanup. In the provisional schema the stored field is **`kind: product | service`**. MAP Choose Services is only a small secondary “Advisor sees it like this” preview: it groups Services / Products from the Admin-set value and does not let advisors edit Type. Do **not** create a second collection or a second app chrome.

## Acceptance criteria

- **AC-1:** Existing `MasterCategories` docs store `kind: 'product' | 'service'`; Admin Manage Categories can set/change it. Visible UI calls this field **Type**.
- **AC-2:** Migration gives existing categories a default `kind` (heuristic fallback is acceptable only while unset) so MAP does not blank-break.
- **AC-3:** MAP Choose Services preview groups sections and chips from stored `kind` when present.
- **AC-4:** Admin can hide/remove junk without breaking HTML-post tagging for categories that remain.
- **AC-5:** `MasterCategories` remains the sole source of truth; no second products/services collection.
- **AC-6:** MAP is preview-only: no advisor Type editing and no competing full MAP application shell.

## Working default (Direction A)

- **Primary:** Admin → Manage Categories, dense table with Type column, Featured / Visible, filters, Hide / Remove, and Add with Type required.
- **Secondary:** A small MAP preview tab/inset labelled “Advisor sees it like this”; Services / Products are read-only groupings from Admin-set Type.
- **Schema:** `kind` on existing `MasterCategories` docs only.
- **Out of scope:** #261, new collection, changing `AdvisorConfigs.websiteServices`, #209, Galaxy/playground deployment, or agent-ready handoff.

Directions B (drawer) and C (board) remain comparison mocks with the same Admin-first / preview-only relationship.

## States

| State | Required behavior |
|---|---|
| Admin populated | Table with Type / Featured / Visible; filters work |
| Admin empty | Clear empty state + Add with Type required |
| Admin loading | Skeleton / spinner on Admin table |
| Admin error | Inline error + Retry |
| Unset Type (migration) | Amber highlight; heuristic hint; settable in Admin |
| Hide / Remove junk | Hidden omitted from MAP preview; remove confirms |
| MAP preview | Services + Products from stored `kind`; no Type editing |
| MAP fallback | Note only while eligible categories lack stored `kind` |
| Success | Toast on save / Type change / hide |

## In scope (provisional)

- `kind` field + Admin Type UI (Direction A default)
- Cleanup hide/remove + filters by Type / hidden
- MAP Choose Services grouping preview from stored Type
- Migration path (heuristic fallback only when unset)
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
| **Desktop** | Primary (~1280); Admin dense table + compact MAP preview |
| **Mobile** | Table may collapse to stacked cards / drawer; preview remains secondary; polish TBD after direction lock |

## Primary files *(guessed — TBD)*

- `AdminCategories.jsx` (Manage Categories)
- `MasterCategories` collection / schema
- `imports/utils/advisorManualServices.js` (`PRODUCT_KIND_NEEDLES` → prefer stored `kind`)
- MAP Choose Services preview (#240 grouping pattern only)

## Handoff

Provisional contract only. Parent / CoS owns Slack. Do **not** mark agent-ready until Alex picks a direction. Do **not** wake Software developer from this mock alone. Do **not** deploy Galaxy/playground from FC Designer mock work.

# Build contract · #263 Admin Type first, MAP preview only — Direction A LOCKED

**Status:** Locked — **Direction A**
**Product lock:** Alex Hung, 2026-09-26 PT: “263 looks good!”
**Issue:** [content-library #263](https://github.com/kartboy16/content-library/issues/263)
**Mocks:** https://kartboy16.github.io/fc-mocks/263/
**Track:** Idea / playground; handoff awaits CoS agent-ready → Software developer

## One-liner

Keep **one** `MasterCategories` collection. Lead with **Admin → Manage Categories**, where admins curate the visible **Type: Product | Service**, Featured and Visible state, filters, and junk cleanup. The stored field is **`kind: product | service`**. MAP Choose Services is only a small secondary “Advisor sees it like this” preview: it groups Services / Products from the Admin-set value and does not let advisors edit Type. There is no MAP Admin column and no second app chrome.

## Acceptance criteria

- **AC-1:** Master Category docs can store `kind: 'product' | 'service'`; Admin Categories can set/change it. Visible UI calls this field **Type**.
- **AC-2:** A one-time or lazy migration gives existing categories a default `kind` (heuristic fallback is acceptable only while unset) so MAP does not blank-break.
- **AC-3:** MAP Choose Services preview groups sections and chips from stored `kind` when present.
- **AC-4:** Admin can hide/remove categories that should not appear as advisor products/services without breaking HTML-post tagging for categories that remain.
- **AC-5:** No second master collection; `MasterCategories` remains the source of truth.

## Locked direction — Direction A

- **Primary:** Admin → Manage Categories, dense table with **Type** column (`Product | Service`), Featured, Visible, filters, Hide/Remove, and Add with Type required.
- **Secondary:** A small MAP preview tab/inset labelled “Advisor sees it like this”; Services / Products are read-only groupings from Admin-set Type.
- **Schema:** `kind` on existing `MasterCategories` documents only.
- **Admin columns:** Name · Type · Featured · Visible · Hide/Remove. **No MAP Admin column.**
- **MAP grouping:** Prefer stored Type; use heuristic fallback only when Type is unset during migration.

## States

| State | Required behavior |
|---|---|
| Admin populated | Table with Name, Type, Featured, Visible, and Hide/Remove; filters work |
| Admin empty | Clear empty state + Add with Type required |
| Admin loading | Skeleton / spinner on Admin table |
| Admin error | Inline error + Retry |
| Unset Type (migration) | Amber highlight; heuristic hint; settable in Admin |
| Hide / Remove junk | Hidden omitted from MAP preview; remove confirms; remaining HTML-post tagging intact |
| MAP preview | Services + Products from stored `kind`; no Type editing and no MAP Admin column |
| MAP fallback | Note only while eligible categories lack stored `kind` |
| Success | Toast on save / Type change / hide |

## In scope

- Direction A Admin → Manage Categories dense table and Type (`kind`) field
- Name, Type, Featured, Visible, and Hide/Remove controls
- Filters by Type / hidden / unset
- MAP Choose Services grouping preview from stored Type
- One-time or lazy migration path (heuristic fallback only when Type is unset)
- Empty / loading / error / success states
- Desktop-first (~1280); mobile note below

## Out of scope

- New Mongo collection for products/services
- #261 Content Source + topic taxonomy
- Changing `AdvisorConfigs.websiteServices` storage
- Advisor Categories / AdvisorSource (#209)
- MAP Admin column or advisor Type editing
- Galaxy / playground app deploy from this mock
- Automatic `agent-ready` labeling or waking Software developer from mock alone

## Desktop vs mobile

| | |
|---|---|
| **Desktop** | Primary (~1280); Admin dense table + compact MAP preview |
| **Mobile** | Table may collapse to stacked cards / drawer; preview remains secondary; polish follows implementation |

## Handoff

Direction A is locked. The contract is ready for CoS agent-ready review; after that handoff, Software developer can implement it. Do not add the `agent-ready` label or wake Software developer from this mock, and do not deploy Galaxy/playground from FC Designer mock work.

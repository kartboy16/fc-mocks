# BUILD-CONTRACT — FC #209 Manage Advisor Categories (AdvisorSource CRUD)

**One-liner:** Admin menu item + management page to add / edit / delete `AdvisorSource` records (`name`, auto `slug`, optional `logoUrl`) that power **Advisor Categories** checkboxes on Admin User Edit.

**Recommended direction:** **A — Mirror Manage Categories** (full mock in `mock-a/`).

## Product distinction (critical)

| Label in UI | Collection | Purpose |
|-------------|------------|---------|
| **Manage Advisor Categories** (NEW) | `advisorSource` / AdvisorSource | Affiliation types: Independent, Bank-owned, Credit Union… |
| **Manage Categories** (EXISTING) | MasterCategories | Topic tags for content — **do not redesign**; sibling ADMIN menu item only |

## UI location

1. Content Library → Profile (sidebar bottom) → **ADMIN** block  
2. New item **Manage Advisor Categories** placed **next to** Manage Categories  
3. Route (suggested): `/content-library/admin/advisor-categories`  
4. Context consumer: Admin User Edit → Advisor Categories checkbox list

## Field model

```
AdvisorSource { name: String, slug: String (auto from name), logoUrl?: String }
```

Wire to existing methods: `addAdvisorSource`, `updateAdvisorSource`, `removeAdvisorSource` + `advisorSource` publication.

## Direction A UX (locked for mock)

- Page title **Manage Advisor Categories**
- Info alert (role of AdvisorSource vs topic categories)
- Add row: Name (required) + Logo URL (optional) + slug preview + Add
- Table: Name | Slug | Logo | Edit / Delete
- Edit: inline or same fields; slug updates from name
- Delete: confirm modal; server cleans prefs + `availableToAdvisorSourceIds`

## Screens covered

1. Profile ADMIN menu with new item highlighted beside Manage Categories  
2. Management CRUD page  
3. Optional: User Edit Advisor Categories checkboxes reflecting catalog  

## In scope

- Admin-only menu item + page  
- CRUD via existing Meteor methods  
- Auto slug from name  
- Optional logo URL + thumbnail  
- Delete confirmation  

## Out of scope

- Changing User Edit assignment UX (checkboxes stay)  
- Redesigning Manage Categories / MasterCategories  
- New parallel APIs  
- Production auth (mock is localStorage)

## Acceptance (from #209)

1. ADMIN menu shows **Manage Advisor Categories**  
2. Management route opens for admins only  
3. Add / edit / delete work; slug from name; logo optional  
4. Catalog updates appear on User Edit checkboxes via subscription  
5. Non-admins blocked (same pattern as AdminCategories)

## Tokens

`#f4f8fc` / `#fafafa`, `#1e2a4a`, `#2b7de9` / `#2196f3`, `#d4e4f2`, Inter.

## Playground track

Designer mock (`mock-a/`) → engineering mirrors `AdminCategories.jsx` + ADMIN block in `ContentLibrary.jsx` → methods already in `imports/collections/advisor_source.js`.

GitHub: https://github.com/kartboy16/content-library/issues/209

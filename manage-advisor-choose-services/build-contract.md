# Build contract · Manage Advisor · Choose Services (Alex-locked C)

**Locked:** Direction C — row-anchored popover  
**Status:** Alex-locked 2026-09-25 (required tweak: all chips, no +N)  
**Audience:** Admin Manage Advisor Posts table  

**Mock (locked):** https://kartboy16.github.io/fc-mocks/manage-advisor-choose-services/directions/c/  
**Hub:** https://kartboy16.github.io/fc-mocks/manage-advisor-choose-services/  
**Issue:** Not filed yet — CoS will open content-library issue. **Do not** mark agent-ready from this mock repo.

## One-liner

Replace the expanding `ChooseAdvisorServicesPanel` row (`expandedServices`) with a **row-anchored popover** opened from the Services & products column and/or Choose services action; show **all** selected service and product chips on the row (never +N truncate).

## Replace

- **Remove / stop using** the inline expanding row pattern driven by `expandedServices` + `ChooseAdvisorServicesPanel`.
- **Open instead** a popover (or equivalent floating panel) anchored near the triggering row/cell/action.

## New column — Services & products

- Chips for **all** selected **services AND products**.
- **Never** truncate with +N / “+2” overflow chips.
- Chips **wrap**; the table cell **may grow vertically** so every chip stays visible.
- Empty state: **“None selected”** plus an affordance (e.g. Choose link) to open the picker.
- Chip styling: distinguish **services** vs **products** when the UI already does (mock: mint/blue services · lavender products).

## Popover — Choose services & products

- Title: **Choose services & products** (advisor name/firm as subtitle).
- **Search** filters the list.
- Grouped **Services** vs **Products**.
- **Multi-select** (per-item + select-all for visible items in a group is fine).
- **Save** / **Cancel**.
- On **Save:** persist to the **durable advisor services store** (same path as #176 / `websiteServices` / manual Master Categories).
- On **Cancel:** discard draft; leave stored selection unchanged.

## Screens / states (must cover)

| State | Behavior |
|-------|----------|
| Empty column | “None selected” + Choose (opens popover) |
| Many chips | All chips visible; wrap / cell expands — **no +N** |
| Popover open | Anchored near row; search + Services/Products groups |
| Save | Persist + toast (e.g. “Saved for {advisor}”); chips refresh |
| Cancel | Closes; discards draft; no chip change |

## In scope

- Row-anchored chooser replacing expanding panel
- Services & products column with full chip set (wrap, no +N)
- Search, grouped multi-select, Save/Cancel
- Persist on Save to durable advisor services store (same as #176)
- Service vs product chip distinction if already present in product UI

## Out of scope

- Creating new Master Categories / catalog items
- Live website scan / crawl as the primary path (see #176 secondary scan)
- Marking this mock agent-ready or filing the content-library issue (CoS owns that)
- Changing Pick-for-me suggestion algorithms beyond reading the durable store
- Production auth / API design beyond wiring Save to the existing store

## Primary files

- `imports/ui/admin/ManageAdvisorPosts.jsx`
- `ChooseAdvisorServicesPanel` (or successor modal/popover component)

## Related

- **#176** — Manual advisor services / durable store / Master Categories path  
- **#181** — related Manage Advisor / services work as applicable  

## Handoff

Visual reference: locked Direction C mock. CoS files content-library issue and agent-ready; Software developer implements from that issue + this contract.

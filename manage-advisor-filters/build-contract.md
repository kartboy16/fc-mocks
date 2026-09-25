# Build contract · Manage Advisor Posts · Direction B (Alex-locked)

**Locked:** Direction B — one-row summary chips → group popover  
**Status:** Alex-locked 2026-09-25  
**Audience:** Admin Manage Advisor Posts (active filter presentation only)  

**Mock:** https://kartboy16.github.io/fc-mocks/manage-advisor-filters/directions/b/  
**Hub:** https://kartboy16.github.io/fc-mocks/manage-advisor-filters/  
**Issue:** Not filed yet — CoS files content-library issue. **Do not mark agent-ready from mock repo.**

## One-liner

Replace the full-wrap active-filter chip strip with a **single row of summary chips** (one per non-empty filter group / polarity). Clicking a summary chip opens a **popover** listing that group’s individual filters with remove (×) and search-within-group. Filters drawer stays as today.

## Problem

50+ include/exclude chips (list source, suggest source, topics) wrap many rows and push the advisor table down. Change presentation of active filters only — not a new filter system.

## Default strip (always one row)

- Show ~3–6 **summary chips** on one horizontal row (nowrap + horizontal scroll OK if needed).
- Summary chips represent **groups**, not every filter:
  - Include list source(s) when present (include styling: solid blue)
  - Exclude list · N (exclude styling: red outline)
  - Exclude suggest · N
  - Exclude topics · N
  - Other live filter groups should follow the same pattern if they exist in production.
- Include **Clear all** on the strip (right side).
- Filters toolbar badge continues to show total active filter count.

## Popover (per summary chip)

- Opens anchored under / near the clicked summary chip.
- Title = group name (for example, **Exclude topics**).
- Search filters the list within that group.
- Each row: filter label + remove (×) control that clears that single filter from the active set.
- Empty group after removals: close popover / remove that summary chip from the strip.
- Close via ×, Escape, or click-outside.

## Individual chip labels

Keep existing production label prefixes where applicable (for example, `List source:`, `Exclude list source:`, `Exclude suggest source:`, `Exclude topic:`).

## Screens / states

| State | Behavior |
|-------|----------|
| Crowded (many filters) | One summary-chip row; table starts immediately below |
| Summary chip click | Popover with group chips + search + × |
| Remove one | That filter cleared; summary count updates; empty group drops from strip |
| Clear all | All active filters cleared; strip empty / hidden as appropriate |
| Zero filters | No summary strip (or empty); Filters badge 0 |
| Filters drawer | Unchanged stub/live drawer — Apply still drives the active set |

## In scope

- Active-filter presentation = Direction B summary chips + popover
- Clear all + per-filter remove in popover
- Search within group in popover
- Keep Filters drawer / apply flow as today
- Desktop admin Manage Advisor Posts

## Out of scope

- Redesigning the Filters drawer contents / new filter types
- Directions A or C
- Filing content-library issue / agent-ready (CoS)
- Choose Services / Services column work (#240)
- Mobile redesign beyond not breaking the strip

## Primary files

- `imports/ui/admin/ManageAdvisorPosts.jsx` (and any active-filter chip strip components it uses)

## Related

- Crowded reference: https://kartboy16.github.io/fc-mocks/manage-advisor-filters/reference/crowded.png
- Adjacent: Manage Advisor Choose Services (#240) — separate surface

## Handoff

Visual reference: locked Direction B. CoS files issue + agent-ready; Software developer implements from issue + this contract.

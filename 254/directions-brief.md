# #254 Directions brief — Posts column density

> **Mocks only until Alex locks.** This is a comparison for Software developer / Chief of Staff — not a build-contract. After Alex locks a direction, a full build-contract will follow in a later task.

**Issue:** [content-library #254](https://github.com/kartboy16/content-library/issues/254)  
**Mocks:** https://kartboy16.github.io/fc-mocks/254/  
**Recommend (Designer):** Direction A — Dense stack

---

## Shared context (all directions)

| | |
|---|---|
| **Surface** | Admin · Manage Advisor Posts · **Posts** column inside each advisor row |
| **Pain** | Tall suggested cards; past + suggest fight for height; ~1 past post visible; Schedule/Skip clipped; only one advisor row under filter bar |
| **Out of scope** | #252 scroll-fill / Website-only fix (separate); crowded filter strip (#243); Choose Services (#240); content-library agent-ready work |
| **Chrome** | Keep Search / Filters / Post history / schedule date / Refresh; Direction-B style one-row filter chips OK as backdrop |

---

## Direction A — Dense stack *(recommend)*

**What changes**
1. Past stays in-cell but becomes a **compact scrollable list** (platform icon + title + date). Soft max-height ~96–120px. Label `Past · N`.
2. Suggestions become a **horizontal carousel of short cards**: image ~72–88px, title once (no overlay duplicate), 1-line excerpt, 1–2 tags, **Schedule + Skip always visible**.
3. Soft cap on Posts cell ~280–320px so **two advisor rows** fit on a typical laptop under the filter bar.
4. Thin divider `Suggested · N` between past and suggestions.

**What stays**
- Past and suggestions both visible without a mode switch.
- Horizontal scroll for suggestions; independent vertical scroll for past.

**Tradeoff**
- Past list is short (scroll for the rest). Cards are denser / less “hero.”

---

## Direction B — Tabs (Past | Suggested)

**What changes**
1. Segmented control in the Posts cell: **Past · N** | **Suggested · N**.
2. Only the active tab fills the cell (~260–300px).
3. Default tab: **Suggested** (scheduling is the admin job).
4. Past tab = same dense list as A. Suggested tab = same short cards as A (or slightly richer if space allows).

**What stays**
- Full height available to whichever mode the admin is in.

**Tradeoff**
- Past is one click away (not glanceable alongside suggestions). Extra interaction vs A.

---

## Direction C — Past popover + landscape suggest row

**What changes**
1. Past collapses to a single control: **Past posts · N ▾** → popover (or side drawer) with the full compact list.
2. Posts cell body is almost entirely **landscape suggestion cards**: image left (~64–72px square), title + excerpt + tags + Schedule on the right; card height ~88–100px; horizontal scroll.

**What stays**
- Past fully reachable; Schedule always visible on every card.

**Tradeoff**
- Past is hidden until opened (best if scheduling >> reviewing history in this view). Landscape cards need more horizontal width per card.

---

## Before → after (plain words)

| Today | After (any direction) |
|---|---|
| Tall portrait suggest cards; Schedule clipped by scrollbar | Short or landscape cards; Schedule always on-card |
| Past + suggest both stacked without height discipline | Soft cap and/or mode switch / past collapse |
| ~1 advisor row visible under filter bar | ~2 advisor rows peeking on a laptop viewport |

---

## Clickable in mocks

- **A:** scroll past list, horizontal scroll suggests, Schedule toast, Skip removes card  
- **B:** tab switch, same Schedule/Skip, past row click toast  
- **C:** open/close past popover, Schedule toast, Skip, horizontal scroll  

---

## Next step after Alex locks

Write a full **build-contract** (acceptance criteria, measurements, non-goals) for the locked direction only. Do not treat this brief as engineering-ready.

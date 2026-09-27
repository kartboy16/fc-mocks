# Build contract · #266 MAP Pick a post for me

> **LOCKED** — Direction A locked by Alex 2026-09-26 PT; agent-ready; staging track; contract frozen for Software developer.

**Locked:** Direction A — Sibling primary actions (“Pick a post for me” beside/under Suggest posts).

**AC-7:** Exclude candidates whose category matches any of the advisor’s last 3 posted. If all remaining collide → clear exhausted UI (never silent).

## One-liner

On each Manage Advisor Posts advisor row, add **Pick a post for me** next to **Suggest posts**. One click ranks a library post using that advisor’s confirmed services + WP/MAP exclusions, skips categories from the last 3 posted, and prepends the result to that row’s Suggested scroller. Admin still Schedules or Skips — **no auto-publish**.

## Locked UI (Direction A)

- Actions column: Suggest posts → outline primary **Pick a post for me** → Choose services / Load from WP.
- Widen actions column slightly (~140–150px) vs #254.
- Posts cell chrome stays locked [#254 Direction A](../254/directions/a/).

## Acceptance criteria

- [ ] **AC-1:** New **Pick a post for me** control beside Suggest posts on each MAP advisor row.
- [ ] **AC-2:** Ranking uses confirmed products/services (`AdvisorConfigs.websiteServices`). If none: #52 scan-once-if-empty **or** prompt Choose services — no second services store.
- [ ] **AC-3:** Exclude WP history + existing MAP exclusion rules (`post-suggestions.js`).
- [ ] **AC-4:** Result in that row’s Suggested scroller; Schedule/Skip unchanged; no auto-publish.
- [ ] **AC-5:** Short “why this fits” (matched service) when available, consistent with AdminSuggestPostCard.
- [ ] **AC-6:** Loading / empty / exhausted states clear and distinct from Suggest posts batch.
- [ ] **AC-7:** Do not pick same category as any of last 3 posted. If all collide → exhausted UI (e.g. “No posts outside your last 3 categories”), not silent.

## Screens / states

| State | UI | Copy |
| --- | --- | --- |
| Idle | Pick enabled when services exist (or after #52 empty-scan) | **Pick a post for me** |
| Loading | Spinner / “Picking…” | Picking a post… · Matching services + avoiding last 3 categories |
| Success | Card prepended; optional badge; Schedule/Skip | Fits {service} · avoided {cats} |
| Empty / no fit | Inline empty | No post fits right now |
| Exhausted (AC-7) | Distinct from empty | No posts outside your last 3 categories |
| No services | Choose services prompt | Choose services first |

## Inputs / outputs

**In:** advisor row · `websiteServices` · WP/MAP exclusions · last 3 posted categories · library candidates

**Out:** 0–1 post into Suggested · UI state · no publish side effect

## In scope

- MAP actions control + pick wiring into existing ranking/exclusions
- AC-7 category diversity
- AdminSuggestPostCard “why this fits” consistency

## Out of scope

- Replacing Suggest posts
- Auto-publish / monthly batch scheduler
- New Master Categories collection (#263)
- Redesigning #52 crawl / Choose services

## Primary files (likely)

`ManageAdvisorPosts.jsx` · `post-suggestions.js` · `AdminSuggestPostCard` · AdvisorConfigs websiteServices

## Reference

[Direction A](directions/a/) · [Issue #266](https://github.com/kartboy16/content-library/issues/266) · Related #52 #240 #254

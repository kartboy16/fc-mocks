# Build contract · Manage Advisor Posts · Direction A (Alex-locked)

**Locked:** Direction A — dense stack  
**Status:** Alex-locked 2026-09-25 (PT)  
**Issue:** [content-library #254](https://github.com/kartboy16/content-library/issues/254)  
**Audience:** Admin Manage Advisor Posts

## One-liner

The **Posts** cell is a compact, independently scrollable past-post list (~108px) stacked above short horizontal suggestion cards, inside a soft ~300px cell height. **Schedule stays visible**, and two advisor rows can peek below the filter bar.

## Problem

Tall suggested-post cards consume the Posts column, while past posts and suggestions compete for vertical space. The current presentation exposes too little history, clips Schedule/Skip, and leaves only about one advisor row visible under the filter bar.

## Locked layout contract

- Keep Past and Suggested visible together; do not introduce a mode switch or hide history behind a popover.
- Stack the compact Past list above the Suggested carousel with a thin divider.
- Give the Posts cell a **soft max-height of approximately 300px** (acceptable implementation target: ~280–320px). Content must not make the table row grow without bound; two advisor rows should be able to peek on a typical laptop viewport below the filter bar.
- The height target is for the Posts-column presentation only. Do not implement the separate #252 scroll-fill behavior as part of this work.

### Past list

- Label the section `Past · N` (or the existing equivalent with the count).
- Use compact rows containing a thumbnail/platform icon, title, date, and channel.
- The list has its own vertical scroll container, targeted at **~108px** (acceptable range ~96–120px), so additional past posts remain reachable without increasing the Posts cell height.
- Keep titles to one compact line with truncation where needed; metadata remains readable.
- A zero-result list renders an explicit empty state such as `No past posts` rather than a blank gap.

### Suggested cards

- Render a horizontal carousel with independent horizontal scrolling; cards do not wrap into additional rows.
- Each card uses a short image region of **~72–88px** (the mock uses ~80px).
- Show the title **once**, in the card body. Do not combine title-on-image with a duplicate title below.
- Include a one-line excerpt and **one or two tags**.
- Keep **Schedule** and **Skip** visible in every card without requiring a hover, expansion, or scroll position.
- Schedule preserves the existing scheduling flow/date context. Skip removes or dismisses that suggestion from the carousel and gives the existing confirmation/feedback behavior.
- A zero-result carousel renders an explicit empty state such as `No suggested posts` rather than leaving an empty carousel shell.

## Screens / states

| State | Required behavior |
|---|---|
| Crowded | Past and suggestions remain stacked in the soft ~300px Posts cell; the table remains compact enough for two advisor rows to peek below the filter bar. |
| Scroll past | Past list scrolls vertically within its own ~108px container; scrolling it does not scroll the table or suggestion carousel. |
| Schedule | Schedule is visible on-card, invokes the existing schedule flow, and leaves the control available for each remaining suggestion. |
| Skip | Skip is visible on-card, dismisses only the selected suggestion, and does not collapse or resize the whole Posts cell unexpectedly. |
| Empty past | Show `Past · 0` (or equivalent) and a clear no-past-posts state; suggestions remain available. |
| Empty suggests | Show an empty suggested state; past history remains available and the cell does not reserve a tall blank carousel area. |

## Acceptance criteria

- [ ] Direction A is implemented as the locked reference: compact scrollable Past list above short horizontal suggestion cards.
- [ ] Past rows expose thumbnail/icon, title, date, and channel; the Past list scrolls independently.
- [ ] Suggestion cards use a ~72–88px image, title once, one-line excerpt, 1–2 tags, and always-visible Schedule/Skip.
- [ ] Posts cell has a soft ~300px height discipline and does not force unbounded row growth.
- [ ] Crowded, scroll-past, schedule, skip, empty-past, and empty-suggestions states are handled.
- [ ] Existing Search, Filters, post-history, schedule-date, Refresh, advisor, source, services, and action-column chrome remain unchanged.
- [ ] Behavior works for every advisor row rendered by Manage Advisor Posts, not only the mock’s sample rows.

## In scope

- Posts column presentation only in Manage Advisor Posts.
- `AdminSuggestPostCard` and the past-post list (or their successors).
- The spacing, sizing, overflow, empty states, and Schedule/Skip presentation needed to meet this contract.

## Out of scope

- **#252 scroll-fill** (separate work).
- **#243 filters** or the active-filter presentation.
- **#240 Choose Services**.
- Redesigning the Filters drawer.
- Changes to the advisor, Sources, Services & products, or Actions columns.
- Mobile redesign beyond avoiding a regression in the Posts cell.
- Filing issues, posting updates, or marking this work agent-ready from the mock repo.

## Primary files

- `imports/ui/admin/ManageAdvisorPosts.jsx`
- `AdminSuggestPostCard` (or successor component)
- The past-post list component/styles used by Manage Advisor Posts

## Reference links

- Locked mock: [Direction A](https://kartboy16.github.io/fc-mocks/254/directions/a/)
- Hub: [#254 mock hub](https://kartboy16.github.io/fc-mocks/254/)
- Issue: [content-library #254](https://github.com/kartboy16/content-library/issues/254)

## Handoff

Implement against this contract and the locked Direction A mock. This task changes the mock repository only; no issue, Slack message, or agent-ready action is performed here.

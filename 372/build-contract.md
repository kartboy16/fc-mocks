# Build contract · #372 MAP Suggest Posts — creation date range filter

**PROVISIONAL.** Recommend Direction **A** (inline Created from / to). **Alex has not locked a direction.**

**Soft Dev hold · Designer-first · not agent-ready.** Soft Dev not woken. Do **not** mark `agent-ready`. No content-library / Meteor work until Alex picks A, B, or C.

Issue: https://github.com/kartboy16/content-library/issues/372

## One-liner
In Manage Advisor Posts, admins can narrow **Suggest Posts** to posts created between two dates. Leaving the dates empty (or clearing them) keeps today's Suggest behavior.

## Recommend
**A: Inline Created from / to.** Two compact date fields, “Created from” and “to”, sit in the existing filter row next to *Post history*. They use the same floating-label field style, with a small **Clear**. A status line under the row reads “Showing posts created Jan 1 – Mar 31, 2026 · 5 of 18 suggested posts”. It is the most direct option, adds no new pattern, and makes clear what's applied.

- **B** (Created dropdown: Any time / Last 30 days / Last 90 days / Last 12 months / This year / Custom range…) takes fewer clicks for common cases but puts two time dropdowns side by side.
- **C** (+ Created date chip → popover → removable chip) keeps the row tidiest but takes one extra click, and an applied chip is easier to miss.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/372/
- A (recommend): https://kartboy16.github.io/fc-mocks/372/directions/a/
- B: https://kartboy16.github.io/fc-mocks/372/directions/b/
- C: https://kartboy16.github.io/fc-mocks/372/directions/c/

Each page shows four states: 1 Default (no date limit) · 2 Range applied (fewer suggestions, including an advisor with none) · 3 Clear → default · 4 To-date before From-date (inline message).

## Acceptance criteria (provisional · not locked)
- **AC-1:** The Suggest Posts filters include a creation date range control with both a **from** and a **to** date, in the existing MAP filter row.
- **AC-2:** Empty = no date limit. With both empty, Suggest Posts returns exactly what it returns today.
- **AC-3:** Only “from” set = created on or after that date. Only “to” set = created on or before. Both dates are inclusive.
- **AC-4:** Setting or changing the range refreshes suggested posts for every advisor row. Rows with no matches show a plain message (“No suggested posts created Jan 1 – Mar 31, 2026. Widen the dates or clear the Created filter…”), not a blank cell.
- **AC-5:** **Clear** (A), *Any time* / Clear (B), or × on the chip (C) empties the range and restores prior Suggest Posts behavior.
- **AC-6:** **Validation:** if the to-date is before the from-date, show a plain inline message (“The end date (Dec 1, 2025) is before the start date (Jan 1, 2026). Pick an end date on or after Jan 1, 2026.”), mark the to field, and do **not** apply the range. Suggestions stay on the last valid range. Future dates are not selectable.
- **AC-7:** A short status line says what's applied (“Showing posts created {range} · X of Y suggested posts”) and offers Clear. With no range: “No creation date limit · showing all Y suggested posts”.
- **AC-8:** Visual consistency with existing MAP filters: same field height, border, and floating label as *Post history* / *Default schedule date*, and the same include-chip style if C is picked. Do not redesign the MAP table.
- **AC-9:** *Suggest posts* uses the current Created range. *Pick a post for me* (#266) is unchanged unless Alex says otherwise (see open questions).

## Interaction with the Post history window (assumption)
- *Post history* (“Past 36 months”) keeps doing what it does today: which past and upcoming posts show for each advisor, and what counts as already posted.
- **Created from / to only narrows the Suggested candidates.** If Suggest is already limited by the window today, the Created range narrows **within** it and never widens it.
- **Open question for Alex.**

## Open questions for Alex
1. **Window vs. Created:** Should the Created range be capped by the Post history window, or be independent? (Mock assumes it narrows within whatever Suggest considers today.)
2. **What “created” means:** The date the post was added to the Content library (assumed), or its WordPress publish date?
3. **Pick a post for me:** Should Pick also respect the Created range? (Mock: no, Suggest only, as the issue states.)
4. **Created date on cards:** Is it OK to show a small “Created Feb 26, 2026” line on each suggestion card so admins can see the filter worked? (Shown in all three mocks, optional.)

## Copy (plain words)
- A: “Created from” · “to” · “Clear”
- B: “Created” · “Any time” · “Last 30 days” · “Last 90 days” · “Last 12 months” · “This year” · “Custom range…” · “From” · “To” · “Clear”
- C: “+ Created date” · popover title “Show suggested posts created…” · “From” · “To” · “Leave one side empty for no limit on that side.” · “Cancel” · “Apply” · chip “Created: Jan 1 – Mar 31, 2026 ×”
- Status: “Showing posts created {range} · X of Y suggested posts” · “No creation date limit · showing all Y suggested posts”
- Range format: same year “Jan 1 – Mar 31, 2026”; across years “Nov 1, 2025 – Mar 31, 2026”; one side “on or after Mar 1, 2026” / “on or before Mar 31, 2026”

## Non-goals
- **#368** (MAP on a phone) and **#341** (MAP density) are separate issues. Not touched here.
- **#266** Pick / Suggest behavior already shipped. This only adds a date filter to Suggest Posts, not a new ranking.
- Not the WordPress load bug (separate wealthstream.ca investigation).
- No redesign of the MAP table, filter drawer, or exclusion chips.
- No `agent-ready` and no Soft Dev wake until Alex locks a direction.
- Fictional advisors only (Sarah Chen, Michael Okonkwo, Dana Lefebvre).

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex to pick A / B / C and answer the open questions.

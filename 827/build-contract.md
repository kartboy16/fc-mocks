# #827 Multi-advisor send: include + exclude advisor-category filters (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** **Current recommendation: A** (MAP-identical “Include sources / Exclude sources”). This extends the shipped [#824](https://github.com/kartboy16/content-library/issues/824) / [PR #826](https://github.com/kartboy16/content-library/pull/826) admin multi-advisor send — **advisor picker filters only**. Risk: **high** (same send surface as #824). Track: staging → FC Tester; Alex merges any main PR.

## Ask (Alex, Nov 6 2026)
For #826, in the advisor selection menu: filter by **including and excluding advisor categories** like MAP. Mock options.

## Screens
| Screen | Who | Notes |
| --- | --- | --- |
| Content card → Share → Continue → multi-advisor modal, **step 1 Advisors** | Admin only | Existing #824 D shell; filters sit above the checklist. Advisors never see this. |
| (Unchanged) steps 2 Extras / 3 Review | Admin | Out of scope for #827 — keep #824 behavior. |

## Directions
| | A (recommended) | B | C |
| --- | --- | --- | --- |
| Control | Dual multi-selects | Same dual multi-selects | Single row of tri-state chips |
| Labels | **Include sources** / **Exclude sources** (MAP) | **Include categories** / **Exclude categories** (Alex’s words) | Category name + Off / Include / Exclude |
| Placement | Above advisor checklist in the D modal picker | Same | Same |
| Defaults | Include `Content`, exclude `No longer a client`; archive always out | Same | Same |
| Mutual exclusion | Category cannot be in both; other list shows it blocked | Same | Cycle never places both |
| Live list | Filters update who appears immediately | Same | Same |
| Selection fall-out | Checked advisors that no longer match are **unchecked and removed** from the visible list (no invisible selection) | Same | Same |

## Filter rules (all options)
1. **Include:** if any include categories are set, an advisor appears only if they have **at least one** of those categories.
2. **Exclude:** if any exclude categories are set, an advisor with **any** of those categories is hidden.
3. **Both:** apply include first, then exclude.
4. **Mutual exclusion:** selecting a category on one side removes it from the other; the other control shows it as blocked (“In include” / “In exclude”).
5. **Archive:** advisors with Archive stay out of the list always (same as MAP), independent of include/exclude.
6. **Empty filters:** cleared include = no include constraint (all non-archive / non-excluded can show). Cleared exclude = nothing excluded by category.
7. **No matches:** empty state with Reset filters → defaults.

## States to mock / test
- Defaults (include Content, exclude No longer a client)
- Include-only
- Exclude-only
- Both include + exclude
- No matches
- Category blocked from the other list (open the other dropdown / chip state)
- Cleared filters
- Desktop 1280 and phone 390

## Copy
- Section title: **Who appears in the list** (MAP parallel: “Who appears in the table”).
- A: Include sources / Exclude sources. B: Include categories / Exclude categories.
- Empty: “No advisors match these filters” + Reset filters.
- Summary line: Include / Exclude chips + “N shown (archive always hidden)”.
- Do not invent compliance/legal letter copy. Product category names from the app are fine: Content, Email Content, Compliance, Social, No longer a client.
- Fixtures: Jane Advisor, John Advisor, Casey Example, Sam Planner, Pat Example, Lee Example, Riley Example (No longer a client), Archived Example (always hidden). Domains: yourfirm.ca / example.com. Emails: jane.advisor@example.com and other `@example.com` only.

## In scope
- Admin filter UX + list logic on the existing #824 D advisor-picker step.
- Mutual exclusion, defaults, empty/no-match, selection pruning.
- Persist filter choices for the life of the modal open (exact persistence across opens: follow MAP / existing send modal prefs if any — **open question**, do not invent).

## Out of scope
- Rewriting #824 send extras (email, social, campaigns, compliance PDFs, Schedule, Send as Page).
- Changing MAP’s own filters or suggested-posts topic filters.
- New top-level screen or advisor-facing UI.
- Send as Page.
- Wiring to live Meteor/Mongo in this mock pack.

## Desktop vs mobile
- Desktop-first dual multi-selects side by side; on 390px stack vertically; modal is bottom sheet.
- Tri-state chips wrap; 44px min targets.
- Checklist collapses extra columns on phone (same pattern as #824 D).

## Agent-time estimate (cloud agent + FC Tester only)
| Work | A | B | C |
| --- | --- | --- | --- |
| Cloud agent build (filter UI + list logic on existing picker, mutual exclusion, defaults, prune selection, empty state) | 50–80 min | 45–70 min (label swap on A, or same if A not chosen) | 60–95 min (tri-state + a11y) |
| FC Tester (defaults, include, exclude, both, blocked, no-match, 1280/390, selection fall-out, no FC links on previews) | 35–55 min | 35–55 min | 40–60 min |
| **Total** | **~1.5–2.25 h** | **~1.5–2 h** | **~1.75–2.5 h** |

If A ships first, B is mainly a string change (~15–25 min agent) unless Alex wants B alone.

## Recommendation
**Pick A** unless Alex prefers his “categories” wording day-one — then **B** (same control). Prefer C only if modal vertical space is tight after extras land. A matches MAP muscle memory for the same admin audience.

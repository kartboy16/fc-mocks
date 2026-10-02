# Build contract · #368 MAP mobile (Services & products)

**PROVISIONAL** — Recommend Direction **A** (Cards + bottom sheet). Not locked. Soft Dev hold · not agent-ready.

**Soft Dev hold · Designer-first.** Soft Dev not woken. Do **not** mark `agent-ready`. Wait for Alex to lock a direction.

## Recommend
**A — Cards + sheet.** Search, then advisor cards (name, firm, “N services”). Edit services opens a bottom sheet: remove chips, search/add, Done. Fastest scan and one-handed chip edit without losing the list. Sheet is the usual phone pattern.

- **B** (accordion) stays in the list but a long editor pushes other advisors down.
- **C** (list → full screen) is the clearest focus, with an extra Back step.

## One-liner
On a phone, scan Manage Advisor Posts as cards (no horizontal table) and add or remove Services & products chips in a bottom sheet.

## Not this issue
- **#341** is desktop density (topics collapse, Load from website). Do not block on that lock and do not redesign it here. https://kartboy16.github.io/fc-mocks/341/
- **#266** Pick / Suggest already shipped. Secondary only — not the focus.
- Skipping internal users (Alex Hung / Angelina Hung) is **data**, not a UI control. Do not design a hide toggle.

## Entry points (provisional)
| Entry | Dir |
| --- | --- |
| Cards + bottom sheet chip editor | **A** (recommend) |
| Accordion: expand card in place | B · alt |
| Compact list → full-screen editor | C · alt |

## Beats (recommend A)
1. Phone-width Manage Advisor Posts (no desktop table, no horizontal scroll)
2. Search advisors by name or firm
3. Card shows name, firm, and service count (not a chip pile)
4. Tap card or Edit services → bottom sheet
5. Remove a chip (×) · search catalog or type · Add
6. Done closes the sheet; the card count updates
7. Pick a post / Suggest posts remain available but secondary

## Acceptance criteria (provisional · A)
- **AC-1:** Phone-width layout scans advisors without a horizontal table
- **AC-2:** Services & products chips can be added and removed on the phone
- **AC-3:** Clickable HTML mock on fc-mocks + this build contract before any Soft Dev work
- Pick / Suggest (#266) are not required to change
- No “hide internal users” control

## Out of scope
#341 desktop density · Pick/Suggest redesign · hide-internal-users UI · content-library / Meteor · waking Soft Dev · agent-ready · real advisor PII

## Live
https://kartboy16.github.io/fc-mocks/368/

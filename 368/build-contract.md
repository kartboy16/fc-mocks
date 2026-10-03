# Build contract · #368 MAP on a phone

**PROVISIONAL** — Recommend Direction **A** (cards + bottom sheet). **Alex has not locked a direction.** Soft Dev hold · not agent-ready.

**Soft Dev hold · Designer-first.** Soft Dev not woken. Do **not** mark `agent-ready`. Do not wake Soft Dev.

## Recommend
**A — Cards + sheet.** Search, then advisor cards (name, firm, service count, and the post in use if one was chosen). Each card shows three plain actions with no menu: **Suggest posts**, **Pick for me**, **Edit services**. Each opens its own bottom sheet. All three jobs are visible without hunting.

- **B** (accordion) keeps the same three actions, but only after the card is expanded, and the flow sits inline (long scroll).
- **C** (compact list) hides the three actions until a full-screen hub; each action then drills in.

## One-liner
On a phone, scan Manage Advisor Posts and, without the desktop table, suggest posts, pick one post, or edit Services & products chips.

## Not this issue
- **#341** is desktop density (topics collapse, Load from website). Do not redesign it here. https://kartboy16.github.io/fc-mocks/341/
- **#266** Pick / Suggest already shipped on desktop. This mock is the **phone** placement and flow, not a new algorithm.
- Skipping internal users (Alex Hung / Angelina Hung) is **data**, not a UI control. Do not design a hide toggle. Mocks use fictional advisors only.

## Entry points (provisional)
| Entry | Dir |
| --- | --- |
| Card shows Suggest posts, Pick for me, Edit services; each opens a bottom sheet | **A** (recommend) |
| Expand a card; the same three actions sit inline | B · alt |
| Compact list → full-screen hub with the three actions → each drills in | C · alt |

## Beats (recommend A)
1. Phone-width Manage Advisor Posts (no desktop table, no horizontal scroll)
2. Search advisors by name or firm
3. Card shows name, firm, and service count (not a chip pile)
4. Three actions on the card: Suggest posts, Pick for me, Edit services
5. Suggest posts → sheet with a few posts (title + short why). Use or Dismiss. Close returns to the advisor list
6. Pick for me → one recommended post (title + why this one). Use this post or See another. Not a buried link
7. Edit services → add or remove chips. Done closes the sheet; the count updates
8. After Use, the card can show “Using: {title}”

## How B and C place the same jobs
- **B:** Tap the card (Show actions). Expanded card shows the three actions. The chosen flow renders under them. Back to advisors / Hide returns to the list.
- **C:** Tap the row → hub with the three actions. Suggest posts drills in; its Back returns to the advisor list. Pick for me and Edit services drill in and Back returns to the hub, then the hub returns to the list.

## Acceptance criteria (provisional · not locked)
- **AC-1:** Phone-width layout scans advisors without a horizontal table
- **AC-2:** Services & products chips can be added and removed on the phone
- **AC-3:** Suggest posts opens a phone list or sheet of a few posts (title + short why) with Use and Dismiss. Back returns to the advisor list
- **AC-4:** Pick for me shows one recommended post (title + why this one) with Use this post and See another, not buried in a menu
- **AC-5:** Clickable HTML mock on fc-mocks + this build contract before any Soft Dev work
- No “hide internal users” control
- No new Pick/Suggest algorithm (#266 already shipped)

## Copy (plain words)
- Screen title: “Manage Advisor Posts”
- Search: “Search advisors”
- Actions: “Suggest posts” · “Pick for me” · “Edit services”
- Suggest: title, “Why:”, “Use”, “Dismiss”, “Back to advisors”
- Pick: title, “Why this one:”, “Use this post”, “See another”
- Edit: “Services & products”, “Add”, “Done”
- Count: “No services yet” / “1 service” / “N services”
- In use: “Using: {title}”

## Out of scope
#341 desktop density · a new Pick/Suggest algorithm · hide-internal-users UI · content-library / Meteor · waking Soft Dev · agent-ready · real advisor PII

## Live
https://kartboy16.github.io/fc-mocks/368/

# #696 Admin user list at tablet and phone widths: build contract

Follow-up to [#696](https://github.com/kartboy16/content-library/issues/696) and staging [PR #698](https://github.com/kartboy16/content-library/pull/698), which shows cards below 1280 px with a ⋮ menu. Page: `/content-library/admin/users` (`imports/ui/AdminUserList.jsx`). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## What each row shows (from `AdminUserList.jsx`)

- **Name** and **company** (`profile.companyName`).
- **Email**, and **website** (`websiteAddress`, linked, or "—" if there isn't one).
- **User ID**, with Copy.
- **Advisor Categories:** `advisorSourceNames` chips, or "None".
- **Social:** one line per token, with the network icon, `profileLabel`, an expiry chip (red if expired, amber if it needs reconnecting) and a "Send {network} refresh email" button. If there are no tokens: "No social accounts".
- **Section access:** chips for Calendar, Content, Email Campaigns, Social Media and Website, or "No section access".
- **Actions:** Edit, Section Access, Send login invite, Reset Password, Log in as this user, Open Email Campaigns as user, Open Social Settings as user.

The filters stay as they are: search, Advisor Categories, LinkedIn connected, Facebook connected, and Has any section access. Pagination stays at 30 per page.

## A: cards below 1280 ([a-cards.html](a-cards.html), recommended)

- **Breakpoints:** 1280 and up keeps **today's desktop table, unchanged**, with the button column. Below 1280, cards (as in #698, including its "list box under 1100 px" rule).
  - Cards go **2 per row** when the list is at least ~820 px wide (about 1000 px viewport), otherwise 1 per row.
  - Inside a card, the fields pair up in 2 columns (Email | Website, Advisor Categories | Section Access). Below ~600 px they stack in 1 column.
- **Card layout:**
  - The **name** (bold) and **company** are at the top left, with a **⋮** button at the top right (44 px tap target).
  - Quiet labels in small grey uppercase: **Email**, **Website**, **Social accounts**, **Advisor Categories**, **Section Access** and **User ID**.
  - Social accounts keep the expiry chip and the refresh-email button, which the #698 cards currently drop.
- **Truncation:**
  - Name, company, email, website, social account names and the user ID each stay on one line, with an ellipsis and the full value in `title`.
  - Use `min-width: 0` all the way up the flex and grid chain.
  - Never `word-break: break-all` or `overflow-wrap: anywhere`. That's what caused the one-letter-per-line URL in the failure screenshots.
- **Chips** wrap onto as many lines as they need. Cards show every chip.

## B: compact table from 900 ([b-table.html](b-table.html))

- **Breakpoints:**
  - **900 px and up** (list ≥ ~780 px): a compact table with a **⋮** column.
  - **Below 900 px: B falls back to A's cards**, the same cards and rules. A 5-column table can't stay readable at 720 or 390 without crushing text.
  - The mock uses the compact table at 1280 too (open question 1).
- **Columns** (`table-layout: fixed`):
  - Name / Company / Email / Website: flexible, about 300 px at a 1000 px viewport. Each line is one-line ellipsis.
  - Advisor Categories: 140 px.
  - Social: 240 px. The account name gets the ellipsis, while the expiry chip and refresh button stay whole.
  - Section access: 140 px.
  - ⋮: 60 px.
- **Chips:** below 1180 px, the table shows the first 2 chips, then a **"+N"** chip whose `title` lists the rest. From 1180 px up it shows all of them, wrapped.
- Headers stay on one line, with an ellipsis if they ever get too tight.

## ⋮ menu (A and B)

- An IconButton with `aria-haspopup="menu"`, `aria-expanded`, `aria-label="More actions for {name}"` and a 44 px target.
- It opens anchored to the button's bottom right. It flips up when there's no room below and stays inside the viewport (MUI `Menu` does this).
- The menu header is the user's name, then Edit, Section Access, Send login invite, Reset Password, a divider, and the three "as user" actions.
- Each item is at least 44 px tall. Disabled while a related action is loading (as now).
- It closes on choosing an item, a click outside, Esc (focus goes back to ⋮) or scrolling. Arrow keys move between items.

## States

- **List** (the default).
- **Empty:** "No advisors found" (`?st=empty`).
- **No socials:** "No social accounts". **No website:** "—". **No categories:** "None". **No section access:** "No section access".
- **Loading:** a spinner, as now. Not mocked.

## Mock controls

The top bar has 390 / 720 / 1000 / 1280 buttons, and `?w=390|720|1000|1280` does the same. Either one renders the page in a frame of that width. With no `?w`, the frame picks the largest width that fits. `?st=empty` shows the empty state. [compare.html](compare.html) shows A and B side by side at all four widths.

## In scope

- `AdminUserList.jsx` layout only: the breakpoints, cards, the compact table (B), truncation, chips, the ⋮ menu, and the empty and no-data states.
- Tests: the mobile-layout test at 390, 720, 1000 and 1280 checks for no horizontal overflow, no text overlap, and that the menu opens and closes.

## Out of scope

- Changing what the actions do, the filters, pagination, the Section Access dialog, or the login invite and password dialogs.
- Other pages in #696.
- Any data or API change.

## Mobile notes

- At 390 the rail becomes the app's phone header. The filters go full width and stack.
- Cards are 1 column, and their fields stack.
- Every tap target (⋮, copy, refresh email, menu items) is at least 44 px.

## Estimate (days)

| Piece | A | B |
|---|---|---|
| Card polish on top of #698 (labels, 2-up grid, socials with expiry and refresh, ellipsis audit) | 0.5–0.75 | 0.5–0.75 |
| ⋮ menu header, divider, flip and keyboard (mostly MUI) | 0.25 | 0.25 |
| Compact table 900–1279: fixed columns, ellipsis, +N chips with tooltip | — | 1–1.5 |
| Breakpoint switching (viewport and list width) | 0.25 | 0.25–0.5 |
| Tests and QA at 4 widths, plus device checks | 0.5 | 0.5–0.75 |
| **Total** | **≈1.5–1.75** | **≈2.5–3.75** |

## Open questions

1. For **B at 1280 and up**: keep today's button column, so desktop is unchanged (as #696 asks), or use ⋮ everywhere for consistency? The mock shows ⋮.
2. At about 1000 px, should cards be **2 per row** (as mocked) or 1 per row with more room for long URLs?
3. Should **User ID** stay on every card, or move into the ⋮ menu as "Copy user ID" to make cards shorter?

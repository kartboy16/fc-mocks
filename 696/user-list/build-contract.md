# #696 Admin user list at tablet and phone widths: build contract

Follow-up to [#696](https://github.com/kartboy16/content-library/issues/696) and staging [PR #698](https://github.com/kartboy16/content-library/pull/698), which shows cards below 1280 px with a ⋮ menu. Page: `/content-library/admin/users` (`imports/ui/AdminUserList.jsx`). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Decided (per Alex, Oct 30)

1. **⋮ menu everywhere**, in A and B at every width, including 1280 and up. The button column is dropped.
2. **1 card per row** at about 1000 px (and at every width that shows cards).
3. **No User ID on cards or in the table.** "Copy user ID" is the last item in the ⋮ menu and shows a small "Copied" toast.

Still open: **A or B**.

## What each row shows (from `AdminUserList.jsx`)

- **Name** and **company** (`profile.companyName`).
- **Email**, and **website** (`websiteAddress`, linked, or "—" if there isn't one).
- **User ID:** not shown. Use "Copy user ID" in the ⋮ menu.
- **Advisor Categories:** `advisorSourceNames` chips, or "None".
- **Social:** one item per token, with the network icon, `profileLabel`, a status and a "Send {network} refresh email" action that belongs to that account (see "Social accounts: refresh email" below). If there are no tokens: "No social accounts".
- **Section access:** chips for Calendar, Content, Email Campaigns, Social Media and Website, or "No section access".
- **Actions (⋮ menu):** Edit, Section Access, Send login invite, Reset Password, Log in as this user, Open Email Campaigns as user, Open Social Settings as user, Copy user ID.

The filters stay as they are: search, Advisor Categories, LinkedIn connected, Facebook connected, and Has any section access. Pagination stays at 30 per page.

## A: cards below 1280 ([a-cards.html](a-cards.html), recommended)

- **Breakpoints:** 1280 and up keeps today's desktop table columns, but the button column becomes a **⋮** column (60 px). Below 1280, cards (as in #698, including its "list box under 1100 px" rule).
  - Cards are always **1 per row** (decided).
  - Inside a card, the fields pair up in 2 columns (Email | Website, Advisor Categories | Section Access). Below ~600 px they stack in 1 column.
- **Card layout:**
  - The **name** (bold) and **company** are at the top left, with a **⋮** button at the top right (44 px tap target).
  - Quiet labels in small grey uppercase: **Email**, **Website**, **Social accounts**, **Advisor Categories** and **Section Access**.
  - Social accounts keep the status and the refresh-email action, which the #698 cards currently drop.
- **Truncation:**
  - Name, company, email and website each stay on one line, with an ellipsis and the full value in `title`. These are text, not chips.
  - **Social account names wrap** inside their chip (pill, row or chip-menu). They're never cut off.
  - Use `min-width: 0` all the way up the flex and grid chain.
  - Never `word-break: break-all` or `overflow-wrap: anywhere`. That's what caused the one-letter-per-line URL in the failure screenshots.
- **Chips always wrap, never truncate** (per Alex, Oct 30, 11:51 AM PT). Advisor Categories, Section Access and social accounts show every item, wrapping onto as many lines as they need, in both cards and the table. There's no "+N" and no hidden chips anywhere. A long chip label wraps inside the chip.

## B: compact table from 900 ([b-table.html](b-table.html))

- **Breakpoints:**
  - **900 px and up** (list ≥ ~780 px): a compact table with a **⋮** column.
  - **Below 900 px: B falls back to A's cards**, the same cards and rules. A 5-column table can't stay readable at 720 or 390 without crushing text.
  - At 1280 and up it's the same table with all chips shown (⋮ column, decided).
- **Columns** (`table-layout: fixed`):
  - Name / Company / Email / Website: flexible, about 300 px at a 1000 px viewport. Each line is one-line ellipsis.
  - Advisor Categories: 150 px (210 px at 1280 and up). Chips wrap.
  - Social: 280 px (320 px at 1280 and up). Every account is shown, and names wrap. The status label and refresh action stay whole, and the label wraps under the name if it's tight.
  - Section access: 150 px (210 px at 1280 and up). Chips wrap.
  - ⋮: 60 px.
- **Chips:** every chip is shown at every width, wrapped. **Rows grow taller** to fit, and the ⋮ stays at the top right of the row. With the heavy sample user (9 categories, 7 sections, 5 social accounts), the row is about 3–4× a normal row at 1000 px. That's accepted, so everything is visible at a glance.
- Headers stay on one line, with an ellipsis if they ever get too tight.

## Social accounts: refresh email (A and B, `?social=a|b|c`)

Per Alex (Oct 30, 11:11 AM PT), the envelope has to clearly belong to one account. All three options use the same status rule:

- **Expired** (token past expiry): a red outline plus the label **"Expired"**.
- **Needs refresh** (the existing warning window): an amber outline plus the label **"Needs refresh"**.
- The label text means colour isn't the only signal. The expiry date is in the chip's `title` and, in option c, in the menu header.
- **Healthy accounts soften the action instead of hiding it** (my call). There's no label, and the action is grey but still tappable, so an admin can send an early refresh. Only expired or needs-refresh accounts get a coloured action.

Options:

- **(a) Pill (recommended, the default):** `[icon + page name (+ label) | ✉]`. A divider separates the name from the envelope, which is its own button (`aria-label="Send {network} refresh email for {name}"`). The envelope is at least 44 × 44 px at 390. Pills stack one per line in the 280 px table column.
- **(b) Row:** a bordered row per account, with the name and label on the left and a **"Send refresh email"** text button on the right. The button drops below the name when the column is narrow, as in the table. For expired or needs-refresh accounts it's an outlined coloured button. This is the clearest option but the tallest, and it roughly doubles the social cell height in the table.
- **(c) Chip with menu:** tapping the account chip (▾) opens a small menu anchored to it. The header shows "{network} · {name}" and the status or expiry. The items are **Send refresh email** and **Copy page name** (with a "Copied" toast). The menu behaves like the ⋮ menu: it flips and stays on screen, and Esc, a click outside or scrolling closes it. This is the cleanest look, but it takes two taps and the action is hidden.

**Recommendation: (a).** The action is physically inside the account's own chip, so it can't be read as belonging to the next row. It's one tap, it fits both the 280 px table column and 390 cards without making rows taller, and it reuses the chip styling. Option b is the fallback if Alex wants the words "Send refresh email" visible.

**Agent time (on top of A or B):** (a) cloud agent 15–20 min + FC Tester 10 min + about 1 loop at 0–10 min, so **≈25–40 min**. (b) **≈20–35 min**. (c) **≈35–55 min**, because of the menu and keyboard work.

## ⋮ menu (A and B)

- An IconButton with `aria-haspopup="menu"`, `aria-expanded`, `aria-label="More actions for {name}"` and a 44 px target.
- It opens anchored to the button's bottom right. It flips up when there's no room below and stays inside the viewport (MUI `Menu` does this).
- The menu header is the user's name, then Edit, Section Access, Send login invite, Reset Password, a divider, the three "as user" actions, a divider, and **Copy user ID**.
- **Copy user ID** copies the ID to the clipboard and shows a small "Copied" toast (about 2 s).
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
- Every tap target (⋮, refresh email, account chips, menu items) is at least 44 px at 390. Nothing depends on hover. The `title` text is a bonus only, because every action is visible or one tap away.

## Estimate (agent time, per Alex's Oct 30 rule)

This is how long a Cursor cloud agent takes to build it, plus FC Tester time. For calibration, #699 went from handoff to tested in about 30 minutes. It's one file (`AdminUserList.jsx`) and its layout test, with no backend.

| Piece | A | B |
|---|---|---|
| Cloud agent build: labels, 1 card per row, socials with expiry and refresh, ⋮ menu everywhere, Copy user ID and toast, User ID removed (B adds the compact table and fixed columns) | 20–30 min | 35–50 min |
| FC Tester: 390, 720, 1000 and 1280, the menu, Copy user ID, empty and no-socials states | 10–15 min | 15–20 min |
| Review and fix loops (A: about 1; B: 1–2, for column widths and tall rows) | 10–20 min | 15–30 min |
| **Total** | **≈40–65 min** | **≈65–100 min** |
| Plus social refresh option (a), recommended | +25–40 min | +25–40 min |
| **Total with (a)** | **≈65–105 min** | **≈90–140 min** |
| Never-hide chips (Oct 30, 11:51 AM PT): wrap everywhere, social names wrap, tall rows, heavy-user QA. Build 5–10 min (A) / 10–15 min (B, which drops the +N logic), FC Tester 5–10 / 10–15 min | +10–20 min | +15–25 min, minus about 5–10 min for no +N tooltip |
| **New total with social (a)** | **≈75–125 min** | **≈100–155 min** |

One agent run each. It builds on PR #698, which is already on staging, so there's no dependency.

## Open questions

1. **A or B?** Alex to pick. (The three earlier questions are decided; see the top.)

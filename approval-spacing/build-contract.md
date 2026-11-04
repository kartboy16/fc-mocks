# Approval landing spacing: build contract

Page: Mailchimp email campaign approval landing (`/advisor/:advisorId/email_campaign/approval_landing`), prod `main` `24f397f`. Layout/CSS only. **Low risk**: no logic, labels or handlers change. Also covers the one-time-link review state from #794 (the "Signed in for this campaign only" chip).

## Today

- **Container:** `<Container sx={{ py: 4, maxWidth: 560 }}>` with no card.
- **Heading:** h5 "Choose what happens next", then the token `Chip` (`mb: 1.5`).
- **Summary:** h6 subject; "Goes to … · N people on the list" and "From …" as separate `text.secondary` lines.
- **Message:** `view.message` "Nothing is approved until you click Approve." (`mb: 2`).
- **Buttons:** `choiceButtons` is one flex row with `gap: 1` (8 px) and `flexWrap: 'wrap'`, holding Approve (contained success), Decline (outlined), Approve and Send in 1 hour (contained primary), Schedule for later (outlined), Don't send (outlined error). It wraps unevenly at 1280 and only goes to a column at ≤390 px.
- **Compliance mode** (`view.controls` without `send-now` / `confirm-schedule` / `confirm-dont-send`) shows Approve + Decline only.

## Recommended: A

**Spacing tokens (px, 8-pt grid):**

| Token | Desktop | ≤600 px |
|---|---|---|
| Page padding (top / sides) | 48 / 24 | 16 / 12 |
| Card | `maxWidth: 640`, padding 32, radius 12, 1 px `#e3e6ea` border, shadow `0 1px 3px rgba(16,24,40,.06)`, white | padding 20 / 16, radius 10 |
| Heading (h1 style, 24 px / 600) → chip | 8 | 8 |
| Chip (or heading with no chip) → summary | 24 (16 with no chip) | same |
| Summary block | `#f8f9fb`, radius 8, padding 16 / 20; subject 18 px / 600, `mb: 8`; meta row 14.5 px, `gap: 4px 16px`, wraps | padding 14 / 16 |
| Summary → note → primary row | 24 / 16 | same |
| Primary row | CSS grid, 2 equal columns, `gap: 12`, buttons min-height 44 | 1 column |
| Secondary row | `mt: 24`, `pt: 16`, top border `#eceef1`, label "Other options" 13 px, `gap: 8px 12px`; Don't send pushed right | column, full-width buttons, 44 px |

**Breakpoint:** a single `sm` (600 px) switch. Replace the `@media (max-width: 390px)` rule with `theme.breakpoints.down('sm')`.

**Grouping/order:**
- **Primary row:** **Approve** (success), **Approve and Send in 1 hour** (primary).
- **Other options:** Schedule for later (outlined), Decline (outlined), Don't send (outlined error).
- **Compliance:** primary row = Approve + Decline. There's no secondary row.
- **Token state:** the chip sits under the heading; everything else is the same.

**Label/colour changes:** none. The only change is **order**: Decline moves from 2nd to the "Other options" row in the normal mode. "Other options" is a new 13 px label. The summary meta lines are combined into one wrapping row.

**Files:** `imports/ui/EmailCampaigns/mailchimp/EmailCampaignApprovalLanding.jsx`: wrap the return in a `Paper` card, restyle the summary `Box`, and split `choiceButtons` into `primaryButtons` + `secondaryButtons` keyed on the same `view.controls`. Also apply the card to the done/error/sign-in variants so every state matches. No change to `mailchimpApprovalLandingView.js` beyond keeping `controls`; update any test that snapshots the button order (`tests/mailchimp-approval-landing-view.test.js` checks controls, not DOM).

## Options B and C

- **B:** the same card, with buttons grouped under small uppercase headings: **Approve** (Approve, Approve and Send in 1 hour, plus a one-line hint), **Send later** (Schedule for later), **Not this one** (Decline, Don't send). Groups have 20 px padding and are separated by 1 px rules. It's clearest about consequences but the page gets taller, and the hint is new copy.
- **C:** a 480 px column with every button full width, stacked (48 px), and an "or" divider. On phone the two approve buttons move to a sticky bottom bar. It's thumb-friendly, but at 1280 it looks like a phone layout, and the sticky bar duplicates the primary actions.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

| | A | B | C |
|---|---|---|---|
| Build | 15–25 min | 20–30 min | 25–35 min |
| FC Tester (normal, compliance, token, schedule/don't-send sub-forms at 1280/390) | 15–20 min | 15–20 min | 20–25 min |
| Fix loop | 0–10 min | 5–10 min | 5–15 min |
| **Total** | **≈30–55 min** | **≈40–60 min** | **≈50–75 min** |

## Open questions

1. Is it OK to move Decline into "Other options" (A), or should it stay next to Approve?
2. Should the Schedule for later / Don't send sub-forms open inside the card under the secondary row (proposed), as today?

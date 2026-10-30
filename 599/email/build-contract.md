# #599 Weekly picks email: build contract

Based on [the spec comment](https://github.com/kartboy16/content-library/issues/599#issuecomment-6527617708) (Oct 30, 2026) and [#599](https://github.com/kartboy16/content-library/issues/599). Mocks: [hub](index.html). It reuses the [#688 A digest](../../688/a-digest.html) layout and its "Review & Approve" wording. **Not agent-ready. Soft Dev hold until Alex picks.**

Depends on:
- the #599 Monday slate job
- #602 landing on main
- Alex picking a #688 direction

Don't build this until Alex confirms.

## Rules

- **Off by default**, per advisor.
- The email goes to the advisor's approval recipients (`sendTestEmailsTo`), the same list the approval email uses.
- **No button acts on a GET.** Every link opens a light confirm page with one POST click (the #657, #688 and #602 pattern), so link scanners can't approve, swap or skip anything.
- **Nothing is scheduled until a post is approved, and nothing auto-publishes.** Approving hands the post to the normal scheduling flow.
- White-label: the advisor's own name and logo, links on `links.example.com` (a placeholder for the white-label link domain), and no FC branding, links or FC's own domain.
- Generic test data only. QA uses the test advisors and the test inbox named in the spec, never real advisors.

## Screens and states

### 1. Settings ([settings.html](settings.html), `?st=off|on|norecipients`)

Placement: Email Campaigns › Settings › **Email Approvals**. The toggle sits directly under the existing field "Emails to send Email Campaign approvals" and matches its style. It needs to be in both `SESSettings.jsx` and `MailchimpSettings.jsx`.

| State | Shows |
|---|---|
| `off` (default) | The toggle "Email weekly picks to approval recipients", off. |
| `on` | "Goes to [jane@yourfirm.ca] [assistant@yourfirm.ca] every Monday." The chips are parsed live from the field. |
| `norecipients` | The toggle is on but the field is empty: "⚠ Add an approval email above so the weekly picks have somewhere to go." |

It saves with the same debounced save as the field. New preference: `emailWeeklyPicks: boolean`, default `false`.

### 2. Email ([email.html](email.html))

- Subject: "This week's pick: {title}". From: the advisor's name, on the advisor's sending address (placeholder `picks@yourfirm.ca`). To: each approval recipient, each with their own links. Sent after the Monday slate is built (mock: 5:30 AM PT).
- Header: the advisor's logo and name, then "Weekly picks".
- "Hi Jane, here's this week's pick". "Plus 2 backups. Nothing is scheduled until you approve one."
- Three cards: **This week's pick**, **Backup 1** and **Backup 2**. Each has a thumbnail, title, short excerpt, "Created {date} · Updated {date}", "**Why:** {reason}" (from `slateItems.reason`), and **Review & Approve**, **Swap** and **Skip**.
- Footer: a **placeholder** CASL block (needs compliance review) with the advisor's name and address, "Change who gets this" and "Unsubscribe from weekly picks", plus "Links go to links.example.com (placeholder) and expire Nov 9, 2026."
- Light and dark mode, and a phone layout. A plain-text part has the same links.

### 3. Confirm page ([confirm.html](confirm.html), `?act=approve|swap|skip|unsub&st=confirm|done|already|expired`)

| Action | Confirm | Done |
|---|---|---|
| Review & Approve | "Approve this post?" Shows the post's title, dates and Why. "It goes into your normal scheduling. Nothing publishes until it's scheduled." Button: **Review & Approve** | "✓ Approved. {title} was approved by Jane Advisor at 8:14 AM PT. It's in your normal scheduling now." |
| Swap | "Swap this week's pick. Choose the post to use instead." Two radio options (backup 1 and backup 2, each with its Why). Button: **Swap** | "✓ Swapped. This week's pick is now {title}. It still needs your approval." Button: Review & Approve it |
| Skip | "Skip this week? No post is picked for you this week. You'll get new picks next Monday." Button: **Skip this week** | "Skipped. No post this week. New picks come next Monday, Nov 9." Button: Undo |
| Unsubscribe | "Stop weekly picks emails? For jane@yourfirm.ca only." | "You're unsubscribed." |

- **Already done:** "This week's pick was already approved by Jane Advisor, Nov 2, 2026, 9:05 AM PT. Nothing changed."
- **Expired:** "This link has expired. Nothing was changed." Button: Sign in.
- From #602 (not mocked again): if the user isn't signed in, they sign in and come back to the same URL. A wrong account gets the wrong-account state.

## In scope

- The preference and toggle, in both settings screens.
- The send step at the end of the Monday slate job: for each advisor with the toggle on and at least 1 recipient, send one email per recipient through the **Elastic-else-SES** path, and log it (no duplicates per slate).
- The email template (reusing the #688 A layout), with HTML and plain text.
- Signed, per-recipient links that expire after 7 days and work once, with a read-only link check on GET.
- The confirm page actions, which write `slateItems.status` (`approved | swapped | skipped`), `reviewedBy` and `reviewedAt`. Approve hands off to the normal scheduling flow.
- Unsubscribe per address.

## Out of scope

- Building the slate job itself (#599 part 3).
- Search on Swap (the email offers only the 2 backups).
- Bulk approve from email.
- Any auto-scheduling or auto-publishing (never).
- Final CASL and compliance wording (placeholders only).

## Mobile (390px)

- Cards stack, and the thumbnail goes full width.
- Buttons go 2 per row, at least 44px tall.
- The confirm buttons are full width.
- The settings toggle wraps under the field, and the recipient chips wrap.

## If #688 B or C is picked instead

- **B (list plus board):** the email becomes a compact list of the pick and 2 backups with one "Review this week's picks" button. That opens the board page, where Review & Approve, Swap and Skip each finish with one click. The board needs a Swap control (a choice between the backups), and the confirm page is replaced by the board. The estimate is about the same, +0.25 days.
- **C (hero):** the pick is the hero, with all three buttons, and the 2 backups are small rows underneath, each with a "Use this instead" link that opens the Swap confirm. The confirm page stays as mocked. The estimate is about the same.

## Estimate (days)

| Piece | Days |
|---|---|
| Preference and toggle in SES and Mailchimp settings, with the no-recipients line | 0.5 |
| Email template (#688 A layout, pick plus 2 backups, dates, Why, plain text, dark mode) | 1–1.5 |
| Send step after the Monday slate (Elastic-else-SES, per recipient, dedupe, log) | 1–1.5 |
| Signed per-recipient links (7-day expiry, single use, read-only check) | 0.75–1 |
| Confirm page: approve, swap, skip, unsubscribe; done, already and expired; sign-in and wrong account | 1.5–2 |
| `slateItems` status writes and the scheduling handoff | 0.5–0.75 |
| Unsubscribe per address | 0.25–0.5 |
| Phone layout and QA (test advisors only) | 0.75–1 |
| **Total** | **≈6.25–8.75** |

- If the #688 digest and its confirm pages are built first, reuse saves about 1–1.5 days.
- None of this is in the #599 6–9 day estimate.

## Open questions

1. **Field name.** The code's label is "Emails to send Email Campaign approvals" (Email Approvals section). "Send approval emails to" isn't a label in the code today. Do we keep the code's wording?
2. Should the toggle also be in MAP for admins, or only in Settings?
3. **Who can act.** Recipients like assistant@yourfirm.ca may not have an FC sign-in. #602 requires a signed-in owner or admin. Should non-owners get view-only buttons, as in #688?
4. Does approving from the email schedule the post through the normal flow straight away, or does it mark it approved for the admin to schedule in MAP (see 599-map-picks)?
5. Should Skip mean this week, or this month (the review queue says "Skip this month")?
6. Which sending address and domain should be used for each advisor on the Elastic or SES path?
7. Should an approved pick go to compliance review first for advisors with compliance on?

# #599 Weekly picks email: build contract (v4, simplified Oct 30, 2026)

Based on [the spec comment](https://github.com/kartboy16/content-library/issues/599#issuecomment-6527617708) and [#599](https://github.com/kartboy16/content-library/issues/599). Mocks: [hub](index.html). It reuses the [#688 A digest](../../688/a-digest.html) layout and its "Review & Approve" wording. **Not agent-ready. Soft Dev hold until Alex picks.**

Depends on the #599 Monday slate job, #602 landing on main, and Alex picking a #688 direction. Don't build this until Alex confirms.

## Decided (working defaults per Alex, Oct 30, 2026)

1. The settings field is renamed **"Send approval emails to"**. It's still `sendTestEmailsTo`.
2. The toggle is in the advisor's Email Settings **and in MAP**, under the admin's advisor settings.
3. **Review & Approve** opens a page with **Approve & Publish Now** and **Approve & Schedule**. Schedule's date defaults to the **1st of next month**, counted from the day the page is opened.
4. **Compliance reviewers don't use this page.** There's no compliance routing. When the advisor has the Compliance category, the confirm page shows the same "send to compliance" options as posting on FC (see the confirm page section). The post itself publishes as normal.
5. Recipients who can't sign in are **view-only**. They see the post with the buttons disabled and "Only Jane Advisor or an admin can approve. Forward this email to them."
6. **All 3 suggestions are equals** (Alex, Oct 30, 4:50 PM PT). There's no main pick and no backups. Each has its own **Review & Approve**, and the advisor can approve any one, or several.
7. **Where it posts:** the confirm page shows chips for Website, each of the advisor's social accounts and Email. All are selected by default, and **Edit** lets the advisor deselect or reselect each one. This applies to both Publish Now and Schedule.
8. **Time:** the post publishes at the advisor's usual posting time, or **9:00 AM PT** if there isn't one.
9. **Clashes:** if the chosen day already has a scheduled pick, the post moves to the **next free day**.
10. **View-only** means any recipient who isn't the owner or an admin.
11. **Sender:** the email comes from **FTT's own sending address (not the advisor's domain)**. The mock shows a neutral placeholder, `Weekly Picks <picks@sending-domain.example>`.
12. **No Swap and no Skip** (removed Oct 30, 4:50 PM PT). Anything not approved is ignored. The email says "Not approving? Do nothing — nothing publishes without you."

## Rules

- **Off by default**, per advisor.
- Recipients are the advisor's approval recipients (`sendTestEmailsTo`).
- **No button acts on a GET.** Every link opens a light confirm page, and one POST click finishes (the #657, #688 and #602 pattern).
- Nothing is published or scheduled until someone who can approve clicks. **Nothing auto-publishes.**
- White-label: links go on `links.example.com` (a placeholder for the white-label link domain), with no FC branding, links or FC's own domain.
- Generic test data only. QA uses the spec's test advisors and test inbox, never real advisors.

## Screens and states

### 1. Settings ([settings.html](settings.html) and [map-settings.html](map-settings.html), `?st=off|on|norecipients`)

- **Advisor:** Email Campaigns › Settings › Email Approvals. The field label becomes **"Send approval emails to"**, in both `SESSettings.jsx` and `MailchimpSettings.jsx`.
- **MAP (admin):** Manage Advisor Posts › {advisor} › Settings, in a section called "Approvals and weekly picks". It has the same field and toggle and saves to the same advisor's preferences.

| State | Shows |
|---|---|
| `off` (default) | The toggle "Email weekly picks to approval recipients", off. |
| `on` | "Goes to [jane@yourfirm.ca] [assistant@yourfirm.ca] every Monday." The chips are parsed live from the field. |
| `norecipients` | "⚠ Add an approval email above so the weekly picks have somewhere to go." |

New preference: `emailWeeklyPicks: boolean`, default `false`.

### 2. Email ([email.html](email.html), plus [view-only](email.html?viewonly))

- Subject: "This week's picks: 3 posts to review". From: FTT's own sending address (not the advisor's domain), shown on the mock as `Weekly Picks <picks@sending-domain.example>`. Each recipient gets their own links. Sent after the Monday slate is built (5:30 AM PT in the mock).
- Heading "Hi Jane, here are this week's picks", then "Approve any one, or more than one." and "Not approving? Do nothing — nothing publishes without you."
- **3 equal cards**, all the same size, with no label or ranking. Each has a thumbnail, title, excerpt, "Created {date} · Updated {date}" and "**Why:** {reason}", plus one button, **Review & Approve**, which opens that post's own confirm page (`?p=` in the mock).
- **View-only recipient:** the heading is "This week's picks for Jane Advisor", followed by "Only Jane Advisor or an admin can approve. Forward this email to them." Each card has only **View post**, which opens the view-only confirm state.
- The footer is a **placeholder** CASL block with "Change who gets this" and "Unsubscribe from weekly picks". The email has a phone layout and a dark mode, and a plain-text part with the same links.

### 3. Confirm page ([confirm.html](confirm.html), `?act=approve|unsub&st=…&comp=off|on&p=0|1|2&prev=off|on`)

`comp=on` means the advisor has the Compliance category (`isEmailComplianceMode`).

| State | Shows |
|---|---|
| `approve` + `confirm` | "Approve this post?" with the post (thumbnail, title, excerpt, dates, Why). Then **Posts to** chips: Website, Facebook Page, LinkedIn page, Instagram, Email (all selected) and **Edit**. Buttons: **Approve & Publish Now** and **Approve & Schedule**. |
| `edit` | Edit mode: every destination is a toggle chip (✓ when selected), then **Done**. |
| `none` | Everything is deselected. Both buttons are disabled, with the hint "Select at least one destination" (the same text as the posting dialog). |
| Compliance (`comp=on`, in `confirm` and `schedule`) | It mirrors posting on FC. "Send website post as PDF to compliance?" shows if Website is selected, and "Send copy to compliance?" shows if Email is selected. Both are checked by default. Below them: "Pat Reviewer · compliance@yourfirm.ca · Edit", which opens the Officer name and Compliance email fields. It uses the existing `sendToCompliance` / `website.sendCompliancePdf` paths and the advisor's `complianceEmail`. There's no review gate. |
| `schedule` | The post and a "Publish on" date field that defaults to the **1st of next month**, computed in JS from today. The earliest date is tomorrow. One line underneath: "Publishes at your usual posting time, or 9:00 AM PT. If that day already has a post, it moves to the next free day." Then the same Posts to chips (and compliance options). Buttons: **Confirm schedule** and Back. |
| `published` | "✓ Published. {title} was approved and published by Jane Advisor at 8:14 AM PT. Published to Website, Facebook, LinkedIn, Instagram and Email." The list shows only the selected destinations. With compliance options checked: "A copy goes to compliance (compliance@yourfirm.ca)." |
| `scheduled` | "✓ Scheduled for {date}. {title} was approved by Jane Advisor and will publish on {date} at 9:00 AM PT. Will publish to {destinations}." Plus the compliance line when it applies. |
| `viewonly` | The post, both buttons disabled, and "Only Jane Advisor or an admin can approve. Forward this email to them." |
| **This week's other picks** (under confirm, schedule, published, scheduled, already) | The other 2 posts, one line each. If one is approved, it shows its status ("✓ Scheduled for Nov 1", or "✓ Published"). If not, it shows a **Review & Approve** link to its own confirm page. |
| `unsub` (+ `done`) | "Stop weekly picks emails? For jane@yourfirm.ca only." Done: "You're unsubscribed." |
| `already` | Per post: "**Already approved.** {title} was already approved by Jane Advisor, Nov 2, 2026, 9:05 AM PT. Nothing changed." Approving one post never blocks the others. |
| `expired` | "This link has expired. Nothing was changed." Button: Sign in. |

- From #602 (not mocked again): if the user isn't signed in, they sign in and come back to the same URL. A wrong account gets the wrong-account state.
- **Approving more than one** (`prev=on`, post 2 after post 1):
  - Each post has its own signed link and its own `slateItems` row. Approving post 1 marks only post 1 approved, and post 2's link still works.
  - Publish Now for a second post publishes it straight away, like the first. They don't block or queue each other.
  - Schedule: the date still defaults to the 1st of next month. If post 1 is already scheduled on the 1st, the page says "'{post 1}' is already scheduled for Nov 1. This one moves to the next free day, Nov 2." and schedules it for Nov 2 (rule 9). A third post would go to Nov 3. (The mock is opened Oct 30, so the 1st of next month is Nov 1.)
  - Re-opening a link for a post that's already approved shows `already` for that post only.
- **Who can approve:** a signed-in advisor owner or an admin. Any recipient who isn't one gets the view-only email and state.

## In scope

- The preference and toggle in both advisor settings screens and in MAP, including the renamed field label.
- The send step after the Monday slate: Elastic-else-SES, one email per recipient, can-approve or view-only per recipient, and no duplicates per slate.
- The email template (#688 A layout), including the view-only variant and a plain-text part.
- Signed per-recipient links that expire after 7 days and work once, with a read-only check on GET.
- The confirm page:
  - Publish now goes through the normal publish path.
  - Schedule goes through the normal scheduling path, with the date defaulting to the 1st of next month in Pacific time.
  - The selected destinations (Website, each social account, Email) are passed to the normal publish and schedule paths.
  - With the Compliance category, the two "send to compliance" options reuse the existing posting code. There's no review gate.
  - Usual posting time or 9:00 AM PT, and next free day if the day is taken.
  - Approving one, two or all three posts, each through its own link, with "This week's other picks" status lines and the next-free-day shift when two land on the 1st.
  - It writes `slateItems.status`, `reviewedBy`, `reviewedAt` and `requestedPublishAt`.
- Unsubscribe per address.

## Out of scope

- The slate job itself (#599 part 3).
- Swap and Skip (removed; anything not approved is just ignored).
- Bulk approve from email.
- Any auto-publish (never).
- Final CASL and compliance wording (placeholders only).
- A compliance review step or compliance users on this page (compliance reviewers don't use it).

## Mobile (390px)

- Cards stack, and the thumbnail goes full width.
- The email buttons go 2 per row. The confirm buttons are full width, one per row.
- The date field is full width.
- Recipient chips wrap.

## If #688 B or C is picked instead

- **B (list plus board):** the email becomes a compact list with a "Review this week's picks" button that opens the board. On the board, Approve & Publish Now and Approve & Schedule (with the same date field) finish in one click per post, and the board replaces this confirm page. About +15–20 min of agent time.
- **C (hero):** doesn't fit "3 equals" well, because it has one hero post. If it's picked, the 3 posts would be shown as 3 equal hero cards, and the confirm page stays as mocked.

## Estimate (agent time, per Alex's Oct 30 rule)

This is the Cursor cloud agent build plus FC Tester time, plus fix loops, in minutes and hours. For calibration, #699 went from handoff to tested in about 30 minutes. Dropping Swap and Skip (two confirm flows, undo, and the swap and skip writes) and the pick-versus-backup layout brings it down from about 4–6.5 h. It's still **3 runs**.

| Run | Scope | Build | FC Tester | Fix loops | Run total |
|---|---|---|---|---|---|
| 1. Settings | `emailWeeklyPicks` preference, toggle in SES and Mailchimp settings and MAP, the "Send approval emails to" rename, no-recipients line | 20–30 min | 10–15 min | 0–10 min | **≈30–55 min** |
| 2. Email and send | Template (3 equal cards with one Review & Approve each, Why, the "nothing publishes without you" line, view-only variant, plain text, dark mode). Send step after the slate (Elastic-else-SES from FTT's sending address, one email per recipient, dedupe, log). Signed links per recipient per post (7 days, single use). Unsubscribe | 50–75 min | 20–30 min (test inbox) | 15–30 min (tokens, dedupe) | **≈1.5–2.25 h** |
| 3. Confirm page | Publish Now and Schedule (1st of next month, usual time or 9 AM PT, next free day), Posts to chips with Edit and none-selected, send-to-compliance options, view-only, already approved (per post), expired, "This week's other picks" status, `slateItems` writes per post | 45–60 min | 20–30 min (incl. approving 2 posts, both on the 1st) | 15–30 min | **≈1.25–2 h** |
| **Total** | | | | | **≈3.25–5 h** |

- Run in sequence. Runs 2 and 3 share the token format, so run 3 starts after run 2's link format is merged.
- If the #688 confirm pages are built first, run 3 can reuse them, saving about 20–30 min. If #688 B (list plus board) is picked, add about 15–20 min to run 3.
- **Dependencies (not in the total, rough agent time):** the #599 Monday slate job is about 1–2 h. #602 landing on main is about 15–30 min. The #688 pick is Alex's decision.

## Open questions

1. **Two or three posts on the 1st:** the mock uses rule 9, where the second one approved moves to the next free day (Nov 2, then Nov 3). Is that right, or should the date field already default to the next free day, or should two posts be allowed on the same day?
2. **Publish Now more than once:** if the advisor publishes two posts straight away on the same day, both go out now (as mocked). Should there be any spacing?
3. **Order in the email:** with no ranking, should the 3 cards keep the slate job's order, or go oldest-updated first?
4. The #688 direction and Alex's go-ahead.

# #599 Weekly picks email: build contract (updated Oct 30, 2026)

Based on [the spec comment](https://github.com/kartboy16/content-library/issues/599#issuecomment-6527617708) and [#599](https://github.com/kartboy16/content-library/issues/599). Mocks: [hub](index.html). It reuses the [#688 A digest](../../688/a-digest.html) layout and its "Review & Approve" wording. **Not agent-ready. Soft Dev hold until Alex picks.**

Depends on the #599 Monday slate job, #602 landing on main, and Alex picking a #688 direction. Don't build this until Alex confirms.

## Decided (working defaults per Alex, Oct 30, 2026)

1. The settings field is renamed **"Send approval emails to"**. It's still `sendTestEmailsTo`.
2. The toggle is in the advisor's Email Settings **and in MAP**, under the admin's advisor settings.
3. **Review & Approve** opens a page with **Approve & Publish Now** and **Approve & Schedule**. Schedule's date defaults to the **1st of next month**, counted from the day the page is opened.
4. **Compliance reviewers don't use this page.** There's no compliance routing. When the advisor has the Compliance category, the confirm page shows the same "send to compliance" options as posting on FC (see the confirm page section). The post itself publishes as normal.
5. Recipients who can't sign in are **view-only**. They see the post with the buttons disabled and "Only Jane Advisor or an admin can approve. Forward this email to them."
6. **Skip is this week only.**
7. **Where it posts:** the confirm page shows chips for Website, each of the advisor's social accounts and Email. All are selected by default, and **Edit** lets the advisor deselect or reselect each one. This applies to both Publish Now and Schedule.
8. **Time:** the post publishes at the advisor's usual posting time, or **9:00 AM PT** if there isn't one.
9. **Clashes:** if the chosen day already has a scheduled pick, the post moves to the **next free day**.
10. **View-only** means any recipient who isn't the owner or an admin.
11. **Sender:** the email comes from **FTT's own sending address (not the advisor's domain)**. The mock shows a neutral placeholder, `Weekly Picks <picks@sending-domain.example>`.

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

- Subject: "This week's pick: {title}". From: FTT's own sending address (not the advisor's domain), shown on the mock as `Weekly Picks <picks@sending-domain.example>`. Each recipient gets their own links. Sent after the Monday slate is built (5:30 AM PT in the mock).
- **This week's pick**, **Backup 1** and **Backup 2**. Each has a thumbnail, title, excerpt, "Created {date} · Updated {date}" and "**Why:** {reason}", plus **Review & Approve**, **Swap** and **Skip**.
- **View-only recipient:** the heading is "This week's pick for Jane Advisor", followed by "Only Jane Advisor or an admin can approve. Forward this email to them." Each card has only **View post**, which opens the view-only confirm state.
- The footer is a **placeholder** CASL block with "Change who gets this" and "Unsubscribe from weekly picks". The email has a phone layout and a dark mode, and a plain-text part with the same links.

### 3. Confirm page ([confirm.html](confirm.html), `?act=approve|swap|skip|unsub&st=…&comp=off|on`)

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
| `swap` + `confirm` / `done` | "Swap this week's pick": choose backup 1 or backup 2 (each with its Why), then **Swap**. Done: "✓ Swapped… It still needs your approval", with a button, Review & Approve it. |
| `skip` + `confirm` / `done` | "Skip this week? This week only. You'll get new picks next Monday, Nov 9." Button: **Skip this week**. Done: "**Skipped for this week**", with **Undo**. |
| `unsub` | "Stop weekly picks emails? For jane@yourfirm.ca only." Done: "You're unsubscribed." |
| `already` | "This week's pick was already approved by Jane Advisor, Nov 2, 2026, 9:05 AM PT. Nothing changed." |
| `expired` | "This link has expired. Nothing was changed." Button: Sign in. |

- From #602 (not mocked again): if the user isn't signed in, they sign in and come back to the same URL. A wrong account gets the wrong-account state.
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
  - Swap and Skip (this week only, with undo).
  - It writes `slateItems.status`, `reviewedBy`, `reviewedAt` and `requestedPublishAt`.
- Unsubscribe per address.

## Out of scope

- The slate job itself (#599 part 3).
- Search on Swap.
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

- **B (list plus board):** the email becomes a compact list with a "Review this week's picks" button that opens the board. On the board, Approve & Publish Now, Approve & Schedule (with the same date field), Swap and Skip each finish in one click, and the board replaces this confirm page. About +0.25 days.
- **C (hero):** the pick is the hero with all three buttons, and the backups are small rows with "Use this instead", which opens Swap. The confirm page stays as mocked, and the estimate is about the same.

## Estimate (days)

| Piece | Days |
|---|---|
| Preference and toggle in SES and Mailchimp settings, renamed label, no-recipients line | 0.5 |
| The same toggle in MAP advisor settings | 0.25 |
| Email template (pick plus 2 backups, dates, Why, plain text, dark mode, view-only variant) | 1.25–1.75 |
| Send step after the Monday slate (Elastic-else-SES, per recipient, dedupe, log) | 1–1.5 |
| Signed per-recipient links and the can-approve check (owner or admin, otherwise view-only) | 0.75–1.25 |
| Confirm page: Publish Now, Schedule with the date default, swap, skip this week with undo, unsubscribe; done, already, expired and view-only states; sign-in and wrong account | 2–2.75 |
| Publish-now and schedule handoff, and `slateItems` writes | 0.75–1 |
| Posts to chips (Website, each social account, Email), Edit mode, and the none-selected disabled state; passing destinations to publish and schedule | 0.5–0.75 |
| "Send to compliance" options reusing the posting code (contact summary and Edit) | 0.25–0.5 |
| Usual-time-or-9 AM and next-free-day logic | 0.25 |
| Unsubscribe per address | 0.25–0.5 |
| Phone layout and QA (test advisors only) | 0.75–1 |
| **Total** | **≈8.5–12** |

- The previous version was ≈7.75–11. This adds the destination chips, the send-to-compliance options and next-free-day logic, and drops compliance-first routing (+0.75–1).
- If the #688 digest and confirm pages are built first, reuse saves about 1–1.5 days.
- None of this is in the #599 6–9 day estimate.

## Open questions

None beyond the #688 direction and Alex's go-ahead. The earlier questions (Publish Now destinations, time of day, a clash on the 1st, view-only rule, compliance and sending address) are decided above.

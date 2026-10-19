# #582 follow-on: approval email with "send ASAP" or "send on a date" (advisors without compliance)

**Status:** Mock only. Not agent-ready. Soft Dev hold until Alex picks a direction.
**Related:** #582 (approval email checkbox, default unticked, optional approval-email send date; PR #583 open), #573 (Mailchimp audience guard; PR #574 staging, #575 main).
**Recommendation:** Direction A.

## Scope
Only for advisors whose compliance mode is off (`resolveComplianceMode(prefs)` is not `external`, and `doc.sendComplianceEmail` is false). Advisors who need compliance keep today's email and flow.

## Directions
- **A (recommended): two buttons in the email.** "Approve and send as soon as possible" and "Approve and send on a date I pick". Each opens one FinancialContent confirm page with that option already picked; the advisor can switch.
- **B: one "Review and approve" button.** The confirm page asks ASAP or date. Fewest buttons in the email, but one more choice on the page, and it is less clearly what was asked for.
- **C: suggested time in the email.** The main button is "Approve for <suggested time>"; ASAP and "pick a different time" are secondary. It needs a rule for the suggested time (open question).

All three use the same confirm page, states and server work. Only the email template and the pre-selected option differ, so switching later is cheap.

## Hard rules
1. **No email link sends anything.** Each link opens a page (GET) that only reads data. GET must never approve, send, schedule or use up the link. Scanners and link previews open links.
2. **Only a signed-in owner or admin can confirm.** Use `assertAdvisorOrAdmin(this.userId, doc.ownedBy)`. Not signed in: sign in, then return to the same confirm URL. Wrong account: show "Only Jane Advisor or an admin can approve this" with Switch account.
3. **Confirm is a click on the page** that calls a Meteor method over DDP. It must keep the #573 permit (`withMailchimpAudienceDeliveryPermit`, `explicitUserAction: true`, interactive `invocation.connection`).
4. **The link works once and expires** after 7 days, or sooner if the campaign is edited, re-sent for approval, declined, sent or scheduled.
5. **Show live data on the page.** Fetch the recipient count and list name from Mailchimp when the page opens, not from when the email was sent.

## Screens (see mock tabs)
1. The approval email, desktop and mobile.
2. Confirm: ASAP. Shows who gets it (list name, live count), "As soon as you confirm", and the preview. The button reads "Confirm: send to 1,248 people now".
3. Confirm: scheduled. Date and time picker in 15-minute steps (Mailchimp schedules on the quarter hour), labelled with the timezone ("Pacific Time (Vancouver)"). It must be at least about 15 minutes ahead. The button text repeats the exact time.
4. Success: "Sending now", or "Scheduled for X" with Change time and Cancel schedule (cancel uses `mailchimp.unscheduleCampaign`).
5. Problem states: link expired; already sent (who and when); already scheduled; email changed since the approval email (review latest).
6. Not signed in: sign in, then return, plus a wrong-account note.
7. Change of mind: Make changes (opens the editor; saving sends a fresh approval email and old links stop working). Don't send (optional reason; the campaign stays a draft marked Not approved; links stop working).

## Server work (gaps found in code)
- **G1: there is no token today.** The email links are `advisor/<advisorId>/email_campaign/approval_landing?campaignId=<id>` and `.../send_page?campaignId=<id>` (`server/mailchimp/html-messages.js` `buildApprovalMessageHtml`). They contain no secret and no expiry.
- **G2: `mailchimp.updateApprovedByAdvisor` skips its auth check when nobody is signed in** (`if (this.userId) { assertAdvisorOrAdmin(...) }` in `scheduled-campaigns-methods.js`). Anyone with a campaign id can mark it approved, or set it back to unapproved. The approval landing route is public in `client/main.jsx`. This should be fixed whichever direction is picked.
- **G3: GET is safe today.** `EmailCampaignApprovalLanding.jsx` approves only on a button click, and `send_page` is a read-only stub. The only GET that changes anything is the open pixel `/api/mailchimp/approval-open/<id>`, which just counts opens. Keep it that way.
- **G4: #573 guard allowlist.** `audience-delivery-guard.js` only gives a permit to `mailchimp.sendCampaign` and `mailchimp.setTimeForCampaign`, and its error text says audience delivery happens only from the Campaigns list. Two ways to build this:
  - (a) The confirm page calls those same two methods after a new `mailchimp.consumeApprovalLink` method checks and uses up the link. The guard code doesn't change. **Recommended.**
  - (b) Add one new method, such as `mailchimp.confirmApprovalSend`, to the allowlist.

  Either way this is a **policy change** to the #573/#582 rule "only Send or Schedule on the Campaigns list reaches the audience". Alex needs to OK the confirm page as a second explicit-click surface.
- **G5: passphrase.** Both send methods take a client-supplied `passphrase`, the same way `MailchimpCampaignsList.jsx` does. The confirm page needs the same source.
- **G6: timezone.** No advisor has a timezone field. PR #583 adds `imports/utils/advisorDateTime.js` with `ADVISOR_TIME_ZONE = 'America/Vancouver'` hard-coded, and #583 is still open. Advisors outside Pacific time would see Pacific times. Either label the time "PT" clearly (v1) or add `AdvisorPreferences.timeZone` (more work, needs a profile setting).
- **G7: approval recipients may not be the advisor.** `resolveApprovalRecipients` falls back from the campaign recipients to `prefs.sendTestEmailsTo` to the admin email. So the person who clicks may be an assistant or admin. Rule 2 handles this; the wrong-account state covers it.
- **G8: no "content changed" check.** We need a content version (hash or `updatedAt`) stored on the link when the email is sent, compared on open, and a check of the Mailchimp campaign status (save / schedule / sending / sent) for the already-sent and already-scheduled states.
- **G9: stats and Slack.** Keep `recordMailchimpApprovalClick` and the `#email_campaign_approved` Slack note. Add the send choice (ASAP or the time) to the Slack text.

## Suggested data
`ApprovalLinks { _id, campaignId, advisorId, tokenHash, intent: 'asap'|'schedule'|'review', contentVersion, createdAt, expiresAt, usedAt, usedBy, result }`. The email carries a random token, and only its hash is stored. A resend or edit voids the older links.

## Tests
- A GET of any approval URL never calls Mailchimp send or schedule and never uses up the link.
- Confirming while signed out fails, and so does a non-owner who isn't an admin.
- An expired, used or voided link fails without side effects.
- A content change shows the "email changed" state.
- A schedule time in the past or off the quarter hour is rejected.
- The existing #573 guard tests still pass (background jobs can't send).

## Effort (rough)
- A or B: about 3 to 4 dev days. That covers the link collection and methods, the confirm route and page with all its states, the email template, the G2 fix, and tests.
- C: about +0.5 day for the suggested-time rule.
- A per-advisor timezone field: about +1 day.

## Open questions for Alex
1. Is it OK for the confirm page to be a second place where an explicit click sends or schedules (a policy change to the #573/#582 rule)?
2. Should the link last 7 days, and should it become invalid when the campaign is edited?
3. Can an admin or assistant who receives the approval email confirm, or only the advisor?
4. Is Pacific time for everyone OK for v1, or do advisors need their own timezone first?
5. Should "Don't send" notify anyone (Slack or admin), and should it record a reason?
6. Direction C: where does the suggested time come from (a fixed default, the advisor's last send time, or a setting)?
7. How should this fit with #582's "Send approval email on" date: should the scheduled picker default to the next morning after the approval email arrives?

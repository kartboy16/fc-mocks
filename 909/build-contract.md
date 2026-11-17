# #909 Build contract — Decline an FTT Mail approval request and fix the reminder switch

**Status:** Not agent-ready. Soft Dev hold until the direction is confirmed.

**Risk:** high — FTT Mail campaign approvals and the approval-reminder job (email sending). Staging only; never merge this issue to main.

**Estimate:** 14–22 agent hours (cloud agent build 8–13, FC Tester 4–6, fix loop 2–3).

## Sources (read-only)

- Issue https://github.com/kartboy16/content-library/issues/909
- Reporter mockups in the #fc-bugs thread (two screenshots: pending with Decline request, and the declined state). This mock matches those screens and adds the confirm, reminder-switch error, undo, and 390 states the images did not include.
- Live UI: `imports/ui/EmailCampaigns/ApprovalEmailDialog.jsx`, opened from `SESCampaignsList.jsx`.
- Live toggle: `ses.setApprovalAutoResend` in `server/ses-methods.js` requires `this.userId === advisorId`, then `canManageCampaignApproval`. During support login the user is the advisor, so a missing or expired impersonation token (24h TTL) is rejected and the error only appears in a snackbar. The switch snaps back on.
- Live reminder job: `server/ses-approval-email-reminder-scheduler.js` already skips `approvalAutoResendDisabled: { $ne: true }`. It must also skip `advisorApprovalStatus: 'declined'`.
- Staging has `emailCampaigns.decideAdvisorApproval`, but the button only shows when there is a compliance copy. Main has no Decline for FTT Mail campaigns.
- Related: #389 (Content approvals decline), #820 (stop reminders after approve).

## Direction

One direction, not A/B/C. Build the Approval email modal to match the reporter’s screens, over the Email Campaigns list, including the red support bar when an admin is logged in as the advisor.

### Pending (support login as the advisor, or an admin acting for them)

- Header **Approval email**, then the campaign title, a **Pending approval** orange outline chip, **Last sent 6d ago**, **Opens 1 · Clicks 0**.
- **NEXT SEND TO:** email chips. A **Customize before send** collapsible row (recipients; approval-message editing stays as it is today for FTT Mail).
- **SEND HISTORY:** dated rows with orange **Auto · 7d** / **3d** / **1d** chips and a grey **Initial** chip.
- **Automatic reminders** card with subtext “At 1, 3, 7, and 14 days if not approved.” and a blue switch on the right.
- Helper under the card: “Admins can decline on the advisor’s behalf. Declining stops all reminders.”
- Footer: red-outline **Decline request** on the left; **Close** text button and blue **Resend now** (send icon) on the right.

**Decline request** is admin-only. It is visible during support login as the advisor, because the actor is an admin. It is not visible when the advisor is in their own session (no support bar, footer is only Close and Resend now). Non-admin, non-owner users still cannot change another advisor’s approval.

### Reminder switch

An admin, a support login as the advisor (with a valid impersonation token), or the advisor themselves can turn Automatic reminders off, and the setting persists after reload. While saving, the switch is busy and the card shows “Saving…”. On success, show a short inline confirmation in the card.

If the save fails, do **not** rely on a snackbar alone:

- The error appears **inside the reminders card**.
- The switch reverts to the previous value.
- Offer **Retry**.
- Permission denied copy: “You don’t have permission to change automatic reminders. The setting was not changed.”
- Expired support session copy: “Your support session has expired, so the setting was not changed.” plus a **Sign in again** action, which tells the admin to return to their account and log in as the advisor again.

Also fix the server so a support login with a valid token, an admin, and the advisor themselves can persist the toggle. A failed call must not leave the UI showing the new value.

### Decline confirm

A light confirm **inside the modal** (not a second full dialog): “Decline this approval request?” Body: “The request will be marked declined, and automatic reminders will be turned off. No further reminder emails will be sent.” Optional reason field for the audit log. **Cancel** returns to pending. **Decline request** commits.

### Declined state

- Red banner at the top, with an icon: “This approval request has been declined. All reminder emails have been stopped.”
- Red-outline **Declined** chip, **Last sent 6d ago**, and “Declined by Jane Admin (admin) · Nov 17, 2026, 9:30 AM” (live: the acting admin’s name and the timestamp).
- Reminders switch off and disabled, subtext “Reminders stopped because this request was declined”.
- Footer is only **Close** and **Undo decline** (blue text buttons). No Decline button and no Resend now.

### Undo decline

Restores pending status. Reminders stay **off** and remain editable, until someone switches them back on. The declined banner, chip, and “Declined by…” line go away. Decline request and Resend now return to the footer.

## Nov 18 reminder run

The reporter flagged that the 14-day reminder is due on the Nov 18 run unless the switch sticks or the request is declined. The reminder job must skip a campaign when:

- `approvalAutoResendDisabled` is true, or
- `advisorApprovalStatus` is `'declined'`.

Turning reminders off, or declining the request, must be persisted before that run, or the reminder still goes out. Undo does not turn reminders back on, so an undone request stays skipped until the switch is turned on again.

## Audit fields

On decline, set at least:

- `advisorApprovalStatus: 'declined'`
- `declinedBy` (acting user id; display name in the modal, e.g. Jane Admin)
- `declinedAt` (ISO timestamp; the issue also mentions `declinedByAdvisorAt` — use the existing field if it already stores this, and keep a single source of truth)
- `approvalAutoResendDisabled: true`
- optional decline reason, if entered

On undo:

- `advisorApprovalStatus` back to pending (clear the declined status)
- clear `declinedBy` / `declinedAt` (and the reason)
- leave `approvalAutoResendDisabled: true` until the switch is turned on

## Copy (fixtures)

- Support bar: “You're logged in as Jane Advisor for support.” **Return to my account**
- Campaign title: **Sample Campaign: The Financial Side of Caregiving**
- Recipients: jane@example.com, assistant@example.com
- Decliner line (example): “Declined by Jane Admin (admin) · Nov 17, 2026, 9:30 AM”
- All other strings as in the screens above

No estimates or explainer prose in the mock UI (hub and contract only). Generic names only.

## In scope

- Approval email modal on FTT Mail (SES) campaigns, admin / support-login and advisor views
- Reminder-switch persist + inline error, Retry, Sign in again, saving, and success
- Decline request, in-modal confirm (optional reason), declined state, Undo decline
- Reminder job skip for declined and for reminders-off campaigns
- Audit fields as above
- Staging tests with test accounts only; no live sends to real advisors

## Out of scope

- Mailchimp approval decline (already exists on another path)
- Changing Resend now, Customize before send, or send-history behaviour beyond what’s needed to keep the modal intact
- Shipping this to main (staging only)
- Renaming or moving the reminder milestones (1, 3, 7, 14 days)

## Mobile (390)

The modal is a bottom sheet. 44px targets. Footer actions stack full width (Resend now, Close, then Decline request; or Close and Undo decline in the declined state). The support bar stays at the top. History and chips wrap. The reminders card keeps the switch on the right.

## Open questions

1. Should the optional decline reason be required? (Recommended: optional.)
2. Prefer the existing `declinedByAdvisorAt` field name, or add `declinedBy` / `declinedAt` and map the display from those? (Recommended: keep one timestamp field, and store who declined in `declinedBy`.)
3. After undo, should a short inline note say reminders are still off? (The mock shows a one-line hint.)

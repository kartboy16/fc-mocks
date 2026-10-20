# #582 / #595 Approval-email section layout: build contract

**Status: Direction A picked by Alex (Oct 19)**, with separate Compliance and Approval cards. Pending Alex's final sign-off via Chief of Staff before Software developer starts. B and C are superseded.
**Hub:** https://kartboy16.github.io/fc-mocks/582-approval-layout/
**Mock:** https://kartboy16.github.io/fc-mocks/582-approval-layout/a-approval-card.html

## Locked defaults (Alex, Oct 19)
1. The approval time picker uses **15-minute steps** (`step=900`; off-step values are rejected).
2. The section turns **read-only once the approval email has gone out** (`approvalEmailSentAt` set).
3. Approval recipients **pre-fill from Settings → "Send test emails to"** (`preferences.sendTestEmailsTo`).
4. **Past times are blocked in the dialog and on the server.**

## Layout
Draft-only banner (create or edit copy, unchanged) → **Compliance card** → **Approval card** → Email Content. Both cards share one style: bordered, a small uppercase title ("COMPLIANCE", "APPROVAL"), a blue left edge when ticked, and grey with a lock line when read-only.

## Compliance card
Mode comes from `resolveComplianceMode(preferences)` in `imports/utils/complianceMode.js` (`email` | `external` | `off`; legacy `compliance` category → `email`).
- **email:** checkbox "Send copy to compliance?" (state `sendToCompliance`, default unticked). Ticking reveals **Compliance officer name** (`complianceOfficerName`) and **Compliance email** (`complianceEmail`, a single address), both pre-filled from `preferences.complianceOfficerName` / `preferences.complianceEmail`. Helper: "Your compliance officer gets a “[Compliance Review]” copy after the Mailchimp draft uploads." Validation as today: required plus valid email.
- **external:** no checkbox. A read-only notice: "External compliance (Red Oak). No compliance email is sent from here. Send and Schedule on the Campaigns list stay blocked until the Red Oak approval is recorded on the campaign." Use `externalSystem` from the attestation default (`DEFAULT_EXTERNAL_SYSTEM` = Red Oak). The attestation itself (system, reference, approver, approved date, or typing APPROVED) stays on the Campaigns list, not in this dialog.
- **off:** hide the Compliance card (same as today, where nothing renders).
- **Read-only:** once the approval email has gone out (or `complianceEmailSentAt` is set), show "Compliance copy sent <date> Pacific to <name> (<email>)" or "No compliance copy", plus a lock line.
- The Mailchimp dialog has no compliance-copy time. `complianceCopyScheduledAt` exists only on the SES path, so it stays out.

Compliance field mapping (unchanged on save): `sendComplianceEmail = sendToCompliance && !!complianceEmail`, `complianceOfficerName`, `complianceEmail` (null when unticked). The server keeps `sendComplianceEmail` only in email mode (`shouldSendComplianceApprovalEmail`). The copy is sent by `server/mailchimp/pipeline-runners.js` and stamped `complianceEmailSentAt` (`compliance-email-stamp.js`).




## Approval card: where it lives today (read from `main` @ c97978a, read-only)
- Component: `imports/ui/EmailCampaigns/mailchimp/MailchimpCreateCampaignDialog.jsx` (approval block about lines 853–895; validation `handleSave` about 698–711; payload `proceedSave` about 572–585).
- Labels/contract: `imports/ui/EmailCampaigns/mailchimp/mailchimpCreateDialogFields.js` (`SEND_APPROVAL_EMAIL_LABEL`, `SEND_APPROVAL_EMAIL_ON_LABEL`, `MAILCHIMP_CREATE_DIALOG_FIELD_LABELS`, `defaultSendApprovalEmailChecked()` → `false`, `shouldShowApprovalEmailOnField()`).
- Time helpers: `/imports/utils/advisorDateTime` (`ADVISOR_TIME_ZONE` = America/Vancouver, `datetimeLocalInTimeZoneToDate`, `dateToDatetimeLocalInTimeZone`).
- Server: `server/mailchimp/scheduled-campaigns-methods.js` (`resolveAdvisorDateTime`), `server/ses-methods.js` (~925), `server/ses-deferred-approval-scheduler.js` (cron picks up `approvalEmailScheduledAt <= now`).

## Field mapping (no schema change)
| UI | State today | Saved field | Notes |
|---|---|---|---|
| Send approval email checkbox | `sendApprovalEmail` (default `false`) | `sendApprovalEmail`, `skipApprovalEmail = !sendApprovalEmail` | Keep default unticked for all session kinds. Unticking clears the time (as today). |
| When: "As soon as the Mailchimp draft is ready" | new UI-only `approvalWhen = 'asap'` | `approvalEmailScheduledAt: null` | Derived: `'asap'` when the stored value is empty. |
| When: "At a date and time I pick (Pacific)" | `approvalWhen = 'time'` + `approvalEmailAt` (datetime-local string) | `approvalEmailScheduledAt: Date` via `datetimeLocalInTimeZoneToDate(…, ADVISOR_TIME_ZONE)` | Switching back to ASAP clears `approvalEmailAt`. |
| Who gets the approval email (chips) | `approvalEmailRecipients` becomes `string[]` in UI | `approvalEmailRecipients: chips.join(', ')` | Same comma string as today. Load: `parseEmailList(stored)`; prefill from `preferences.sendTestEmailsTo` as today. |
| Send copy to compliance? | unchanged | unchanged | Stays directly above the approval block. |
| Draft-only banner | unchanged (create and edit copy) | — | Stays directly above compliance. |

Edit mode: load `approvalWhen = doc.approvalEmailScheduledAt ? 'time' : 'asap'`.

## States (mock tabs)
1. **Both unticked:** two compact cards, checkboxes only.
2. **Both ticked:** compliance name and email shown; approval set to as soon as ready, with chips pre-filled.
3. **Approval only / Compliance only:** the mixed states.
4. **Approval at a set time:** picking "At a date and time I pick (Pacific)" reveals the datetime field, defaulting to tomorrow 9:00 AM Pacific, with `step=900`. Helper: "The approval email goes out Tue, Oct 20 at 9:00 AM Pacific. The audience still gets nothing until you Send or Schedule."
5. **External compliance (Red Oak):** the notice in the Compliance card, and Approval works as normal.
6. **Error:** an invalid compliance email; a red approval chip; a duplicate message; a past time. Save is blocked with an inline Alert ("Fix the approval email details above before saving.").
7. **Read-only (approval email sent):** the Edit dialog with both cards locked: "Approval email sent Mon, Oct 19 at 3:05 PM Pacific to …", plus "🔒 These settings are locked now. To send it again, use Resend approval email on the Campaigns list." Save still updates the other draft fields and must not change the approval or compliance fields.
8. **Mobile ~375px:** single column, with the officer name and email stacked.

## Recipient chips
- Enter, comma, semicolon or Tab commits; blur commits; Backspace on an empty input removes the last chip.
- Paste of "a@x.com, b@x.com; c@x.com" (commas, semicolons, spaces, newlines) splits into chips.
- Duplicate (case-insensitive): not added; the existing chip flashes; helper "jane@example.com is already in the list."
- Invalid (same regex as today's `isValidEmail`): kept as a red chip so it can be fixed; click to edit.
- MUI: `Autocomplete multiple freeSolo` with `renderTags` → `Chip` (`color="error"` when invalid), or a small `ChipInput` wrapper.

## Validation (client, on Save)
- Ticked + 0 recipients → "Add at least one email address."
- Any invalid → "Fix or remove the address in red (…). Click it to edit."
- `approvalWhen==='time'` + empty → "Pick a date and time, or choose “As soon as the draft is ready”."
- `approvalWhen==='time'` + minutes not 00/15/30/45 → "Pick a time on the quarter hour (:00, :15, :30 or :45)."
- `approvalWhen==='time'` + time ≤ now (Pacific) → "That time has already passed (it is now …). Pick a later time." (also shown live)
- Compliance (email mode, ticked): empty → "Compliance email is required."; invalid → "Enter a valid compliance email."
- **Server (locked):** in `server/mailchimp/scheduled-campaigns-methods.js` create and update, reject `approvalEmailScheduledAt` ≤ now or off the quarter hour with `Meteor.Error('invalid-approval-time')`. Today a past time is silently treated as "send now": `ses-methods.js` ignores it, and the deferred scheduler fires anything `<= now`.
- **Server (locked, read-only):** once `approvalEmailSentAt` is set, ignore or reject changes to `sendApprovalEmail`, `approvalEmailRecipients`, `approvalEmailScheduledAt`, `sendComplianceEmail`, `complianceOfficerName` and `complianceEmail` on update.

## Copy
- Section: "Send approval email" / "Someone reviews and approves the draft before you send it."
- "When should the approval email go out?" → "As soon as the Mailchimp draft is ready" ("Usually within a minute or two of saving") / "At a date and time I pick (Pacific)"
- "Who gets the approval email" · placeholder "Add email address" · helper "Type or paste addresses. Enter, comma or Tab adds each one."
- Warning (A, B): "**This only sets when the approval email goes out.** The campaign goes to the audience only when someone presses Send or Schedule on the Campaigns list."
- Summary (A line, B row): "Approval email to 2 people · as soon as the Mailchimp draft is ready" / "… · Tue, Oct 20 at 9:00 AM Pacific".
- #595 hint (when compliance unticked): "No compliance on this campaign, so the approval email will include **Approve and send as soon as possible** and **Approve and send on a date I pick** (#595). See that email". With compliance ticked: "Compliance is on for this campaign, so the approval email stays as it is today." Hint is display only; no #595 scope added.
- Drop the old helper "Advisor timezone (America/Vancouver)… Not the audience send date." (replaced by the radio labels + warning).
- Update `MAILCHIMP_CREATE_DIALOG_FIELD_LABELS` and any tests/e2e that look for "Send approval email on" / "Approval Recipients".

## Effort (revised for the picked A)
About **1.5–2 dev days**: the two-card restructure, the chip input, the radio choice, 15-minute and past-time checks on client and server, the read-only state with a server-side lock, and updated tests and field labels. That's up from 1–1.5 because of the Compliance card and the read-only lock.
(B and C are superseded.)

## Open questions (remaining)
1. Should Save to pipeline be blocked if the scheduled approval time passes while the dialog is open? (Mock: yes, the past-time error shows.)
2. In read-only, should the lock also apply when only the compliance copy has gone out (approval unticked)? (Mock locks on `approvalEmailSentAt`. The contract suggests also locking compliance on `complianceEmailSentAt`.)

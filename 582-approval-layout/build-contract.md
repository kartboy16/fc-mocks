# #582 / #595 Approval-email section layout: build contract

**Status:** Not agent-ready. Soft Dev hold until Alex picks a direction. Mock only.
**Hub:** https://kartboy16.github.io/fc-mocks/582-approval-layout/
**Recommended:** A (grouped "Send approval email" card).

## Where it lives today (read from `main` @ c97978a, read-only)
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

## States (all directions)
1. **Unticked:** only the checkbox ("Send approval email" + "Someone reviews and approves the draft before you send it."). Nothing else shows.
2. **Ticked · as soon as ready (default on tick):** radio ASAP selected, chips prefilled.
3. **Ticked · set time:** picking "At a date and time" reveals the datetime field, defaulting to tomorrow 9:00 AM Pacific, with `step=900` (15 min). Helper confirms: "The approval email goes out Tue, Oct 20 at 9:00 AM Pacific. The audience still gets nothing until you Send or Schedule."
4. **Error:** bad address chip is red and editable on click; past time; no recipients; "time" picked with no value. Save is blocked with an inline Alert ("Fix the approval email details above before saving."). In B, the row turns red with "N things to fix" and the panel reopens.
5. **Mobile ~375px:** single column; in C the lanes stack.

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
- `approvalWhen==='time'` + time ≤ now (Pacific) → "That time has already passed (it is now …). Pick a later time." (shown live too)
- **Server (new, small):** reject a past `approvalEmailScheduledAt` in `mailchimp.createScheduledEmailCampaign` / update. Today a past time is silently treated as "send now" (`ses-methods.js` ignores it; the deferred scheduler fires anything `<= now` on the next tick), which is surprising.

## Copy
- Section: "Send approval email" / "Someone reviews and approves the draft before you send it."
- "When should the approval email go out?" → "As soon as the Mailchimp draft is ready" ("Usually within a minute or two of saving") / "At a date and time I pick (Pacific)"
- "Who gets the approval email" · placeholder "Add email address" · helper "Type or paste addresses. Enter, comma or Tab adds each one."
- Warning (A, B): "**This only sets when the approval email goes out.** The campaign goes to the audience only when someone presses Send or Schedule on the Campaigns list."
- Summary (A line, B row): "Approval email to 2 people · as soon as the Mailchimp draft is ready" / "… · Tue, Oct 20 at 9:00 AM Pacific".
- #595 hint (when compliance unticked): "No compliance on this campaign, so the approval email will include **Approve and send as soon as possible** and **Approve and send on a date I pick** (#595). See that email". With compliance ticked: "Compliance is on for this campaign, so the approval email stays as it is today." Hint is display only; no #595 scope added.
- Drop the old helper "Advisor timezone (America/Vancouver)… Not the audience send date." (replaced by the radio labels + warning).
- Update `MAILCHIMP_CREATE_DIALOG_FIELD_LABELS` and any tests/e2e that look for "Send approval email on" / "Approval Recipients".

## Effort
- A: ~1–1.5 dev days (chip input, radio + derive, validation, server past-time reject, tests).
- B: ~1.5–2 days (adds summary/collapse state). C: ~2 days (layout restructure, timeline, mobile stacking).

## Open questions for Alex
1. Should the datetime use 15-minute steps (like #595's scheduler) or any minute?
2. Edit mode after the approval email has already gone out: show "Approval email sent Oct 19, 3:05 PM Pacific" read-only, or allow re-sending? (Mock doesn't cover it.)
3. Keep prefilling recipients from Settings → "Send test emails to"?
4. Should the server reject past times (recommended) or keep treating them as "send now"?

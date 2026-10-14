# #543 Build contract — Timing for Website and Email (recommended: Direction A)

Not agent-ready. Soft Dev hold until a direction is picked.

## What exists today (code)
- Social Timing in Share: `imports/ui/components/PostDistributionDialog.jsx` (`socialTiming` now/scheduled, `getSocialTimingSummary`), `OutboundTimingControl.jsx` ("Sends at publish · Adjust").
- Website scheduling already exists server-side (FC-side queue, not WP `future` status): `server/website-scheduler.js` — `website.schedulePost(postId, scheduledAt, options)`, `website.updateScheduledDate`, `website.cancelScheduledPost`, `website.getScheduledPosts`; owner-scoped by `this.userId`. Share opens in `entryMode='schedule'` from ContentLibrary.jsx (~L2014) and Admin dialog, but normal Share → Website has no date setter and calls `website.publishPost` (ContentLibrary.jsx ~L2122).
- "Always publish as WordPress drafts": `AdvisorPreferences.alwaysSendPostsAsDraft`, applied in `server/website-publisher/adapters/wordpress.js` L183 at publish time. Copy for "Schedule as a WordPress draft" already in `imports/ui/websiteDeliveryHelpers.js` L166.
- Email: `ses.sendCampaign(advisorId, campaignId, scheduledAt)` sets `status:'scheduled'` (`server/ses-methods.js` ~L1919); `ses.cancelScheduledCampaign` returns it to draft; cron `server/ses-campaign-scheduler.js` sends `status:'scheduled', scheduledAt<=now`. `CreateCampaign.jsx` already has `sendOption` now/schedule. Share → Email only calls `ses.createCampaign` (draft).
- Approval/compliance: `server/compliance-gate.js` `assertComplianceSendAllowed` is checked in `ses.sendCampaign` (at schedule time) — **not re-checked by the scheduler at send time**. Approval email flow `ses.sendCampaignApprovalEmail`, `ses.canManageCampaignApproval`, `ses-deferred-approval-scheduler.js`.
- Calendar: `imports/ui/Calendar.jsx` reads `WebsitePostQueue` (scheduled + published) and `SESCampaigns`; Website and Email Campaigns tabs exist; has a "New Schedule Date & Time" editor.

## Surfaces
1. Share dialog: one Timing block (Now / Pick date & time) for all ticked destinations; "Different time for each" link reveals per-destination Timing. Email adds "Save as draft".
2. Create Campaign last step: Save as draft / Send now / Pick date & time (restyle existing `sendOption`).
3. Approval state copy; WP-drafts copy; Mailchimp note; success screen with calendar link.
4. Calendar: scheduled website + email rows with Change time / Cancel and status chips (Scheduled, Waiting for approval, Scheduled as WordPress draft).

## Data / fields
- Share state: `timing: {mode:'now'|'scheduled', at:Date}`, optional `overrides: {website?, email?, social?}`.
- Website: reuse `WebsitePostQueue` (`scheduledAt`, `status:'scheduled'`).
- Email: `SESCampaigns.status 'scheduled'`, `scheduledAt`; add `approvalState` if not present.
- Display in account time zone (PT label); store UTC.

## Methods
- Share → Website scheduled: `website.schedulePost`. Share → Email scheduled: `ses.createCampaign` then `ses.sendCampaign(..., scheduledAt)` — or one new `share.scheduleDistribution` that does both atomically (preferred, avoids half-done shares).
- Calendar edit/cancel: existing `website.updateScheduledDate` / `website.cancelScheduledPost`, `ses.cancelScheduledCampaign` (+ add `ses.updateScheduledAt`).

## Server-side checks (must)
- Ownership: every method requires `this.userId` and `advisorId === this.userId` (or valid impersonation). Verify `ses.sendCampaign` — it checks `this.userId` but queries by passed `advisorId`.
- Reject `scheduledAt` in the past (allow ~1 min slack) and more than 1 year out.
- **Re-run the approval/compliance gate in `ses-campaign-scheduler.js` and `website-scheduler.js` at send time**; if not approved → don't send, mark `needs_attention`, email the advisor.
- Read `alwaysSendPostsAsDraft` at publish time (already true via adapter).

## Edge cases / effort
- FTT Mail draft vs scheduled send: draft = nothing goes out; scheduled = locked campaign. Editing a scheduled campaign → recommend it stays scheduled with edits saved (block edits within 5 min of send). List emptied by send time → skip, mark failed "No subscribers", notify. Approval pending at send time → don't send, notify, offer new time.
- WP drafts on + scheduled: at the chosen time we create a WP draft (not live). Copy says so; calendar chip "Scheduled as WordPress draft". Article-live emails must not fire for drafts (scheduler already checks `wpStatus !== 'draft'`).
- Past times blocked in picker and server. Timezone: account zone shown everywhere. Cancel email → back to Drafts; cancel website → removed from queue.
- Mailchimp: either hide Email timing for Mailchimp accounts (v1) or pass schedule to Mailchimp campaign schedule API (more work). Recommend hide + note in v1.
- Effort (A): ~3–5 dev days. UI timing block + wiring 1.5–2d; send-time approval re-check + past-time/ownership checks 1d; calendar status chips/edit email time 1d; tests 0.5–1d. B ≈ same; C +1d.

## Open questions
1. Approval pending at send time: hold and send when approved (website) vs skip and ask for new time (email)? Mock shows that split.
2. Editing a scheduled email: stays scheduled, or drops back to draft?
3. Mailchimp in v1 or later?
4. With WP drafts on, keep "Pick date & time" (creates draft at that time) or hide it? Mock keeps it with explanation.
5. Should Social timing join the shared block (A) or stay separate as today?

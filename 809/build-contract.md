# #809 Admin: send email for multiple advisors (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** **`risk:high`**: it sends email on behalf of advisors and touches admin/advisor scoping. Track: playground first, then staging; Alex merges any main PR. Tests send only to QA inboxes, never to real advisor lists.

## Grounding (staging `0fb9d7a`)

- **Admin role:** `isAdminUserId` (`server/support-impersonation.js`, role `admin`).
- **Acting as an advisor:** `getTargetAdvisorId(this, advisorId)` (`server/advisor-context.js`). An admin may pass any advisorId; anyone else is forced to their own id. The new methods reuse it, so there's no "Log in as" step.
- **Existing multi-advisor pattern:** `PostForMultipleAdvisors.jsx` (admin, "Select all", "Filter by name, email, or tag") + `SendToAllAdvisorsControls.jsx` (`BulkAdvisorConfirmDialog` / `BulkAdvisorResultDialog`) + `server/social-bulk-schedule.js`, which has an admin check, per-advisor `SKIP_REASONS` with labels, a 15 s stagger and yields every 5. Email bulk should copy this shape.
- **Today:** Admin › Users › "Log in as this user" (`AdminUserList.jsx`, `loginAsUser`), then send from that advisor's Email Campaigns, then repeat.
- **Send path:** `ses.sendCampaign(advisorId, campaignId, scheduledAt, impersonationToken)` → `doSendSESCampaign`.
- **Compliance:** `resolveComplianceMode(prefs)` is `email | external | off` (legacy compliance category → `email`), with the advisor approval email + Approve/Decline landing.
- **CASL gap:** the mailing address is built from `advisorPreferences` with a fallback of `config.officeAddress || 'Address not provided'`. Bulk send must **block** instead of sending "Address not provided".

## Directions

| | A. Step by step (recommended) | B. Table first | C. Campaign first |
|---|---|---|---|
| Flow | 1 Advisors (search, filter, checkboxes, status) → 2 Campaign + When (now/schedule) + list per advisor → 3 Review (preview tabs per advisor + "Who gets what" table + summary chips) → **Send for N advisors** → 4 Done (per-advisor results) | One table: checkbox, advisor, campaign, list, status per row; sticky bulk bar "N selected · Preview · Review and send" opens a review drawer (summary, who gets what, preview) with **Send** | Pick a library campaign card, then fan out: advisor rows with list + status + Preview, a live preview panel, a summary bar, and a confirm dialog with **Send** |
| Strength | One decision per screen; hardest to send the wrong thing | Fastest for repeat use; mixed campaigns per advisor | Natural when one campaign goes to many |
| Weakness | More clicks | Dense; weak at 390 | One campaign per send; preview panel off-screen on phone |

**Statuses before send** (from server pre-flight):
- **Ready**
- **Approval required** (compliance `email` or `external`): goes to the advisor's Approve/Decline and isn't sent directly.
- **Can't send:** no mailing address (CASL), no email list, or no verified sender (open question).

**After send:**
- **Sent to N people**
- **Waiting for approval**
- **Blocked: reason**, with a Fix link to that advisor's settings
- **Failed: sending service error**, with Retry

Each result links to the campaign created in that advisor's Email Campaigns.

**Page states** (switcher): ready, loading, empty ("No advisors yet"), error (Try again), sending ("you can leave this page"), done, done with 1 failed.

## Data and methods

All methods are server-side admin-only (`isAdminUserId`); a non-admin gets `not-authorized`. There's no GET action anywhere.

- **`emailBulk.listAdvisors({search, filter})`:** advisors with lists, compliance mode, a mailing-address check and a sender check, returning `status` + `reason`. Paginated (50).
- **`emailBulk.preview({advisorId, campaignTemplateId})`:** renders with **that advisor's** header/footer template, sender name, mailing address and unsubscribe. No FC links or branding (white-label).
- **`emailBulk.send({items:[{advisorId, listId}], campaignTemplateId, scheduledAt|null, confirmToken})`** (POST via DDP):
  - Re-runs the pre-flight per advisor.
  - Creates an `SESCampaigns` doc **owned by the advisor**, using their sender identity and lists.
  - Then for each advisor: compliance `off` → `ses.sendCampaign` path (or schedule); compliance `email` or `external` → that advisor's existing approval flow (approval email), never a direct send.
  - `confirmToken` comes from the Review step, so a stale or duplicate submit can't double-send. The job is idempotent on `(bulkSendId, advisorId)`.
- **Bulk job:** a `emailBulkSends` doc `{_id, adminId, campaignTemplateId, scheduledAt, createdAt, items:[{advisorId, listId, status, reason, campaignId, at}]}`. It runs on the server with a stagger (like social bulk) and the page subscribes for live status.
- **Audit:** every item records `adminId` and `actingAs`, plus the campaign doc `createdBy: adminId, createdVia: 'bulk-admin'`.

## Out of scope

Editing campaign content per advisor (it uses the library campaign as-is), Mailchimp-provider advisors (v1 is SES only; they show "Can't send: uses Mailchimp" unless we decide otherwise), social posts, non-admin team roles.

## Desktop / mobile

- **1280:** admin side nav plus a content area up to 1180 px. A's Review step is two columns (preview | who gets what). B's drawer is 560 px. C's dialog is 640 px.
- **390:** the nav hides, table rows become stacked cards, the bar and buttons go full width, selects are full width at 44 px, and A's Review stacks the preview above the table. B's drawer is full screen; C's dialog is near full screen.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

Scale: #699 took about 30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| Server: admin-only methods, pre-flight (CASL/list/sender/compliance), bulk job + stagger + idempotency, approval routing, audit + tests | 1.5–2.25 h | 1.5–2.25 h | 1.5–2.25 h |
| Per-advisor preview render (reuse `buildWrappedCampaignEmailHtml`) | 20–30 min | 20–30 min | 20–30 min |
| UI (page, states, live status) | 1–1.5 h (4 steps) | 1.25–1.75 h (table + drawer + per-row campaign) | 1–1.5 h |
| FC Tester on playground, QA inboxes only: non-admin blocked, preview has no FC links, compliance advisor goes to approval, CASL/no-list blocked, retry, 1280/390 | 45–60 min | 50–65 min | 45–60 min |
| Fix loop + security review | 20–40 min | 25–45 min | 20–40 min |
| **Total** | **≈3.75–5.5 h** | **≈4.25–6 h** | **≈3.75–5.5 h** |

## Recommendation

**A.** Sending for other people needs the strongest "check before you send" moment. A gives each choice its own screen and ends on one review that shows every advisor, list and outcome, with a preview per advisor, before the single Send button. B is quicker for power users but dense and easy to mis-click, especially at 390. C is clean but limited to one campaign per send, and its preview sits off-screen on phones.

## Open questions

1. **Permissions:** all `admin` users, or a new role (e.g. `bulk-email`)? Is `support` excluded (proposed)?
2. **Audit log:** is the `emailBulkSends` record plus `createdBy` on each campaign enough, or do we need an admin-visible history page?
3. **Sender identity:** always each advisor's own verified sender (proposed)? What about advisors with no verified sender: block or use the interim sender?
4. **Rate limits:** a stagger of about 15 s between advisors (like social), a cap per run (for example 50 advisors), and one active bulk job per admin?
5. **Approval settings:** for advisors with compliance `email` or `external`, should the admin's send **create the campaign and send the approval email** (proposed), or skip them? Also, should an advisor's own "needs my approval" preference (advisor approval) apply even when compliance is `off`?
6. **Mailchimp advisors:** include them in v1 or skip?

# #599 Weekly picks inside Manage Advisor Posts: build contract

**Status:** Designer-first mock with generic sample data. **Not agent-ready. Soft Dev UI hold until Alex picks.**
**Decision (Oct 21):** Alex changed direction. Weekly picks now live **inside Manage Advisor Posts (MAP)** for each advisor, not on a separate review screen. The earlier `599-rotation-review/` mocks are superseded. They stay online for reference.

Mocks: [hub](index.html) · [A, recommended](a-inline-recommended.html) · [B](b-weekly-picks-tab.html) · [C](c-row-panel-overview.html)

## 1. Rules shown on every screen
- Nothing is scheduled until an admin clicks **Schedule** and confirms in MAP's dialog.
- Drafts never publish on their own.
- Picks are built every **Monday at 5:00 AM PT**.
- Posts that need an update are skipped, and the reason is shown.

## 2. Options

| | Where the pick lives | Overview | Bulk | UI days |
|---|---|---|---|---|
| **A (recommended)** | A new **"Recommended this week · 1"** block in each row's Posts cell, between Upcoming and Suggested | A light filter strip above the table: All · Due · Scheduled · Skipped · Needs update, plus Rebuild | None (Q4 proposal) | **2–2.5** |
| B | A new **Weekly picks** tab next to "All advisors", with a wide pick + backups column, checkboxes and **Schedule selected…** | Tab badge and the same strip | Yes: same time for all, MAP defaults per advisor | 3–3.5 |
| C | A **Weekly pick · status** toggle in Actions that opens a full-width panel under the row | A separate light **Weekly picks overview** page (advisor, picks due, status, Open in MAP) | None | 2.5–3 |

**Recommendation: A.** The pick sits next to Past, Upcoming and Suggested, where admins already schedule from. It reuses the Suggested card almost unchanged and adds no route or tab. **Cross-advisor overview:** I recommend A's filter strip (counts and filters inside MAP). I don't recommend C's separate page: it adds a route and a publication and only links back into MAP.

## 3. Screens and states (all options)
- **Pick card** (based on `AdminSuggestPostCard`): image, title, topic chip, fit score, status chip, **Why picked** (the rotation reason, shown in the `whyThisFits` slot), **Created** and **Updated** dates, and a line per channel once it's scheduled (Website / Social / Email). Actions: **Schedule**, **Swap**, **×** (skip this week), plus **Undo** after a skip and **Cancel** after scheduling.
- **Skipped at build:** a link under the card ("N skipped at build: needs update ▾") that lists each post with its reason. **Flagged since build:** the card turns amber, Schedule is disabled, and the reason is shown with Swap offered instead.
- **Swap drawer:** search, optional **Created from / to** (the #372 pattern, with an "Showing posts created on or after…" notice and Clear), backups first, then the best fit. Posts already on the advisor's site, used in the last 12 months, or flagged as needing an update are left out. Swapping doesn't schedule anything.
- **Schedule:** opens **MAP's own Publish & share dialog** with the pick, with channels pre-checked from the advisor's categories exactly as MAP does today. The footer adds "Weekly pick for {name}". See §5.
- **Cancel:** **MAP's own cancel dialog**. One new line: "This also removes the social posts and the email draft or campaign scheduled with it" (this is what the server already does).
- Page states: Default, Loading (skeleton), No picks yet (before the first Monday build), Error (with Retry), Needs update, Scheduled. Empty search shows "No advisors found".
- Mobile (390px): MAP's table scrolls sideways as it does today. The strip, notices and dialogs stack.

## 4. MAP components reused (content-library)
| Piece | Path | Reuse |
|---|---|---|
| Page, toolbar, table, row cells | `imports/ui/admin/ManageAdvisorPosts.jsx` | Add the Recommended block to `AdvisorPostsCell` (A), a tab (B), or a sub-row (C). Add the filter strip under the toolbar. |
| Suggested card | `imports/ui/admin/AdminSuggestPostCard.jsx`, `imports/utils/postPickHelpers.js` | Use as the pick card. Its `whyThisFits` chip shows the rotation reason. Add the dates and a status line. |
| Schedule dialog | `imports/ui/admin/AdminPostDistributionDialog.jsx` → `imports/ui/components/PostDistributionDialog.jsx` | As is. Change `onScheduled` so it updates the slate item instead of (or as well as) `markMonthlyPickDone`. |
| Channel defaults, labels, summaries | `imports/ui/admin/adminDistributionChannelDefaults.js`, `imports/ui/websiteDeliveryHelpers.js`, `adminWebsiteDeliverySummary.js`, `adminDistributionCapabilityNotices.js` | As is |
| Social destinations | `imports/ui/social-schedule/useFilteredPostDestinations.js`, `PublishSocialSharePanel`, `OutboundTimingControl` | As is |
| Email | `imports/ui/components/DistributionEmailSection.jsx`, `imports/ui/admin/AdminAdvisorNotifyEmailPanel.jsx` | As is |
| Where it posts | `imports/ui/components/ConfirmWhereBlock.jsx` | As is |
| Default date | `imports/ui/admin/mapDefaultScheduleDate.js`, `useDirtySyncedDate.js` | As is |
| Upcoming timeline | `imports/utils/advisorWebsiteTimeline.js` | As is. See gap 1. |
| Server: schedule | `server/api/post-suggestions.js` (`scheduleForUser`, `scheduleSocialForUser`, `createCampaignForUser`), `server/website-queue-helpers.js` (`insertScheduledWebsitePost`), `server/website-scheduler.js` (`assertScheduledAtInWindow`) | As is |
| Server: cancel | `cancelScheduledForUser` → `cancelScheduledWebsiteQueueItem` (removes the website row, its social posts, the SES draft and the Mailchimp campaign) | As is |
| Bulk (B only) | `bulkScheduleTopPicks` in `server/api/post-suggestions.js` | Today it isn't used in the UI and does website only with one time. B needs it to handle all channels. |
| PT helpers | `imports/utils/advisorDateTime.js` | For "Mon 5:00 AM PT" and the dates |

## 5. Decided and open questions
- **Q3, decided:** all channels (website, social, email), exactly as MAP's dialog does it.
- **Q6, decided:** Cancel follows MAP. It removes the related social posts and the email draft or Mailchimp campaign. Already published content stays.
- **Q2, replaced:** the picks live in MAP. **MAP is admin-only** (non-admins are redirected), so **advisors can't see their picks** in this design. If they should, that's a separate ask.
- **Q1, open. Proposed default:** no separate Approve step (MAP has none). Clicking Schedule and confirming in MAP's dialog is the approval, and × skips the pick for this week, like Skip on Suggested cards.
- **Q4, open. Proposed default:** no bulk in v1 (MAP has no bulk scheduling). If bulk is wanted (Option B): everyone goes at the same time, from MAP's **Default schedule date**. Each advisor's channels come from their categories, social goes about 5 minutes after publish, and email works as MAP does. Rows with warnings, needs-update picks, skipped picks and already scheduled picks are left out and listed.
- **Timing differs from the earlier mocks.** MAP's picker uses the browser's local time, blocks past times only through the field's minimum, and has no 15-minute step. The server checks the window (`assertScheduledAtInWindow`). These mocks follow MAP and drop the earlier 15-minute/PT-only/past-blocked rules from #595. Keeping MAP consistent is the point. If PT-only times are wanted, that's a change to MAP for everyone.
- There's no **Change time** action, because MAP has none. Cancel and schedule again.

## 6. Estimate
| | A | B | C |
|---|---|---|---|
| UI | 2–2.5 days | 3–3.5 days | 2.5–3 days |
| Backend: MAP hookup | 1.5–2 days | 2.5–3 days (+1 for multi-channel bulk) | 1.5–2 days |
| **Total** | **3.5–4.5 days** | 5.5–6.5 days | 4–5 days |

This is smaller than the separate review screen (Direction A there was about 4.5–5.5 UI days in rev 3, before any backend), because the dialog, cancel, channels and timeline are reused. Backend hookup: add the slate to the MAP advisors payload, a swap/search endpoint with a `createdOn` range and needs-update exclusion, keep the slate item and queue item in sync, and add the needs-update field. **Not included:** the rotation engine itself (scorer and the Monday 5 AM PT job), which is a separate phase in the spec.

## 7. Code gaps
1. **Upcoming is website only.** `advisorWebsiteTimeline` lists website queue items only, so a pick scheduled to social or email only won't show in Upcoming and can't be cancelled there. The mock forces Website on when Social is on, as MAP does, but email-only is possible.
2. **Cancel is keyed on the website queue item.** A slate item needs to store the `queueId` (and the social and email ids) so the pick's status can go back to Due when it's cancelled from Upcoming.
3. **`onScheduled` calls `markMonthlyPickDone`.** Picks need their own hook to mark the slate item Scheduled.
4. **No needs-update field** on posts yet, and nothing that clears it.
5. **Swap/search has no created-date range** server side. #372's pattern needs to be added here.
6. **`bulkScheduleTopPicks`** is website-only with one time and isn't wired to the UI (only matters for B).
7. **Browser timezone:** MAP's picker uses the admin's browser time. Admins outside PT will see local times.
8. **Security:** `AdminPostDistributionDialog.jsx` has a hardcoded Mailchimp passphrase constant in the client bundle. It should move server side. Not quoted here.
9. **Skip logging:** MAP's Suggested skip isn't stored per week. A weekly skip needs storing so Rebuild and the counts respect it.

## 8. Open questions for Alex
1. Alex's spec sentence trails off at *"and then provide within the"*. We have not guessed. Is it about delivery? (Marked on every option.)
2. Weekly or monthly? The job runs weekly, but the spec talks about "this month's topic".
3. One pick plus 2 backups per advisor per week, or several picks?
4. If a post is flagged after Monday's build, should the pick be pulled or stay with a warning? (The mock blocks Schedule and offers Swap.)
5. What clears the needs-update flag: any edit, or a "Mark as updated" button? Who can press it?
6. Should "Updated" count only content edits? Today it also changes on template linking and trash/restore.
7. Is #372 Direction A locked, so Swap's created-date filter can match it?
8. Should Rebuild keep picks that are already scheduled or skipped? (The mock keeps them.)
9. Should skips be logged with a reason?
10. Q1 and Q4 above (proposed defaults shown).

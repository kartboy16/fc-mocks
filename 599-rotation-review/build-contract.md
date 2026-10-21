# #599 Weekly picks review: build contract

**Status:** Designer mock only. **Not agent-ready. Soft Dev UI hold until Alex picks.** The phase 1 backend (profiles, history, topic tagging) can go ahead in parallel, as Alex's comment allows.

**Rev 2 (Oct 20):** this revision adds content freshness from [Alex's comment 6295711214](https://github.com/kartboy16/content-library/issues/599#issuecomment-6295711214): created and updated dates, a needs-update state, and a created-date filter on Swap. See *Rev 2 changes* below.

**Rev 3 (Oct 21):** adds scheduling straight from the review queue. This follows a new requirement from Alex (Oct 20, 11:52 PM PT, relayed by Chief of Staff): *advisors must be able to schedule the recommended posts straight from the review queue.* See *Rev 3 changes* below. There were no new #599 comments to read before this revision.

Mocks: [Hub](index.html) · [A (recommended)](a-table-drawer.html) · [B](b-split-view.html) · [C](c-focus-review.html)

## Rules the UI must make clear (all directions)
- **Nothing is scheduled until someone clicks Schedule** (Rev 3). Approve on its own marks a pick OK with no date.
- **Drafts never publish on their own.** There is no auto-schedule and no auto-publish.
- **Slates are built every Monday at 5:00 AM PT.** Profiles re-sync nightly at 2:00 AM PT.
- **Times are Pacific (PT).** The picker uses 15-minute steps and blocks past times (Rev 3).
- **Posts flagged as needing an update are skipped** until they're refreshed (Rev 2).
- These appear as pills at the top of the queue and the slate, and again in the toast after Approve or Skip.

## Open question (do not build around a guess)
> Alex's spec has an unfinished sentence: **"and then provide within the"**. It may be about where or how the slate is delivered.

The mocks show an orange **Open question** callout on the queue ("Delivery of the review queue") and under the slate ("What happens after Approve"). Anything that depends on it, such as delivery by email or Slack, a digest, or showing the slate to advisors, stays **out of scope** until Alex answers.

## Directions
| | Layout | Swap | Best for | UI estimate |
|---|---|---|---|---|
| **A (recommended)** | Full-width table queue (like Manage Advisor Posts) → full slate page with Prev/Next | Right-side drawer | 100+ rows, filters and bulk actions, close to today's admin screens | **3.5–4.5 dev days** (Rev 2: 2.5–3.5) |
| B | Split view: advisor list on the left, slate on the right | Centred pop-up | Fast clicking between advisors without leaving the list | 4.5–5.5 dev days (Rev 2: 3.5–4.5) |
| C | Overview with progress, then one advisor at a time (Approve all and next, keyboard keys) | Inline, under the post | Getting through the whole week quickly | 4.5–5 dev days (Rev 2: 3.5–4) |

Rev 3 adds about +1 day to each direction for the Schedule picker, the bulk schedule with its confirm step, the scheduled states, and Change/Unschedule. Server-side work is extra, about 0.5–1 backend day (see the Rev 3 code findings). Rev 2 added about +0.5 day to each direction for the date lines, the needs-update states and the created-date filter. The filter control can be shared with #372 if it's built first.

The estimates cover the UI only. They assume the slate methods and collections from phases 1–2 exist, and they include desktop and mobile layouts, states, and component tests.

**Why A:** it reuses the Manage Advisor Posts table pattern admins already know (fixed-width columns, chips, a 400px drawer), it handles 100+ rows with filters and bulk actions best, and it's the smallest build. B and C can come later as views over the same data.

## Rev 3 changes (schedule from the review queue)
1. **Schedule on each pick:**
   - **Slate:** every pending, swapped or approved pick has **Schedule…**. Pending and swapped picks also keep Approve, Swap and Skip.
   - **Queue:** each row has **Schedule top pick…** (A: in the action column; B: in the advisor list; C: in the overview list). Once scheduled, the row shows the date chip.
   - **Slate actions:** a new **Schedule all…** button for the current advisor.
2. **Bulk "Schedule selected…"** in the queue's selection bar (A, B, C):
   - Step 1 is the picker plus "If an advisor has more than one pick": All at the same time, One a day, or One a week.
   - Step 2 is a **confirm summary**: "You're about to schedule N posts for M advisors" with a table of advisor, post and "Goes live (Pacific)". Below it is a **Not included (N)** list with reasons: needs update, skipped, already scheduled, or the advisor has a warning ("Open the slate to check it first", the same rule as Approve all).
   - The button reads **Confirm and schedule N posts**. Back returns to step 1.
3. **Date/time picker, matching #595 / [582-approval-layout A](../582-approval-layout/a-approval-card.html):**
   - `datetime-local` with `step=900` and a "Pacific" label.
   - The help line reads "Pacific time (Vancouver). 15-minute steps." When the time is valid it reads "Goes live on {advisor}'s website {Tue, Oct 27 at 9:00 AM PT}. Nothing publishes before then."
   - Inline errors, using the same wording as #595:
     - "That time has already passed (it is now …). Pick a later time."
     - "Pick a time on the quarter hour (:00, :15, :30 or :45)."
     - "Pick a date and time."
   - The confirm button stays disabled while there's an error.
   - Default: tomorrow at 9:00 AM PT.
4. **After scheduling:**
   - The pick shows a **📅 Scheduled · Wed, Oct 21 at 9:00 AM PT** chip and the line "Goes live on {advisor}'s website … You can change or unschedule it until then."
   - **Change** opens the picker with the current time ("Save new time").
   - **Unschedule** returns the pick to "Approved, not scheduled yet".
   - Slate header: "N of M scheduled".
5. **Queue status, counts and filters:**
   - New slate status **Scheduled**, used when every live pick is scheduled.
   - "Approved" is now labelled **"Approved, not all scheduled"**.
   - A new **Scheduled** counter (A and B are clickable; C shows "N fully scheduled" as a link) and a **Scheduled** option in the status filter.
   - A rows show "x of y approved · z scheduled".
6. **State switcher:** a new **Scheduled** state (Jane Advisor fully scheduled one week apart, John Sample fully scheduled, Morgan Sample partly). There's also a **4 Schedule** screen button.
7. **Copy:**
   - Pills: "Nothing is scheduled until you click Schedule", "Drafts never publish on their own", "Times are Pacific (PT)".
   - Picker footer: "Drafts never publish on their own. Posts are scheduled only when you click {Approve and schedule / Confirm / Save new time}."
   - Approve toast: "Approved, but not scheduled yet. Click Schedule to pick a date and time."
8. **Needs update:** flagged picks show a disabled **Schedule** ("can't be scheduled until the post is refreshed"). They're left out of Schedule all and Schedule selected, and listed under Not included.
9. **Assumption: Schedule implies approval.** It's labelled in each slate and in the picker. Approve stays available on its own for "OK, but no date yet". The single-pick button reads **Approve and schedule**.
10. **Advisors vs admins:** a new **Open question** box on every queue says the requirement says *advisors*, but this is an admin screen. The mocks show the admin flow only. No advisor view is built, because #599 doesn't ask for one.

## Rev 2 changes (content freshness)
1. **Dates on every pick and every Swap option:** "Created Mar 4, 2025 · Updated Sep 12, 2026". If the post hasn't been edited, it says "Not updated since" in place of the Updated date. These also show on the queue's top pick and on posts that were skipped for needing an update.
2. **Needs update.** There are two cases:
   - **Skipped at build:** the post was flagged before Monday's 5:00 AM PT build, so it's never picked.
     - The slate shows a **"Skipped at build: needs update (N)"** panel. For each post: title, topic, dates, and **"⚠ Needs update: {reason}. Flagged {flaggedAt} by {flaggedBy}."** Sample reasons follow the comment: "Outdated figures: TFSA contribution limit", "Outdated figures: CPP/OAS rates", "Outdated figures: tax brackets". Flagged by Content bot or an admin.
     - Copy: "These would have fit {advisor}, but they're flagged as out of date, so the engine skipped them. They come back once the post is refreshed."
   - **Flagged since build (mock assumption, see Q8):** a picked post gets flagged mid-week, for example by Content bot's periodic review.
     - The pick shows **"Flagged since build: needs update"**, its title is struck through, and the reason box says "It can't be approved until the post is refreshed. Swap it, or leave it skipped."
     - Only **Swap** is offered. Approve all leaves it out.
     - To see it, use the new **Needs update** button in the state bar.
   - **Queue:**
     - A new **"Posts skipped: needs update"** counter (A, B and C). It's clickable and filters the list.
     - A row tag: "N skipped at build: needs update" and/or "N flagged since build: needs update".
     - A new warning filter option: **"Posts skipped: needs update"**.
     - A new rule pill: "Posts that need an update are skipped".
   - **Swap:**
     - Flagged posts are never in the ranked list.
     - A link, "Show N posts hidden because they need an update", lists them greyed out and unselectable, with their reasons.
3. **Created-date filter on Swap and search.** This reuses the [#372](https://kartboy16.github.io/fc-mocks/372/directions/a/) Direction A design: two compact floating-label date fields, **"Created from"** and **"to"**, next to the search box, with a small **Clear** link.
   - Empty means no limit. Each field works alone (on or after, or on or before), and dates are inclusive.
   - Future dates are blocked (`max` is today).
   - Status line: "Showing posts created Jan 1, 2025 – Dec 31, 2026 · 5 of 7 options".
   - Empty result: "No options created … Widen the dates or clear the Created filter."
   - If "to" is before "from", the field turns red with a plain message: "The "to" date is before "Created from". Pick a later date. Still showing the last range that worked." The last range that worked stays applied.
   - **#372 isn't locked yet.** Alex's comment says to reuse it "if Alex locks it", so this follows #372's *recommended* A, and Rev 2 changes if #372 lands differently.
4. **Freshness down-rank:** older posts score lower but aren't excluded. The fit score already includes this. The Swap explainer still says what's left out, and the dates make the ranking visible.
5. **Open question unchanged:** the new comment doesn't answer "and then provide within the", so the callouts stay.

## Screens
1. **Review queue (Weekly picks review)**
   - The week line shows: "Week of Mon Oct 19 · Built Mon 5:00 AM PT · Profiles re-synced 2:00 AM PT".
   - Status counters (Pending review, Partly approved, Approved, Skipped, With warnings). In A they're clickable and act as filters.
   - Filters: search advisors, status, this month's topic, and warnings (Has a warning, Thin fit, Streak override, Missing products/services).
   - Each row shows: advisor name and firm, warning chips, this month's topic, the top pick (thumbnail, title, one-line reason, and "+ N more picks, 2 backups each"), chips for the last 3 months' topics, the status with "x of y approved", and Review.
   - Bulk actions:
     - Approve selected. This leaves out rows with warnings, and the UI says so.
     - Skip selected this week.
     - Rebuild selected.
     - **Approve all with no warnings.**
     - Rebuild all slates.
2. **Advisor slate**
   - The header shows: name, firm, this month's topic, the last 3 months' topics, warnings, and the slate status.
   - A help box for each warning type. "Missing products/services" links to the existing Services panel.
   - Each pick shows: thumbnail, title, topic chip, the item's status, the fit score, **"Why this pick:"** with the reason, and its backups.
   - Each pick has **Approve / Swap / Skip**. Undo appears once a pick is approved or skipped.
   - Slate actions: **Approve all** (covers the remaining pending and swapped picks), **Skip this week**, and **Rebuild this slate**.
3. **Swap**
   - Backup 1 and Backup 2 come first under their own heading, then the other options ranked by fit (or search results).
   - Each one shows: rank, thumbnail, title, topic chip, reason, and fit score.
   - The 3rd-month-in-a-row warning is shown on the alternative it applies to.
   - Search by title or topic. "No posts match" appears when nothing is found.
   - Explainer: "Posts already on this advisor's site, or used in the last 12 months, are left out."
   - **Confirm swap** is disabled until a post is chosen. **Cancel** closes without changes.
   - A swapped pick shows **"Swapped, needs approval"**. It is never approved automatically.

## States (each mock has a "Try a state" bar)
- **Needs update (Rev 2):** two posts are flagged since build (Jane Advisor and Sam Placeholder), plus the default posts skipped at build (Jane Advisor, Sam Placeholder and Morgan Sample).
- **Swap filter:** created range applied, nothing in range, and "to" before "from".
- **Loading:** skeleton rows with "Loading this week's slates…".
- **Empty:** "No slate for this week yet. Slates are built every Monday at 5:00 AM PT. The next one will be ready Mon Oct 26 at 5:00 AM PT", with a **Rebuild all slates now** button. The rebuild builds drafts only.
- **Error:** "We couldn't load this week's slates. Nothing has been scheduled or published." with **Try again** and a hint to use Rebuild if Monday's build failed.
- **Success (all reviewed):** "All slates reviewed for this week. Approved posts have moved to normal scheduling. Skipped advisors get nothing this week."
- **Filtered empty:** "No advisors match these filters. Clear filters."
- **Swap search empty:** "No posts match "x". Try a topic like "tax" or clear the search."

## Copy (key strings)
- Pills:
  - "Nothing is scheduled until you approve it"
  - "Drafts never publish on their own"
  - "New slates are built every Monday at 5:00 AM PT"
- Toasts:
  - After Approve: "Approved. It moves to normal scheduling. Nothing publishes on its own."
  - After Skip: "Skipped for this week. Nothing will be scheduled for this post."
  - After Swap: "Swapped in "…". It still needs your approval."
- Item statuses: Not approved · Approved, ready to schedule · Swapped, needs approval · Skipped.
- Slate statuses: Pending review · Partly approved · Approved · Skipped this week.
- Warning help:
  - Thin fit: "Few good matches…"
  - Streak override: "Third month of Group benefits. Nothing else fit… so the usual block was lifted."
  - Missing products/services: "Picks are based on topic rotation only. Add services."

## In scope
- The three screens above, all the states, filters, bulk actions, rebuild for one advisor or all, and the swap search.
- Read-only display of the stored reason and the fit score.

## Out of scope
- Delivering the slate anywhere (email, Slack, digest, or the advisor's view). This is blocked on the open question.
- Editing the advisor's rotation order or target theme. The spec mentions it, but no screen was requested.
- Overriding a post's topic tag. It's in spec part 1, but it would sit on a library or post screen, not here.
- Choosing a schedule date in this screen. See Q3.
- Scorer tuning.
- Any change to Pick for Me or Suggested Post.

## Desktop and mobile
- **Desktop:** A's table uses fixed column widths like Manage Advisor Posts. The drawer is 440px, close to the existing 400px `DRAWER_WIDTH`. B's list column is 280–360px.
- **Mobile (under 760px):**
  - Table rows become stacked cards, and the "Last 3 months" column is hidden from the row (it's still shown on the slate).
  - Pick actions wrap under the post.
  - The Swap drawer goes full screen.
  - In B, the list and the slate become separate screens with "← All advisors".
  - C works as is.
- Keyboard shortcuts in C (A, S, ←, →) are ignored while typing in a field.

## Data and code findings (read from `main`, read-only)
**Rev 3 (scheduling):**
- **Admin schedule paths skip the time guard.**
  - `website.schedulePost` (advisor self, `server/website-scheduler.js` around line 474) calls `assertScheduledAtInWindow` (#543: no past times and nothing more than a year out, in `server/ses-schedule-guards.js`).
  - The admin `postSuggestions.scheduleForUser` and `postSuggestions.bulkScheduleTopPicks` (`server/api/post-suggestions.js` around lines 776 and 863) call `insertScheduledWebsitePost` with **no** past or window check.
  - No path enforces 15-minute steps on the server.
  - Recommend adding the guard, and a quarter-hour check if Alex wants it.
- **`insertScheduledWebsitePost` doesn't check** for a post that's already scheduled for that advisor, or for needs-update. (`needsUpdate` doesn't exist yet; see Rev 2.)
- **`bulkScheduleTopPicks` uses one `scheduledAt` for every row**, and it's website only. Spacing ("one a day / one a week") needs a time for each row or a new method. It also marks the month done (`markMonthlyPickDoneInternal`), which may not fit a weekly slate.
- **No admin "Change time".** `website.updateScheduledDate` only updates the caller's own queue items (`advisorId: this.userId`) and has no window check. Admin Change needs a `…ForUser` variant (or cancel and re-insert) with the guard.
- **Unschedule has side effects.** `cancelScheduledWebsiteQueueItem` (`server/website-queue-helpers.js` around line 62) deletes the website queue row **and** pending social posts (and email) for the same post and advisor. The Unschedule copy may need to say that. Unverified for every channel.
- **Timezone:**
  - `imports/utils/advisorDateTime.js` has `ADVISOR_TIME_ZONE = 'America/Vancouver'` and `datetimeLocalInTimeZoneToDate`. Its comment says "no per-advisor TZ field exists yet". It's used by the Mailchimp dialog.
  - Manage Advisor Posts' **Default schedule date** uses the *browser's* timezone (`toLocalDateTimeString` / `new Date(str)`), not PT.
  - The new picker should use `advisorDateTime` so "PT" is true for admins outside Pacific.
- **Slate item status needs** `scheduled`, a `queueId` link to `WebsitePostQueue`, and `scheduledAt`. The spec's `slateItems.status` is (pending | approved | swapped | skipped). The UI also needs to know when a queue row was published, cancelled or failed elsewhere. Unverified how to sync.
- **#595 picker is a mock, not code yet.** The 15-minute `step=900` picker exists only in fc-mocks 582-approval-layout A, so there's no shared component to reuse yet.

**Rev 2 (freshness):**
**Rev 2 (freshness):**
- **There's no `needsUpdate` flag on posts today.** No `needsUpdate`, `needs_update` or "needs update" appears in collections, server APIs or admin UI. The field, its reason, `flaggedAt` and `flaggedBy`, plus a way to set and clear it (Content bot and admins), are all new. Eligibility in `filterEligiblePosts` and `getCandidatePostsForUser` must exclude flagged posts.
- **Created date is `createdOn`, not `createdAt`.** HTMLPosts uses `createdOn` (indexed with `isPublic`, `postCategories.slug` and `availableToAdvisorSourceIds`, and in `HTML_POSTS_CARD_FIELDS`). The comment's `createdAt` should map to `createdOn`.
- **`updatedAt` isn't a clean "content updated" date.** `server/api/html-posts-api.js` sets it on edits, but also when an email template is linked or unlinked (around lines 332–346 and 378). `server/html-posts-trash.js` sets it on trash and restore. `updatedAt` is also *not* in `HTML_POSTS_CARD_FIELDS`. Using it for "Updated" and for freshness would count non-content changes. Consider a `contentUpdatedAt`. (Unverified: every place that writes posts.)
- **What "refreshed" means is undefined:** an edit after `flaggedAt`, or an explicit "Mark as updated" that clears the flag?
- **Related pattern:** `CanadianContributionLimitsEditor.jsx` already has an "Up to date" / "Review recommended" (`stale`) status for TFSA/RRSP limits (`imports/utils/canadian_contribution_limits.js`). Content bot's flagging could reuse the limits' `updatedAt` to find posts that cite old figures. This is a possible source, unverified.
- **The #372 created-range filter isn't built.** There's no `createdFrom`/`createdTo` in `ManageAdvisorPosts.jsx` or `post-suggestions*.js`. The Swap filter would add the first `createdOn` range query, which the existing `createdOn` indexes can serve.

**Rev 1:**
- **`advisor_post_history` already exists** (`imports/collections/advisor_post_history.js`). It's indexed on `advisorId+templateId` and `advisorId+imageId`, and it's used by `server/ai-service.js` (around line 1531) and a publication (`imports/server/publications.js` around line 468). The spec's proposed `advisorPostHistory` would clash with it, so use a new name or extend it carefully. *Unverified:* exactly what writes to it.
- **No slate collections yet:** nothing like `rotationSlates`, `slateItems`, `advisorTopicProfile` or `postTopics`.
- **Topics today = `postCategories.slug`** on HTMLPosts (indexed). There's no `primaryTopic` and no admin override field. Chips need a topic display name and colour mapping.
- **No numeric score is returned today.** `getCandidatePostsForUser` (`server/api/post-suggestions.js` around lines 315–337) computes `scorePostWithServices` and sorts, but only returns `post`. The swap view needs a score (and its scale) for each item. The 0–100 "fit" in the mock is a display assumption.
- **No plain-language reason yet.** `resolvePickReason` (`imports/utils/postPickHelpers.js`) returns only the codes `no-services`, `empty` and `success`. The spec's `slateItems.reason` text is new. `no-services` maps well to the "Missing products/services" warning.
- **Monthly "done" tracking is per month on AdvisorConfigs:** `monthlyPickDoneMonthKey`, `monthlyPickDoneAt` and `monthlyPickScheduledPostId`, set by `postSuggestions.markMonthlyPickDone` and `unmarkMonthlyPickDone`. A weekly slate needs its own status. Decide whether approving also marks the month done.
- **Hand-off on Approve:**
  - `postSuggestions.bulkScheduleTopPicks({assignments, scheduledAt})` schedules immediately, with **one shared date** and **website only** (`insertScheduledWebsitePost`). It also marks the pick shown and the month done.
  - `scheduleForUser`, `scheduleSocialForUser` and `createCampaignForUser` exist for single posts.
  - Approve needs a new method that sets the item to approved and then calls the normal scheduling flow. Which channel and which date is undecided (Q3).
- **Managed advisor list:**
  - There's no "managed" flag.
  - `listMonthlyPickAdvisors` includes the advisor category "Content" and excludes "No longer a client" (`MONTHLY_PICK_*_CATEGORIES`).
  - `listMonthlyPickAdvisors` isn't called from any UI file. Manage Advisor Posts uses `getCandidatesForUsers` and `pickOneForUser`.
  - *Unverified:* whether "Content" means managed.
- **Products and services:** `getConfirmedWebsiteServices` and `scorePostWithServices` (`server/api/advisor-website-services-helpers.js`) and the existing Choose Advisor Services panel. The warning box can link to that panel.
- **WP history:** `fetchRecentWordpressPostsForUser` exists, with `DEFAULT_WP_TIMELINE_MONTHS = 6` and `MIN_WP_EXCLUSION_MONTHS = 24` for title exclusion.
- **Swap search:** HTMLPosts has a text index on `name`, `excerpt` and `subtitle`, so the search can use it. Results must still apply the advisor's eligibility filter (`filterEligiblePosts`, the private-post protection).
- **Jobs:** other schedulers use `acquireSchedulerLock` and `releaseSchedulerLock` (`server/scheduler-lock-helpers.js`). The Monday 5:00 AM PT job and the 2:00 AM PT re-sync can follow the same pattern. Watch for DST: 5 AM PT must stay 5 AM local.
- **Theme:** MUI with Inter, primary `#2196F3`, text `#2C3E50`, and radius 12. The mock uses the same.

## Questions for Alex
1. **Unfinished sentence:** what did "and then provide within the" mean? Is it about delivery (for example, an email digest or showing the slate somewhere)?
2. **Picks per advisor per week:** the spec says one top pick plus 2 backups. The brief asks for several picks per slate and a "Partly approved" status. Is it one post a week, or several?
3. **Weekly or monthly:** the job runs weekly, but the spec talks about a monthly slate and "this month's topic". Is one weekly slate one month's pick, or does each week get its own?
4. **Approve:**
   - Does Approve schedule on a default date (like Manage Advisor Posts' "Default schedule date")?
   - Or does it open the normal scheduler?
   - Is it website only, or social and email too?
5. **Approve all with no warnings:** should rows with warnings be left out? The mock does this, as the spec says.
6. **Rebuild:** should it keep picks that are already approved? The mock says yes.
7. **Skip this week:** should anything be logged or shown to the advisor? The mock shows nothing to the advisor.

8. **(New) A post flagged after Monday's build:** should the pick be pulled from the slate automatically (mock: yes, "Flagged since build", Swap only)? Or should it stay, show a warning, and still be approvable?
9. **(New) Clearing the flag:** does any edit after `flaggedAt` clear it, or does someone press "Mark as updated"? Who is allowed to?
10. **(New) "Updated" date:** should it count only content edits? Today `updatedAt` also changes on template linking and trash/restore.
11. **(New) #372:** is its Direction A locked, so the Swap filter can match it? The comment says "if Alex locks it".
12. **(New) Already-approved picks:** if a post is flagged after it was approved and handed to scheduling, should anything happen? Out of scope in the mock.

13. **(Rev 3) Approve vs Schedule:** should Schedule also approve (the mock's default, "Approve and schedule")? Or should Approve be required first? Should plain "Approve" (no date) stay at all?
14. **(Rev 3) Advisors or admins:** the requirement says *advisors* schedule from the review queue, but the queue is an admin screen. Do advisors get their own view of their weekly slate? Not built.
15. **(Rev 3) Channels:** website only (like `bulkScheduleTopPicks`), or social and email too?
16. **(Rev 3) Bulk spacing:** for advisors with several picks, is "same time / one a day / one a week" right? What should the default be?
17. **(Rev 3) Rows with warnings:** should they stay out of bulk Schedule selected (as the mock does, like Approve all)?
18. **(Rev 3) Server rules:** should the server reject past and off-quarter-hour times for admin scheduling (today only the advisor path checks the past)?
19. **(Rev 3) Unschedule:** should it also remove the related social and email posts, as the current cancel code does?

## Unverified
- The scale and meaning of the fit score.
- Whether advisor category "Content" equals "managed".
- What writes to `advisor_post_history`.
- How a slate item stays in sync when its scheduled post is published, cancelled or fails elsewhere.
- How much age down-ranks a post (only shown through the fit score).
- How a swapped-in post is re-checked against the 3rd-month block. The mock only shows a warning.

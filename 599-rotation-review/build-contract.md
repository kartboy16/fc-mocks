# #599 Weekly picks review: build contract

**Status:** Designer mock only. **Not agent-ready. Soft Dev UI hold until Alex picks.** The phase 1 backend (profiles, history, topic tagging) can go ahead in parallel, as Alex's comment allows.

**Rev 2 (Oct 20):** this revision adds content freshness from [Alex's comment 6295711214](https://github.com/kartboy16/content-library/issues/599#issuecomment-6295711214): created and updated dates, a needs-update state, and a created-date filter on Swap. See *Rev 2 changes* below.

Mocks: [Hub](index.html) · [A (recommended)](a-table-drawer.html) · [B](b-split-view.html) · [C](c-focus-review.html)

## Rules the UI must make clear (all directions)
- **Nothing is scheduled until it's approved.** Approving hands the post to the normal scheduling flow.
- **Drafts never publish on their own.** There is no auto-schedule and no auto-publish.
- **Slates are built every Monday at 5:00 AM PT.** Profiles re-sync nightly at 2:00 AM PT.
- **Posts flagged as needing an update are skipped** until they're refreshed (Rev 2).
- These appear as pills at the top of the queue and the slate, and again in the toast after Approve or Skip.

## Open question (do not build around a guess)
> Alex's spec has an unfinished sentence: **"and then provide within the"**. It may be about where or how the slate is delivered.

The mocks show an orange **Open question** callout on the queue ("Delivery of the review queue") and under the slate ("What happens after Approve"). Anything that depends on it, such as delivery by email or Slack, a digest, or showing the slate to advisors, stays **out of scope** until Alex answers.

## Directions
| | Layout | Swap | Best for | UI estimate |
|---|---|---|---|---|
| **A (recommended)** | Full-width table queue (like Manage Advisor Posts) → full slate page with Prev/Next | Right-side drawer | 100+ rows, filters and bulk actions, close to today's admin screens | **2.5–3.5 dev days** (was 2–3) |
| B | Split view: advisor list on the left, slate on the right | Centred pop-up | Fast clicking between advisors without leaving the list | 3.5–4.5 dev days (was 3–4) |
| C | Overview with progress, then one advisor at a time (Approve all and next, keyboard keys) | Inline, under the post | Getting through the whole week quickly | 3.5–4 dev days (was 3–3.5) |

Rev 2 adds about +0.5 day to each direction for the date lines, the needs-update states and the created-date filter. The filter control can be shared with #372 if it's built first.

The estimates cover the UI only. They assume the slate methods and collections from phases 1–2 exist, and they include desktop and mobile layouts, states, and component tests.

**Why A:** it reuses the Manage Advisor Posts table pattern admins already know (fixed-width columns, chips, a 400px drawer), it handles 100+ rows with filters and bulk actions best, and it's the smallest build. B and C can come later as views over the same data.

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

## Unverified
- The scale and meaning of the fit score.
- Whether advisor category "Content" equals "managed".
- What writes to `advisor_post_history`.
- How much age down-ranks a post (only shown through the fit score).
- How a swapped-in post is re-checked against the 3rd-month block. The mock only shows a warning.

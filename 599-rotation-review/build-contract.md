# #599 Weekly picks review: build contract

**Status:** Designer mock only. **Not agent-ready. Soft Dev UI hold until Alex picks.** The phase 1 backend (profiles, history, topic tagging) can go ahead in parallel, as Alex's comment allows.

Mocks: [Hub](index.html) · [A (recommended)](a-table-drawer.html) · [B](b-split-view.html) · [C](c-focus-review.html)

## Rules the UI must make clear (all directions)
- **Nothing is scheduled until it's approved.** Approving hands the post to the normal scheduling flow.
- **Drafts never publish on their own.** There is no auto-schedule and no auto-publish.
- **Slates are built every Monday at 5:00 AM PT.** Profiles re-sync nightly at 2:00 AM PT.
- These appear as three pills at the top of the queue and the slate, and again in the toast after Approve or Skip.

## Open question (do not build around a guess)
> Alex's spec has an unfinished sentence: **"and then provide within the"**. It may be about where or how the slate is delivered.

The mocks show an orange **Open question** callout on the queue ("Delivery of the review queue") and under the slate ("What happens after Approve"). Anything that depends on it, such as delivery by email or Slack, a digest, or showing the slate to advisors, stays **out of scope** until Alex answers.

## Directions
| | Layout | Swap | Best for | UI estimate |
|---|---|---|---|---|
| **A (recommended)** | Full-width table queue (like Manage Advisor Posts) → full slate page with Prev/Next | Right-side drawer | 100+ rows, filters and bulk actions, close to today's admin screens | **2–3 dev days** |
| B | Split view: advisor list on the left, slate on the right | Centred pop-up | Fast clicking between advisors without leaving the list | 3–4 dev days |
| C | Overview with progress, then one advisor at a time (Approve all and next, keyboard keys) | Inline, under the post | Getting through the whole week quickly | 3–3.5 dev days |

The estimates cover the UI only. They assume the slate methods and collections from phases 1–2 exist, and they include desktop and mobile layouts, states, and component tests.

**Why A:** it reuses the Manage Advisor Posts table pattern admins already know (fixed-width columns, chips, a 400px drawer), it handles 100+ rows with filters and bulk actions best, and it's the smallest build. B and C can come later as views over the same data.

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

## Unverified
- The scale and meaning of the fit score.
- Whether advisor category "Content" equals "managed".
- What writes to `advisor_post_history`.
- How a swapped-in post is re-checked against the 3rd-month block. The mock only shows a warning.

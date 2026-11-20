# Private, owner-only posts: build contract

**Status:** Not agent-ready. Soft Dev hold until Alex picks a direction. No issue has been filed.

**Risk: high.** This is a visibility feature in the same code that leaked private posts in #321 and #330. A single missed query would show one advisor's private post to another advisor, to the shared feed, to Pick for me or to search. Build to staging first, run pstack blast-radius and interrogate on the PR, then FC Tester on staging. Alex merges to main.

Mock hub: https://kartboy16.github.io/fc-mocks/private-posts/

**Update (Nov 19, #964):** Alex added a required compliance and proofreading checker for every created post. It is mocked in Direction A only. See the section "Compliance and proofreading checker" below. Added estimate: **23–34 agent hours**, so Direction A is **45–68 h** with the checker.

**Update (Nov 19, 5:40 PM PT):** an edit-time warning and a Held state in Scheduled, for scheduled posts that are edited. See "Held after edit". Added estimate: **16–24 agent hours**, so Direction A is **61–92 h** with the checker and Held.

## Request
Alex (Nov 19, 2026, 2:29 PM PT): "A user wants to create his own posts in our system. I need their posts to never be seen by anyone else but that user."

An advisor writes his own posts in the app. Nobody else can ever see them: not other advisors, not the shared Content Library feed, not Pick for me, not search.

## Recommendation
**Direction A: a "My posts" section in the Content tab. 22–34 agent hours** (cloud agent build plus FC Tester time on staging).

- Private posts are read only by their own endpoint (`myPosts.page`), scoped to the signed-in owner. They never share a query with the library feed, search or Pick for me, which is the situation that caused #321/#330.
- Almost no new navigation. It is one more pill beside Favorites, Hidden, Topics, Compliance Approved and Pick for me.
- All Content stays FC-only, so there is nothing to forget to filter in the UI.

**Direction B (31–48 h): a visibility control in the editor, and private posts mixed into All Content with a lock badge.** The most natural for the advisor, but private and FC posts then live in the same feed, search and Pick for me queries. That is the highest-risk shape, and it needs the most testing. Not recommended.

**Direction C (25–38 h): a separate private space, with its own "My posts" item in the left rail.** Safest separation and room to grow (a table, a split editor, "Make a private copy" from an FC post). Costs a new route and nav item. A good follow-up if advisors write many posts.

## What the code does today (read-only audit of content-library at 283972a)
These are facts from reading the code. They shape the build.

- **Posts have `isPublic`, and a missing value is private** (`imports/utils/htmlPostsLibraryQuery.js`, the Oct 1 decision). Advisors only get `isPublic: true` posts, plus posts in their advisor sources (`availableToAdvisorSourceIds`), plus posts with **`privateToUserId` equal to their own id**.
- **A per-owner field already exists: `privateToUserId`.** Today it is written only by `contentLibrary.materializeRssHtmlPost` (a private copy of an RSS article). It is honoured by the library visibility query, `HTMLPostsByIds`, Pick for me (`buildVisibilityQuery` and `buildPrivatePostProtectionQuery`), the trash owner check and the delete guard (which also accepts `createdBy`).
- **No advisor-facing way to author an HTML post exists yet.** `CreateContent.jsx` has no save call. `HTMLPosts.setPublicStatus` and the other admin methods are admin-only. So this feature needs new methods.
- **Admins see everything.** For an admin the visibility query is `{}` and `htmlPostIsVisibleToViewer` returns true. The UI shows the red lock for private posts. Alex answered open question 1 (Nov 19): admins and support may see owner-only posts. Admin views keep showing them, labelled Private with the owner's name. They must still be excluded from every advisor-facing surface.
- **Support impersonation** (`server/support-impersonation.js`) lets support or admin act as an advisor, so `this.userId` is the advisor. That is fine: support sessions are allowed to see the advisor's private posts (open question 1, answered yes).
- **Gaps found that matter for owner-only posts:**
  - `getPostForView` (`server/user-methods.js`, about line 1273) treats a post with no `availableToAdvisorSourceIds` as "not found". It does not honour `privateToUserId`, so an owner could not open their own post there.
  - `/html-post/:id` (`server/api/html-post-serve.js`) serves a `rawHtml` post by id with **no visibility check**. `/api/post/:postId` (`server/api/embed.js`) also appears to look up by id with only a trashed check. Ids are random, but owner-only posts must not be fetchable by id by anyone except through the publish path below.
  - `embed.js` and `embed-posts.js` use **raw collection access** (`db.collection('HTMLPosts')`), which bypasses the Mongo collection wrappers (like the soft-delete `wrapNotTrashed` wrapper). A default-deny wrapper alone would not cover them.
  - `server/email-suggestions.js` and `server/api/post-suggestions.js` build their own visibility queries. Every such copy must change.
  - Infographic thumbnails use the opposite rule (missing means public) in `imports/server/publications.js`. That is a different collection, but it shows the codebase has two meanings of "missing". Do not copy that rule.

## Data model
Add no new collection for the first build. Mark owner-only posts so they can be excluded with one rule:

- `sourceType: 'advisorAuthored'`
- `privateToUserId: <ownerId>` and `createdBy: <ownerId>`
- `isPublic: false`
- `availableToAdvisorSourceIds: []` (forced empty on every write, because the visibility query ORs this in)
- Normal content fields: `name`, `excerpt`, `content`, `featuredImage`, `createdOn`, `updatedAt`, `trashedAt`.

**Alternative (safer, costs more): a separate collection.** An owner-only post could never match any HTMLPosts query. Every downstream flow (website publish, email campaign, social schedule, trash) keys on an HTMLPosts id, so each would need a second source. Estimate roughly +10–16 h. Raise with Alex only if he wants the strongest guarantee.

## Enforcement (the important part)
**Owner-only is enforced on the server in every publication and method. The UI is never the control.** Hiding a card is not enough.

1. **Default deny at the collection layer.** `HTMLPosts.find`, `findOne`, `findOneAsync` and `countDocuments` already pass through a wrapper for soft-delete (`wrapNotTrashed`). Add a second wrapper that ANDs in `{ sourceType: { $ne: 'advisorAuthored' } }` unless the caller passes `{ includeOwnerOnlyFor: <userId> }`, which adds `privateToUserId: <userId>` instead. A new query that forgets the rule then fails safe.
2. **Raw collection call sites** (`rawCollection()`, `db.collection('HTMLPosts')`, aggregate pipelines, change streams, `distinct`) bypass that wrapper. List every one, and give each the same exclusion. Add a test that fails if a new raw call is added without it.
3. **Every surface, each with a test (see Tests).** Library live publication and card publication, `HTMLPosts.libraryPage`, `libraryCount`, the get-by-id method, `HTMLPostsByIds`, Pick for me and its outside-access path, search (text and category), Topics, Favorites, Hidden, Compliance Approved, the embed and public APIs, `/html-post/:id`, `getPostForView`, email suggestions, scheduled library posts, admin lists (Manage Advisor Posts, Users, trash lists), analytics, RSS, exports, support and impersonation sessions.
4. **`myPosts.*` methods** (`create`, `update`, `get`, `page`, `trash`, `restore`) check `this.userId`, then filter by `privateToUserId === this.userId` **in the query**, not after. A wrong id returns "not found", never "not allowed", so existence is not revealed.
5. **Publishing is the only way out.** When the owner adds a post to his website, sends it by email or shares it on social, the system writes a **published snapshot** (page content under the owner's site and a stable URL on his domain). The private source post stays owner-only. The by-id endpoints serve owner-only posts only through that published snapshot. Taking the page down removes the snapshot.
6. **Lists are capped**: `limit` (default 24, max 50), `skip`/`page`, and field projection to card fields only (name, excerpt, featuredImage, createdOn, status, slug). Never return `content` in a list.

## Screens and states
Scenes are `?s=` values on each direction page. Add `&phone=1` for 390. `A` is `a-section.html`, `B` is `b-visibility.html`, `C` is `c-private-space.html`.

| Scene (`?s=`) | Dir | What it shows |
| --- | --- | --- |
| `all` (A, B), `content` (C) | A, B, C | A: All Content, FC posts only. B: all sources, private posts mixed in with a lock badge and a Source filter. C: Content tab, FC posts only, with the rail item "My posts" added. |
| `list` (A, C), `mine` (B) | A, B, C | Owner's posts: A cards under a "My posts" pill, B filtered by Source, C table with Edit and Use. Statuses: Draft, Live on your website, Scheduled, Emailed. |
| `search` | B | Search "tax" shows FC results and the owner's own match with a lock badge. |
| `empty` | A, B, C | "You haven't written any posts yet", a Write a post button. |
| `loading` | A, B, C | Skeleton cards or rows. |
| `error-load` | A, B, C | "Couldn't load your posts", Try again. Nothing was changed. |
| `create` | A, B, C | New post: title, summary, body, featured image. A and C: banner "Only you can see this post". B: a badge by the title and a "Who can see this post" panel with **Only me** selected and "Other advisors" disabled. |
| `error-title` | A, B, C | Title is required. Field error and an alert. |
| `saving` | A, B, C | Fields and buttons disabled, "Saving…". Double submit blocked. |
| `saved` | A, B, C | Toast "Saved. Only you can see this post." and "Saved just now". |
| `error-save` | A, B, C | "Couldn't save your post. Your changes are still on this screen." Nothing is lost. |
| `edit` | A, B, C | Existing post. C shows a list on the left (desktop) and the editor on the right. |
| `copy` | C | "Make a private copy" of an FC post. The copy goes to My posts. The original is unchanged. |
| `use` | A, B, C | Use menu: Add to my website, Email my clients, Share on social, Preview what clients see, Edit, Move to Trash. |
| `site` | A, B, C | Add to your website: publish now or schedule, the URL on the advisor's own domain, and a notice that publishing puts it on his site. |
| `email` | A, B, C | Email my clients: list, From (his own address), subject, link to his own site. |
| `social` | A, B, C | Share on social: accounts, caption, link to his own site. |
| `no-site` | A, B, C | Website not connected. Sharing needs it, so the advisor is asked to connect first. |
| `site-done` | A, B, C | Toast after scheduling. Status chip changes. |
| `pv-web`, `pv-email`, `pv-social` | A, B, C | What the advisor's clients see. Domain `example-advisor.ca`, "Your Firm Name", no FC name, link or logo. |
| `trash` | A, B, C | Move to Trash. Warns that a live post comes off his website. 60-day restore, the same Trash as other posts. |

## Compliance and proofreading checker (Direction A, #964)
Alex (Nov 19, 2026): "Also need to make sure posts that are created always have a compliance and proof read checker."

Mock: https://kartboy16.github.io/fc-mocks/private-posts/a-section.html?s=check-found (all checker scenes are in the switcher on `a-section.html`, each works with `&phone=1`).

### What the advisor sees
- A **Checks** panel in the My posts editor, with a status chip and two groups, **Compliance** and **Proofreading**, as tabs with counts. A one-line status bar sits above the editor so the state is visible on a phone without scrolling.
- Findings highlight the text in the post (amber underline for compliance, red wavy for proofreading). Each finding shows a label, the quoted text, a short message and a suggested change.
- Actions: **Fix** (apply the suggested change; the compliance "Past performance" finding says **Add disclosure**) and **Mark reviewed** for compliance findings; **Fix** and **Dismiss** for proofreading findings. Compliance findings cannot be dismissed as false positives, only marked reviewed. Resolved findings move to a collapsed "Resolved" list with Undo.
- **Applying a Fix** re-checks the changed sentence in the background. **Typing** makes the whole result stale.
- The list shows a small Checked or "n to review" chip on each post.

### Where the checker runs (server)
1. **On every save**, automatically, after the content is written. The advisor never has to remember to run it. A **Run check** button also exists, for a post that was never checked.
2. **Before any schedule, email or share**, the server requires a check that matches the post's **current content** (a hash of title, summary and body). If the post changed after the last check, the step is refused and the advisor is sent to "Checks are out of date".
3. **At send time for scheduled items**, the scheduler re-checks the stored hash. If the post was edited after scheduling, the item is held and the advisor is told. (Open question 16.)
4. The **server is the authority.** Browser-side spell check is advisory. The existing spell check runs in the browser only, and its dictionary can fail to load. Here the server loads the same en_CA dictionary and runs the check itself.

**What the server stores on the post** (`postCheck`): `version` (checker version, shown as "Checker v1"), `contentHash`, `ranAt`, `status` (ok, error), `error` per group, and `findings[]` each with `id`, `group` (compliance or proofreading), `ruleId`, `range`, `quote`, `message`, `suggestion`, `state` (open, fixed, dismissed, reviewed), `stateBy`, `stateAt`.

**Acknowledgement log** (`postCheckAcks`, one row per acknowledgement): `postId`, `userId`, `ackAt` (server time), `channel` (website, email or social), `checkVersion`, `contentHash`, `findingIds` that were unresolved. Rows are never edited or deleted. The acknowledgement is only valid for that content hash. It is what the admin and compliance audit reads.

**Server gate.** Website queue, email campaign create or schedule, and social schedule each call one shared `assertPostChecked(postId, userId, channel)`. It fails when there is no check, the check is stale, the check errored, or open findings exist with no acknowledgement for this hash. No path may skip it, including REST routes and schedulers. Test every path.

### Warn or block (open with Alex)
Alex decided (Nov 19): unresolved compliance findings **warn**, and the advisor must acknowledge them. The build is **warn and acknowledge**: the advisor ticks "I've reviewed these findings and want to continue" and presses Continue. The gate reads a single setting (`postCheck.mode`: `warn`, `block-compliance`, `block-all`) so changing the answer is a config change, not a rebuild. In block mode the checkbox is replaced by "Fix or mark reviewed to continue", and Continue stays off. A checker **error** always blocks, in every mode, because there is no result to acknowledge.

### Checker states and screens (Direction A, `a-section.html?s=`; add `&phone=1` for 390)
| Scene (`?s=`) | What it shows |
| --- | --- |
| `check-idle` | Post never checked. "Not checked yet", with Run check. |
| `save-check` | Right after Save. Toast "Saved. Running checks…". The checker starts on its own. Editing is paused. |
| `checking` | A manual run. Spinner, "Checking compliance and proofreading…". |
| `check-found` | Findings present. Compliance tab with 3 findings, highlights in the text. |
| `check-proof` | Same post, Proofreading tab with 3 findings. |
| `check-fixed` | Some resolved: one Fixed, one Reviewed, one Dismissed, two still open. Resolved list collapsed. |
| `check-clean` | No findings. "No findings. Compliance and proofreading both checked." |
| `check-stale` | Post edited after the last check. Highlights turn grey and dashed, findings are dimmed and their buttons are off. "Out of date", with Run check. |
| `check-error` | The checker couldn't run. The post is saved. Try again. Scheduling, email and share are blocked. |
| `check-partial` | Compliance ran, proofreading couldn't. The tabs work separately. |
| `ack` | Before Add to my website, with unresolved findings: "Review before you continue", the two open findings, an unticked checkbox, Continue disabled. |
| `ack-checked` | Same, ticked. Continue enabled. |
| `ack-email`, `ack-social` | The same step before Email my clients and Share on social. |
| `ack-stale` | Post edited since the last check. No acknowledgement possible. "Run checks". |
| `ack-error` | The checks couldn't run. Try again. |
| `ack-clear` | No unresolved findings. The step is skipped. The website dialog says "Checked, no findings". |
| `ack-done` | After Continue. The website dialog shows "You acknowledged 2 findings", with time and name. |

The Use menu in A (`use`) now opens the acknowledge step for Add to my website, Email my clients and Share on social.

### What was reused from content-library (read-only audit)
- `imports/utils/spellCheck.js`: the Typo en_CA dictionary, the financial-term allowlist (RRSP, TFSA and so on), and the HTML-to-words cleanup. Reuse it for the **spelling** half of Proofreading. It currently runs only in the browser and only on email campaigns.
- `imports/ui/EmailCampaigns/SpellCheckWarningDialog.jsx`: the warn pattern (a "Go back" button and a "<Action> Anyway" button) and the "Spell check couldn't load" state. The acknowledge step follows this pattern and adds the checkbox. The existing rule "never silent-save when the dictionary is unavailable" carries over as "checker error blocks".
- `server/compliance-gate.js` and `imports/utils/externalComplianceAttestation.js`: the server gate that refuses a send, and an attestation record with the actor, a time and a version stamp. Model the acknowledgement log and `assertPostChecked` on these. The per-advisor compliance mode (email approval or external attestation) is unchanged, and the new checker applies to every created post even when that mode is off.
- Not reusable: the **Compliance Approved** topic (`compliance-approved`) is a content label, not a checker. There is **no existing grammar check, AI proofreader or compliance-wording scanner** in content-library. Grammar and compliance rules are new work. (The local copy of the repo was older than main, so newer files were read through the GitHub API at c300f76. Re-check before building.)

### Compliance and legal text
Rule text, wording suggestions (for example "aims to improve outcomes", "Add disclosure") and the acknowledgement sentence are **flagged placeholders** (orange PLACEHOLDER lines in the mock). Legal supplies the real rule list, messages and wording. The findings in the mocks are generic samples.

### Mobile (390)
The status bar sits at the top. The panel sits below the post. Tabs, findings and buttons are 40px or taller. The acknowledge step is a bottom sheet with Continue first. Tapping a highlight to jump to its finding is not mocked.

### Tests added by the checker
- Saving a post always starts a check. Editing one character makes the result stale.
- Schedule, email and share are each refused with no check, a stale check, an errored check, and open findings with no acknowledgement (in warn mode). They succeed with a current check and a matching acknowledgement, and with no open findings.
- The acknowledgement row holds user, time, channel, version, hash and finding ids, and it is not valid after the post changes.
- Another advisor cannot read or acknowledge Jane's check results (same owner-only rules as the post).
- Each of website queue, email and social is covered, including REST and scheduler paths.
- Proofreading and compliance fail independently (`check-partial`). The check list is capped and paged, and returns no post body.

## Held after edit (Direction A, #964 follow-up)
Alex (Nov 19, 5:40 PM PT, via Chief of Staff): "Yes, have FC Designer mock an edit-time warning and a Held state in the Scheduled list."

Today, when an advisor edits a post that is already scheduled, the server holds it. At send time the website, social and SES schedulers refuse it with `post-changed-since-scheduled` and mark the item failed. The advisor only finds out after the send time passes. This add-on tells them at the moment they save, and shows the post as **Held** in Scheduled, with a way back.

Mock: https://kartboy16.github.io/fc-mocks/private-posts/a-section.html?s=edit-warn (all scenes are in the switcher; each works with `&phone=1`). The status of this mock is the same as the rest: **Not agent-ready. Soft Dev hold until a direction is picked.**

### What the advisor sees
1. **Before saving an edit to a scheduled post** (`edit-scheduled`, `edit-warn`): a blue bar in the editor says the post is scheduled. Saving opens a confirm that uses the acknowledge pattern: "This post is scheduled for Nov 24, 2026, 9:00 AM. Saving changes holds it until you check it and schedule it again." It lists each affected channel (website with its address, email with the list, social with the accounts) and its time. Buttons: **Save and hold** (primary) and **Cancel**. If the post has no scheduled items, there is no confirm.
2. **After saving** (`edit-held-saved`, `held-edit`): a toast, a **Held** pill beside the title, and an amber banner in the editor: "Held: edited after scheduling. It will not send." with the original time and a **Re-check & reschedule** button.
3. **In Scheduled** (`sched-held`, `sched-held-only`, `sched`, `sched-held-none`): a toggle All / Scheduled / Published on My posts, a dot on Scheduled when something is held, a banner "1 post is on hold", and chips **All scheduled** and **Held** with counts. A held row is tinted, shows a Held pill, the original time **struck through and grey**, the channels greyed, the reason line ("Held: edited Nov 19, 5:42 PM PT, after it was scheduled. It will not send."), and the actions **Re-check & reschedule** and **Edit**. Held rows sort first. At 390 each row is a card. On the My posts cards a held post shows the Held pill (`list-held`).
4. **Re-check & reschedule** is a short three-step flow in one dialog (Check, Review, Schedule):
   - **Check** (`held-recheck`): runs the compliance and proofreading checker on the current text. (The save already ran it. The server reuses that result when the content hash still matches and runs it again when it does not or when it errored.)
   - **Review** (`held-ack`): only when findings are unresolved. The same acknowledge step as before: tick the box, Continue.
   - **Schedule** (`held-reschedule`): the original date, time and channels are filled in. **Schedule again for Nov 24**. On success (`held-rescheduled`) the row goes back to Scheduled, the Held count drops to 0, and a toast confirms.
   - If the **original time has passed** (`held-past-time`), the picker says so, suggests the next morning at 9:00 AM, and will not accept a past time.

### States
| Scene (`?s=`) | What it shows |
| --- | --- |
| `edit-scheduled` | Editor for a scheduled post. Blue "Scheduled for Nov 24" bar. |
| `edit-warn` | The "Saving will hold this post" confirm, with the three channels and times. |
| `edit-held-saved` | Saved. Toast, Held pill, amber Held banner. |
| `held-edit` | Opening a held post later. Same banner, Re-check & reschedule. |
| `sched` | Scheduled list, nothing held. |
| `sched-held` | One held row, the banner, the Held chip with a count. |
| `sched-held-only` | The Held chip active. |
| `sched-held-none` | Held chip active with none: "Nothing is on hold". |
| `sched-empty` | "Nothing is scheduled." |
| `sched-loading`, `sched-error` | Skeleton rows. "Couldn't load your scheduled posts. Nothing was changed, and nothing was sent." Try again. |
| `held-recheck` | Step 1, checking. Still on hold. |
| `held-recheck-error` | The checks couldn't run. Still on hold, nothing sent. Try again. A checker error never lets the post be rescheduled. |
| `held-ack` | Step 2, acknowledge unresolved findings. |
| `held-reschedule` | Step 3, original time prefilled, channels ticked. |
| `held-reschedule-error` | "Couldn't schedule it again. Your post is still on hold and nothing was sent." Try again. |
| `held-past-time` | The original time has passed. New time suggested. |
| `held-rescheduled` | Back in Scheduled, Held 0, toast. |
| `list-held` | My posts cards with the Held pill. |

### Server notes
- **Setting the hold.** `myPosts.update` sets the hold in the **same operation** as the content write, when the new content hash differs from the hash stamped on any pending scheduled item (website queue, social scheduled, SES scheduled campaign). It writes `scheduleHold { heldAt, heldBy, reason: 'post-changed-since-scheduled', originalWhen, channels[ { channel, itemId, originalWhen } ] }` on the post, and moves each pending item to a new status **`held`** instead of leaving it `scheduled` to fail at send time. A save that does not change title, summary or body (the hash) does not hold. (Open question 20: does changing the featured image hold?)
- **Confirm is enforced on the server.** If the update would hold something and the call does not carry `confirmHold: true`, it fails with `hold-confirm-required` and the client shows the confirm. The UI cannot hold a post silently.
- **Schedulers keep refusing.** The website, social and SES schedulers already refuse a changed post at send time with `post-changed-since-scheduled`. Keep that as the backstop (for example for an edit that races a send). They must also skip items in status `held`, and never mark them `failed`.
- **Releasing the hold.** A new `myPosts.rescheduleHeld(postId, when, channels)` requires a check that matches the current hash (the same `assertPostChecked`), an acknowledgement for that hash if findings are open, and a time in the future. It restamps `postCheckHash` on each item, sets them back to `scheduled`, and clears `scheduleHold`, in one operation. A partial failure leaves everything on hold. It is safe to call twice.
- **The Scheduled list surfaces held state.** Scheduled is queue-first today (`scheduledLibraryPosts.js` reads the queue snapshots) and filters to public posts, so owner-only posts need a path of their own: a new `myPosts.scheduledPage({ filter: 'all' | 'held', limit, skip })` and `myPosts.heldCount()`. **Lists are capped:** limit default 24, max 50, `skip` paging, and field projection to card fields plus `channels`, `when`, `originalWhen`, `heldAt` (never the post body). The count comes from a count query, not from loading the list. Owner-scoped in the query, like every `myPosts.*` method.
- **Tell the advisor.** In-app: the banner, the Held pill, and the dot on Scheduled. Optional: one email when something goes on hold close to its send time (open question 21).
- **Other edits.** Trashing a held post cancels its items. Editing a held post again keeps it held. The advisor never has to choose between the old and new text: there is only the new text.
- **White label.** Nothing here is client-facing. Clients never see held, because nothing is sent.

### Tests added by this add-on
- Saving a changed scheduled post holds every pending item on all three channels, in one operation, and requires `confirmHold`. Saving an unchanged one does not hold.
- A held item is never sent and never marked failed by the three schedulers. A forced send of an edit that raced the hold is still refused (backstop).
- `rescheduleHeld` is refused with no check, a stale or errored check, open findings with no acknowledgement, and a past time. It succeeds with a current check and acknowledgement and a future time. It is idempotent.
- Another advisor cannot see, count or reschedule Jane Advisor's held items (`post-not-found`).
- `scheduledPage` clamps `limit`, pages with `skip`, and returns no body. `heldCount` matches the list.
- A partial reschedule failure leaves every item held.

### Reused
The acknowledge dialog pattern and the acknowledgement log from the checker, the Checks panel, the existing `post-changed-since-scheduled` refusal in the schedulers, and the queue-first Scheduled list. The toggle All / Scheduled / Published matches the one in the Content tab.

## Copy
Key strings (final wording is a product call):
- Banner: "Only you can see this post" and "Other advisors, the Content Library, search and Pick for me never show it."
- Badge: "Only me". Section: "My posts". Empty: "You haven't written any posts yet".
- Publish notice: "This puts the post on your website. Anyone with the link can read it there. It is still not shared with other advisors."
- Save error: "Couldn't save your post. Your changes are still on this screen. Try again in a moment."
- Trash: "It is live on your website, so it will come down from <url> too. You can restore it from Trash for 60 days."
- **Compliance and legal wording is a flagged placeholder** (shown as PLACEHOLDER in the Website, Email and Social dialogs). Legal supplies the final text. Do not invent it.

## White label
Anything a client sees (published page, email, social card, links, footers, From name) uses the advisor's own domain and firm name. It never links to or shows the FC app domain or brand. The published URL is `https://<advisor domain>/news/<slug>`. Follow fc-white-label-links. Test fixtures use Jane Advisor, Your Firm Name, example-advisor.ca and example.com only (test-fixture-names).

## Open questions for Alex
Defaults in the mocks are shown in brackets. Each one changes the build.

1. **Can admins or support sessions see these posts?** [**Answered by Alex, Nov 19: Yes.** Admins and support sessions can see these posts. Nobody else can: no other advisors, library feed, search or Pick for Me.]
2. **Can he schedule, email or share them to his own clients?** [Yes, as an intentional publish. The post then lives on his own site. "Only him" applies to the library, other advisors, search and Pick for me.] If the answer is "never seen by anyone, ever", remove Use and keep Preview only.
3. **Can he later make one shareable or public? Is that one-way?** [No. Not in scope.] If yes: who approves, and does it become an FC library post, or go only to his firm?
4. **What happens if the advisor account is deleted or moved to another firm?** [Posts stay with the account owner id. Deleted account: posts are deleted after the normal retention window. Move: posts stay with the advisor, not the firm.]
5. **Do they count toward limits or billing?** [No limit in v1.] Add a cap per advisor if needed.
6. **Do they appear in analytics?** [Only his own site and campaign analytics. Never in FC-wide or admin analytics.]
7. **Can he duplicate an FC post into a private copy?** [Not in A or B. Shown in C as "Make a private copy".]
8. **Is there a compliance or approval flow?** [Not in v1. Placeholder wording on publish.] Firms that need approval may want the existing compliance step before publish.
9. **Should his own search include his private posts?** [A: no, My posts is separate. B: yes, with a lock badge.]
10. **Can he write posts with AI help or import from his site?** [Out of scope.]
11. **Do private posts get a firm or team owner?** [No. One advisor owner. Teams out of scope.]
12. **Who can request deletion for compliance or records retention?** [Owner only. Retention rule needs a decision for regulated firms.]
13. **Can one be previewed by a link before publishing?** [No. Preview is inside the app only.]
14. **Do admins need a way to find a post an advisor reports as lost?** [Yes, admins can see them, so they can find it. Restore from Trash on his account via support.]
15. **Should unresolved compliance findings block publishing, or only warn?** [Decided by Alex, Nov 19: compliance findings warn and the advisor must acknowledge them. Setting `postCheck.mode` switches it. A checker error always blocks.] Does the answer differ for compliance findings and proofreading findings?
16. **If a scheduled post is edited after it was scheduled, what happens?** [Hold the send and tell the advisor, because the check is for the old text.]
17. **Who owns the compliance rule list and the wording?** [Legal. Placeholder in the mocks.] How often does it change, and does a new rule re-flag posts already published?
18. **Which proofreading engine?** [Reuse the en_CA dictionary for spelling. Grammar needs a rules library or an AI service, which is a build decision and may add hours.]
19. **Can an admin or support user acknowledge findings on the advisor's behalf?** [No. Only the owner acknowledges, and the log records who.]

20. **Does changing only the featured image of a scheduled post hold it?** [No. The hash covers title, summary and body.]
21. **Should the advisor get an email when a scheduled post goes on hold?** [No. In-app only: banner, pill and dot.] Add one if a send is close.
22. **Should there be a "Discard changes" that restores the scheduled version?** [Not mocked. It needs the server to keep a copy of the text as scheduled, which it does not do today. Skipped as not cheap.]
23. **Does a held post that nobody reschedules expire?** [No. It stays held until the advisor acts or trashes it.]

## In scope
- Direction picked by Alex: owner-only create, edit, list, trash and restore.
- The empty, loading, error and success states in the table above.
- Server enforcement and tests on every surface listed.
- Use flows: add to website, email, share on social, with the advisor's own domain on everything clients see.
- 390px layout.
- Held after edit in Direction A: the edit-time confirm, the Held state in Scheduled, and Re-check & reschedule.
- Compliance and proofreading checker in Direction A: runs on save, server-stored result and version, the acknowledge step before schedule, email and share, and the acknowledgement log.

## Out of scope
- Making a post public or shared with other advisors, firms or teams.
- Discard changes on a held post, multiple scheduled versions of one post, and per-channel hold.
- A blocking mode beyond the single `postCheck.mode` setting, a rule editor, and per-firm rule sets.
- Approval workflows, AI drafting, importing, collaboration and comments.
- Billing or limits.
- Webhooks, bulk actions and exports of private posts.
- A separate logged support view (admins and support already see the posts through admin lists and impersonation).

## Mobile notes (390)
- The rail is hidden. The top bar has the menu, logo and avatar.
- Filter pills scroll sideways. Cards are one column. Primary buttons are at least 44px tall.
- Editor: Save draft and Save post sit at the top and stack to equal width. The side panels (featured image, visibility) drop below the body.
- Dialogs become bottom sheets with the primary button first.
- C: the split view becomes list, then editor, on separate screens.

## Tests (must pass on staging before FC Tester)
Use two test advisors, **Jane Advisor** (owner) and **Sam Advisor** (other), plus an admin, a support user and a logged-out visitor. Sample post titles only.
- Sam cannot fetch Jane's post by id through any method, publication, REST route or embed route. The answer is "not found", never "not allowed".
- Jane's post is absent from Sam's library feed, `libraryPage`, `libraryCount`, search (text, category, topic), Favorites, Hidden, Compliance Approved and Pick for me, including the outside-access path.
- Jane's post is present in admin views (labelled Private, owner Jane Advisor), and absent from Sam Advisor's library, search, Pick for Me and every by-id route.
- A support impersonation session as Jane sees Jane's posts. A session as Sam does not.
- A logged-out request to `/html-post/:id`, `/api/post/:id` and `/api/posts/:advisorId` returns not found for an unpublished owner-only post.
- After Jane publishes to her site, the published URL works for visitors, the source post is still hidden from Sam, and taking the page down returns 404.
- The collection wrapper: a query without `includeOwnerOnlyFor` never returns an owner-only post. A scan test fails on any raw `HTMLPosts` access without the exclusion.
- Every list method caps `limit`, pages with `skip`, and returns only card fields. A request for `limit: 10000` is clamped.
- Client-facing output (page, email, social) contains no FC domain or brand.
- Existing `privateToUserId` RSS posts keep working for their owner.

## Estimate (real agent hours: cloud agent build plus FC Tester time)
| Piece | A | B | C |
| --- | --- | --- | --- |
| Server model, collection default-deny, raw call site audit and patches | 7–10 | 9–13 | 7–10 |
| `myPosts.*` methods with capped, paged, projected lists | 3–4 | 3–4 | 3–4 |
| Client: list, empty, loading, error, editor, trash | 7–10 | 10–15 | 9–13 |
| Use flows: website, email, social, published snapshot on his domain | 3–6 | 3–6 | 3–6 |
| Library, search and Pick for me changes | 0 | 3–4 | 0 |
| Tests across all surfaces plus FC Tester on staging | 2–4 | 3–6 | 3–5 |
| **Total** | **22–34** | **31–48** | **25–38** |

**Checker (Direction A only, #964): 23–34 h added.**
| Checker piece | Hours |
| --- | --- |
| Check service (spelling reuse, placeholder compliance rules, grammar), result storage with version and hash, run on save | 6–9 |
| Server gate on website, email and social paths, acknowledgement log, error codes, `postCheck.mode` setting | 4–6 |
| Editor UI: panel, tabs, highlights, Fix, Dismiss, Mark reviewed, stale, error, 390 | 7–10 |
| Acknowledge step in three flows, list chips | 3–4 |
| Tests across every path plus FC Tester on staging | 3–5 |
| **Checker total** | **23–34** |

**Held after edit (Direction A only, #964 follow-up): 16–24 h added.**
| Held piece | Hours |
| --- | --- |
| Server: hold flag set with the edit, new `held` status across the website, social and SES queues, `confirmHold`, `rescheduleHeld`, `scheduledPage` and `heldCount` (capped, paged, projected), owner scope | 6–9 |
| Client: edit confirm, Held banner and pill, Scheduled list (all and held, rows and 390 cards), the three-step re-check flow with errors and past time | 7–10 |
| Tests across the three schedulers, races, owner-only and caps, plus FC Tester on staging | 3–5 |
| **Held total** | **16–24** |

**Direction A with the checker and Held: 61–92 h.** (A alone 22–34, checker 23–34, Held 16–24.)

**Direction A with the checker: 45–68 h.** The grammar engine (open question 18) is the main swing. An AI-based grammar service could add 4–8 h.

Add 10–16 h if Alex wants the separate-collection option. Admin and support visibility needs no extra time.

Not agent-ready. Soft Dev hold until a direction is picked.

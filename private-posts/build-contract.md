# Private, owner-only posts: build contract

**Status:** Not agent-ready. Soft Dev hold until Alex picks a direction. No issue has been filed.

**Risk: high.** This is a visibility feature in the same code that leaked private posts in #321 and #330. A single missed query would show one advisor's private post to another advisor, to the shared feed, to Pick for me or to search. Build to staging first, run pstack blast-radius and interrogate on the PR, then FC Tester on staging. Alex merges to main.

Mock hub: https://kartboy16.github.io/fc-mocks/private-posts/

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
- **Admins see everything.** For an admin the visibility query is `{}` and `htmlPostIsVisibleToViewer` returns true. The UI shows the red lock for private posts. That conflicts with "never seen by anyone else", so owner-only posts must be excluded for admins as well, unless Alex says otherwise (open question 1).
- **Support impersonation** (`server/support-impersonation.js`) lets support or admin act as an advisor, so `this.userId` is the advisor. A check on `userId` alone does not keep support out. See open question 1.
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

1. **Can admins or support sessions see these posts?** [No. Excluded from admin lists too. Support impersonation is a gap, see audit.] If support must be able to help an advisor, add a logged, read-only view.
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
14. **Do admins need a way to find a post an advisor reports as lost?** [Not in v1. Talk to the advisor, or restore from Trash on his account via support.]

## In scope
- Direction picked by Alex: owner-only create, edit, list, trash and restore.
- The empty, loading, error and success states in the table above.
- Server enforcement and tests on every surface listed.
- Use flows: add to website, email, share on social, with the advisor's own domain on everything clients see.
- 390px layout.

## Out of scope
- Making a post public or shared with other advisors, firms or teams.
- Approval workflows, AI drafting, importing, collaboration and comments.
- Billing or limits.
- Webhooks, bulk actions and exports of private posts.
- Admin or support viewing (unless Alex answers yes to question 1).

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
- Jane's post is absent from the admin library, Manage Advisor Posts, Users and trash lists (or present only if Alex answers yes to question 1).
- A support impersonation session sees Jane's posts only if Alex answers yes to question 1.
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

Add 10–16 h if Alex wants the separate-collection option. Add 4–8 h for a logged support view if he answers yes to question 1.

Not agent-ready. Soft Dev hold until a direction is picked.

# #688 Email advisors their post suggestions: build contract

Issue: [#688](https://github.com/kartboy16/content-library/issues/688), which pairs with [#687 Rewrite in my voice](../687/index.html). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Today (read-only, at `6499dd7`)

- `server/email-suggestions.js` is built but **turned off**. Its import in `server/main.js` is commented out, and so is the `/content-library/add-and-share` route in `client/main.jsx`.
- When it was on, a daily 9:00 cron (with a scheduler lock and a claim-before-send) emailed advisors who had **no website post in 14+ days**, at most every 14 days. It sent 3 posts, each with one "Add & Share This Post" button.
- Links are built with `Meteor.absoluteUrl()`, which is **FC's own domain**. The `token` is `Random.id()`, which is never stored or checked. The unsubscribe link is `?advisorId=&token=Random.id()`, also unchecked. There's no mailing address and no `List-Unsubscribe` header.
- Settings are only `emailSuggestionsEnabled` and `emailSuggestionPreferences` (product types, date range) on `advisor_configs`. There's no frequency, day/time or recipients setting.
- The in-app picks engine lives in `server/api/post-suggestions.js` (services match, recency, `user_hidden_posts`, Pick for me). The approve path is `insertScheduledWebsitePost` plus the compliance mode (`email`, `external` or `off`). SES unsubscribe is `/api/ses/unsubscribe/:token`, and the `List-Unsubscribe` and `List-Unsubscribe-Post` headers are set in `server/ses-campaign-service.js`.
- **#657 carry-over:** today's approval email buttons act on a plain GET. Link scanners (Outlook Safe Links, Mimecast, Proofpoint, Gmail prefetch) open links, so a GET can approve by itself. The light confirm page (#657 B) was picked. **This digest uses the same pattern: no email link changes anything on GET.**

## Recommendation: A, one card per post

- **[A](a-digest.html)** gives each post a card with a thumbnail, summary and reading time, plus **Review & Approve**, **Rewrite in my voice**, **Skip** and **Download copy + images (.zip)**.
  - Each button opens a **[light confirm page](landing.html)** with a "One more step" banner. One click there finishes the action.
  - After an action, the page lists the **other picks this week**, so the advisor can finish the rest without going back to the email. Those on-page buttons finish in one click.
  - It matches the spec's "one-click actions per post" while staying safe from scanners.
- **[B](b-digest.html)** is a compact list with one **"Review this week's picks"** button that opens a **[board](b-board.html)** where every post can be actioned. It's the simplest email and the fewest links. But the email has no per-post action, and it needs a page session built from a token.
- **[C](c-digest.html)** puts the **top pick** in a hero card with full buttons, and shows the other picks as small rows with text links. It's good for engagement, but it needs ranking reasons ("matches your Retirement service"), and the small links are harder to tap.

## Button copy (Alex, Oct 29)

- The approve button reads **Review & Approve** everywhere: the email in A, B and C, the B board, the confirm pages (button, "One more step" banner and the sticky bar on phone), the "other picks" list and the rewrite page.
- Its behaviour doesn't change: the email link opens the confirm page (GET renders only), and one click on **Review & Approve** there sends the POST that finishes it.
- Headings, statuses and permission names keep the plain word ("Approve this post?", "✓ Approved", "Can approve").

## Screens and states

### 1. Digest email (A `?img=on|off&dk=off|on&rcp=owner|view`, B, C)

- **From:** "Your Firm Name · Post suggestions" `<suggestions@your-firm.example.com>`. The sending domain is an open question.
- **To:** Jane Advisor, or each recipient on their own copy.
- **Subject:** "3 posts picked for you this week".
- **Header:** the firm logo, "Your Firm Name", "Post suggestions for your Insights page".
- **How-it-works line:** "Each button opens a page where **one click finishes**. Nothing happens from the email itself. **Nothing publishes automatically**: approved posts go to compliance review first."
- **Each card:** a thumbnail (with alt text), the title, a summary (about 150 characters), the reading time and the topic. Buttons: **Review & Approve** (primary), Rewrite in my voice, and Skip (muted). Below them: "⬇ Download copy + images (.zip) to post it yourself". At the bottom of the email: "Download all 3 (.zip)" and "See all picks on one page".
- **View-only recipient** (`rcp=view`): "Hi Sam, you can view this week's suggestions for Jane Advisor and download them. **Jane approves them.**" They get Preview and Download only.
- **Footer** (marked **PLACEHOLDER: needs compliance review**):
  - Why they're getting it.
  - The sent-to address.
  - The firm name, mailing address (123 Example Street…), contact email and phone.
  - **Manage digest preferences** and **Unsubscribe from suggestion emails**.
  - Link expiry date.
- A **TEST** banner appears on test sends, and their buttons do nothing.

### 2. Action pages ([landing.html](landing.html) `?act=approve|skip|download|unsub|view&st=…&from=email|app&comp=on|off`)

Each page has a light confirm on top and a post preview below (the #657 B pattern). The address shows `links.example.com`, a white-label placeholder.

| Act | State | Copy |
|---|---|---|
| approve | `confirm` | Banner: "One more step: click **Review & Approve** to finish." Heading: "Approve this post?" Body: "It goes to compliance review first… Nothing publishes automatically." Buttons: **Review & Approve** (big), "Rewrite in my voice instead". On phone the button sticks to the bottom. |
| approve | `done` | "✓ Approved. … approved by Jane Advisor at 8:14 AM PT. It's queued for **compliance review**. We'll email you when it's cleared, then it's scheduled. **Nothing is published until it's cleared and scheduled.**" With compliance off: "Pick when it goes on your website." Below that, the **Other picks this week**. |
| skip | `confirm` → `done` → `undone` | "Skip this post? It won't come back in your picks. You can undo this." Then "Skipped" with **Undo**. Then "↩ Undone. The post is back in this week's picks." |
| download | `confirm` → `working` → `done` | "Download copy and images. A .zip with the post text (.txt and .html), the images, and your disclaimer… Downloading doesn't approve or publish anything." Then "✓ Your download started (2.4 MB)" and a reminder to follow the usual compliance steps. |
| unsub | `confirm` → `done` → `undone` | "Stop post suggestion emails? For jane@example.com only. Others on the list keep getting them." Then "You're unsubscribed", with Undo. |
| view | — | "Jane Advisor approves these posts. Your access is view only." The only button is Download. |
| any | `already` | "Already done. This post was already approved by **Sam Assistant** on behalf of Jane Advisor, Nov 2, 2026, 9:05 AM PT. Nothing changed. Each link works once." |
| any | `expired` | "This link has expired. Links in the suggestions email work for 7 days, and each one works once. Nothing was changed." Button: **Sign in to see your picks**. |
| any | `error` | "Something went wrong. We couldn't finish that. **Nothing was changed.**" Buttons: Try again, Sign in. |

Every action page says: "Nothing publishes automatically. Opening this page did nothing. Only the button does."

### 3. Rewrite page ([rewrite.html](rewrite.html))

- `start` (from the email): "One more step: click **Rewrite in my voice** to start. Nothing changes until you approve." Below it, a preview of the post.
- After that, the **#687 A side-by-side view, reused as is**: `loading`, `ready`, `blocked`, `claim`, `regenerating`, `error`, `approved`, plus `expired`.
  - Locked values are highlighted, and **Review & Approve** is disabled while blocked.
  - The disclaimer is shown verbatim and marked identical.
  - **Review & Approve** (the button, and the confirm in its dialog) hands off to compliance or schedule. In #687 these buttons read "Approve rewrite" and "Approve and send for review". The 688 copy renames them.
- AI generation starts only from the button, so a scanner opening the link doesn't spend an AI call.

### 4. Digest settings ([settings.html](settings.html) `?freq=weekly|biweekly|monthly|off&st=normal|adding|removed|test`)

- Settings › **Suggestions email**.
- **How often:** Weekly (the default), Every 2 weeks, Monthly or Off.
- **Day, time (PT) and posts per email** (3, 4 or 5).
- The next send date, for example "Monday, Nov 2, 2026, 8:00 AM PT". "Links in each email work for 7 days."
- **Off:** "Suggestion emails are off. Your picks still show in Content › Suggested."
- **Who gets it:**
  - Jane Advisor (You): approve, rewrite, skip.
  - Sam Assistant: **View only** or **Can approve**, with Remove.
  - "+ Add person" adds a name, email and permission.
  - "Removed: their old links stop working now" with Undo.
  - Help text: view-only people get Preview and Download, not Review & Approve, Rewrite or Skip. Approvals by an assistant show their name "on behalf of Jane Advisor". Each person gets their own links.
- **Preview email** and **Send a test to me** ("It's marked TEST, and its buttons don't change anything").
- **What's picked:** a link to topics.
- A warning: "**Nothing publishes automatically.** Approving from the email only queues a post for compliance review (or scheduling, if compliance is off)."

All sample posts are **example data**.

## In and out of scope

- **In:**
  - A new digest job (replacing the old inactive-advisor email).
  - The email template, in HTML and plain text.
  - Per-action tokens, the light confirm pages and their POST handlers.
  - Approve hand-off, Skip with undo, the Download zip and the Rewrite entry point (#687).
  - Settings: frequency, day/time, count, recipients and permissions, preview and test.
  - The CASL footer and unsubscribe, including RFC 8058.
  - Scanner logging, audit and phone layout.
- **Out:**
  - Auto-publish (never).
  - Building #687 itself. This only links into it, so #688's rewrite button is hidden until #687 ships.
  - Changing the picks algorithm.
  - Social or email-campaign suggestions.
  - Any legal or compliance wording (the footer is a placeholder).
  - Per-advisor custom sending domains, unless that option is picked (open question).

## Mobile and email clients

- **Phone:** cards stack, the thumbnail goes full width, and the buttons form a 2×2 grid at least 44px tall. Action pages show the main button in a sticky bottom bar when opened from the email. The rewrite page uses the #687 Original/Rewrite switch.
- **Outlook (Windows):**
  - Use table layout with inline styles, and bulletproof buttons (VML or padded `<a>`). No flexbox, no CSS gradients, no web fonts.
  - Images need set `width` and `height`. Max width is 600px.
  - **Safe Links rewrites URLs and prefetches them.** That's the main reason for the confirm page.
- **Gmail:** clips messages over about 102KB, so keep it small (3–5 posts, no inline CSS blocks repeated). `<style>` in the head is supported, but inline is safest. Gmail proxies images, so the open pixel isn't reliable.
- **Dark mode** (`?dk=on`): avoid pure-black text on transparent backgrounds. Use a logo with a transparent background and a light outline. Buttons keep enough contrast. Add `color-scheme` meta tags and test Outlook.com and Apple Mail inversions.
- **Images off** (`?img=off`): every thumbnail has meaningful alt text, and the layout still reads without images. The logo falls back to the firm name as text.
- A **plain-text part** carries the same links (each still opens a confirm page).

## Build note

1. **Token per action:**
   - Each recipient gets their own token for each post and action (`approve`, `skip`, `rewrite`, `download`, `view`). The digest also gets one token per recipient for "see all picks" (B board, or the A "other picks" list).
   - Use 32 or more random bytes, stored **hashed** in `action_tokens` (`kind`, `digestId`, `postId`, `advisorId`, `recipientId`, `recipientEmail`, `permission`, `expiresAt`, `usedAt`, `revokedAt`). Reuse the #657 collection if it ships first.
2. **Single use and expiry:**
   - The default expiry is **7 days** (open question).
   - Approve and skip tokens are single use. Download and view tokens can be reused until they expire.
   - Re-sending a digest revokes that recipient's earlier tokens.
   - Removing a recipient revokes their tokens straight away.
   - An expired or revoked token shows the `expired` page. A used token shows `already`.
3. **Confirm POST:**
   - A **GET only renders** the page. It never approves, skips, unsubscribes or starts AI work.
   - The page button sends a **POST** with the token in the body, a CSRF value tied to the rendered page, and an `Origin`/`Referer` check. Don't auto-submit.
   - `?from=email` only changes the layout (the banner and sticky bar).
   - The on-page "other picks" buttons POST with the digest token plus CSRF.
   - Rewrite generation starts from a POST, then the #687 flow runs.
4. **Scanner logging:**
   - Log every GET (`tokenId`, IP, user agent, time, `HEAD` or `GET`, `prefetch` header).
   - Flag scanner-like hits: a GET within a few seconds of send, known scanner user agents, or many links opened at once.
   - Scanner hits are never treated as clicks or actions.
   - Tests: GET, HEAD and prefetch change nothing.
5. **Idempotency:**
   - Use a conditional update keyed on `digestId + postId` (`status: 'suggested' → 'approved'|'skipped'`).
   - A repeat POST, or a second recipient acting after the first, returns `already` with who did it and when (PT).
   - Approve runs the hand-off **once**.
   - Skip writes `user_hidden_posts` (reason `digest-skip`). Undo removes it.
   - Approving a post that was skipped earlier clears the skip.
6. **Assistant permissions:**
   - Each recipient is `view` or `approve` (the advisor is always `approve`). The permission is checked **on the server when the POST arrives**, not just baked into the email.
   - Assistant actions are recorded as `actedBy: recipientId, onBehalfOf: advisorId`.
   - View-only emails have no Review & Approve, Rewrite or Skip links, and their tokens can't approve.
7. **Approve hand-off:**
   - Approve calls the **existing** path: compliance email/PDF in `email` mode, the external queue in `external` mode, or `insertScheduledWebsitePost` at the next free slot or "pick a time" when compliance is `off`.
   - **No code path publishes from the digest.** Add a test for that.
   - Audit fields: `approvedVia: 'digest-email'`, `approvedAt`, `approvedBy`, IP, user agent, `tokenId`.
8. **Schedule job:**
   - Replace the old inactive-advisor cron with an hourly job that finds advisors due by **frequency + day + time in their timezone** (default Monday 8:00 AM PT).
   - Keep the scheduler lock and claim-before-send (`lastDigestSentAt`, `nextDigestAt`).
   - Picks come from `post-suggestions.js`. Exclude posts already on the website, skipped or hidden posts, and posts in earlier digests that weren't acted on (open question). If there are no picks, send nothing.
   - Store a `post_digests` record (`advisorId`, `postIds`, `recipients`, `sentAt`, `messageIds`).
   - Send test: a `TEST` banner, and tokens with `kind: 'test'` that never act.
9. **Zip generation:**
   - Built on demand after the POST, then cached per post and version for 24 hours. It's streamed from object storage with a short-lived signed URL on the **white-label domain**.
   - Contents: `post.txt`, `post.html` (no FC links), the original images (resized to 2048px max), `disclaimer.txt` (the stored disclaimer string, verbatim) and `README.txt` ("Follow your usual compliance steps").
   - "Download all" zips the digest.
10. **White-label link domain:**
    - Every link in the email and on the post links uses a neutral domain (placeholder **`links.example.com`**), or the advisor's own domain (`your-firm.example.com`). **Nothing links to FC's own domain**, and `Meteor.absoluteUrl()` must not be used for these links.
    - Per the issue, form endpoints and images may still be served from FC.
    - Which domain to use, and whether DNS/TLS is per advisor or shared, is an open question.
11. **CASL and unsubscribe:**
    - The footer has the sender (the firm name), a mailing address, contact details and a working unsubscribe plus manage-preferences link. **Wording is a placeholder pending compliance review.** Whether CASL applies to this advisor-facing email at all is an open question, but treat it as if it does.
    - Each recipient's unsubscribe only affects them.
    - Send `List-Unsubscribe: <https://links.example.com/u/TOKEN>, <mailto:…>` and **`List-Unsubscribe-Post: List-Unsubscribe=One-Click`** (RFC 8058). The one-click POST unsubscribes **without** CSRF or a confirm step and returns 200. A GET shows the confirm page, and the button POSTs.
    - Process unsubscribes within 10 business days (CASL); we do it immediately.
    - Log the `source` as `one-click` or `confirm-page`.
12. **Sending:**
    - Use SES (the same as advisor campaigns), not Elastic Email, unless decided otherwise.
    - The From display name is the firm name, and Reply-To is the advisor or support (open question).
    - Handle bounces and complaints through the existing SNS handling. A hard bounce pauses that recipient.

## Estimate (days)

| Piece | A | B | C |
|---|---|---|---|
| Email template (HTML and text, Outlook, Gmail, dark mode, images off) | 1.5–2 | 1–1.5 | 1.5–2 |
| Schedule job (frequency, timezone, lock, picks, `post_digests`) | 1–1.5 | 1–1.5 | 1–1.5 |
| Action tokens (hashed, per action, expiry, revoke) | 1–1.5 | 1–1.5 | 1–1.5 |
| Confirm pages and POST handlers (approve, skip, undo, download, view, already, expired, error) | 1.5–2 | 1–1.5 | 1.5–2 |
| "Other picks" list (A, C) or full board (B) | 0.25–0.5 | 1.5–2 | 0.25–0.5 |
| Top-pick ranking reason and hero | — | — | 0.5 |
| Approve hand-off to compliance or schedule, audit, idempotency | 1–1.5 | 1–1.5 | 1–1.5 |
| Rewrite entry point into #687 (not #687 itself) | 0.5–1 | 0.5–1 | 0.5–1 |
| Zip generation and signed download | 1–1.5 | 1–1.5 | 1–1.5 |
| Settings UI (frequency, recipients and permissions, preview, test) | 1.5–2 | 1.5–2 | 1.5–2 |
| White-label link domain routing | 0.5–1 | 0.5–1 | 0.5–1 |
| CASL footer, unsubscribe, RFC 8058, preferences | 0.5–1 | 0.5–1 | 0.5–1 |
| Scanner logging | 0.25–0.5 | 0.25–0.5 | 0.25–0.5 |
| QA (Gmail, Outlook, Apple Mail, phone, dark mode, staging, no publishing) | 1–1.5 | 1–1.5 | 1–1.5 |
| **Total** | **≈11.5–17.5** | **≈11.75–17.5** | **≈12–18** |

If the #657 tokens and confirm POST handlers ship first, subtract about 1–1.5 days. #687 is estimated separately (A ≈10.5–14).

## Open questions

1. **Link domain:** should we use one neutral shared domain (like `links.example.com`), or each advisor's own subdomain (DNS and TLS per advisor)? And which sending domain (From and DKIM)?
2. How long should links last: is **7 days** right? Should approve and skip be single use (as mocked)?
3. Should the digest replace the old "inactive 14 days" email completely? Should it be on by default for everyone, or opt-in?
4. Should picks that weren't acted on carry over to the next digest, or drop off?
5. Can assistants with "Can approve" approve on their own, or should the advisor also confirm? Who else (FTT staff) can act?
6. **CASL:** does it apply to this advisor-facing operational email? Who signs off the footer wording? Should the sender shown be the firm or FC?
7. Should the Download zip include the disclaimer and a compliance reminder? Should downloading be logged as an action?
8. In compliance email mode, should one digest approval send one PDF per post or batch them?
9. Should the default send time be Monday 8:00 AM in the advisor's timezone? And should the default be 3 posts per email?
10. While #687 isn't built, should we hide "Rewrite in my voice" or show "Edit in FC" instead?
11. Where should scanner-like hits be reported: only the log, or a Slack line?
12. A, B or C?

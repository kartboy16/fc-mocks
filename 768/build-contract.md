# #768 Notification links open blank for signed-out advisors: build contract

Mocks: [hub](index.html) · [Today](today.html) · [A. Read-only preview](a-preview.html) · [B. Sign in, then the post](b-signin.html) (**recommended**) · [C. PDF attached](c-pdf.html)

> **Not agent-ready. Soft Dev hold until a direction is picked.** **Likely `risk:high`** (notification email content, plus A's new token path): Alex merges to main. Track: staging → FC Tester → Alex.

## Today (main `5d6074e`, read only)

| Email | Where | Link it builds |
|---|---|---|
| **"New post"** (staff-written notify-advisor email; templates via `EmailTemplates.*`, body shortcodes `[firstname] [fullname] [postUrl]`) | `server/advisor-notify-email.js` → `sendAdvisorNotifyEmailIfNeeded(queueItem, postUrl)`, called from `website-scheduler.js` (≈l.269), `website-deferred-outbound-scheduler.js` and `api/wordpress-rest-api.js` | `[postUrl]` = the passed `websiteUrl` → `queueItem.wpPostUrl` → `${absoluteUrl}post/:postId?advisor=:advisorId` |
| **"Your Scheduled Post Has Been Published"** | `server/website-scheduler.js` (≈l.337–350), hard-coded HTML, "View Website Post" | `websiteUrl` = `${absoluteUrl}post/:postId?advisor=:advisorId`, or the WordPress `publicUrl`, which can be a **WordPress draft** (`wpStatus: 'draft'`) |

(`server/social-publish-notifications.js` sends a social-only version with the same subject. It links to the social posts, not the post page, so it's out of scope.)

**Why it's blank:**

- `/post/:postId` → `PostView.jsx` → `Meteor.callAsync('getPostForView')` (`server/user-methods.js` ≈l.1321). For posts that aren't public (`!post.isPublic`, limited to `availableToAdvisorSourceIds`), the method throws `not-authorized` when `this.userId` is null. The page then shows only a small red "You must be logged in to view this post [not-authorized]" on an otherwise empty page.
- **Race:** `PostView` fetches on mount without waiting for `Meteor.loggingIn()`. So a signed-in advisor opening the link in a new tab can hit the same error before the login token resumes.
- WordPress draft links (`?p=…&preview=true`) only work when signed in to WordPress, so a signed-out advisor sees "Page not found" or a blank page.
- `getPostLoginPath` / `isSafePostLoginPath` (`imports/utils/postLoginRedirect.js`) only allow a `returnUrl` under `/content-library` or the approval confirm page, so `/post/…` can't be a sign-in return today.

**Don't change `[postUrl]` globally.** The same shortcode fills **client-facing** SES campaigns (`ses-post-url-shortcode.js`, `website-article-live-email.js`). Only these two advisor emails change.

## Directions

All directions keep public posts as they are: if the post is public and live (`isPublic`, or a live WordPress URL), the link stays the public URL. The change only applies when that link wouldn't open for a signed-out advisor.

| | A. Read-only preview link | B. Sign in, then the post (**recommended**) | C. PDF attached |
|---|---|---|---|
| Email | **Preview this post** button + "Opens a read-only preview. No sign-in needed. The link works until {date}." | **Sign in to preview this post** button + "You'll sign in to FinancialContent first, then the post opens." | B's link and note + **PDF attachment** (`{post-slug}.pdf`) + "A PDF of the post is attached." If the PDF fails: "We couldn't attach a PDF this time…" and the email still sends |
| Link | `/preview/:token` (opaque random token; only its hash stored) | `/login?returnUrl=/post/:id?advisor=:id` (already signed in → straight to the post) | Same as B |
| Landing | Branded post + yellow bar "Preview · read-only · only people with this link can see it. Link works until …" + **Sign in to edit** | Sign-in page with "Sign in to preview {title}. We'll take you straight to it." → the post with "Signed in. Here's your post." | The PDF opens in the mail app |
| States | valid · expired (Sign in / **Email me a new link** button) · turned off (post changed or removed) · post now live (link to the live site) · signed in (normal post + Edit) | after sign-in · already signed in (no banner) · other account ("This post isn't on this account… Switch account") | attached · PDF couldn't be made |

## Scanner and link safety (all directions)

- Every email link **only opens a page**. Nothing is approved, sent, published or scheduled on GET (standing rule, mail scanners click links).
- **A:** the token is **view-only**, for **one post and one advisor**, and **multi-use until expiry**, so a scanner opening it doesn't use it up. It's stored hashed with `{ kind: 'post_preview', postId, advisorId, expiresAt, revokedAt }`. The preview route returns only what `getPostForView` returns, with `noindex`, `Referrer-Policy: no-referrer`, and no editor or app data. "Email me a new link" is a **POST button** that only re-sends to the advisor's address on file. "Sign in to edit" goes through normal sign-in.
- **B/C:** add `/post/` (same-app relative paths only) to the `isSafePostLoginPath` allowlist so the return works and can't be used as an open redirect.
- **All directions:** `PostView` waits for `Meteor.loggingIn()` before calling `getPostForView`. When it gets `not-authorized` and the user is signed out, it redirects to `/login?returnUrl=…` instead of showing the bare error. This also fixes the blank page for anyone who opens an old link.

## Data and storage

- **A:** a `post_preview_tokens` collection (or `action_tokens` with `kind: 'post_preview'` if #753's `action_tokens` is on main by then): `tokenHash` (unique), `postId`, `advisorId`, `queueId`, `createdAt`, `expiresAt` (14 days), `revokedAt`, `lastOpenedAt`, `openCount`. The token is revoked when the post is deleted, unscheduled or replaced. When the post goes live, the preview shows the "This post is live now" bar with the public link.
- **B:** no new data. A `buildAdvisorPostLink({ postId, advisorId, isPubliclyViewable })` helper is used by both senders.
- **C:** reuse `campaignHtmlToPdfBuffer` (`ses-campaign-pdf.js`, puppeteer) and the post HTML builder from `website-compliance-pdf.js` (`buildWebsitePostBodyHtml`, branded). Attach only if the PDF is under 5 MB. The notify email already supports attachments (infographic PNGs and PDFs), and `applyInfographicPdfPrintNote` copy must not clash.

## Copy

- **Button:** A "Preview this post" · B/C "Sign in to preview this post".
- **Note:**
  - A: "Opens a read-only preview. No sign-in needed. The link works until {Mmm D}."
  - B: "You'll sign in to FinancialContent first, then the post opens."
  - C: "A PDF of the post is attached. You'll sign in to FinancialContent to open it online."
- **"New post" email:** the button and note are added by the server **under** the staff-written body, and `[postUrl]` in that body resolves to the same link. No template edits are needed.
- **Published email:** "View Website Post" is replaced by the button and note when the post isn't publicly viewable.

## In scope

- Link building in the two senders.
- The PostView login wait and sign-in redirect.
- The `/post/` return allowlist.
- Email copy.
- Direction-specific work: A's token, preview route and states; C's PDF attachment.
- Tests (scanner GET does nothing, token scope and expiry, return-path safety, public posts unchanged).
- FC Tester on staging with test inboxes only.

## Out of scope

- Client-facing `[postUrl]` in SES campaigns.
- The social-only published email.
- WordPress-side preview auth (we link to our own page instead of the WP draft).
- Editing staff email templates.
- Making drafts public.

## Mobile (390)

- Emails are single column and the button is full width (at least 44 px).
- A's preview bar stacks, with "Sign in to edit" full width.
- The sign-in page is 380 px max.
- The PDF is A4 or Letter, readable in mobile mail apps.

## Estimates (agent time: cloud agent build + FC Tester + fix loops)

Calibration: #699 took ~30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| Shared: PostView waits for login + redirect when signed out, `/post/` return allowlist, link helper in both senders, email copy, tests | ≈0.75–1.25 h | ≈0.75–1.25 h | ≈0.75–1.25 h |
| Direction-specific | Token create/hash/revoke, `/preview/:token` route + 4 states, "Email me a new link" POST, scanner tests: ≈1–1.5 h | n/a | Post PDF via the existing puppeteer builder, attach + size and fail fallback, tests: ≈0.5–1 h |
| **Total** | **≈1.75–2.75 h** | **≈0.75–1.25 h** | **≈1.25–2.25 h** |

C alone wouldn't meet "the link never shows a blank page", so C's total includes B's link fix.

## Recommendation

**B.** The reporter said quickest is fine, and B is the quickest: about half A's time. It also:

- adds no new way to see unpublished posts, so there's nothing for a forwarded email or a scanner to leak;
- fixes the signed-in race for everyone;
- meets every acceptance criterion.

The cost is one sign-in for signed-out advisors. **A** is the better experience (one tap, works on any phone) and can follow on top of B's shared fixes for about +1–1.5 h if advisors push back. **C** adds a heavy attachment to every notice, still needs B, and isn't needed.

## Open questions

1. Is B's sign-in step OK for advisors, or do you want A's no-sign-in preview now?
2. For A: is a 14-day expiry right? And should anyone with a forwarded link (an assistant, compliance) be able to view it read-only?
3. Should the "new post" email always get the added button and note, even if a staff template already includes `[postUrl]`? (Proposed: yes, and `[postUrl]` resolves to the same link.)
4. For a WordPress **draft**, should the link go to our post page (proposed) rather than the WP preview?
5. Is the sender shown as "FinancialContent &lt;notifications@financialcontent.ca&gt;" right? The mock uses this as a placeholder; the real sender is `notificationService.fromEmail`.

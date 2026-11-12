# #854 Suggest one library post to one advisor by email

**Status:** Published on GitHub Pages. Not agent-ready. Soft Dev hold until a direction is picked. No build launched.

## Sources (read-only)
- Issue #854
- Related: weekly picks (#599 / #753, not on main), campaign approval emails (newsletter sends, not website publishing), #688 weekly digest (out of scope)

## Recommendation
**A. Library card → advisor drawer.** The usual trigger is a timely post the admin just found, so starting on the Content Library card keeps the post in context and opens a drawer to pick one advisor. Recipients, an email preview, and Send sit in the same drawer.

B is the inverse: start in Manage Advisor Posts, pick the advisor, then the post. Use it if the admin is already looking at one advisor. C is a standalone compose modal with a new admin entry point; it works when the admin is on neither surface, but it adds chrome without the context of A or B.

All three directions share the same advisor email and Approve / Schedule / Skip result pages.

## Who sees what
| Surface | Facing | What happens |
| --- | --- | --- |
| Send suggestion (A card action, B MAP action, or C modal) | Staff / admin | Pick one post and one advisor, optional assistant recipients, preview, Send. Hand-triggered only; no cron in this slice. |
| Suggestion email | Advisor (and optional assistant) | One card, Preview, Approve (publish now), Schedule, Skip, CASL footer. Sender identity may name the product. |
| Preview | Advisor | The post as it would appear. Banner: not on the Insights page yet. |
| Approve / Schedule / Skip result pages | Advisor | Token landing. Approve publishes to the website Insights page via the existing website queue / publish path (about 15 minutes after refresh). |
| Insights post, share, and email links | Client | `https://yourfirm.example/insights/federal-budget-rrsp-tfsa` only. No product-domain links or branding. Images may still be served from the product host. |

## Screens
| Screen | Facing | Notes |
| --- | --- | --- |
| A. Content Library grid + Send suggestion on the card | Staff | Drawer: advisor picker, recipients, email preview, Send |
| B. Manage Advisor Posts + Send suggestion on the row | Staff | Drawer: post picker, then recipients, preview, Send |
| C. Send suggestion page + compose modal | Staff | Modal: post + advisor + recipients + preview + Send |
| Advisor email | Advisor | Shared by A/B/C |
| Preview | Advisor | From the email Preview link |
| Approved | Advisor | Published, link to `https://yourfirm.example/insights/federal-budget-rrsp-tfsa` |
| Schedule picker | Advisor | Date and time (PT), then confirm |
| Scheduled | Advisor | Confirmation; not live yet |
| Skipped | Advisor | Optional reason |
| Expired / already used | Advisor | Nothing changed |
| Insights post | Client | yourfirm.example only |

## States
Admin compose: ready, loading, empty (no advisors or no posts), error/retry, sending, success (sent; nothing published).
Email: advisor recipient vs assistant (actions hidden for assistant in this mock — open question).
Results: approved, schedule picker, scheduled, skipped, skip + optional reason, expired, already used.
Insights: published post only (no draft state on the client site).

## Copy
- Admin: “Send suggestion” / “Nothing publishes until the advisor approves. Approving puts the post on their website's Insights page.” / “The advisor is always included. Add an assistant email if they should also receive this.” / “Suggestion sent… Nothing is published yet.”
- Email greeting: “Hi Jane, a post for you to review”
- Email notice: “Nothing publishes until you approve. Approving puts this post on your website's Insights page.”
- Buttons: “Approve (publish now)” / “Schedule” / “Skip” / “Preview”
- Approved: “Published” / “View on your Insights page” / “It can take about 15 minutes to appear after the site package refreshes.”
- Scheduled: “This post will publish to your website's Insights page on Nov 20, 2026, 9:00 AM PT.”
- Skipped: “You skipped this suggestion. It was not published and is not scheduled.”
- Expired: “This link has expired. Nothing was changed.”
- Already used: “This link was already used.”
- CASL footer: marked “PLACEHOLDER — not real compliance text.”
- Preview banner: “Preview only — this post is not on your Insights page yet.”

No estimates or explainer prose in the mock UI. Sample article copy is generic and is not tax advice.

Sample post: **What the latest federal budget could mean for your RRSP and TFSA**. Summary: A plain-language look at the latest federal budget, and what the proposed changes could mean for contribution room, withdrawals, and year-end planning. 4 min read.

## In / out of scope
**In:** hand-triggered admin Send suggestion (one post, one advisor), optional extra approval recipients, advisor email with one card and Approve / Schedule / Skip, secure expiring tokens, result pages, website publish via the existing Insights / package-refresh path, CASL footer placeholder, generic fixtures only.
**Out of scope:** Rewrite in my voice (#687), weekly digest frequency (#688), auto-picking, a 3-post weekly slate, cron, live email send, inventing legal CASL copy, social or email-campaign destinations (this slice is website Insights), client-facing product branding or product-domain links.

Reuse weekly-picks confirm, token, and send code where possible. Do not send a weekly slate. Staging first, high risk (email sending, publishing, white-label). QA inboxes only (designated test accounts). Only Alex merges to main. No build launched.

## Desktop vs mobile
1280: library grid, MAP table, 440px right drawer, centered compose modal, email at 600px, result pages ~640px.
390: stacked nav, full-width bottom sheet or modal, 44px actions, email card stacks the thumbnail, result buttons full width.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A (recommended) | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 10–16 | 11–17 | 12–18 |
| FC Tester (admin send, email + tokens, Approve publishes to Insights, Schedule, Skip, expiry / already-used, optional recipients, 1280/390, no product-domain links on the Insights page) | 4–7 | 4–7 | 4–8 |
| Fix loop | 3–5 | 3–5 | 3–5 |
| **Total** | **17–28 h** | **18–29 h** | **19–31 h** |

The email, tokens, and publish path are shared, so most of the work is the same in every direction. A is a little lower because it extends an existing library card. C is a little higher because it adds a new entry point and a recent-suggestions list. High risk. Playground / staging first, then FC Tester. No build launched.

## Open questions
1. How long do the Approve / Schedule / Skip tokens stay valid? This mock uses 7 days (expire Nov 19, 2026).
2. Schedule limits: how far ahead, can it be later today, and what happens if that day already has a website post?
3. What does Skip do besides dismiss this suggestion? Notify the admin? Block a resend of the same post? Affect weekly picks?
4. If the advisor and an assistant both receive the email, who can approve? First action wins? Assistant view-only (as mocked)?
5. Is Approve website Insights only, or can the advisor also pick other destinations (social / email) like weekly picks?
6. Should the email, or only the Approved page, mention the ~15 minute package refresh delay?
7. Where does the Preview link go — a product-hosted preview, or an unpublished preview on the advisor site?
8. Can the same post be suggested to the same advisor more than once, including after Skip or expiry?
9. Who may trigger Send suggestion (admins only, or also staff / assistants)?
10. If A is picked, should MAP (B) also get a Send suggestion action, or is one entry point enough?
11. Unsubscribe: from suggestion emails only, or from all product emails?
12. Already-used vs expired: keep them as distinct pages (as mocked)? What if the post was already published another way?

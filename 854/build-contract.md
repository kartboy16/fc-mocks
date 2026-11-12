# #854 Suggest one library post to one advisor by email

**Status:** Published on GitHub Pages. Not agent-ready. Soft Dev hold until a direction is picked. No build launched.

## Sources (read-only)
- Issue #854
- Related: weekly picks (#599 / #753, not on main), campaign approval emails (newsletter sends, not website publishing), #688 weekly digest (out of scope)

## Recommendation
**A. Library card → advisor drawer.** The usual trigger is a timely post the admin just found, so starting on the Content Library card keeps the post in context and opens a drawer to pick one advisor. Recipients, an email preview, and Send sit in the same drawer.

B is the inverse: start in Manage Advisor Posts, pick the advisor, then the post. Use it if the admin is already looking at one advisor. C is a standalone compose modal with a new admin entry point; it works when the admin is on neither surface, but it adds chrome without the context of A or B.

All three directions share the same advisor email and Approve / Schedule / Skip result pages.

## Local revision (unpublished)
Two additions after Alex's review, still local-only.

### Advisor source filter (admin only)
Sits immediately beside **Search advisors** in every direction that has an advisor picker (A drawer, B Manage Advisor Posts list, C compose modal). Dual multi-selects: **Include sources** / **Exclude sources**, plus **Clear all**. The control is marked **Admin only** (badge + tooltip). Advisors never see it.

Rules match MAP / #827: include = must have at least one selected source; exclude = hide if any selected source is present; include first, then exclude; a source cannot sit in both lists; empty include = no include constraint; empty exclude = nothing excluded by source. The search box and the filter work together. The count of matching advisors is shown. No matches shows an empty state and Clear all.

**Advisor Source values.** The live admin list is not a hard-coded enum. MAP and the `advisorSource` collection (`imports/collections/advisor_source.js`, labels in `imports/ui/admin/ManageAdvisorPosts.jsx`) load whatever names and slugs admins have saved. MAP defaults are include `content` and exclude `no-longer-a-client` (`DEFAULT_INCLUDE_SOURCE_SLUGS` / `DEFAULT_EXCLUDE_SOURCE_SLUGS` in ManageAdvisorPosts.jsx). Archive is always kept out (`mergeArchiveExclude`).

Product / system names used in admin, tests, and earlier mocks (#827, #824) — these are **not** client firm names, so they are the fixtures in this mock:

- Content (`content`)
- Email Content (shown as `email` in the #827 mock list)
- Compliance
- Social
- No longer a client (`no-longer-a-client`)

Related product tags also appear in code (`Social - Basic`, `Social - Main`, `DO NOT SEND CONTENT`) but were not in the #827 picker list. A test fixture also used a real client firm name as a source label; **do not use firm names in this mock**. The build should use the real `AdvisorSource` admin list (name + slug from the collection), not this fixture list.

This mock's default matches MAP: include Content, exclude No longer a client. Other states: none selected (cleared), include only (Email Content), exclude only (Social), and no matches (include Compliance + exclude Content).

### Social and Email channels (default on)
Each Send suggestion includes, by default:

- **Website (Insights)** — required, not removable. Link is `https://yourfirm.example/insights/federal-budget-rrsp-tfsa`.
- **Social** — on by default. Caption text plus network chips (Facebook, LinkedIn, Instagram in this mock). Edit opens an inline editor (Save / Cancel). Remove shows a removed state with **Add back**.
- **Email** — on by default. Subject plus intro text. Same Edit / Remove / Add back pattern.

The admin email preview, the advisor email, and the Approved / Scheduled pages list only the included channels. Removed items do not appear. Copy is extended: nothing publishes, posts, or sends until the advisor approves.


## Who sees what
| Surface | Facing | What happens |
| --- | --- | --- |
| Send suggestion (A card action, B MAP action, or C modal) | Staff / admin | Pick one post and one advisor, admin-only Advisor source filter, Social + Email on by default (editable / removable), website required, optional assistant recipients, preview, Send. Hand-triggered only; no cron in this slice. |
| Suggestion email | Advisor (and optional assistant) | One card, Preview, list of included channels (Insights, social, email), Approve / Schedule / Skip, CASL footer. Sender identity may name the product. The Advisor source filter is never shown here. |
| Preview | Advisor | The post as it would appear. Banner: not on the Insights page yet. |
| Approve / Schedule / Skip result pages | Advisor | Token landing. Approve publishes to Insights (existing website queue / package refresh, about 15 minutes) and, if still included, posts to social and sends the email. Confirmations list only included channels. |
| Insights post, share, and email links | Client | `https://yourfirm.example/insights/federal-budget-rrsp-tfsa` only. No product-domain links or branding. Images may still be served from the product host. |

## Screens
| Screen | Facing | Notes |
| --- | --- | --- |
| A. Content Library grid + Send suggestion on the card | Staff | Drawer: advisor picker + admin-only source filter, channels (website / social / email), recipients, email preview, Send |
| B. Manage Advisor Posts + Send suggestion on the row | Staff | List search + admin-only source filter; drawer: post picker, then channels, recipients, preview, Send |
| C. Send suggestion page + compose modal | Staff | Modal: post + advisor + admin-only source filter + channels + recipients + preview + Send |
| Advisor email | Advisor | Shared by A/B/C |
| Preview | Advisor | From the email Preview link |
| Approved | Advisor | Published to Insights (yourfirm.example link) plus any included social / email |
| Schedule picker | Advisor | Date and time (PT), then confirm |
| Scheduled | Advisor | Confirmation lists included channels; not live yet |
| Skipped | Advisor | Optional reason |
| Expired / already used | Advisor | Nothing changed |
| Insights post | Client | yourfirm.example only |

## States
Admin compose: ready, loading, empty (no advisors or no posts), error/retry, sending, success (sent; nothing published).
Advisor source filter: defaults (include Content, exclude No longer a client), none selected, include active, exclude active, no matches; works with search.
Channels: all included (default), social removed (Add back), email removed (Add back), editing social, editing email.
Email: advisor recipient vs assistant (actions hidden for assistant in this mock — open question). Channel list follows what was included.
Results: approved, schedule picker, scheduled, skipped, skip + optional reason, expired, already used. Approved / Scheduled reflect included channels.
Insights: published post only (no draft state on the client site).

## Copy
- Admin: “Send suggestion” / “Nothing publishes until the advisor approves. Approving puts the post on their website's Insights page.” / “The advisor is always included. Add an assistant email if they should also receive this.” / “Suggestion sent… Nothing is published yet.”
- Email greeting: “Hi Jane, a post for you to review”
- Email / admin notice: “Nothing publishes, posts, or sends until you approve. Approving puts this post on your website's Insights page, posts it to social, and sends the email.” (Social / email clauses drop if that channel was removed.)
- Filter: “Advisor source” / “Include sources” / “Exclude sources” / “Clear all” / “N advisors shown” / “No advisors match these filters.” Badge: “Admin only.” Tooltip: “Advisors never see this filter.”
- Channels: “What this suggestion includes” / “Website (Insights)” + “Required” / “Edit” / “Remove” / “Add back” / “Removed.”
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
**In:** hand-triggered admin Send suggestion (one post, one advisor), admin-only Advisor source include/exclude filter (MAP-identical rules and product source names), default-on Social and Email with edit/remove (website Insights required), optional extra approval recipients, advisor email with one card, included-channel list, and Approve / Schedule / Skip, secure expiring tokens, result pages that reflect included channels, website publish via the existing Insights / package-refresh path, CASL footer placeholder, generic fixtures only.
**Out of scope:** Rewrite in my voice (#687), weekly digest frequency (#688), auto-picking, a 3-post weekly slate, cron, live email send, inventing legal CASL copy, social or email-campaign destinations (this slice is website Insights), client-facing product branding or product-domain links.

Reuse weekly-picks confirm, token, and send code where possible. Do not send a weekly slate. Staging first, high risk (email sending, publishing, white-label). QA inboxes only (designated test accounts). Only Alex merges to main. No build launched.

## Desktop vs mobile
1280: library grid, MAP table, 440px right drawer, centered compose modal, email at 600px, result pages ~640px.
390: stacked nav, full-width bottom sheet or modal, 44px actions, email card stacks the thumbnail, result buttons full width.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A (recommended) | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 13–20 | 14–21 | 15–22 |
| FC Tester (admin send, source filter include/exclude/none/no-match, Social + Email default/edit/remove, email + tokens, Approve publishes to Insights and included channels, Schedule, Skip, expiry / already-used, optional recipients, 1280/390, no product-domain links on the Insights page) | 5–9 | 5–9 | 5–10 |
| Fix loop | 3–6 | 3–6 | 3–6 |
| **Total** | **21–35 h** | **22–36 h** | **23–38 h** |

Updated from 17–28 h (A) after the source-filter and default Social/Email work. The email, tokens, and publish path are still shared. A is a little lower because it extends an existing library card. C is a little higher because it adds a new entry point and a recent-suggestions list. High risk (email sending, publishing, social, white-label). Playground / staging first, then FC Tester. No build launched.

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
13. Advisor source filter: default to MAP defaults (include Content, exclude No longer a client) as mocked, or start cleared?
14. Should archived advisors stay hidden regardless of include/exclude (as in MAP)?
15. Which social networks are included (Facebook, LinkedIn, and Instagram as mocked), and are they the advisor's connected accounts only?
16. Does the Email channel send to the advisor's existing list, a new campaign, or some other audience?
17. Can the advisor also edit the social caption or email subject/intro from the email or result page, or is edit admin-only (as mocked)?
18. If Social or Email is removed in admin, can the advisor add it back when they approve?

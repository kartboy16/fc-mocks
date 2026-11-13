# #860 Dashboard: key numbers on first login

**Status:** Published on GitHub Pages at https://kartboy16.github.io/fc-mocks/860/. Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #860
- Published #851 advisor home: `https://kartboy16.github.io/fc-mocks/851/` and `/workspace/fc-mocks-pub/851/`
- Live Email Campaigns reports (read-only): `imports/ui/EmailCampaigns/SESReports.jsx` (`Open Rate`, `Click Rate`, unique opens ÷ delivered or sent, subscriber counts, “No sent campaigns yet.”)
- Live first-login Dashboard today (`imports/ui/Dashboard.jsx`) is a heavy “What would you like to do today?” card grid — the view the issue says is too much on first login
- Related: #851 (advisor home). This mock extends that home; it does not replace it.

## Recommendation
**A. Extend the #851 advisor home with a numbers strip and a last-email module.** One direction only. The issue asks to lead with key numbers on first login *and* to reconcile with #851 rather than build a competing home. There is no real fork: a separate numbers dashboard would fight the published #851 home.

On first login the advisor still sees the #851 shell (Your Firm Name wordmark, Home / Library / Campaigns / Settings, time-of-day greeting, Ask FC, **Write a campaign**). The new work is:

1. A compact **numbers strip** directly under the greeting: Open rate, Subscribers, Click rate, Sent this month. Figures use the same definitions as Email Campaigns → Reports (open/click as unique opens or clicks ÷ delivered, or sent if delivered is missing; subscribers from all lists). Tiles open the Campaigns reports stub.
2. A **last-email module** under the strip (subject, sent date, list, delivered, open and click). “View reports” goes to the same stub.
3. The #851 Write a campaign / Ask FC / suggested campaign / draft-only path stays below, unchanged.

Empty, loading, and error apply to the numbers, not to the campaign CTA. If numbers fail, the rest of the home still works.

## Screens
| Screen | Notes |
| --- | --- |
| Home, ready | Greeting, four-number strip, last-email module, then Ask FC + Write a campaign |
| Home, no data | New account: em dashes for rates, 0 subscribers, 0 sent; module explains that numbers appear after the first send |
| Home, loading | Skeleton tiles and module; Write a campaign stays available |
| Home, error | “Couldn’t load your numbers” + Try again; Write a campaign stays available |
| Suggested campaign / draft / suggest loading, empty, error | Unchanged from #851 |
| Campaigns reports stub | Opened from a tile or View reports; sample last-email row only |

Menu matches #851: Home, Library, Campaigns, Settings. Library and Settings are stubs that return home. Sidebar collapses at 390px.

## States
ready (has sends and subscribers), empty (new account, no data), loading, error (retry). Campaign path (unchanged): suggest loading, suggest empty, suggest error, suggested, draft.

## Copy
- Greeting, Ask FC, Write a campaign, and suggestion/draft copy match #851.
- Strip labels: “Open rate” / “Subscribers” / “Click rate” / “Sent this month”
- Ready captions: “Last send · Nov 4” / “All lists” / “November 2026”
- Empty captions: “No sends yet” / “No lists yet”; values “—” for rates, “0” for counts
- Module, ready: “Last email” + the last subject + “Sent Nov 4, 2026 to Newsletter · 1,104 delivered” + “View reports”
- Module, empty: “Your email” / “No campaigns sent yet” / “When you send your first email, open rate, clicks, and subscriber counts will show up here. You can still write a campaign from the library.”
- Error: “Couldn’t load your numbers” / “Your home is still here. Nothing was changed.” / “Try again”
- Reports stub: “Open rate is unique opens ÷ delivered (or sent). Same figures as Email Campaigns → Reports.”
- Banner: “Proposal mockup — not on the live site. Example data only. Nothing is sent.”

No estimates or explainer prose in the mock UI. Sample numbers and titles are fixtures, not live data.

Sample last email (same subject as #851): **Your November money update: TFSA room, the RRSP deadline, and a retirement check-in**. Open rate 42.3%, click rate 8.1%, 1,284 subscribers, 3 sent this month, 1,104 delivered to Newsletter on Nov 4, 2026.

## In / out of scope
**In:** numbers strip and last-email module on the published #851 home, empty / loading / error for numbers, click-through to a reports stub, 1280/390, generic fixtures. Reuse of the #851 Write a campaign path.
**Out of scope:** a second home or a redesigned Dashboard card grid, inventing metrics the reports do not already have, live data wiring in this mock, send/schedule/approval, client-site branding or product-domain links, production deploy.

Playground first (issue track). `risk:high` only if a later build exposes campaign data incorrectly; the mocked path is advisor-facing and does not send. No build launched.

## Desktop vs mobile
1280: navy sidebar 232px, centered ~680px stack, four number tiles in a row.
390: sidebar behind Menu, two-by-two tiles, stacked module and full-width Write a campaign, 44px targets.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | Hours |
| --- | --- |
| Cloud agent build (strip + module on the #851 home, SES report definitions, empty / loading / error) | 5–8 |
| FC Tester (ready, new account, loading, error + retry, numbers match Reports definitions, tiles open reports, #851 campaign path still works, 1280/390, generic fixtures) | 2–4 |
| Fix loop | 1–2 |
| **Total** | **8–14 h** |

Playground first. This is an extension of #851, not a new surface. No build launched.

## Open questions
1. Which window do the strip figures use — last send only (as mocked for open/click), last 30 days, or a roll-up of all sends?
2. Is “Sent this month” calendar-month, last 30 days, or something else?
3. Email-only numbers (as mocked, from SES reports), or should website / social stats appear too?
4. Should the numbers strip stay visible on the suggested-campaign and draft views, or only on the first-login home (as mocked)?
5. If numbers fail to load, should the rest of the home stay usable (as mocked)?
6. Playground vs staging as the first deploy target (the issue says playground)?

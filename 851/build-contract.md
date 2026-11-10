# #851 Advisor home — Write a campaign

**Status:** Published on GitHub Pages. Not agent-ready. Soft Dev hold until a direction is picked. No build launched.

## Sources
- Issue #851
- Slack thread (read-only): home mockup and suggested-campaign mockup downloaded to `/workspace/851-ref/`
- Issue comments point at those two Slack images; no GitHub image attachments on the issue itself

## Recommendation
Ship **one direction (A)** that follows the Slack mockups in the request thread: centered home with greeting + Ask FC + one **Write a campaign** button; then a suggested 3-piece campaign card; **Looks good — open draft**, **Swap a piece**, **Start over**. Open draft is a draft-only state (no send, schedule, or approval). No second direction — the mockups are clear, and the product currently has no advisor home (per the issue), so there is no conflicting live home to branch from.

## Screens
| Screen | Notes |
| --- | --- |
| Home | Time-of-day greeting (`Good morning/afternoon/evening, Jane`), Ask FC text + mic, one primary button, helper line |
| Suggested campaign | Auto-picked article, infographic, calculator from the library (no topic/filter UI) |
| Draft | Opened from “Looks good — open draft”; status Draft — not sent; no send control |
| Empty / loading / error | Tiny mock state switcher only |

Menu: Home, Library, Campaigns, Settings only. Library/Campaigns/Settings are stubs that return home. Sidebar collapses at 390px.

## States
ready (home), loading (searching library), empty (no pieces), error (retry / start over), success (suggestion), draft.

## Copy (from her boards, fixtures adjusted)
- “Or tell us what this campaign is for…”
- “Write a campaign”
- “We’ll pick the best pieces from your library for you.”
- “SUGGESTED CAMPAIGN” / “Subject line”
- Subject: “Your November money update: TFSA room, the RRSP deadline, and a retirement check-in”
- “Looks good — open draft” / “Swap a piece” / “Start over”
- “Nothing is sent until you approve it.”
- Banner: “Proposal mockup — not on the live site. Example data only. Nothing is sent.”
- Draft note: “This draft is saved as a draft only. It has not been sent, scheduled, or sent for approval.”
- Footer/compliance on the draft is flagged: “[Placeholder — existing campaign footer / compliance copy, not invented legal text.]”

## Fixture substitutions vs her PNG boards
The source mockups used a product domain as the sidebar wordmark, the greeting “Good afternoon, Example”, and “Example Advisor” plus a “712 posts” sample line. This clickable draft uses **Jane Advisor**, **Your Firm Name**, and `yourfirm.ca` / `example.com` only, and omits the product domain from chrome, per the job’s generic-name and branding rules. Layout, colour tokens, type, menu, controls and campaign titles otherwise follow the boards.

**Swap:** her board has one bottom **Swap a piece** button. This mock keeps that and adds a per-piece **Swap** that cycles alternatives from the library, as specified in the job.

## In / out of scope
**In:** advisor home tokens and layout, Ask FC (typed + simulated mic), auto-suggested 3-piece campaign, swap, start over, draft-only open, empty/loading/error. **Out:** actual send/schedule/approval, topic pickers, live library search, voice recognition, changing Library/Campaigns/Settings, client-site branding, production deploy.

## Desktop vs mobile
1280: navy sidebar 232px, centered 640px stack. 390: sidebar hidden behind Menu, stacked pieces and full-width actions, 44px targets.

## Agent-time estimate (hours)
Cloud agent build **6–10 h** + FC Tester **2–4 h** (home, suggest, swap, start over, draft has no send, 1280/390, generic fixtures) + fix loop **1–2 h** ≈ **9–16 h**. Playground first unless Alex confirms staging. `risk:high` if it later ties into campaign send; the mocked path itself does not send. No build launched.

## Open questions
1. Playground vs staging as the first deploy target (issue vs her “staging only” note)?
2. Should the sidebar wordmark stay a product mark once branding rules for advisor chrome are confirmed, or remain a firm/generic mark as in this fixture draft?
3. Does “Swap a piece” stay a single button (her board) or per-piece only?
4. What happens after Open draft in the real composer — stay in this home shell, or jump into today’s campaign editor (still with send off)?
5. How is the 3-piece set chosen from a real library (ranking, freshness, already-used pieces)?

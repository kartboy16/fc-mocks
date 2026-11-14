# #889 Playground: rename AI tab to Assistant + four assistants

**Status:** Not agent-ready. Soft Dev hold until a direction is picked. Playground first.

## Sources (read-only)
- Issue #889
- Live Playground AI tab in `imports/ui/ContentLibrary.jsx` (left-rail item labelled **AI**, route `/content-library/ai`, AutoAwesome icon, active styles `#e3f0fd` / `#bbdefb` / 3px `#1976d2` border)
- Live chat `imports/ui/AiLandingChat.jsx`: empty-state title “What will you share today?”, placeholder “Ask anything…”, chips “Create a post” / “Pick a post”, saved-chats drawer, New chat / Save, user bubble `#1976d2`, assistant bubble grey
- Related: #495 (turn a chat answer into website / social / email drafts), #270 (financial playground prompt packs), #494 (render bold in Playground AI output)
- Public marketing landing also has an “AI” nav link and `#ai` section (`LandingPageContentOnly.jsx`). Out of scope here.

## Recommendation
**A. Picker cards, then a simple chat per assistant. 16–27 h.** Rename the rail label from AI to Assistant (same slot, same icon, same active styles). Opening the tab shows four cards — Marketing Assistant, Insurance Assistant, Investment Assistant, Client Manager — each with a one-line description and three or four starter prompts. Choosing a card or a prompt opens the existing chat pattern for that assistant, with a Change assistant control back to the picker. History is per assistant. This is the first slice: it makes the four roles visible, reuses `AiLandingChat`, and does not invent a new interaction model.

**B (14–24 h)** is the same four assistants on one chat, with a switcher dropdown in the toolbar. Faster once you already know the names, but the descriptions and prompts are easy to miss, and a mid-chat switch needs a confirm (new chat for the other assistant; the current thread stays in history).

**C (24–38 h)** is the agent-style follow-up: a workspace that remembers context, proposes actions such as “Draft LinkedIn post” with Approve / Edit, and suggests next steps (schedule, matching email, news-page version). Insurance and investment actions stay draft-only and wait for Your Dealer Compliance. Do not build C first — it stacks a new action model on top of the rename and the four personas. Ship A, then take C as a later slice (it can also pick up the #495 distribute flow).

## Screens
| Screen | Direction | Notes |
| --- | --- | --- |
| Today | — | Current AI tab, empty chat, rail still says AI |
| Picker | A | Four cards, descriptions, starter prompts, disclaimers on Insurance and Investment |
| Empty chat | A, B | Assistant name (A: Change assistant; B: switcher), hero title, prompts, composer |
| Filled chat | A, B | Sample reply, Create a post / refine chips, New chat / Save |
| Insurance empty | A | Disclaimer visible before any prompt is sent |
| Switch confirm | B | Mid-chat switch starts a new chat; current thread is kept |
| Workspace | C | Chat + remembered context + Draft LinkedIn post action (Approve / Edit) + next steps |
| Approved | C | Draft saved to Social, not posted or scheduled; next steps remain |
| Insurance action | C | Draft news-page post, compliance disclaimer, no publish/send from chat |
| Loading | A, B, C | Skeletons; other tabs still available |
| Error | A, B, C | “Couldn't load…” + Try again; other tabs still available |
| Saved chats | A | Drawer lists threads tagged with the assistant name |

Menu matches today's Playground rail, with **Assistant** in the AI slot: Assistant, Content, Website, Social Media, Email Campaigns, Calendar, Settings & Branding, Profile. Sidebar collapses at 390px behind Menu. Wordmark is the generic YFN block used in other mocks, not a product-domain logo.

## States
empty (picker or empty chat), ready (filled chat / workspace), loading, error (retry), history, B mid-chat switch confirm, C approved draft, C insurance action (draft + compliance hold).

## Copy
- Rail label: **Assistant** (today: **AI**)
- Picker title: “Who should help today?”
- Chat empty title: “What will you share today?” (same as today's AI chat)
- Composer placeholder: “Ask anything…” (C: “Ask anything, or say what to do next…”)
- Change assistant / Assistant switcher / New chat / Save / Saved chats — same tone as today's chat
- Error: “Couldn't load your assistants. Your other tabs are still here.” / “Try again”
- Insurance disclaimer (placeholder): “This is a drafting aid, not insurance advice. Review with Your Dealer Compliance before you send or publish.”
- Investment disclaimer (placeholder): “This is a drafting aid, not investment advice or a recommendation. Review with Your Dealer Compliance before you send or publish.”
- C action: “Draft LinkedIn post” / “Ready as a draft for Jane Advisor. Nothing is posted until you approve.” / Approve / Edit
- C after approve: “Saved to Social Media as a draft… It is not scheduled and has not been posted.”
- C next steps: “Schedule for Tuesday 9:00 AM” / “Draft a matching email” / “Add a news-page version”
- Banner: “Proposal mockup — not on the live site. Example data only. Nothing is sent.”

One-line descriptions and starter prompts are in the A picker. Sample posts use Jane Advisor and Your Firm Name only. Client Manager examples use Alex Client.

No estimates or explainer prose in the mock UI.

## In / out of scope
**In:** rail rename, four assistants with descriptions and prompts, picker (A) or switcher (B) or agent workspace (C), per-assistant chat and history, placeholder compliance disclaimers, empty / loading / error, 1280/390, generic fixtures. Reuse of today's `AiLandingChat` composer, bubbles, chips, saved chats, and “Create a post”.

**Out of scope:** public marketing landing “AI” label and `#ai` section; live model wiring in this mock; posting, emailing, or scheduling for real from the chat; changing the #495 distribute confirm flow in the first slice; inventing live client records; product-domain links or branding on the mock chrome.

Playground first. Insurance and investment assistants are **high risk** if a later build can publish or send from the chat without a compliance step. The mocked path is advisor-facing and draft-only for those two. No build launched.

## Desktop vs mobile
1280: 90px left rail, centered chat to 800px (C workspace adds a 280px remembered-context column). Four picker cards in two columns.
390: rail behind Menu, cards stack, C memory column stacks under the chat, 44px targets, composer stays at the bottom.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 9–16 | 8–14 | 14–22 |
| FC Tester | 5–8 | 4–7 | 6–10 |
| Fix loop | 2–3 | 2–3 | 4–6 |
| **Total** | **16–27 h** | **14–24 h** | **24–38 h** |

A covers the tab rename, picker, four chats, per-assistant history, last-assistant persist, starter prompts, disclaimers, and a redirect from `/content-library/ai` if the path is renamed. B is the same backend with a switcher instead of a picker. C adds memory, action cards with an approve step, next steps, and draft integrations (and should stay draft-only for insurance/investment).

## Open questions
1. Rename the route from `/content-library/ai` to `/content-library/assistant`, with a redirect from the old path? (Recommended: yes.)
2. Should the public marketing landing “AI” link also be renamed, or is this in-app only? (Recommended: in-app only for this slice.)
3. History per assistant (as mocked) or one combined history with an assistant tag?
4. May Insurance or Investment assistants take send/schedule actions, or drafts only until Your Dealer Compliance reviews? (Recommended: drafts only.)
5. Keep the existing #495 / “Create a post” distribute flow on all four assistants, or only on Marketing Assistant?
6. Playground first vs staging as the first deploy target? (Recommended: Playground first.)

# #863 Email editor: half-space option between paragraphs

**Status:** Published on GitHub Pages at https://kartboy16.github.io/fc-mocks/863/. Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #863
- `imports/ui/EmailCampaigns/EmailContentEditor.jsx` and `imports/utils/editorBlockStyles.js` / `emailBodyFontDefaults.js` on `origin/main` (`10e691a`)

## Recommendation
**A — Spacing menu in the toolbar** (Tight, Half, Wide), beside the existing Style and Font controls. There is no spacing control in the product today; typography already lives on that bar, so a menu there is the most discoverable place for a new option.

**B — Paragraph settings** is a real placement fork: the same three options in a Paragraph panel opened from the toolbar, closer to “paragraph settings.” Use B only if the bar is considered too full.

## What exists today
The toolbar has Normal / Heading 1–3, Font (Aptos default), and Size (20). There is no Tight/Wide menu. The visual editor forces `p { margin-top: 0; margin-bottom: 0.5em }` “in preview only (sent email unchanged).” Sent HTML is passed through `normalizeHtmlForEmail`, which does not appear to inline that paragraph margin, so clients may apply their own default (often about 1em). That preview-vs-sent gap is a likely reason spacing feels cramped in one place and too wide in another. The mock does not invent which CSS will render identically in Outlook and Gmail — that stays an open question.

Proposed starting values (for the build, not shown as estimates on mock pages): Tight 0.25em, Half 0.75em, Wide 1.25em after each paragraph, plus line-height 1.6 (already used in the editor). Final values must be proven in clients. Existing campaigns keep their current spacing (acceptance criterion).

## Screens
| Screen | Facing | Notes |
| --- | --- | --- |
| A toolbar · Half (default pick) | Advisor / staff | Spacing menu on the bar, editor uses Half |
| Tight / Wide | Advisor / staff | Same control, other values |
| Before | Advisor / staff | Side-by-side Tight and Wide only, then After · Half |
| B Paragraph panel | Advisor / staff | Spacing in a Paragraph panel |
| Mobile 390 | Advisor / staff | Menu still on the wrapping toolbar |

Client-facing preview links use `yourfirm.example` only.

## States
before, tight, half, wide. Nothing is sent.

## Copy
- “Spacing” (A) / “Paragraph” + “Spacing” (B)
- “Tight” / “Half” / “Wide”
- “Before · Tight” / “Before · Wide” / “After · Half”

No estimates or explainer prose on the mock pages.

## In / out of scope
**In:** third spacing option, control placement (A or B), editor preview, existing campaigns unchanged. **Out:** inventing client-proof CSS, changing heading margins except as a follow-on, live send.

## Desktop vs mobile
1280: toolbar + side-by-side before/after. 390: wrapping toolbar, stacked previews, 40px selects.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B |
| --- | --- | --- |
| Cloud agent build | 8–12 | 8–13 |
| FC Tester (editor + sent preview, Tight/Half/Wide, existing campaigns unchanged, 1280/390; Gmail / Outlook / Apple Mail as far as the test plan allows) | 5–8 | 5–8 |
| Fix loop | 3–5 | 3–5 |
| **Total** | **16–25 h** | **16–26 h** |

High risk: touches sent email HTML. Staging first. No build launched.

## Open questions
1. Which margin and line-height values render the same in the editor, Gmail, Outlook, and Apple Mail (email-safe CSS)? This is the issue’s acceptance criterion and is not settled here.
2. Should the chosen spacing be inlined on each `<p>` so sent email matches the editor (today the 0.5em rule is preview-only)?
3. Do existing campaigns stay on “current” (no Tight/Half/Wide label) until a later edit, and what is the default for new campaigns?
4. Do headings and lists follow the same three options, or only body paragraphs?
5. A vs B placement if the toolbar is already crowded on smaller screens.

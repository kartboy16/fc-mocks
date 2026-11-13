# #862 Email editor: link box next to the selected text

**Status:** Published on GitHub Pages at https://kartboy16.github.io/fc-mocks/862/. Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #862
- `imports/ui/EmailCampaigns/EmailContentEditor.jsx` on `origin/main` (`10e691a`)

## Recommendation
**A — selection-anchored popover.** One direction. The bug is that the link form is not next to the selected text. Anchoring a compact popover to the selection (and flipping or using a bottom sheet when space runs out) matches the expected behaviour without a second product concept.

## Likely cause
This is not a third-party editor-library popover (there is no Froala, TinyMCE, Quill, or similar dependency). The editor is a custom `contentEditable` surface. Choosing Link sets `linkDialogOpen` and renders a grey `Box` with `mt: 2` **after** the editor canvas (`EmailContentEditor.jsx`, the “Link Dialog” block). The form therefore appears under the whole body, far from the highlight. Clicking an existing `<a>` opens the same under-editor panel. New links are written with `target="_blank"` and there is no Open-in-a-new-tab control today.

## Screens
| Screen | Facing | Notes |
| --- | --- | --- |
| Today | Advisor / staff (editor) | Current under-editor Link Text + URL + Insert link / Cancel |
| Popover (A) | Advisor / staff | Anchored to the selection: URL, Open in a new tab, Apply, Cancel |
| Right edge | Advisor / staff | Popover shifts left so it stays in view |
| Bottom edge | Advisor / staff | Popover flips above the selection |
| Edit existing | Advisor / staff | Same popover, prefilled URL, Remove available |
| Mobile (390) | Advisor / staff | Bottom sheet with the same fields |

Client-facing email body links use `yourfirm.example` only.

## States
today, open (new link), right edge, bottom edge, edit existing, mobile sheet. Apply / Remove / Cancel; nothing is sent.

## Copy
- “Link” / “Edit link”
- “URL”
- “Open in a new tab”
- “Apply” / “Remove” / “Cancel”
- Today: “Link Text”, “URL”, “Insert link”

No estimates or explainer prose on the mock pages.

## In / out of scope
**In:** anchored popover, edge flipping, edit/remove, mobile sheet, Open in a new tab (new relative to today). **Out:** button-link and image-link panels (they stay as today’s under-editor panels unless later asked), live send, changing the Link Check UI.

## Desktop vs mobile
1280: popover next to the highlight, 300px wide, flips at the right or bottom edge. 390: bottom sheet, 40px actions, same fields.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
Cloud agent build **6–10 h** + FC Tester **3–5 h** (add, edit, remove, scroll, right/bottom edges, 1280/390, selection not lost) + fix loop **2–3 h** ≈ **11–18 h**. Staging first. No build launched.

## Open questions
1. Should Open in a new tab stay checked by default (today always uses `target="_blank"`)?
2. Do the Insert button and image-link forms also move to an anchored popover, or stay as under-editor panels?
3. Keyboard: does Enter apply and Esc cancel, and is the URL field focused on open?
4. When the selected text itself is edited in the popover (today has a Link Text field; A omits it and uses the selection), should Link Text remain?

# #816 Email approval style: One-click or Scanner-safe, with a default (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** This is **`risk:high`** because it covers email actions on GET and the #811 sign-in. Track: staging, then FC Tester. Alex merges to main.

> Alex: "I have a few users who do NOT like this new flow and want the one click approve back via email. Can we mock some options? Maybe a dropdown for one click approval and one for email scanner safe? And save one as default?"

## Grounding (staging `2f7bdcb`)

- **Approval email:** `buildApprovalMessageHtml` (`server/mailchimp/html-messages.js`) has one **Review & Approve** button and the line "Opens a page where you click Approve to finish." It's sent from `server/mailchimp/approval-email.js`. The one-time link email is `imports/utils/approvalLinkEmail.js`.
- **Landing page:** `EmailCampaignApprovalLanding.jsx` + `mailchimpApprovalLandingView.js`.
- **Actions:** `approvalLink.confirm` (`server/approval-link.js`). The #811 sign-in uses `Accounts._insertLoginToken(ownerId, …)` at about line 248, and the client uses `imports/utils/approvalLinkSession.js` `loginWithToken`.
- **Action labels and intents:** `imports/utils/mailchimpApprovalSendOptions.js` (`APPROVAL_SEND_NOW_LABEL` = "Approve and Send in 1 hour", `APPROVAL_SEND_DELAY_MS` = 1 h, schedule, don't send).
- **Compliance:** `resolveComplianceMode` (`imports/utils/complianceMode.js`) limits the choice to Approve or Decline.
- **Settings:**
  - Per advisor: `advisor_preferences` (a strict allow-list in `imports/collections/advisor_preferences.js`, so a new field must be added there).
  - Per campaign: approval recipients in `SESCampaignsList.jsx` (`approvalEmailRecipients`, `sendApprovalEmail`).
  - Global: `imports/collections/app_settings.js`.

## The risk, plainly

Our standing rule is that **email links never act on GET**, because security scanners (Microsoft Defender Safe Links, Mimecast, Proofpoint), link previews and prefetchers open links. **One-click breaks that rule by design.** A scanner can approve or decline a campaign the advisor never saw. Mitigations (all directions):

1. **Scanner-safe stays the default** (admin default ships as Scanner-safe). One-click is opt-in per advisor.
2. **No immediate send from any one-click link.** "Approve and Send in 1 hour" already waits an hour, and there's no Send now link. Schedule and Don't send stay on the page ("More options").
3. **Undo window:** for 1 hour after a one-click action, the advisor can undo it from the result page or from the app. A campaign never sends inside that window, so a scanner click is always reversible before anything goes out.
4. **Decline is harmless:** it just returns the campaign to draft or rejected, and can be undone.
5. **No sign-in from GET.** One-click does **not** create a session; that stays on the #811 POST click only. The result page offers "Go to your campaigns", which uses normal sign-in or the session if one already exists.
6. **Single use + TTL:** one-click links are single-use tokens with the same rules as #790. The first hit wins and later hits show "already done".
7. **Logging:** every action from a one-click link is logged in `approvalLinkHistory` with `via:'one-click'`, the user agent and IP, and the time since the email was sent. Optionally flag "acted within 10 s of delivery" as a likely scanner hit.
8. **Compliance campaigns:** Approve or Decline only, in the email and on the page.

## Screens (switcher: view × style × compliance × page state)

| View | One-click | Scanner-safe |
|---|---|---|
| Admin › Settings › Email approval | "Default approval style": a dropdown showing the scanner warning | Same dropdown, showing the "Scanners can't approve anything" note |
| Advisor Settings › Approval | "How approval emails work": Firm default / Scanner-safe / One-click, with the warning when One-click is picked | Same |
| (A only) Campaign › Approval | "Approval style for this campaign": My setting / Scanner-safe / One-click | Same |
| Email | Approve · Approve and Send in 1 hour · Decline (direct), plus "More options". Compliance: Approve · Decline. | One **Review and approve** button |
| Landing | "Campaign approved" + "undo until 4:52 PM" + Undo approval / Go to your campaigns / Not you? Sign out. Undone state: "Approval undone… Nothing was sent." | The #811 A page (hint "You'll stay signed in on this device."), then done |

All views are white-labeled (Your Firm Name, yourfirm.ca; no FC links or branding). Phone: buttons are full width and at least 44 px.

## Directions

- **A. Admin default + advisor setting + per-campaign override.** Most flexible, but a third place to look and more to test.
- **B. Admin default + advisor setting (recommended).** Covers "save one as default" and the users who want one-click, with the fewest moving parts.
- **C. B + "Quick approve (safer one-click)".** The email button opens a page that auto-POSTs the action after about 1.5 s with JS. Non-JS scanners stop at the page; if JS doesn't run, a fallback button appears. JS-running sandboxes (some Defender/Proofpoint modes) can still trigger it, so it's safer but not safe, and needs the same undo and logging.

## Recommendation

**B.** The users asking want one-click for every campaign, not one campaign at a time, so a per-advisor setting with a firm default answers the ask. A per-campaign override (A) adds UI and test surface for little gain and can come later. C is clever, but its safety depends on scanner behaviour we can't control, and it still needs undo. Undo plus the 1 h send delay is what really makes one-click acceptable, and B has both. If Alex wants one-click to feel safer without explaining scanners, C can be added on top of B later.

## Server sketch (B)

- **Field:** `advisor_preferences.approvalStyle: 'one-click' | 'scanner-safe' | null` (null = firm default), plus `app_settings.defaultApprovalStyle` (default `'scanner-safe'`). The advisor's own setting is self-serve; the admin default is admin-only.
- **Email build:** a style is resolved per send. One-click puts per-action single-use token URLs (`/approve/a/<token>?do=approve|send1h|decline`) in the email. Compliance campaigns get approve and decline only.
- **GET handler (one-click only):** validate the token, run the action through the existing `approvalLink.confirm` code path as the owner, set `undoUntil = now + 1h`, and render the result page. No session.
- **Undo:** `approvalLink.undo` (POST, from the result page or the app) reverts within the window, cancels the scheduled send and logs the undo.

## Tests

Mocha:
- style resolution (campaign > advisor > admin for A; advisor > admin for B)
- one-click GET acts once (second GET shows "already done")
- compliance blocks send1h
- undo inside and outside the window
- no session on GET
- token expiry

FC Tester (staging, QA inboxes only):
- both styles end to end
- compliance email and page
- undo
- 1280 and 390

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

| Run | A | B | C |
|---|---|---|---|
| Settings fields + admin/advisor UI (+ campaign for A) | 50–70 min | 35–50 min | 40–55 min |
| Email variants + per-action tokens + GET handler + result page | 1.25–1.75 h | 1.25–1.75 h | 1.5–2 h (auto-POST page + fallback) |
| Undo + logging + Mocha | 45–60 min | 45–60 min | 45–60 min |
| FC Tester | 55–70 min | 45–60 min | 55–70 min |
| Fix loop + security review | 30–45 min | 25–40 min | 30–45 min |
| **Total** | **≈4.25–5.75 h** | **≈3.75–5 h** | **≈4.25–5.75 h** |

## Open questions

1. Ship the admin default as Scanner-safe (proposed), with one-click opt-in per advisor? Or should the admin be able to flip the whole firm?
2. Should "Approve and Send in 1 hour" be in one-click emails at all, or only Approve and Decline (with Send in 1 hour on the page)?
3. Undo window: 1 hour (matches the send delay), or until the scheduled send time?
4. Who may change the style: the advisor themselves (proposed), or admins only like `socialApproval`?
5. Should a one-click action ever sign in (proposed no), or is that OK since #811 accepted magic-link risk?
6. Flag and auto-undo actions taken within seconds of delivery (likely scanners), or just log them?
7. Compliance campaigns: allow one-click Approve at all, or force Scanner-safe for compliance?

# #811 One-time approval link: the action click also signs you in (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** This is **`risk:high`** because it touches auth (it issues login sessions). Track: staging, then FC Tester. Alex merges to main.

**Decision (Alex):** in one-time-link mode, the same Approve (or other action) click also signs the advisor in. There's no extra button, checkbox or password step.

## Grounding (staging `f4e6e6a`, after #790 / PR #794)

- **Token:** stored in `ApprovalLinkTokens` (`server/approval-link.js`). It's single-use with a 1 h TTL (`imports/utils/approvalLink.js`), revoked by a newer link, and tied to one campaign and owner.
- **Landing page:** `approvalLink.inspect` loads it and never consumes the token. The page keeps the token in sessionStorage (`EmailCampaignApprovalLanding.jsx`).
- **Action:** `approvalLink.confirm` runs the action as the owner (`actor.via: 'one-time-link'`), then calls `consumeApprovalLinkToken`.
- **Expired and used copy:** `APPROVAL_LINK_EXPIRED_*` and `APPROVAL_LINK_USED_*` in `approvalLink.js`, with the variants in `mailchimpApprovalLandingView.js`.
- **Login token pattern:** `Accounts._generateStampedLoginToken()` + `Accounts._insertLoginToken(userId, stamped)` (`server/admin-methods.js:1063-1064`; the issue cites :943-944, which is out of date).

## UI (copy and state only, on the approval-spacing A layout)

| State | A (recommended) | B | C |
|---|---|---|---|
| Normal / one-time link | Grey hint under the primary pair: "You'll stay signed in on this device." | Hint at the bottom of the summary block: "Choosing an option also signs you in on this device." | No hint |
| Compliance (Approve / Decline only) | Same hint | Same hint | No hint |
| Done | ✓ "Campaign approved", "You're signed in as Jane Advisor.", **Go to your campaigns** button, "Open this campaign" link | "You're signed in. Taking you to your campaigns…", progress bar, then auto-redirect after about 3 s, with "Go now" and "Stay on this page" | Green banner "You're signed in as Jane Advisor · Not you? Sign out" above "Campaign approved" + **Open your campaigns** |
| Expired / used | Existing #790 copy, plus "You are not signed in" on expired; **Email me a new link** and "Sign in instead". No session. | Same | Same |

- The `Signed in for this campaign only` chip from #790 goes away in one-time-link mode, because it becomes untrue.
- The done copy follows the action taken: "Campaign approved", "Approved, sending in 1 hour", "Scheduled", "Declined" or "Won't be sent".
- At 390 the buttons go full width at 44 px or more.
- No FC branding or links on the page (it's client-ish).

## Security points (must-haves)

1. **POST only.** Sign-in happens only inside the action method that the user's click calls (DDP method `approvalLink.confirm`, or a new `Accounts.registerLoginHandler('approvalLink')` called right after it). Nothing happens on GET, page load, `inspect`, preview, scanners or prerender.
2. **Owner only.** Re-check on the server that `doc.ownerId` owns the campaign. Issue the session for `doc.ownerId` only, never for an id the client passes. Refuse a session for admin or compliance-officer owners; the action still runs.
3. **Single use.** Consume the token atomically (`consumeApprovalLinkToken` with a conditional update) in the same call as the action and before returning the login token. A used, expired or revoked token gets no action and no session. Two parallel clicks give at most one action and one session.
4. **Session length:** the Meteor default `loginExpirationInDays` (90) unless Alex picks shorter (see the open questions). Tag the stamped token `{via:'approval-link'}` so it can be revoked or audited.
5. **Different user already signed in on the device:** proposed behaviour is to **keep the existing session** if it's the owner. If it's another user, run the action as the token owner (as today) and **don't** switch sessions. The done page then says "Approved for Jane Advisor. You're signed in as someone else." with a sign-out link. Needs Alex's call.
6. **Audit:** add an `approvalLinkHistory` entry "signed in via approval link" (owner, campaign, IP and user agent if available).
7. **Client:** after the response, call `Meteor.loginWithToken(token)` and clear the sessionStorage token. Never put the login token in a URL.

## Tests

Mocha:
- valid exchange
- reused token
- expired token
- revoked token
- wrong owner
- admin owner refused (the action still runs)
- inspect and preview never sign in
- double click

FC Tester on staging:
- open the link (not signed in)
- Approve → done → reload shows signed in
- compliance Approve/Decline
- expired and used links (no session)
- desktop 1280 and phone 390

## Out of scope

Password or 2FA changes, a "remember me" checkbox, changing the token TTL, social approval links.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

| Run | A | B | C |
|---|---|---|---|
| Server: login on action, owner and role checks, atomic consume, audit, Mocha tests | 1.5–2 h | 1.5–2 h | 1.5–2 h |
| Client: loginWithToken, copy and done states | 20–30 min | 30–45 min (auto-redirect + stay) | 25–35 min (banner + sign out) |
| FC Tester on staging (cases above) | 40–55 min | 45–60 min | 40–55 min |
| Fix loop + auth security review | 25–40 min | 25–40 min | 25–40 min |
| **Total** | **≈3–4 h** | **≈3.25–4.5 h** | **≈3–4.25 h** |

## Recommendation

**A.** It's one quiet line that tells the truth before the click, adds no extra step, and finishes with an obvious way into the app. B's auto-redirect can yank people away before they read the result. C surprises people with a sign-in they weren't told about.

## Open questions

1. Session length: the Meteor default of 90 days, or shorter (e.g. 30 days) for link-made sessions?
2. Add a "Not you? Sign out" link on the done page (A could add it as a text link)?
3. A different user is already signed in on the device: keep their session (proposed), or switch to the owner?
4. Do Schedule, Approve and Send in 1 hour, Decline and Don't send also sign in (the issue says yes; proposed yes), or only Approve?
5. Admin or compliance-officer owners: confirm the action works with no session.
6. On the expired or used page, should "Email me a new link" stay as is (no sign-in until the new link's action click)?

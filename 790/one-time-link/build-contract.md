# #790 One-time approve link: build contract

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** **`risk:high`** (auth + email sending + approvals). Staging first, FC Tester gate, Alex merges to main.

This follows #791 (staging), which sends signed-out advisors to `/login?returnUrl=…`. Many approvers have never signed in, see the **Sign in / Sign up for beta** tabs, and sign up with a different email instead of using Forgot password.

## Grounding (staging `54eb8c3`)

- **Landing:** `/advisor/:advisorId/email_campaign/approval_landing?campaignId=…&provider=mailchimp|ses` → `EmailCampaignApprovalLanding.jsx`. The signed-out copy (`APPROVAL_LANDING_SIGN_IN_MESSAGE`) is "Sign in as the campaign owner, then you can approve. First time here? Use Forgot password on the sign-in screen." `shouldRedirectApprovalLandingToLogin` now redirects to `buildApprovalLandingLoginHref` (`safeReturnPath`).
- **Owner check:** `contentApprovals.ownerOf(provider, campaignId)` plus `approvalLandingOwnerMismatch` (only the owner may approve; admin and acting-as are mismatches).
- **Approve:** `emailCampaigns.decideAdvisorApproval` / `mailchimp.updateApprovedByAdvisor` via `ContentApprovalDeclineFlow` (Approve / Decline). Intent variants: Confirm send, `Approve and Send in 1 hour`, Schedule, Don't send.
- **Approval email:** `buildApprovalMessageHtml` (`server/mailchimp/html-messages.js`): blue `#256aa6` header "An email campaign is ready for your approval", green `#1f7a4d` "Review & Approve" button, and the line "Opens a page where you click Approve to finish. Nothing is approved until then." No FC logo. Sent by `sendMailchimpApprovalEmailInternal` (`approval-email.js`) through `notificationService` (Elastic Email) from `notificationService.fromEmail`, subject `[Newsletter Approval] …`.
- **Important:** approval emails go to `resolveApprovalRecipients()` (campaign override → `sendTestEmailsTo` → admin email). That is **not** necessarily the account email. The one-time link must go to `Meteor.users.findOne(doc.ownedBy).emails[0].address` (the owner's verified login email) and never to a recipient list or a typed address.

## Directions

| | A. Link first (recommended) | B. Sign-in form first | C. 6-digit code |
|---|---|---|---|
| Signed-out landing | Campaign summary + primary **Email me a one-time approve link**; "Have a password? Sign in instead" | Inline sign-in form (Forgot password), then "or" + outlined **Email me a one-time approve link** | Summary + **Email me a code**; enter the code on the same page |
| Sent state | "Check your inbox. We sent a link to j***@example.com…" + Resend after cooldown | same as A | Code field (`one-time-code`, numeric), "4 tries left" on a wrong code |
| Fits the problem? | Best: the path that works is the first thing seen | Keeps the password path the reporter's users already fail at | Works across devices (email on phone, page on desktop) but adds typing; phone autofill helps |

**Shared states:**
1. **start** (signed out)
2. **sent**, with Resend cooling down or ready
3. **review**: opened from the link, no login. Shows the chip "Signed in for this campaign only", the same campaign summary, then **Approve** and Decline buttons (POST).
4. **done**: "Campaign approved. Thank you!"
5. **expired** or **already used**: **Send a new link/code**, which resends to the account email.

Signed-in owners skip all of this (the #791 behaviour). A signed-in non-owner gets the existing mismatch message.

## Copy

- **Start (A):** "You're not signed in. We can email a one-time link to the email on this account, so you can approve without a password."
- **Sent:** "We sent a link to **j***@example.com**. Open it on any device to review and approve. It works once and expires in about 1 hour." Under it: "Resend (0:42)", then "Not there? Check spam or promotions."
- **Email:** subject "Your one-time approve link". Same blue/green style as the approval email. Header "Your one-time approve link", then "Hi Jane, you asked to approve this campaign without signing in." Campaign + List table. Button "Open the review page", then "Opens the page where you click Approve. Nothing is approved until then. This link works once and expires in about 1 hour." Footer: "Didn't ask for this? You can ignore this email. Nobody can approve without this link."
- **Review:** chip "Signed in for this campaign only", then "Nothing is approved until you click Approve."
- **Expired:** "This link has expired. For your security, links expire after about 1 hour." **Used:** "This link was already used. Each link works once…"

## Token rules

- **Request:** `approvalLink.request({advisorId, campaignId, provider})` (Meteor method, POST over DDP). It takes **no email argument**. The server loads the campaign, checks that it's awaiting advisor approval and that `ownedBy === advisorId`, and resolves the owner's account email itself.
- **No enumeration:** the response is always `{ok:true, masked}` for a valid pending campaign. A missing, approved or wrong campaign gets the same generic "If this campaign is waiting for approval, we sent a link to the email on the account" (no masked address), with identical timing. The mask shows the first letter + `***@domain` only.
- **Token:** 32 random bytes (base64url). Store **only the SHA-256 hash** in a new `approvalLinkTokens` collection: `{hash, campaignId, provider, ownerId, sentToMasked, createdAt, expiresAt: +60 min, usedAt, requestIp}` with a TTL index on `expiresAt`. A new request revokes earlier unused tokens for the same campaign.
- **Bound** to campaign + provider + owner. It's valid only for that campaign's approve/decline and nothing else (no account session, no other pages).
- **Single use:** consumed when an Approve or Decline POST succeeds, **not on GET**. Email scanners open links, so consuming on open would make "already used" the normal case. Opening the link only validates it and renders the page, any number of times within the hour.
- **GET never acts:** `/advisor/:id/email_campaign/approval_landing?campaignId=…&provider=…&olt=<token>` only opens the page. The client keeps the token in memory/sessionStorage and strips it from the URL (`history.replace`). `approve` / `decideAdvisorApproval` gain an optional `approvalToken` param, which the server verifies (hash match, not expired, not used, campaign + owner match) before acting **as the owner**, then sets `usedAt`.
- **Rate limits:** `DDPRateLimiter` on `approvalLink.request`: 1 per 60 s and 5 per hour per campaign, plus 20 per hour per IP. The UI cooldown is 60 s. For C: 5 wrong codes → the code is revoked ("Send a new code").
- **Audit:** append `{at, type:'one-time-link-sent'|'one-time-link-used', masked}` to the campaign's approval history.

## Security notes

- No typed address, ever: the link can only reach the account owner's inbox.
- The token is not a login. It can't change settings, see other campaigns, or extend its lifetime.
- `Referrer-Policy: no-referrer` on the landing page. Never log the full token (the hash only).
- The emailed link and the token in the URL are removed before any third-party script loads. The landing page has none today; keep it that way.
- The review page shows the same data as the signed-in review, and nothing more.
- Mailchimp and SES providers both use the same rules.

## Out of scope

Changing the existing approval email or its recipients, passwordless login for the whole app, compliance-officer approvals, intent links (Send in 1 hour / Schedule / Don't send) via token (follow-up: same token check), merging accounts created by a wrong sign-up.

## Desktop / mobile

The landing keeps today's 560 px container. At 390, buttons go full width and the Resend row stacks. Links are at least 44 px. The email is 600 px max and fluid on phones, and the button is 44 px or taller. For C, the code field uses `inputmode=numeric` + `autocomplete=one-time-code` so phones can autofill it.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

Scale: #699 took about 30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| Token collection + TTL, `approvalLink.request` (owner email, mask, no enumeration, rate limits), token check in approve/decline + tests | 45–70 min | 45–70 min | 55–80 min (code + attempts) |
| One-time email (reuse approval email styles + `notificationService`) | 15–20 min | 15–20 min | 15–20 min |
| Landing states (start, sent + cooldown, review chip, done, expired/used), strip token from URL | 30–45 min | 40–55 min (inline sign-in form) | 40–55 min (code entry) |
| FC Tester on staging, test accounts only: request → email → open (GET doesn't approve) → Approve; expiry (clock-mocked), reuse, rate limit, wrong owner, no-enumeration responses, 1280/390 | 35–50 min | 40–55 min | 40–55 min |
| Fix loop + security review pass | 15–30 min | 15–30 min | 20–35 min |
| **Total** | **≈2.25–3.5 h** | **≈2.5–3.75 h** | **≈2.75–4 h** |

## Recommendation

**A.** The failure is that approvers don't have or remember a password and end up signing up instead. A puts the path that needs no password first, and it's one button with nothing to type. B leads with the same password form that's failing today. C adds a typing step and attempt limits, and it's more to build; it's only worth it if approvers often read email on a different device from where they'd approve, and A's link already works on any device.

## Open questions

1. **Consume on Approve/Decline (proposed), not on open:** OK with "works once" meaning *one decision*, valid for many opens within the hour?
2. Should the token also allow the intent actions (Approve and Send in 1 hour / Schedule / Don't send), or plain Approve only in v1?
3. Sender: same `notificationService.fromEmail` as approval emails (proposed)?
4. If the owner account has no verified email, or the email bounces: hide the link button and show "Sign in" only?
5. 60 min expiry and 5 sends per hour per campaign: are these the right numbers?

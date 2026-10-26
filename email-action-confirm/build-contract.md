# Email action links: confirm pages, build contract

Issue: [#657](https://github.com/kartboy16/content-library/issues/657). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Problem (from the code, read-only at `6eabeaa`)

| Link | Route today | What a GET does |
|---|---|---|
| SES campaign Approve | `GET /api/ses/campaign-approval/:campaignId?advisorId=` (`server/api/ses-campaign-approval.js`) | Sets `approved: true`, `approvedAt`, clears `reminderMilestonesSent`, posts "Approved!!" to `#email_campaign_approved`. Any method, no token, no expiry, re-runs on every hit, no IP or UA saved. |
| Social Approve / Reject | `GET /api/social/post-approval/:queueItemId?advisorId=&action=approve\|reject` (`server/api/social-post-approval.js` → `decideSocialPostApproval`, actor `email-link`) | Approves or rejects right away. Has an `already` result, but still no token or confirm. |
| Unsubscribe | `GET or POST /api/ses/unsubscribe/:token?t=` (`server/api/ses-unsubscribe.js`) | Sets contact `status: 'unsubscribed'` and logs an `Unsubscribe` event on GET. The token is the contact's long-lived `unsubscribeToken`. `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers are already sent (`server/ses-campaign-service.js:144-145`). |

Data the pages can show: the campaign subject, list or tag name and recipient count (same distinct-email query as today), advisor name, scheduled send time, and an email preview. For social: the queue item's text, image, networks and scheduled time. For unsubscribe: the contact email (masked) and the advisor's firm name and branding.

## Recommendation: A, a full confirm page

[SES approval](ses-approval.html), [social post](social-approval.html), [unsubscribe](unsubscribe.html), [Slack lines](slack-log.html). Each page shows what you're approving, and only a button click changes anything. [B (lighter)](b-light.html) has the same safety with only a title, an Approve button and "Open in FinancialContent". It saves about 1 day but drops decline notes and the preview.

## Screens and states (`?st=`, plus `?phone`)

- **Campaign approval** (FC branding, advisor-facing):
  - `confirm`: campaign, subject, from, To (list or tag, recipient count), send time, a preview and "View the full email" (read-only). Buttons: **Approve campaign** and **Don't approve**. Don't approve opens an optional note.
  - `approved`: "Approved by jane@example.com at 11:42 AM PT" (the time the click happened, PT).
  - `already`: who approved and when. Nothing changed.
  - `declined`: won't send, team told, note attached, "Approve it instead".
  - `expired`: **Request a new link** (emails a fresh one to the same approver), then `sent`, plus Sign in.
  - `error`: nothing changed, Try again.
  - If the campaign isn't scheduled, the primary button reads "Approve and send in 1 hour" (#649 flow).
- **Social post**: the same states. Both email links (Approve, Reject) open this one page, and a Reject link pre-opens the reject note (`?pick=reject`).
- **Unsubscribe** (client-facing, **white-label**: advisor branding only, no FC name, logo or link):
  - `confirm`: "Unsubscribe j***@example.com from Your Firm Name emails?" with **Unsubscribe** and Keep me subscribed.
  - Then `done` (with Undo), `already`, `resub`, `kept` and `error`.
  - The footer address is a placeholder.
- **Slack** `#email_campaign_approved`: approver email, method (button click, POST), IP, UA, token id. There's also a yellow "Link opened, no action (looks like a scanner)" line, which is optional.

## Build note

1. **GET and HEAD only render.** Neither writes to the DB or posts to Slack. OPTIONS and prefetch requests (`Purpose: prefetch`, `Sec-Purpose`) get no side effects either. Send `Cache-Control: no-store` and `Referrer-Policy: no-referrer`, and set `X-Robots-Tag: noindex`.
2. **The action is a POST** from the button: a form post to the same path with the token in the body and a CSRF token tied to the rendered page (a double-submit cookie, or an HMAC of token and nonce). Check `Origin`/`Referer` matches the host. No auto-submit JS.
3. **Tokens**: 32+ random bytes in the link, stored **hashed** in a new `action_tokens` collection (`kind`, `targetId`, `advisorId`, `recipientEmail`, `expiresAt`, `usedAt`, `revokedAt`).
   - Each token is **one per recipient**, so we know which email approved.
   - It's single use, and a **resend issues a new token and revokes the old one**.
   - Default expiry: **7 days** for approvals (open question). Unsubscribe tokens are per contact and **don't expire** (needs a compliance check).
4. **Idempotent**: a second POST, or a different recipient's token after approval, shows `already`, doesn't change `approvedAt` and posts no second Slack line. Use a conditional update (`approved: {$ne: true}`).
5. **Record** on SES campaigns and social queue items: `approvedVia: 'email-button'`, `approvedAt`, `approvedBy` (email), `approvedIp` (first `X-Forwarded-For` hop behind the proxy), `approvedUserAgent` and `tokenId`. Do the same for declines (`declinedNote`). Add the UA and method to the Slack line.
6. **Scanner GETs** don't count. Optionally log them as `link_open` events (IP, UA, time) and roll them into one quiet Slack line per campaign, not one per hit. Also store SES click `ipAddress`/`userAgent`/`timestamp` from the SNS webhook (#657 AC 8).
7. **Unsubscribe**: a GET shows the confirm page. Two POSTs unsubscribe:
   - The page button.
   - **RFC 8058 one-click**: a POST to the `List-Unsubscribe` URL with body `List-Unsubscribe=One-Click` unsubscribes **without** a CSRF token or confirm, because mail apps (Gmail, Yahoo) send it, and it returns 200.
   - Keep the headers we already send, and make sure the handler takes this body (form-encoded) and doesn't render HTML for it.
   - Log `source: 'one-click'` vs `'confirm-page'`. Undo (resubscribe) is a POST from the done page.
8. **In-app buttons** (campaign landing page, #649 "Approve and Send in 1 hour") call the Meteor method or POST, never the GET URL.
9. **White-label**: the unsubscribe page uses advisor branding. Its URL host is still FC's (`Meteor.absoluteUrl()`), so see the open questions.

## In and out of scope

- **In:** the three confirm pages, tokens, the POST handlers, the audit fields, Slack line changes, one-click unsubscribe, approval email link changes, and tests (GET/HEAD/prefetch leave things unchanged, single use, expiry, resend).
- **Out:** a branded unsubscribe domain per advisor, Mailchimp approval (Mailchimp's own links), and a preference center.

## Estimate (A)

| Piece | Days |
|---|---|
| Token collection, sign and verify, hashing, expiry, resend and revoke | 1–1.5 |
| SES approval page: GET render, POST approve and decline, idempotent, audit | 1–1.5 |
| Social approve/reject page and POST, reusing `decideSocialPostApproval` | 0.75–1 |
| Unsubscribe confirm, undo, RFC 8058 one-click POST | 0.75–1 |
| Slack line, scanner-open log, SNS click IP and UA | 0.5–0.75 |
| Email link updates, in-app buttons, tests (unit + `curl -I`/prefetch on staging) | 1–1.5 |

That's about **5 to 7.25 days**. B is about 4 to 6 days.

## Open questions

1. How long should approval links last: 7 days (suggested), 72 hours, or until the send time?
2. If one recipient approves, are the other recipients' links done (`already`)? (Suggested: yes.)
3. Should "Don't approve" go to FTT staff only, or also to other approvers? Where does the note show?
4. Slack: should scanner-like opens get one quiet line per campaign, go to a separate channel, or only the DB log?
5. Should expired approval links offer "Request a new link" (emails the same approver) or only Sign in?
6. Unsubscribe tokens: no expiry, per contact? Is this OK with compliance (CASL / CAN-SPAM wording is not asserted here)?
7. The unsubscribe URL host is FC's domain, which clients can see in the address bar. Is that OK for now, or should we add an advisor-domain or neutral host later?
8. Should unsubscribe cover all of the advisor's emails or one list? (The mock says "Your Firm Name emails", which is all.)
9. Should the social Reject link land on the same page with Reject pre-opened (mocked), or on a reject-only page?

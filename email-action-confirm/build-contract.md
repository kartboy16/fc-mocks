# Email action links: confirm pages, build contract

Issue: [#657](https://github.com/kartboy16/content-library/issues/657). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

**Direction: B, picked by Alex (Oct 26, 12:11 PM PT).** It's a light confirm page with the preview underneath. It's pending Alex's review of the preview and the approval email. A (the full confirm page) is kept for reference only.

## Problem (from the code, read-only at `6eabeaa`)

| Link | Route today | What a GET does |
|---|---|---|
| SES campaign Approve | `GET /api/ses/campaign-approval/:campaignId?advisorId=` (`server/api/ses-campaign-approval.js`) | Sets `approved: true` and `approvedAt`, clears `reminderMilestonesSent`, and posts "Approved!!" to `#email_campaign_approved`. It accepts any method, has no token or expiry, runs again on every hit, and saves no IP or user agent. |
| Social Approve / Reject | `GET /api/social/post-approval/:queueItemId?advisorId=&action=approve\|reject` (`decideSocialPostApproval`, actor `email-link`) | Approves or rejects right away. It returns an `already` result, but there's still no token or confirm step. |
| Unsubscribe | `GET or POST /api/ses/unsubscribe/:token?t=` (`server/api/ses-unsubscribe.js`) | Sets the contact to `unsubscribed` on a plain GET. It uses the contact's long-lived `unsubscribeToken`. The `List-Unsubscribe` and `List-Unsubscribe-Post` headers are already sent (`server/ses-campaign-service.js:144-145`). |

## B: screens

- **[Campaign approval](b-ses.html)** (FC branding, advisor-facing):
  - At the top: the title "Approve "<subject>"?", one summary line (list, recipient count, send time), **Approve campaign** (primary) and **Don't approve** (opens an optional note).
  - **"To" line (Alex, 12:15 PM PT):** shows the list name when there is one ("List: Newsletter subscribers"). Otherwise it shows the tag ("Tag: Retirement planning"; "Tags:" for several) or the audience ("Audience: All contacts"). If there's none of these, the line is left out. Recipients is its own line. It's the same on the confirm page summary, the preview summary and the approval email. Mock toggle: `&to=list|tag|all|none`.
  - Then "Nothing happens until you click a button. Approving as jane@example.com", with a "See the preview ↓" link.
  - **Below the buttons:** "Preview of what you're approving". It shows a summary (subject, from, to and recipient count, send time) and the **full email** as recipients will see it (header, body, footer).
- **[Social post](b-social.html):** the same layout, with Approve post and Reject post. The preview shows the networks, scheduled time, account, and the post text and image.
- **States** (`?st=`):
  - `confirm`: the preview is open.
  - `approved` ("Approved by jane@example.com at <time> PT"), `already` and `declined`/rejected: the preview collapses to "Show the preview ↓", with a Hide link.
  - `expired` (Request a new link and Sign in), `sent` and `error`: no preview.
  - `?from=email` adds the step banner and the sticky phone bar. `#preview` scrolls to the preview.
- **[Approval email](approval-email.html)** (`?type=ses|social`, `&to=`, `&btn=rec|keep|two`), shown in a mail-client frame. It has an FC header "for Your Firm Name", a summary (campaign, subject, To, recipients and send time, or networks, time and post excerpt), the expiry line "This link expires in 7 days and works once" (7 days is an open question), and a footer. The buttons are covered under "Email button copy" below.
- **Landing from the email** (`b-ses.html?from=email`, `b-social.html?from=email`):
  - A slim highlighted step banner at the top: "One more step: click **Approve campaign** to finish." (social: "**Approve post**").
  - The Approve button is the biggest thing right under the summary.
  - On phone, an **Approve / Don't approve bar sticks to the bottom** while you scroll the preview.
  - The success wording doesn't change.

### Email button copy (Alex, 12:20 PM PT: one click in the email becomes two)

| Variant | Email button(s) | Line under it | Lands on |
|---|---|---|---|
| **Recommended** (`btn=rec`) | **Review & approve** (social: **Review & approve post**). One button, no separate Review. | "Opens a page where you click Approve to finish. Nothing is approved until then." | `b-<type>.html?from=email` |
| Alternative: keep the label (`btn=keep`) | **Approve** (the familiar label) | "You'll confirm on the next page." | same |
| Alternative: two actions (`btn=two`) | **Review & approve**, plus a "Don't approve" text link | same as Recommended | Don't approve: `?from=email&decline=1`, with the decline note open |

We recommend the first because the label tells people there's a second step, so the extra click doesn't feel like a broken link. "Keep" changes the fewest habits, but the button says one thing and does another. "Two" answers open question 11.

- **[Unsubscribe](unsubscribe.html)** (client-facing, white-label) and **[Slack lines](slack-log.html)** are unchanged from the first round.
- **Reference:** [A full campaign](ses-approval.html), [A full social](social-approval.html). `b-light.html` now redirects to `b-ses.html`.

## Build note

1. **GET and HEAD only render the page.** So do OPTIONS and prefetch requests (`Purpose`/`Sec-Purpose: prefetch`). Nothing writes to the DB or Slack. Send `Cache-Control: no-store`, `Referrer-Policy: no-referrer` and `X-Robots-Tag: noindex`.
2. **The action is a POST** from the button: a form post with the token in the body and a CSRF value tied to the rendered page, plus an `Origin`/`Referer` host check. Don't auto-submit. `?from=email` only changes the layout (banner, sticky bar).
3. **Tokens** are 32 or more random bytes, stored hashed in `action_tokens` (`kind`, `targetId`, `advisorId`, `recipientEmail`, `expiresAt`, `usedAt`, `revokedAt`).
   - Each approver gets their own token. Every link in the email shares it.
   - A token works once. A resend revokes the old one.
   - The suggested default is **7 days**. Unsubscribe tokens are per contact and don't expire (needs a compliance check).
4. **Idempotent:** a repeat POST, or another approver's token after approval, shows `already`. Use a conditional update so `approvedAt` and the Slack post happen once.
5. **Record** `approvedVia: 'email-button'`, `approvedAt`, `approvedBy`, `approvedIp` (first `X-Forwarded-For` hop), `approvedUserAgent` and `tokenId`. Do the same for declines (`declinedNote`). Add the UA and method to the Slack line.
6. **Preview:**
   - Render the same HTML the send uses: `buildWrappedCampaignEmailHtml`, with the header and footer resolved as at send time.
   - Show it in a sandboxed iframe (`sandbox` without scripts), with merge tags filled with sample values.
   - No open pixel and no click-tracking rewrite. Links inside the preview don't work, and the unsubscribe link is dead.
   - For social, use the queue item's text, image, networks and `scheduledAt`.
   - If the content changes after the email went out, the page shows the **current** version. Saving after the approval email went out revokes the token and sends a new email (open question).
7. **Scanner GETs** don't count. Log them as `link_open` (IP, UA, time) and keep one quiet line per campaign. Store the SES click IP, UA and timestamp from the SNS webhook.
8. **"To" line:** reuse the `recipientLine` logic in `ses-campaign-approval.js`. Tags come first and read "Tag:" or "Tags:" with their names. Then `listId` gives "List: <list name>". `all_subscribers` becomes "Audience: All contacts" (today it's "List: All subscribers"). If neither applies, leave the line out. The count is the same distinct-email query as today.
9. **Approval email template** (SES and social): replace the action links with one "Review & approve" link to the B page (`?from=email`), or the variant Alex picks, add the summary block, the expiry date and the "nothing happens until you click" line.
10. **Unsubscribe:**
   - A GET shows the confirm page. The page button POSTs.
   - The **RFC 8058 one-click** POST (`List-Unsubscribe=One-Click`, sent by Gmail and Yahoo) unsubscribes **without** CSRF or a confirm step and returns 200.
   - Log `source` as `one-click` or `confirm-page`. Undo is a POST.
11. **In-app buttons**, including #649 "Approve and Send in 1 hour", call the method or POST, never the GET URL.
12. **White-label:** the unsubscribe page uses advisor branding only. Its URL host is still FC's (`Meteor.absoluteUrl()`).

## In and out of scope

- **In:** B pages (campaign and social) with the preview, the approval email template changes, tokens, POST handlers, audit fields, Slack and scanner logging, unsubscribe confirm plus one-click, and tests (GET, HEAD and prefetch change nothing, single use, expiry, resend).
- **Out:** a branded unsubscribe domain, Mailchimp's own approval links, and a preference center.

## Estimate (B + preview + email)

| Piece | Days |
|---|---|
| Token collection, sign and verify, hashing, expiry, resend and revoke | 1–1.5 |
| Campaign B page: GET render, POST approve and decline, idempotent, audit, To line | 1–1.5 |
| Campaign preview (send-time HTML in a sandboxed iframe, no tracking) | 0.5–1 |
| Social B page and preview, reusing `decideSocialPostApproval` | 0.75–1 |
| Approval email template, SES and social (summary, one Review & approve button, expiry) | 0.75–1 |
| Unsubscribe confirm, undo, RFC 8058 one-click POST | 0.75–1 |
| Slack line, scanner-open log, SNS click IP and UA | 0.5–0.75 |
| In-app buttons and tests (unit, plus `curl -I` and prefetch on staging) | 1–1.25 |

That's about **6.25 to 9 days**.

## Open questions

1. How long should approval links last: 7 days (suggested, shown in the email), 72 hours, or until the send time?
2. Once one approver approves, do the other approvers' links show "already"? (Suggested: yes.)
3. Who gets the "Don't approve" or "Reject" note, and where does it show?
4. Where should scanner-like opens go: one quiet Slack line per campaign, their own channel, or only the log?
5. Should an expired link offer "Request a new link" (emails the same approver), or only Sign in?
6. Unsubscribe tokens with no expiry, per contact: is that OK with compliance? (No CASL or CAN-SPAM conclusion is stated here.)
7. The unsubscribe URL host is FC's domain. Is that OK for now, or should it be an advisor domain or a neutral host later?
8. Should unsubscribe cover all of the advisor's emails, or one list? (The mock says all.)
9. If the campaign or post is edited after the approval email goes out, should the old link be revoked and a new email sent, or should the page just show the latest version?
10. Preview merge tags: sample values ("Hi {First name}") or the first recipient's real values?
11. Email buttons: one "Review & approve" (recommended), keep "Approve", or add a "Don't approve" link (`btn=two`)?

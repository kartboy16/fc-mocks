# #890 FTT Mail: admin-only delivery details (SES sends, deliveries, bounces, complaints)

**Status:** Not agent-ready. Soft Dev hold until a direction is picked.

**Risk:** high — email sending and stats path, and delivery data must never reach an advisor client.

## Sources (read-only)
- Issue #890
- Related: #844 (store raw bounce diagnostics + dedup delivered/bounce counters). This issue is the admin UI plus real SES event timestamps. Prefer to land #844 first or in the same build so bounce rows have `diagnosticCode`, SMTP `status`, `action`, and `reportingMTA`.
- Live report: `imports/ui/EmailCampaigns/SESReports.jsx` — campaign report dialog (Sent / Delivered / Opens / Clicks / Bounces; tabs Opens, Clicks, Bounces, Recipients) and Subscriber History (`ses.getSubscriberEngagementHistory`, Open and Click only).
- Live tabs: `EmailCampaigns.jsx` — Campaigns, Lists, Default Lists, Subscribers, Forms, Reports, Settings.
- Webhook: `server/api/ses-sns-webhook.js` stores `sesEvents` with `timestamp: new Date(event.mail?.timestamp || Date.now())` — that is the **send** time. Bounce fields today are `bounceType` and `bounceSubType` only.
- Report loader: `getCampaignReportData` in `server/ses-methods.js` does `SESEvents.find({ campaignId }).fetchAsync()` with **no limit**. Recipients can be stored up to 10,000 on the campaign document.
- Contacts: `status` (`subscribed` / `unsubscribed` / `bounced`), `softBounceCount`. Permanent bounce sets status to bounced and adds SES suppression reason `BOUNCE`. Temporary bounce increments `softBounceCount`. Complaint sets unsubscribed and suppression `COMPLAINT`. Delivery resets `softBounceCount` to 0.
- Impersonation: `server/support-impersonation.js`. During support impersonation, `this.userId` is the **advisor**. `isAdminUserId(this.userId)` is false. Check the real actor: `isAdminUserId(currentUserId)` **or** `isAdminUserId(session.supportUserId)` from `getValidImpersonationSession`. Support-only actors are not enough — this view is FC admin only.

## Recommendation
**A. Delivery tab on the campaign report, plus a delivery timeline on Subscriber History. 18–30 h.** This is the first slice. Admins already open the campaign report and Subscriber History to debug “Sent, but they never got it.” A new Delivery tab sits next to Opens / Clicks / Bounces / Recipients and is marked **Admin only · not visible to advisor**. It shows counts for Sent, Delivered, Bounced (permanent / temporary), Complained, and No result yet, a filterable list with server-side paging (25 or 50) and “Showing 1–25 of 1,240,” and a row expand with the subscriber’s SES events at real event times. Subscriber History adds contact status, `softBounceCount`, suppression (including **unknown**), and a delivery timeline across campaigns. Advisor clients never receive the tab, the methods, or the fields.

**B (16–27 h)** uses the same data and the same Subscriber History section, but keeps today’s tab bar and puts delivery details in a collapsible admin panel (with an optional drawer). Slightly less navigation change, but the panel is easier to miss and the report gets taller. Same gating and paging rules.

**C (24–40 h)** is the follow-up: an Admin › Delivery log with cross-campaign search (advisor, campaign, email, status), still linked from the campaign report and Subscriber History. Do not build C first — it leaves the campaign context and is a larger surface. Ship A, then take C if cross-campaign search is still needed.

## Screens
| Screen | Direction | Notes |
| --- | --- | --- |
| Today, report | — | Current Opens / Clicks / Bounces / Recipients. No Delivery tab. Bounce times are the send time. |
| Today, history | — | Opens and clicks only. November market notes is missing for `pat.client@outlook.example` because there is no open or click. |
| Delivery tab | A | Counts, filters, paged list, expand on `pat.client@outlook.example` (temporary bounce at 9:02:18 AM PT, not 9:00 AM). Impersonation banner: Viewing as Jane Advisor. |
| Admin panel / drawer | B | Same data on the existing report, no new tab. |
| Delivery log | C | Admin tools page, cross-campaign rows, pre-filter from report or history. |
| Subscriber History | A, B, C | Delivery timeline, status, softBounceCount, suppression. Advisor view hides all of this. |
| Empty | A, B, C | No SES events yet / webhook not received. |
| Loading | A, B, C | Spinner. Other report tabs still available. |
| Error | A, B, C | “Couldn’t load delivery details…” + Try again. Campaign stats may still show. |
| No result yet | A | Filter + explanation: send recorded, no delivery / bounce / complaint yet. |
| Advisor view | A, B, C | No Delivery tab, panel, or log link. No delivery payload on the wire. |

## States
success (list + expand), empty (no SES events / webhook not received), loading, error (retry), no result yet (row and filter explanation), advisor-hidden, impersonating admin.

## Copy
- Badge: **Admin only · not visible to advisor**
- Impersonation banner: **Viewing as Jane Advisor · Your Firm Name** / End session
- Tab: **Delivery** (with a small Admin mark)
- Counts: Sent, Delivered, Bounced (N permanent · M temporary), Complained, No result yet
- Filters: Search email, Status, Bounce type (Permanent / Temporary), Domain, Per page (25 / 50)
- Paging: **Showing 1–25 of 1,240**
- Time note: “Times are SES event times, not the send time.”
- Empty: “No SES delivery events have been recorded for this campaign yet. If it was just sent, wait for the SNS webhook. If it was sent a while ago, the webhook may not have been received.”
- No result yet: “SES has not reported a delivery, bounce, or complaint for this address yet. The webhook may still be catching up, or the message is delayed.”
- Error: “Couldn’t load delivery details. The Sent, Delivered, and Bounces counts above still come from campaign stats.” / Try again
- History section: **Delivery timeline**
- Suppression values: `BOUNCE`, `COMPLAINT`, `not suppressed`, **unknown**
- Bounce labels: Permanent, Temporary (SES `Transient` is Temporary in the UI)
- C page title: **Delivery log** under Admin
- C links: “Open in Delivery log”

Fixture campaign: **November market notes**. Featured address: `pat.client@outlook.example`. No estimates or explainer prose in the mock UI (hub and contract only).

## Admin-only gating
Server-side only. A publication or method must:

1. Allow only a real FC **admin**: `isAdminUserId(this.userId)` **or**, when impersonating, `isAdminUserId(session.supportUserId)` from a valid impersonation session. Do not treat support-only as enough.
2. Never use the impersonated advisor id as the admin check. `this.userId` is the advisor during impersonation.
3. Return `not-authorized` (or simply omit the tab) for a plain advisor, including when an admin “acting as” path is not an admin session.
4. Never send delivery rows, diagnostics, suppression, or `softBounceCount` to advisor clients. Existing Opens / Clicks / Bounces-without-diagnostics stay as they are for advisors.
5. Client UI hides the tab / panel / log based on a dedicated `ses.canViewDeliveryDetails(advisorId, impersonationToken)` (or equivalent) that uses the same server check. Hiding the tab is not a security boundary.

Shared report payloads such as `ses.getCampaignReport` must not grow to include the delivery list. Keep delivery on its own paged methods.

## Paging, cap, and field projection
Alex’s rule: any list must cap results with a **limit plus paging and field projection**, never load all.

- New methods, for example:
  - `ses.getCampaignDeliverySummary(campaignId, advisorId, impersonationToken)` — counts only.
  - `ses.getCampaignDeliveryPage({ campaignId, advisorId, impersonationToken, status, bounceType, domain, q, page, pageSize })` — pageSize 25 or 50, hard max 50, returns `{ rows, total, page, pageSize }` and projected fields only (`email`, result status, bounce type/subtype, last event time). Events are not in the page payload.
  - `ses.getSubscriberDeliveryEvents({ campaignId or advisorId, email, impersonationToken, limit })` — one subscriber’s events, capped (for example 100) and projected (`eventType`, `timestamp`, bounce fields, `complaintFeedbackType`, `clickUrl`, `messageId`).
  - `ses.getSubscriberDeliveryHistory(advisorId, email, impersonationToken)` — history delivery section, events capped per campaign, plus contact `status`, `softBounceCount`, and suppression (or `unknown`).
  - C only: `ses.searchDeliveryLog({ advisorId?, campaignId?, q, status, page, pageSize, impersonationToken })` — same paging rules, never a full collection scan.
- Do not reuse `getCampaignReportData`’s unpaged `SESEvents.find({ campaignId }).fetchAsync()` for this list.
- Counts should come from aggregations or maintained counters with the #844 dedup rules, not from loading every event into the method.
- “Sent” for the delivery view is unique recipients accepted at send (campaign recipient list or Send events), not a dump of `recipientEmails` to the client.

## Field projection and timestamps
Store and return the **event** timestamp, not `event.mail.timestamp`:

| Event | Timestamp source |
| --- | --- |
| Send | `event.send.timestamp` |
| Delivery | `event.delivery.timestamp` |
| Bounce | `event.bounce.timestamp` |
| Complaint | `event.complaint.timestamp` |
| Open / Click (history only) | `event.open.timestamp` / `event.click.timestamp` |

If a Send event is missing, the send time may fall back to the campaign recipient send record or `sentAt`, and must be labelled as send time.

Bounce projection (with #844): `bounceType`, `bounceSubType`, `diagnosticCode`, SMTP `status`, `action`, `reportingMTA`. Map SES `Transient` to Temporary in the UI.

## Indexes (likely)
On `sesEvents` (create in startup, ignore “already exists”):

- `{ campaignId: 1, eventType: 1, timestamp: -1 }`
- `{ campaignId: 1, email: 1, timestamp: 1 }`
- `{ advisorId: 1, email: 1, timestamp: -1 }`
- `{ messageId: 1, eventType: 1, email: 1 }` (dedup; may already be needed by #844)

Confirm with explain on the new paged queries. Do not add unbounded `$in` over all recipients.

## In / out of scope
**In:** admin-only Delivery tab (A) or panel (B) or Admin Delivery log (C); Subscriber History delivery timeline; counts listed above; filters; server-side paging and projection; real SES event times in the webhook; impersonation-safe admin gate; empty / loading / error / no-result-yet; 1280 and 390; generic fixtures; indexes above.

**Out of scope:** changing what advisors already see on Opens / Clicks / Bounces (except leaving them alone); resending mail; changing bounce-to-suppression policy; SES console or DNS; backfill of historical `event.mail.timestamp` values (optional, call out if proposed); non-admin support role access; loading every `sesEvents` row for a campaign.

## Desktop vs mobile
1280: campaign report dialog to ~1080px, table with expand, 90px left rail, impersonation banner visible.
390: full-screen dialog, stacked filter controls, card list instead of the table, 44px targets, rail behind Menu, banner wraps.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 11–18 | 10–16 | 14–24 |
| FC Tester | 5–8 | 4–7 | 6–10 |
| Fix loop | 2–4 | 2–4 | 4–6 |
| **Total** | **18–30 h** | **16–27 h** | **24–40 h** |

A covers the webhook timestamp change, admin auth helper, paged methods, Delivery tab, history timeline, indexes, and advisor-cannot-see tests. B is the same backend with a panel instead of a tab. C adds the Admin log and cross-campaign search (and should still keep history and a report entry point).

#844 may already cover diagnostic field storage and counter dedup; do not double-count that work if it has landed, but the UI must still render those fields.

## Open questions
1. Land #844 (diagnostics + counter dedup) before or with this UI? (Recommended: before or in the same build.)
2. Backfill existing `sesEvents.timestamp` values that were stored from `event.mail.timestamp`? New events should be correct either way. Old rows may keep the send time unless raw SNS payloads were kept (they were not, on current code).
3. Is a Send event always in `sesEvents`, or do we derive “Sent” from the campaign recipient list?
4. Who may see this besides FC admins — support-only impersonation, or admins only as mocked? (Recommended: FC admins only.)
5. Should advisors ever see a weaker bounce diagnostic on the existing Bounces tab later, or does that stay admin-only forever?
6. Suppression lookup: live SES API on demand, a cached field, or **unknown** when not confirmed? (Recommended: show unknown when not confirmed; do not block the page on a live SES call.)

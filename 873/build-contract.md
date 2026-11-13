# #873 Log compliance approvals on email campaigns

**Status:** Published on GitHub Pages at https://kartboy16.github.io/fc-mocks/873/. Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #873
- Related: #415 (compliance Approve → auto-approved in FC; reporter lean is B, waiting on a lock), #416 (advisor-first chain, Direction A locked), #655 (investment-only compliance, reporter lean is A), #127 (external / Red Oak, out of scope here)
- Live Email Campaigns list (`imports/ui/EmailCampaigns/SESCampaignsList.jsx`): two columns today
  - **Compliance** (`getSesComplianceLabel` / `sesComplianceHelpers.js`): `—` when `sendToCompliance` is off; otherwise Pending confirmation, Scheduled, Copy failed, or Confirmed (`complianceStatus === 'approved'`, tooltip uses `complianceConfirmedAt`)
  - **Approval** (`getApprovalLabel`): advisor path only — `—`, Not sent, Scheduled, Sent, Failed, or Approved (`campaign.approved`)
- There is no “approved by compliance” label today. Confirmed is the in-FC review-copy / type-APPROVED path, not a Gmail dealer email.
- Advisor-approved Slack post (`server/api/ses-campaign-approval.js` and Mailchimp `updateApprovedByAdvisor`) goes to `#email_campaign_approved` (issue channel CME034EE4):

```
Approved!! {advisorName} approved this
	Email Campaign: {subject}
	{recipientLine}
Go to email campaign: <{url}|{subject}>
View all email Campaigns: <{listUrl}|Email Campaigns>
```

- A different post (`#email_campaign_approval_sent`) fires when the advisor approval email is sent. This mock does not change that post.
- Campaign detail today: Compliance review dialog shows recipient, sent, opens, clicks, confirmed time, and event history. It does not store a source email ref for a dealer Gmail approval.
- Split (issue, to confirm): Gmail reading is a bot / ops workflow, not app code. App scope is the status field, a write path with an audit trail, an admin fix, and the Slack post text.

## Recommendation
**A. Extend the Compliance column, auto-record high-confidence matches, and give admins an unmatched inbox.** One recommended direction.

The live **Approval** column is the advisor’s approve/deny path. Putting “Approved by compliance” there would mix two gates. The **Compliance** column already holds compliance status, but its labels (especially “Confirmed”) describe the in-FC review copy, not a dealer email logged from Gmail. Direction A adds the requested wording to that column, records who / when / source email ref, and keeps the advisor Approval column unchanged.

The logger may auto-write only a high-confidence match (campaign name or id in the subject or body, one campaign). No-match and ambiguous emails go to an admin inbox to assign, record, or dismiss. Campaign detail has Fix match for a wrong record. This is the best balance of speed and a safe repair path.

**B** is the safer fork: every dealer email waits for an admin confirm before anything is written. **C** is leaner: auto-record, and the only repair is Fix match on the campaign — no inbox, so a no-match can sit unnoticed.

All three share the same four compliance states, the same audit trail fields, and the same Slack Compliance line. None change who gets email or when a campaign sends (AC-4), unless that is decided separately. Sending stays as it is today (including the existing type-APPROVED attestation when email compliance mode requires it).

This composes with #416 A (advisor approves first) and does not implement #415 B’s “compliance Approve auto-sends in FC.” A logged dealer approval here marks the campaign approved by compliance; it does not by itself send the campaign. #655 and #127 stay out of this slice.

## Screens
| Screen | Notes |
| --- | --- |
| Email Campaigns list | Existing Name, Subject, Status, **Compliance**, **Approval** columns. Compliance uses the new states. Approval stays the advisor chip (Approved / Sent / —) |
| Campaign detail | Audit trail: recorded by, when, source (from address), email subject, email ref. Fix match (admin) |
| Unmatched inbox (A) or Confirm inbox (B) | Dealer emails: already recorded, ambiguous (pick a campaign), no match. Record approval / Not a match. Not in C |
| Fix match | Set status (not required / awaiting / approved by compliance / declined), optional source ref, or clear the record. Does not send email |
| Slack before / after | Today’s `#email_campaign_approved` wording, then the same post with a Compliance line, for awaiting and already-approved cases |

## States
Compliance (column and detail): **Not required**, **Awaiting**, **Approved by compliance**, **Declined**.
Advisor Approval (unchanged): Approved, Sent, and the live — / Not sent / Scheduled / Failed values as needed.
Inbox: recorded, ambiguous, no match, dismissed.
Slack: before (no compliance line), after with Awaiting / Approved by compliance / Not required / Declined.

## Copy
- Compliance chips: “Not required” / “Awaiting” / “Approved by compliance” / “Declined”
- Approval chips (live): “Approved” / “Sent”
- Audit: “Recorded by {Campaign logger (bot) or Pat Admin}” / “When:” / “Source: Email from Your Dealer Compliance &lt;compliance@example.com&gt;” / “Subject:” / “Email ref:”
- Inbox: “Unmatched and ambiguous emails” (A) / “Confirm compliance emails” (B) / “High-confidence matches are recorded automatically…” / “Record approval” / “Not a match”
- Fix match: “Change or clear the recorded approval… This does not send email.” / “Save” / “Clear record”
- Slack after, added line: `Compliance: Approved by compliance` or `Compliance: Awaiting approval` or `Compliance: Not required` or `Compliance: Declined`
- Slack before (live): `Approved!! Jane Advisor approved this` plus subject, recipient line, and the two campaign links
- Banner: “Proposal mockup — not on the live site. Example data only. Nothing is sent.”

No estimates or explainer prose on the mock screens themselves.

Sample campaign: **November money update**. Subject: **Your November money update: TFSA room, the RRSP deadline, and a retirement check-in**. Advisor: Jane Advisor. Dealer desk: Your Dealer Compliance, `compliance@example.com`. List: Newsletter, 1,104 recipients. Email refs: `msg-20441` and similar placeholders.

## In / out of scope
**In:** Compliance-column states and badges, write path + audit trail for a logged dealer approval, admin unmatched/confirm inbox and/or Fix match, Slack advisor-approved post line, 1280/390, generic fixtures, staging tryout after a direction is picked, tests on test accounts only.
**Out of scope:** Building the Gmail reader in app code (ops bot), changing who receives emails or when campaigns send (AC-4), implementing #415 auto-send on compliance approve, #416/#655/#127 work, changing the `#email_campaign_approval_sent` post, inventing legal compliance rules, client-site branding or product-domain links, production deploy.

Expect **risk:high** (compliance / email-campaign approval path). Only the usual main-merge rule applies after staging. No build launched.

## Desktop vs mobile
1280: navy sidebar 232px, wide campaigns table, Slack before/after side by side.
390: sidebar behind Menu, table scrolls horizontally, stacked Slack cards, 44px actions.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A (recommended) | B | C |
| --- | --- | --- | --- |
| Cloud agent build (status + audit write path, inbox or detail fix, Slack line) | 10–16 | 11–17 | 8–13 |
| FC Tester (list states, detail trail, no-match / wrong-match fix, Slack wording, 1280/390, generic fixtures, test accounts only, no live dealer email) | 4–7 | 5–8 | 3–6 |
| Fix loop | 2–4 | 2–4 | 2–3 |
| **Total** | **16–27 h** | **18–29 h** | **13–22 h** |

Staging first (issue track). Playground is not required unless a later lock says so. No build launched.

## Open questions
1. Matching rule: campaign name, subject, and/or a campaign id in the dealer email? What is “high confidence”?
2. Should sending be blocked or warned when compliance is required but still awaiting? This mock does not change send behaviour (AC-4).
3. How is a decline detected in a dealer email, versus an admin marking Declined by hand?
4. Should the live in-FC “Confirmed” label be renamed to “Approved by compliance” when the source is type-APPROVED attestation, or should the two sources stay visually distinct?
5. Does a logged dealer approval satisfy today’s email-compliance attestation, or is that still a separate step?
6. How does this compose with #415 B if that direction is later locked (compliance Approve becomes the final send gate)?
7. One compliance inbox for all advisors, or a per-dealer mailbox the bot reads?

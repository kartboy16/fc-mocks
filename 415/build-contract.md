# Build contract · #415 Compliance approve like advisors → auto-approved in FC

**PROVISIONAL.** Recommend Direction **B** (advisor approves, then compliance; compliance’s Approve is final and auto-approves) — **works with #416**. **Alex has not picked a direction.**

**Idea → playground first, hold main. Soft Dev hold · not agent-ready.** Do **not** wake Soft Dev. Do **not** add `agent-ready` until Alex picks a direction and the Pages URL is on the issue.

Issue: https://github.com/kartboy16/content-library/issues/415  
Sibling: https://github.com/kartboy16/content-library/issues/416 (advisor first) · mocks https://kartboy16.github.io/fc-mocks/416/  
Related: #148 / PR #151 (social post approval), #389 (Decline), #127 (Red Oak / external — out of scope)  
Slack: https://financialtechtools.slack.com/archives/C0C265G996G/p1791481898763159

## One-liner
For advisors with a compliance contact, compliance **Approves the same way advisors do** (email button → approve page, or in-app). That Approve marks the item **approved and scheduled/sendable automatically** — no second internal approve step. Decline (optional reason) stops reminders and tells the advisor.

## How #415 and #416 fit
#415 = what compliance’s Approve does (auto-approve, no extra FC step). #416 = the order (advisor first). **Together: #415 B + #416 A.**

## Recommend
**B — Advisor then compliance.** Advisor approves first (#416). FC then sends compliance the same approval email. Compliance’s Approve is final → item flips to **Approved · Scheduled** with audit lines “Approved by Jordan Lee (Advisor) · …” and “Approved by Priya Shah (Compliance) · Oct 8, 10:14 AM”. 3-step tracker (Advisor ✓ → Compliance ✓ → Approved & scheduled). Decline at either step stops reminders.

- **A — Compliance is the final approver:** approval email goes to compliance only; advisor gets an FYI copy. Keep as a setting for firms where compliance alone signs off.
- **C — Compliance review queue:** weekly summary email → in-app “Waiting for compliance” queue with per-item Approve / Decline and Approve all. Can sit on top of A or B.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/415/
- A: https://kartboy16.github.io/fc-mocks/415/directions/a/
- B (recommend): https://kartboy16.github.io/fc-mocks/415/directions/b/
- C: https://kartboy16.github.io/fc-mocks/415/directions/c/

Each direction demos: 1 compliance email · 2 approve page / in-app · 3 after approve · 4 advisor + FTT admin status flipping to Approved & scheduled with the “approved by compliance” line · 5 decline path · 6 setup (Settings › Approvals) · 7 phone. Item type toggle: email campaign / social post.

## Acceptance criteria (from the issue · provisional)
- **AC-1:** For advisors in a compliance workflow, a compliance reviewer can **Approve** with the same experience as the advisor approve path: approval email with Approve / Decline → approve page (one tap confirms), and in-app review when signed in.
- **AC-2:** When compliance Approves, FC marks the item **approved** automatically and it becomes scheduled / ready / sendable as appropriate (campaign: scheduled send; social: scheduled post). **No second internal approve step.**
- **AC-3:** Decline is clear: optional reason (Needs a disclaimer / Wording needs changes / Not suitable for our clients / Other) + optional note to the advisor. Decline **stops approval-reminder emails** for that item and tells the advisor. Undo ~10s.
- **AC-4:** Works for **email campaigns and social posts** (mock shows both; final scope is an open question).
- **AC-5:** Status is visible to the advisor and FTT admin (Manage Advisor Posts): Waiting for compliance · Approved · Scheduled · Declined by compliance, with an audit line naming who approved and when.
- **AC-6:** Setup: Settings › Approvals — “Compliance reviews my content” on/off, compliance name + email, order (compliance only / me first, then compliance), email per item vs weekly summary; FTT admin can set a firm default.
- **AC-7:** Playground build first; **hold main** until Alex says yes.

## Direction-specific behavior
- **A:** compliance only; advisor FYI copy; one gate.
- **B (recommend):** advisor → compliance; compliance’s Approve final; tracker; both audit lines.
- **C:** weekly summary + queue + Approve all (confirm dialog); each Approve auto-schedules.

## Open questions for Alex / Alana
1. Campaigns, social, or both? (mock shows both)
2. Does the advisor still need to approve too? (A: no; B: yes — #416 says yes)
3. One compliance contact per advisor, or per firm?
4. Who is told on decline (advisor, FTT, both)? Mock: advisor by email; FTT status-only.
5. External tools like Red Oak (#127) stay out of scope? Mock: yes.

## Copy (plain words)
- Email subject: “Approval needed: Jordan Lee’s email campaign — “…””
- Email: “Your approval is the final step — once you approve, it’s scheduled automatically.”
- Approve page button: “Approve — schedule it” · “Decline”
- After approve: “Approved and scheduled · Nothing else to do. Jordan Lee has been told.”
- After decline: “Declined · Jordan Lee has been told. No more reminder emails for this …”
- Audit: “Approved by Priya Shah (Compliance) · Oct 8, 10:14 AM” · “Scheduled automatically”
- Badges: Waiting for advisor · Waiting for compliance · Approved · Scheduled · Declined by advisor · Declined by compliance

## Non-goals
- Red Oak / external compliance (#127)
- Editing content on the approve page
- Changing approvals for advisors without a compliance contact
- content-library / Meteor work now · waking Soft Dev · agent-ready · main
- Real names as rows — fictional only

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex (with Alana) to pick A / B / C and answer the open questions. Pages URL must be on the issue before Soft Dev. Build path after pick: Software developer → playground → FC Tester.

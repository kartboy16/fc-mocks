# Build contract · #416 Advisor approve/deny before compliance approval request

**PROVISIONAL.** Recommend Direction **A** (automatic chain). **Alex has not picked a direction.**

**Idea → playground first, hold main. Soft Dev hold · not agent-ready.** Do **not** wake Soft Dev. Do **not** add `agent-ready` until Alex picks a direction and the Pages URL is on the issue.

Issue: https://github.com/kartboy16/content-library/issues/416  
Sibling: https://github.com/kartboy16/content-library/issues/415 (compliance Approve → auto-approved) · mocks https://kartboy16.github.io/fc-mocks/415/  
Related: #389 (Decline), #148 (social approval), #127 (Red Oak — different problem)  
Slack: https://financialtechtools.slack.com/archives/C0C265G996G/p1791481923111849

## One-liner
For compliance advisors, the item goes to the **advisor first** (Approve / Decline). Advisor Approve → FC sends the **compliance approval request** automatically. Advisor Decline → stop: no compliance request, reminders stop. Compliance’s Approve then auto-approves and schedules (#415).

## How #415 and #416 fit
#415 = what compliance’s Approve does (auto-approve, no extra FC step). #416 = the order (advisor first). **Together: #415 B + #416 A.**

## Recommend
**A — Automatic chain.** Advisor gets the usual approval email / in-app item with Approve + Decline (#389 A style). Approve → “Approved. Sent to Priya Shah (Compliance) for review.” and FC sends the compliance request. Decline → “Declined. Compliance won’t be asked. No more reminders.” with Undo ~10s. 3-step tracker everywhere: Awaiting advisor → Awaiting compliance → Approved & scheduled; end states Declined by advisor / Declined by compliance.

- **B — Approve with a note to compliance:** same order, plus optional “Note for compliance” and an “Approve & send to compliance” button; compliance sees the note in their email and approve page.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/416/
- A (recommend): https://kartboy16.github.io/fc-mocks/416/directions/a/
- B: https://kartboy16.github.io/fc-mocks/416/directions/b/

Each direction demos: advisor email · advisor approve page / in-app · after advisor approves · advisor declines · compliance email · compliance approves (auto-approved) · advisor Content approvals status + FTT admin / MAP list with every state · setup · phone. Item type toggle: Content approvals / Email Campaigns / social post.

## Acceptance criteria (from the issue · provisional)
- **AC-1:** For advisors with a compliance workflow, the first gate is **advisor Approve / Decline** (email and in-app) before any compliance request is sent.
- **AC-2:** Advisor **Decline** marks the item “Declined by advisor”; **no** compliance email/request is sent; advisor reminders stop. Reason optional (#389 A quick picks). Undo ~10s.
- **AC-3:** Advisor **Approve** triggers the compliance approval request automatically (the #415 compliance path). Advisor sees “Approved. Sent to Priya Shah (Compliance) for review.”
- **AC-4:** Statuses are clear in FTT admin / MAP and to the advisor: Waiting for advisor → Waiting for compliance → Approved & scheduled; Declined by advisor; Declined by compliance — with audit lines (who, when, reason).
- **AC-5:** Surfaces called out: Content approvals, Email Campaigns, social posts (final list is an open question; recommend all compliance-gated sends).
- **AC-6:** Compliance’s Approve auto-approves and schedules with no internal gate (#415).
- **AC-7:** Playground build first; **hold main** until Alex says yes.
- **B only:** optional “Note for compliance” saved with the item and shown to compliance.

## Open questions for Alex / Alana
1. Which surfaces: Email Campaigns, Content approvals, social, or all compliance-gated sends? (Recommend all.)
2. Can the advisor undo a decline, or pull back after approving but before compliance responds? Mock: Undo ~10s only.
3. Does an advisor decline notify FTT, or status-only? Mock: status-only.
4. #389 replacement pick: an advisor who declines could pick a replacement, which then goes to compliance. Noted only.

## Copy (plain words)
- Advisor email: “Your … is ready for your OK. After you approve, it goes to Priya Shah (Compliance) for the final OK, then it’s scheduled automatically.”
- Buttons: “Approve” (A) / “Approve & send to compliance” (B) · “Decline” · “Undo”
- After approve: “Approved. Sent to Priya Shah (Compliance) for review.”
- After decline: “Declined. Compliance won’t be asked. No more reminders.”
- Tracker: Awaiting advisor · Awaiting compliance · Approved & scheduled · Declined by advisor · Declined by compliance · Not asked · Stopped

## Non-goals
- Red Oak / external compliance (#127)
- #389 replacement pick (note only)
- Advisor pull-back after approve beyond Undo ~10s (open question)
- content-library / Meteor work now · waking Soft Dev · agent-ready · main
- Real names as rows — fictional only

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex (with Alana) to pick A / B and answer the open questions. Pages URL must be on the issue before Soft Dev. Build path after pick: Software developer → playground → FC Tester.

# Build contract · #389 Content approvals — Decline option

**PROVISIONAL.** Recommend Direction **A** (light confirm + optional quick-pick reason + Undo ~10s). **Alex / Angelina have not locked a direction.**

**Soft Dev hold · Designer-first · not agent-ready.** Soft Dev not woken. Do **not** mark `agent-ready`. No content-library / Meteor work until a direction is locked and the Pages URL is on the issue.

Issue: https://github.com/kartboy16/content-library/issues/389  
Related: #124 (not a duplicate)  
Slack thread ts: `1791314953.247289`

## One-liner
Advisors can **Decline** a piece in Content approvals (email landing and in-app). Declined pieces are not published/scheduled, reminder-to-approve emails stop, and FTT admin can see Declined status. **Approve and the approval gate stay unchanged.**

## Recommend
**A: Light confirm + optional reason + Undo.** Primary Approve stays as today. Secondary Decline opens a short confirm: “Decline this piece? We will stop reminder emails. You can still approve it later from Content approvals.” Optional quick picks: Not relevant to my clients / Timing is not right / Compliance concern / Other (short free text). After decline: “Declined · No more reminder emails for this piece” with **Undo for ~10 seconds**, then **Approve later** into Content approvals. Admin list/MAP shows a **Declined** badge + optional reason tooltip.

- **B** (one confirm, no reason, no undo) is fastest but gives FTT no insight and no soft undo.
- **C** (required reason sheet, no undo) gives the strongest admin signal but is heavier for advisors who only want reminders to stop.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/389/
- A (recommend): https://kartboy16.github.io/fc-mocks/389/directions/a/
- B: https://kartboy16.github.io/fc-mocks/389/directions/b/
- C: https://kartboy16.github.io/fc-mocks/389/directions/c/

Each page shows four views: 1 Email landing · 2 In-app Content approvals · 3 After decline · 4 Admin (MAP / approvals). Advisor screens use a phone layout (~390px).

## Acceptance criteria (provisional · not locked)
- **AC-1:** Every place an advisor can Approve a content piece (approval page / landing from the approval email, and in-app Content approvals) also offers **Decline**.
- **AC-2:** Declining marks that piece as **declined** for that advisor (distinct from approved and from pending). It is **not** published or scheduled for them.
- **AC-3:** Once declined, **no further reminder-to-approve emails** go out for that piece.
- **AC-4:** The advisor sees a clear confirmation in plain words (e.g. “Declined · No more reminder emails for this piece”). No jargon.
- **AC-5:** FTT/admin can see the declined status (MAP row or approvals list), including optional reason when collected (A tooltip / C prominent).
- **AC-6:** Existing **Approve** flow and the approval gate are **unchanged**. Decline is additive.

## Direction-specific behavior (provisional)
- **A:** Light confirm · optional quick-pick reason · Undo ~10s · Approve later link · admin Declined + reason tooltip.
- **B:** Confirm only · no reason · no undo · admin Declined badge only.
- **C:** Reason required (quick pick or free text) before confirm · no undo · admin Declined + reason shown prominently.

## Open questions for Alex / Angelina
1. **Confirm step?** All mocks include at least a light one. Keep it?
2. **Optional vs required reason?** A optional · B none · C required.
3. **Undo / approve later?** A offers Undo ~10s + Approve later. Keep soft undo?
4. **Notify FTT?** Mock assumes **status-only in admin**. Email/Slack notify only if you ask.
5. **Suggest Posts / Pick for Me avoidance?** Out of scope for v1 unless you say yes. Decline does not change Suggest / Pick in these mocks.

## Copy (plain words)
- Buttons: “Approve” · “Decline” · “Cancel” · “Undo” · “Approve later from Content approvals”
- Confirm A: “Decline this piece? We will stop reminder emails. You can still approve it later from Content approvals.”
- Confirm B: “Stop reminders and skip this piece?”
- Sheet C: “Decline this piece” · “Decline and stop reminders”
- Reasons: “Not relevant to my clients” · “Timing is not right” · “Compliance concern” · “Other”
- Confirmation: “Declined” · “No more reminder emails for this piece” · “will not be published or scheduled for you”
- Admin: “Declined” · “Pending” · “Approved” · “Reminders stopped”

## Non-goals
- Changing Approve or the approval gate
- Suggest Posts / Pick for Me avoidance from decline (v1 out of scope unless asked)
- #124 alternate approval channels (related area, not this mock)
- Email/Slack notify to FTT on decline (unless asked — mock is status-only)
- content-library / Meteor · waking Soft Dev · agent-ready
- Real names as rows — fictional only (Jordan Lee, Priya Shah, Sam Okonkwo)

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex / Angelina to pick A / B / C and answer the open questions. Pages URL must be attached to the issue before Soft Dev.

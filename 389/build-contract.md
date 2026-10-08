# Build contract · #389 Content approvals — Decline + pick a replacement

**PROVISIONAL.** Recommend Direction **A** (light confirm + optional quick-pick reason + Undo ~10s, with a one-tap replacement step). **Alex / Angelina have not locked a direction.**

**Soft Dev hold · Designer-first · not agent-ready.** Soft Dev not woken. Do **not** mark `agent-ready`. No content-library / Meteor work until a direction is locked and the Pages URL is on the issue.

Issue: https://github.com/kartboy16/content-library/issues/389  
Oct 8 scope add (AC-7): https://github.com/kartboy16/content-library/issues/389#issuecomment-6065820728  
Related: #124 (not a duplicate)  
Slack thread ts: `1791314953.247289` (original) · `1791481870206459` (Oct 8 scope add, Alana Read)

## One-liner
Advisors can **Decline** a piece in Content approvals (email landing and in-app). Declined pieces are not published/scheduled, reminder-to-approve emails stop, and FTT admin can see Declined status. **New (Oct 8):** right after declining, the advisor can **pick a replacement** post that takes the declined post's date, or skip. **Approve and the approval gate stay unchanged** for the original post.

## Recommend
**A: Light confirm + optional reason + Undo, with one-tap replacement.** Primary Approve stays as today. Secondary Decline opens a short confirm: “Decline this piece? We will stop reminder emails. Next, you can pick something else to send on Tue Oct 14 — or skip.” Optional quick picks: Not relevant to my clients / Timing is not right / Compliance concern / Other (short free text).

After decline, the same screen shows “Declined · No more reminder emails for ‘Old title’” and the **replacement step**: 3 suggestions (“Suggested for your clients”) each with **Use this instead**, a **Browse the library** link, and **Skip, just decline**. In A, **tapping “Use this instead” approves the replacement** for the declined post's date (“Choosing a post approves it for Tue Oct 14. No second step.”). Confirmation: “Replaced · ‘New title’ goes out Tue Oct 14. No more reminders about ‘Old title’.” **Undo for ~10 seconds** reverses the whole decline + swap. Admin list/MAP shows the declined post struck through with **Declined → Replaced with ‘New title’** (+ reason tooltip), or just **Declined** if skipped.

- **B** (one confirm, no reason, no undo; replacement lands as pending and **needs its own Approve**) keeps the approval gate strictest, but it adds a step and the usual reminders come back for the new pick until it's approved.
- **C** (required reason, no undo; one-tap replacement like A) gives the strongest admin signal but adds friction before the swap.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/389/
- A (recommend): https://kartboy16.github.io/fc-mocks/389/directions/a/ (replacement step: https://kartboy16.github.io/fc-mocks/389/directions/a/#replace)
- B: https://kartboy16.github.io/fc-mocks/389/directions/b/ (replacement step: https://kartboy16.github.io/fc-mocks/389/directions/b/#replace)
- C: https://kartboy16.github.io/fc-mocks/389/directions/c/ (replacement step: https://kartboy16.github.io/fc-mocks/389/directions/c/#replace)

Each page shows six views: 1 Email landing · 2 In-app Content approvals · 3 Declined → pick a replacement · 4 Replaced · 5 Skipped (just declined) · 6 Admin (MAP / approvals). Advisor screens use a phone layout (~390px). Step links: `#replace`, `#replaced`, `#skipped`, `#admin`.

## Acceptance criteria (provisional · not locked)
- **AC-1:** Every place an advisor can Approve a content piece (approval page / landing from the approval email, and in-app Content approvals) also offers **Decline**.
- **AC-2:** Declining marks that piece as **declined** for that advisor (distinct from approved and from pending). It is **not** published or scheduled for them.
- **AC-3:** Once declined, **no further reminder-to-approve emails** go out for that piece.
- **AC-4:** The advisor sees a clear confirmation in plain words (e.g. “Declined · No more reminder emails for this piece”). No jargon.
- **AC-5:** FTT/admin can see the declined status (MAP row or approvals list), including optional reason when collected (A tooltip / C prominent), and the replacement when one was chosen (“Declined → Replaced with ‘New title’”).
- **AC-6:** Existing **Approve** flow and the approval gate are **unchanged** for the original post. Decline is additive.
- **AC-7 (new, Oct 8):** After declining, from **both** the email landing and in-app Content approvals, the advisor is offered a replacement: **2–3 suggested posts** one tap away (thumbnail, title, short plain blurb, category; labelled in plain words, e.g. “Suggested for your clients”), a **Browse the library** option, and a clear **“Skip, just decline”**. Picking a post puts it into the **same slot / date** as the declined post (“Will go out Tue Oct 14, in place of ‘Old title’”). Skipping behaves exactly like a plain decline (AC-2 / AC-3). After a pick, the advisor sees “Replaced · ‘New title’ goes out Tue Oct 14. No more reminders about ‘Old title’.” A skipped decline can still offer “Choose another post instead” later from Content approvals.

### AC-7 approval fork (decide before build)
- **A / C: picking = approval.** Tapping “Use this instead” approves the replacement for that date. No second Approve step. Copy: “Choosing a post approves it for Tue Oct 14.” In A, Undo (~10s) reverses the decline and the swap together.
- **B: replacement needs its own Approve.** The pick lands in Content approvals as **Needs approval** with “in place of ‘Old title’” and the same date. “Review and approve now” is one tap away. Until it's approved, the usual reminder emails apply to the new pick. The approval gate stays strict.

## Direction-specific behavior (provisional)
- **A:** Light confirm · optional quick-pick reason · replacement step (one tap = approval) · Undo ~10s covering decline + swap · Approve later link on a skipped decline · admin Declined → Replaced + reason tooltip.
- **B:** Confirm only · no reason · no undo · replacement lands pending and needs Approve · admin Declined → Replaced + Pending approval / Approved.
- **C:** Reason required (quick pick or free text) before confirm · replacement step (one tap = approval) · no undo · admin Declined → Replaced + reason shown prominently.

## Open questions for Alex / Angelina
1. **Replacement keeps the declined post's date / slot?** Mock: yes.
2. **Is picking a replacement the approval, or does it need its own Approve?** A/C: picking = approval · B: needs Approve.
3. **Where do suggestions come from?** Mock assumes Suggest Posts / Pick for Me logic (“Suggested for your clients”). Or same category as the declined post?
4. **Confirm step?** All mocks include at least a light one. Keep it?
5. **Optional vs required reason?** A optional · B none · C required.
6. **Undo / approve later?** A offers Undo ~10s (covering decline + swap) + Approve later. Keep soft undo?
7. **Notify FTT?** Mock assumes **status-only in admin**. Email/Slack notify only if you ask.
8. **Should a decline teach Suggest Posts / Pick for Me to avoid similar posts?** Out of scope for v1 unless you say yes.

## Copy (plain words)
- Buttons: “Approve” · “Decline” · “Cancel” · “Undo” · “Use this instead” · “Browse the library for more” · “Skip, just decline” · “Choose another post instead” · “Review and approve now” (B) · “Approve later from Content approvals”
- Confirm A: “Decline this piece? We will stop reminder emails. Next, you can pick something else to send on Tue Oct 14 — or skip.”
- Confirm B: “Stop reminders and skip this piece?”
- Sheet C: “Decline this piece” · “Decline and stop reminders”
- Reasons: “Not relevant to my clients” · “Timing is not right” · “Compliance concern” · “Other”
- Replacement step: “Send something else on Tue Oct 14 instead?” · “Pick one and it takes the Tue Oct 14 spot in place of the post you declined.” · “Suggested for your clients” · “Will go out Tue Oct 14, in place of ‘Old title’”
- Approval line A/C: “One tap: choosing a post approves it for Tue Oct 14. No second step.”
- Approval line B: “Your pick goes into Content approvals. You'll still need to Approve it before it goes out.”
- Replaced: “Replaced · ‘New title’ goes out Tue Oct 14. No more reminders about ‘Old title’.”
- Swapped in (B): “Waiting for your Approve · ‘New title’ is now in Content approvals. Approve it and it goes out Tue Oct 14 in place of ‘Old title’.”
- Skipped: “Declined” · “No more reminder emails for this piece” · “will not be published or scheduled for you. Nothing was swapped in for Tue Oct 14.”
- Admin: “Declined” · “Replaced with ‘New title’” · “Pending” · “Pending approval” · “Approved” · “Reminders stopped” · “No replacement chosen”

## Non-goals
- Changing Approve or the approval gate for the original post
- Suggest Posts / Pick for Me learning from declines (v1 out of scope unless asked)
- #124 alternate approval channels (related area, not this mock)
- Email/Slack notify to FTT on decline or replacement (unless asked; mock is status-only)
- content-library / Meteor · waking Soft Dev · agent-ready
- Real names as rows: fictional only (Jordan Lee, Priya Shah, Sam Okonkwo)

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex / Angelina to pick A / B / C, settle the AC-7 approval fork, and answer the open questions. Pages URL must be attached to the issue before Soft Dev.

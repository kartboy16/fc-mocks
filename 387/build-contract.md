# Build contract · #387 Content approvals + Email Campaigns — pick email list on approve/send

**PROVISIONAL.** Recommend Direction **A** (required radio list in the approve/send sheet). **Alex / Angelina have not locked a direction.**

**Soft Dev hold · Designer-first · not agent-ready.** Soft Dev not woken. Do **not** mark `agent-ready`. No content-library / Meteor work until Alex / Angelina pick A, B, or C and the Pages URL is on the issue.

Issue: https://github.com/kartboy16/content-library/issues/387

## One-liner
On approve (Content approvals) and send (Email Campaigns), the advisor chooses which email list the campaign goes to, using plain list names. A send cannot go out without a list when the advisor has more than one.

## Recommend
**A: Required radio list in the approve/send sheet.** A “Send to” section lists the advisor’s email lists as radios (one list per send for v1 clarity). With one list, it is pre-selected and shown as “Your only list · General (842 contacts)”. With several, none selected until the advisor picks; Approve / Send stays disabled with “Choose a list to continue.” Confirmation restates “Sending to Corporate (214 contacts).” Clearest way to prevent the wrong-audience mistake.

- **B** (Dropdown “Send to” + confirm chip) — same single-list default and multi-list required rules; less vertical space; slightly easier to miss.
- **C** (Multi-select checkboxes) — one campaign can go to more than one list. **Different product rule** than A/B. Ask Alex / Angelina before shipping.

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/387/
- A (recommend): https://kartboy16.github.io/fc-mocks/387/directions/a/
- B: https://kartboy16.github.io/fc-mocks/387/directions/b/
- C: https://kartboy16.github.io/fc-mocks/387/directions/c/

Each page demos: (1) one-list default · (2) multi-list with no selection (blocked) · (3) selection + confirmation summary · (4) phone layout (~390px). Surface tabs switch Content approvals ↔ Email Campaigns with the same picker.

## Acceptance criteria (provisional · from issue · not locked)
- **AC-1:** Approve flow in Content approvals shows a clear list picker listing the advisor’s existing email lists (plain names, e.g. General, Corporate, Group).
- **AC-2:** Email Campaigns send flow uses the same picker / same selection pattern.
- **AC-3:** A send cannot go out without an explicit list selection when the advisor has more than one list. Sensible default (auto-selected, still visible) when there is only one.
- **AC-4:** Chosen list(s) are shown in the confirmation / summary before send and recorded on the campaign.
- **AC-5:** Plain advisor-facing copy (no tech jargon — never “stack”, Mailchimp jargon, or developer terms).
- **AC-6:** Mobile layout works (phone sheet / large tap targets).

## Open question for Alex / Angelina
1. **One list per send (A / B) vs multi-list (C)?** A and B assume exactly one list per send. C allows General + Group in one send. Which product rule?

## Copy (plain words)
- Section: “Send to”
- Single list: “Your only list · General (842 contacts)”
- Multi, none chosen: “Choose a list to continue.”
- Confirmation: “Sending to Corporate (214 contacts).” / (C) “Sending to Corporate (214 contacts) and Group (156 contacts).”
- Saved: “This list will be saved on the campaign so you can see where it went later.”
- Primary: “Approve & send” / “Send now” / “Confirm & send” / (disabled) “Choose a list to continue”
- Cancel

## Non-goals
- Creating, importing, or renaming email lists
- Redesigning the full approvals queue or campaigns editor
- Mailchimp / sync / “stack” terminology in advisor UI
- No `agent-ready` and no Soft Dev wake until Alex / Angelina lock a direction and Pages URL is on the issue
- Fictional advisor only (Jordan Blake · Atlantic Wealth Partners)

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex / Angelina to pick A / B / C and answer the one-list vs multi-list question.

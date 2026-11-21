# #1002 Confirm before Log in as (build contract)

Not agent-ready. Soft Dev hold until a direction is picked.

## Problem
The alert email "Open the campaign" admin link (`/content-library/email-campaigns?openCampaign=<id>&advisorId=<id>`) starts a Log in as (support) session as the advisor with no confirmation.

## Screens
- **A (recommended):** modal over Email Campaigns. Who (name, email, firm), campaign (name, status, schedule, audience), note on parity and attribution, Cancel, View campaign without logging in, Continue.
- **B:** full-page confirm with alert details (Mailchimp and FC campaign ids) and a three-point explainer.
- **C:** lands in view only with a banner; "Log in as Jane Advisor" opens the same confirm.

## States (each direction)
Confirm; Continue → session started (red support strip, attributed); Cancel (no session; lands on Advisors list); View only (read only for an admin, no session); Missing campaign (no session, back to Advisors); Missing advisor (no session, back to Advisors). Loading: show the confirm shell with a spinner while the advisor and campaign are looked up.

## Copy (placeholders flagged)
- Title: "Log in as {advisor name}?"
- Note: "Log in as can do everything {first name} can. Anything you do is saved under {advisor name} and attributed to you ({admin name})."
- Buttons: Continue as {advisor name}; Cancel; View campaign without logging in.
- Final wording for the parity note is a placeholder for Alex. No legal or compliance copy has been invented.

## Rules
- The session starts only after Continue, enforced server-side or in the route handler. A bare deep link never starts it.
- Same permission model as today: full advisor parity with attribution. No weaker mode.
- Cancel and the error states start nothing.
- If View only is offered, it must not call the Log in as method. Confirm an admin can already read that campaign without impersonating.
- If any advisor search or list appears, cap it: limit, paging, field projection.

## In scope
The confirm step on the deep link, Cancel, View only (A, B), error states. Mobile at 390: stacked full-width buttons.
## Out of scope
Changing the alert email (at most a tiny copy tweak to say "you will be asked to confirm"), any change to Log in as permissions, Meteor/Mongo/Galaxy work.

## Mobile vs desktop
Desktop: modal (A), card (B). 390: the card fills the width, buttons stack, primary first on top is not required; order Continue, View, Cancel is acceptable.

## Agent-time estimate (real agent time)
- A: 1.5–3 agent hours build, plus 30–60 min FC Tester.
- B: 2–3.5 agent hours build, plus 30–60 min FC Tester.
- C: 3–5 agent hours build, plus 45–75 min FC Tester (needs a read-only campaign view).

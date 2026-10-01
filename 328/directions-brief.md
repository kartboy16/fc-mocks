# Directions brief · #328 Admin invite user social connect

**Recommend A.** Soft Dev hold · Idea track · not agent-ready.

**Alex AC:** Admin logged in as user → invite recipient **prefilled/locked** to that advisor (no search). OAuth still as that user’s login.

| Dir | Pattern | Why / tradeoff |
| --- | --- | --- |
| **A** | Invite from Social Settings | Natural home; admin-as-user autofill primary path; optional “different user…” search. Best default. |
| **B** | Firm Users row action | Impersonated row highlighted; invite opens prefilled. Good complement. |
| **C** | Guided checklist wizard | “Choose user” skipped when admin-as-user; lands on Channels. Strong multi-channel. |

Beats: Admin UI (autofill when impersonating) · Invite email · User OAuth (+ destination / success).  
Hard rule: user OAuth as themselves — Admin as user only prefills recipient (#237 is different).

Live: https://kartboy16.github.io/fc-mocks/328/

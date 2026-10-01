# Directions brief · #328 Admin invite user social connect

**Recommend A.** Soft Dev hold · Idea track · not agent-ready.

**Alex AC:** Admin logged in as user → invite recipient **locked** to that advisor only (no different-user / search / Change user). OAuth still as that user’s login.

| Dir | Pattern | Why / tradeoff |
| --- | --- | --- |
| **A** | Invite from Social Settings | Natural home; admin-as-user locked recipient only. Best default. |
| **B** | Firm Users row action | Impersonated row highlighted; invite locked to that user. Good complement. |
| **C** | Guided checklist wizard | “Choose user” locked when admin-as-user; no Change user; lands on Channels. Strong multi-channel. |

Beats: Admin UI (locked recipient when impersonating) · Invite email · User OAuth (+ destination / success).  
Hard rule: user OAuth as themselves — Admin as user locks recipient (#237 is different).

Live: https://kartboy16.github.io/fc-mocks/328/

# Build contract · #328 Admin invite user social connect

**PROVISIONAL** — Recommend Direction A. Soft Dev hold · Idea / playground · **not agent-ready**.

## Recommend
**A — Invite from Social Media → Settings** (“Invite user to connect”).

## Hard rule
User OAuth as **themselves** (their Meta/LI/IG login — not the admin’s). FC “Admin as user” only **locks** the recipient; it does not OAuth as the admin. Do **not** conflate with [#237](https://github.com/kartboy16/content-library/issues/237) admin reconnect teaching.

## One-liner
Admins invite an advisor by email to add Facebook / LinkedIn / Instagram with the user’s own login, then attach Page/destination to the company on FC.

## Admin-as-user AC (Alex · mandatory)
- Top chrome: **Admin as user · [User · Firm]** pill.
- While impersonating → Invite recipient is **locked** to that advisor (name + email); **no alternate-user picker** in that mode.
- Do **not** offer “Invite a different user…” / search / Change user while Admin as user.
- Copy: OAuth still runs as **that user**, not the admin’s Meta account.
- B: same — invite from admin-as-user is locked to that user (other-row invite disabled while impersonating).
- C: “Choose user” pre-completed and locked; no “Change user” in impersonation path; land on Channels.

## Entry points
| Entry | Dir |
| --- | --- |
| Social Settings → Invite user to connect (locked recipient when admin-as-user) | **A** (rec) |
| Firm Users row → Invite social connect (locked when admin-as-user) | B |
| Wizard: User (locked if impersonating) → Channels → Preview → Send | C |

## Beats
1. Admin — recipient (locked when impersonating) + channels (FB/LI/IG) + optional note → send  
2. Email — own-login copy + CTA  
3. User — signed in as themselves → OAuth → destination → success  

## Out of scope
content-library app code · waking Soft Dev · agent-ready · real tokens/PII · #237 scope

## Live
https://kartboy16.github.io/fc-mocks/328/

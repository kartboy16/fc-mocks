# #880 Bulk upload social posts by CSV (like AFA)

**Status:** Published on GitHub Pages. Not agent-ready. Soft Dev hold until a direction is picked. No build launched.

## Sources (read-only)
- Issue #880 (staging track, basic enhancement, Designer-first)
- Live FC Social Media hub (`SocialMediaHub.jsx`): tabs Post now, Build my calendar, Ready-made posts, Your posts, and admin-only Post for multiple advisors. Scheduled posts already land in `SocialPostHistory` / the content calendar and can be edited or deleted one by one (`ScheduledPostEditDialog`).
- AFA reference described in the issue: Social Media Manager → Template Posts → + → Upload CSV of Posts, with columns `message` / `imageURL` / `sendDate` (YYYY-MM-DD), Download Sample CSV, connected-profile checkboxes, and an audience choice of “For all advisors / For [advisor] only”.

## Recommendation
**A. This advisor only, skip bad rows.** Put **Upload CSV** on Social Media → Your posts (the closest FC equivalent of AFA’s Template Posts list). The advisor, or an admin acting as that advisor, uploads a CSV, picks that advisor’s connected profiles, previews every row, and schedules the valid ones in one click. Flagged rows (missing message, invalid or past date, image URL that will not load) are skipped and counted in the success message. Created posts appear in the normal Your posts list and can be edited or deleted one by one. Nothing posts live during the upload.

B is the same advisor-only scope, but Schedule stays off until every flagged row is fixed or removed. Use B if skipped rows would be too easy to miss on a ~60-row calendar. It adds inline fix/remove work and a little more agent time.

C adds AFA’s audience choice for admins only (“Jane Advisor only” vs “All advisors with a connected profile”) and a confirmation before a firm-wide queue. Advisors uploading their own CSV never see that step. C is the right comparison if the team wants that AFA control, but it should not be the first slice.

## All-advisors answer
**Do not add AFA’s “For all advisors / For [advisor] only” choice in this slice.**

1. FC Social Media is already advisor-scoped. The user is inside Jane Advisor’s hub (or an admin is acting as Jane Advisor) and sees Jane’s connected profiles. The CSV is a calendar for that advisor’s voice and networks.
2. AFA’s Template Posts sit at a firm/template layer, so “for all advisors” fits that product. FC scheduled posts are per-advisor queue items tied to that advisor’s LinkedIn / Facebook / Instagram accounts. Fanning one CSV to every advisor would publish the same captions and image URLs across many people’s networks — often the wrong voice — and is a high-risk bulk action.
3. FC already has a separate admin path for one post to many advisors: Social Media → Post for multiple advisors. Repeating an upload per advisor, or a later dedicated copy tool, is safer than a radio on a 60-row calendar upload.
4. If a firm later wants one calendar copied to many advisors, that should be its own admin tool (per-advisor profile matching, skip advisors with no connected network, confirm advisor and destination counts). Direction C mocks that choice so it can be compared, not so it ships first.

## Screens
| Screen | Facing | Notes |
| --- | --- | --- |
| Your posts list + Upload CSV | Advisor, or admin acting as an advisor | Entry point. Existing scheduled and posted cards stay as they are. |
| Upload CSV modal | Same | Required columns, Download Sample CSV, file picker, date-only default time note. |
| Choose profiles | Same | Checkboxes for connected profiles only (LinkedIn personal, LinkedIn company, Facebook page in the fixture). Instagram omitted because it is not connected. |
| Audience (C only, admin) | Admin | Jane Advisor only, or all advisors with a connected profile. Hidden for advisors. |
| Preview | Same | One card per row: date, image, text. Bad rows flagged. A/C allow Schedule with a skip count. B disables Schedule until fixes/removals. |
| Confirm (C, all advisors) | Admin | Advisor count, destination count, skipped-row count, not-live-until-send-date warning. |
| Success + Your posts | Same | Accurate scheduled and skipped counts. New posts at the top of the normal list, editable and deletable one by one. |
| Edit / Delete | Same | Reuses the existing scheduled-post editor and delete confirm. One post only. |

## States
- List: existing scheduled and posted posts, Upload CSV available.
- Empty list: no social posts yet; Upload CSV still available.
- Upload: file chosen (sample-social-calendar.csv, 11 rows).
- Empty CSV: file reads but has no rows; Continue is not the next action.
- File error: unreadable file or missing required columns; retry / replace file.
- Reading: parsing rows and checking image URLs.
- Profiles: all connected profiles selected by default; Continue disabled if none selected.
- No connected profiles: message to connect an account in Settings; upload is blocked.
- Audience (C): this advisor vs all advisors.
- Preview: 8 valid rows, 3 flagged (missing message, past date, image URL will not load).
- Preview after fixes (B): Schedule enabled once flagged rows are fixed or removed.
- Confirm (C, all advisors).
- Scheduling (loading).
- Schedule error: nothing was added; try again.
- Success: “8 posts scheduled, 3 skipped” (or C all-advisors: “8 posts scheduled for 12 advisors, 3 rows skipped”).
- Edit saved / delete confirmed, one post only.

## Copy
- Button: “Upload CSV”
- Modal title: “Upload CSV of posts”
- Columns: message — “The post text”; imageURL — “A public image URL for the post”; sendDate — “The day to publish, as YYYY-MM-DD”
- “Each sendDate is a calendar day. Posts are scheduled for 9:00 AM Pacific on that day. Nothing is published to your networks until then.”
- “Download Sample CSV”
- Profiles: “These posts will go to the profiles you select. Only Jane Advisor’s connected profiles are listed.”
- “Instagram is not connected, so it is not listed. Connect it in Settings to include it next time.”
- “Connect a LinkedIn, Facebook, or Instagram account in Settings before you upload a CSV.”
- Flags: “Missing message — this row will be skipped.” / “This date is in the past — this row will be skipped.” / “The image URL didn’t load — this row will be skipped.” (B uses “Needs a fix” and offers Add a message / Use a future date / Use a replacement image / Remove row.)
- Schedule: “Schedule 8 posts (3 skipped)” (A); disabled until clean (B); “Schedule 8 posts for 12 advisors (3 skipped)” then confirm (C).
- Success: “8 posts scheduled, 3 skipped. They are on Jane Advisor’s calendar and will publish at 9:00 AM Pacific on each send date. Nothing has been published yet.”
- Edit: “This is the same editor used for a post you scheduled by hand. Changes apply to this post only.”
- Delete: “This post will be removed from Jane Advisor’s calendar and will not be published. Other posts from this upload are not affected.”
- Errors: “We couldn’t read that file. Use a CSV with the columns message, imageURL, and sendDate (YYYY-MM-DD).” / “This file has no rows to schedule.” / “Scheduling stopped. No posts were added. Try again.”

No estimates or explainer prose in the mock UI. Sample post copy is generic and is not advice.

## In / out of scope
**In:** Upload CSV from Your posts; required columns and sample CSV; connected-profile checkboxes; preview with flagged bad rows; one Schedule action with accurate scheduled/skipped counts; posts land in the existing scheduled social list; per-post edit and delete; advisor-only scope (A/B) or admin all-advisors option (C); acting-as for an admin; default 9:00 AM Pacific on a date-only sendDate; nothing posts live during upload; generic fixtures only; staging first.
**Out of scope:** Live publishing during upload; posting to networks that are not connected; a time-of-day column (open question); rewriting captions in the advisor’s voice; media-library image pick on first slice (URLs only); Instagram if it is not connected; changing Post for multiple advisors; website or email campaigns; client-facing product branding or product-domain links.

High risk (bulk scheduling to social). Playground / staging first, then FC Tester on designated test accounts only. Staging verification must not publish to live social profiles. Only Alex merges to main. No build launched.

## Desktop vs mobile
1280: sidebar + Social Media tabs, post card grid, 640–780px centered modal, preview scrolls inside the dialog.
390: stacked nav, full-width modal, 44px actions, preview cards stack the thumbnail above the text, tabs scroll horizontally.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A (recommended) | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 9–14 | 10–16 | 14–22 |
| FC Tester (upload happy path, sample CSV, profile pick, bad-row flags, scheduled/skipped counts, posts appear in Your posts, edit and delete one by one, nothing posts live, empty / file error / no profiles / schedule error, 1280/390, acting-as) | 4–7 | 5–8 | 6–10 |
| Fix loop | 3–6 | 3–6 | 4–6 |
| **Total** | **16–27 h** | **18–30 h** | **24–38 h** |

C is higher because of per-advisor profile matching, the confirmation, partial fan-out, and a broader test matrix. All three are high risk (bulk social). Staging first. No build launched.

## Open questions
1. Is 9:00 AM Pacific the right default for a date-only `sendDate`, or should the CSV accept a time later?
2. Past dates: skip the row (as in A), block the file, or let an admin force a same-day schedule?
3. If an image URL will not load, is skipping the whole row right (A), or may that row be scheduled without an image?
4. Size limits: max rows per file (AFA often uploads ~60), max message length per network, max image size?
5. Time zone: always Pacific, or the advisor’s local time?
6. May an assistant or non-admin staff upload, or only the advisor and an admin acting as that advisor?
7. If A is picked, should Post now also get a secondary Upload CSV action, or is Your posts enough?
8. Duplicate send dates: allow several posts on the same day (as mocked), or warn?
9. Should scheduled-from-CSV posts be tagged in Your posts, or look identical to hand-scheduled posts (as mocked)?

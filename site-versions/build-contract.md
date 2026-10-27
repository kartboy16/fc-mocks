# Site versions: go back to an earlier version of your website, build contract

Related: [#601](https://github.com/kartboy16/content-library/issues/601) (AI website builder, "one-click rollback to any earlier version"). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

Advisor-facing, inside the advisor's FC account. It's modelled on a hosting "versions" list, written for a non-technical advisor in an emergency.

## Recommendation: A, a versions table in Website › Versions

**[A](a-versions-table.html)** is a table in Website › Versions, one row per Live release, with "Restore this version" on each row. It works like a hosting versions list, holds a long history, and every row is one click from the confirm step. **[B](b-timeline.html)** is a card timeline with a big "Something wrong with your live site? Go back to an earlier version" card at the top. B's card is friendlier in a panic, but it adds a second way to do the same thing. Suggestion: ship A, and borrow B's card as a one-line link above the table if Alex wants an obvious emergency entry.

## Screens and states (`?st=`, plus `?phone`)

| State | What shows |
|---|---|
| `list` | Rows: went live (date and time PT), release title ("Release: mobile fixes"), who released it, a **Current** badge on the live one, **View**, and **Restore this version** (not on the Current row). Only this advisor's site. The last 5 show, with "Show older" below. |
| `loading` | Skeleton rows: "Loading your versions…" |
| `error` | "We couldn't load your versions. Your website isn't affected." with Try again. |
| `empty` | "No versions yet. Each time you release your site from Preview to Live, it shows up here." |
| `confirm` | A dialog (copy below). |
| `progress` | 4 steps with ticks and spinner. "You can close this window. We'll keep going, and email you when it's done." |
| `done` | "**Live is now on the Oct 20 version**", "We saved a backup first, and your forms and pages passed their checks.", **View site ↗**, and the Behind note. |
| `failed` | Step 3 shows ✗, then "**Your live site is unchanged.**", then what to do next: try again, try another version, FTT has been told, and the support email. Buttons: Try again and Close. |
| `behind` | An orange banner: "Your live site is on an older version (Oct 20). Your next release from Preview will replace this. Fix the issue on Preview first, then release again." Newer rows show "Not live", and Current moves to Oct 20. |

The mock's Checks pass / Checks fail toggle drives a real click-through.

**View** opens a read-only screenshot of the home page taken when that version went live. Looking changes nothing.

### Confirm copy (no technical words)

> **Go back to the Oct 20 version?**
> Your live website, janeadvisor-example.com, will go back to how it was on Oct 20, 2026 at 11:05 AM PT.
> **These releases will come off your live site:** Release: mobile fixes (Oct 27), Release: new team page (Oct 24). *They aren't deleted. Your Preview site still has them.*
> - We save a backup of your live site first.
> - Then we check your forms and pages. If a check fails, your live site stays as it is now.
> - It usually takes a few minutes.
>
> [Cancel] **[Go back to the Oct 20 version]**

If Live is already on an older version and you pick a newer row, the title is "Put the Oct 27 version back live?" and the list reads "will come back".

**Progress steps:**
1. Saving a backup of your live site
2. Putting the older version live
3. Checking your forms and pages
4. Refreshing your site so visitors see it

The forms wording in the confirm step is a **placeholder** to confirm with FTT. No legal or compliance copy is invented here.

## In and out of scope

- **In:**
  - The Versions tab (list, View screenshot, Restore).
  - The confirm, progress, success and failure screens.
  - The Behind banner, which also shows on Website › Settings while live is behind.
  - The email to the advisor when it's done, and a note to FTT staff.
  - The audit log, and a lock so only one restore or release runs at a time.
- **Out:**
  - Editing the site.
  - The Preview → Live release flow itself.
  - Picking individual pages to restore.
  - Restoring form submissions or analytics.
  - Sites FC doesn't host from a repo (static sites the advisor hosts elsewhere).

## Mobile

- Rows become stacked cards: date and Current badge on top, then the title and "Released by", then full-width View and Restore.
- Dialog buttons fill the width.
- In B, the emergency card stacks with a full-width button.

## Build note (mechanism; none of these words appear in the UI)

- **What a version is:**
  - Each Live release merges preview into `main` in the advisor's GitHub repo. That triggers the **"Deploy to Live"** workflow: a backup zip of the site files, deploy, form and smoke checks, then a cache purge.
  - FC lists **successful** "Deploy to Live" runs for that repo (GitHub Actions API: workflow runs on `main`, `conclusion=success`), each with its commit SHA, time and actor.
  - The title comes from the merge/PR title ("Release: …"). "Released by" maps the GitHub actor to an FC user, or shows "FTT support" for staff and bots.
- **Restore this version:**
  - Re-run the same deploy for the older SHA. The preferred way is `workflow_dispatch` with an input `ref=<sha>`, so the backup, checks and purge all run.
  - Don't rewrite `main`. Live is then "behind": `main` is ahead of what's deployed.
  - The next normal release redeploys `main`, which is why the Behind banner says to fix it on Preview first.
  - Store `liveSha` per site so FC knows which row is Current.
- **Checks fail:** the workflow must leave Live as it was, either by deploying to a temporary slot and swapping on success, or by restoring the backup zip automatically. The UI's "Your live site is unchanged" depends on this, so confirm the workflow supports it before building.
- **Lock:** one deploy at a time per site. Use a GitHub Actions `concurrency` group in the workflow, plus an FC-side lock that disables Restore and Release while a run is going ("A change is in progress…").
- **Status:** FC polls the run, or listens for a `workflow_run` webhook, and maps the job steps to the 4 UI steps.
- **Screenshots for View:** capture the home page after each successful deploy (the smoke-check step can do it) and store it with the run.
- **Permissions:** the GitHub App or token stays server-side. Advisors only see their own repo, and staff acting as an advisor are recorded as staff.
- **Audit log:** who restored, from which version to which, when (PT), IP, result and run id. Show it to FTT staff, and send the advisor an email.
- **Notifications:** email the advisor on done or failed, and post to an FTT staff channel on every restore. The channel is an open question. Mock only, nothing posted.

## Estimate

| Piece | Days |
|---|---|
| List successful Live runs, map titles and actors, `liveSha`, Current/Behind logic | 1.5–2 |
| Versions tab UI (table, phone cards, empty, loading, error, Show older) | 1–1.5 |
| Restore: dispatch with ref, lock, status polling or webhook, 4-step progress | 1.5–2 |
| Confirm, success and failure dialogs, Behind banner (Versions + Settings) | 0.75–1 |
| Workflow changes: `ref` input, keep Live unchanged on failure, concurrency, screenshot | 1–2 |
| Emails, FTT notice, audit log | 0.75–1 |
| QA on a test repo (restore, fail path, release after restore) | 1 |

**A** is about **7.5 to 10.5 days**. **B** is about the same, plus 0.5 day for the timeline and emergency card. Workflow work depends on what "Deploy to Live" already does.

## Open questions

1. Who may restore: the advisor only, the advisor plus their assistants, or FTT staff only? And should staff be able to do it on the advisor's behalf?
2. Is one confirm step enough, or should we ask them to type the date or the site name?
3. Who gets notified, and where: an FTT staff channel, email, or both? Should the advisor always get an email?
4. How far back can you go: the last 10 releases, 90 days, or everything? How long do we keep the backup zips?
5. Forms: what happens to form setup during the switch, and is anything form-related tied to a version (for example a form added after the target version)? Does the confirm step need to mention it? (The current copy is a placeholder.)
6. Cache: is the purge enough everywhere, including CDN and browser cache, or should the success message say "may take a few minutes to show"?
7. Lock: if a release is running, should Restore wait in a queue or be blocked? And the other way round?
8. Should a release from Preview while Live is behind show a warning ("This will replace the Oct 20 version you went back to")?
9. Should the audit log be visible to the advisor, or to staff only?
10. View: is a home-page screenshot enough, or do we want a full browsable copy of the older site?
11. If the checks fail, does the workflow keep Live unchanged today (temporary slot or automatic restore)? The UI depends on it.

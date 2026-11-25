# Cloudways backup and restore for FC-hosted advisor sites: build contract

Status: **Not agent-ready.** No GitHub issue yet. Alex picks a direction before any coding. Risk: **high** (it changes live advisor WordPress sites and uses the Cloudways account token), so Alex merges to main.

Mocks: https://kartboy16.github.io/fc-mocks/cloudways-backup/ · A `a-selfserve.html` · **B `b-request.html` (recommended)** · C `c-admin.html`. Scenes use `?s=<scene>`, and `&phone=1` gives the 390 view. Requested by Alex on Nov 25 2026. It replaces the generic backup idea.

## One site per backup and restore: technical notes (revisions Nov 25 2026, per Alex)
Every backup and restore in every direction is for **one advisor site** only. Advisors only ever see their own site, so advisor-facing copy never mentions other sites, the server or a "this site only" label (Alex, 2:37 PM PT: "why mention anything about other sites???"). Copy just says what happens to the advisor's site. Server and per-app details stay in these notes and in C's staff console; B's staff queue and review also show the server for each request.

FC calls only these one-app Cloudways API v2 endpoints. Each takes one `server_id` (to locate the app) plus one `app_id`, and acts on that one app:
| FC action | Endpoint (API v2, `https://api.cloudways.com/api/v2`) | Required fields | Scope |
|---|---|---|---|
| Restore one site | `POST /app/manage/restore` | `server_id`, `app_id`, `time`, `type` (`complete` / `web` / `database`) | One app |
| Back up one site (incl. the locked "Back up your site first") | `POST /app/manage/takeBackup` | `server_id`, `app_id` | One app |
| Undo the last restore of one site | `POST /app/manage/rollback` | `server_id`, `app_id` | One app |
| Poll progress | `GET /operation/{id}` | operation id | The one operation |

**No server-level restore endpoint is called.** Re-checked Nov 25 2026, 1:45 PM PT against the official Cloudways API v2 reference (https://developers.cloudways.com/docs/, spec file `https://developers.cloudways.com/api.yaml`, version 2.0.0): the spec has **no server-level restore endpoint at all**. The only restore-type endpoints are `POST /app/manage/restore` and `POST /app/manage/rollback` (both "Flexible - App Management", one app), plus the unrelated security-scan `POST /app/security/{app_id}/files/restore`. FC also does **not** call `POST /server/manage/backup` (server-wide on-demand backup) or `POST /server/manage/backupSettings`. These were removed from the mocks in this revision. The nightly automatic schedule stays configured by an admin in the hosting dashboard; C shows it in one small admin-only note.

## The problem in one sentence
Advisors whose WordPress site FTT hosts on Cloudways can't see when their site was last backed up or get it rolled back from FC, and staff have to go into the Cloudways dashboard by hand to do it.

## What Cloudways actually supports (checked Nov 25 2026)
Sources:
- **[S1]** the official Cloudways Platform API spec, `https://developers.cloudways.com/api.yaml` (OpenAPI 3, version 2.0.0, base `https://api.cloudways.com/api/v2`). It's the file behind https://developers.cloudways.com/docs/.
- **[S2]** Help Center, "How to Configure a Server-level Backup": https://support.cloudways.com/en/articles/5123324-how-to-configure-a-server-level-backup
- **[S3]** Help Center, "How to Do a Point-in-time Restore of Your Application": https://support.cloudways.com/en/articles/5123320-how-to-do-a-point-in-time-restore-of-your-application
- **[S4]** Help Center, "How to Backup a Specific Application": https://support.cloudways.com/en/articles/5123364-how-to-backup-a-specific-application
- **[S5]** Help Center, "How to Create and Manage Cloudways API Access Tokens": https://support.cloudways.com/en/articles/5136065-how-to-create-and-manage-cloudways-api-access-tokens
- **[S6]** https://developers.cloudways.com/v1/ (v1 end-of-life banner)

| Fact | Status | Source |
|---|---|---|
| Automatic backups are **server-level**: one job backs up every app (web files and database) on the server. | Confirmed | S2 |
| Schedule settings: `POST /server/manage/backupSettings` with `server_id`, `local_backups` (required), `backup_frequency` (`1h`, `3h`, `6h`, `12h`, `1`–`7` days), `backup_retention` (enum 8, 15, 22, 29), and `backup_time` (`HH:MM`, UTC). `GET /backup-frequencies` lists the options. | Confirmed | S1, S2 |
| The default is daily, sometime between 1 and 5 AM UTC, kept for 1 week. Retention can be 1 to 4 weeks, and times are in UTC. | Confirmed | S2 |
| On-demand **server** backup: `POST /server/manage/backup` with `server_id`. It returns `operation_id`, and it doesn't change the schedule. | Confirmed | S1, S2 |
| On-demand **single-app** backup: `POST /app/manage/takeBackup` with `server_id` and `app_id`. It returns `operation_id` and covers only that app's `public_html`, `private_html` and database. | Confirmed | S1, S4 |
| Restore is **per app** to a point in time: `POST /app/manage/restore` with `server_id`, `app_id`, `time` ("Timestamp of restore point") and `type` (`complete`, `web` or `database`). It returns `operation_id`. | Confirmed | S1, S3 |
| A restore can be **files only** (`web`) or **database only** (`database`). | Confirmed | S1, S3 |
| Cloudways backs the site up **right before** a restore. `POST /app/manage/rollback` (`server_id`, `app_id`) undoes the **last** restore only. That pre-restore backup is deleted automatically after 24 hours, or right away with `DELETE /app/manage/backup`. | Confirmed | S1, S3 |
| There's **no "back up first" flag** on `/app/manage/restore`. FC's locked "fresh backup first" step is a separate `takeBackup` that FC runs and waits on before it restores. | Confirmed (no flag in spec) | S1 |
| Everything is **async**. Poll `GET /operation/{id}`, which returns `is_completed` (0 in progress, 1 completed, -1 failed), `message` and `estimated_time_remaining`. | Confirmed | S1 |
| `GET /app/manage/backup` (`server_id`, `app_id`) is documented as "Get Application Backup operation status". It **isn't a list of restore points**. | Confirmed | S1 |
| **Listing an app's restore points (date and time)**: no public endpoint found in the v2 spec. The Cloudways dashboard shows a "Restore Point" dropdown (S3), but the API that feeds it isn't documented. | **Gap: open question Q1** | S1, S3 |
| Restore needs about **2.5× the app's size in free disk** on the server. Time depends on data size. | Confirmed | S3 |
| Hourly or 3-hour schedules can overload a server and cause skipped backups. For servers over 100 GB, use 12 hours or more. | Confirmed | S2 |
| `GET /server` returns `backup_frequency` and `local_backups` per server. Retention and `backup_time` don't appear in the example response. | Partly confirmed | S1 |
| API rate limit of 100 requests a minute. | **Unconfirmed**: not in the spec or the articles above. Only a third-party guide states it. Design for polling every 15–30 s with backoff. | none |
| API v1 reached end of life on Mar 31 2026, and the legacy API key reaches end of life on **Oct 15 2026** (replaced by Access Tokens). | Confirmed | S5, S6 |

### Prerequisite found in the code
On `main` today, `imports/api/cloudwaysApi.js` still calls `https://api.cloudways.com/api/v1/...` and authenticates with the legacy email plus `secret_key` API key, and both are past Cloudways' end-of-life dates (S5, S6). The backups feature has to sit on **v2 plus an Access Token**. Treat that migration as its own `risk:high` task first (estimate below). If live calls are still working, Cloudways may still be honouring v1 for now, and that isn't safe to depend on.

## What a backup covers (and doesn't)
**Covered** (on the Cloudways server, S2 and S4): the site's `public_html` and `private_html` folders and its database. For the advisor that means pages, posts, the news page and the posts FC published to it, the media library, plugins, themes, WordPress settings and users.

**Not covered**, because it lives in FC's own database rather than on the WordPress server (checked in the code: `imports/collections/email_contacts.js`, `email_lists.js`, `email_campaigns.js`, `ses_*`, `html_posts.js`, `website_post_queue.js`, `social_post_queue.js`):
- the FC content library and post history
- email contacts, lists and campaigns
- social posts and connections
- the FC account and settings
- the domain or DNS and email mailboxes, which sit with the advisor's domain provider

FC publishes to WordPress over the REST API (`server/website-publisher/adapters/wordpress.js`, `/wp-json/wp/v2/posts`) and stores each `remotePostId` in `website_post_queue`. After a restore, posts published after the restore point are gone from WordPress, while FC still has their `remotePostId`.

## Directions
| | A. Advisor self-serve | **B. Request, then staff run it (recommended)** | C. Admin console only |
|---|---|---|---|
| Advisor sees list, schedule and retention | ✓ | ✓ | ✓ (read-only) |
| Advisor "Back up now" (`takeBackup`, 1 per 6 h) | ✓ | ✓ | — |
| Advisor restore | Runs it | Sends a request | Contacts support |
| Who picks the restore type (this site's files and database, files only, database only) | Staff only, advisor gets files and database | Staff, in the queue review | Staff |
| Nightly schedule | Admin, in the hosting dashboard (not FC) | same | same, shown in an admin-only note |
| Staff surface | Console | Console plus **Restore requests queue** (like the #727 Website setup queue) | Console |

**Recommendation: B.** A restore rewrites a live WordPress database that also holds FC's own connection (users and application passwords). It needs a disk-space check on the hosting server, Cloudways keeps only one 24-hour rollback slot, and today every Cloudways method in FC is admin-only (`isAdminUserId`, #523 lockdown). B gives advisors the safe self-serve part (seeing backups, backing up their own site) and routes the risky step through a person, using the same queue pattern as #727. A can follow later once restores have run cleanly for a while. C is the cheapest, but it gives advisors little.

**Backup now decision:** FC only offers the advisor "Back up now", which calls `POST /app/manage/takeBackup` and backs up only that one app (S4). FC has no button that backs up more than one site.

## Screens and states (scene keys)
| Scene | A | B | C | What it shows |
|---|---|---|---|---|
| `tab` | ✓ | ✓ | ✓ | Website › **Backups** tab (NEW): last backup, next automatic backup, kept for 2 weeks, a short "We back up your site automatically every night" line, list (8 shown, Show older, newest first), times labelled PT. |
| `covers` | ✓ | ✓ | ✓ | "What's in a backup?" dialog with the included and not-included lists. |
| `bk-confirm` / `bk-progress` / `bk-done` / `bk-failed` / `bk-limit` | ✓ | ✓ | — | The site-only on-demand backup: confirm, running (steps, can leave the page), saved (new row on top), failed (nothing changed, Try again), and the 6-hour limit with the next available time. |
| `pick` → `preview` → `confirm` | ✓ | ✓ | staff `s-pick`/`s-preview`/`s-confirm` | 3 steps: pick a restore point (radios, PT, staff also see UTC). What will change: "Your site's pages, posts and settings go back to how they were on {date}. Changes made since then will be lost.", form entries and comments are lost, WP users roll back, and the 3 FC news posts since then will be re-sent. Then confirm: "Take a fresh backup of this site first" checked and **locked**, and the button stays disabled until the advisor types `example-advisor.ca`. |
| `requested` | | ✓ | | Advisor banner: Restore requested, Waiting for support, Cancel request. Request button disabled (one open request per site). |
| `queue` / `review` | | ✓ | | Staff queue (filters, 25 per page, search). Review: request details, advisor's note, checks (restore point still kept, free space ≥ 2.5× site size, no other restore running), restore type select, locked fresh backup, typed site address, Run restore or Decline with a note. |
| `progress` / `run-progress` | ✓ | ✓ | ✓ | Steps: fresh backup saved, (staff) space check, restoring files and database, checking the FC connection, re-sending 3 news posts. |
| `done` / `run-done` / `adv-done` | ✓ | ✓ | ✓ | Restored to the chosen time, connection OK, posts re-sent, fresh backup kept, **Undo until +24 h**. |
| `failed` | ✓ | ✓ | ✓ | Didn't finish (example: out of disk space). The fresh backup is safe. Advisor: support alerted. Staff: Retry or Undo. |
| `rollback` / `rolledback` | ✓ | ✓ | ✓ | Undo confirm (last restore only, 24 h window), then done. |
| `staff` | ✓ | ✓ | ✓ | Staff console: sites table (25 per page) with Open. C only: server chips (Server 1–4, Canada) to choose which server's sites to list, "Sites on Server 3", UTC times, and one small admin-only note about the nightly schedule. |
| `site` | | | ✓ | Staff view of one site's backups, with UTC. |
| `roles` | ✓ | ✓ | ✓ | Permissions table for that direction. |
| `host` | ✓ | ✓ | ✓ | Connected-only site (not on FTT Cloudways): "Backups are managed by your host." |

## Key copy
- Explainer: "We back up your site automatically every night. You can also back it up any time with Back up now."
- Covers: "Included: your WordPress site … Not included: things kept in FC … Backing up or restoring your website doesn't change them."
- Preview: "Your site's pages, posts and settings go back to how they were on {date}. Changes made since then will be lost."
- Buttons: "Back up now", "Restore…" (A) / "Request a restore" (B) / "Contact support to restore" (C), row action "Restore this backup" (A) / "Request a restore" (B), confirm "Restore this backup" (A) / "Request a restore" (B), "Undo restore". Staff: "Run restore".
- Locked checkbox: "Back up your site first · Always on · So you can go back to how the site is right now if the restore isn't what you wanted."
- Typed confirm: "To confirm, type example-advisor.ca". Mismatch: "That doesn't match. Type example-advisor.ca exactly."
- Undo: "You can undo this restore until {time + 24 h}. Undo puts the site back exactly as it was at {fresh backup time}."
- Not hosted: "Backups are managed by your host. … it's hosted somewhere else, so we can't see or restore its backups."
- There's no legal copy. Every time is shown in America/Vancouver and labelled **PT**. Staff screens add UTC for matching the Cloudways dashboard.

## Cloudways API mapping
| FC action | Cloudways call | Notes |
|---|---|---|
| Find the site's server and app | FC `advisorWebsites.selectedServer` + `appId`, checked against `GET /server` (apps per server) | No `appId` means the site is connected only, so show the `host` empty state. |
| Show "next automatic backup" | `GET /server` (`backup_frequency`, read-only) + FC config for time and retention | Read-only. GET doesn't return retention or time (S1). |
| Back up now | `POST /app/manage/takeBackup` → poll `GET /operation/{id}` | FC enforces 1 per 6 h per site (FC policy). |
| List restore points | **Not in public API.** See Q1. | Fallback: FC logs every backup it starts (operation done time) plus the scheduled run times it can derive. |
| Back up your site first | `POST /app/manage/takeBackup` → wait for `is_completed=1` | Always on, can't be skipped. If it fails, the restore doesn't start. |
| Restore | `POST /app/manage/restore` (`time`, `type=complete` by default; staff can pick `web` or `database`) → poll | The `time` format must match what Cloudways returns for restore points (Q1). |
| Undo | `POST /app/manage/rollback` → poll | Only the last restore, within 24 h (S3). |
| Discard the pre-restore copy | `DELETE /app/manage/backup` | Optional. Cloudways removes it after 24 h anyway (S3). Not shown in the mocks. |
| After restore | FC: check the WP connection (#727), then re-send the `website_post_queue` items published after `time` | Assumption: see A3. |

## Permissions
- **Advisor (B):** sees the list and schedule, backs up their own site (1 per 6 h), requests a restore, asks for an undo.
- **Support:** everything in the queue, plus running restores and undo on any FC-hosted site, and choosing the restore type. No schedule changes.
- **Admin:** everything support can do. The nightly schedule and retention are changed in the hosting dashboard, not in FC.
- **Log in as** (full advisor parity, Nov 21): staff get the advisor's rights in a session, recorded as "Sam Support (as Jane Advisor)".
- Every Cloudways call stays on the server side behind the existing admin check (#523). Advisor actions go through narrow FC methods that only act on the caller's own `appId`.
- Audit log: who, site, server, operation id, restore time, type, and result.

## In scope
The Backups tab, on-demand site backup, restore wizard and request, staff queue and console, undo, the connected-only empty state, emails to the advisor before and after a restore (plain, no legal copy), post re-send after a restore, and the audit log.

## Out of scope
Any server-level backup or restore from FC (`/server/manage/backup`, `/server/manage/backupSettings`), downloading backups, local backups (`local_backups`), off-Cloudways or SnapShooter storage, staging-app restores, offboarding backups (#165), the AI builder's Git-based versions (#601), and backing up FC-side data.

## Mobile (390)
The rail collapses to a top bar. The backups table becomes one column with the type and who started it under the date. Dialogs go full screen. Buttons stack and are at least 44 px tall. The typed-confirm input is full width. The staff queue keeps Site, Status and Review.

## Assumptions (to confirm)
- **A1** FTT's schedule is daily at about 2:00 AM PT, kept 2 weeks, on Servers 1–4. These are mock values.
- **A2** The 6-hour limit on site-only backups is an FC policy, not a Cloudways one.
- **A3** After a restore, FC re-sends the news posts published after the restore time, and re-checks the WordPress connection, because restoring the database can revert WP users and application passwords.
- **A4** What happens to the site when a restore fails partway (it may be left half restored). Rollback to the fresh backup is the recovery path.
- **A6** The FC app sends the advisor emails, and nothing is shown to the advisor's clients. No financial-content domain links appear on any client-facing page.

## Open questions
- **Q1** How do we list restore points by API? Ask Cloudways support whether there's a supported endpoint behind the dashboard's Restore Point dropdown, and what format `time` takes. Without one, FC can list only the backups it started plus the derived schedule times, which might not match Cloudways exactly.
- **Q2** Retention: keep 1 week (the default) or move to 2 weeks? Retention is billed by off-site storage.
- **Q3** In B, can an advisor undo on their own within the 24 hours, or does that also go to support?
- **Q4** Should advisors ever see "Files only" or "Database only", or keep those staff-only?
- **Q5** Who gets alerted when a restore fails: the support inbox, Slack via Chief of Staff, or both?
- **Q6** Do the v2 and Access Token migration first as its own task? (Recommended.)

## Estimates (real agent hours: cloud agent build + FC Tester + fix loop)
| Direction | Build | FC Tester | Fix loop | Total |
|---|---|---|---|---|
| A. Advisor self-serve | 10–15 h | 1.5–2.5 h | 1.5–3 h | **13–20.5 h** |
| **B. Request + staff queue (recommended)** | 13–19 h | 2–3 h | 2–3.5 h | **17–25.5 h** |
| C. Admin console only | 8–12 h | 1.5–2 h | 1–2 h | **10.5–16 h** |
| Prerequisite: move `cloudwaysApi.js` to API v2 + Access Token | 3–5 h | 1 h | 0.5–1.5 h | **4.5–7.5 h** |

These assume Q1 is answered. If FC has to build its own restore-point log, add 2–3 h to any direction.

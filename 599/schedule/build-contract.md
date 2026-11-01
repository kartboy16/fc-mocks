# #599 Weekly picks: pick the send schedule (build contract)

Ask (Alex via CoS, Nov 1, 12:39 AM PT): "Can I also have a way to pick the recurring date the email goes out? Mock it first."

Mocks: [hub](index.html) · [A. Default or custom](a-default-custom.html) (**recommended**) · [B. One-line schedule](b-sentence.html) · [C. Day and time only](c-weekly-only.html) · [Today](today.html)

> **Not agent-ready. Soft Dev hold until Alex picks.**

## Today (PR #753 head `40b4378`, read only)

- **Scheduler:** `server/weekly-picks-scheduler.js` runs node-cron `0 5 * * 1` (Galaxy TZ is America/Los_Angeles, so Monday 5:00 AM PT). It takes a scheduler lock (`weekly-picks-monday-slate`, 50 min) and calls `buildMondaySlate({ sendEmails: true, allowAllOptedIn: true })`. That one job builds every opted-in advisor's slate (`rebuildAdvisorPick`, `advisor_weekly_picks` unique `{advisorId, weekOf}`, `weekOf` = `weekOfMondayKey`) **and** sends each email (`sendWeeklyPicksEmailForAdvisor`).
- **Duplicate guard:** `sendWeeklyPicksEmailForAdvisor` skips when the advisor's slate for `weekOf` already has `emailSentAt` (`already-sent`). It also skips when there's no slate (`no-slate`) or no items.
- **Drawer:** `imports/ui/admin/WeeklyPicksMapSettingsDrawer.jsx`, opened from the ⚙ "Approvals and weekly picks" icon on each MAP row (`ManageAdvisorPosts.jsx`). It's 400 px wide, or 100vw on phones. It contains "{name} · Settings", "Approvals and weekly picks", the **Send approval emails to** field, and `WeeklyPicksEmailSettings`: the switch "Email weekly picks to approval recipients" plus "Goes to [chips] every Monday." or a warning when there are no recipients. Every change saves straight away through `updateAdvisorPreferences` (fields `sendTestEmailsTo`, `emailWeeklyPicks`; the allowlist is in `advisor_preferences.js`).
- **Global settings:** there is **no** global or admin settings store for weekly picks. The only "global default" is the hard-coded cron. Time helpers live in `imports/utils/advisorDateTime.js` (`ADVISOR_TIME_ZONE = 'America/Vancouver'`, `datetimeLocalInTimeZoneToDate`).

## Decision: global default + optional per-advisor override (both)

The drawer is per advisor, and the cron is already a single global rule. So:

1. **Global default.** It starts as **Every Monday, 5:00 AM PT**, the same as today, so nothing changes on merge. It's stored in one settings doc and edited in a small **Weekly picks defaults** drawer opened from the MAP toolbar (admin only).
2. **Per-advisor override.** It's optional and set in the advisor's drawer. Advisors on the default follow it when the default changes; custom advisors don't.

C skips both: there's no global doc (the default stays in code) and no cadence.

## Directions

All three sit in the existing drawer, right under the switch, and save on change like the rest of the drawer. The "Goes to … every Monday." line becomes dynamic, for example "Goes to [chips] every Thursday at 7:30 AM PT."

| | A. Default or custom (recommended) | B. One-line schedule | C. Day and time only |
|---|---|---|---|
| Layout | Two options: **Use the default** (shows "Every Monday, 5:00 AM PT") / **Custom for Jane Advisor**. Custom shows Repeats (Weekly / Every 2 weeks / Monthly), Day buttons Mo–Su (or the monthly rule), Time (15-min steps) and Time zone (PT default) | One sentence: "Send [every week] on [Monday] at [5:00 AM] [PT]". Badge **Default**; any change flips it to **Custom** + **Reset to default** | Day buttons + Time (Pacific) only, weekly only. "Reset to Monday 5:00 AM" when changed |
| Monthly | "A day of the week" (First…Fourth/Last + weekday) or "A date" (Day 1–28) | "on [the first] [Monday]" or "on [day 1]" | n/a |
| Default vs override | Explicit, so it can't be overridden by accident | Implicit: the first edit overrides | Override only; the default is in code |
| Defaults drawer | Yes | Yes | No |
| Next send line | Yes, + "then …" and the PT time when another zone is chosen | Same | Same |

## States (switcher `st`, `v`)

| State | What shows |
|---|---|
| Default (inherited) | A: "Use the default" selected. B: **Default** badge. "Next send: Mon Nov 9, 5:00 AM PT", then Mon Nov 16 (mock today is Tue Nov 3) |
| Custom weekly | Thursday 7:30 AM PT. "Next send: Thu Nov 5, 7:30 AM PT". B: **Custom** + Reset to default |
| Custom monthly (other zone) | First Monday, 8:00 AM ET. "Next send: Mon Dec 7, 8:00 AM ET (Mon Dec 7, 5:00 AM PT)" |
| Toggle off | The schedule section is dimmed and disabled, and the values are kept. "No weekly picks emails. Schedule kept for when it's turned back on." |
| No recipients | The existing warning "⚠ Add an approval email above…". The schedule still shows |
| Defaults drawer (A, B) | "Default send schedule. Used by 38 advisors. 2 have a custom schedule." Full form, Next send, and **Save default**. This saves explicitly because it moves many advisors at once; the toast says "Next send updated for 38 advisors." |

## Copy

- Section title: **Send schedule** (C: **Send on**).
- A options: "Use the default" / "Custom for {advisor name}".
- Next line: "Next send: {Ddd Mmm D, h:mm AM TZ}", with "then {next}" under it.
- Default schedule text: "Every Monday, 5:00 AM PT". Biweekly: "Every 2 weeks on Monday, 5:00 AM PT". Monthly: "Monthly, the first Monday, 8:00 AM ET" or "Monthly, on day 15, …".
- Time zones: Pacific (PT), Mountain (MT), Central (CT), Eastern (ET), Atlantic (AT), Newfoundland (NT). Stored as IANA zones: America/Vancouver, Edmonton, Winnipeg, Toronto, Halifax, St_Johns.

## Data model

**`advisor_preferences`** (add to the `updateAdvisorPreferences` allowlist, admin-only like `emailWeeklyPicks`):

| Field | Notes |
|---|---|
| `weeklyPicksSchedule` | `{ mode: 'default'\|'custom', cadence: 'weekly'\|'biweekly'\|'monthly', weekday: 0–6, time: 'HH:mm', timeZone: IANA, monthlyRule: 'nth_weekday'\|'day_of_month', nth: 1–4\|'last', dayOfMonth: 1–28, anchorDate: 'YYYY-MM-DD' (biweekly), updatedAt, updatedBy }`. Missing means `mode: 'default'` |
| `weeklyPicksNextSendAt` | A UTC Date, denormalized and indexed with `emailWeeklyPicks`. Recomputed on save, after each send, when the default changes, and when the switch turns on. Set to null when the switch is off |
| `weeklyPicksLastSentAt` | For "then" maths and catch-up |

**Global default:** one doc, for example `app_settings { _id: 'weeklyPicksDefaultSchedule', cadence, weekday, time, timeZone, …, updatedAt, updatedBy }`. A code fallback (Monday 05:00 America/Vancouver) applies when the doc is missing, so the merge changes nothing.

**Pure util:** `imports/utils/weeklyPicksSendSchedule.js` provides `nextSendAt(schedule, after)`, `describeSchedule()` and `shortWhen()`, built on `advisorDateTime`. Tests cover DST (Nov 1 and Mar 8), the last weekday of the month, days 29–31 not offered, biweekly anchors, and other zones.

## How the scheduler picks due advisors

1. **Build** stays weekly and global: Monday 00:15 PT builds every opted-in advisor's slate (same `buildMondaySlate`, but with `sendEmails: false`). Today the build runs at 05:00; moving it earlier means early-Monday sends already have a slate. MAP review keeps working on the same `weekOf`.
2. **Send** is a new cron every 15 min (`*/15 * * * *`) with a scheduler lock. It finds `advisor_preferences { emailWeeklyPicks: true, weeklyPicksNextSendAt: { $lte: now } }` and calls `sendWeeklyPicksEmailForAdvisor(advisorId, { now })`. If there's no slate for the current `weekOf` yet, it builds that advisor's slate first (`rebuildAdvisorPick`). It then sets `weeklyPicksLastSentAt` and the next `weeklyPicksNextSendAt`.
3. **Duplicate guard:** the existing `emailSentAt`-per-`weekOf` check stays, so a weekly schedule can't send twice in one week. A monthly schedule emails the slate of the week that contains its send date. Every 2 weeks: off-weeks are built (visible in MAP) but not emailed.
4. **Catch-up:** if the server was down, a missed send goes out when the server is back if it's less than 6 h late. Otherwise it's skipped to the next date (logged).
5. **Fail-closed gates** stay as they are (`private.weeklyPicksEmail`, the SES From check, unsubscribes, the non-prod allowlist).

## In scope

The schedule section in the drawer (chosen direction), the dynamic "Goes to … " line, the Next send line, the defaults drawer (A/B), the schedule fields and util, the send cron and the earlier build, backfill (existing opted-in advisors get `mode: 'default'` and a computed `weeklyPicksNextSendAt`), and tests.

## Out of scope

- Advisor-facing schedule settings outside MAP (it stays staff-only like the toggle).
- More than one send per week.
- Per-recipient schedules.
- Choosing which week's picks to send.
- Changing the publish-date default ("1st of next month", `weeklyPicksSchedule.js`; a different "schedule").
- Email content changes.
- Pausing for holidays.

## Mobile (390)

- The drawer is already 100vw on phones.
- Day buttons are 7 across at 44 px or more. Selects go full width in a 2-column grid. The B sentence wraps naturally.
- All controls are at least 44 px.
- The Next send box sits under the fields.

## Estimates (agent time: cloud agent build + FC Tester + fix loops)

Calibration: #699 took ~30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| 1. Schedule fields + util with DST/monthly/biweekly tests, global default doc (A/B), send cron + earlier build + catch-up, backfill | ≈1.5–2.25 h | ≈1.5–2.25 h | ≈1–1.25 h (weekly only, no global doc) |
| 2. Drawer UI + dynamic copy + defaults drawer (A/B), FC Tester on staging | ≈1–1.5 h | ≈0.75–1.25 h | ≈0.5–0.75 h |
| **Total** | **≈2.5–3.75 h** | **≈2.25–3.5 h** | **≈1.5–2 h** |

The two runs can overlap once the util's API is fixed in run 1, which saves about 20–30 min of wall-clock time. This needs PR #753 merged first, or the work goes on its branch.

## Recommendation

**A.**
- It gives the global default plus optional override that you suggested, and the code supports it cleanly: today's cron simply becomes the default.
- The explicit "Use the default / Custom" choice means a stray click can't take an advisor off the default. With B, the first edit silently overrides, and later default changes would then skip that advisor.
- It covers weekly, every 2 weeks and monthly with time zones.
- It costs only about 15 min more than B.

C is the cheapest option if weekly with a day and time is enough.

## Open questions

1. Are these cadences right (weekly / every 2 weeks / monthly)? Is "Day 1–28" OK for monthly-by-date, with 29–31 not offered?
2. Should advisors also see or change their schedule (outside MAP), or is it staff-only for now?
3. Should every-2-weeks off-weeks still build picks for MAP review, or skip the build too?
4. Approval links: is the current action-token lifetime long enough for late-week or monthly sends? A Sunday send is 6 days into its `weekOf`.
5. Is it OK to move the weekly build from Mon 5:00 AM to Mon 00:15 AM PT?
6. Should changes to the global default need a confirm step, given it moves many advisors at once (mocked as an explicit Save)?

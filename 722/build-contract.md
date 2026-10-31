# #722 Instagram icon in Website › Schedule: build contract

For [#722](https://github.com/kartboy16/content-library/issues/722). Mock: [index.html](index.html) (`?m=before|after`, `&w=1280|390`). **Not agent-ready. Soft Dev hold until Alex picks.**

## Cause (found in code, read-only)

- **File:** `imports/ui/WebsiteHub.jsx`, Schedule tab, the upcoming-items list (`scheduledPosts.map`). That's main `14c9cce`, about lines 765–823, and staging `6359d29`, about line 736.
- Each social item's `platforms` is mapped with an inline ternary: `'linkedin'` draws a 16×16 `#0077B5` square with white "in", and `'facebook'` draws a `#1877F2` square with white "f". **Every other key falls through to a grey `#666` square with "?"**.
- There's no `'instagram'` branch, so Instagram items always get the "?" box. It isn't a missing asset, a wrong path or a font glyph. The key is the same `'instagram'` used everywhere else (`CreatePostFlow`, `SocialPostHistory`, `ConfirmWhereBlock`), so no key mapping is needed.

## Fix

- In `WebsiteHub.jsx`, add an `instagram` case to the same badge: a 16×16 square, radius 2px, background **`#E4405F`** (the Instagram colour already used in `SocialPostHistory`, `ConfirmWhereBlock`, `PostHistoryAnalytics`, `ScheduledPostEditDialog` and `SocialSettings`), with the MUI `InstagramIcon` in white at `fontSize: 12`. It's centred like "in" and "f", with the same `gap: 0.5` before the label.
- Better (same effort): replace the ternary with a small map, `{ linkedin, facebook, instagram }`, giving the colour and the glyph or icon. Keep the grey "?" only for truly unknown keys.
- The label stays as today: `{platform}` with `textTransform: capitalize`, so it reads "Instagram".
- No data, server or schema change.

## States (mock)

| State | Shows |
|---|---|
| `m=before` | Today: LinkedIn and Facebook squares are fine, and Instagram is a grey "?" box. |
| `m=after` | Instagram is a pink `#E4405F` square with a white Instagram glyph, the same size, radius, spacing and baseline as "in" and "f". |
| Rows | LinkedIn + Facebook + Instagram; Instagram only; Facebook + Instagram waiting for approval (with Review); a Website post (🌐, unchanged). |
| `w=390` | The networks wrap onto a second line when needed, and the date follows. Edit and Delete are 44px tap targets in the mock. |

## Other places that use the Instagram icon (consistency check)

| Where | Today | Action |
|---|---|---|
| Social Media › Your Posts (`SocialPostHistory.jsx`) | `InstagramIcon`, `#E4405F`, 18px | OK. It matches the fix colour. |
| Post confirm "where" block (`ConfirmWhereBlock.jsx`), post analytics, scheduled-post edit dialog, Social settings | `InstagramIcon`, `#E4405F` | OK |
| Admin user list (`AdminUserList.jsx`) | `InstagramIcon`, **`#c13584`** | Slightly different pink. Leave it (admin-only), or align to `#E4405F` as a one-line follow-up. |
| Calendar (`Calendar.jsx`, social item icon) | Handles LinkedIn and Facebook only. An Instagram-only item falls back to the generic Share icon (not a "?") | Out of scope here. It's an optional +10 min add-on to show `InstagramIcon` too. |

## Out of scope

- Calendar's Instagram icon (see above, optional add-on), and the admin list's pink shade.
- "Linkedin" capitalisation from `textTransform: capitalize` (today it reads "Linkedin"). Not changed, so the fix stays minimal.
- Any change to the Schedule layout, the Trigger button, the dates or the actions.

## Estimate (agent time, per Alex's Oct 30 rule)

This is the Cursor cloud agent build plus FC Tester time, plus a fix loop. For calibration, #699 took about 30 min from handoff to tested.

| Piece | Time |
|---|---|
| Cloud agent build (one file: Instagram badge, or the small map, plus a render test that each known key shows no "?") | 10–15 min |
| FC Tester on staging: Website › Schedule with an Instagram item at desktop and 390, and Social Media › Your Posts unchanged | 10 min |
| Fix loop (0–1) | 0–10 min |
| **Total** | **≈20–35 min** |
| Optional: Calendar Instagram icon | +10 min |

## Open questions

1. Keep the flat square style (as mocked, matching "in" and "f"), or use the Instagram gradient? The flat `#E4405F` matches the rest of the app.
2. Add the Calendar Instagram icon in the same run (+10 min)?

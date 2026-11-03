# #786 Edit HTML Post: say why Save Changes is off (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** UI only. The core cells-only save fix (revive PR #419) is a separate build by Software developer and should land first. Likely `risk:low` (one admin screen, no data change).

## Today

In `imports/ui/admin/CreateHtmlPostPage.jsx` (staging `ffba64a`), the toolbar button is `disabled={!canSubmit}` with no explanation:

```
canSubmit = !saving && !loading && !loadingPost && titleReady && slugReady
  && (contentReady || emailTemplateDirty || legacyBodyCoversSave)
```

- `contentReady`: Rich Editor → `htmlPostContentHasVisibleBody(content)` (text or media, not `<br>`/`&nbsp;` residue); Raw HTML → `hasRawHtmlContent(content)`.
- `legacyBodyCoversSave`: edit mode, cells-only post, **and not Raw HTML**.
- `emailTemplateDirty`: the email template was changed in edit mode.
- `handleSave` already has toasts ("Post name is required", "Slug is required", "Post content is required"), but they're unreachable because the button is disabled first.
- The sidebar "Ready to Publish" list shows Complete/Required/Legacy layout, but it's far from the button and not linked.

**Not real conditions today:** there's no "no changes made" check (Save is on for an unchanged valid post), no HTML validity check (any non-blank Raw HTML passes), and no permission check on the button (the route is admin-only). The mock doesn't invent them. A "Nothing to save yet" state would be a new dirty check; that's an open question.

## Reasons (one per blocking condition, same order as `canSubmit`)

| Key | Condition | Copy | Action |
|---|---|---|---|
| `loading` | `loading \|\| loadingPost` | Loading the post… Save turns on when it has loaded. | none |
| `saving` | `saving` | Button label "Saving..." with spinner; no reason line | none |
| `name` | `!titleReady` | Add a post name. | Go to Post Name (scroll + focus + 1.5 s highlight) |
| `slug` | `!slugReady` | Add a slug with at least one letter or number. | Go to Slug |
| `content` | no visible body, not legacy, template unchanged | Add post content. The body is empty. | Go to Post Content |
| `legacyraw` | cells-only post + Raw HTML mode + Raw HTML blank | This post's body is in the legacy layout, and Raw HTML is empty. Switch to Rich Editor to save your other changes without touching the body. | Switch to Rich Editor (sets `contentMode='rich'`) |

Several can show at once (mock state "name + body"). Build a single `getSaveBlockers()` helper that returns `[{key, message, fieldId}]` and derive `canSubmit = blockers.length === 0 && !saving` from it, so the button and the message can never disagree. If the #419 revive changes what counts as a body, the helper changes once and the copy follows.

## Directions

- **A. Reason under Save (recommended).** When blocked, an amber strip right under the toolbar, right-aligned under the button on desktop and full width on phone, reads "Can't save yet: …" with a jump link per reason. Field errors show red helper text, and Ready to Publish rows become "Required: go to field" links. The strip uses `role="status"`, so screen readers hear changes. It disappears when ready.
- **B. Popover on the disabled Save.** The button uses `aria-disabled` (not `disabled`), so hover, focus and tap still work, and it opens an MUI Tooltip/Popper listing the reasons with links. Escape or × closes it. Nothing is visible until the admin hovers or taps, and touch needs a tap-to-open workaround.
- **C. Save stays on.** Only `saving`/`loading` disable it. Clicking Save with blockers shows a red summary Alert at the top of the form ("Fix 2 things to save:" + links), red field errors, and scrolls to the first one. It reuses the existing `handleSave` checks, extended to cover every reason at once.

## Out of scope

The cells-only save fix itself (#786 core / PR #419), new validation (dirty check, HTML validity), Create New HTML Post layout changes beyond sharing the same helper (it gets the same messages for free), other admin editors.

## Desktop / mobile

- **Desktop (1280):** in A, the strip sits under the sticky toolbar, so it stays visible while scrolling. In B, the popover anchors under the button.
- **Phone (390):** the toolbar subtitle hides. In A, the strip goes full width with reasons stacked. In B, the popover is capped to the screen width and opens on tap. In C, the summary sits above Basics. All links and buttons are at least 44 px.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

Scale: #699 took about 30 min from handoff to tested.

| | A | B | C |
|---|---|---|---|
| `getSaveBlockers()` helper + `canSubmit` from it + unit test | 10–15 min | 10–15 min | 10–15 min |
| UI (strip / popover / summary + field errors + jump-to-field) | 15–25 min | 20–30 min (aria-disabled, touch, Escape) | 20–30 min (summary, scroll-to-first, clear on edit) |
| FC Tester on staging, desktop + 390, each reason | 15–20 min | 20–25 min (hover + tap) | 15–20 min |
| Fix loop | 0–15 min | 5–20 min | 5–15 min |
| **Total** | **≈40–75 min** | **≈55–90 min** | **≈50–80 min** |

Runs after the core #786 save fix merges to staging, so the reasons match the fixed `canSubmit`.

## Recommendation

**A.** It's always visible exactly where the admin is looking (the greyed button) and works the same on touch, where tooltips on disabled buttons are unreliable. The jump links make every reason one click to fix. B hides the reason until someone thinks to hover. C changes button behaviour, and admins get an error only after trying.

## Open questions

1. Add a "Nothing to save yet" state (a new dirty check), or keep Save on for unchanged posts as today?
2. After the #419 revive, can a cells-only post in Raw HTML mode still be blocked? If not, drop the `legacyraw` reason.
3. Should the same strip appear on Create New HTML Post (free with the shared helper)?

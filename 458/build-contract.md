# #458 · Default subject prefix: build contract

**Issue:** [kartboy16/content-library#458](https://github.com/kartboy16/content-library/issues/458) · **Mock hub:** https://kartboy16.github.io/fc-mocks/458/
**Status:** Designer-first. **Not agent-ready. Soft Dev hold until Alex picks.**
**Recommended:** Direction A (plain text prefix). Code references are from `main` @ `629afb3`.

## 1. What we're building

An optional **Default subject prefix** for each advisor account, in Email Campaigns → Settings → *Email Campaign From Settings*, right under From Name. When it's set, every **new** campaign subject starts with it. The subject stays fully editable per campaign, and the prefix is never added twice.

Empty or unset = today's behaviour, byte for byte.

## 2. Field

| | |
|---|---|
| Label | Default subject prefix (optional) |
| Placeholder | `e.g. From Your Firm Name:` |
| Helper | Added to the start of every new campaign subject. Include the colon or dash you want; we add one space after it. You can still change the subject on each campaign. |
| Live preview | `Subjects will look like: From Your Firm Name: Your subject` / empty: `No prefix set. Subjects look exactly as you type them.` |
| Max length | 40 characters (trimmed on save) |
| Save | Debounced autosave + "Saved" snackbar, same as From Name |
| Placement | `imports/ui/EmailCampaigns/SESSettings.jsx`, *Email Campaign From Settings* accordion (From Name / From Email row ~L478–510); new row directly below From Name. Stacks on phone. |
| Direction C only | Two inputs instead: **name** (`Your Firm Name`) + **style** radio `From X:` / `X \|` / `[X]`; stored as the rendered string plus `{name, style}` |

## 3. Storage

- Today From Name for SES lives in **`AdvisorPreferences.fromName`** (`imports/collections/advisor_preferences.js`), written by **`ses.updateFromSettings`** (`server/ses-methods.js` ~L2431, which trims and `upsertAsync({ ownedBy }, { $set })`) and read in `SESSettings.jsx` L144 and in `CreateCampaign.jsx` L310/L322 (`preferences?.fromName ?? advisorConfig?.name`).
- Add **`AdvisorPreferences.defaultSubjectPrefix: String | null`** (trimmed; `''` → `null`). Write it through `ses.updateFromSettings` (add `defaultSubjectPrefix: Match.Optional(String)` to its payload check, max 40 chars) so it gets that method's auth and impersonation handling.
- **Do not** save it through the generic `updateAdvisorPreferences` method: today it does `check(update, Object)` and `$set`s whatever it gets, with no user/ownership check (`advisor_preferences.js` L69–80). Worth tightening separately.
- Storing it on `AdvisorPreferences` rather than `MailChimpSettings` (Mailchimp's own `fromName`, `MailchimpSettings.jsx` L102) means it survives switching providers. See open question 6.
- Direction C: also store `defaultSubjectPrefixName`, `defaultSubjectPrefixStyle` (`from` | `bar` | `bracket`).

## 4. The apply rule (shared helper)

New file `imports/utils/subjectPrefix.js`, used on client **and** server, with unit tests in `tests/subject-prefix.test.js`.

```js
const norm = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
const core = (p) => norm(p).replace(/^[\[(]+/, '').replace(/[\s:|\-–—\])]+$/, '');

export function hasSubjectPrefix(subject, prefix) {
  const s = norm(subject), p = norm(prefix), c = core(prefix);
  if (!p) return false;
  if (s.startsWith(p)) return true;                  // exact (case/space-insensitive)
  const sc = s.replace(/^[\[(]+/, '');
  if (c && sc.startsWith(c)) {                        // same name, different separator
    const next = sc.charAt(c.length);
    return next === '' || /[^a-z0-9]/.test(next);    // whole word only
  }
  return false;
}

export function applySubjectPrefix(subject, prefix) {
  const p = String(prefix || '').trim();
  const s = String(subject || '').replace(/^\s+/, '');
  if (!p || hasSubjectPrefix(s, p)) return s;
  return `${p} ${s}`;                                 // exactly one space
}
```

| Subject in (prefix `From Your Firm Name:`) | Result |
|---|---|
| `Why High-Income Earners…` | `From Your Firm Name: Why High-Income Earners…` |
| `From Your Firm Name: Why…` | unchanged |
| `FROM YOUR FIRM NAME:Why…` | unchanged (capitals ignored) |
| `  from your firm name:   Why…` | unchanged (spaces ignored; leading spaces trimmed) |
| `From Your Firm Name – Why…` | unchanged (same name, different separator) |
| `YourFirmNamePlus news: …` | prefix added (not a whole-word match) |
| `` (blank) | `From Your Firm Name: ` (cursor after the space) |

This is a bit looser than the issue's "exact match at start" on purpose: an advisor pasting `FROM YOUR FIRM NAME:` shouldn't get it twice. If Alex wants strict exact match, drop the `core` branch and the lowercasing. That's a one-line change.

## 5. Where campaigns get created, and who gets the prefix

| # | Path (file) | How it creates | Prefix? (recommended) |
|---|---|---|---|
| 1 | **Blank new campaign:** Campaigns → Create (`imports/ui/EmailCampaigns/SESCampaignsList.jsx`, subject field ~L2457, `executeCreateCampaign` → `ses.createCampaign` L859) | Client form | **Yes:** pre-fill the subject with `prefix + ' '` when the dialog opens, visible and editable |
| 2 | **Email this post** (Content Library → `CreateCampaign` with `initialSubject={post.name…}`, `imports/ui/ContentLibrary.jsx` L5215–5238) | `CreateCampaign.jsx` `useEffect` L295–330 (`if (!campaignId)` branch) | **Yes:** `applySubjectPrefix(initialSubject, prefix)` in the new-campaign branch only |
| 3 | **Infographic → email** (`ContentLibrary.jsx` L5250–5273 → `CreateCampaign`; inline fallback `imports/ui/infographicActions.js` L203 `ses.createCampaign`) | Client form / direct call | **Yes** (form: pre-fill; inline: server rule, see 7) |
| 4 | **Admin distribute** (Content Library distribute, `ContentLibrary.jsx` L2478/L2510 `ses.createCampaign`; Mailchimp `mailchimp.addScheduledEmailCampaignInternal` L2443) | Admin, direct call | **Yes, server-side** (open question 1) |
| 5 | **Suggested posts / admin distribution dialog** (`imports/ui/admin/AdminPostDistributionDialog.jsx` L429/L462 → `postSuggestions.createCampaignForUser`, `server/api/post-suggestions.js` L840 → `createCampaignForAdvisor`, `server/mailchimp/content-campaign-helper.js` L97) | Server | **Yes, server-side** (open question 1). The admin-side `CreateCampaign` opened at `AdminPostDistributionDialog.jsx` L678/L691 should pre-fill the prefixed subject |
| 6 | **Duplicate** (`SESCampaignsList.jsx` L1262 → `ses.duplicateCampaign`, `server/ses-methods.js` L1960, copies `src.subject`) | Server | **No.** A copy keeps the original subject exactly. If it lacks the prefix, the editor shows "Add 'From Your Firm Name:'" (A/C) or "Add back" (B). Pass `skipSubjectPrefix: true` so the server rule doesn't add it |
| 7 | **Edit existing draft / scheduled** (`SESCampaignsList.jsx` L2829 `CreateCampaign campaignId=…`, `initialSubject={campaignToEdit.subject}`) | Client form | **No.** Never touch existing campaigns |
| 8 | **Mailchimp create dialog** (`imports/ui/EmailCampaigns/mailchimp/MailchimpCreateCampaignDialog.jsx` L98/L226/L254) | Client form | Open question 6 (recommended yes, same pre-fill, for new only) |
| 9 | **Sent campaigns / [TEST] sends / compliance copy** (`server/ses-methods.js` L2742 `[TEST] ${subject}`; `server/mailchimp/pipeline-runners.js` L129 `[Compliance Review] ${subject}`) | Server | Unchanged: they wrap the already-saved subject, so they show `[TEST] From Your Firm Name: …` |

"Templates": FTT Mail (SES) has no saved-template picker today. New campaigns come from blank, a post, an infographic, admin distribute/suggestions or duplicate. Mailchimp's dialog loads a stub/template subject (row 8).

## 6. UI behaviour by direction

**A · Plain text (recommended)**
- The subject input is pre-filled with `From Your Firm Name: ` and the cursor sits at the end.
- Helper: "Starts with your prefix from Settings. You can edit or delete it like any other text."
- If the advisor removes it, the helper changes to "Doesn't start with your prefix. That's fine, it's your call. **Add 'From Your Firm Name:'**" (one click, no double).
- Saved subject = exactly what's in the box.

**B · Locked chip**
- Chip `From Your Firm Name:` ✕ sits before the input; the input holds only the rest.
- Saved subject = `chip + ' ' + rest` (when the chip is on) or `rest`.
- If the advisor types or pastes the prefix into the input, the chip turns off automatically ("already starts with it, we won't add it twice").
- ✕ = this campaign only; "Add 'From Your Firm Name:' back" restores it.
- Needs a `subjectPrefixApplied: Boolean` on the campaign so re-opening a draft shows the chip again (or derive it from `hasSubjectPrefix`).

**C · Name + style**
- Settings: name + style radio + preview. Prefix = `From {name}:` / `{name} |` / `[{name}]`.
- The campaign editor works the same as A.

**All directions**
- Character counter under the subject: "N characters".
- More than 38: "Phones may cut it off after about 38 characters."
- More than 60: "Long subject: inboxes usually cut it off after about 60 characters." This is a warning only and never blocks sending.
- The inbox preview in the mock shows the cut-off.
- Phone (≤600px): the Settings field stacks under From Name and the subject field keeps the prefix visible (B's chip doesn't wrap).

## 7. Server rule (for paths with no subject box)

In `createSESCampaign` (`server/ses-methods.js` L810) and `createMailchimpCampaignFromContent` (`content-campaign-helper.js`):

```js
const prefs = await AdvisorPreferences.findOneAsync({ ownedBy: advisorId }, { fields: { defaultSubjectPrefix: 1 } });
if (!campaignData.skipSubjectPrefix && prefs?.defaultSubjectPrefix) {
  doc.subject = applySubjectPrefix(campaignData.subject, prefs.defaultSubjectPrefix);
}
```

- Add `skipSubjectPrefix: Match.Optional(Boolean)` to the checks in `ses.createCampaign` (L1604) and `postSuggestions.createCampaignForUser` (L840).
- Because the helper is idempotent, client pre-fill and the server rule can't double up. The server rule is therefore safe to run on every create except duplicate (`skipSubjectPrefix: true`). If the advisor deliberately deleted the prefix in the form (A/C) or clicked ✕ (B), the client must also send `skipSubjectPrefix: true`.
- `ses.updateCampaign` and other edit paths never apply the prefix.

## 8. Acceptance checks (in addition to the issue's)

1. Prefix unset → every create path produces the same subject as today (tests for rows 1–6).
2. Prefix `From Your Firm Name:` + blank campaign → subject box shows `From Your Firm Name: ` and saves what the advisor typed.
3. Post titled `From Your Firm Name: X` → saved `From Your Firm Name: X` (no double); `FROM YOUR FIRM NAME:X` → unchanged.
4. Duplicate of a pre-prefix campaign → subject unchanged; one click adds the prefix.
5. Changing or clearing the prefix in Settings does not modify any existing draft, scheduled or sent campaign.
6. Advisor deletes the prefix in the form → saved without it (server doesn't re-add).
7. `[TEST]` send subject = `[TEST] ` + saved subject.
8. Unit tests for `applySubjectPrefix` cover every row of the table in §4.

## 9. Open questions (for Alex)

1. **Which new campaigns get it?** Recommended: all new campaigns for the account, including ones FTT prepares (Suggested posts, Content Library distribute). Duplicates keep their subject.
2. **Changing the prefix later:** recommended to leave existing drafts and scheduled campaigns alone. New ones only.
3. **Per account vs per firm/admin-set:** recommended per advisor account, editable by the advisor and by FTT while impersonating. A firm-level default is a later add.
4. **Separator:** A/B store exactly what's typed plus one space. Add a colon automatically if it's missing? (C solves this with a style picker.)
5. **Preheader / test sends:** FTT Mail has no preheader field today, so nothing to do. Test sends keep `[TEST] ` in front of the full subject.
6. **Mailchimp accounts:** same setting for Mailchimp-provider accounts too, or FTT Mail (SES) only for v1?
7. **Matching:** OK with the looser "same name, any capitals/spaces/separator" match, or strict exact match as written in the issue?

## 10. Out of scope

- Rewriting subjects on sent campaigns.
- Bulk-updating drafts.
- Making the prefix required.
- Prefixing preheaders.

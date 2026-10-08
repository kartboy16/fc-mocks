# #420 Bounce guidance in Campaign Report: build contract (draft)

- **Status:** Designer-first. **Soft Dev hold.** Not agent-ready until Alex picks a direction.
- **Mocks:** https://kartboy16.github.io/fc-mocks/420/ (A recommended · B lightest · C most guided)
- **Issue:** https://github.com/kartboy16/content-library/issues/420

## Where
- `imports/ui/EmailCampaigns/SESReports.jsx` → Report Detail Dialog → `reportTab === 2` (Bounces). Today: Email · Bounce type · Sub-type · Date, nothing else.
- `imports/ui/EmailCampaigns/SESContacts.jsx` → Edit Subscriber dialog (status guard) and Subscribers tab (accept an initial `status=bounced` filter).
- `imports/ui/EmailCampaigns/EmailCampaigns.jsx` → switch to the Subscribers tab (index 3) with that filter when the report asks for it.
- No server/schema change for A or B. C's bulk "Fix addresses" needs one new method (below).

## Current behavior (don't change it, explain it)
- Permanent → contact `status: 'bounced'` + sender-level block (`addToSuppressionList(email,'BOUNCE')`), skipped on next send.
- Transient → `softBounceCount += 1`; at **3 in a row** (`SOFT_BOUNCE_THRESHOLD`) → `status: 'bounced'` + same sender-level block. A delivery resets the count.
- Because both paths add the address to the sender-level block, **re-subscribing the same address does not work.** It is silently skipped or bounces again. That's why AC-4 is a hard guard, not just copy.

## Copy (single source; put in one helper, e.g. `imports/utils/bounceGuidance.js`)
| Type / Sub-type | Plain label | Next step (row) | Action |
|---|---|---|---|
| Permanent / General | Address rejected | Won't be emailed again until you update the address. Edit this subscriber and change Status to Subscribed if you have a new email. | Edit subscriber |
| Permanent / NoEmail | Address doesn't exist | (same as above) | Edit subscriber |
| Permanent / Suppressed, OnAccountSuppressionList | Bounced before | (same as above) | Edit subscriber |
| Transient / MailboxFull | Inbox full | Temporary. We'll try again next campaign. Their inbox may be full. | none |
| Transient / General (and MessageTooLarge, ContentRejected, AttachmentRejected) | Temporarily refused | Temporary refusal. Worth double-checking the address is still current. | Check address (opens Edit) |
| Transient, contact now `bounced` (3rd in a row) | Paused | Paused after 3 temporary bounces in a row, so it won't get your next campaign. Check the address is still current. If you have a new one, edit this subscriber. | Check address |
| Undetermined / unknown | Unknown reason | Treat as Transient / General. | Check address |

Type explainers:
- **Permanent · Won't be emailed again:** The address doesn't work: the account was closed, there's a typo, or it never existed. We stop sending to it automatically, so it won't get your next campaign.
- **Transient · Temporary:** The address exists but couldn't take the email this time (for example, a full inbox). It stays subscribed and we try again next campaign. After 3 temporary bounces in a row, we pause the address.

Banned words in advisor UI: SES, AWS, suppression list, SNS, hard/soft bounce (use Permanent/Temporary). Keep the raw `bounceType · bounceSubType` in small grey text for support.

## Direction A (recommended)
1. **Banner** above the table when bounces > 0: `{n} bounced ({pct}% of {sent}) · {perm} won't be emailed again · {temp} temporary — here's what to do`, plus "What do these mean?" toggle. Two cards:
   - Permanent: explainer + `Show these {perm}` (filter) + `Open Subscribers › Bounced`.
   - Temporary: "Still subscribed. We'll try again next campaign." + paused count if > 0.
2. **Filter chips:** All / Won't be emailed again / Temporary.
3. **Grouped table:** group rows "Won't be emailed again (n)" then "Temporary (n)". Columns: Subscriber (email + name) · What happened (chip + plain label + raw grey) · What to do · action button · Date.
4. **Reports list:** under the Bounces chip, `{needs} need an update` (permanent + paused, not yet fixed) in red.
5. After a successful edit from the report: the row shows `✓ Updated to {new} · Subscribed` (local state is fine; on reload derive it from the contact, see Data).

## Direction B
- Keep columns. Add `What to do` column (copy table + inline `Edit subscriber` link). One-line legend strip + "What do these mean?" panel. ⓘ popovers on the Bounce type and Sub-type headers. Footer link `View all bounced subscribers ›`.

## Direction C
- Status line `{n} bounced. {needs} addresses need an update…` + `Fix {needs} addresses` + `Subscribers › Bounced`.
- Row click → right details panel: What happened / What happens next / What to do / Edit subscriber / History.
- **Fix addresses** view: one row per permanent + paused bounce, inline `New email` + Save / Skip / Undo, progress `x of y updated`. Save = same server method as Edit (in-place update, status → subscribed, same checks).

## Edit Subscriber guard (all directions, AC-3 + AC-4)
- Context alert at the top when the contact is `bounced` (what happened + "enter their new email address and set Status to Subscribed").
- While the email is **unchanged** and the contact is `bounced`: disable the `Subscribed` option ("Subscribed (enter a new email first)") + help text.
- When the email changes to a valid, unused address: auto-set Status to `Subscribed` and show "New address. Lists, tags and history stay with {first}."
- If the new email already belongs to another contact of this advisor: inline error + link to open that contact. **Save disabled.** Never create a second record.
- Server (`sesContacts.update` or equivalent) enforces the same rules: reject `bounced → subscribed` with an unchanged email; reject an email that collides with another contact (case-insensitive) for the same advisor; on email change, reset `softBounceCount` and clear `lastSoftBounceAt`.

## Data
- Report rows already carry `email, bounceType, bounceSubType, timestamp`. To show "Paused" and "Updated", look up the current contact by email at report load (one query for the bounced emails). If not found by the old email and an edit happened in this session, use local state. Optional later: store `previousEmails[]` on the contact so "Updated" survives reloads.
- Soft count per row: show `n of 3` only when available. Don't add new tracking for it.

## Out of scope
- Removing addresses from the sender-level block (support/admin only). Open question below.
- Changing bounce thresholds or the webhook.
- Auto-emailing advisors about bounces (existing bounce alert emails stay as they are).

## Open decisions for Alex
1. Direction: A (recommended), B, or C? Or A now and C's Fix list later?
2. Paused (3 temporary) addresses that are actually still valid: should the advisor get "Contact support to unblock", or should we build an admin unblock?
3. Should the Edit guard also apply in the Subscribers tab generally (mocked: yes, same dialog)?
4. Show "Updated" across reloads (needs `previousEmails[]`) or only in the session?

## Tests (when unblocked)
- Unit: copy helper maps every type/sub-type (including unknown) to label + next + action; no banned words.
- Unit/server: bounced + same email + subscribed → rejected; new email → subscribed and count reset; colliding email → rejected.
- UI: banner counts (perm, temp, paused, needs) match the rows; empty state; temporary-only state.

# #589 FTT Mail Subscribers: choose which columns to show (incl. imported Mailchimp fields)

**Status:** Mock only. Not agent-ready. Soft Dev hold until Alex picks.
**Related:** #585 (Mailchimp import of phone, birthday, address, custom fields), #149, #130 (Contacts hub), #129 (pagination and counts).
**Recommendation:** Direction A (dropdown checklist).
**Mocks:** https://kartboy16.github.io/fc-mocks/589/

## Directions
- **A (recommended): dropdown checklist.** A "Columns" button next to Filters opens a checklist grouped into Standard fields, From Mailchimp and Other fields. Ticking adds the column on the right and saves straight away. Search appears when there are more than about 14 fields. "Reset to default" is in the footer. No reorder.
- **B: side drawer with drag-to-reorder.** "Columns" opens a right-hand panel: shown columns in order (drag handle plus up/down arrows, x to hide), then hidden fields with "+ Add". Applies on Save; Cancel discards.
- **C: inline "+ Add column" header.** The last header cell adds a column. Each header has a menu with Move left, Move right and Hide. The toolbar "Columns" button opens the same add menu, and "Reset to default columns" appears once something changed.

All three save the same thing (an ordered list of column keys), so moving from A to B later is cheap.

## Rules (all directions)
1. **Default view unchanged.** No saved choice means today's columns: Email, Name, Status, Engagement, Lists, Tags, Actions. (The issue lists five; Engagement is in today's table, so it stays on by default.)
2. **Email is always shown** and pinned first (sticky when the table scrolls sideways). The checkbox and Actions columns are always there.
3. **Saved per advisor.** The choice is stored on the advisor (`ownedBy: advisorId`). An admin acting as the advisor reads and changes the same choice.
4. **The contact page always shows every field**, including hidden columns and empty fields.
5. **Labels:** fields created by a Mailchimp import show "From Mailchimp"; fields from a CSV import show "From CSV".
6. **One-time hint** after an import that adds new fields: "3 new fields came in from your Mailchimp import: ... Want to see any of them in this table?" with Choose columns / No thanks. Either button dismisses it for good. It's not shown on phones.
7. **Unknown or removed keys are skipped** when rendering (e.g. a saved custom field no contact has any more).
8. Plain copy only. Sample data only in mocks and tests (Jane Advisor, Example Co, example.com).

## Proposed defaults for the open questions
1. **Export: always every field (no change to today).** `ses.exportContactsCSV` already exports every standard field plus every custom field key found. Export is used as a backup and to move lists, so silently dropping hidden fields would lose data. Optional later: an "Export visible columns only" choice in an Export menu.
2. **Reset to default: yes.** A "Reset to default" link in every direction. It deletes the saved choice, so the advisor goes back to whatever the default is.
3. **Mobile: default view only.** Under about 600px the table shows as cards (Name, Status, Email, Lists, Tags). The Columns control and hint are hidden, so a phone never changes the saved choice. Tap a card for the contact page with every field.
4. **Sorting (from the issue, "where practical"): no new sorts in v1.** Today the table headers don't sort; sorting is the "Sort by" menu (newest, oldest, email, name). Keep that. Custom fields have no index, so sorting 10k+ contacts by them could be slow. Revisit if asked.
5. **Too many columns: no hard cap.** At 6+ extra columns, show "Wide table: scroll sideways. Email stays pinned on the left." Server-side, cap the saved list at 60 keys.

## Code findings (read-only, main @ 43033c3)
- **Table:** `imports/ui/EmailCampaigns/SESContacts.jsx` (2,428 lines). Columns are hard-coded in `TableHead` (~line 1295): checkbox, Email, Name, Status, Engagement, Lists, Tags, Actions. Lists and Tags show 2 chips plus "+N". The toolbar row has Filters and Search (~line 1118); the header row has Import CSV, Import from Mailchimp, Export, Add Contact.
- **Data is already on the client.** `Meteor.publish('sesContacts')` in `server/ses-methods.js` (~line 3092) returns whole contact docs with no field projection (limit up to 500), so phone, birthday, address and `customFields` are already sent. Showing columns needs no publication change. Ownership: `resolvePublicationAdvisorId` (owner, or admin acting as the advisor).
- **Contact shape** (`imports/collections/ses_contacts.js`): `advisorId, email, firstName, lastName, phone, birthday ('MM/DD'), address {addr1, addr2, city, state, zip, country}, customFields {[key]: string|object}, lists [listId], tags [tagId], status, createdAt, updatedAt`. There is **no `source` field** on contacts (the issue mentions "source" as a standard field), so a Source column would be new work or should be dropped.
- **How `customFields` is shaped (#585):** `imports/api/helpers/mailchimp_import_helpers.js`.
  - `classifyMergeFields` picks one Mailchimp merge field each for address, phone and birthday into the standard fields. Every other merge field, plus extra address/phone/date fields, goes to `customFields`.
  - The key is the merge field's **display name** (e.g. "Referral source"), or the merge tag if that name is already used (`customFieldKey`). So keys are human labels with spaces, not stable IDs, and a rename in Mailchimp makes a new key on the next import.
  - Values are strings, except address-type extras, which are objects (`formatCustomFieldValue` joins them; the edit dialog shows them read-only).
  - `customFields.MAILCHIMP_STATUS` is a synthetic key and is hidden by `visibleCustomFieldEntries`. The picker must hide it too.
  - CSV import (`imports/utils/contactCsvImport.js`) also writes unmapped CSV columns into `customFields` under the CSV header name, and forms (`server/api/ses-form-handler.js`) write `customFields[field.name]`. Keys from all three sources share one namespace.
- **No record of where a field came from.** Nothing stores "this key came from Mailchimp" or a per-advisor field list. The import summary (`mappedFields`, with `target: 'customFields.<key>'`) goes back to the client in `MailchimpImportModal.jsx` and isn't saved. To label "From Mailchimp", list fields with no values yet, and know which fields are new for the hint, save a field list at import time (see Data).
- **Where the column choice would be saved:** `AdvisorPreferences` (`imports/collections/advisor_preferences.js`, keyed by `ownedBy`). `updateAdvisorPreferences` only accepts a whitelist of **scalar** fields (#459), so an array can't go through it. Add a dedicated method like `updateAdvisorSocialHashtagLibrary`, which already stores a structured value with `...UpdatedAt` / `...UpdatedBy`.
- **Ownership checks to reuse:** `assertAdvisorOrAdmin(this.userId, advisorId)` (`server/mailchimp/auth.js`): owner or admin. `updateAdvisorPreferences` and the `advisorPreferences` publication use the same owner-or-admin rule. Support impersonation logs in as the advisor, so it counts as the owner.
- **Export:** `ses.exportContactsCSV` (`server/ses-methods.js` ~line 2401) checks `assertAdvisorOrAdmin`, then exports standard columns plus every custom key found (sorted, without `MAILCHIMP_STATUS`). The client passes list and search, but not the status or tag filters shown on screen. That's a separate small mismatch worth noting.
- **Contact page:** there is no separate contact page today. "Edit contact" is a dialog in `SESContacts.jsx` (~line 1602) with phone, birthday, address and an "Other fields" section that lists only custom fields that have a value. The mock groups them by source and also shows empty ones.

## Data
`AdvisorPreferences` (per advisor, `ownedBy: advisorId`):
```
subscriberColumns: { keys: ['email','name','status','engagement','lists','tags','phone','cf:Company'], updatedAt, updatedBy }
subscriberFieldCatalog: [{ key: 'Company', label: 'Company', source: 'mailchimp'|'csv'|'form', type: 'text'|'date'|'address'|..., firstSeenAt }]
subscriberColumnsHint: { newKeys: ['Anniversary','Referral source','Company'], importedAt, dismissedAt }
```
- Standard keys: `email, name, status, engagement, lists, tags, phone, birthday, city, address, created`. Custom keys are `cf:<customFields key>`.
- The Mailchimp import (and CSV import) adds any key it hasn't seen to `subscriberFieldCatalog` and sets `subscriberColumnsHint.newKeys` if there were new ones.
- Legacy contacts with custom keys not in the catalog: one-off backfill per advisor (distinct keys from `sesContacts`, label "Other fields"), or compute on first open of the picker.

## Methods
- `ses.setSubscriberColumns(advisorId, keys)`: `check(keys, [String])`, at most 60 keys of at most 200 chars each, `email` forced first, then `assertAdvisorOrAdmin`, then upsert `{ownedBy: advisorId}`. `keys = null` resets (unset).
- `ses.dismissSubscriberColumnsHint(advisorId)`: same check, sets `dismissedAt`.
- Read through the existing `advisorPreferences` publication, or a small `ses.getSubscriberColumns` method.

## Tests
- No saved choice means today's columns, in today's order.
- Saving, reloading and a different browser give the same columns. An admin acting as the advisor sees the advisor's choice.
- Another advisor (not admin) can't read or set someone else's choice.
- Email can't be removed. `MAILCHIMP_STATUS` never appears. Unknown keys are skipped.
- Reset puts back the defaults.
- The hint shows once after an import with new fields, never again after Choose columns or No thanks, and not on phones.
- The contact dialog shows every field, including hidden and empty ones. Object (address) values render as text.
- Export is unchanged (all fields).
- Pagination and counts (#129) are unchanged with extra columns on. 500-row pages stay responsive.

## Effort (rough)
- **A:** about 2 to 2.5 dev days. That covers the picker, column rendering, the save/reset methods, the field catalog written at import, the hint, the contact dialog grouping, mobile cards and tests.
- **B:** about +1 day (drawer, drag-and-drop with arrow fallback, draft/Save).
- **C:** about +1 day (header menus, add menu, edge cases with wide tables).
- A Source column: about +0.5 day (there's no source field today).

## Open questions for Alex
1. Export: keep "every field" (proposed), or follow the visible columns?
2. Is a "Reset to default" link enough (proposed), or also a reset from the contact page?
3. Mobile: default cards only (proposed)?
4. Should admins acting as an advisor share the advisor's choice (proposed), or get their own?
5. Drop "Source" from the standard field list, since contacts don't store it today?
6. Keep Engagement in the default columns (it's in today's table)?

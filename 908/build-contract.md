# #908 Mailchimp subscriber management in FC

**Status:** Not agent-ready. Soft Dev hold until a direction is picked.

**Risk:** high — this adds write access to a live Mailchimp audience (subscribe, unsubscribe, archive, permanent delete) and records a change history. Build to staging first. FC Tester must use a **test Mailchimp audience only**.

## Sources (read-only)
- Issue [#908](https://github.com/kartboy16/content-library/issues/908)
- Product rule from Alex (Nov 17, 2026): this view is only for advisors still on Mailchimp. There is **no Mailchimp ↔ FTT Mail sync**. Once an advisor moves off Mailchimp, the old list is done.
- Today, FC only reads Mailchimp members (`server/mailchimp/import-methods.js`, `server/mailchimp/reports-methods.js`). There is no subscriber write capability.
- Live Mailchimp hub: `imports/ui/EmailCampaigns/mailchimp/MailchimpHub.jsx` — Campaigns, Default Lists, Templates, Audiences, Reports, Settings. No Subscribers tab.
- Live Audiences (read-only): `imports/ui/EmailCampaigns/mailchimp/MailchimpAudiencesList.jsx`.
- Closest existing UI (FTT Mail only, do not show this to Mailchimp advisors): `imports/ui/EmailCampaigns/SESContacts.jsx` — paged Subscribers (default 50), search, Add Subscriber with a permission checkbox, Edit, history of opens/clicks (engagement, not change audit).
- Provider switch: `imports/ui/EmailCampaigns/EmailCampaigns.jsx` — Mailchimp advisors get `MailchimpHub`; FTT Mail advisors get `FTTHub` with a Subscribers tab.

## Recommendation
**A. A Mailchimp Subscribers tab with a paged table and a side drawer for add, edit, and change history. 22–36 h.** This is the first slice. The tab is clearly labelled Mailchimp, with a helper line that this is the Mailchimp audience (News page audience in the fixture), not the FTT Mail list. The table is paged 50 per page, with search by email and “1–50 of 1,284”. The drawer holds Add (CASL checkbox + consent source), Edit (name, merge fields, tags), and per-subscriber History (who changed what and when). Unsubscribe, Remove (Mailchimp archive), and Permanently delete stay separate. Permanent delete requires typing the email and spells out that it can’t be undone and Mailchimp will not let the address be added again easily. Re-subscribing an unsubscribed person shows that Mailchimp sends a confirmation email and leaves them Pending. A already works at 390 with a full-screen drawer.

**B (24–38 h)** uses the same actions and the same copy, but add / edit / per-subscriber history are modals, and a list-wide **History** tab shows every change on the audience. Useful for an audit sweep, but it splits the per-subscriber work and adds a tab.

**C (26–42 h)** is a compact card list with a per-subscriber detail page (profile, actions, history). Better if most advisors work on a phone, but more routing than this needs as a first slice.

## Hard rules (all directions)
- This view is shown only when the advisor’s email provider is Mailchimp. FTT Mail advisors keep today’s Subscribers tab (`SESContacts`) and never see this Mailchimp view.
- There is no Mailchimp ↔ FTT Mail sync, import, or copy either way.
- The page must be unmistakably the Mailchimp list: title **Mailchimp Subscribers**, a Mailchimp badge, and a helper line that names the audience and says it is not the FTT Mail list.
- List calls are capped at **50 per page**, with limit, offset/paging, and field projection. Never load the whole audience.
- Search is by email (server-side).
- Add requires a **CASL consent checkbox** and a **consent source**. Both are required. CASL wording in this mock is a **placeholder for compliance review**.
- Unsubscribe, Remove (archive), and Permanently delete are three different actions. Do not combine them, and do not label archive as “Delete”.
- Permanent delete has a strong confirm: type the email, explain that it can’t be undone, and that Mailchimp will not let that address be added again easily.
- Re-subscribing an unsubscribed person does not silently set them back to subscribed. The UI must say Mailchimp will send a confirmation email, and the member’s status becomes **Pending** until they confirm.
- Every change writes an audit log in FC (who, when, action, email, and consent source on add). “Who” is the FC advisor (Jane Advisor in the fixture), not a raw Mailchimp API actor.
- Advisor-facing copy never links to the platform marketing domain and never uses real client or advisor names.

## Screens
| Screen | Direction | Notes |
| --- | --- | --- |
| Today, Audiences | — | Current Mailchimp hub. Read-only audience names and counts. No Subscribers tab. Helper: counts come from Mailchimp; there is no way to add, edit, or remove subscribers from here. |
| Today, Settings | — | Mailchimp is connected. |
| List | A, B, C | Paged 50, “1–50 of 1,284”, search by email, Mailchimp badge and helper line. A/B: table (cards at 390). C: card list on desktop and 390. |
| Search | A, B, C | Search `subscriber@example.com` → “1–1 of 1”. |
| Page 2 | A | “51–100 of 1,284”. |
| Add | A, B, C | Email, name, consent source (In person, Website form, Event, Imported list, Other + note), required CASL checkbox. A: drawer. B/C: modal. |
| Add, consent missing | A, B, C | Add blocked until the checkbox is ticked and a source is chosen. |
| Edit | A, B, C | Name, phone and city merge fields, tags. Email is read-only. A: drawer. B: modal. C: on the detail page. |
| History | A, B, C | “Jane Advisor updated name and phone for subscriber@example.com, Nov 16, 2026, 11:42 AM PT.” A: drawer tab. B: per-subscriber modal plus a list-wide History tab. C: on the detail page. |
| Unsubscribe | A, B, C | Confirm, then toast and status Unsubscribed. |
| Re-subscribe | A, B, C | `alex.client@example.com` was unsubscribed. Dialog explains the confirmation email. After confirm, status is Pending and a toast says the email was sent. |
| Remove | A, B, C | Labelled **Remove**. Archives in Mailchimp. They can be added again later if there is consent. Not a permanent delete. |
| Permanently delete | A, B, C | Type `subscriber@example.com` to enable the button. Warns it can’t be undone and Mailchimp won’t let the address be added again easily. |
| Empty / loading / not connected / API error | A, B, C | Empty and loading on the list. Not connected points to Settings. API error has Try again and says this is a Mailchimp API error, not an FTT Mail problem. |
| Success toasts | A, B, C | Added, updated, unsubscribed, removed, permanently deleted, confirmation email sent. |
| 390 | A, B, C | 44px targets, stacked actions. A: full-screen drawer. B: bottom-sheet modals. C: card list and a full detail page. |

## States
List (paged), search, page 2, add, add blocked, edit, history, unsubscribe, re-subscribe / pending, remove, permanent delete, empty, loading, Mailchimp not connected, Mailchimp API error, success toasts. Also Today (no Subscribers tab).

## Copy
- Title: **Mailchimp Subscribers**
- Badge: **Mailchimp**
- Helper: “This is your Mailchimp audience, News page audience. It is not the FTT Mail list. Changes here update Mailchimp only.”
- Search placeholder: “Search by email”
- Pager: “1–50 of 1,284”
- Add title: **Add subscriber**
- CASL checkbox (placeholder for compliance review): “This person gave me permission to email them (CASL consent).”
- CASL helper (placeholder): “You must have express consent before adding someone to this Mailchimp audience. They will not get a confirmation email when you add them here.”
- Consent source label: **Consent source**. Options: In person, Website form, Event, Imported list, Other (plus a note).
- CASL error: “Confirm that this person gave you permission to email them, and choose how you got that consent.”
- Unsubscribe title / body: “Unsubscribe this person?” / “subscriber@example.com will be marked Unsubscribed in Mailchimp and will stop getting campaigns. You can ask Mailchimp to send them a confirmation email later if they want to subscribe again.”
- Re-subscribe title / body: “Mailchimp will send a confirmation email” / “alex.client@example.com unsubscribed earlier, so Mailchimp will not add them back right away. Mailchimp will email them a confirmation link instead. Their status stays Pending until they confirm.” Primary: **Send confirmation email**
- Remove title / body: “Remove this subscriber?” / “Remove archives subscriber@example.com in Mailchimp. They stop getting campaigns, and you can add them again later if you have consent. This is not a permanent delete.”
- Permanent delete title / body: “Permanently delete this subscriber?” / “This cannot be undone. Mailchimp permanently deletes subscriber@example.com from the News page audience and will not let you add this address again easily. Type the email to confirm.”
- Empty: “No subscribers in this Mailchimp audience yet. Add a subscriber to get started.”
- Empty search: “No Mailchimp subscribers match that email.”
- Loading: “Loading Mailchimp subscribers…”
- Not connected title / body: “Mailchimp isn’t connected” / “Connect it in Email Campaigns → Settings to manage this audience.”
- API error title / body: “Couldn’t load subscribers” / “This is a Mailchimp API error, not an FTT Mail problem. Try again in a moment.”
- Toasts: “Subscriber added to the Mailchimp audience.” / “Subscriber updated in Mailchimp.” / “Jane Advisor unsubscribed subscriber@example.com, Nov 17, 2026, 10:20 AM PT.” / “Removed subscriber@example.com from the Mailchimp audience.” / “Permanently deleted subscriber@example.com. This cannot be undone.” / “Confirmation email sent to alex.client@example.com. Their status is Pending until they confirm.”
- History helper (B tab): “Every change Jane Advisor (or anyone on this account) makes to the Mailchimp audience is recorded here. This log is stored in FC, not in Mailchimp.”
- Today helper: “Audience counts come from Mailchimp. There is no way to add, edit, unsubscribe, or remove subscribers from here.”

Fixtures: Jane Advisor, Your Firm Name, News page audience (1,284), Event follow-ups (86), subscriber@example.com (Pat Example), alex.client@example.com (Alex Client, unsubscribed), casey.example@example.com (pending), avery.client@example.com (cleaned), example.com, 604-555-0100. No estimates or explainer prose in the mock UI (hub and contract only).

## Mailchimp API notes
- List: `GET /lists/{list_id}/members` with `count=50`, `offset`, optional email search, and `fields=` projection. Do not fetch the whole audience. Map Mailchimp `status` values: `subscribed`, `unsubscribed`, `pending`, `cleaned`.
- Add or update by email: `PUT /lists/{list_id}/members/{subscriber_hash}` (MD5 of the lowercased email). New adds set `status=subscribed` only after CASL + source are stored in FC. Store consent source (and the Other note) on the FC audit record; Mailchimp does not have a CASL source field.
- Edit: `PATCH` or `PUT` member with `merge_fields` and `tags` (Mailchimp tag add/remove endpoints as needed). Do not change email in this slice.
- Unsubscribe: `PATCH` member `status=unsubscribed`.
- Remove (archive): `DELETE /lists/{list_id}/members/{subscriber_hash}`. This **archives**. It is not a permanent delete. Label the action **Remove** in the UI.
- Permanent delete: `POST /lists/{list_id}/members/{subscriber_hash}/actions/delete-permanent`. Irreversible. Mailchimp will reject later attempts to re-add the same address.
- Re-subscribe of an unsubscribed member: do not force `status=subscribed`. Mailchimp sends a confirmation email and the member becomes `pending` until they confirm. Surface that in the UI and in the audit log.
- Rate limits: page slowly, disable double-submits, and show the API error state on 4xx/5xx. Never page through a large audience in one request.
- Audit log: an FC collection, advisor-scoped, append-only. Fields: actor (advisor id + display name), action, email, audience id, at (timestamp), and metadata (consent source, tag changes). List and search with limit, paging, and field projection. This is not Mailchimp’s activity feed.
- Auth: advisor-scoped, same pattern as the other Mailchimp methods (`mailchimpFetch`).

## In / out of scope
**In:** Mailchimp Subscribers tab on `MailchimpHub` (plus History tab in B, or a detail route in C); paged list (50) + email search; add with CASL + source; edit name, merge fields, tags; unsubscribe; Remove (archive); permanent delete with type-to-confirm; pending re-subscribe message; FC audit log and history views; empty / loading / not connected / API error / toasts; 1280 and 390; generic fixtures; tests against a test Mailchimp audience.

**Out of scope:** any Mailchimp ↔ FTT Mail sync or migration of members; changing the FTT Mail Subscribers UI; CSV import/export in this slice; bulk actions; creating or renaming Mailchimp audiences or segments; changing email provider; Mailchimp engagement history (opens/clicks) — that’s reports, not this audit log; writing CASL legal copy as final (compliance must review the placeholder).

## Desktop vs mobile
1280: 90px left rail, Email Campaigns page, new Subscribers tab. A: table + 480px right drawer. B: table + centered modals, History as a tab. C: card list, detail replaces the list.
390: rail behind Menu, 44px targets, tools stack, table becomes cards in A/B. A drawer is full screen. B dialogs are a bottom sheet. C is the default mobile layout (cards + detail).

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 14–22 | 16–24 | 17–26 |
| FC Tester | 6–9 | 6–9 | 6–10 |
| Fix loop | 2–5 | 2–5 | 3–6 |
| **Total** | **22–36 h** | **24–38 h** | **26–42 h** |

A covers the new tab, paged list + search, server write methods, CASL add, edit, the three removal actions, pending re-subscribe, FC audit log in the drawer, states, and tests on a test audience. B adds the list-wide History tab and uses modals. C adds a detail route and a card layout.

## Open questions
1. If the advisor has more than one Mailchimp audience, is this view the default audience with a picker, or one combined list? (Recommended: default audience, with a picker when there is more than one.)
2. Should `cleaned` members appear, and can they be removed or permanently deleted? (Recommended: show them, no “Send confirmation email”; Remove and Permanently delete still available.)
3. Bulk unsubscribe / remove in this slice? (Recommended: no. Single-subscriber only until the first slice ships.)
4. Final CASL checkbox and helper wording — compliance review before build, or ship the placeholder and swap copy? (Recommended: review before build if the wording will be in the first PR.)

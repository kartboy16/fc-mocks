# #1018 Paste contacts to add email subscribers: build contract

Status: **Not agent-ready.** Soft Dev hold until a direction is picked. Risk: **high** (Email Campaigns UI, `imports/ui/EmailCampaigns/**`), so Alex merges to main. Track: playground first.

Mocks: https://kartboy16.github.io/fc-mocks/1018/ (A `a-inline.html`, B `b-wizard.html` (recommended), C `c-fullpage.html`). Scenes use `?s=<scene>`, and `&phone=1` gives the 390 view.

## Recommendation
**B, the 3-step modal wizard** (1 Paste, 2 Match and preview, 3 Confirm). It matches the existing Import CSV, Import from Mailchimp and Add Contact dialogs on Subscribers. The step gate makes the preview impossible to skip, it goes full screen at 390, and step 2 can later be reused by the CSV import (non-goal for now).

## Entry point
- New outlined button **Paste contacts** in the Subscribers toolbar, next to Import CSV (`SESContacts.jsx`). Visible to advisors, and to admins and support in a Log in as session.
- A opens an inline panel above the table, B opens a dialog (full screen on phones), and C routes to Subscribers › Paste contacts.

## Screens and states (scene keys)
| Scene | What it shows |
|---|---|
| `empty` | Empty paste box with help text. Check rows / Next disabled. |
| `pasted` | Rows pasted, line count and detected separator. |
| `map` | Column auto-detect with mapping dropdowns (Email / First name / Last name / Ignore this column), header-row toggle, and an inline preview. Continue is disabled if no column, or more than one column, is Email. |
| `emailonly` | No header and one column: auto-mapped to Email, names stay blank. |
| `preview` / `skipped` | Counts, a per-row result with a reason, and filter chips (All, Ready, Skipped, each reason). |
| `list` | Target list: existing list dropdown, or a new list with a required name. |
| `admin` | Log in as session: "Adding to: Jane Advisor" banner, only that advisor's lists, and dedupe checked against that advisor. |
| `picker` | Capped, paged advisor picker (admin and support only). |
| `cap` | Over the row cap: nothing added, with Keep the first 1,000 rows / Clear options. |
| `importing` | Loading: indeterminate bar, buttons disabled. |
| `summary` | Success: added N, skipped by reason, Download skipped rows (CSV), totals and pagination refreshed. |
| `error` | Import failed, nothing added, pasted rows kept, Try again. |

## Copy (key strings)
- Help: "One contact per line." / "Email first, then optional first and last name." / "Columns can be separated by commas, tabs (copied from a spreadsheet) or semicolons." / "A header row is optional. We detect it." / "Up to 1,000 rows per paste."
- Mapping note: "We matched the columns from your header row. Change any that look wrong. Email is the only required column."
- Mapping errors: "Pick which column has the email address. Email is the only required column." / "Only one column can be Email."
- Reasons: Already on list ("Already on <list>. Skipped, nothing changes."), Duplicate in paste ("Same email as row N. Only the first one is added."), Invalid email, Unsubscribed ("Unsubscribed earlier. Skipped so they aren't re-subscribed without consent."), Bounced or complained.
- Permission (reuses Add Contact wording, required): "These people gave me permission to email them."
- Cap: "That's 1,240 rows. You can add up to 1,000 per paste."
- Error: "Import failed. Nothing was added."
- **Placeholder for Alex:** consent wording for skipped unsubscribed or bounced addresses. Don't invent legal copy.

## Parsing rules (client, repeated on the server)
1. Split on line breaks (`\r\n`, `\n`). Trim each line and drop blank lines.
2. Separator: pick tab if any line has a tab, else semicolon if most lines have one, else comma. Support quoted fields ("Sample, Alex").
3. Header row: treat row 1 as a header if no cell in it is a valid email and a cell matches email/e-mail/first name/first/last name/last/surname (case-insensitive). The user can toggle it.
4. Auto-map from header names, else the first column that holds valid emails becomes Email, then the next two text columns become First name and Last name. Extra columns default to Ignore.
5. Email: trim, lowercase for comparison, and use the same validator as Add Contact. Strip a `Name <email>` wrapper if present.
6. Row cap: **1,000 data rows per paste (assumption, see open questions)**. Over the cap, block preview until the user keeps the first 1,000 or clears.

## Dedupe and suppression rules
- **Duplicate in paste:** the first occurrence (by normalized email) wins, later ones are skipped.
- **Already on list:** an existing contact already on the target list is skipped, and its name isn't overwritten.
- **Existing contact not on the target list:** Ready. Only the list membership is added, and the name isn't changed (open question).
- **Unsubscribed, bounced or complained** (contact status, or a suppression record for that advisor): **always skipped and shown with a reason.** There's no re-subscribe toggle. Server-enforced.
- **Invalid:** skipped.
- Flagged rows can't be switched to Ready in v1. The user fixes them at the source and pastes again.
- New list: create the list and add the rows in the same server call. If the import fails, roll back the new list.

## Server method (sketch)
`contacts.pasteImport({ advisorId?, rows:[{email, firstName?, lastName?}], target:{listId} | {newListName}, permissionConfirmed:true })`
- Auth: the advisor themselves, or admin/support acting as that advisor (Log in as attribution logged). Lists must belong to that advisor.
- Re-runs every client check: the cap (reject over 1,000), validation, in-paste dedupe, the list check and suppression. Returns `{added, skipped:[{email, reason}], listTotals}`.
- Atomic: on failure nothing is added (the `error` scene).
- No emails are sent (non-goal).
- `preview` is a separate read method, `contacts.pastePreview`, so flags come from the server and not only the client.

## Capped advisor search (AC-4, Alex's Nov 13 rule)
- Only for admin/support outside a Log in as session. Inside Log in as, the advisor is fixed (banner only).
- `advisors.search({ q, limit: 10, skip })`, returning `{ items:[{_id, name, email}], total }`. Field projection is name and email only. Server-side regex or index on name/email, with `limit` ≤ 10 enforced on the server.
- UI: "Showing 1–10 of N", Prev/Next. **Never loads all advisors.**

## Mobile vs desktop
- 390: A stacks in the panel, B is a full-screen dialog, and C stacks the preview under the paste box. The preview table hides the Row and Name columns and shows the name under the email. Buttons are full width, ≥44px.
- Desktop: B dialog max 820px wide, and the preview table scrolls inside the dialog.

## In scope / out of scope
In scope: the paste entry point, parsing, mapping, preview, target list (existing/new), admin context, cap, summary with CSV download of skipped rows, refreshing totals and pagination (#129 behaviour), and the server re-check.
Out of scope: .csv/.xlsx upload changes, Mailchimp import (#149, #916, #908), sending any email, tags on paste (possible follow-up), and editing flagged rows inline.

## AC mapping
| AC | Covered by |
|---|---|
| AC-1 entry point and paste box | `empty`, `pasted` |
| AC-2 auto-detect, header, override, Email required | `map`, `emailonly` |
| AC-3 preview, flags, counts, skipped by default | `preview`, `skipped` |
| AC-4 target list, admin acting as advisor, capped picker | `list`, `admin`, `picker` |
| AC-5 totals refresh and summary | `summary` |
| AC-6 no silent re-subscribe | `preview`, `skipped`, dedupe rules |
| AC-7 cap and server validation | `cap`, `importing`, `error`, server method |

## Open questions
1. Pick A, B or C.
2. Row cap: 1,000 is assumed, and the issue suggests a few thousand. Confirm.
3. Consent wording for skipped unsubscribed or bounced addresses (placeholder). Should a re-subscribe path ever exist? Assumed no.
4. Existing contact not on the target list: add the list only, and don't overwrite the name. OK?
5. Is an advisor picker needed outside Log in as, or is the banner enough?
6. Keep the permission checkbox required for paste (same wording as Add Contact)?

## Estimates (real agent hours: cloud agent build + FC Tester + fix loop)
| Direction | Build | FC Tester | Fix loop | Total |
|---|---|---|---|---|
| A inline panel | 5–8 h | 1–1.5 h | 1–2 h | **7–11.5 h** |
| **B modal wizard (recommended)** | 5.5–8.5 h | 1–1.5 h | 1–2 h | **7.5–12 h** |
| C full page | 7–11 h | 1.5–2 h | 1.5–2.5 h | **10–15.5 h** |

These include the shared parser, the server preview and import methods, and tests. Add about 1–1.5 h if the advisor picker is needed outside Log in as.

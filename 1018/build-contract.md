# #1018 Paste contacts to add email subscribers: build contract

Status: **Not agent-ready.** Direction B was picked on Nov 24 2026. Alex decides when this is agent-ready. Risk: **high** (Email Campaigns UI, `imports/ui/EmailCampaigns/**`), so Alex merges to main. Track: playground first.

Mocks: https://kartboy16.github.io/fc-mocks/1018/ (**B `b-wizard.html`, chosen**; A `a-inline.html` and C `c-fullpage.html` were not chosen and are out of scope). Scenes use `?s=<scene>`, and `&phone=1` gives the 390 view.

## Chosen direction: B (picked Nov 24 2026)
**B, the 3-step modal wizard** (1 Paste, 2 Match and preview, 3 Confirm). Build only B. It matches the existing Import CSV, Import from Mailchimp and Add Contact dialogs on Subscribers. The step gate makes the preview impossible to skip, it goes full screen at 390, and step 2 can later be reused by the CSV import (non-goal for now).

**Not chosen, out of scope:** A (inline panel, `a-inline.html`) and C (full page, `c-fullpage.html`). They stay published for reference only, so don't build from them.

## Entry point
- New outlined button **Paste contacts** in the Subscribers toolbar, next to Import CSV (`SESContacts.jsx`). Visible to advisors, and to admins and support in a Log in as session.
- Opens the B dialog (full screen on phones).

## Screens and states (scene keys)
| Scene | What it shows |
|---|---|
| `empty` | Empty paste box with help text. Check rows / Next disabled. |
| `pasted` | Rows pasted, line count and detected separator. |
| `map` | Column auto-detect with mapping dropdowns (Email / First name / Last name / Ignore this column), header-row toggle, and an inline preview. Continue is disabled if no column, or more than one column, is Email. |
| `emailonly` | No header and one column: auto-mapped to Email, names stay blank. |
| `preview` / `skipped` | Counts, a per-row result with a reason, and filter chips (All, Ready, Skipped, each reason). |
| `list` | Target list: existing list dropdown, or a new list with a required name. |
| `admin` | Log in as session: "Adding to: Jane Advisor" banner only (no picker, no Change advisor link), only that advisor's lists, and dedupe checked against that advisor. |
| ~~`picker`~~ | **Not in scope** (decision 5). Removed from B; only A and C still show it, for reference. |
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
6. Row cap: **1,000 data rows per paste (decision 2)**. Over the cap, block preview until the user keeps the first 1,000 or clears.

## Dedupe and suppression rules
- **Duplicate in paste:** the first occurrence (by normalized email) wins, later ones are skipped.
- **Already on list:** an existing contact already on the target list is skipped, and its name isn't overwritten.
- **Existing contact not on the target list:** Ready. Only the list membership is added, and the name isn't overwritten (decision 4).
- **Unsubscribed, bounced or complained** (contact status, or a suppression record for that advisor): **always skipped and shown with a reason.** There's no re-subscribe toggle or path (decision 3). Server-enforced.
- **Invalid:** skipped.
- Flagged rows can't be switched to Ready in v1. The user fixes them at the source and pastes again.
- New list: create the list and add the rows in the same server call. If the import fails, roll back the new list.

## Server method (sketch)
`contacts.pasteImport({ rows:[{email, firstName?, lastName?}], target:{listId} | {newListName}, permissionConfirmed:true })`
- Auth: the advisor themselves, or admin/support acting as that advisor (Log in as attribution logged). Lists must belong to that advisor.
- Re-runs every client check: the cap (reject over 1,000), validation, in-paste dedupe, the list check and suppression. Returns `{added, skipped:[{email, reason}], listTotals}`.
- Atomic: on failure nothing is added (the `error` scene).
- No emails are sent (non-goal).
- `preview` is a separate read method, `contacts.pastePreview`, so flags come from the server and not only the client.

## Advisor context (AC-4)
- **No advisor picker** (decision 5). An admin or support person pastes for an advisor only inside a Log in as session, where the advisor is fixed and the "Adding to: Jane Advisor" banner shows.
- The server takes the advisor from the Log in as session, not from the client. Lists must belong to that advisor. If a picker is ever wanted, Alex's Nov 13 rule applies (server search, limit 10, paging, name/email projection), but it isn't part of this build.

## Mobile vs desktop
- 390: the B dialog is full screen. The preview table hides the Row and Name columns and shows the name under the email. Buttons are full width, ≥44px.
- Desktop: B dialog max 820px wide, and the preview table scrolls inside the dialog.

## In scope / out of scope
In scope: the paste entry point, parsing, mapping, preview, target list (existing/new), admin context, cap, summary with CSV download of skipped rows, refreshing totals and pagination (#129 behaviour), and the server re-check.
Out of scope: directions A and C, any advisor picker, .csv/.xlsx upload changes, Mailchimp import (#149, #916, #908), sending any email, tags on paste (possible follow-up), and editing flagged rows inline.

## AC mapping
| AC | Covered by |
|---|---|
| AC-1 entry point and paste box | `empty`, `pasted` |
| AC-2 auto-detect, header, override, Email required | `map`, `emailonly` |
| AC-3 preview, flags, counts, skipped by default | `preview`, `skipped` |
| AC-4 target list, admin acting as advisor (banner only) | `list`, `admin` |
| AC-5 totals refresh and summary | `summary` |
| AC-6 no silent re-subscribe | `preview`, `skipped`, dedupe rules |
| AC-7 cap and server validation | `cap`, `importing`, `error`, server method |

## Decisions (Nov 24 2026)
1. **Direction:** B, the 3-step modal wizard. A and C are not chosen and are out of scope.
2. **Row cap:** 1,000 rows per paste. The server rejects more.
3. **Unsubscribed and bounced/complained:** always skipped and shown with a reason, with no re-subscribe path. The consent wording in the preview stays a placeholder until Alex supplies it.
4. **Existing contact not on the target list:** added to the target list without overwriting their name.
5. **Advisor picker:** none outside Log in as. Inside Log in as, only the "Adding to" banner shows.
6. **Consent checkbox:** required: "These people gave me permission to email them." The server rejects the call without `permissionConfirmed:true`.

## Estimate (real agent hours: cloud agent build + FC Tester + fix loop)
| Direction | Build | FC Tester | Fix loop | Total |
|---|---|---|---|---|
| **B modal wizard (chosen)** | 5.5–8.5 h | 1–1.5 h | 1–2 h | **7.5–12 h** |

This includes the shared parser, the server preview and import methods, and tests. A and C aren't estimated because they weren't chosen.

# #908 addendum: offer a confirmation email when Add hits a Mailchimp compliance state

**Status:** Not agent-ready. Soft Dev hold until a direction is picked.

**Risk:** high, same as #908. This writes to a live Mailchimp audience and sends an email to a real person through Mailchimp. Build to staging first. FC Tester uses a **test Mailchimp audience only**, with addresses the tester controls.

**Builds on:** Direction A (table plus side drawer), already on staging through #914 and #959, mock revision 974d143. Nothing in A changes except what is listed here. Rows still show only **Edit** and **History**. Unsubscribe, Remove and Permanently delete stay in the Edit drawer footer. There is no bulk select.

## Request
Alex (via Chief of Staff, Nov 19, 2026): when an advisor adds an email address that Mailchimp holds in a **compliance state** (the person unsubscribed before, so Mailchimp refuses to add them back directly), Add should offer to send a **confirmation (opt-in) email**. The contact then sits in **Pending** until they confirm. Today (#959) the advisor only gets an explanation.

Mock: https://kartboy16.github.io/fc-mocks/908/optin/

## Recommendation
**Option 1: an inline notice inside the Add drawer, with a primary "Send confirmation email" button. 5–9 agent hours.**
- Add stays in one place. The advisor keeps the name, consent source and consent checkbox they already entered, and decides without losing context.
- One extra tap, no second layer on top of the drawer. It works the same at 390 (the primary button sits on top of the stacked footer).
- The already-pending case reuses the same slot with "Resend confirmation email".

**Option 2 (6–10 h):** the Add drawer stays behind and a confirm dialog opens after Save. Most familiar pattern and the same copy, but a dialog on a drawer is a layer on a layer, and at 390 it becomes a bottom sheet over a full-screen drawer.

**Option 3 (8–13 h):** no blocking step. Save closes the drawer, the existing Unsubscribed row is highlighted, and a strip under the row offers "Send confirmation email". Least intrusive, but it breaks the "rows show only Edit and History" rule while the strip is up, needs row-level state (offer, sending, failed, already pending) in the list, and is easy to miss on a long list at 390.

## What happens in Mailchimp (assumptions to verify on a test audience)
- Today, Add sends `PUT /lists/{list_id}/members/{subscriber_hash}` with `status=subscribed`. For a member Mailchimp holds in a compliance state it returns HTTP 400 with the title **Member In Compliance State**. #959 already maps this to a clear message. Use that same mapping as the trigger for the offer. Do not string-match the message text; match the title or error type.
- The offer sends the same call with `status=pending`. Mailchimp emails the contact a confirmation link, and the member becomes `pending` until they confirm. Verify this on the test audience.
- **Cleaned** (bounced) and permanently deleted addresses cannot be offered this. They keep the existing error message and show no offer.
- Resend of a confirmation to a member who is already `pending`: Mailchimp may not resend on a plain `pending` update. Verify on the test audience whether resend needs a different call, and whether Mailchimp limits how often a confirmation can be sent. The mock has no cooldown copy. **Placeholder:** allow one resend per contact per 24 hours and show "Try again later" if blocked. Final rule to be set after the test.
- Confirmation by the contact is done on Mailchimp's page. FC does not receive a webhook in this slice. The Pending status updates the next time the list loads. Webhooks are out of scope.

## Screens and states
All three options share the list, the Pending row and the Pending Edit and History views. Scenes are `?s=` values on each option page (`opt1-inline.html`, `opt2-dialog.html`, `opt3-row.html`); add `&phone=1` for 390.

| Scene (`?s=`) | Options | What it shows |
| --- | --- | --- |
| `list` | 1, 2, 3 | Subscribers list. Jordan Sample (`jordan.sample@example.com`) is Unsubscribed. Casey Example (`casey.example@example.com`) is already Pending. |
| `add` | 1, 2, 3 | Add drawer filled in for `jordan.sample@example.com`, consent ticked. Add subscriber starts the flow. |
| `add-pending` | 1, 2, 3 | Same, for `casey.example@example.com`. Add subscriber starts the already-pending flow. |
| `offer` | 1, 2, 3 | The offer. 1: warning notice in the drawer, footer primary becomes Send confirmation email. 2: confirm dialog over the drawer. 3: drawer closed, strip under the Unsubscribed row plus a toast. |
| `sending` | 1, 2, 3 | Spinner and "Sending…", buttons disabled, fields locked. Double submit is blocked. |
| `sent` | 1, 2, 3 | Drawer or dialog closes. The contact is at the top of the list as **Pending** with "Confirmation sent Nov 19". Toast: "Confirmation email sent to jordan.sample@example.com. Their status is Pending until they confirm." |
| `failed` | 1, 2, 3 | "Couldn't send the confirmation email. Mailchimp didn't accept the request. Nothing was changed, and jordan.sample@example.com is still Unsubscribed. Try again in a moment." Primary: Try again. |
| `already` | 1, 2, 3 | Add for an address that is already Pending. Nothing new is added. 1: info notice with Resend confirmation email (primary) and View subscriber. 2: dialog "Already waiting for confirmation" with Resend and Close. 3: strip on Casey's row with Resend and Dismiss. |
| `resent` | 1, 2, 3 | After Resend: Casey moves to the top, last changed updates, toast "Confirmation email sent again to casey.example@example.com. Their status is Pending until they confirm." |
| `edit-pending` | all | Edit drawer for a Pending contact. See below. |
| `history-pending` | all | History tab with the confirmation request and any resend. |

### Pending in the list
- Status chip **Pending** (amber) with a small line "Confirmation sent Nov 15". At 390 the line sits after the chip in the card meta.
- Rows keep only **Edit** and **History**. No resend button on the row.
- Pending contacts do not get campaigns until they confirm. Show the same chip everywhere the status appears.

### What an advisor can do with a Pending contact (Edit drawer, Profile tab)
- A "Waiting for confirmation" notice at the top of the drawer: when the email was sent, and that they get no campaigns until they confirm.
- **Resend confirmation email** (primary, subject to the resend limit above).
- **Cancel the request**: returns the contact to Unsubscribed (`PATCH status=unsubscribed`). Logged in History.
- Name, phone, city and tags stay editable.
- **Remove** is disabled while Pending, matching #959 (Remove is refused on Pending and Cleaned). Tooltip: "Remove isn't available while a contact is Pending".
- **Permanently delete** stays available, with the existing type-to-confirm.

### History entries (audit log, FC-side)
- "Jane Advisor asked Mailchimp to send a confirmation email to jordan.sample@example.com. Status is Pending until they confirm" (this wording matches today's re-subscribe entry).
- "Jane Advisor sent the confirmation email again to casey.example@example.com. Status is Pending until they confirm".
- A failed send changes nothing in Mailchimp, so it is not a history entry. It is an error-level server log with the email masked (as in #959).
- "Who" is the FC advisor display name, as in #908.

## Copy
- Offer title (1): "{email} unsubscribed earlier". Body: "Mailchimp won't add someone back after they unsubscribe. Mailchimp can email them a confirmation link instead. They stay Pending, and get no campaigns, until they confirm."
- Primary button, all options: **Send confirmation email**. Sending: **Sending…**. Retry: **Try again**.
- Option 2 title: "Send a confirmation email?". Option 3 strip: "Not added. {email} unsubscribed earlier." and toast "{email} wasn't added: they unsubscribed earlier."
- Already pending (1 and 3): "{email} is already Pending" / "We emailed them a confirmation link on Nov 15, 2026, 4:05 PM PT. They haven't confirmed yet, so nothing new was added." Option 2 title: "Already waiting for confirmation".
- **Placeholder, CASL and consent copy:** "[Placeholder CASL copy, to be confirmed by compliance] Only send this if they asked to hear from you again." This is marked as a placeholder in the mock. Compliance must set the final wording, and decide whether the advisor's existing consent checkbox is enough for someone who has unsubscribed, or whether the confirmation email must be the only consent. Do not ship the placeholder as final legal copy.
- The Add drawer's existing note ("They will not get a confirmation email when you add them here.") is hidden once the offer is shown, because it would now be wrong.
- Advisor-facing copy uses "confirmation email" and "Pending", never "double opt-in" or "compliance state". It never names the platform's marketing domain.

## In scope
- Detect the Mailchimp compliance-state error on Add and return a typed result to the client (for example `{ offer: "confirmation", email }`) instead of only an error string.
- A server method that sends the confirmation by setting `status=pending`, with advisor-scoped auth, the same `mailchimpFetch` pattern, double-submit protection, and an audit entry.
- A server method to resend, and one to cancel the request (back to Unsubscribed).
- The chosen option's offer UI and the states above, the Pending chip and sub-line, the Pending Edit and History views, 1280 and 390.
- **Caps on every subscriber or user lookup:** list calls keep `count=50`, `offset` paging and `fields=` projection. The already-pending check on Add looks up one member by subscriber hash with `fields=` limited to `status` and the last-changed time. It never loads the audience or searches without a limit. Any audit-history read for the Pending view uses a limit, paging and field projection.
- Tests with stubbed Mailchimp HTTP for: compliance error to offer, success to pending, failure with nothing changed, already pending, resend allowed and blocked, cancel request. FC Tester runs the real flow against a test audience.

## Out of scope
- Mailchimp webhooks or any automatic refresh of Pending to Subscribed.
- Offering this for Cleaned or permanently deleted addresses.
- A status filter or "Pending" count on the list. A bulk resend. CSV import.
- Customizing the confirmation email Mailchimp sends.
- Any Mailchimp to FTT Mail sync.
- Final CASL or legal wording (placeholder only).
- Changing Direction A's rows, drawer, or the three removal actions.

## Desktop vs mobile
- 1280: Add is the 480px right drawer. Option 2's dialog is centered over it. Option 3's strip is a full-width row under the contact.
- 390: the drawer is full screen with a stacked footer (primary on top, 44px targets). Option 2's dialog is a bottom sheet. Option 3's strip stacks its buttons inside the card and the list scrolls to it.

## Agent-time estimate (hours, cloud build plus FC Tester plus fix loop)
| | Option 1 | Option 2 | Option 3 |
| --- | --- | --- | --- |
| Cloud agent build | 3–5 | 4–6 | 5–8 |
| FC Tester | 1.5–2.5 | 1.5–2.5 | 2–3 |
| Fix loop | 0.5–1.5 | 0.5–1.5 | 1–2 |
| **Total** | **5–9 h** | **6–10 h** | **8–13 h** |

These are on top of #914 and #959, not a rebuild of #908.

## Open questions
1. Compliance review: is the advisor's consent checkbox enough to offer a confirmation to someone who unsubscribed, and what is the final wording? (Recommended: review before build.)
2. Resend limit: after the test-audience check, what is the cooldown and the message when Mailchimp refuses? (Placeholder: one per 24 hours.)
3. Should "Cancel the request" exist in this slice, or only Resend? (Recommended: keep it, it is one `PATCH` and gives a way out of a mistaken offer.)
4. Do we want Pending to refresh without a page reload once the contact confirms? (Recommended: no, later with a webhook.)

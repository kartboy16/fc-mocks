# #824 Admin: send an HTML post to multiple advisors, with optional social and email (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** **Current recommendation: D** (Alex asked for the Content card share-menu placement and did not pick A/B/C). This is **`risk:high`**: it publishes HTML posts, can schedule social posts, and can create email campaigns (so it can lead to email going out). Track: playground / staging with QA advisors and QA inboxes only. Alex merges any main PR.

## Ask (Alex, Nov 5 2026)

After creating an HTML post, admins should be able to send it to multiple advisors, and optionally attach a social post (for advisors with social / social-basic / **social-main**) and/or an email campaign (for advisors with email-content).

## Grounding

### Apps for Advisors (parity source, `b8ea141`)
- Modal: `imports/ui/pages/admin/manage_html_posts/send_htmlPost_modal_v2.jsx` (older twin: `send_html_post_modal.jsx`).
- Title: `Send post "{name}" to multiple advisors`.
- Left: post preview. Right: multi-select advisors, publish date/time, post status, allow comments.
- Toggle **Create Mailchimp campaign for Email-Content Advisors** (send path also supports SES / MailerLite). Applied only when `advisorCategories` has slug `email-content` and provider setup exists.
- Toggle **Send as a social post**. Composed once; AFA attaches only for `social` or `social-basic`. **FC must also include `social-main`** (Alex).
- AFA extras **out of scope** unless Alex asks after seeing mocks: "Send emails with this post", "Send compliance email", "Send as Page".

### FinancialContent today (staging `83fc850`)
- **#47 / #186** `PostForMultipleAdvisors.jsx`: social only. Picker already includes Social / Social - Basic / Social - Main (`imports/utils/socialAdvisorTag.js`).
- **#809**: admin send emails for several advisors — email-only. Mocks at `/809/`. Related as another multi-advisor surface; **not this feature**.
- HTML posts: Content Library / `CreateHtmlPostPage`.
- White-label: client-facing post, share and email URLs use the advisor domain (`yourfirm.ca`), never `financialcontent.ca` (`fc-white-label-links`).

## Directions (placement)

| | A. After Save on the HTML post (recommended) | B. Extend "Post for multiple advisors" | C. Dedicated admin send page |
|---|---|---|---|
| Where | Content Library / create-or-edit HTML post → Save → "Send to multiple advisors" wizard | Existing admin tab grows a "Send post" mode alongside the social-only flow | New admin page; hub can later sit next to #809 |
| Flow | 1 Advisors → 2 Extras (publish, social toggle + compose, email toggle) → 3 Review (preview + who gets what) → Send → 4 Done | Pick HTML post, pick advisors, extras, review drawer, Send | Pick post from library, extras + advisors side by side, confirm dialog |
| Strength | Matches Alex's starting point; leaves #47/#186 and #809 alone | Reuses the known multi-advisor picker | Scales if more "send X to many" tools appear |
| Weakness | Only starts from a just-saved (or opened) post | Mixes social-only and HTML+extras; easy to confuse; denser | Another admin destination; risk of quietly merging with #809 |

| | **D. Share menu on Content card (recommended)** |
|---|---|
| Where | Content tab card → Share picker → admin-only “Send to multiple advisors” |
| Flow | Same multi-advisor internals as A after the menu item |
| Strength | Matches how advisors already share; Alex’s asked placement; admin-gated |
| Weakness | Easy to miss if admins expect a top-level admin page |

## Shared behaviour (every direction)

1. **Every selected advisor gets the HTML post.**
2. **Also create a social post** (toggle): composed once; attached only if the advisor has social, social-basic or social-main. Others still get HTML; confirm shows "skipped: No social product".
3. **Also create an email campaign** (toggle): uses that advisor's lists, sender, and header/footer. Attached only if the advisor has email-content **and** a usable list/sender. **Alex locked:** every email-content advisor gets the **approval email** (Approve/Decline) — not only those with compliance on. Confirm shows "Will email for approval" for those advisors, or skip reasons "No email-content" / "No email list". Say **"email campaign"** everywhere, never "Mailchimp campaign".
4. **Also send compliance email** (toggle, AFA parity): only advisors with the Compliance product/tag. Emails compliance with a **PDF of the HTML post**, and a **PDF of the email campaign** when that extra is also on for the advisor (not skipped for no list/sender). Others skip with “No compliance”; HTML still sends.
5. **Publish:** Now, or Schedule with a shared date + time picker (shown when Schedule is selected). Review shows the chosen publish time.
6. **Confirmation** lists per advisor: HTML only / HTML+social / HTML+email / all three, plus skip reasons.
5. **Explicit Send** (POST). Progress and results: queued, waiting for approval, failed (with Retry).
6. **States:** ready, loading, empty, error, sending, done, done with 1 failed.
7. **White-label:** previews use `yourfirm.ca` / `example.com`. No FC links or branding on client-facing surfaces.
8. **Generic names only** (Jane Advisor, Sam Planner, Your Firm Name, …).



## AFA parity extras (Alex, Nov 5 evening)

The multi-advisor modal matches AFA `send_htmlPost_modal_v2.jsx` options (FC wording). **Send as Page is out — Alex said he does not need it.**

1. HTML post for every selected advisor
2. Publish Now / Schedule (shared date+time when Schedule)
3. Post status (Publish / Pending / Draft / Private)
4. Allow comments
5. Send emails with this post → each advisor’s **Send to Email** field; skip “No send-to email” without blocking HTML
6. Email campaign for email-content (never “Mailchimp campaign”); **every** email-content advisor gets the approval email; skip campaign only if no list/sender
7. Send as a social post (Edit); social / social-basic / **social-main**
8. Send compliance email; Compliance tag only; attaches PDF of HTML post (+ PDF of email campaign when that extra applies); skip “No compliance” without blocking HTML

Modal footer primary: **Schedule for advisors** (no second Send as Page action). Content-tab picker still only **Continue**.


## Direction D (recommended — Alex placement)

**Where:** Content Library Content tab → library card → **Share** → live `ShareDestinationPicker` (“Where should this go?”).

**Live match (staging `83fc850`):**
- Card Share button: `ContentLibraryPostCard.jsx` → `onShareMenuOpen`.
- Picker: `ShareDestinationPicker.jsx` + `shareDestinationPicker.js` — destinations **Website · Social · Email**, multi-select, Continue / Cancel. Desktop Popover (~340px); phone bottom Drawer.
- `AdminPostDistributionDialog.jsx` is a different admin distribute path; D matches the **card share picker**, not that dialog.

**UI:**
1. Content grid of library cards (generic titles).
2. Open Share → picker with Website / Social / Email unchanged.
3. **Admin only:** divider + **Send to multiple advisors**. Not combined with Website/Social/Email (those stay off/unselectable while it is on). One primary: Continue. Advisors never see this item (role switcher).
4. Multi-advisor flow opens as a **modal over the Content tab** (card grid stays visible behind). Steps stay in that modal: advisors → extras (shared Now/Schedule, optional social for social/social-basic/social-main, optional email campaign for email-content — **all** such advisors get the approval email) → review who gets what + skips → Send. Close or finish returns to Content.
5. White-label previews (`yourfirm.ca` / `example.com`).

**Estimate (agent time: cloud agent + FC Tester + fix loop) for D alone:** ≈4.5–6.25 h  
(share-menu gating + reuse of bulk HTML/social/email server path from A ≈4.25–6 h, plus ~20–40 min for the picker item, admin-only visibility, and FC Tester of advisor-hidden).

**Alex locked (Nov 5 2026):**
1. **Label:** “Send to multiple advisors” (not “Send to advisors”).
2. **Placement:** below a divider under Email (as shown).
3. **Interaction (Alex revised):** one primary footer action — **Continue** (no second “Send to multiple advisors” button). Selecting the admin item turns Website/Social/Email off and keeps them unselectable. Continue stays enabled and opens the multi-advisor modal over Content. Turning the admin item off and picking a destination restores the usual share path.

4. **Advisors:** hide the item entirely (role switcher).
5. **Chrome:** Continue (with the admin item selected) opens the multi-advisor flow as a modal overlaying the Content tab (not a new page).
6. **Email approval:** every email-content advisor gets the approval email when that extra is on.
7. **Compliance:** advisors with the Compliance tag get a compliance email when that extra is on — PDF of the HTML post, and PDF of the email campaign when that extra is also on for them; others skip without blocking HTML.
8. **Schedule:** Schedule reveals a shared date and time picker; Now is immediate. Review shows the publish time.

## Recommendation (superseded for placement)

**D** is recommended for placement (Alex). Earlier write-up for **A** as product flow internals (still reused inside D):

**A.** Alex asked for this right after creating a post, so the action belongs on that save moment. It keeps the existing social-only tab (#47/#186) for pure social work, and keeps #809 as the separate email-only tool. B forces two different jobs into one tab and makes the social-only path harder to find. C is fine later as a hub if we grow more "send to many" tools, but it shouldn't be the first home, and it should **not** merge with #809 unless we later decide both share an "Admin send" shell with clearly separate cards (the C mock shows that shell without merging the features).

## Server sketch (A)

- Admin-only methods (reuse `isAdminUserId`). No "Log in as".
- `htmlBulk.send({postId, advisorIds, publishAt, social?: {message}, email?: true, confirmToken})` (POST via DDP):
  - For each advisor: create/schedule the branded HTML post.
  - If `social` and advisor has social*: schedule social via the existing bulk social path (include **social-main**).
  - If `email` and advisor has email-content with list+sender: create an email campaign owned by that advisor and **always** send the approval email (Approve/Decline). Alex: all email-content advisors get the approval email, not only compliance-on.
  - Idempotent on `(bulkSendId, advisorId)`. Stagger like social bulk.
- Audit: `adminId`, `createdVia: 'bulk-html-admin'`.

## Out of scope

AFA's "Send emails with this post", compliance-PDF email, "Send as Page"; redesigning the social-only tab unless B is picked; merging into #809 unless a later hub is chosen; non-admin roles.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

| Run | A | B | C |
|---|---|---|---|
| Server: admin bulk HTML publish + optional social (incl. social-main) + optional email campaign create, skip reasons, stagger, audit, tests | 2–2.75 h | 2–2.75 h | 2–2.75 h |
| UI (picker, extras, confirm, states, white-label previews) | 1.25–1.75 h (wizard on post) | 1.5–2 h (extend tab, keep social-only) | 1.5–2 h (new page + optional hub shell) |
| FC Tester: mix of product combos, skips, compliance email → approval, 1280/390, no FC links | 50–70 min | 55–75 min | 50–70 min |
| Fix loop + security review | 25–40 min | 30–45 min | 25–40 min |
| **Total** | **≈4.25–6 h** | **≈4.75–6.5 h** | **≈4.5–6.25 h** |

## Open questions

1. **Publish time:** one shared time for all selected advisors (proposed, like AFA), or per-advisor?
2. **Email campaign / approval email:** **Locked by Alex** — all email-content advisors get the approval email (not only compliance-on). Still skip if no list/sender.
3. **Post status and allow-comments defaults:** match AFA (`publish`, comments off), or follow each advisor's site defaults?
4. **HTML posts:** publish immediately vs schedule only? (Proposed: Now or Schedule, same control for all.)
5. **Placement vs existing tools:** keep social-only tab and #809 separate (proposed with A), or later share an Admin send hub (C's shell)?
6. **email-content but no sender or list:** skip email with a clear reason (proposed), or block the whole send for that advisor?
7. **social-main:** confirm FC attaches social for social-main (yes per Alex; AFA today does not).

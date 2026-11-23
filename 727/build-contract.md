# #727 Advisor-started one-step WordPress connection (Website tab)

**Status:** Not agent-ready. Soft Dev hold until a direction is picked.

**Risk:** **high.** This flow changes a live advisor website: it adds a server rule (`.htaccess` Authorization pass-through) and stores a WordPress application password. A backup must be saved **before** any server-rule change, the change must be verifiable and reversible, and it goes to staging first, then FC Tester, then Alex merges.

## Sources (read-only)
- Issue [#727](https://github.com/kartboy16/content-library/issues/727) (website connection, step 2 of the onboarding series) and its earlier mocks, kept at [`v1/`](v1/index.html) as "Earlier mocks". Those cover onboarding detection, managed-by-us queue, snippet and plugin paths; this set is a different entry point.
- Request from Alex via Chief of Staff, Nov 19, 2026, 11:13 AM PT: the advisor types their site address on the Website tab and clicks **Connect**; there is no site list; the backend matches the domain to our Cloudways app; the advisor approves once on their own WordPress approval page; we then verify, back up, add the server rule and test publishing; then show Connected.
- Existing code (read, not changed): `server/website-publisher/wordpress-setup-service.js` already has `patchHtaccess` (adds the `HTTP_AUTHORIZATION` rule, skips if present, writes a `.cl-backup-<timestamp>` copy first) and `runCloudwaysWordpressSetup` over SFTP; `imports/api/cloudwaysApi.js` has `cloudways.getAppList` (admin-only, returns everything, no paging) and `cloudways.patchHtaccessForJwt`; `server/website-publisher/wordpress-credentials.js` holds credentials. The new flow replaces the manual `WordpressSetupWizard.jsx` path for sites we host; it must reuse these steps rather than duplicate them.
- WordPress core Application Passwords: `/wp-admin/authorize-application.php?app_name=…&success_url=…&reject_url=…&app_id=…`. WordPress shows its own screen (the mock labels it "WordPress screen (context)"); we only control the app name, the success and reject return URLs and the app ID. On approval WordPress redirects to `success_url` with `user_login` and `password`; on reject it redirects to `reject_url` (or `success_url` with `success=false`).

## Recommendation
**A. An inline card on Website → Settings with a 4-step stepper. About 12–18.5 agent hours.** One card holds the whole journey (Your website, Approve, Connecting, Connected), so the advisor never loses their place, the return from WordPress lands on the same card, and every error appears in the same spot with its fix. It is the smallest UI build and reuses the existing Website settings page.

- **B. Guided full page (13.5–20.5 h).** A focused page with a progress bar, a short "what happens next" list and full-page result screens. Calmer, but it adds a route and a second place to maintain.
- **C. Modal over the Website tab (12.5–19.5 h).** A dialog (bottom sheet at 390) on top of a status card. Fast to open, but the return from WordPress has to re-open the dialog and a modal is a poor home for the progress and error detail.

Directions share one backend. They differ only in the UI shell.

## The flow (all directions)
1. **Enter URL.** One field and **Connect**. The backend normalises the address to a domain and matches it to one of our Cloudways apps. The advisor never sees a list. No match: **Not hosted by us** state, no server changes.
2. **Approve in WordPress.** Redirect to the advisor's own `/wp-admin/authorize-application.php` with a signed `state` token that ties the return to the advisor and website. If they aren't logged in, WordPress shows its login first (mocked as "Login first"). They see the approval and click Approve or Reject.
3. **Connecting.** WordPress sends them back to the Website tab. A job runs four plain steps: *Checking your website login*, *Saving a backup of your website*, *Allowing FinancialContent to post*, *Publishing a test post*. The page updates by polling a small status call.
4. **Connected.** Success state with the website, the time and "Backup saved". Nothing is shown about passwords or server files.

## Screens and scenes
Scene switcher in every direction (`?s=`), plus `&phone=1` for 390.

| Scene (`?s=`) | Where | Notes |
| --- | --- | --- |
| `url` | Website tab | Field + Connect. Sub-states: `v=filled`, `v=empty`, `v=invalid`, `v=checking`. |
| `wp` | WordPress (context) | Approve screen; `v=login` shows WordPress login first. Same in A, B and C; labelled as a WordPress screen. |
| `connecting` | Website tab | Four steps; `p=1..4` shows which step is running. Approved-in-WordPress line on top. |
| `connected` | Website tab | Success, with Done, View my news page, Disconnect website. |
| `err-domain` | Website tab | Domain isn't hosted by us. Email support. No changes made. |
| `err-apppw` | Website tab | Application passwords disabled (for example by a security plugin). Names the setting; Try again or Contact support. |
| `err-reject` | Website tab | Clicked Reject. Connect again or Cancel. No changes made. |
| `err-role` | Website tab | Not an administrator or editor. Try again with another account or Contact support. |
| `err-test` | Website tab | Test publish failed after backup and rule. Try the test again or Contact support. |

## States
| State | Behaviour |
| --- | --- |
| Empty | Website tab not connected: field empty, **Connect** enabled. Empty or malformed submit shows the inline hint; nothing is sent. |
| Loading | `v=checking` (matching the domain) and `connecting` (four steps; the active step shows a spinner, finished steps a tick, later steps are dimmed). Navigating away is safe; the job continues and the Website tab shows "Connecting…" until done. |
| Error | The five error scenes. Each says what happened, what has and hasn't changed, and the next action. A failed step never leaves a half-applied change: see rules below. |
| Success | Connected badge, website, time, "Backup saved". Replaces the earlier manual WordPress setup status. |

## Copy
- Card title: **Connect your website**. Helper: “Enter your website address and we’ll connect it to your news page.” Hint: “No need to log in to anything yet. You’ll approve the connection once in WordPress.”
- Field: **Website address**, placeholder `example-advisor.ca`. Button: **Connect**. Invalid: “Enter your website address, like example-advisor.ca.”
- Progress: “Approved in WordPress by Jane Advisor”; **Checking your website login**; **Saving a backup of your website**; **Allowing FinancialContent to post**; **Publishing a test post**. Footer: “Keep this page open. This usually takes under a minute.”
- Connected: **Your website is connected**. “FinancialContent can now publish your posts to the news page on example-advisor.ca. We published a test post and removed it again.” Buttons: **View my news page**, **Done**, **Disconnect website**.
- Not hosted: **We can’t connect example-advisor.ca ourselves**. “This website isn’t hosted with us, so we can’t set it up in one step. Our team can help you connect it.” support@financialtechtools.ca. Buttons: **Email support** (mailto, prefilled with name, firm and website), **Try a different address**. Chip: “No changes were made to your website.”
- App passwords off: **WordPress isn’t allowing connections yet**. “A security setting on example-advisor.ca is blocking the approval step. Switch this setting off, then try again:” In your security plugin (for example Wordfence) find **Disable WordPress application passwords** and make sure it is turned off. “Not sure where to find it? Our team can do this with you.” Buttons: **Try again**, **Contact support**. *(Placeholder: confirm the exact menu name and path for each supported plugin before build; add other plugins only after checking.)*
- Rejected: **You didn’t approve the connection**. “No problem. You can connect again whenever you’re ready.” Buttons: **Connect again**, **Cancel**.
- Wrong role: **An administrator or editor needs to approve**. “The WordPress account you used can’t approve this connection. Ask an administrator or editor of example-advisor.ca to approve it, or sign in with that kind of account and try again.” Buttons: **Try again with another account**, **Contact support**.
- Test failed: **Almost there: the test post didn’t publish**. “Your website approved the connection and your backup is saved, but the test post didn’t go through. Nothing has changed on your news page.” Buttons: **Try the test again**, **Contact support**.
- WordPress screen (context) is WordPress’s own text; buttons read “Yes, I approve of this connection” and “No, I do not approve of this connection”. The mock uses WordPress’s real wording; we cannot change it.
- Use “website” and “news page” in all advisor-facing copy. No technical terms (htaccess, REST, token) in advisor copy. Fixtures: Jane Advisor, Your Firm Name, example-advisor.ca.

## Rules for the build
- **Server-rule changes need a backup first and are high-risk.** Order is fixed: (1) read the current file, (2) save a timestamped backup and confirm it was written, (3) apply the rule only if it isn't already present (idempotent), (4) re-read to confirm, (5) test with an authenticated REST call, (6) on any failure after (3), restore the backup and report **err-test**. Never overwrite the backup. Never edit a file when the backup step failed. Take a per-site lock so two clicks or two tabs can't run the job twice.
- **Lookups are capped.** The domain match must not call `cloudways.getAppList` and filter in the browser. Use a server-side lookup by normalised domain against a cached or indexed table of managed apps, with `limit` (≤ 20), paging for any staff list, and a field projection (app ID, server ID, domain only). Never send app lists, credentials or server details to the advisor's client. User/advisor lookups in the job use the same limit, paging and projection.
- **Credentials.** The application password arrives once at our callback over HTTPS, is stored encrypted, is never shown or logged, and is never put in a URL we show. The callback checks the signed `state`, the advisor session and that the returning domain matches the website that started the flow. Disconnect removes our stored password and asks WordPress to revoke it where possible.
- **Email and links.** No email link approves or changes anything. This flow has no emailed links.
- **White-label.** Advisor and client pages (Insights posts, share and email links) never link to the FC app domain. This flow lives only in the advisor app; the name FinancialContent appears only in the advisor-facing app and on WordPress’s own approval screen.
- **Do not regress** existing WordPress publishing via `setWebsiteDelivery`, the PHP method, embed API, or sites already connected. A site that already has the rule and a working login shows Connected without re-running the backup.
- Never block social or AI crawlers on the advisor’s site.
- Error handling: map each failure to exactly one scene. Not hosted, application passwords disabled, rejected, wrong role, test failed. Anything unknown falls back to **err-test** wording with Contact support, and logs a support-visible reason code (no secrets).

## In / out of scope
**In:** one URL field and Connect on the Website tab; server-side domain match; redirect to the advisor’s WordPress approval page; return handler; four-step connect job (login check, backup, rule, test post); Connected state; the five error states with the actions above; Disconnect; 1280 and 390; generic fixtures; tests for each error path and a failed-rule restore.

**Out of scope:** the onboarding platform detection and branding pull (#724 and the `v1/` mocks); Wix, Squarespace and other platforms; sites we don’t host (they only get the support path); plugin download; changing the PHP or embed methods; a site list or picker; the staff queue for onboarding detection (the separate support and admin tool below is its own pick); emailing links to a web person; redesigning the Website tab.

## Desktop vs mobile
- **1280:** A: card inside Website → Settings with a horizontal stepper beside the 90px rail. B: full-width page with a centered 600px panel and a top progress bar. C: a 520px centered dialog over the Settings tab.
- **390:** rail behind the menu; stepper collapses to dots with only the current label; Connect and every action button are full width and at least 44px tall; B’s panel is full width; C’s dialog becomes a bottom sheet; WordPress screen is WordPress’s own responsive layout.

## Agent-time estimate (real agent hours: cloud agent build + FC Tester + fix loop; no human days)
| | A (recommended) | B | C |
| --- | --- | --- | --- |
| Run 1: domain match (capped lookup), start and callback endpoints, `state` token, role/app-password detection | 2–3 | 2–3 | 2–3 |
| Run 2: server rule with backup, verify, rollback (high-risk) | 2.5–4 | 2.5–4 | 2.5–4 |
| Run 3: connect job, progress status call, test post, error mapping, disconnect | 2–3 | 2–3 | 2–3 |
| Run 4: UI | 2–3 | 3–4.5 | 2.5–3.5 |
| **Cloud agent build** | **8.5–13** | **9.5–14.5** | **9–13.5** |
| FC Tester (staging) | 2–3 | 2.5–3.5 | 2–3.5 |
| Fix loop | 1.5–2.5 | 1.5–2.5 | 1.5–2.5 |
| **Total** | **12–18.5 h** | **13.5–20.5 h** | **12.5–19.5 h** |

Runs 2 to 4 can run in parallel after run 1; wall-clock for A is roughly 6–9 h. Run 2 has the most risk and should reach staging first with a dry-run mode.

## Addition: support and admin manual setup tool (separate pick)
Alex, Nov 23, 12:06 AM PT (via Chief of Staff): bring back a manual setup path, but for **support and admin only**. The advisor’s only path stays the Connect card above. Reconnect is coming as a separate addition and is **not** part of this pick.

**Mock:** `support-setup.html` (`?s=queue|req|progress|failed|done|noaccess|adv-requested|adv-progress|adv-failed`, `&phone=1` for 390). Staff scenes use Pat Admin and Sam Support; advisor scenes use Jane Advisor, example-advisor.ca, Your Firm Name.

### Rules
- **Staff only.** The page, the queue and every server method behind it check the role (support or admin) on the server, not just in the UI. An advisor who opens the URL gets **No access** (`noaccess`) and no data.
- **No username/password form for advisors, ever.** The old WordPress username and application-password fields are removed from every advisor-facing screen. Advisors see only the Connect card, or a status message when our team is helping (`adv-requested`, `adv-progress`, `adv-failed`). No credential fields, no technical error text, no rule snippets.
- **Covers:** (1) websites we don’t host; (2) advisors stuck partway through a manual setup. Statuses: **Requested**, **In progress**, **Failed**, plus **Connected** when done.
- **How a request is created (assumption):** the advisor’s “Email support” or “Contact support” on the Connect card (not hosted, app passwords off, test failed) also opens a request automatically, with the reason. Staff can also open a request for an advisor. Existing half-finished manual setups are listed as “Stuck partway”.
- **Same job as the Connect card.** The tool runs the same four steps (confirm address, check login, save backup, test post). Servers we host get the same backup-first server rule. For servers we don’t host we **never** change the server: if the test post fails for a missing login header, staff see the rule text to send to the host or web person.
- **Credentials.** The application password is stored encrypted, never shown again after save and never logged. To replace it, staff paste a new one. Only Save progress and Check login and connect read it, server-side.
- **Capped lookups.** The queue is paged (default 20, max 50) with `limit`, `skip`/cursor, field projection (advisor name, email, domain, reason, status, updated) and filters by reason and status. Never load all advisors, apps or credentials. The advisor status call returns only their own request status.
- **Activity log.** Every action (request, start, save login, check, note, email, resolve) records who and when, shown on the request.
- **Email advisor** opens a prefilled draft for staff to send; the tool never sends mail by itself, and no email link approves or changes anything.

### Screens and states
| Scene | Who | What |
| --- | --- | --- |
| `queue` | Pat Admin | Paged list with filters (All, Not hosted by us, Stuck partway, Requested, In progress, Failed), status badges, Open. At 390 rows stack as cards. |
| `req` | Sam Support | Requested, not hosted by us. Steps all pending; form empty; note that we can’t change the server; **Start setup**. |
| `progress` | Sam Support | Stuck partway, In progress. Steps done up to the test post; login saved (masked); **Check login and connect**, Save progress. |
| `failed` | Sam Support | Failed at test post. Plain reason, last step reached, rule text for the host, **Check login and retry**, Add note, Email advisor. |
| `done` | Sam Support | Connected. Fields locked; advisor now sees Connected. |
| `noaccess` | Advisor | Only support and admin can open this page. |
| `adv-requested` / `adv-progress` / `adv-failed` | Advisor | Connect card replaced by “Our team will set up your website” / “is setting up” / “We’re still working on your website”. Contact support and Cancel request only. |

Empty queue: “No website setup requests.” Loading: skeleton rows. Error loading: “Couldn’t load requests. Try again.” Failed check: the **failed** state keeps the saved login and never half-applies a change; any server-rule change follows the backup-first order above.

### Copy (staff)
Page title **Website setup requests**; “Visible to support and admin only”; **Manual setup**; “Use this only when the advisor can’t connect on their own. The advisor never sees these fields.”; “We don’t host this website, so we can’t change its server. We’ll check the login and test publishing only.”; **Start setup**, **Save progress**, **Check login and connect**, **Check login and retry**, **Add note**, **Email advisor**; “Saved and encrypted. It can’t be shown again; paste a new one to replace it.”
Copy (advisor): “We got your request for example-advisor.ca. Our team will connect it for you and email you when it’s done. You don’t need to do anything.”

### In / out of scope
**In:** staff queue and detail; manual setup form (staff only); not-hosted and stuck-partway cases; requested / in progress / failed / connected; role checks on every method; advisor status messages; removal of the advisor-facing username/password form; activity log; 1280 and 390.
**Out of scope:** Reconnect (separate addition); Wix, Squarespace and other platforms; changing servers we don’t host; automatic emails; bulk actions; a staff dashboard beyond this queue.

### Desktop vs mobile
1280: dark admin rail, queue as a table, detail as steps and activity on the left with the form on the right. 390: queue rows as cards, detail stacks (steps, activity, form), full-width 44px buttons.

### Agent-time estimate for the tool (real agent hours: cloud build + FC Tester + fix loop)
| Part | Hours |
| --- | --- |
| Server: role-checked, capped queue and detail methods, request creation from Contact support, save/check/retry reusing the connect job, activity log | 2–3.5 |
| Advisor card status states, removal of the advisor username/password path | 0.75–1.25 |
| Admin UI (queue, detail, form, states, 390) | 2–3 |
| FC Tester (staff vs advisor access, each state, credentials never shown) | 2–3 |
| Fix loop | 1–2 |
| **Total** | **7.75–12.75 h** |

This is on top of the Direction A total above (12–18.5 h); it reuses A’s connect job, so it can start after run 3. It is high risk because it handles credentials and can change a website’s server rule on servers we host.

### Open questions (tool)
1. Do staff also see requests automatically created from Contact support, or only manually opened ones?
2. Who may see the tool: both support and admin (assumed), or admin only?
3. Should resolved requests stay listed (assumed: 30 days, then hidden)?

## Addition: Reconnect (Direction A, separate pick)
Alex, Nov 23, 12:05 AM PT (via Chief of Staff): “Why wouldn’t we allow reconnect? What if something weird breaks and they need to reconnect.” This addition is separate from the support/admin tool above and needs its own pick. It extends Direction A only.

**Mock:** `a-inline.html?s=` `connected` (now shows Reconnect), `rc-url`, `rc-wp` (`v=login` too), `rc-connecting` (`p=1..4`), `rc-done`, `rc-fail` (default: approval not completed; `v=test`: new approval didn’t pass our check). Add `&phone=1` for 390.

### Behaviour
- The Connect card is hidden once connected, so the Connected status gets a small text link **Reconnect**, after View my news page, Done and Disconnect website (secondary). Disconnect and the other Connected controls are unchanged.
- Reconnect reruns the same card and flow and **shows which website it is connecting to** (example-advisor.ca, Your Firm Name, Jane Advisor). The address is fixed, not editable. To use a different website the advisor disconnects first.
- **Delivery mode stays the same.** Reconnect never changes how news is delivered (`setWebsiteDelivery` is not touched).
- **The stored password is replaced only after a successful approval and check.** The new application password is held as pending, never overwriting the current one. It is promoted (replacing the old one, then revoking the old one in WordPress where possible) only after approval and the login check and test post succeed. Any failure, rejection, cancel, timeout or browser close **discards the pending one and leaves the existing credentials, status and Connected state untouched**. The mock never implies the password was overwritten: the failed state keeps the Connected badge and a “Current connection … still working” row.
- While reconnecting, the current connection keeps publishing. The server rule is only re-applied if missing, with a backup first, exactly as in the main flow; a failed rule step restores the backup.
- The reconnect state is per advisor/website and idempotent: a second click or tab joins the running job.

### Screens and states
| Scene | State |
| --- | --- |
| `connected` | Connected status with Reconnect link (desktop and 390). |
| `rc-url` | Reconnect card: site shown (read-only row with Connected badge), **Reconnect** and **Cancel**, note that delivery is unchanged and the current connection keeps working. |
| `rc-wp` | WordPress screen (context), same as the first connect. |
| `rc-connecting` | Four steps as before; “Your current connection stays active until this finishes.” |
| `rc-done` | Success: “Your website is reconnected”, updated time (Nov 23, 12:10 AM PT), Backup saved; still Connected. |
| `rc-fail` | Failure with “Your existing connection is unchanged”, current connection row (Connected, still working), **Try again**, **Cancel**, Contact support. Two causes: approval not completed (including Reject), or the check failed after approval (`v=test`, shows the steps with the test post failed). |
| Cancel | From `rc-url` or `rc-fail`, returns to the Connected status with nothing changed. |

### Copy
Link: **Reconnect**. Card title: **Reconnect your website**; row label “Reconnecting this website”. Note: “News delivery stays the same. Your current connection keeps working until the new approval succeeds.” Success: **Your website is reconnected**, “The new approval replaced the old one. FinancialContent can still publish to the news page on example-advisor.ca, and news delivery is unchanged.” Failure: **We couldn’t reconnect your website** / **We couldn’t finish reconnecting**; chip “Your existing connection is unchanged”; “The approval in WordPress wasn’t completed. Your website is still connected and publishing as before.” / “The new approval didn’t pass our check, so we didn’t use it. Your website is still connected and publishing as before.” Buttons: **Try again**, **Cancel**, **Contact support**.

### In / out of scope
**In:** Reconnect link on Connected; rerun of the card with the site shown; pending-then-promote credential handling; the five states above; 1280 and 390; tests that every failure and cancel path leaves the old credential and status unchanged.
**Out of scope:** changing delivery mode; switching to a different website (disconnect first); the support/admin tool; automatic reconnect or health monitoring; Wix, Squarespace and other platforms.

### Desktop vs mobile
Same as the main flow. At 390 the Reconnect link sits as a centered text link under the stacked buttons; the site row, stepper and buttons stack full width at 44px.

### Agent-time delta for Reconnect (real agent hours, cloud build + FC Tester + fix loop)
| Part | Hours |
| --- | --- |
| Server: reconnect start reusing the connect job, pending credential then promote or discard, revoke old, idempotency | 1–1.75 |
| UI: link, rerun card with site, success and failure states, 390 | 0.75–1.25 |
| FC Tester (success, reject, check failed, cancel, credentials untouched) | 1–1.5 |
| Fix loop | 0.5–1 |
| **Delta total** | **3.25–5.5 h** |

The prior Direction A total (12–18.5 h) still holds and does not include Reconnect. The support/admin tool (7.75–12.75 h) is a separate pick; if both are picked they share the connect job, so allow roughly 1 h less than the sum.

### Assumptions (Reconnect)
The pending-then-promote rule goes slightly beyond “replace only after approval”: it also requires the login check and test post to pass. Old application password is revoked in WordPress best-effort. The site address can’t be edited during Reconnect.

## Addition: Staff opens request (separate pick)
Alex, Nov 23, 12:32 PM PT (via Chief of Staff): “Add a screen so staff can open a request for an advisor, instead of server-method only.” This sits alongside the support/admin tool and Reconnect above (both already picked; their scenes are unchanged apart from the queue gaining one row, a Source line and the Open request button).

**Mock:** `support-setup.html?s=` `nav`, `new`, `new-search`, `new-picked`, `new-dup`, `new-done`, and `a-inline.html?s=rc-fail&v=sent` (also `v=test-sent`). Add `&phone=1` for 390. Staff scenes use Sam Support (and Pat Admin); fixtures are example addresses only. The `noaccess` scene still applies: an advisor who opens any of these URLs sees no data.

### Alex’s two other choices (where they touch these screens)
1. **Support nav.** Support has a **Website setup** entry in the staff nav that lands on the queue (`nav`; at 390 it is in the menu). Support sees only Advisor Posts and Website setup; admin sees the fuller nav.
2. **Failed reconnect opens a request automatically.** On a failed Reconnect, **Contact support** creates a request at once and the card shows **Request sent to support** (`rc-fail&v=sent`; the existing Connected status stays untouched). The queue shows it with Source **Reconnect failed** and reason “Reconnect failed”. No mail client opens. The advisor’s own request-creation uses the same duplicate guard as below: if one is already open for that website, a note is added to it instead and the advisor still sees “Request sent to support”. (The queue fixture row uses a different example advisor and website than the Reconnect card.)

### Screens and states
| Scene | State |
| --- | --- |
| `queue` | **+ Open request** button next to the filters. Each row shows a Source line (Advisor asked for help, Opened by Sam Support, Reconnect failed). |
| `new` | Empty form: advisor search, other fields disabled until an advisor is picked, **Open request** disabled. |
| `new-search` | Typed “jane”: 10 results, name, email and firm only, “Showing 1–10 of 37 · Prev · Next”, note that search never loads all advisors. |
| `new-picked` | Advisor chosen (with **Change**). Website address prefilled from the advisor’s profile and editable; Hosting (Hosted by us / Not hosted by us); reason or note (required); **Notify advisor by email** off by default; **Open request** enabled once the note is filled. |
| `new-dup` | The advisor already has an open request for that website: **Open request is blocked**, a link **Open existing request**, and **Add a note to the existing request** (textarea + **Add note**). |
| `new-done` | Back on the queue with “Request opened for Taylor Advisor … The advisor was not notified.” and the new row at the top: Requested, **Source: Opened by Sam Support**. |
| Empty / loading / error | Search with fewer than 2 letters: hint “Type at least 2 letters.” Loading: skeleton rows. No match: “No advisors match. Check the spelling or try their email.” Error: “Couldn’t search. Try again.” Save error: “Couldn’t open the request. Nothing was saved.” |

### Copy
Button: **+ Open request**. Title: **Open a setup request**; helper “For an advisor who needs our team’s help connecting their website.” Fields: **Advisor** (“Search by name, email or firm”), **Website address** (“From the advisor’s profile. You can edit it.”), **Hosting** (Hosted by us / Not hosted by us), **Reason or note (required)**, **Notify advisor by email** (“Off by default. When on, the advisor gets a plain ‘our team is helping’ email with no links that change anything.”). Buttons: **Open request**, **Cancel**. Search note: “Search shows 10 at a time and only name, email and firm. It never loads all advisors.” Duplicate: “Sam Advisor already has an open request for example.ca. In progress since Nov 22, 1:32 PM PT, assigned to Sam Support. We keep one open request per advisor and website.” Advisor card after Contact support: “Request sent to support” and “Our team will look at example-advisor.ca and email you. Your existing connection is unchanged.”

### Rules
- **Staff only, enforced on the server.** Support and admin only, checked in every method. Advisors get no access and no data.
- **Capped advisor search (server-side).** `limit` fixed at 10 (never client-chosen above 10), `skip` or cursor paging, a minimum query of 2 characters, and **field projection** to advisor ID, name, email and firm only (no credentials, website delivery settings or other fields). The count (“of 37”) comes from a count query on the same filter; the search must never load all advisors, and queries are rate-limited.
- **Duplicate guard: one open request per advisor + website.** Open means Requested, In progress or Failed. Enforced by a server check and a unique index on (advisor, normalised website) for open requests, so two staff clicking at once can’t create two. A blocked attempt returns the existing request, which the UI links to and lets staff add a note to. Requests from the advisor’s Contact support, the failed Reconnect and staff all use the same guard.
- **Website address:** prefilled from the advisor’s profile when known and editable; normalised to a domain before the guard check.
- **Notify advisor** is off by default. If on, one plain email is sent; no email link approves or changes anything.
- Each request records who opened it and the source (Advisor asked for help, Opened by <staff>, Reconnect failed) in the activity log.
- Creating a request never changes the advisor’s website, credentials or connection.

### In / out of scope
**In:** + Open request button; the form and its states; capped advisor search; prefill; duplicate guard and add-note; optional notify; source on queue rows; Website setup nav entry for support; auto-request on failed Reconnect and the “Request sent to support” state; 1280 and 390; role checks and tests (access, cap of 10, projection, duplicate race).
**Out of scope:** bulk opening; editing an advisor’s profile; opening a request for a user who isn’t an advisor; changing the manual setup form itself; automatic emails beyond the optional notify.

### Desktop vs mobile
1280: the form is a 720px card; the search list sits under the field; queue is a table. 390: the form is full width with 44px controls; search results stack; the Open request button sits full width above the queue cards; the staff nav is in the menu.

### Agent-time estimate for this addition (real agent hours: cloud build + FC Tester + fix loop)
| Part | Hours |
| --- | --- |
| Server: role-checked capped advisor search, create-request with unique-index duplicate guard, add-note, optional notify email, source field, auto-create from failed Reconnect | 2–3.25 |
| UI: Open request form and states, search paging, duplicate state, queue source and button, support nav entry, “Request sent to support” on the card, 390 | 1.75–2.75 |
| FC Tester (support vs admin vs advisor access, search cap and projection, duplicate and race, notify off by default, auto-request) | 1.5–2.5 |
| Fix loop | 0.75–1.5 |
| **Total** | **6–10 h** |

It reuses the queue and request model from the support tool, so it is cheapest built with or after it. Separate pick; no earlier estimate changes.

### Recommendation
Build it with the support tool: staff otherwise can only create requests through a server method, which support can’t use. The duplicate guard is the part to review closely.

## Open questions
1. Is the test post created as a private draft and deleted, or published and removed? (Assumed: created and removed; it must never be visible on the live news page for long.)
2. Which sites count as hosted by us: all Cloudways apps in our account, or only those with a matching domain record? How is a domain with `www` or a redirect matched?
3. Sites without HTTPS or on a WordPress version without Application Passwords: use the application-passwords-off scene, or a separate message?
4. Should a security plugin other than Wordfence be named in the copy? (Placeholder until verified.)
5. Should “Try again with another account” keep the same signed `state`, or restart?
6. Which existing connection method wins if a site is already connected another way (embed, PHP)? (Assumed: this flow only adds WordPress publishing and leaves the others.)
7. Who is notified when the job fails after the rule was applied and restored (support inbox, Alex)?

## Assumptions in this mock set
- The WordPress approval screen shows WordPress’s own wording; the mock reproduces it and cannot change it.
- “Connected” time shown (Nov 19, 11:24 AM PT) is a fixture.
- Legal or compliance wording: none added; any future line is a placeholder pending review.

Not agent-ready. Soft Dev hold until a direction is picked.

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

**Out of scope:** the onboarding platform detection and branding pull (#724 and the `v1/` mocks); Wix, Squarespace and other platforms; sites we don’t host (they only get the support path); plugin download; changing the PHP or embed methods; a site list or picker; staff queue UI; emailing links to a web person; redesigning the Website tab.

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

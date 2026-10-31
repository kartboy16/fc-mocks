# #727 One-step website connection (onboarding step 2 of 5): build contract

Mocks: [hub](index.html) · [A. Detected path, one card](a-detected.html) (**recommended**) · [B. Platform tiles](b-tabs.html) · [Today](today.html). This follows [#724](../724/) A and uses the same shell, banner and badge styles.

> **Not agent-ready. Soft Dev hold until a direction is picked.**

## Today (main `14c9cce`, read only)

- **Website > Settings** shows `WebsiteDeliveryChooser` with two cards: "Article list on your site" (embed, set by `advisorConfig.setWebsiteDelivery(advisorId,'embed')`) and "Full articles on your domain" (WordPress). WordPress needs `wordpressSetup.status === 'ready'`.
- **Asking for WordPress setup:** `wordpress.requestSetup(siteUrl)` sets `wordpressSetup.status='requested'` and pings an internal Slack channel. Staff then enter credentials by hand (`wordpress-credentials.js`, JWT via `/wp-json/jwt-auth/v1/token`, so the advisor's WordPress needs the JWT plugin) and the status moves `in_progress → ready`. Statuses in `websiteDeliveryHelpers.js`: none / requested / in_progress / ready / failed.
- **Embed:** `WebsiteEmbeddingGuide.jsx` shows a sample `<script src=".../api/embed.js" data-advisor-id=...>`. `server/api/embed.js` sends `Access-Control-Allow-Origin: *` and serves by `advisorId` alone. There is **no key and no domain check**, so any site can show any advisor's list. Article links in the widget go to `${apiBase}/post/:id`, which is FC's own domain (a white-label issue, see open questions).
- **No platform detection, no "is it connected" check, and no approved-domains setting.** #724's site pull (`advisor-brand-lookup`) already fetches the homepage, so detection can run on the same fetch.

## Directions

| | A. Detected path, one card (recommended) | B. Platform tiles, detected pre-picked |
|---|---|---|
| Layout | Website > Settings, "Connect your website · Step 2 of 5" card. A detection line ("WordPress found on yourfirm.ca", Detected badge, "Not right? Change"), then **only that path** | The same card with 6 tiles (Managed by our team / WordPress / Wix / Squarespace / Other site / Not sure). The detected tile is pre-picked with a small "Detected" label; the panel for the picked tile shows below |
| Own WordPress | One main button, **Connect WordPress**. "Can't sign in to WordPress? Install our plugin instead" reveals the plugin | Two equal option cards: Connect WordPress (Recommended badge) and Install our plugin |
| Status | Status line in #724 banner style (pending, connected, can't verify) | The same lines plus a 3-step tracker (Add to your site → We check for it → Live) |
| Decisions shown | None unless detection is wrong | Every platform is visible, which is easier to correct but busier |

Shared by both: the landing banner, WordPress approve screen, the "Email this to my web person" dialog plus the email and the page it opens, Approved websites card, staff queue, and the "not sure" chooser.

**C dropped:** a separate onboarding wizard page. Same reason as #724: steps 3–5 and an onboarding dashboard don't exist yet, so the step lives in Website > Settings plus a landing banner. It can move into a wizard later without a data change.

## Screens and states

Switcher keys: `v` (view), `p` (platform), `s` (status), and `m=plug` (A's plugin reveal). The mock pages carry no estimates.

| Path (`p`) | to do (`setup`) | pending | connected (`live`) | can't verify (`error`) |
|---|---|---|---|---|
| Managed by our team (staff-side: "FTT-managed") | Not shown. A queue item is created at signup, so it starts as pending | "We'll connect it for you", tracker Requested → Our team connects it → Live, "Requested Oct 31, 10:45 AM PT. Usually done within 1 business day." | "Your content is live on your website." | "We hit a snag… Our team is on it, so there's nothing you need to do." + Contact us |
| Own WordPress | Connect WordPress (+ plugin) + "Email this to my web person" link | After the plugin download: "Waiting for the plugin on yourfirm.ca. We check every hour." + Check now | Approve goes straight to live (verified through the API) | "We can't reach WordPress at yourfirm.ca. The connection may have been removed…" + Connect again / Get help |
| Wix / Squarespace / Other | Snippet + Copy code, platform tabs with steps, **Email this to my web person**, "I've added it, check now" | "Waiting for your site code…" + Check now + "Show the code and steps again" | "Your content is live on your website." Found on yourfirm.ca/insights · checked … | "We couldn't find your site code… in a Code or Embed block." + Check again / Email my web person |
| Not sure / detection failed or timed out | Chooser: WordPress / Wix / Squarespace / Something else, + Email this to my web person / Ask our team to help (creates a queue item) | n/a | n/a | n/a |

Other views:

- **Landing banner (#724 style):** "Next: connect your website so your content shows there." + Connect website. Managed: "We're connecting yourfirm.ca for you. Nothing to do." Pending: "Almost there. We're checking yourfirm.ca for your site code." Live: "Your content is live on your website." (dismissable). Error: "We couldn't verify yourfirm.ca." + Fix it. This shows after the #724 branding banner, one banner at a time.
- **WordPress approve screen:** WordPress core's own `wp-admin/authorize-application.php` (Application Passwords, WP 5.6+), with app name "Content Library". It shows what the app can and can't do. "Yes, I approve" returns to the success URL, and we store the app password encrypted (`wordpress-crypto.js`). "No" returns to the to-do state with "Not connected. You can try again anytime."
- **Email this to my web person:** a dialog with Their email, Note, Preview, and **Send (POST)**. The email comes from Jane Advisor with reply-to set to the advisor. It contains the code, the steps, and an **Open the setup steps** link. **The link only opens a read-only page** (signed, expiring token, GET has no side effects). On that page, "I've added it, check the site" is a **button (POST)** that only queues a check. Nothing is approved or changed by a link click.
- **Approved websites** (Website > Settings, below the connect card): a list with **✓ Verified** / **Not verified yet** (+ Check) badges, "Found at signup" on the detected domain, × to remove, and Add a website. Copy: "Your article list only shows on these websites. Anyone can see your site code, so this keeps it on your sites."
- **Staff queue** (admin): Advisor, Site, Platform, Source (Found at signup / Asked for help), Requested, and **Turn on publishing**. This reuses `wordpress.getSetupRequests`, with a source field added.

## Data fields and storage (`advisor_configs`)

| Field | Notes |
|---|---|
| `websiteDetection` `{platform: wordpress\|wix\|squarespace\|other\|unknown, managed: bool, signals: [..], checkedAt, via: signup\|refresh}` | Written by the #724 lookup. A failure or timeout gives `unknown` and never blocks |
| `websiteConnection` `{path: managed\|wp_connect\|wp_plugin\|snippet, status: setup\|pending\|live\|error, lastCheckAt, lastFoundAt, foundUrl, errorCode, connectedAt}` | The single source for the banner and card |
| `embedPublicKey` (`pk_…`) | Goes in the snippet and plugin. It's public by design and can be rotated |
| `approvedDomains` `[{host, verified, verifiedAt, source: signup\|advisor\|admin\|seen, addedAt}]` | Pre-filled from `websiteAddress` and the detected host (with and without `www.`) |
| `wordpressSetup` (existing) | `+ authMethod: jwt\|app_password\|plugin`, `+ requestSource: signup_managed\|advisor_help\|manual` |
| `webPersonInvites` `[{email, sentAt, tokenHash, expiresAt, openedAt}]` | For resend and audit |

## Detection approach

- It runs on the same homepage fetch as #724, with the same ~20 s cap, and adds no extra request in most cases.
- **WordPress:** `wp-content/` or `wp-includes/` paths, `<meta name="generator" content="WordPress`, the `Link: <…/wp-json/>` header, or `/wp-json/` returning 200.
- **Wix:** `X-Wix-Request-Id` header, `static.wixstatic.com`, or the `wix.com` generator.
- **Squarespace:** `static1.squarespace.com`, or `<!-- This is Squarespace. -->`.
- **Managed by us:** the host or its DNS matches a staff-maintained list of our hosting IPs and CNAMEs in `utils/managedHosts.js`, editable in admin later.
- Anything else, or no website, gives `other`. A free or dealer email with no website gives `unknown` (the "not sure" chooser).
- **Connection check:** a scheduled job fetches the approved pages: hourly for 7 days, then daily. "Check now" is rate-limited to 1 per minute. It looks for `data-key="pk_…"`, a plugin marker `<meta name="…-content" content="pk_…">`, or a successful WordPress REST call. It sets `live` when found and `error` after 3 misses or a 401/403/404 from WordPress. Widget page views from an approved domain (`embed_analytics`) also mark it live. Per AC8, **this work never adds robots or crawler blocks to advisor sites.**

## Precedence and security

- The embed API serves the list only when `key` is valid **and** the request's `Origin`/`Referer` host is in `approvedDomains`. Localhost and preview hosts are allowed only when they're listed.
- **Migration:** existing embeds get their seen Referer hosts (from `embed_analytics`) and `websiteAddress` pre-filled as approved. Enforcement starts in warn-only mode (log only) for the first 14 days (open question).
- The plugin zip carries `embedPublicKey` plus a **per-site secret** for publishing. Rotating it from settings invalidates old zips. The WordPress app password is stored encrypted with `wordpress-crypto.js`.
- Choosing a path never removes an existing working method. It calls `setWebsiteDelivery` only once the path is `live`.

## White-label

- The snippet, plugin, emails and the web-person page show **no FC domain**. In the mock the snippet host is the placeholder `embed.example.com`. The real host is **FC's own domain** unless a neutral or advisor host is chosen (open question 1).
- Widget article links and Insights share links must open on the advisor's site (in-page reader, or the WordPress post) and never on FC's own domain (AC7). The emailed page is served under the same neutral host.
- Advisors see "our team"/"Managed by our team". "FTT-managed" appears only in the contract and admin.

## In scope

Detection, the connect card for every path (A or B), the landing banner, the Connect WordPress flow (Application Passwords), the pre-keyed plugin zip, the snippet with tabs for Wix, Squarespace and other, the web-person email, page and dialog, the connection checker, Approved websites, the embed key and domain check, the staff queue source field, and the landing status.

## Out of scope

- Onboarding steps 3–5 and a wizard.
- Ghost or other adapters.
- Changing the PHP publishing method (#644). It keeps working, but isn't offered in this step.
- Auto-inserting code into Wix or Squarespace through their APIs.
- Robots or crawler changes (AC8).
- Legal or consent copy for the outbound email. It's a placeholder only: **[legal line TBD]**.

## Mobile (390)

- The card goes full width. In B the tiles are 2 per row. Option cards stack.
- The code block wraps, with Copy code inside the block.
- All buttons and tabs are at least 44px. Action buttons go full width.
- The WordPress approve screen hides the WP menu.
- Approved websites rows wrap, with a 44px × button.

## Estimates (agent time: cloud agent build + FC Tester + fix loops)

Calibration: #699 took ~30 min from handoff to tested.

| Run | What | A | B |
|---|---|---|---|
| 1 | Data fields, detection on the #724 fetch, managed-host list, staff queue source, `embedPublicKey`, approved domains model + embed key/Origin check (warn-only flag) + migration pre-fill | ≈1.5–2.25 h | ≈1.5–2.25 h |
| 2 | Connect WordPress (Application Passwords authorize + callback + encrypted store + publish via app password) and the pre-keyed plugin zip (small PHP plugin: marker, key, publish endpoint) | ≈2–3 h | ≈2–3 h |
| 3 | Connection checker job + Check now, the web-person email (Send POST, signed read-only page, check button POST), snippet steps content | ≈1.5–2.25 h | ≈1.5–2.25 h |
| 4 | UI: connect card, landing banner, Approved websites card, staff queue column | ≈1.5–2 h | ≈2–2.75 h |
| | **Total** | **≈6.5–9.5 h** | **≈7–10.25 h** |

- Wall-clock is about **3.5–5.25 h for A** if runs 2, 3 and 4 go in parallel after run 1 (B: about 4–6 h).
- Cutting the plugin zip from the first build (Connect WordPress only, plugin later) saves about 1 h of run 2.

## Recommendation

**A.** The ask is "one step with no decisions": A shows only the detected path and one main button, and correcting it is one click. It matches #724 A (same detection line, badges and banner style). It also needs about 30 min less UI time than B. B's tiles remain an option if detection proves unreliable in testing.

## Open questions

1. **Embed host (white-label):** the snippet and widget article links point at FC's own domain today. Should they use a neutral host, a per-advisor CNAME (for example `content.yourfirm.ca`), or an in-page reader so readers stay on the advisor's site?
2. **WordPress auth:** OK to switch from the JWT plugin to core Application Passwords for new connections, keeping JWT for existing sites? Some hosts or security plugins disable Application Passwords; those fall back to the plugin.
3. **Plugin:** ship it in the first build or later? Keep both options, or only Connect?
4. **Managed detection:** which hosting IPs or CNAMEs identify sites we host? Should staff be able to edit the list in admin?
5. **Check schedule:** is hourly for 7 days, then daily, OK? Should the advisor get an email when it goes live or fails?
6. **Approved domains:** strict from day one for new advisors, plus warn-only for 14 days for existing embeds?
7. **Web-person email:** which from address (sent as the advisor, through our mail)? How long should the link last (suggest 30 days)? Is a legal or consent line needed (**placeholder**)?
8. **Not sure → Ask our team to help:** should it create a queue item, and who picks it up?

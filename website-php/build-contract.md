# Website settings: "PHP on your server" option: build contract

**Status:** Designer-first mock with generic sample data (Jane Advisor, example.com, advisor ID `abc123`). There's no GH issue for this UI yet; the related backend issue is #638. **Not agent-ready. Soft Dev hold until Alex picks.**
**Scope:** Content Library → Website → **Settings** tab (`imports/ui/WebsiteHub.jsx` → `WebsiteSettings.jsx`, `PublishingMethodCard`, `WebsiteDeliveryChooser`, `websiteDeliveryHelpers.js`), as on staging at `52eb835`. Request from Alex via Software developer, 10:43 PM PT on Oct 22, 2026.

Mocks: [hub](index.html) · [Today](today.html) · [A, method card (recommended)](a-method-card.html) · [B, wizard](b-wizard.html) · [C, status page + drawer](c-status-page.html)

## 1. How it works (for context)
A small PHP renderer on the advisor's own host reads their published FC posts:
- `GET /api/posts/<advisorId>` for the list.
- `GET /api/post/<id>?advisor=<advisorId>` for a single post.

It renders `/insights` (the list) and `/insights/<slug>` (post pages) on the server, inside the site's own header and footer. Pages get SEO tags, a 15-minute cache and a stale fallback.

Posts stay on FC. If the subscription ends, the API returns nothing (`revoked`) and the posts disappear; the advisor gets no copies. It's built first for a static-site advisor.

## 2. Today
The Settings tab has "Website publishing" ("One method is active for new posts. Compare methods") and two method cards:
- **Article list on your site** (the embed snippet, with theme, max posts, categories, excerpts, custom CSS, a preview and Copy site code).
- **Full articles on your domain** (WordPress; Request setup or Configure WordPress).

A static or PHP site can only use the article list, and articles then open on Content Library.

## 3. Recommendation
**A: a third method card, "Full articles with PHP on your server", with an inline setup panel.** It reuses `PublishingMethodCard` and the existing switch pattern, and keeps everything on one screen. Setup takes three numbered steps and a status box. It's the cheapest option and matches how WordPress already looks.
- **B** (a 4-step wizard dialog) is friendlier for a first setup, but it hides the status behind "View status" and costs more.
- **C** (a "Your website setup" status page with setup in a drawer) is the best for health at a glance, but it replaces today's layout for all methods.

## 4. Screen (A)
The card header has the title, a **New** chip, a status chip (see states) and the subtitle "A small folder on your web host · posts show at example.com/insights · readers stay on your site". When it's connected, a **Switch to PHP** button appears, using the same confirm dialog as today.

The expanded panel, top to bottom:
1. **Which posts show up** note: "Only posts you've published to your website in FinancialContent. They stay on FinancialContent, so if your subscription ends they disappear from your site. Your site doesn't keep its own copies."
2. **Your advisor ID** `abc123` [Copy] and **Posts address** `https://financialcontent.ca/api/posts/abc123` [Copy]. Copy shows "Copied" for 2 seconds.
3. **Step 1. Download the insights folder:** [Download fc-insights.zip] "Version 1.0 · your advisor ID is already filled in."
4. **Step 2. Put it on your website:**
   - "Unzip it and upload the insights folder to your website's main folder."
   - "Open example.com/insights once."
   - Then: "Not sure how? Send this page to whoever looks after your website."
5. **Step 3. Check it's working:** a status box (states below) and [Test connection] with an inline result.
6. **Developer details** (collapsed):
   - Requirements: PHP 7.4+, cURL or allow_url_fopen, and a writable cache folder.
   - Both endpoints, the routes, the .htaccess and nginx rewrite, and the header/footer config.
   - SEO tags (title, description, canonical, Open Graph, Article JSON-LD).
   - The 15-minute cache and stale fallback, cache clearing when posts are revoked, and the renderer User-Agent.

Step numbers turn green as each step is done.

## 5. States
| State | Chip | Status box | Test connection result |
|---|---|---|---|
| Not set up | Not set up | "Not set up yet. Download the folder to get started." | "Not yet. We haven't heard from your site…" |
| Downloaded | Setup in progress | "Downloaded. Upload the folder, then open example.com/insights once." | Same as above. After a test it moves to Waiting. |
| Waiting for first fetch | Waiting for your site | "Waiting for your site. We haven't heard from example.com yet. Open example.com/insights once to start it." | Same as above |
| Connected | Connected | "✓ Connected · example.com/insights", then Last fetched (4 min ago), Posts showing (12), Connected since | "✓ Working. Your site loaded 12 posts just now." |
| Error / stale | Needs attention | "⚠ Your site hasn't picked up new posts since Oct 20. It's showing the last saved posts…", then Last fetched (2 days ago), Posts showing (11, 1 new post missing) | "✗ Couldn't load example.com/insights. Your site answered 'Page not found'. Check the insights folder is in your site's main folder." |

**Stale rule (proposed):** the last fetch is older than 24 hours, or a post was published after the last fetch plus 1 hour.

## 6. Copy
- **Title:** "Full articles with PHP on your server".
- **Subtitle:** as in section 4.
- **Buttons:** "Download fc-insights.zip", "Test connection", "Switch to PHP".
- **Toasts:**
  - "Downloaded fc-insights.zip (your advisor ID is already filled in)."
  - "Switched. New posts publish to example.com/insights."
- **Compare methods table:** add a column with:
  - Setup time: "About 15 minutes (you or your web person)".
  - Where full articles open: "Your domain (/insights)".
  - Best for: "Websites that aren't WordPress".

## 7. In scope / out of scope
**In scope (UI):**
- The third method card and its panel, the status chip, Copy, Download, Test connection, the developer details and a Compare-methods column.
- A new `websiteDelivery: 'php'` value (or see open question 1).

**Backend needed for the UI (small):**
- Record the last fetch per advisor: the time, the post count and the site host, from renderer requests (identified by User-Agent `FC-Insights-PHP/…`).
- A Test connection method that fetches `https://<site>/insights` server-side and looks for the renderer marker (`<meta name="generator" content="FC-Insights-PHP">`).
- A zip download with the advisor ID filled into `config.php`.
- #638 (the post visibility check, plus `slug` and `updatedAt`) must ship first.

**Out of scope:**
- Writing the PHP renderer itself (Software developer is building it for the first static-site advisor).
- Hosting the advisor's site.
- Custom paths other than /insights.
- Social and email.
- Per-post analytics from PHP pages.

## 8. Mobile
Cards stack full width. Copy rows wrap, with the label above the value and the Copy button full width. The status numbers wrap. B's wizard goes full screen, and C's drawer is full width. Developer details stays collapsed.

## 9. Estimate
- **A:** about 2–2.5 days of UI plus about 1.5–2 days of backend (fetch tracking, test method, zip with ID, a new delivery value). Total about 3.5–4.5 days, not counting the renderer.
- **B:** about 3–3.5 UI days plus the same backend.
- **C:** about 3.5–4.5 UI days plus the same backend (it restructures the whole Settings tab).

## 10. Open questions for Alex
1. Is PHP its own delivery method (switching makes it active, as mocked), or a variant of the article list? Both read the same published posts.
2. Should Test connection fetch the advisor's site from our server (needs their site address), or only show "last fetched" from the renderer's own calls?
3. Should advisors set up PHP themselves (download shown to everyone), or is it like WordPress, where we set it up and the advisor sees "Request setup"?
4. Is the page path fixed at /insights for v1, or can the advisor pick (for example /blog)?
5. Stale rule: 24 hours with no fetch, or a new post not picked up within 1 hour?
6. Does "Switch to PHP" stop the article list snippet, or can both run at once?

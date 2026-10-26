# #650 Analytics: build contract (FC-owned Google Analytics, whole site)

> **Direction locked by Alex, Oct 24, 2026:** FC creates and looks after a Google Analytics 4 property for each advisor, tracks the **whole** advisor site, and shows the numbers inside FC in a new **Analytics** section. It is not a Website publishing method.
>
> **Update Oct 26, 2026 (Alex):** "Can we have the analytics section in the website tab first? We can do an analytics tab afterwards." So it's now **C first (Phase 1), then A (Phase 2)**. The A-vs-B choice is superseded.
>
> **Update Oct 26, 2026, 11:06 AM PT (Alex):** "I want to integrate this Properties creation and pull the analytics into financialcontent.ca. Can you mock up the properties creation and analytics view? When it's time to build, just add the property to my Financialcontent.ca account." The model is **one GA4 property per advisor site**, all in Alex's FC-owned Google Analytics account named **"FinancialContent"**, with **2-month retention**. C (Phase 1) stays the locked base. Consent changes to **analytics on by default with an opt-out notice** (OK / Opt out). New mocks: [Property setup](property-setup.html) and [Analytics view](analytics-view.html). See section 0.
>
> **Not agent-ready. Soft Dev hold until Alex picks.** Mocks only, with generic names (Jane Advisor, Your Firm Name, example.com) and made-up example numbers.

Mocks: [Hub](index.html) · [Today](today.html) · [Property setup](property-setup.html) · [Analytics view](analytics-view.html) · [C, Website tab section (Phase 1, current)](c-website-analytics.html) · [A, own Analytics tab (Phase 2)](a-analytics-section.html) · [B, Home card + full page](b-home-card.html) · [Advisor site with cookie banner](site-consent.html). Every page has a Desktop / Phone toggle (`?phone`).

## 0. Property creation and analytics view (Oct 26), recommended

There's one direction, built on C.

**[property-setup.html](property-setup.html)** lives in Website › Settings › Website analytics (C styling, below the publishing cards).

| State (`?st=`) | Status bar | Panel |
|---|---|---|
| `none` | Not set up | "Count visitors to your whole site and see the numbers here. We set it up for you." **Set up analytics** opens "Your website" (prefilled from Website settings), then **Create analytics**. A bad URL shows "Enter a full web address, like https://example.com." |
| `creating` | Setting up… | Checklist: Creating your analytics property → Adding your website (example.com) → Keeping detailed data for 2 months → Getting your analytics ID |
| `waiting` | Created. Waiting for the first visit | ID **G-ABC1234XYZ** + Copy, then "How should we add it to your site?" with two options. **Install for me** (we host your site): "We add it to every page we serve." **Copy the tag** (own host): the tag, 4 steps, **Check my site** (found / not found / wrong ID / couldn't reach) and **Send to my web person**. Insights pages are auto-inserted without double counting. The privacy notice switch is folded. |
| `live` | Live · last visit 12 min ago | "Working on example.com. See your numbers →" |
| `error` | Setup didn't finish | "We couldn't set up analytics. Nothing was changed on your site." + Try again + a support reference |

The staff view (`?view=admin`, FTT staff only) is **Admin › Analytics properties**:
- A meter for "Properties in the FinancialContent account: N of 2,000 · plan a second account at 1,800".
- A report quota meter (busiest property's share of its daily Data API tokens, with reports cached 6 h).
- A status filter and **+ Set up for an advisor**.
- A table with advisor / firm / site, status (Live, Waiting for data, Creating, Error: permission denied, Paused (advisor left)), property ID, created date, last data, and actions (Retry, Open in Google, Re-check tag, Pause, Resume, Delete).

**[analytics-view.html](analytics-view.html)** shows the reports from the Data API.
- **`?phase=1`:** the Website tab section card. Visitors, page views, new visitors, top 3 pages and sources. "See full report ↓" adds the chart, devices and top Insights posts.
- **`?phase=2`:** the full Analytics tab, with the same parts laid out in full.
- **Date range:** 7 / 28 / 90 days or Custom. On 90 days and Custom: "We keep detailed data for 2 months. Totals for longer ranges still show."
- **States:** has data (all numbers labelled **Example data**), no data yet ("Numbers show up 24 to 48 hours after your tag starts working."), loading (skeletons), and error ("We couldn't load your numbers right now. Your site is still being tracked." + Try again).

### Build note

- **Access:** create an FC Google Cloud project and a **service account**, and grant it **Editor** on the "FinancialContent" GA account. Read access to reports comes with that.
- **Admin API (v1beta):**
  - `properties.create` (parent `accounts/<FinancialContent>`, display name = advisor site, time zone, CAD).
  - `properties.dataStreams.create` (web stream, default URI = advisor site, which returns the Measurement ID).
  - `properties.updateDataRetentionSettings` (event and user data: **2 months**).
  - Store `propertyId`, `streamId` and `measurementId` on the advisor. Make it idempotent (look up by advisor before creating) so Retry never makes duplicates. Queue the calls with backoff.
- **Data API:** `runReport` / `batchRunReports` (up to 5 reports per call) for activeUsers, newUsers, screenPageViews, pagePath, sessionDefaultChannelGroup and deviceCategory. **Cache per property and date range** (about 6 h) and refresh in the background. Use `returnPropertyQuota: true` to drive the staff quota meter. Handle `429 RESOURCE_EXHAUSTED` with backoff, and show the cached numbers plus the error state.
- **Quotas (checked Oct 26, 2026 on Google's docs):**
  - Each GA account holds up to **2,000 properties**, and Google support can raise it. An organization can have up to 100 accounts.
  - The Data API allows, **per standard property**: 200,000 core tokens per day, 40,000 per hour, 14,000 per project per hour and 10 concurrent requests. Most requests cost 10 tokens or fewer, so per-advisor numbers are comfortable with caching.
  - Plan for **multiple accounts** ("FinancialContent 2", and so on) when an account reaches about 1,800, and record `accountId` per property.
- **Retention:** Google's help says the 2-month setting affects explorations and funnel reports, **not standard aggregated reports**. Confirm at build that `runReport` totals for 90 days and Custom ranges still return. If they don't, cap ranges at about 60 days.
- **Secrets:** keep the service-account key in server-only settings or a secret manager, never in the client or the repo. Rotate it, and prefer keyless or workload identity if hosting allows. Every Admin and Data API call stays server-side, behind advisor-ownership checks (including acting as).
- **White-label:** the tag loads only `googletagmanager.com`. Nothing a visitor sees (notice, tag, site) mentions or links to FC or financialcontent.ca. The GA account name is visible to FTT staff only.
- **First build:** per Alex, create the first property for **Alex's own FC account** as the pilot, before any advisor.
- **Estimate:**

| Piece | Days |
|---|---|
| Service account, secrets, Admin API create + retention + idempotency | 2–3 |
| Staff admin view (list, meters, retry, pause/resume) | 1.5–2 |
| Advisor setup flow in the Website tab | 1.5–2 |
| Data API reports, cache, quota handling | 2–2.5 |
| Analytics view (Phase 1 card + See full report) | 1.5–2 |
| Tag + opt-out notice script + Check my site + send | 2–2.5 |
| Auto-insert (PHP Insights, FTT-hosted) + no double count | 1–1.5 |
| QA | 1 |

That's about **12.5 to 16.5 days for Phase 1**. Phase 2 (moving to its own tab) is about 1.5 to 2.5 days more.

## 1. Plan: C now, A later

**Phase 1, C ([mock](c-website-analytics.html)):** a **Website analytics** section inside Website › Settings, below the three publishing cards. It has its own heading ("Separate from publishing" / "Website analytics"), a 2px divider, and a lilac panel with a status bar. It has no radio, no "Publishing here" chip and no select button, so it doesn't read as a 4th method. It works with any publishing method.

**Phase 2, A ([mock](a-analytics-section.html)):** the same section moves to its own **Analytics** sidebar tab with Overview and Setup tabs. The Website tab keeps one line: "Analytics: see visitors in Analytics →". The ID, setup and data stay the same, and nothing changes on the advisor's site. See C's `?phase=2` frame.

B (Home card) is superseded and kept for reference.

## 1a. Phase 1 (C) screen and states

| State (`?st=`) | Status bar | Panel body |
|---|---|---|
| `setup` / off | Not set up | "Visitors, top pages and where they came from, right here. We set it up for you." + **Turn on analytics** |
| `prov` | Setting up… | "Usually under a minute. You can leave this page." |
| `err` | Setup didn't finish | "Nothing was changed on your site." + **Try again** |
| `ready` | **Setup needed:** add the code to your site | "Setup and code" open: 1 ID (G-ABC1234XYZ, Copy) · 2 Cookie banner (on, Recommended, preview) · 3 snippet + 4 steps + **Check my site** + **Send these steps to my web person**, or "We'll add it for you" when we host the site. Insights pages are auto-inserted and not counted twice. |
| `waiting` | Connected. Waiting for first visitors (up to 48 hours) | Setup folded ("done") |
| `data` | Connected · G-ABC1234XYZ | Date range, Visitors, Page views, Top pages (Example data). **See more ↓** opens new visitors, Insights reads, chart, sources, devices and top Insights posts inline. Consent note. Setup folded. |

Check my site results (found / not found / wrong ID / couldn't reach), the banner on/off states, "Turn off analytics" and the cookie banner on the advisor's site ([site-consent.html](site-consent.html)) are the same as A, below.

**Phase 1 in scope:** everything in section 5's "In" list, but shown in the Website tab panel instead of a sidebar tab. The full reports in the panel stay compact (behind See more).
**Phase 1 out of scope:** the Analytics sidebar tab and Overview/Setup tabs (Phase 2), the Home card (B), and everything else in section 5's "Out" list.

**Phase 1 estimate (C):** about **10 to 14.5 days**. That's provisioning 2–3, reports + cache 2–2.5, Website-tab panel with compact numbers and See more 1.5–2, setup flow 1.5–2, banner + consent 2–3, auto-insert 1–1.5, QA 0.5–1. **Phase 2 (move to A) later:** about **1.5 to 2.5 days** extra (nav item, full-page layout reusing C's parts, one-line link).

## 2. Screens

Sections 2 to 4 describe A (Phase 2) and B. C reuses A's setup and states inside the Website tab.

| Screen | A (Phase 2) | B (superseded) |
|---|---|---|
| Entry point | Sidebar **Analytics** (NEW badge), between Email Campaigns and Calendar. Phone: same item in the top nav. | **Website visitors** card on Home. "See all →" opens a full page (Home › Website visitors). No sidebar item. |
| Overview | Date range, 4 number tiles, visitors-per-day chart, top pages, where visitors came from, devices, top Insights posts | Same content on the full page |
| Setup | **Setup** tab: 1 Your analytics ID · 2 Cookie banner · 3 Add it to your site | Collapsed **Setup** section under the numbers |
| Website tab | One line only: "Analytics: see visitors in Analytics →". No card, strip or field beside Article list / Embed / PHP. | Same line, linking to the full page |
| Advisor site | [site-consent.html](site-consent.html): notice shown, OK, opted out | Same |

## 3. States

| State | What the advisor sees |
|---|---|
| **Off** (default) | Empty state: "See who visits your website" + **Turn on analytics**. "We set it up for you. It takes about a minute." |
| **Provisioning** | "Setting up your analytics… usually under a minute." Safe to leave the page. |
| **Error** | "We couldn't finish setting up. Nothing was changed on your site." + **Try again**. |
| **ID ready** | `G-ABC1234XYZ` with Copy, "Created for example.com on Oct 24. You don't need a Google account." Overview: "Your analytics ID is ready. Finish setup →". |
| **Snippet: found** | "✓ Found on your homepage. The ID matches." Moves to Waiting. |
| **Snippet: not found** | "✗ Not found on your homepage. Check the code is in the &lt;head&gt; and the site is published." |
| **Snippet: wrong ID** | "⚠ Found a different ID (G-ZZZ9876QRS). Replace it with the code above." |
| **Snippet: couldn't reach** | "✗ Couldn't reach example.com. Check the site is live, then try again." |
| **Auto-inserted** | Insights pages (PHP): "we add it for you on example.com/insights". FTT-hosted (#601): "We host your site, so we'll add it for you" → "Adding it now" → "Added to every page of example.com". |
| **No double count** | When the site-wide tag is found: "Insights pages: already covered by your site-wide code, so we don't add a second copy." |
| **Waiting for data** | "Waiting for your first visitors. Numbers can take 24 to 48 hours to show." |
| **Has data** | Numbers, chart and lists, with "Updated 2 hours ago". |
| **Consent-limited** | Under the numbers: "Visitors who opt out aren't counted." |
| **Consent declined** (site) | Banner hides, Google Analytics never loads, nothing is sent. Footer "Cookie settings" reopens the banner. |
| **Banner off** (setup) | "Banner off. Use your own cookie tool. Nothing is tracked until it says a visitor agreed." The snippet changes to the no-banner version. |
| **Turned off** | Confirm, then back to Off. The ID is kept (not deleted) so turning it back on reuses it (see open question). |

## 4. Copy (plain, short)

- Turn on: "See who visits your website" / "Turn on analytics" / "We set it up for you. It takes about a minute."
- Paste steps: 1. Copy the code. 2. Paste it in the &lt;head&gt; of every page (or once in your shared header). 3. Publish your site. 4. Click **Check my site**.
- "Send these steps to my web person": email field + editable message, sent from Jane Advisor &lt;jane@example.com&gt;, includes the code and 4 steps.
- Privacy notice: "Show an opt-out notice" (on, Recommended). "Visits are counted unless a visitor clicks Opt out. Preview the notice."
- **Banner text is a placeholder and needs compliance review.** The mocks don't write legal or privacy wording.

## 5. In scope / out of scope

**In:** FC provisions one GA4 property + web data stream per advisor; Analytics section (A) with Overview and Setup; site-wide snippet with consent mode; Check my site; send steps by email; auto-insert on PHP Insights pages and FTT-hosted sites; cookie banner on/off with a preview; reports pulled into FC; one-line link on the Website tab.

**Out (for now):** advisors pasting their own GA ID (could come back as "Use my own ID" later); Tag Manager; ads, conversions or goals; real-time view; per-visitor data; email and social analytics in the same section; WordPress sites (they keep the current analytics process); writing the banner's legal text.

## 6. Backend notes

- **Property creation:** Google Analytics Admin API (`properties.create`, then `dataStreams.create` for the web stream, scope `analytics.edit`) under an FC-owned Google Analytics account, using a service account. Store property ID, stream ID and Measurement ID on the advisor record. Name it with the advisor's site (e.g. "example.com"), time zone and CAD from the account. Make it idempotent so Try again doesn't make two properties.
- **Quotas:** a GA account holds up to **2,000 properties** (Google can raise it), and an organization up to 100 accounts. Plan to shard advisors across several FC accounts (e.g. 1,000 each) and track counts. Admin API write calls are rate-limited, so queue provisioning.
- **Reports:** Google Analytics Data API `runReport` per property, for date range, users, new users, page views, top pages, session source, device. Data API quotas are per property (core tokens per day and per hour, about 10 concurrent requests), so **cache** results (e.g. refresh every few hours, "Updated 2 hours ago") rather than calling on every page view. Data has a 24 to 48 hour lag at the start.
- **Data retention:** set the property's data retention (2 or 14 months for detailed data; standard reports aren't affected). Decide the setting.
- **Ownership and leaving:** FC owns the property. If an advisor cancels: options are (a) stop the tag and delete the property after N days, (b) grant the advisor admin access and let them move it to their own Google account, or (c) keep it read-only. Needs Alex's call; see questions.
- **Advisor access in Google Analytics:** optional; the Admin API can add a user with Viewer role (`accessBindings`). Off by default in the mocks.
- **Check my site:** server-side fetch of the homepage (and /insights for PHP sites) with a short timeout; look for `G-` IDs in `gtag/js?id=` or `gtag('config', …)`. Results: found, not found, different ID, couldn't reach.
- **No double count:** the PHP renderer adds the tag only if the page header/footer files it includes don't already contain the advisor's ID; on FTT-hosted sites one shared tag covers every page. Last "Check my site" result is stored and shown.
- **Auto-insert:** PHP Insights pages (#644 renderer, needs a folder version bump) and FTT-hosted static sites (#601: inserted in the shared template on deploy).
- **Skip preview:** don't count preview or staging hosts, or `noindex` pages (from the issue). Optionally restrict the data stream to the saved domain.

## 7. Consent model and privacy (updated Oct 26)

- **Analytics is on by default, with an opt-out notice** (OK / Opt out). See [site-consent.html](site-consent.html).
  - OK hides the notice. Opt out stops Google Analytics loading on later pages, and the choice is remembered first-party on the advisor's domain.
  - "Privacy choices" in the footer reopens the notice.
- **We don't make a legal call here.** Whether an opt-out notice is acceptable in each province, including Quebec's Law 25, needs privacy and compliance review (open question 1). If review says opt-in is needed somewhere, the earlier Accept/Decline design can come back.
- Notice text is a **placeholder that needs compliance and privacy review**. It should link to the firm's privacy policy on its own site.
- With the notice off, the advisor uses their own privacy notice and opt-out.
- **White-label:** nothing a visitor sees mentions or links to financialcontent.ca. The only outside file is Google's.
- **Where the notice script lives:** inline in the tag (as mocked), or on a neutral non-FC domain. On PHP Insights pages and FTT-hosted sites we serve it from the advisor's own domain.

## 8. #601 (FTT-hosted sites)

When FTT hosts the site (the AI site builder idea in #601, Cloudways + Git), we add the tag and banner to the shared template on every deploy, so the advisor skips step 3: "We host your site, so we'll add it for you." Until #601 exists, this state is for sites FTT already hosts by hand.

## 9. Estimates (one developer)

| Piece | Days |
|---|---|
| Admin API provisioning (service account, property + stream, retries, sharding, storage) | 2–3 |
| Data API reports + caching + date ranges | 2–2.5 |
| Analytics Overview UI (tiles, chart, lists, empty/waiting/error states, phone) | 2–2.5 |
| Setup tab (ID, snippet, steps, Check my site, send to web person) | 1.5–2 |
| Cookie banner script + consent mode + settings + preview | 2–3 |
| Auto-insert: PHP renderer update + no double count; FTT-hosted template | 1–1.5 |
| Website tab line, nav item, QA | 0.5–1 |
| **A total (if built directly)** | **11–15.5** |
| **B** (Home card + full page instead of a section) | about the same, **11.5–16** |

Banner legal text and compliance review aren't included.

## 10. Open questions for Alex

1. **Privacy review:** Law 25 and privacy review should confirm that analytics on by default with an opt-out notice is acceptable in each province where advisors' visitors are, including Quebec. We aren't asserting a conclusion.
2. **Cancel:** when an advisor leaves, should the property pause and then be deleted after N days, be handed over, or be kept?
3. **GA access:** do advisors get Viewer access in Google Analytics, or only see numbers in FC?
4. **Who can click "Set up analytics":** advisors and staff (as mocked), or staff only at first?
5. **Notice:** inline in the tag or on a neutral non-FC domain? Who writes and reviews the notice text?
6. **More accounts:** OK to open "FinancialContent 2" at about 1,800 properties, and to cache reports for about 6 hours?
7. **"Send to my web person":** sent as the advisor (Jane Advisor &lt;jane@example.com&gt;) through our mail service. Is that OK?
8. **Existing GA users:** later, should advisors who already have Google Analytics get a "Use my own ID" option?
9. **When does Phase 2 happen?**

Answered: data retention is 2 months (Alex, Oct 26). One property per advisor site in the FinancialContent account (Alex, Oct 26). C first, then A (Oct 26). ~~A or B~~.

# #650 Analytics: build contract (FC-owned Google Analytics, whole site)

> **Direction locked by Alex, Oct 24, 2026:** FC creates and looks after a Google Analytics 4 property for each advisor, tracks the **whole** advisor site, and shows the numbers inside FC in a new **Analytics** section. It is not a Website publishing method.
>
> **Not agent-ready. Soft Dev hold until Alex picks A or B.** Mocks only, with generic names (Jane Advisor, Your Firm Name, example.com) and made-up example numbers.

Mocks: [Hub](index.html) · [Today](today.html) · [A, Analytics section (recommended)](a-analytics-section.html) · [B, Home card + full page](b-home-card.html) · [Advisor site with cookie banner](site-consent.html). Every page has a Desktop / Phone toggle (`?phone`).

## 1. Recommendation

**A: an Analytics item in the sidebar, with Overview and Setup tabs.** It's easy to find, it has room to grow (email and social numbers later), and it keeps setup away from the Website method cards. B (a Home card that opens a full page) is a good add-on later; the card can reuse A's data.

## 2. Screens

| Screen | A (recommended) | B |
|---|---|---|
| Entry point | Sidebar **Analytics** (NEW badge), between Email Campaigns and Calendar. Phone: same item in the top nav. | **Website visitors** card on Home. "See all →" opens a full page (Home › Website visitors). No sidebar item. |
| Overview | Date range, 4 number tiles, visitors-per-day chart, top pages, where visitors came from, devices, top Insights posts | Same content on the full page |
| Setup | **Setup** tab: 1 Your analytics ID · 2 Cookie banner · 3 Add it to your site | Collapsed **Setup** section under the numbers |
| Website tab | One line only: "Analytics: see visitors in Analytics →". No card, strip or field beside Article list / Embed / PHP. | Same line, linking to the full page |
| Advisor site | [site-consent.html](site-consent.html): banner, settings, accepted, declined | Same |

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
| **Consent-limited** | Under the numbers: "Only visitors who accept cookies are counted, so real traffic is higher." |
| **Consent declined** (site) | Banner hides, Google Analytics never loads, nothing is sent. Footer "Cookie settings" reopens the banner. |
| **Banner off** (setup) | "Banner off. Use your own cookie tool. Nothing is tracked until it says a visitor agreed." The snippet changes to the no-banner version. |
| **Turned off** | Confirm, then back to Off. The ID is kept (not deleted) so turning it back on reuses it (see open question). |

## 4. Copy (plain, short)

- Turn on: "See who visits your website" / "Turn on analytics" / "We set it up for you. It takes about a minute."
- Paste steps: 1. Copy the code. 2. Paste it in the &lt;head&gt; of every page (or once in your shared header). 3. Publish your site. 4. Click **Check my site**.
- "Send these steps to my web person": email field + editable message, sent from Jane Advisor &lt;jane@example.com&gt;, includes the code and 4 steps.
- Cookie banner: "Ask visitors first" (on, Recommended). "Nothing is tracked until a visitor clicks Accept. Preview the banner."
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

## 7. Quebec Law 25 and consent

- Tracking is **off by default** until the visitor agrees. The snippet sets Google consent mode default `denied` for analytics and ads storage.
- With the banner on, Google's script (`googletagmanager.com/gtag/js`) loads **only after Accept** (basic consent mode, nothing sent before). Decline means nothing loads. The choice is stored first-party on the advisor's domain, and a footer "Cookie settings" link reopens it.
- Show the banner to every visitor (we can't reliably detect Quebec).
- Banner text: **placeholder, needs compliance review.** It should link to the firm's privacy policy on its own site.
- Banner off: the advisor must use their own consent tool that calls `gtag('consent','update',…)`.
- **White-label:** nothing a visitor can see (banner, snippet, site) mentions or links to financialcontent.ca. The only outside file is Google's.
- **Where the banner script lives:** in the mocks it's inline in the snippet (no outside file). That makes the snippet longer and means wording changes need a re-paste. The alternative is a small script on a neutral, non-FC domain. That's an open question. On PHP Insights pages and FTT-hosted sites we serve it ourselves from the advisor's own domain.

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
| **A total** | **11–15.5** |
| **B** (Home card + full page instead of a section) | about the same, **11.5–16** |

Banner legal text and compliance review aren't included.

## 10. Open questions for Alex

1. **Cancel:** what happens to the property when an advisor leaves: delete after N days, hand it over, or keep it?
2. **GA access:** do advisors get Viewer access in Google Analytics, or only see numbers in FC?
3. **Banner:** build our own small banner (as mocked) or use a provider? And should the banner script be inline in the snippet or on a neutral non-FC domain?
4. **Data retention:** 2 or 14 months?
5. **Quotas:** OK to spread advisors across several FC Google accounts (2,000 properties each), and to cache reports a few hours?
6. **Who writes the banner text?** It's a placeholder until compliance reviews it.
7. **Existing GA users:** should we allow "Use my own ID" later for advisors who already have Google Analytics?
8. **A or B?**

# #728 Automatic social search (onboarding step 5 of 5): build contract

For [#728](https://github.com/kartboy16/content-library/issues/728). Mocks: [hub](index.html), [A](a-list.html), [B](b-cards.html), [C](c-review-later.html), [connect prompt](connect.html), [today](today.html). **Recommend A.** **Not agent-ready. Soft Dev hold until a direction is picked.** Track: idea, playground first.

## Where this lives today (read-only, staging `9a5a9bb`)

- **Profile links:** the public fields on `advisor_configs` are `linkedinPersonal`, `linkedinCompany`, `meta` (Facebook) and `x`. They're edited in `AdvisorConfigManager.jsx` and shown on posts (`PostView.jsx`). **There's no Instagram profile-link field.**
- **Posting connections:** OAuth tokens (`AdvisorSocialTokens`, `socialMediaTokens`) are managed in `SocialSettings.jsx` (Social Media › Settings: LinkedIn, Facebook account, Instagram account). A profile link and a posting connection are already separate things.
- **Reconnect reminders (to reuse):**
  - In-app: `social-connection/SocialConnectionHealthBanner.jsx` is an MUI Alert (warning or error) titled "LinkedIn expiring soon" / "LinkedIn disconnected". It has **Reconnect LinkedIn** (starts `getLinkedInV2AuthorizationURL`) and **Open Settings**. It can be dismissed (localStorage key per advisor, token and status) unless it's blocked.
  - Email: `server/linkedin-token-refresh.js` sends at 30 / 14 / 7 / 1 days before expiry (`renewalEmailSent.*` flags) using `imports/server/social-token-renewal-email.js`. The email links to `/content-library/renew-social/:network` (`RenewSocialLanding.jsx`). That page **doesn't start OAuth until the advisor clicks Continue**, which is already GET-safe.
- **No website social-link extraction and no profile search.** #724's site lookup is the natural place to read the footer links.

## Directions

### A. Saved + "Is this you?" ([a-list.html](a-list.html), recommended)
- The onboarding result has two short lists.
  - **Saved:** profiles that link back to the advisor, each with a reason ("Found on yourfirm.ca" / "Links to yourfirm.ca") and **Not me**.
  - **Is this you?:** suggestions with **Yes, that's me** / **Not me**, and "Not sure? Skip, and decide later in Social."
- Social › Settings has the same two lists (Profile links with **Remove** and **+ Add**; Suggestions (n)), plus a separate **Posting** card (Not connected / Connect).
- After onboarding, the existing health banner shows a new info status: **Connect LinkedIn so we can post for you**.

### B. Network cards ([b-cards.html](b-cards.html))
- One card each for LinkedIn, Facebook and Instagram. Each card shows the profile links (saved or suggested, picked inside the card) and, in Social, a **Posting** row with **Connect {network}**.
- It's clear per network, but suggestions are spread across three cards and the cards get long at 390.

### C. Summary now, review in Social ([c-review-later.html](c-review-later.html))
- Onboarding shows only "2 profiles saved · 3 suggestions to check in Social". It asks for no decisions (zero fields).
- Social puts the suggestions first, under a "3 suggested profiles" alert.
- After onboarding, a **Finish setting up social** card on Home holds Connect LinkedIn and Review suggestions, and the banner is reused as well.

### Shared ([connect.html](connect.html))
- The banner (info) with **Connect LinkedIn** / **Open Settings** / ×.
- "Redirecting to LinkedIn…", then Connected (success) or Cancelled ("Your profile link is still saved", Try again).
- A reminder email whose button opens the existing renew-social landing in a **connect** variant ("Continue to LinkedIn"), plus a landing error state.

## Rules shown in every direction

- **"Saving a link never connects or posts. Posting needs your OK on each network."** This appears on the result, in Social, and in the add dialog.
- **Badges** match #722: LinkedIn `#0077B5` "in", Facebook `#1877F2` "f", Instagram `#E4405F` rounded square with the camera outline SVG.
- **Manual edits win:** a link the advisor removed or dismissed is stored as rejected and is never re-added. The toast says "Removed. We won't add it back." Manually added links are tagged **Added by you** and never replaced.

## States

| Area | States |
|---|---|
| Onboarding step 5 | searching (per-network spinners; **Finish** stays enabled, so it never blocks), result, partial (one network timed out → "We'll try again later"), none found (+ Add a profile link), error (Try again, + Add) |
| Social › Settings | list, confirmed, dismissed, removed (toast with Undo), add-link dialog, added manually, empty |
| Connect prompt | banner, redirecting, connected, cancelled, reminder email, landing, landing error |

## Data

- **Profile links:** keep using `linkedinPersonal`, `linkedinCompany` and `meta` (Facebook), and **add `instagram`**. Add `socialLinkMeta.{field}` = `{ source: 'site'|'search'|'manual', reason: 'found-on-site'|'links-back'|'company-match'|'name-match', foundAt, confirmedAt }`.
- **New `socialSuggestions[]`:** `{ network, url, displayName, reason, score, status: 'pending'|'confirmed'|'dismissed', createdAt }`. Dismissed and removed URLs go in `socialLinkRejected[]` so discovery skips them.
- **Never** create or modify `AdvisorSocialTokens` from discovery.
- **Connect prompt:** extend the connection-health payload with a `not-connected` status (info) for networks with a saved link and no token. Onboarding reminders use the same `renewalEmailSent`-style flags (`connectPrompt1d`, `connectPrompt7d`), and the email reuses `buildSocialTokenRenewalEmail` with a "connect" intro.

## Search approach and API dependencies

1. **Website first (most reliable):** fetch the homepage + /contact + /about (the #724 lookup) and pull out `facebook.com/*`, `linkedin.com/in|company/*` and `instagram.com/*` anchors (footer and elsewhere). These are auto-saved with **Found on yourfirm.ca**. We don't need to respect robots.txt blocks on our side, and we never change advisor-site crawler rules (standing rule).
2. **Name + company search:** a web search API with queries like `site:linkedin.com/in "Jane Advisor" "Your Firm Name"` (per network).
   - **Google Custom Search JSON API is closed to new customers and shuts down Jan 1, 2027. Bing Search APIs were retired Aug 2025.** Use **Brave Search API** (self-serve, about $5 per 1,000 queries) or similar. That's about 4–6 queries per advisor.
3. **Links-back check:** a candidate is auto-saved only if its public page or snippet shows the advisor's domain or exact company name. Otherwise it's a suggestion.
4. **Network limits:**
   - **LinkedIn** has no third-party people or company search API, and its public pages are mostly login-walled (HTTP 999), so this relies on the search snippet.
   - **Meta:** Facebook Page search needs *Page Public Metadata Access* (app review). Instagram's Business Discovery API needs an exact username and our own connected IG business account, so it can't search by name.
   - Expect most Instagram and personal LinkedIn hits to land as **suggestions**, not auto-saves.
5. **Time cap:** about 20 s total in the background, with no retries in the onboarding path. A retry runs once later from the nightly job.

Outside agent time: the Brave (or other) API key and billing, and Meta app review if we want Page search. Without it, Facebook relies on the website + search.

## Out of scope

Auto-connecting or posting; X/Twitter; changing existing reconnect/expiry reminders (we only add a status); scraping behind logins; admin bulk discovery.

## Mobile (390)

The side nav hides. Profile rows stack the badge and URL, with full-width action buttons below. B's cards go single-column. The banner buttons wrap under the text. The dialog is full width.

## Estimate (agent time: cloud agent runs + FC Tester + fix loops)

Scale: #699 took about 30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| 1. Website link extraction (footer + links), save with source, manual-wins / rejected list, Instagram field | 1–1.5 h | 1–1.5 h | 1–1.5 h |
| 2. Search API + candidate scoring + links-back check, suggestions, time cap | 1.5–2.5 h | 1.5–2.5 h | 1.5–2.5 h |
| 3. Onboarding step 5 result + states | 1–1.5 h | 1.25–1.75 h | 0.75–1.25 h |
| 4. Social › Settings profile links + suggestions + add/remove | 1–1.5 h | 1.25–1.75 h | 1.5–2 h (incl. Home card) |
| 5. Connect prompt: banner `not-connected` status, reminder email + landing connect variant | 0.75–1.25 h | 0.75–1.25 h | 0.75–1.25 h |
| **Total** | **≈5.25–8.25 h** | **≈5.75–8.75 h** | **≈5.5–8.5 h** |

- Website-only first (runs 1, 3–5, no search API) is about 3.75–5.75 h for A. Search can follow once an API key exists.
- Wall-clock is about 4.5–7 h.
- FC Tester uses fixture sites and mocked search responses (no live network searches of real people).

## Recommendation

**A.** It splits "saved" from "is this you?" in two short lists that read the same in onboarding and in Social. It works as a plain list at 390, and it reuses the existing health banner as-is with one new status. B spreads decisions over three cards. C is the most zero-click, but it pushes every decision to later and needs a new Home card.

## Open questions

1. **Search API:** OK to use Brave Search API (paid, about $5 per 1,000), given Google CSE is closed to new customers?
2. **Meta app review** for Page search: worth it, or website + search only?
3. **Equivalents:** the prompt shows LinkedIn first. Should Facebook and Instagram get the same banner, or only show in the Posting card?
4. **Reminder cadence:** 1 and 7 days after onboarding (mocked as one email), then stop?
5. **Instagram profile link:** add it to the public post contact links like `meta` and `x`?
6. **Company vs personal LinkedIn:** auto-save a company page only when its website field matches the domain (as mocked)?

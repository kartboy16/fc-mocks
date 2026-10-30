# #687 Voice sampling: build contract (v2, Oct 29, 2026)

Follow-up to [#687](https://github.com/kartboy16/content-library/issues/687), based on [Alex's voice-sampling direction](https://github.com/kartboy16/content-library/issues/687#issuecomment-6507553785). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

**What changed in v2:** connected accounts are now the main way in (section 1). Links are one field that we try to read, with an inline paste box only on a row we couldn't read. There's one general paste section. The per-network "paste instead" was dropped.

## The rule

- Learn the voice **only from writing the advisor did themselves**: posts on their connected accounts, their website, and links or text they add.
- **Never use library posts.** Posts we scheduled for them and their Insights pages are skipped automatically.
- With fewer than about 3 usable samples, prompt the advisor to add more.
- Numbers, rates, dates, tax rules and compliance wording stay locked, as in #687. The advisor approves every post, and **nothing publishes automatically.**

## Recommendation: A, one page

- **[A](a-one-page.html):** Settings › Voice, one page, in this order:
  1. Import from your connected accounts
  2. Your website (with the page review list under it)
  3. Add a link to any post or article
  4. Paste your own writing
  5. Then the sample count with the fewer-than-3 warning, and **Your voice, in plain words**
- **[B](b-steps.html):** the same pieces as guided steps (`?step=1..4`): 1 Your accounts, 2 Your website, 3 Links and pasted text, 4 Your voice. Updated for v2.
- **[C](c-sources.html):** accounts, site card (review in a dialog), link and paste on the left, and a sticky **live profile** on the right. Updated for v2.

## Screens and states

State switches: `?acct=connected|importing|failed|none`, `?st=crawling|done|few|error|unreachable` (website), `?link=reading|ok|failed`.

### 1. Import from your connected accounts (main way)

- Help text: "We read posts you published on your connected accounts. Posts we scheduled for you from the library are skipped. Short posts are pooled: about every 150 words of ticked posts counts as 1 sample."
- Each connected account shows the network, the page name, "**N posts** imported", the ticked words and samples, "🚫 Skipped N posts we scheduled for you from the library", and an expandable list of posts with tickboxes ("untick any you didn't write").
- Networks that aren't connected show "Not connected" and **Connect**. There's also **+ Connect an account** and **Import again**.

| State | Copy |
|---|---|
| `connected` | LinkedIn Company Page: 24 posts, 9 skipped. Facebook Page: 18 posts, 6 skipped. Instagram: 12 posts. X: Not connected, Connect. |
| `importing` | "Importing posts… 14 of 24" with a progress bar, other accounts "Waiting…". "You can leave this page. We'll email you when it's done." |
| `failed` | On the account that failed: "**We couldn't import posts from your Facebook Page.** The connection may have expired. Nothing else changed." Buttons: Reconnect, Try again. Other accounts stay imported. |
| `none` | "**No accounts connected yet.** Connect the accounts you post to, and we'll learn from posts you wrote yourself. You can also use your website, links or pasted text below." Connect buttons for each network. |

### 2. Your website (unchanged from v1)

| State | Copy |
|---|---|
| `crawling` | "Reading **yourfirm.ca**… found **14 pages**, reading 9 of 14. Skipping 22 Insights posts." Progress bar. |
| `done` | "✓ Read **yourfirm.ca** on Oct 29, 2026, 1:40 PM PT. Found **12 pages** with your writing. Skipped **22 Insights posts** (library posts)." |
| `few` | "…Found **4 pages**. Most are short." |
| `error` (partial) | "**We read 3 pages, then yourfirm.ca stopped responding.** We kept the 3 pages we got." Try again. |
| `unreachable` | "**We couldn't reach yourfirm.ca.**" Try again, or add links or paste text instead. |

Under it, **Check the pages we found**: tickboxes, title, URL, word count. Tags: Looks like legal text (unticked), Too short to learn from (disabled), Bios: untick if someone else wrote them. "🚫 Skipped automatically: 22 Insights posts."

### 3. Add a link to any post or article

- One URL field and **Add link**. We try to read the link when it's added.

| State | Row shows |
|---|---|
| `reading` | The link, then "Reading…" with a spinner. |
| `ok` | "✓ Read: 1,100 words", × to remove. |
| `failed` | "Couldn't read", then **on the same row**: "We couldn't read this link. Paste the text instead:" with a text box and "Pasted: N words". The link is kept as the source label. |

The paste box only appears on a row that failed. There's no per-network paste field.

### 4. Paste your own writing

- "Anything you wrote yourself: a newsletter, a speech, an email to clients. Not legal or compliance text." One text box with "Pasted: N words", and **+ Paste another piece**.

### Sample count and fewer-than-3 warning

- "**N** usable samples · about **W** words", counted across accounts, website, links and pasted text.
- Usable: a ticked page, link or pasted piece of at least 150 words, **or** every 150 words of ticked posts from one account (pooled, since social posts are short).
- **Fewer than 3** (live): "⚠ **We need a bit more of your writing.** We only have **2** usable samples. With fewer than 3, rewrites may sound like our standard style instead of you." Buttons: Add a link, Paste some text, Continue anyway. Demo: `?acct=none&st=few&link=failed`.

### 5. Your voice, in plain words (editable, unchanged from v1)

- While reading: "Your voice profile appears when we finish reading." Too few: "Add a bit more of your writing (at least 3 samples)…"
- Ready: "Built from N samples (about W words). None from library posts." An editable paragraph, phrase and avoid chips with **+ Add**, sign-off, a "Sounds like" line (never published), the 🔒 locked note ("…nothing publishes automatically"), and Rebuild, Reset my edits, **Save voice profile**.

All accounts, sites, posts and figures are **example data** with generic names (Jane Advisor, Your Firm Name, yourfirm.ca, example.com). There's no compliance or legal copy here.

## In and out of scope

- **In:**
  - Importing the advisor's own posts from connected LinkedIn company pages, Facebook Pages and Instagram (existing OAuth), skipping posts in `social_post_queue`.
  - Account states (connected, importing, failed with reconnect, none), and pooled counting for short posts.
  - Crawling the advisor's own domain (WordPress and static), skipping Insights and library posts.
  - Text extraction, legal and short auto-untick, and dedupe.
  - One link field: read, then inline paste on failure. One general paste section.
  - The review lists, usable count, fewer-than-3 prompt, and the editable plain-words profile.
  - Phone layout.
- **Out:**
  - X/Twitter import (no X connection exists today; "Connect" is shown as a placeholder, open question).
  - Personal LinkedIn profiles (today's connection is company pages).
  - Learning from the advisor's edits ("later").
  - Crawling other domains, any auto-publish (never), the rewrite screen (#687 A, unchanged), compliance wording.

## Mobile (390px)

- Sections stack. Account cards wrap; post lists open full width.
- The domain and link fields' buttons go full width. Review rows hide the word count, and long URLs wrap.
- B's steps wrap onto two lines. C's live profile moves below the sources and stops being sticky.

## Build note

1. **Account import:**
   - Use the stored tokens from `oauth-social.js`. Pull the last ~50 posts per account in a background job (`voice_imports`: account, status, found, skipped, error), with progress shown and an email when done.
   - LinkedIn: the organization's posts for the admin page. Facebook: Page posts. Instagram: media captions.
   - **Skip any post matching `social_post_queue`** for this advisor (by platform post id where stored, otherwise by text similarity), and any post closely matching an `HTMLPosts` post. Show the count as "Skipped N posts we scheduled for you".
   - An expired token or permission error marks just that account `failed` with Reconnect; other accounts stay.
   - Store each post in `voice_samples` with `source: social`, `network`, `postId`, `words`, `included`.
2. **Crawl** (as v1): background job, sitemap then WordPress REST then same-domain crawl, robots, ~1 req/s, ~60 pages, timeouts. Skip the Insights path, `WebsitePostQueue` URLs and pages matching `HTMLPosts`.
3. **Extract text:** readability-style main content, dedupe, word counts, hash in `voice_samples` (`source`: `social|site|link|paste`). **No text from library posts is ever stored as a sample.**
4. **Auto-untick:** legal pages, pages under 150 words (disabled), team or bio pages (ticked, tagged). The advisor's tick always wins.
5. **Links:** fetch on Add (timeout ~10s). A login wall, 4xx/5xx, or an empty or too-short body shows the inline paste box on that row. Which links we can read is an open question for Software developer.
6. **Threshold:** usable means included and at least 150 words, with social posts pooled per account (every 150 ticked words = 1). Warn below 3. "Continue anyway" builds a profile flagged `thin: true`.
7. **Profile:** built only from included samples, #687's structured output plus a plain-words paragraph. Edits survive a rebuild unless Reset. Records which samples it came from.
8. **Privacy:** only the advisor's own accounts, domain and entered URLs are read. Samples are deleted when removed or when the profile is deleted.

## Estimate (days)

| Piece | A | B | C |
|---|---|---|---|
| **New:** social import (LinkedIn company page, Facebook Page, Instagram), job, progress, token errors | 2–3 | 2–3 | 2–3 |
| **New:** skip library-scheduled posts (`social_post_queue`, similarity) | 0.5–0.75 | 0.5–0.75 | 0.5–0.75 |
| **New:** accounts UI and states (connected, importing, failed, none, post review) | 1–1.5 | 1–1.5 | 1–1.5 |
| **New:** pooled counting for short posts | 0.25 | 0.25 | 0.25 |
| Crawler (sitemap, WP REST, link crawl, robots, limits, job and progress) | 2–2.5 | 2–2.5 | 2–2.5 |
| Text extraction, dedupe, word counts, `voice_samples` | 1–1.5 | 1–1.5 | 1–1.5 |
| Site library-post skip (Insights path, queue URLs, similarity) | 1–1.5 | 1–1.5 | 1–1.5 |
| Auto-untick (legal, short, bio) | 0.5 | 0.5 | 0.5 |
| Link field: read, reading/ok/failed, inline paste (simpler than v1) | 0.75–1 | 0.75–1 | 0.75–1 |
| **New:** general paste section | 0.25 | 0.25 | 0.25 |
| Review lists, live count, fewer-than-3 prompt | 1.5–2 | 1.5–2 | 1.5–2 (dialog) |
| Plain-words profile build, edit, rebuild, reset | 1–1.5 | 1–1.5 | 1–1.5 |
| Crawl error and unreachable states, email when done | 0.75–1 | 0.75–1 | 0.75–1 |
| Wizard shell (B) or live-rebuilding profile (C) | — | 0.75–1 | 1.5–2 |
| Phone layout and QA (WordPress, static, links, each network) | 1.25–1.75 | 1.25–1.75 | 1.25–1.75 |
| **Total** | **≈13.75–19** | **≈14.5–20** | **≈15.25–21** |

v1 was ≈10–13.75 for A (the rows actually summed to ≈9.75–13.5). v2 adds **≈4–5.5 days** for account import. This replaces the #687 A lines for fetching the advisor's posts and profile extraction and UI (≈4–5.5 days), so the net addition to #687 A is about **+9.75–13.5 days**.

## Open questions

1. **Which links we can read (pending Software developer).** Which sites return readable text to a plain fetch, which need a headless browser, and which (for example social posts behind a login) always fall back to paste?
2. Should X be offered at all? There's no X connection today, so "Connect" would need new OAuth work (not in the estimate).
3. How many posts per account to import (mocked as all recent, about 50 max), and how far back?
4. Is pooling right for short posts (every 150 ticked words from one account = 1 sample)? And 150 words per sample with a warning below 3: should "Continue anyway" be allowed?
5. Should JavaScript-rendered static sites be read with a headless browser, or rely on links and paste?
6. How strict should library-post detection be for posts the advisor edited before posting?
7. Team bios ticked by default (as mocked) or unticked? How often to re-import and re-crawl?
8. A, B or C?

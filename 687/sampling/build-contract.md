# #687 Voice sampling: build contract (v3, simple, Oct 29, 2026)

Follow-up to [#687](https://github.com/kartboy16/content-library/issues/687) and [Alex's voice-sampling direction](https://github.com/kartboy16/content-library/issues/687#issuecomment-6507553785). Mocks: [hub](index.html). Earlier version: [A v2](a-one-page-v2.html), [B v2](b-steps-v2.html), [C v2](c-sources-v2.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## The rule

- Learn the voice **only from the advisor's own writing**: their connected accounts, their website, and any link or text they add.
- **Never use library posts.** Posts we scheduled (`social_post_queue`) and the site's Insights pages are skipped automatically.
- Numbers, rates, dates, tax rules and compliance wording stay locked, as in #687. The advisor approves every post. **Nothing publishes automatically.**

## Recommendation: A

- **[A](a-one-page.html):** Settings › Voice. One card: heading, one line, one **Learn my voice** button. The result is one line plus two collapsed sections and Save.
- **[B](b-steps.html):** the same start, but the result opens as **one summary panel**: the voice in plain words is shown straight away, with Edit and "Review what we found" opening dialogs. It's the only alternative kept.
- C was dropped: in the simple flow it no longer differed meaningfully. It's kept as an [earlier version](c-sources-v2.html).

## Screens and states (`?st=start|working|done|few|linkfailed`, `?phone`)

| State | What shows |
|---|---|
| `start` | "Learn your writing voice", "We'll read your connected accounts and your website to learn how you write.", **Learn my voice**. One quiet line: "Using: Facebook Page, LinkedIn page, Instagram, yourfirm.ca · Connect another account". Under it, two optional inputs: "Add a link to something you wrote" (URL + Add) and a collapsed "Paste your own writing". |
| `working` | "Reading your posts and website…" with a progress bar. The page can be left (email when done). |
| `done` | "✓ Learned from **38** samples". Collapsed **Review what we found** and **Your voice profile**, then Learn again and **Save**. |
| `few` | As done, plus one line: "⚠ That's not much yet. Add a link or paste some writing so rewrites sound like you." Shown only when there are fewer than 3 samples. |
| `linkfailed` | A link row: "Couldn't read" and, on that row, "We couldn't read this link. Paste the text instead:" with a text box. The mock uses an X link. |

- **Review what we found** (collapsed): one line per source, with its list behind "Show posts" or "Show pages".
  - "Facebook Page · 50 posts read · 6 we scheduled for you skipped", and the same for the LinkedIn page and Instagram. Posts can be unticked.
  - "yourfirm.ca · 7 pages read · 22 Insights posts skipped". Legal pages are unticked, pages under 150 words are disabled, and team bios are tagged.
  - "Your links and pasted writing", listing each with its word count.
  - If an account or the site fails, its line says so, for example "Couldn't read your LinkedIn page. Reconnect", and the rest still counts. Not mocked as a separate state.
- **Your voice profile** (collapsed): an editable plain-words paragraph and the 🔒 line "Numbers, rates, dates and compliance wording are never changed. You approve every post."
- Counting: a ticked page, link or pasted piece of at least 150 words counts as 1 sample. Short social posts are pooled per account, so every 150 ticked words counts as 1.
- There are no estimates or explainer notes on the mock pages. Example data uses generic names only (Jane Advisor, Your Firm Name, yourfirm.ca, example.com).

## What we can read (per Software developer)

| Source | Readable? | In the flow |
|---|---|---|
| Facebook Page | **Readable today** | Imported automatically, last 50 posts |
| LinkedIn company page | **Probable** | Imported automatically, last 50 posts |
| Instagram business account | **Probable** | Imported automatically, last 50 captions |
| Personal LinkedIn profile | **Can't be read** | Not an account. A link to it fails and asks for the text. |
| X | **Can't be read** | **Not an account (left out).** A link to it fails and asks for the text. |
| The advisor's website | Crawled (WordPress or static) | Automatic. Insights pages skipped. |
| Other links | Tried with a plain fetch | If it fails, the row asks for the text. |

- **Default import: the last 50 posts per account**, minus posts in `social_post_queue` and posts closely matching an `HTMLPosts` post.

## In and out of scope

- **In:**
  - The one-button flow, with a background job reading all connected accounts (last 50 posts each) and crawling the site.
  - Skipping library posts.
  - The optional link field (with inline paste on failure) and the paste box.
  - The result line, the fewer-than-3 line, the collapsed review with ticks, the collapsed editable profile, and Save.
  - Per-source failure lines, and the phone layout.
- **Out:**
  - An X account and personal LinkedIn.
  - Learning from the advisor's edits ("later").
  - Any auto-publish (never), the rewrite screen (#687 A), and compliance wording.

## Build note

1. **One job** (`voice_learn`: status, per-source counts, skipped, errors) starts on Learn my voice. It imports the last 50 posts from each connected Facebook Page, LinkedIn company page and Instagram business account, using the stored tokens. It crawls the website: sitemap, then WordPress REST, then same-domain links, respecting robots, about 1 request a second, about 60 pages, with timeouts.
2. **Skips:** `social_post_queue` posts, the Insights path, `WebsitePostQueue` URLs, and anything closely matching `HTMLPosts`. Library text is never stored as a sample.
3. Text goes into `voice_samples` (`source`: `social|site|link|paste`, `included`, `autoReason`). Legal pages are unticked, pages under 150 words are disabled, and bios are tagged.
4. **Links:** fetched on Add. A login wall, an error, or an empty or short body shows the inline paste box on that row.
5. **Profile:** built from included samples only. It's #687's structured output plus a plain-words paragraph, and the advisor's edits survive Learn again.

## Estimate (days)

| Piece | A | B |
|---|---|---|
| Social import (FB, LinkedIn company, IG business; last 50; job; token errors) | 2–3 | 2–3 |
| Skip library-scheduled posts (`social_post_queue`, similarity) | 0.5–0.75 | 0.5–0.75 |
| Site crawler (sitemap, WP REST, link crawl, robots, limits) | 2–2.5 | 2–2.5 |
| Text extraction, dedupe, `voice_samples` | 1–1.5 | 1–1.5 |
| Site library-post skip (Insights, queue URLs, similarity) | 1–1.5 | 1–1.5 |
| Auto-untick (legal, short, bio) | 0.5 | 0.5 |
| Link field with inline paste | 0.75–1 | 0.75–1 |
| Paste box | 0.25 | 0.25 |
| One-button flow, working state, result line, few line, collapsed review | 1.25–1.75 | 1.25–1.75 |
| Pooled counting for short posts | 0.25 | 0.25 |
| Plain-words profile: build, edit, save | 1–1.5 | 1–1.5 |
| Per-source failure lines, email when done | 0.5–0.75 | 0.5–0.75 |
| Summary panel and dialogs (B) | — | 0.25–0.5 |
| Phone layout and QA | 1–1.5 | 1–1.5 |
| **Total** | **≈12–16.75** | **≈12.25–17.25** |

- The simple version is about 1.75 to 2.25 days less than v2's A (≈13.75–19), mainly because one flow and one collapsed review replace the per-account cards and states.
- It replaces the #687 A lines for fetching posts and the profile UI (≈4–5.5), so the **net addition to #687 A is about +8–11.25 days**.

## Open questions

1. Can LinkedIn company pages and Instagram business accounts actually be read with today's scopes? Software developer says probable.
2. Is 150 words per sample, pooled for social posts, with a line below 3 samples, right?
3. Should the last 50 posts be capped by age too (for example 2 years)?
4. Do we read JavaScript-rendered static sites with a headless browser, or rely on links and paste?
5. A or B?

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

## Estimate (agent time, per Alex's Oct 30 rule)

This is the Cursor cloud agent build plus FC Tester time, with 1–2 review and fix loops per run, in minutes and hours (not developer days). For calibration, #699 took about 30 min from handoff to tested. This is too big for one run, so it's split into **4 cloud-agent runs**, based on v3 (`a7ef1dc`) A and B.

| Run | Covers | Build | FC Tester | Fix loops (1–2) | Run total |
|---|---|---|---|---|---|
| 1. Connected-account import | `voice_learn` job (status, counts, errors), `voice_samples` model, last 50 posts from the FB Page, LinkedIn company page and IG business account with stored tokens, token and reconnect errors, skip `social_post_queue` and posts close to `HTMLPosts` | 45–60 min | 20–30 min | 20–40 min | **≈1.5–2.25 h** |
| 2. Site crawl | Sitemap, then WP REST, then same-domain links, robots, about 1 request a second, about 60 pages, timeouts. Text extraction and dedupe, skip Insights and `WebsitePostQueue` URLs, auto-untick legal pages, short pages and bios | 45–75 min | 20–30 min | 20–40 min | **≈1.5–2.5 h** |
| 3. Link and paste input | Link field fetched on Add, inline paste when it fails (login wall, error, short body), paste box, word counts, 150-word samples with pooled counting for social posts | 20–30 min | 10–15 min | 10–20 min | **≈40–65 min** |
| 4. Voice profile and review UI | Profile from included samples (#687 structured output plus the plain-words paragraph, edits survive Learn again). Settings › Voice one-button flow, working state with email when done, result line, fewer-than-3 line, collapsed review with ticks, per-source failure lines, editable profile and Save, phone layout | 45–60 min | 20–30 min | 20–40 min | **≈1.5–2.25 h** |
| **Total A** | | | | | **≈5.25–8 h** |
| B adds the summary panel with Edit and Review dialogs (run 4) | | +10–15 min | +5–10 min | +0–10 min | **+15–35 min, so B ≈5.5–8.5 h** |

- **Order:** run 1 first, because it sets up `voice_learn` and `voice_samples`. Runs 2 and 3 can then go in parallel, and run 4 goes last. That's about **4.5–7 h of wall-clock time** when 2 and 3 run in parallel.
- **Against #687 A:** this replaces #687 A's fetch-posts and profile-UI pieces (about 1–1.5 h of agent time), so it adds **about 4–7 h net** to #687 A.
- **Test dependency (not included):** FC Tester needs a test advisor with a connected FB Page, LinkedIn company page and IG business account that have posts, including some library-scheduled ones, plus a test WordPress site with an Insights section. Without these, QA runs against stubs, and the real check waits until the accounts exist. LinkedIn and IG scopes are still "probable" (open question 1). If they're blocked, run 1 shrinks to Facebook only (about 20–30 min less).
- Replaces the earlier human-developer estimate (A ≈12–16.75 days, B ≈12.25–17.25 days).

## Open questions

1. Can LinkedIn company pages and Instagram business accounts actually be read with today's scopes? Software developer says probable.
2. Is 150 words per sample, pooled for social posts, with a line below 3 samples, right?
3. Should the last 50 posts be capped by age too (for example 2 years)?
4. Do we read JavaScript-rendered static sites with a headless browser, or rely on links and paste?
5. A or B?

# #687 Voice sampling: build contract

Follow-up to [#687](https://github.com/kartboy16/content-library/issues/687), based on [Alex's voice-sampling direction](https://github.com/kartboy16/content-library/issues/687#issuecomment-6507553785) (Oct 29, 2026). Mocks: [hub](index.html). The first #687 mocks are in the [#687 hub](../index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## The rule

- Learn the voice **only from writing the advisor did themselves**: their website, plus links or text they add.
- **Never use library posts.** Those are our voice, not theirs.
- With fewer than about 3 usable samples, prompt the advisor to add more, so rewrites don't echo our house style.
- Numbers, rates, dates, tax rules and compliance wording stay locked, as in #687. The advisor approves every post, and **nothing publishes automatically.**

## Recommendation: A, one page

- **[A](a-one-page.html):** Settings › Voice, with four numbered sections on one page:
  1. Your website
  2. Your other writing
  3. Check what we found
  4. Your voice, in plain words

  Everything is visible at once, it's easy to come back to and edit, and it's the fewest screens. It replaces the #687 A voice-profile page and keeps its look.
- **[B](b-steps.html):** the same four sections as guided steps (`?step=1..4`). Clear for the first time, but slower every time after. Step 3's Next button says "Continue with 2 samples" when there are too few.
- **[C](c-sources.html):** source cards on the left (the site card opens a review dialog) and a sticky **live profile** on the right that updates as items are ticked and added. Friendly, but the profile has to rebuild on every change (AI cost and latency), and it's a bigger build.

## Screens and states (`?st=crawling|done|few|error|unreachable`)

### 1. Your website

| State | Copy |
|---|---|
| `crawling` | "Reading **yourfirm.ca**… found **14 pages**, reading 9 of 14. Skipping 22 Insights posts. You can leave this page. We'll email you when it's done." Shows a progress bar. |
| `done` | "✓ Read **yourfirm.ca** on Oct 29, 2026, 1:40 PM PT. Found **12 pages** with your writing. Skipped **22 Insights posts** (library posts)." |
| `few` | "…Found **4 pages**. Most are short." |
| `error` (partial) | "**We read 3 pages, then yourfirm.ca stopped responding.** We kept the 3 pages we got." Try again, "or add links and paste text below." |
| `unreachable` | "**We couldn't reach yourfirm.ca.** Check the address is right. If the site is up, it may be blocking automated visits." Buttons: Try again, Add links or paste text instead. |

The domain field (prefilled from `websiteAddress`) has a **Read my site again** button.

### 2. Your other writing

- Help text: "Add links to articles, columns or social posts you wrote. If we can't open a link, paste the text."
- Each link row shows its status:
  - "✓ Read: 1,100 words"
  - "Couldn't open this link", followed by "LinkedIn and Facebook usually block us from reading posts. Paste the text of the post here instead:" and a text box
  - "Pasted: 164 words"
- Buttons: **+ Add a link**, **+ Paste text without a link**, and × to remove a row.

### 3. Check what we found

- Help text: "Untick anything you didn't write yourself, like legal pages or copy a designer or someone else wrote. Only ticked items are used."
- Each item shows a tickbox, the title, the URL and a word count.
- Tags:
  - **Looks like legal text** (Privacy, Terms): unticked by default.
  - **Too short to learn from** (under 150 words): disabled.
  - **Bios: untick if someone else wrote them** (team page).
- Shown below the list: "🚫 **Skipped automatically: 22 Insights posts** at yourfirm.ca/insights/. These are library posts, so they aren't your writing." There's a "See the list" link, but those posts can't be ticked.
- A meter: "**N** usable samples · about **W** words". Usable means ticked and at least 150 words. Pasted text and links count too.
- **Fewer than 3** (live, recounted on every tick and paste): "⚠ **We need a bit more of your writing.** We only have **2** usable samples. With fewer than 3, rewrites may sound like our standard style instead of you." Buttons: **Add a link**, Paste some text, Continue anyway.

### 4. Your voice, in plain words (editable)

- **While crawling:** "Your voice profile appears when we finish reading."
- **Too few samples:** "Add a bit more of your writing (at least 3 samples) and we'll describe your voice here."
- **Ready:**
  - "Built from N samples (about W words). None from library posts. Change anything that doesn't sound like you."
  - An **editable plain-words paragraph**, for example: "You write warmly and plainly, in short sentences (about 13 words)…"
  - Phrases you use and words you avoid, as removable chips with **+ Add**.
  - How you sign off.
  - A "Sounds like" sample line, never published.
- Locked note: "🔒 Your voice never changes numbers, rates, dates, tax rules or compliance wording… You still approve every post, and **nothing publishes automatically**."
- Buttons: Rebuild from my samples, Reset my edits, **Save voice profile**.

All sites, posts and figures are **example data** with generic names (Jane Advisor, Your Firm Name, yourfirm.ca, example.com). There's no compliance or legal copy here.

## In and out of scope

- **In:**
  - Crawling the advisor's own domain (WordPress and static sites), skipping Insights and library posts.
  - Text extraction, legal and short auto-untick, and dedupe.
  - Adding links, with fetch and a paste fallback.
  - The review list with ticks, the usable-sample count and the fewer-than-3 prompt.
  - Building the plain-words profile from ticked samples only, with editing, rebuild and reset.
  - Saving and re-crawling, and the phone layout.
- **Out:**
  - Learning from the advisor's edits to rewrites. Alex marked that "later".
  - Logging in to LinkedIn or Facebook, or using their APIs (the paste box covers it).
  - Crawling other domains from the advisor's site.
  - Any auto-publish (never).
  - The rewrite screen itself, which is #687 A, unchanged.
  - Compliance wording (placeholders only).

## Mobile (390px)

- The sections stack.
- The domain buttons go full width.
- Review rows hide the word count (it's still in the meter), and long URLs wrap.
- Paste boxes are full width.
- B's steps wrap onto two lines.
- C's live profile moves below the sources and stops being sticky. The review dialog fills the screen.

## Build note

1. **Crawl:**
   - Run it as a background job (`voice_crawls`: status, found, read, skipped, error, startedAt and finishedAt in PT), and poll it from the page. Email when it finishes, if the advisor left.
   - Order: `sitemap.xml` and sitemap index, then WordPress REST (`/wp-json/wp/v2/pages` and `/posts`, `content.rendered`) if it's available, then a same-domain link crawl from `/`.
   - Respect `robots.txt`, use about 1 request a second and an identifying user agent, cap it at about 60 pages and 2 MB per page, and set timeouts.
   - Follow redirects within the domain, including www and non-www.
   - Static sites that render text with JavaScript may come back empty. Show them as short pages, and the prompt for links or paste covers it (open question: use a headless browser?).
2. **Skip library posts:**
   - Skip the advisor's Insights path (where the website publisher posts).
   - Skip any URL in `WebsitePostQueue` (published) for this advisor.
   - Skip any page whose main text closely matches an `HTMLPosts` post (shingle or embedding similarity above a threshold).
   - Show the count as "Skipped automatically". These are never ticked or counted.
3. **Extract text:**
   - Use readability-style main content. Strip nav, header, footer, cookie banners, forms and repeated blocks across pages, and dedupe.
   - Store the text, word count and hash in `voice_samples` (`advisorId`, `source`: `site|link|paste`, `url`, `title`, `words`, `included`, `autoReason`: `legal|short|bio|null`, `fetchedAt`).
   - Paste text is stored as typed. **No text from library posts is ever stored as a sample.**
4. **Auto-untick:** legal pages (privacy, terms, disclaimer, accessibility, cookie, by URL and title keywords), pages under 150 words (disabled), and team or bio pages (ticked, but tagged). The advisor's tick always wins.
5. **Links:**
   - Fetch on Add. LinkedIn and Facebook URLs, a 4xx login wall or an empty body all show "Couldn't open this link" with a paste box.
   - The link is kept as the source label for pasted text.
6. **Threshold:**
   - Usable means included and at least 150 words.
   - Warn below 3. "Continue anyway" builds the profile but flags it `thin: true`, and we remind the advisor later (open question).
7. **Profile:**
   - Built only from included samples. Use #687's structured output plus a **plain-words summary** paragraph.
   - Advisor edits overwrite fields, and a rebuild keeps edited fields unless the advisor clicks Reset.
   - The profile records which samples and versions it came from, for the #687 audit trail.
8. **Privacy:** only the advisor's own domain and the URLs they enter are fetched. Samples are deleted when the advisor removes them or deletes the profile.

## Estimate (days)

| Piece | A | B | C |
|---|---|---|---|
| Crawler (sitemap, WP REST, link crawl, robots, limits, job and progress) | 2–2.5 | 2–2.5 | 2–2.5 |
| Text extraction, dedupe, word counts, `voice_samples` | 1–1.5 | 1–1.5 | 1–1.5 |
| Library-post skip (Insights path, queue URLs, similarity) | 1–1.5 | 1–1.5 | 1–1.5 |
| Auto-untick (legal, short, bio) | 0.5 | 0.5 | 0.5 |
| Add links, fetch, blocked detection, paste fallback | 1–1.5 | 1–1.5 | 1–1.5 |
| Review list, ticks, live count, fewer-than-3 prompt | 1.5–2 | 1.5–2 | 1.5–2 (dialog) |
| Plain-words profile build, edit, rebuild, reset | 1–1.5 | 1–1.5 | 1–1.5 |
| Crawl error and unreachable states, email when done | 0.75–1 | 0.75–1 | 0.75–1 |
| Wizard shell (B) or live-rebuilding profile (C) | — | 0.75–1 | 1.5–2 |
| Phone layout and QA (WordPress, static, blocked links) | 1–1.5 | 1–1.5 | 1–1.5 |
| **Total** | **≈10–13.75** | **≈10.75–14.75** | **≈11.5–15.75** |

This replaces the #687 A lines for fetching the advisor's posts and for profile extraction and UI (≈4–5.5 days). The net addition to #687 A is about **+6–8.25 days**.

## Open questions

1. Should JavaScript-rendered static sites be read with a headless browser (more cost and time), or should we rely on links and paste?
2. Is "usable" right at 150 words per sample, with a warning below 3 samples? Should "Continue anyway" be allowed, or should it block?
3. How strict should library-post detection be? Should pages that quote a library post in part be skipped or flagged?
4. Should team bios be ticked by default (as mocked) or unticked?
5. How often should we re-crawl? Only when the advisor clicks, or monthly, with new pages showing up for review?
6. Can staff or assistants run the setup for an advisor? If they do, whose writing is it?
7. When we add "learn from their edits" later, should edits count as samples automatically or show up in this review list?
8. A, B or C?

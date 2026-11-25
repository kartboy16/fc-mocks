# #601 AI website builder: build contract (mock stage)

**Status:** mocks for review. Not agent-ready. Soft Dev hold until a direction is picked. Issue #601 is still "idea / parked", and its plan calls for a hand-run hosting pilot before any build.

**Problem in one sentence:** advisors can't build or change their own website inside FC, so they use outside AI site builders that have no compliance check, no FTT hosting and no support contact.

Mocks: [hub](./) · [A. Checks panel under the preview](a-panel.html) (recommended) · [B. Checks tab in the right pane](b-tab.html) · [C. Checks posted in the chat](c-chat.html). Add `?s=<scene>` for a scene and `&phone=1` for the 390 view.

## 1. What stays the same in every direction

- **Layout:** chat on the left (400 px) and a live preview of the draft site on the right. The FC app rail stays on the left. The top bar holds the title, the site and draft version, Version history, and Publish.
- **Chat:** an empty state with prompt suggestions. The advisor's messages appear on the right and the assistant's on the left. The assistant replies with a plan and a **Build it** button, then a build progress list, then "Your site is ready". Every edit reply shows a before/after diff with **Show changes** and **Undo this change**.
- **Preview:** a browser frame showing the draft address (`jane-advisor.example.net`, placeholder host) and the page picker. The site's own nav (Home, About, Services, Contact, News) switches pages in the mock. Changed blocks get a green outline with a "Changed" or "Added" tag, and the preview scrolls to the change.
- **Publish:** step 1 picks the address (own domain `example-advisor.ca` or a free subdomain on a generic host). If findings are still open, the real acknowledge step follows. Step 2 confirms, then come the publishing progress, success and error screens.
- **Phone (390):** Chat and Preview become tabs under the top bar (B adds a third Checks tab). The preview frame and Checks stack in the Preview tab. Dialogs go full screen, with buttons stacked full width at least 40 px tall.

## 2. Scenes (same ids on A, B and C)

| `?s=` | What it shows |
|---|---|
| `start` | Empty chat with 4 suggestions, an empty preview skeleton, and Publish off |
| `typed` | The sample prompt typed in the composer |
| `plan` | The assistant's plan with Build it / Change something |
| `generating` | Build progress in chat and a shimmering skeleton |
| `checking` | Site generated, checks running ("Checking…"), Publish off while checking |
| `clean` | No findings |
| `hero` | "Make the hero shorter", with the diff in chat and the changed hero outlined |
| `testi` | "Add a testimonials section" with the advisor's own quote. 3 findings (2 compliance, 1 proofreading), highlighted in the preview |
| `jump` | Click-to-jump: Show in preview scrolls to and pulses the highlight. Clicking a highlight selects its finding |
| `aifix` | Ask AI to fix: 2 fixed, 1 left (past performance), "Fixed. Checks ran again." |
| `reviewed` | The past-performance finding marked reviewed (Undo), "Nothing left to review here" |
| `error` | The checker couldn't run, so Publish is off |
| `pub-domain` | Publish step 1: pick the address |
| `pub-ack` | The acknowledge dialog (warn mode, the default) with the tick box |
| `pub-blocked` | The same dialog in block-compliance or block-all mode, with Continue disabled |
| `pub-confirm` | Publish step 2: confirm |
| `publishing` | Progress |
| `success` | Live |
| `pub-error` | Publish failed and the live site is unchanged. This scene also shows the adapted stale-check message |

## 3. The real checker this mock mirrors (read-only code review)

Source: `kartboy16/content-library`, branch **staging @ 8a5e9168** (Nov 24 2026), path `imports/features/private-posts/`. It came from #964 "Private owner-only advisor posts" through PR #976, merged to staging on Nov 19 2026 at 4:04 PM PT. It is **not on main yet** (main is at eeb5987a, Nov 19). The checker runs when an advisor saves a private ("My posts") post.

### How it works
- **When it runs:** on every save (create or update) and from the Run check button. The server runs it, and the browser never decides (`server/postCheck.js:2-3`, `shared/checker.js:1-5`).
- **Two groups:** `compliance` and `proofreading` (`shared/constants.js:55`). Each group runs on its own. If one throws, the status is `partial`; if both throw, it's `error`; otherwise it's `ok` (`shared/checker.js:221-247`). A failed run is stored as status `error` (`server/postCheck.js:32-33`).
- **Fields read:** the post's plain text in `name`, `excerpt` and `bodyText` (`shared/checker.js:117-123`). It returns at most 100 findings (`shared/constants.js:57`).
- **Compliance rules are regex placeholders** until Legal supplies the wording (`shared/checker.js:7-8, 13-61`, README line 86):

| Rule id | Label | Matches | Message (verbatim) | Suggestion |
|---|---|---|---|---|
| guarantee | Promissory language | guarantee, guaranteed, guarantees | Avoid promising outcomes. (PLACEHOLDER rule text) | Remove the guarantee or describe it as a goal. |
| risk-free | Risk claim | risk-free, no risk, without (any) risk | Every investment carries some risk. (PLACEHOLDER rule text) | Describe the risk level instead. |
| cant-lose | Promissory language | can't/cannot lose, never lose, sure thing | Avoid saying an investment cannot lose. (PLACEHOLDER rule text) | Remove the claim. |
| outperform | Performance promise | will/always outperform, beat the market | Avoid predicting future performance. (PLACEHOLDER rule text) | aims to improve outcomes (replacement, so **Fix** is offered) |
| superlative | Superlative claim | the best / #1 / number one + advisor, adviser, investment, fund, planner | Superlatives need support. (PLACEHOLDER rule text) | Remove the superlative. |
| past-performance | Past performance | returned / returns of / gained / grew (by) / up + N% | Mentions of past returns need a disclosure. (PLACEHOLDER rule text) | Add disclosure: "Past performance is not indicative of future results." (PLACEHOLDER). Skipped when the text already says "past performance is/does not" |

- **Proofreading:** Repeated word, Extra space, Capitalization ("I" and the start of a sentence), Punctuation (a space after a comma), plus Spelling from a dictionary. A missing dictionary is an error, never a silent pass (`shared/checker.js:66-106, 185-214`).
- **There is no testimonial rule.** The mock does not claim testimonials are flagged. In the `testi` scene the flags come from the **Superlative claim** and **Past performance** rules matching the advisor's quote, and from **Capitalization** on "i".
- **What the owner can do with a finding:** compliance findings can be **Mark reviewed** and proofreading findings can be **Dismiss**ed, each with **Undo** (`shared/constants.js:60-64`, `ui/CheckerPanel.jsx:144-190`). **Fix** shows only when the suggestion is replacement text (`shared/checker.js:139-140, 162`). Today that means `outperform` and the proofreading rules. Past performance has an "Add disclosure" label (`ui/CheckerPanel.jsx:148`), but the rule has no `replace`, so the button doesn't show.
- **Reviewed and dismissed states carry over only while the content is unchanged** (`shared/checker.js:250-268`).

### Send gate (blocking vs warning)
Source: `shared/sendGate.js:1-69` and `server/gate.js`. The mode comes from the setting `private.postCheck.mode` (README lines 82-84):
- **warn (default):** open findings need the owner's acknowledgement. The owner, or a support or admin user acting for them (`shared/attribution.js:23`), ticks "I've reviewed these findings and want to continue." The acknowledgement is tied to the content hash and to every open finding id.
- **block-compliance:** open compliance findings block, and proofreading findings need the acknowledgement.
- **block-all:** any open finding blocks.
- **Always blocks, in every mode (fail closed):** not checked yet, checked but the content changed since (stale), and a checker error or partial run (`shared/sendGate.js:46-50`). An unknown mode value is treated as block-all (`shared/sendGate.js:16-21`).
- **Error codes and copy** (`shared/constants.js:80-98`): post-check-required, post-check-stale, post-check-error, post-check-unacknowledged, post-check-blocked, post-changed-since-scheduled.

### UI copy reused verbatim (`ui/CheckerPanel.jsx`)
- **Status chip (68-82):** Not checked · Checking… · Out of date · Couldn't run · *N* to review · No findings
- **Status bar (86-110):** "**Checks** Checking compliance and proofreading…", "**Checks** No findings. Compliance and proofreading both checked.", "**Checks** *N* to review: *c* compliance, *p* proofreading."
- **Checks panel:** the "Checks" title and the Compliance *n* and Proofreading *n* tabs (349-350). The "PLACEHOLDER: compliance rule wording to be supplied by legal." caption (361). Finding cards show the label, the “quote”, the message, "Suggested: …", then Fix, Mark reviewed or Dismiss, and Undo. The "No findings" box says "Nothing to review in compliance." or "No spelling or grammar issues found." (322-324). "Nothing left to review here · *n* resolved." (335). The footer reads "Checked 10:48 AM · Checker v1" with Run again (376-383).
- **Running (288-289):** "Checking compliance and proofreading…" and "This takes a few seconds. You can keep reading. Editing is paused."
- **Acknowledge dialog (420-512):** the title is "Review before you continue". The alert is "*N* findings are still unresolved" with either "You can continue, but you need to confirm you've reviewed them. Your confirmation is saved with the time and your name." (warn) or "Fix or mark reviewed to continue." (blocked). The tick box says "I've reviewed these findings and want to continue." Then the "PLACEHOLDER: acknowledgement wording to be supplied by legal." caption, and the Go back and fix and Continue buttons.
- **Snackbar (`ui/MyPostEditor.jsx:140`):** "Fixed. Checks ran again."

### Adapted for a website (the wording is new; review it)
- **Channel line:** the real dialog subtitle uses the channel target (`ui/CheckerPanel.jsx:391`: Add to your website / Email my clients / Share on social). The builder needs a new target: **"Publish your website"**.
- **Error copy:** "…You can't schedule, email or share yet." becomes **"…You can't publish yet."** "Your post is saved…" becomes **"Your site is saved…"**. The stale message becomes "This site changed after its last check. Re-run the check, then publish."
- **"Checks run automatically when you save."** becomes "Checks run automatically after every change", because each assistant edit counts as a save.
- **Findings carry a location** ("Home › What clients say") instead of a post field (`name`, `excerpt`, `body`).

### New in the builder (not in the real checker)
- **Ask AI to fix:** it sends the selected findings to the assistant as a chat turn. The assistant edits the text, and the check runs again on the new version. The assistant never writes disclosure or legal wording itself.
- **Show in preview / click-to-jump,** and highlights drawn in the preview, mapped from finding ranges to the rendered text.
- **Checks re-run before go-live:** the publishing step "Checks match this version" is the gate re-check against the content hash, the same way the schedulers re-check at send time.

## 4. How each direction places the checker

| | A. Panel (recommended) | B. Tab | C. Chat |
|---|---|---|---|
| Where results live | A Checks panel (300 px) docked under the preview, with the status bar above the preview | A Checks tab next to Preview, with a badge (count, ✓, ! or a spinner) | Assistant messages in the thread ("**Checks** 3 to review…") with finding cards inside |
| After each generation or edit | The panel and bar update in place | The badge updates and a toast reads "Checks: 3 to review · Open Checks" | A new Checks message after the edit reply |
| Highlights in preview | Yes | Yes. Clicking one opens the Checks tab on that finding | Yes. Clicking one selects the card in chat |
| At Publish | The acknowledge or blocked dialog | The Checks tab opens automatically behind the dialog | An assistant "Before you publish…" message plus the dialog |
| Phone | Preview tab: frame plus panel stacked | A third Checks tab with the badge | Cards in the Chat tab, and Show in preview switches tabs |
| Reuse of #964 UI | Highest. Same panel, bar, chip and cards (`CheckerPanel.jsx`) | High. The same panel, in a tab | Lower. Cards re-laid out for chat bubbles, which scroll away |

**Recommendation: A.** It matches the checker UI Alex already approved for My posts (a persistent Checks panel plus status bar), so advisors see the same thing in both places, and it reuses `CheckerPanel.jsx` almost as-is. Findings stay visible while the advisor keeps chatting, so they can't scroll away (C's risk) or hide behind a tab (B's risk). The trade-off is a shorter preview. The panel can collapse to its status bar.

## 5. Rules applied
- **White-label:** the generated site never links to or shows the FC domain or FC branding. It has no "Powered by" and no FC link in the footer. News page links use the advisor's domain (`example-advisor.ca/news/…`). The FC admin chrome around the builder can say FC. The mocks use the generic "Your Firm Name" logo.
- **Generic data only:** Jane Advisor, Alex Client, Your Firm Name, example-advisor.ca, jane-advisor.example.net, jane.advisor@example.com, 604-555-0100, 123 Example St.
- **No invented legal copy:** the site footer disclaimer, the licensing line and the form handler are marked placeholders. Rule messages are the code's own placeholder text.

## 6. Hosting note
Each published site is a static app on **FTT Cloudways servers, which are capped at 40 sites per server**. Publish puts a new site on a server that still has room. When every server is at 40, publishing a new site waits for a new server, which ops provisions by hand. The advisor sees the generic publish error, and support gets an alert. Staging previews count toward the cap if they run as their own Cloudways app. **Open question:** do previews run as separate apps, or as one shared preview app?

## 7. In scope (for a later build) / out of scope
**In scope for v1, once a direction is picked:** chat UI; assistant generation and edits of static HTML and CSS; the draft preview; version per edit and rollback; the publish flow (domain step, confirm, progress, success, error); running the #964 checker on the extracted site text after every edit and again at publish; highlights, Checks UI per the chosen direction, and the acknowledge gate; phone layout.

**Out of scope for this mock:** live AI wiring and prompts; hosting provisioning and the Cloudways or GitHub automation; DNS automation (the existing DNS helper is reused, as in #845); real legal or compliance wording; an optional compliance-officer sign-off email before publish (#601 step 4, which would reuse FC's approval email pattern); importing an existing site; image or video uploads; billing.

## 8. Estimates (real agent hours: cloud build + FC Tester + fix loop)
| Piece | Build | FC Tester | Fix loop | Total |
|---|---|---|---|---|
| Shared core (chat, generation, preview, versions and rollback, publish pipeline, domain step, site-text extraction) | 34–52 h | 8–12 h | 6–10 h | **48–74 h** |
| A. Panel integration | 7–11 h | 2–3 h | 1.5–3 h | **10.5–17 h** |
| B. Tab integration | 8–12 h | 2.5–3.5 h | 2–3.5 h | **12.5–19 h** |
| C. Chat integration | 11–16 h | 3–4.5 h | 2.5–4.5 h | **16.5–25 h** |

**Totals:** A 58.5–91 h · B 60.5–93 h · C 64.5–99 h. These assume the #964 checker is on main first. Hosting server provisioning beyond the 40-site cap is ops work and isn't counted.

## 9. Open questions
1. **Mode:** should the builder use the same firm-level `private.postCheck.mode` as My posts (default warn, which means acknowledge and continue), or always block compliance findings for a public website?
2. **Testimonials:** the real checker has no testimonial rule. Should Legal add one (for example "client testimonial needs review") before the builder offers a testimonials section, or should the assistant not offer testimonials at all?
3. **Ask AI to fix:** is it OK for the assistant to rewrite flagged text automatically (the advisor still sees the diff and can undo it)? Should it ever add the past-performance disclosure, or only remove the number?
4. **Compliance sign-off:** does #601's optional "send the preview to compliance before Publish" step belong in v1?
5. **Free address host:** which generic host name should the free subdomain use (shown as `jane-advisor.example.net`)?
6. **Previews and the 40-site cap:** see section 6.
7. **Pilot first:** #601 says to pilot by hand (one advisor's static site on GitHub and Cloudways) for 1–2 months before building. Do these mocks wait for that, or does the pilot run alongside?

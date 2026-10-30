# #687 Rewrite in my voice: build contract

Issue: [#687](https://github.com/kartboy16/content-library/issues/687). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Today (read-only, at `6499dd7`)

- Library posts use FC's wording, and advisors edit them by hand.
- AI already adapts social copy: `ai.adaptPostForSocial`, `ai.rewriteSocialPost(originalText, instruction)` and `ai.generateWebsiteShareCopy` in `server/ai-service.js`. But there's **no saved voice profile** and no guardrail checks.
- The disclaimer is `advisor_configs.disclaimer`, shown by the editor's disclaimer plugin (`ory_editor/disclaimer`).
- Website posts follow the advisor's compliance mode (`email`, `external` or `off`, in `imports/utils/complianceMode.js`). The email mode sends a PDF for approval (`server/website-compliance-pdf.js`).

## Recommendation: A, a rewrite panel in the post editor plus a Voice profile settings page

- **[A voice profile](a-voice-profile.html)** (Settings › Voice) and **[A rewrite](a-rewrite.html)** (Content › post › Rewrite in my voice).
- It's a one-time setup that you edit when you like, and the rewrite opens where the post already lives. It's the fewest new screens, and the same profile can later serve email and social.
- **[B](b-wizard.html):** guided steps (1 Your voice, 2 Pick a post, 3 Compare, 4 Approve). It's good for the first time, but slow every time after that.
- **[C](c-style-card.html):** the profile as one editable "style card" with sample sentences, and the rewrite in a full-screen compare view. It's friendly and visual, but less precise to edit, and full screen is a bigger build.

## Screens and states

### 1. Voice profile (`?st=`)

| State | What shows |
|---|---|
| `building` | "Reading your posts… We found 8 posts on example.com/insights. Analysing post 5 of 8", with a progress bar. "You can leave this page." |
| `ready` | Tone chips (Warm, Plain-spoken, Encouraging), phrases you use, words you avoid, a sentence-length slider ("Yours average about 13 words"), how you sign off ("Talk soon, Jane"), and how you address readers. **Built from 8 posts**, each with a tickbox to leave it out. "Rebuild from my posts" and the last-built time (PT). A "Sounds like" sample, never published. Save. "Changes apply to future rewrites only." |
| `empty` | "Not enough posts yet. We found 1 post… we need at least 3." Buttons: Paste some of your writing, Use a different page. |
| `error` | "We couldn't read example.com/insights… Your current voice profile hasn't changed." Buttons: Try again, Use a different page. |

### 2. Side by side (`?st=`, `&comp=on|off`)

| State | What shows |
|---|---|
| `loading` | "Rewriting in your voice… then checking locked values and the disclaimer", with skeletons on the right. |
| `ready` | Original on the left, "In your voice" (Draft) on the right. **Locked values are highlighted 🔒 in both columns.** A locked-values table shows every value as "✓ same". The disclaimer is shown verbatim, locked 🔒, with a "✓ Identical to original" badge. **Approve rewrite** is enabled. |
| `blocked` | A red banner: "**We stopped this rewrite.** It changed a number that has to stay the same: the TFSA limit **$7,000** became **$7,500**. You can't approve it until that's fixed." Buttons: **Put back $7,000**, Rewrite again, Edit it myself. The changed value is red in the rewrite, the table says "✗ became $7,500", and **Approve is disabled** ("Fix the blocked item to approve"). |
| `claim` | Orange: "The rewrite added something the original didn't say: "it's a safe way to beat inflation". New claims aren't allowed." Buttons: Remove it, Rewrite again, Edit it myself. "This check is best effort. Compliance review still applies." Approve is disabled. |
| `regenerating` | "Rewriting again…" |
| `error` | "We couldn't rewrite this post right now. Nothing was changed. The original is still in your library." with Try again. |
| `approved` | "✓ Rewrite approved by Jane Advisor at 9:42 AM PT. It's been sent for compliance review, the same as any other post." (Compliance off: "Next, pick when it goes on your website.") "**Nothing is published until** it's approved and scheduled." |

The approve dialog says:
- It replaces the wording for **your copy** of this post only.
- All 6 locked values match, and the disclaimer is identical.
- Next comes compliance review, or picking a time.
- **Nothing is published automatically.**

A banner above the compare also says nothing publishes from this screen.

Sample figures (TFSA $7,000, RRSP deadline March 1, 2027, 18%, $33,810, "Example Balanced Fund") are **example data**, labelled in the mock, and not current limits or advice. The disclaimer is a **marked placeholder**.

## In and out of scope

- **In:**
  - Voice profile (build, review, edit, rebuild, tick posts in or out, paste samples).
  - "Rewrite in my voice" on library and suggested posts.
  - Side by side with locked-value highlighting, the locked-value diff check and blocking, the new-claim check (best effort), and the byte-for-byte disclaimer check.
  - Approve, which hands off to the existing compliance or schedule flow.
  - Audit trail and phone layout.
- **Out:**
  - Auto-publish (never).
  - Rewriting email or social with the profile (later, but reuse the profile).
  - Bulk rewrite of many posts.
  - Writing new posts from scratch.
  - Changing the disclaimer.
  - Any wording on legal or compliance meaning (placeholders only).

## Mobile (390px)

- The side by side becomes an **Original | Rewrite** switch (default Rewrite). Highlights and the locked-values table stay.
- The action bar (Keep the original, Rewrite again, Approve) sticks to the bottom.
- The voice profile stacks into one column.
- B's steps wrap, and C's full screen becomes a normal page.

## Build note

1. **Voice profile extraction:**
   - Fetch the advisor's own posts (WordPress REST `/wp-json/wp/v2/posts` when available, otherwise crawl the Insights page links on their domain only, up to about 20 posts). Strip navigation, boilerplate and disclaimers.
   - **Exclude FC library posts the advisor has published**, so we don't learn FC's voice. Match them against `HTMLPosts` by title or embedding.
   - One AI call returns structured JSON: `{tone[], phrases[], avoid[], avgSentenceWords, signOff, address, samples[]}`. Also compute sentence length and sign-off directly, not by AI.
   - Store it on a new `voice_profiles` record (`advisorId`, `sourceUrls[]`, `excluded[]`, `profile`, `builtAt`, `editedAt`, `version`). Advisor edits overwrite fields. A rebuild keeps edited fields unless reset.
   - Need at least 3 posts, or pasted samples (at least about 300 words).
2. **Locked-value detection (before rewriting):** extract from the original:
   - Money and percentages (`$7,000`, `18%`, `4.5%`).
   - Dates and tax years (`March 1, 2027`, `2026 tax year`).
   - Numbers attached to rule words (limit, deadline, maximum, minimum, age, rate, contribution, withdrawal).
   - Account and tax terms (TFSA, RRSP, RRIF, RESP, FHSA, CPP, OAS).
   - Named products: a list per post or category, plus capitalised fund and product names.

   Wrap each value in a placeholder token (`⟦L1⟧`) when prompting, and tell the model to keep tokens unchanged.

   **Limits:**
   - Regex and lists miss values written in words ("seven thousand dollars") and rules that are paraphrased ("you can contribute up to…" turned into "the cap is…").
   - They can over-lock incidental numbers.
   - Detection is a guardrail, **not** compliance sign-off. Compliance review stays required when the advisor's mode needs it.
3. **Diff check after generation:**
   - Re-extract from the rewrite and compare it with the original's locked set.
   - Every original token must appear exactly once, unchanged. If any value is missing, changed or extra, the rewrite is **blocked** (`blocked` state).
   - "Put back" swaps the original value in and runs the check again.
   - The new-claim check: a second model pass, or rules (guarantee, safe, risk-free, beat, always, never, best), flags sentences with no support in the original (`claim` state). It's best effort, so mark it that way.
   - Approve stays disabled while anything is blocked. The server also re-runs the checks on approve, and never trusts the client.
4. **Disclaimer:**
   - Never send it to the model. Remove it before rewriting and re-attach the **stored string** afterwards.
   - On approve, assert `sha256(rewrite.disclaimer) === sha256(advisor_configs.disclaimer at approve time)`, byte for byte. If it fails, block.
   - The "Identical to original" badge reflects this check.
5. **Audit trail** per rewrite, in `post_rewrites`:
   - `advisorId`, `sourcePostId`, `voiceProfileVersion`, model and provider, prompt hash.
   - Original and rewrite text, the locked set, the check results (each value, claim flags, disclaimer hash).
   - Each regenerate, and who approved, when (PT), and their IP.
   - The id handed to compliance or scheduling.
   - Keep the history even if the advisor rejects it.
6. **No auto-publish:**
   - Approval creates the advisor's draft copy and calls the **existing** path: compliance send in email mode, the external queue, or schedule when compliance is off.
   - No code path publishes from the rewrite screen. Add a test for that.
7. **White-label:** rewritten Insights posts and share links never link to FC's own domain. Reuse the existing white-label rule.

## Estimate (agent time, per Alex's Oct 30 rule)

This is the Cursor cloud agent build plus FC Tester time, with 1–2 review and fix loops per run, in minutes and hours (not developer days). For calibration, #699 took about 30 min from handoff to tested. It's split into **4 cloud-agent runs**.

| Run | Covers | Build | FC Tester | Fix loops (1–2) | Run total |
|---|---|---|---|---|---|
| 1. Voice profile backend | Fetch the advisor's posts (WP REST or crawl, own domain only), exclude FC library posts, the extraction call, `voice_profiles`, edit and rebuild | 45–60 min | 20–30 min | 20–40 min | **≈1.5–2.25 h** |
| 2. Rewrite and guardrails | Locked-value tokens, the rewrite call and regenerate, the diff check, put back, the claim check, the disclaimer hash, and a server re-check on approve | 60–75 min | 30–40 min | 30–60 min | **≈2–3 h** |
| 3. Screens (A) | Voice profile page (states, chips, post list, sample) and the side-by-side with highlights, blocked and claim states, and the phone switch | 45–60 min | 20–30 min | 20–40 min | **≈1.5–2.25 h** |
| 4. Approve and audit | Hand-off to compliance, the queue or schedule through the existing paths, `post_rewrites` audit trail, a no-auto-publish test, the white-label rule | 30–45 min | 20–30 min | 10–30 min | **≈1–1.75 h** |
| **Total A** | | | | | **≈6–9.25 h** |
| B: wizard shell (steps, back and next, resume) in run 3 | | +15–20 min | +5–10 min | +0–10 min | **+20–40 min, so B ≈6.25–9.75 h** |
| C: style card with editable samples and the full-screen compare in run 3 | | +15–20 min | +5–10 min | +0–10 min | **+20–40 min, so C ≈6.25–9.75 h** |

- **Order:** runs 1 and 2 can go in parallel (run 2 uses a stub profile), then run 3, then run 4. That's about **4.5–7 h of wall-clock time** for A.
- **With voice sampling ([sampling contract](sampling/build-contract.html), A ≈5.25–8 h):** sampling replaces run 1 and the profile part of run 3, so #687 A plus sampling A is about **10–16 h** in total.
- **Test dependency (not included):** FC Tester needs a test advisor with a few of their own posts on a test site, at least one FC library post to exclude, and both compliance modes (email and off). Nothing is published.
- Replaces the earlier human-developer estimate (A ≈10.5–14 days, B ≈11.5–15.5 days, C ≈11.5–15 days).

## Open questions

1. Which posts count as "theirs"? Only posts on their own domain, and should we exclude FC library posts they've published? (Suggested: yes, exclude.)
2. Minimum to build a profile: 3 posts, or pasted samples of about 300 words?
3. Who can approve a rewrite: the advisor only, or assistants and FTT staff acting as the advisor?
4. In compliance email mode, should the compliance PDF show the original **and** the rewrite, or just the rewrite?
5. Which values are locked? Confirm the list: money, %, dates, tax years, ages, account types, named products. Should account names like "TFSA" also be locked as words?
6. New-claim check: block (as mocked) or only warn? Who decides what counts as a claim?
7. "Edit it myself": should hand edits re-run every check before approve? (Suggested: yes.)
8. Should the rewrite update when FC updates the library post (for example, a new TFSA limit)? Or flag the rewrite as "out of date", or keep it frozen?
9. How long do we keep the audit trail, and who can see it (advisor, FTT staff, compliance)?
10. Can the advisor rewrite the same post again later (versions), and is there a limit per month (AI cost)?
11. Should the voice profile also be used for social and email now, or later?

# #773 One assistant-first onboarding flow: build contract

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** Likely `risk:high` (new onboarding entry point, contact import with consent, website connection queue). Alex merges.

This replaces the five separate setup places (#724 branding, #727 website, #726 email list, #725 voice/profile, #728 social) with **one** screen. The reporter rejected #727 A and B as too technical and too many steps. The rules for every direction:

1. **Assistant first.** Everything FC already knows (signup email domain, website, brand pull, social search) is filled in before the advisor does anything. The advisor types plain words or drops files. The assistant files each one and says what it did.
2. **Manual editing is optional, never required.** Every value has an Edit link and a source badge, but the flow reaches Done without one.
3. **Everything in one place.** All five areas show on the same screen (A: side panel; B: the page itself; C: the final summary).
4. **Done-for-you website.** The advisor sees "We'll connect your website for you" plus a status. The only optional advisor action is "Someone else looks after my website" (we email them). FC handles the rest.
5. **No platform names in the advisor UI.** Platform detection and per-platform steps exist only on the staff side and in the email to the web person.

## Directions

| | A. Chat + Your setup (recommended) | B. One-page checklist + drop zone | C. Chat only, then summary |
|---|---|---|---|
| Layout | Chat left, live "Your setup" panel right (5 sections). Phone: chat plus a "Your setup · n of 5 ready" strip that swaps to the panel. | One page of 5 numbered cards, auto-filled. The assistant sits at the top as a dashed drop zone showing its latest message plus the composer. Questions appear inside the card they belong to. | Full-width conversation. A small brand preview card shows mid-chat. At the end there's a summary card with all 5 sections (expandable) and Edit links. |
| Where values are visible | Always (panel) | Always (cards) | Only at the end (plus the mini preview) |
| Advisor answers | 3 taps (Is this you? / consent / who you help) + optional drop | Same 3, inside cards | Same 3, in chat |

## Screens and states (same script in all directions)

`t` in the mock:

| t | State | Assistant says / does | Panel / cards |
|---|---|---|---|
| 0 | First load (right after signup) | "Welcome to FinancialContent, Jane. I'm setting things up from jane@yourfirm.ca and yourfirm.ca." 4-line progress (reading site, brand, social, website) | All sections "Filling in…", skeletons |
| 1 | Auto-filled | Pulled the logo, colours, fonts, phone and address. "Your website: we'll connect it for you. Nothing to do on your side." Found LinkedIn. **Is this Facebook page you?** | Brand: live preview + "Where your brand came from" (#724 B). Website: "We're on it". Social: LinkedIn saved, Facebook suggestion "Needs you" |
| 2 | After "Yes, that's me" / "Not me" | "Saved. Drop your headshot, bio, disclaimer, client list or any document, or just tell me." | Social done |
| 3 | Files dropped | One line per file saying where it went: headshot → photo; bio → About you; disclaimer → disclaimer; brochure → Documents; clients.csv → 142 contacts (3 duplicates removed). Then the **consent question** (PLACEHOLDER copy) | About filled with source badges "From headshot.jpg" etc. Email list: "Needs you" |
| 4 | Consent answered | "Who do you like to help?" Talk (mic) or Type instead (#725) | Email list done |
| 5 | Voice/typed answer | "Got it. Who you help: young families and small business owners in Vancouver, BC." | About: "Who you help" tags, "You told me" |
| 6 | Done | "You're all set." See my first posts | 5 of 5 ready |

Cross-cutting states: `ws` website status = `connecting` (default), `webperson` (advisor gave a web person's email), `live`, `help` (team will call). `ed=1` = advisor edited the accent colour. The badge changes to "Changed by you" with Undo, and the preview recolours live.

**Drag and drop:** dropping anywhere on the page shows a full-screen "Drop files to add them" overlay. Files can also be added with the 📎 button or a phone file picker. The assistant must handle unknown files ("saved to your Documents") and never refuse a file. Multiple files are handled in one reply.

**Free text** ("change my phone to 604-555-0199", "use this disclaimer: …") is parsed into the same field updates, with a "what I did" reply. Unclear text gets one clarifying question, never a form.

**Skip/leave:** every question can be skipped by typing something else or leaving. Progress is saved per answer. Coming back resumes at the first unanswered question. Onboarding counts as complete once brand and website are set (both automatic). The others show as "Add anytime".

## Data (reuse what exists)

- **Brand + contact:** `advisor_configs` branding fields and `server/api/advisor-brand-lookup.js`, plus #724's per-field `source` (`site|upload|advisor`) and manual-wins precedence.
- **Files → fields:** new `server/api/onboarding-intake.js`. It accepts files, classifies each one (image with a face → headshot; logo-like image → logo, asking if one already exists; docx/pdf/txt with bio-like text → bio summary; text that looks like a disclaimer → disclaimer; csv/xlsx/vcf → contacts via #726 `contactCsvImport.js`; anything else → Documents). It returns `{file, target, summary}[]` for the "what I did" reply. Values are written with `source:'upload'` and the file name.
- **Contacts:** the #726 import pipeline (dedupe, address checks, unsubscribe guard, `contactImports` audit doc). Consent per import is `consentType` (`implied-client|express|unclear`) + `consentExpiresAt`, with the #726 sendable rule. **The wording of the consent question and options is a PLACEHOLDER**, to be supplied by compliance. Don't ship invented CASL copy.
- **Voice/profile:** #725 business profile fields + `ai-service.js` summary. STT is new (#725 run 4) and **optional**: if the mic is blocked or unavailable, show only "Type".
- **Social:** #728 website link extraction + search candidates + "Is this you?" accept/reject list. Saved to `advisor_configs.linkedinPersonal/linkedinCompany/meta/x`.
- **Onboarding state:** `advisor_configs.onboarding = {startedAt, answered:{social,consent,whoYouHelp}, completedAt}` and the chat transcript (`onboardingMessages`, last 50).

## How done-for-you website connection works (dev/staff side only)

The advisor never chooses a method or sees a platform. Behind the scenes:

1. **Detect (silent).** At signup, run the #727 detection on the website from the signup email domain or the site field: platform, hosting, whether FC already hosts it, and whether a DNS change is possible. Store `websiteConnection = {status, detectedPlatform, method, owner, webPersonEmail, lastCheckAt, notes}` and **never render `detectedPlatform` or `method` in the advisor app**.
2. **Auto-connect where FC can.** If FC hosts the site already, connect it immediately and verify (status → `live` within the onboarding session).
3. **Otherwise, queue it for the FC team.** Create a staff task in a new admin **Website setup queue** (extending today's `wordpress.requestSetup` → `wordpressSetup.status='requested'` + Slack notify into a generic job for all platforms). The staff view shows the detected platform and the matching #727 instructions. Status → `in_progress` once someone picks it up.
4. **Web person (optional).** If the advisor taps "Someone else looks after my website" and gives an email, FC sends one email **from the FC team**, with the platform-specific steps (snippet, plugin or DNS record) and a "reply if stuck" address. Status → `waiting_web_person`. The team follows up after 2 business days.
5. **Needs a hand.** If the team can't proceed (no access, no web person), status → `needs_help`. The advisor sees "Our team will call you", and the team gets a call task.
6. **Verify.** The #727 checker fetches the site daily and on demand. When FC content is found, status → `live`, the advisor gets an in-app note and email "Your content is live on your website", and the staff task closes.

Advisor-visible status copy maps 1:1: `queued|in_progress` → "We'll connect your website for you", `waiting_web_person` → "We've emailed your web person", `live` → "Your content is live", `needs_help` → "Our team will call you".

## Out of scope

Rebuilding Settings pages (they stay as the "edit later" home, linked from each section); billing/plan selection; sending the first campaign; posting to social; multilingual; staff-side automation of the actual site edit (the team does it by hand at first).

## Mobile (390)

- **A:** chat full height, plus a sticky "Your setup · n of 5 ready · View" strip that swaps to the panel ("Back to chat").
- **B:** cards stack, brand preview above "Where your brand came from".
- **C:** unchanged, with the summary full width.

All quick replies are full-width buttons of at least 44 px. The drop overlay becomes the file picker (no drag on phones).

## Estimate (agent time: cloud agent runs + FC Tester + fix loops)

Scale: #699 took about 30 min from handoff to tested. **Reused** means the run is already specified in that issue's build contract. It's built once and shared, not built again for #773.

| Run | A | B | C |
|---|---|---|---|
| Reuse #724 runs 1–2: branding source/precedence + brand lookup (preview UI reused from #724 B) | 3–4.5 h | 3–4.5 h | 3–4.5 h |
| Reuse #727 detection + checker; new: generic Website setup staff queue, web-person email from FC, status model | 2.5–3.75 h | 2.5–3.75 h | 2.5–3.75 h |
| Reuse #726 run 1 + run 3: import, consent fields, sendable rule (no domain wizard in onboarding) | 2.5–4 h | 2.5–4 h | 2.5–4 h |
| Reuse #725 runs 1–2: profile data + conversation engine | 2.75–4.5 h | 2.75–4.5 h | 2.75–4.5 h |
| Reuse #728 runs 1–2: link extraction + search + Is this you? | 2.5–4 h | 2.5–4 h | 2.5–4 h |
| **New:** file intake classifier + "what I did" replies + free-text field updates | 1.75–2.75 h | 1.75–2.75 h | 1.75–2.75 h |
| **New:** onboarding UI for this direction + states + phone | 2–3 h | 1.5–2.5 h | 1.5–2.25 h |
| **New:** end-to-end FC Tester pass (signup → done, drop files, all ws states) | 0.75–1.25 h | 0.75–1.25 h | 0.75–1.25 h |
| **Total** | **≈17.75–27.75 h** | **≈17.25–27.25 h** | **≈17.25–27 h** |
| Optional: #725 voice (STT) | +1.5–2.5 h | +1.5–2.5 h | +1.5–2.5 h |

**Only #773-new work** (if the #724–#728 runs ship first or in parallel): A ≈4.5–7 h, B ≈4–6.5 h, C ≈4–6.25 h. Runs 1–5 are independent and can go to parallel cloud agents, so wall-clock time is much shorter than the sum.

Outside agent time: compliance CASL copy (#726), STT vendor/data residency (#725), search API key (#728), and staffing the Website setup queue.

## Recommendation

**A.** It's the closest match to "just use an AI assistant" while keeping everything visible in one place. The advisor talks, and the panel visibly fills itself in, so they can trust what was done without opening anything. B looks like a form again (five cards to scan), which is what the reporter pushed back on. C is the simplest-looking, but it hides the values until the end, so an advisor who leaves halfway never sees what was set. On a phone, A becomes C with a one-tap "Your setup" view, so the non-technical path stays a single conversation.

## Open questions

1. **Website without the advisor:** who staffs the Website setup queue, and what's the promised turnaround ("usually within 1 business day" is a placeholder)? Can the team act without any access from the advisor? For most sites, someone with a login must add the snippet or DNS record. Our options are: (a) the web person email (mocked), (b) the team asks the advisor for a one-time "invite us as a user" by email, outside the app, (c) a hosted page on FC's own domain linked from social/email until the site is connected. Which should be the default when there's no web person?
2. **Advisors with no website** (or a firm/dealer site they don't control): skip the website section and use the hosted page only?
3. **CASL copy:** compliance must supply the consent question and option text (PLACEHOLDER in all directions).
4. **Logo vs headshot:** if a dropped image is ambiguous, ask ("Is this your logo or your photo?") or guess and offer Undo?
5. **Voice:** ship v1 with Type only and add Talk later (saves 1.5–2.5 h and the vendor/residency review)?
6. Should existing advisors see this flow for any area still empty, or is it new signups only?

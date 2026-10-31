# #725 Voice-first conversational onboarding (onboarding step 4 of 5): build contract

For [#725](https://github.com/kartboy16/content-library/issues/725). Mocks: [hub](index.html), [A](a-chat.html), [B](b-one-question.html), [C](c-live-profile.html), [business profile](profile.html), [today](today.html). **Recommend A.** **Not agent-ready. Soft Dev hold until a direction is picked.** Track: idea, playground first.

## Where this lives today (read-only, staging `9a5a9bb`)

- **No onboarding conversation, and no first-login flow** for this. Steps 1–3 are #724, #727 and #726.
- **Advisor record:** `collections/advisor_configs.js` already has `name`, `designation`, `title` and `tagline` (shown on posts). There's **no business profile**, no ideal clients, services, provinces, niche or tone fields.
- **Settings:** `AccountSettingsHub.jsx` tabs are Branding &amp; contact · Mailing &amp; compliance · Billing &amp; plan. The mock adds **Business profile** after Branding &amp; contact (the shell matches #724 A).
- **AI:** `server/ai-service.js` makes text chat calls (OpenAI / Anthropic / Google, default `gpt-4o-mini`). There's **no speech-to-text, realtime voice or mic code** anywhere in the app.
- **Brand voice:** #687 (voice sampling and rewrite) is its own feature. The tone answer here feeds it but doesn't replace its samples.

## Directions

### A. Chat ([a-chat.html](a-chat.html), recommended)
A chat thread in the main area. Each question is a bubble. After each answer, an "Here's what I got" bubble shows the summary + tags with **Looks right / Change**. The composer at the bottom is a big mic (**Tap to talk**) with **Type instead**, or a text box with a small mic to switch back. **Skip** and **Stop for now** are always under the composer.

### B. One question at a time ([b-one-question.html](b-one-question.html))
A single centred card: "Question n of 7", the question in large type, and the last saved answer as a small strip above. It's calmer, but it feels closer to a form.

### C. Chat + live profile ([c-live-profile.html](c-live-profile.html))
A's chat on the left, with the business profile filling in live on the right. New tags show in green. At 390 the panel collapses to a "Profile n of 7 · Open" strip.

### Business profile view ([profile.html](profile.html), same for all)
Settings › Business profile. Each row has a label, the summary, and tags (× to remove, **+ tag** to add), plus **Edit** (textarea + tags, Save/Cancel). Questions with no answer show "Not answered" with **Add later**, which reopens the conversation at that question. **Answer by voice** reopens the conversation. States: full, editing, stopped early, nothing yet, loading, error.

## Flow and states (all directions)

1. **Welcome + confirm:** "Welcome to FinancialContent. You're **Jane Advisor**, and your site is **yourfirm.ca**?" The name comes from the account or #724 lookup, and the site from the email domain or #724. Buttons: **Yes, that's right** / **Fix it**, which shows inline name and website fields with Save.
2. **Mic prompt (once):** "Talk or type, whichever you like." **Use my microphone** or **Type instead**, plus a **PLACEHOLDER** for the voice recording/transcription notice (privacy/compliance to supply). Only **Use my microphone** triggers the browser permission prompt (`getUserMedia`). The choice is remembered per advisor and browser, and we never re-prompt. If permission is blocked, typing continues and the copy points to browser settings.
3. **Title** (required, but it can be typed), then the **six optional questions** in the order from the issue: ideal clients, services, licensed provinces (quick-pick chips: ON, BC, AB, QC, MB, SK, NS, NB, NL, PE), niche, what makes you different, tone (quick picks Friendly / Formal / In between).
4. **Voice states:** ready (Tap to talk) → listening (waveform, live partial transcript, tap to finish) → transcribing ("Writing that down…") → understood (summary + editable tags, **Looks right** / **Change**).
5. **Typing:** the same question and the same "Here's what I got" step. The mic icon is always there to switch back. Mic blocked or voice unavailable (no device, service down, unsupported browser) shows a one-line note and typing continues.
6. **Skip** puts a "Skipped" bubble in the log and moves on. **Stop for now** opens a confirm ("Your 3 answers are saved") with **Keep going** / **Stop**. Each answer saves when it's confirmed, so stopping loses nothing.
7. **Save error:** the answer text stays in the box, with **Try again**.
8. **Done:** "That's everything… **See your business profile**".

## Data

- `advisor_configs.title`: write the title here. Don't overwrite a non-empty title that admin set (#547) without the advisor confirming.
- **New `businessProfile` on the advisor record:**
  - `{ idealClients, services, licensedProvinces, niche, differentiator, tone }`, each item `{ summary, tags[], rawAnswer, source: 'voice'|'typed'|'edited', answeredAt, updatedAt, skipped }`.
  - `licensedProvinces.tags` uses province codes (`ON`, `BC`…).
  - `tone.value`: `friendly` | `formal` | `in-between`.
- `onboarding.step4`: `{ startedAt, lastQuestion, stoppedAt, completedAt, micChoice: 'voice'|'typing'|'denied' }`, used to resume.
- **Consumers:**
  - Licensing filter reads `licensedProvinces.tags`.
  - Recommendations and email/social suggestions read summaries + tags.
  - #687 reads `tone.value` as one input; its voice samples stay the primary source.
- **No audio stored.** The audio is streamed to the speech service and only the text transcript is kept. This needs confirming in the privacy copy.

## Speech-to-text dependency

- **Needs a vendor and an account:** a realtime voice or STT API (for example OpenAI realtime / transcription, or ElevenLabs). Pick one, add the API key to settings, and mint short-lived browser tokens server-side. The key never goes to the client.
- **Outside agent time:** the vendor choice, cost per minute, the data-residency review (audio may leave Canada), and the privacy/consent copy.
- **Spoken questions (TTS)** are optional. The mock only listens. Reading questions aloud adds about 0.5–1 h.
- **Testing:** FC Tester can run headless with Chrome's fake mic (`--use-fake-device-for-media-stream` with a recorded clip) and a mocked STT response. One real-mic check by a person on playground is advised.

## Out of scope

Rewriting the #687 voice-sampling flow; an admin-side editor for other advisors' profiles; multilingual voice; storing recordings; changing Branding &amp; contact (#724) or first-login (#155/#156) beyond inserting step 4.

## Mobile (390)

The side nav hides. Bubbles go up to 88% width. The mic is 64 px and centred, and every target is at least 44 px. In C, the profile panel collapses to a strip. The profile view stacks label, summary, tags and actions, and the browser permission card sits full-width at the top.

## Estimate (agent time: cloud agent runs + FC Tester + fix loops)

Scale: #699 took about 30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| 1. Business profile data + Settings › Business profile (view/edit/tags/Add later) | 1.25–2 h | 1.25–2 h | 1.25–2 h |
| 2. Conversation engine: script, name/site confirm, AI summary + tags per answer, skip/stop/resume, save per answer | 1.5–2.5 h | 1.5–2.5 h | 1.5–2.5 h |
| 3. Conversation UI + typing states | 1–1.5 h | 1–1.5 h | 1.5–2.25 h |
| 4. Voice: mic permission once, STT/realtime streaming, listening/transcribing, blocked/unavailable fallback | 1.5–2.5 h | 1.5–2.5 h | 1.5–2.5 h |
| 5. Hook up provinces → licensing filter, tone → #687, profile → suggestions | 0.75–1.25 h | 0.75–1.25 h | 0.75–1.25 h |
| **Total** | **≈6–9.75 h** | **≈6–9.75 h** | **≈6.5–10.5 h** |

- **Typing-only first (runs 1–3 + 5)** is about 4.5–7.25 h for A, so voice can follow once a vendor is picked.
- Wall-clock is about 5–8 h. Runs 1 and 4 can go in parallel after run 2's data shape is set.

## Recommendation

**A.** A chat is what "feels like a conversation, not a form" means. One composer handles both voice and typing, so they stay equal. It's the simplest at 390. B reads like a form. C's live panel is nice on desktop, but it disappears on phones and costs extra.

## Open questions

1. **Welcome line:** the issue says "Welcome to financialcontent.ca." The mock shows "Welcome to FinancialContent." Which one?
2. **Voice vendor** (OpenAI realtime vs ElevenLabs vs other), and should the AI **speak** the questions or only listen?
3. **Privacy/consent copy** for voice (placeholder in the mock). Do we confirm no audio is stored, and where is it processed?
4. **Tone:** is a third option ("In between") OK?
5. **Title:** if staff already set it (#547), should we ask anyway or just confirm it?
6. **Entry points:** auto-open once after steps 1–3, then resume from Settings › Business profile only? Or also a banner?
7. **Provinces:** codes only, or also "All of Canada"?

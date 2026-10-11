# #495 Build contract: Playground AI chat → website post, social post, email campaign

**Status:** Designer-first mock. **Not agent-ready.** Soft Dev hold until Alex/Angelina pick a direction.
**Recommended:** Direction A (action bar under each AI answer → one review sheet with a tab per destination → Create drafts).
**Scope:** Playground only (`public.aiLandingDistributeEnabled`, already `true` only in `settings.playground.json.template`). No change to the Email Campaigns or Social apps beyond accepting a prefill.

Mock: https://kartboy16.github.io/fc-mocks/495/ · A `/directions/a/` · B `/directions/b/` · C `/directions/c/`

## 1. What exists today (playground branch, a4801d9)

| Piece | Where | Notes |
|---|---|---|
| AI landing chat | `imports/ui/AiLandingChat.jsx`, route `/content-library/ai` | “Create a post” / “Pick a post” chips; state machine in `imports/ui/aiLandingChatFlow.js` |
| AI output shape | `imports/api/aiLandingChat.js` `buildLandingSystemPrompt` | Model returns JSON `{reply, draftText, suggestions}`. `draftText` is **one plain-text blob** (no markdown, no per-channel versions). |
| Chat-first distribute (already built) | `imports/api/aiLandingDistribute.js`, `server/ai-landing-distribute.js`, `AiLandingConfirmCard.jsx` | “Where should this go?” chips (Website / networks / Email / All three) → follow-ups → When (Now / Later / Pick a time) → Confirm card → **Confirm Send** → `aiLanding.confirmDistribute`. |
| Title / body / excerpt mapping | `firstLineTitle`, `draftTextToHtml`, `excerptFromDraft` | Title = first line (≤120 chars), body = paragraphs split on blank lines, HTML-escaped. Excerpt = first 240 chars. |
| Website | `materializeAiLandingHtmlPost` | Creates/updates one private `HTMLPosts` doc per chat (`privateToUserId`, `sourceType:'aiLanding'`, `sourceChatId`, `isPublic:false`). No featured image. |
| Social | `publishSocial` | Same full `draftText` used as the caption for every network (`messages: {linkedin, facebook, instagram}` all = caption). No shortening, no character limits. |
| Email | `publishEmail` | Skips if the advisor has a `compliance` category or no default list. SES: `ses.createCampaign` (creates `status:'draft'`); Mailchimp: `mailchimp.addScheduledEmailCampaignInternal`. |

**Important:** today's Confirm Send **publishes / schedules for real**: `website.publishPost` or `website.schedulePost`, `social.schedulePost` / `social.scheduleOnePost`, and `ses.sendCampaign` when timing is Now or a time is set. Only email with no time stays a draft. That conflicts with #495 AC-5 / NG-3 (drafts, no auto-publish). The recommended direction makes **drafts the default** and keeps publish/schedule in each channel's normal page.

Other facts the build relies on:
- `CreateHtmlPostPage.jsx` is **staff-only** (`/content-library/admin/html-posts/new`, redirects non-admins). Advisors have no standalone post editor. Their "website draft" is the private post in their Library, which they publish through the Share dialog (`PostDistributionDialog`, the #168 checklist).
- `CreateCampaign.jsx` already takes `initialCampaignName`, `initialSubject`, `initialHtmlContent`, `initialListId`, etc., and applies the #458 prefix with `prefillNewCampaignSubject`. **`confirmDistribute` calls `ses.createCampaign` directly, so the #458 prefix is NOT applied there today.** Apply `prefillNewCampaignSubject` server-side.
- `SocialPostQueue` has no draft status. Statuses: `pending`, `pending_approval`, `processing`, `failed`, `rejected`. The scheduler only picks scheduled items (never `pending_approval`). `insertSocialQueueItem` applies the advisor's social approval setting.
- Safety already in place: `loadOwnedChat` (chat must belong to `this.userId`), single-use nonce with 15-minute TTL, the model can't call confirm (`BLOCKED_MODEL_TOOLS`), `assertCanadianContentAllowed`, `callAsUser` runs channel methods as the signed-in user, `ses.createCampaign` checks `this.userId === advisorId`.

## 2. Surfaces (Direction A)

1. **Action bar** under any assistant message that has a `draftText`: “Use this for: Website · Social · Email” multi-select chips + “Review N drafts”. Only channels in `loadSectionAccess` show. Always uses the latest draft (after Shorter / Friendlier).
2. **Review sheet** (inline below the chat on desktop, full-height bottom sheet on phone). Tabs: Website · Social · Email · What changed? Green dot = ready, amber = needs something.
3. **Create drafts** button: one server call, per-channel result.
4. **Result message** in the chat with a link per draft + a “Drafts from this chat” strip. Follow-ups (“make LinkedIn friendlier”) update the existing draft instead of making a new one.
5. **Empty / error**: not connected → Connect button and the channel is skipped; no list → email saves as a draft without a list; partial failure → keep successes, Try again retries only the failed channel (idempotent).
6. Replace the current Where → When → Confirm Send chat steps with the action bar + sheet when the flag is on. Typed requests in any wording (“schedule the post”, “send this to my website”) go through the AI classifier (§2b) to a confirm card; Change opens the sheet with those channels pre-picked.

## 2b. Natural-language intent (Alex, [issuecomment-6111423150](https://github.com/kartboy16/content-library/issues/495#issuecomment-6111423150))

Advisors won't know trigger words. After any assistant message that has a `draftText`, **every** advisor message is classified by the AI, not by a phrase list.

**Today:** `imports/api/aiLandingIntent.js` `classifyLandingIntent` is a fixed chip map + phrase lists (`READY_EXACT`, etc.), gated by phase. “She literally asked to schedule the post” falls through to REFINE/UNCLEAR. That's the bug Alex is describing. Keep the chip map only as a fast path for exact chip taps; free text goes to the LLM.

**Classifier call** (`aiLanding.classifyIntent`, server-side, small/fast model, JSON mode), input = latest advisor message + the last 2–3 turns + whether a draft exists + which channels/networks/lists the account has. Output:

```json
{"intent":"create|rewrite|question|other",
 "destinations":["website","social","email"],
 "networks":["linkedin"],
 "when":{"text":"Tuesday morning","iso":"2026-10-13T09:00:00-07:00"} ,
 "wantsSendNow":false,
 "emailAudienceHint":"my clients",
 "confidence":0.0-1.0,
 "clarify":"Website, social, or email?"}
```

**Routing rules**
- `intent=create` and confidence ≥ threshold (start at 0.75) and ≥1 destination → **confirm card** (destinations, prefilled preview per destination, date if mentioned, Confirm / Change / Not now). Change = Direction A review sheet (B: open the editor, C: publish kit).
- `intent=create`, no destination or low confidence on destinations → one clarify question with destination chips (“Website, social, or email?”).
- Confidence below a lower bound (≈0.5) or mixed (rewrite + create, e.g. “shorter and post it”) → apply the rewrite first, then show the confirm card for the new version; if truly unclear ask “Want me to set this up, or change the wording?”
- `intent=rewrite` → normal rewrite, no card. Chips stay as fallback.
- Dates: model extracts text + ISO in the advisor's timezone (America/Vancouver for the sample); server re-validates (future, ≤ 1 year) and shows the resolved time on the card. Vague times map to defaults (“morning” 9:00 AM, “afternoon” 1:00 PM) and are shown so the advisor can change them. Keep `parseLooseDatetime` only as a fallback.
- Networks/lists not connected → card shows the Connect / no-list state from §2.5.

**Never auto-execute.** The classifier has no write tools. Only the Confirm button (single-use nonce, 15-min TTL, as today) calls `aiLanding.createDrafts`. Typing “yes” after the card counts as tapping Confirm only if the classifier returns `intent=confirm` for that exact card (nonce still checked). “Send it now” phrases still create **drafts** unless Alex decides otherwise (open question 9); the card says so in plain words (“I'll save it as a draft, not send it”).

**Logging (playground):** store `{text, classifierOutput, routed}` on the chat doc for tuning the threshold; no advisor content leaves FC beyond the existing AI provider.

## 3. Prefill mapping

### Website post (draft)
| Field | Source | Adapted? |
|---|---|---|
| `name` (title) | `firstLineTitle(draftText)` | Copied |
| `content` | `draftTextToHtml(draftText)` minus the title line | Copied |
| `excerpt` | AI short description (fallback `excerptFromDraft`) | AI, editable |
| featured image | none; optional pick from My Media (#260 / #417 library) | n/a |
| Save | `materializeAiLandingHtmlPost` (private HTMLPost). **Do not** call `website.publishPost` / `website.schedulePost`. | |
| Link | Library → the private post (opens Share / Publish as today) | |

### Social (draft or scheduled)
| Field | Source | Adapted? |
|---|---|---|
| destinations | `loadDistributeCapabilities().social.destinations` (LinkedIn / Facebook / Instagram) | n/a |
| message per network | new AI rewrite per network; “Use the full chat text instead” restores `draftText` | AI, editable |
| char counts | LinkedIn 3,000 · Facebook 63,206 (soft hint ~500) · Instagram 2,200 | |
| link | placeholder replaced by the website share URL once the website post is published; dropped if no website post | |
| When | default **Keep as draft**; optional Schedule for date/time | |
| Save (draft) | new `SocialPostQueue` status `draft` (scheduler ignores it), inserted via `insertSocialQueueItem` path; or hold on the chat doc until scheduled (open question) | |
| Save (scheduled) | `social.scheduleOnePost` / `social.schedulePost`, which respects approval settings (`pending_approval`) | |

### Email campaign (draft)
| Field | Source | Adapted? |
|---|---|---|
| `subject` | AI suggestion (fallback `firstLineTitle`) → `prefillNewCampaignSubject(subject, prefs.defaultSubjectPrefix)` (#458) | AI, editable |
| `htmlContent` | `buildDistributionEmailHtml(post, {emailContentMode})`: **teaser + link** if Website is also picked, **full article** if not (#168 AC-6) | Copied |
| `listId` | default list (`MailChimpSettings.defaultSesListIds`), radio picker as #387; may be empty | |
| `name` | title, ≤80 chars | |
| Save | `ses.createCampaign(userId, {...})` → `status:'draft'`. **Never** call `ses.sendCampaign` from this flow. Mailchimp: `addScheduledEmailCampaignInternal` with `send:false`. | |
| compliance | if the advisor has the compliance category, still create the draft; sending goes through the normal compliance step | |

## 4. Methods to add / change

- `aiLanding.prepareDrafts({chatId, messageId, channels})` → returns prefill per channel (one AI call for social versions + subject + excerpt). No writes besides caching on the chat doc.
- `aiLanding.createDrafts({chatId, nonce, website?, social?, email?})` → creates drafts only; stores `draft.distributeResult` with ids; idempotent per chat + channel (reuse the existing `channelAlreadyOk` pattern); returns links.
- Keep `aiLanding.confirmDistribute` for a later “schedule from chat” step or retire it behind the flag (open question).

## 5. Server-side rules

- Every method: `this.userId` required; chat loaded with `{_id, userId}`; all inserts use `this.userId` as owner (`privateToUserId`, `advisorId`, `ownedBy`). Never trust an advisorId from the client. Staff impersonation goes through the existing `getTargetAdvisorId` rules only.
- Edited HTML from the review sheet must be sanitized server-side (allow-list: p, br, b/strong, i/em, ul/ol/li, a[href http/https/mailto]) before saving to HTMLPosts or campaigns. Plain-text fields are escaped (`draftTextToHtml`).
- Check `check()` lengths: subject ≤ 200, social message ≤ network max, title ≤ 120.
- No publish, schedule or send happens from `createDrafts` unless the advisor explicitly picked a social schedule time (and then the normal approval setting applies).
- Section access (`loadSectionAccess`) is re-checked on the server; hidden chips are not the only guard.
- `assertCanadianContentAllowed` stays on every write.
- Playground flag check on the server too, not just the UI.

## 6. Acceptance mapping

- AC-1 / AC-3: action bar → sheet prefilled for each channel; every draft link opens the normal page with the text in it.
- AC-2: multi-select chips; one Create drafts call.
- AC-4: phone bottom sheet; result message has a next step for every channel (including skipped).
- AC-5 / NG-3: drafts by default; no send/publish from the chat.
- Alex clarification: casual typed requests (“schedule the post”, “put this on my site”) reach the confirm card without trigger words; rewrites don't.

## 7. Open questions (for Alex / Angelina)

1. **Drafts vs schedule from the chat.** Recommended: drafts only, with an optional social schedule time. Should the chat ever publish/send directly (today's playground Confirm Send does)?
2. **AI rewrite per destination or verbatim?** Recommended: AI writes a short social version and a subject/excerpt; body copied as-is; one tap to use the original text.
3. **Compliance / approval for AI text.** Should AI-written posts always go to the advisor's approval step (social approval, email compliance) even if they normally skip it?
4. **Which social networks?** LinkedIn + Facebook to start (what's connected), Instagram needs an image, so hide it until image handling exists?
5. **Images.** None from chat today. Offer a pick from My Media (#260/#417) in the Website tab, or leave it for the draft page?
6. **Does the chat remember its drafts?** Recommended yes: strip + follow-ups edit the same drafts (one website post per chat already works this way).
7. **Social “draft” storage.** New `draft` status in `SocialPostQueue`, or keep the unscheduled social text on the chat until the advisor schedules it?
8. **Email list.** Default list preselected; allow saving without a list (recommended) or block?
9. **Which phrases mean “send now” vs draft?** “Email this to my clients”, “post it now”, “publish it”. Recommended: always draft (plus social schedule if a time is given) and say so on the card; a later phase could allow “Send now” as an explicit second button.
10. **Confidence threshold.** Start at 0.75 for showing the card, below 0.5 ask; tune from playground logs?
11. **Typed “yes” after a card.** Count it as Confirm (with the nonce) or require the button tap?
12. **Email audience words.** “my clients” → match a list named Clients, else default list, else ask?

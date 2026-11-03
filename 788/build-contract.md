# #788 Per-advisor Website disclaimer + post page block (build contract)

**Status: Not agent-ready. Soft Dev hold until a direction is picked.** Track: staging. Likely `risk:medium`: it changes text on every client-facing `/post/<id>` page, but there's no data migration.

## Today (staging `027cec6`)

- **Field:** `advisor_configs.disclaimer` (`Match.Optional(String)`, `imports/collections/advisor_configs.js`). It's edited in Settings › **Branding & contact** › Company Branding (`AdvisorConfigManager.jsx`, below Tagline): label "Disclaimer", 4-row textarea, placeholder "Enter your company disclaimer or legal notice", autosaves. Legacy `Brand.jsx` has the same field but isn't routed.
- **Post page:** in `PostView.jsx`, after the topic chips, `<Typography body2 italic><strong>Disclaimer:</strong> {postDisclaimer(advisorConfig)}`. `postDisclaimer()` (`imports/utils/postViewAdvisor.js`) returns the advisor's text, or else `DEFAULT_POST_DISCLAIMER` ("This content is for informational purposes only…"). The line already sits below the body for every type (content, legacy cells, `rawHtml` calculator/infographic frame).
- **Elsewhere:** `getPostForView` (`server/user-methods.js`) and `server/api/embed.js` pass `disclaimer` through. `FullPostView.jsx`, `WebsitePage.jsx` (`/blog/:slug`) and the admin library preview in `ContentLibrary.jsx` hard-code the old generic sentence. Email campaign HTML and social posts **don't** use the field today.

## Change (same in all directions)

1. **Data: no migration.** Keep the field name `advisor_configs.disclaimer`. Advisors who set one see their text as "Your wording". Everyone else stores `''`.
2. **Default:** replace `DEFAULT_POST_DISCLAIMER` with the issue's text, used exactly as written (also used for `/post/<id>` with no advisor):

   > The information on this website, including its articles, infographics, calculators and any linked materials, is provided for general information and educational purposes only for readers in Canada. It is not investment, tax, insurance, legal or financial advice, and it is not an offer or solicitation to buy or sell any security, insurance product or other financial product. Any products or services mentioned are available only through a properly licensed advisor and their dealer or insurance agency, where applicable. The content is based on sources believed to be reliable at the time of writing, but rules, rates and figures can change, and accuracy or completeness is not guaranteed. Calculator results are estimates for illustration only and are not a recommendation. Past performance does not guarantee future results. Any reliance you place on this information is at your own risk. Please speak with a qualified professional, such as your advisor, accountant or lawyer, about your own situation before making any decisions.

3. **Display rule:** `websiteDisclaimer(cfg) = (cfg?.disclaimer || '').trim() || DEFAULT`.
4. **Settings box:** when the stored value is `''`, the box is **prefilled with the default** (chip "Default"). Saving text identical to the default stores `''`, so a future default update reaches them. Clearing the box stores `''` (chip "Blank: uses the default"), and it shows the default again on reload. Custom text shows the chip "Your wording" and a **Reset to default** link.
5. **Post page block** (`PostView.jsx`, replaces the italic line): under the body and topic tags, a 1 px top border, an `h2` "Disclaimer" (14 px, 600, grey `#6b7280`), and the text in a 13 px `#6b7280` paragraph, 1.6 line height. The block is identical for article, infographic and calculator posts. No FC links or branding (white-label). Only one disclaimer appears (acceptance criterion 5).
6. **Not in** email campaign HTML or social posts. Don't touch `mailchimpDistributionHtml.js`, SES campaign builders or social composers.

## Directions (where the box lives)

| | A. Mailing & compliance (recommended) | B. Stays in Branding & contact | C. Own Settings tab |
|---|---|---|---|
| Box | New "Website disclaimer" card at the top of the Mailing & compliance tab, above Mailing address (CASL) | Same spot as today (Company Branding, under Tagline), renamed "Website disclaimer", with the chip, hint and Reset | New tab "Website disclaimer" (`?tab=disclaimer`) between Branding and Mailing, with the box on the left and a live preview of the post-page bottom on the right |
| Old field | Removed. A one-line info note in Company Branding says "Your website disclaimer is now in Mailing & compliance. [Go to Website disclaimer]" | Upgraded in place (no pointer needed) | Removed, with a pointer note to the new tab |
| Why / why not | Sits with the other compliance items (CASL address); keeps Branding about the brand | Least change, and advisors find it where they left it; but it reads as branding, and Company Branding gets long | Most visible, with a preview; but it's a whole tab for one field |

Hint copy (all directions): "Shown at the bottom of every post page: articles, infographics and calculators. Not added to emails or social posts." Footer copy: default "This is the standard disclaimer. Change it to your dealer's wording if you need to."; custom "Your own wording." + Reset to default; blank "Left blank, so your posts show the default disclaimer." + Fill in the default to edit it. "✓ Saved" autosave status (matches today's "Changes save automatically").

**Admin:** the non-hub `AdvisorConfigManager` step flow (admin config editor) keeps the same `WebsiteDisclaimerBox` component in Company Branding, so admins can still set it per advisor.

## Legal wording

Only the issue's default text is real. The custom text in the mock ("Jane Advisor is a mutual fund representative with Example Dealer Inc. …") is **PLACEHOLDER sample text**, not approved wording; it isn't used in code or fixtures as legal copy. The hint and footer lines are UI copy, not legal text.

## Out of scope

Email campaigns, social posts, compliance PDFs, embedded calculators on advisor sites and WordPress copies (phase 2 per the issue), `FullPostView`/`/blog/:slug`/admin library preview hard-coded lines (see open questions), per-post disclaimers, rich text/links inside the disclaimer (plain text, newlines kept).

## Desktop / mobile

- **Post page (1280):** the block spans the main column (md 8) above nothing else, and the advisor sidebar stays on the right. **390:** the block is full width under the tags, and the sidebar card stacks below the block, as PostView's grid does today.
- **Settings 390:** cards go full width, the textarea grows to fit the default (about 9 rows), and the links are at least 44 px. In C, the preview stacks under the box.

## Estimate (agent time: cloud agent build + FC Tester + fix loop)

Scale: #699 took about 30 min from handoff to tested.

| Run | A | B | C |
|---|---|---|---|
| `websiteDisclaimer()` + new default + PostView block (all types) + update `tests/post-view-no-advisor.test.js` | 20–30 min | 20–30 min | 20–30 min |
| Settings box component (prefill, chip, Reset, store `''` for default/blank) | 15–20 min | 15–20 min | 15–20 min |
| Placement: A card in Mailing tab with its own advisor-config autosave + Branding pointer / B in place / C new tab + `?tab=` + preview | 15–25 min | 5–10 min | 25–40 min |
| FC Tester: 3 Settings states, 3 post types at 1280/390, email + social unchanged, no FC links | 20–30 min | 20–25 min | 25–35 min |
| Fix loop | 5–15 min | 5–10 min | 5–15 min |
| **Total** | **≈75–120 min** | **≈65–95 min** | **≈90–140 min** |

## Recommendation

**A.** A disclaimer is a compliance setting, and the Mailing & compliance tab already exists for exactly that (it holds the CASL address). Branding & contact stays about brand, and the pointer note means nobody loses the field. B is the cheapest fallback if we'd rather not move anything. C gives a preview but spends a whole tab on one box.

## Open questions

1. Advisors whose saved disclaimer is exactly the old generic sentence: treat it as default (show the new text), or keep it as their wording?
2. Should `FullPostView`, `/blog/:slug` and the admin library preview also switch to the new default now, or wait for phase 2?
3. Should the Branding pointer note stay for good, or be removed after a while?
4. Is plain text enough, or do dealers need line breaks or links (for example to a dealer site)?
5. Does compliance need to sign off on the default text before it replaces the current line on every post?

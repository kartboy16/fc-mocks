# #655 Only investment content goes to compliance: build contract

> **Not agent-ready. Soft Dev hold until Alex picks.** Mocks only, with generic names (Jane Advisor, Your Firm Name, example.com). **We don't define compliance rules here.** The definition of "investment content" and the advisor confirmation wording are **placeholders that need compliance review**.

Mocks: [Hub](index.html) · [Today](today.html) · [A, tag on each post (recommended)](a-post-tag.html) · [B, topics that skip compliance](b-category-rules.html) · [C, ask at send](c-ask-at-send.html). Every page has a Desktop / Phone toggle (`?phone`).

## 1. Today (staging, read from code)

- The per-advisor compliance mode is `email` / `external` / `off` (`imports/utils/complianceMode.js`), set by staff in Admin › Edit user. The legacy "compliance" advisor category maps to `email`.
- In `email` mode, "Send copy to compliance?" defaults **on** in Distribute (`DistributionEmailSection.jsx`, website + email) and in Create campaign (`CreateCampaign.jsx`, Mailchimp dialog), for every post. Website queue items carry `sendToCompliance` (`server/website-queue-helpers.js`). Social approval falls back to `complianceEmail` (`server/social-approval.js`).
- Library posts (`HTMLPosts`) have `postCategories`, but there's no investment flag.
- Related: #416 (advisor approves first, then compliance), which is locked as A and in build on playground. #415 (compliance Approve is final) leans B, campaigns only.

## 2. Recommendation

**A: a compliance tag on each post.** Our content team sets it on library posts, and the advisor can change it before sending, with a confirmation. Untagged posts go to compliance, and each advisor has an "All content / Only investment content" setting.

The tag is explicit and visible per post. The safe default covers legacy content, and firms that want to review everything keep today's behaviour.

- **B** marks whole topics (categories) as skipping compliance. It's less work per post, but one wrong category affects every post in it, and categories weren't designed for compliance.
- **C** asks the advisor every time ("Does this need compliance approval?" Yes / No / Not sure, with a suggestion). It adds a step to every send, and answers aren't consistent across advisors.

## 3. Screens (A)

| Screen | What's on it |
|---|---|
| Content library | A badge per post: **Investment · goes to compliance**, **Non-investment · skips compliance**, **Not tagged · goes to compliance**. Filter: All / Goes to compliance / Skips compliance. If the advisor's setting is "All content", every row says "Goes to compliance". |
| Distribute | "This post is": Investment content / Not investment content (with a placeholder definition). The source note says "Tagged by our content team", or "You changed this… Undo". The route line and the "What happens next" tracker update. |
| Override confirm | Shown when marking an investment or untagged post as non-investment: "Mark as not investment content? This post won't go to your compliance contact." [Placeholder confirmation wording]. "We record who changed it and when." |
| Create campaign (own email) | "This email is" is **required**: Choose one / Investment / Not investment. "If you're not sure, choose investment content." Emails built from a library post start with that post's tag. |
| Campaigns + tracker | Tag badge per row. Tracker: Advisor ✓ → Compliance (struck through when skipped) → Scheduled. "Compliance not needed: marked non-investment by Jane Advisor, Oct 26." |
| Admin › Edit user | New "What goes to compliance: **All content** (today's behaviour) / **Only investment content**". Staff only, shown read-only to the advisor. |
| Admin › Library post | "Compliance tag: Investment / Non-investment / Not set (treated as investment)". |

## 4. States

| State | Behaviour |
|---|---|
| Not tagged / legacy | Treated as investment, so it **goes to compliance** (safe default). |
| Investment | Same as today: advisor approves, then compliance (#416 chain). |
| Non-investment + "Only investment content" | **Skips compliance.** The advisor's own approval step stays the same (advisor-approved, not auto-approved). |
| Non-investment + "All content" | Goes to compliance (no change for that firm). |
| Compliance mode Off / External | No change in this issue (see question 8). |
| Email with several posts | If any post is investment or untagged, the whole email goes to compliance. |
| List loading / empty / error | Skeleton / "No posts yet. New posts show here with their compliance tag." / "We couldn't load posts." + Try again |
| Tag save error | "Couldn't save the tag. It still goes to compliance." |
| Success | Toasts: "Sent for approval." / "Scheduled. Compliance not needed for this post." |

## 5. Copy notes

Plain and short: "Goes to compliance", "Skips compliance", "Not tagged · goes to compliance", "If you're not sure, choose investment content." **Placeholders:** the definition of investment content, and the override confirmation. Neither is written by us.

## 6. In scope / out of scope

**In:** the tag on library posts (staff-set) with an advisor per-post and per-campaign override; the safe default for untagged posts; the per-advisor setting; routing in every compliance-copy path (FTT Mail, Mailchimp, website, social) for `email` mode; badges and tracker; an audit field (`complianceTagChangedBy/At`); tests with test accounts only.

**Out:** writing compliance definitions; automatic classification (AI); changes to External/Red Oak mode; compliance-side digests of skipped items (see question 5); bulk re-tagging tools beyond the admin field.

## 7. Mobile

The badges wrap under the title, the radios are full width, and the tracker wraps to two lines. The admin settings stack.

## 8. Backend notes

- `HTMLPosts.complianceTag: 'investment' | 'non_investment' | null` (null means investment).
- The campaign, queue item and social item get `complianceTag` copied from the post, plus `complianceTagOverride`, `complianceTagChangedBy` and `complianceTagChangedAt`.
- `AdvisorPreferences.complianceScope: 'all' | 'investment_only'` (default `'all'`).
- One helper: `needsComplianceCopy(prefs, item)` = `isEmailComplianceMode(prefs) && (prefs.complianceScope !== 'investment_only' || effectiveTag(item) !== 'non_investment')`. Use it to default the "Send copy to compliance?" switches and in the server send paths. Don't trust the client.
- Works with #416: advisor approve → `needsComplianceCopy` ? compliance request : schedule.
- Keep existing approve/deny and the #415 auto-approve for investment items unchanged.

## 9. Estimates (one developer)

| | A | B | C |
|---|---|---|---|
| Data fields + admin tag/settings | 1.5–2 | 1.5–2 | 0.5–1 |
| Routing helper in FTT Mail, Mailchimp, website, social | 2–3 | 2–3 | 2–3 |
| Advisor UI (badges, distribute, campaign, override + audit) | 2–2.5 | 1–1.5 | 1.5–2 |
| Tracker/status labels | 0.5–1 | 0.5–1 | 0.5–1 |
| Tests (test accounts, no live compliance emails) | 1 | 1 | 1 |
| **Total** | **7–9.5** | **6–8.5** | **5.5–8** |

Tagging the existing library backlog is staff time and isn't included.

## 10. Open questions

1. **Who tags the library**, including the backlog? Until a post is tagged, it goes to compliance.
2. **At release:** keep every advisor on "All content" and switch firms one by one (as mocked), or move all `email`-mode advisors to "Only investment content"?
3. Can an advisor mark an **investment** post as non-investment (as mocked, with confirmation), or only make things stricter?
4. **Non-investment path:** advisor-approved only (as mocked), or auto-approved with no advisor step?
5. Should compliance get an FYI list (for example weekly) of items that skipped them?
6. Which surfaces: email campaigns, website and social (as mocked), or email only to start (#415 is campaigns only)?
7. Who writes the definition of investment content and the confirmation wording? They're placeholders.
8. Should External (Red Oak) mode follow the same tag?
9. Is the mixed-email rule (any investment post means the email goes to compliance) right?

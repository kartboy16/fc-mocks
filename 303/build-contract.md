# Build contract · #303 Email Campaigns · Insert from Content Library

> **PROVISIONAL** — Recommend Direction A. Idea / playground track. Soft Dev **not** woken. Do **not** mark agent-ready until Alex/Angelina lock a direction and attach the Pages mock URL. CosB will ask in Slack.

**Recommend:** Direction A — Modal picker from campaign editor (“Insert from library”).

**Track:** Idea / playground → after mock lock.

## One-liner

From **Email Campaigns** edit, advisors **browse/search Content Library posts they can access** and **insert** selected post (or its email-ready body) into the **campaign body/blocks** — no hand copy/paste.

## Entry points (provisional)

| Entry | Direction |
| --- | --- |
| Campaign edit toolbar / block action **Insert from library** | **A** (modal), **B** (drawer) |
| Campaign list or “Add content” → **From Content Library** | **C** (full-page picker, then return) |

## Insert payload assumptions (provisional — not locked)

- Insert target: **campaign body / content blocks** (not subject-only).
- Prefer posts with **Type: Email** when filters are shown; other types allowed with clear **Insert into email** that uses **email-ready body** when available (fallback copy TBD if no email body).
- Payload sketch: `{ postId, title, type, emailBodyHtml | emailReadyBlocks, sourceLabel?, accessBadges? }` — exact schema left to Soft Dev after lock.
- After insert: new block(s) appear in the email canvas; advisor can still edit.

## Access / approval rules (provisional)

- Show **only posts the advisor can use** under existing content access / approval rules.
- Optional badges (illustrative): **Compliance Approved**, **Advisor-only**.
- Do not invent new MAP admin approval workflows in this pass.

## Filters (provisional)

- Search (title / snippet).
- Type chips (default emphasis on **Email**; allow Article / Social / etc.).
- Topic chips or light topic drawer (reuse Content Library topics where possible).

## Required states

| State | Behavior |
| --- | --- |
| Loading | Skeleton / spinner in picker; no false empty |
| Empty | Clear copy when no accessible posts (or filters match nothing) + reset filters |
| Error | Insert or load failure with retry |
| Success | Block appears in canvas; toast or inline confirmation |

## Screens (Direction A)

1. Editor idle — campaign chrome + **Insert from library**
2. Picker open — search, filters, post cards
3. Loading
4. Empty
5. Error
6. Inserted success — block on canvas

## In scope

- Designer mocks for insert-from-library into email campaigns (A/B/C)
- Empty / loading / error / success states
- Access-respecting list + optional approval badges (mock)

## Out of scope

- content-library app code / MAP admin changes
- Waking Soft Dev / marking **agent-ready**
- Redesigning the entire email composer
- New approval product rules beyond “respect existing access”

## Open product questions (do not invent lock)

1. If a non-Email post has no email-ready body, block insert or offer a degraded convert?
2. Firm-shared vs advisor-only visibility nuances beyond existing access?
3. Multi-select insert in one action, or single post only (A mocks single)?
4. Does inserted content stay linked to the library post (live) or snapshot at insert?

## Alternatives (not recommended as default)

- **B — Right drawer:** browse while seeing canvas; good for compare, more persistent chrome.
- **C — Library-first step:** closer to Library browse; leaves editor mid-flow.

## Reference

[Hub](index.html) · [Direction A](directions/a/) · [B](directions/b/) · [C](directions/c/) · [Issue #303](https://github.com/kartboy16/content-library/issues/303) · Reporter: Angelina Hung

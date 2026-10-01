# Build contract · #338 Email Campaigns · Labeled row actions

> **PROVISIONAL** — Recommend Direction A. Soft Dev **not** woken. Do **not** mark agent-ready until Alex/Angelina lock a direction and attach the Pages mock URL.

**Recommend:** Direction A — One labeled **Actions** / More control; menu with plain words; Delete as danger.

**Track:** Staging · Designer-first → Soft Dev after lock.

## One-liner

Replace five unlabeled icon actions on each Email Campaigns row with a **labeled Actions (More) menu** so advisors/assistants can read View, Download PDF, View HTML, Duplicate, and Delete without mis-tapping trash vs duplicate.

## Row layout (Direction A)

| Column | Role |
| --- | --- |
| Campaign name | Primary scan |
| Status | Primary scan (Draft / Scheduled / Sent / …) |
| Last updated / date | Primary scan |
| Actions | Single labeled control → menu |

## Menu items (plain words)

1. **View** — open campaign
2. **Download PDF**
3. **View HTML**
4. **Duplicate** — non-destructive
5. **Delete** — danger styling + confirm dialog; verbally distinct from Duplicate

## Acceptance mapping

| AC | Contract |
| --- | --- |
| AC-1 | Labeled Actions / More; no icon-only strip of five |
| AC-2 | Delete = danger color + confirm; not adjacent unlabeled twin of Duplicate |
| AC-3 | Name / status / date remain readable at desktop + comfortable tap targets |
| AC-4 | Mocks on Pages + this contract |

## Alternatives (not default)

- **B — Inline labeled buttons:** View / Duplicate / Delete as text; PDF + HTML in More. Faster for frequent actions; denser on narrow screens.
- **C — View + More:** Keep primary View inline; rest in More. Optionally hide empty Compliance / Approval columns to reclaim width.

## In scope

- Designer mocks for labeled row actions (A/B/C)
- Delete confirm pattern
- Realistic 3–4 campaign sample table in FC chrome

## Out of scope

- Send / schedule pipeline
- Full Email Campaigns IA rewrite
- Waking Soft Dev / marking **agent-ready**
- content-library app code (mocks-only)

## Open product questions

1. Menu trigger: icon ⋯ with accessible name “Actions”, or visible “Actions” text button? (A mock uses labeled “Actions” with ⋯.)
2. Should View still be reachable by clicking the campaign name?
3. PDF / HTML: download vs new tab — product default?

## Reference

[Hub](index.html) · [Direction A](directions/a/) · [B](directions/b/) · [C](directions/c/) · [Issue #338](https://github.com/kartboy16/content-library/issues/338)

# Build contract — FTT Mail: Import from Mailchimp (#149)

Canonical copy for engineering handoff. Interactive HTML: [`build-contract.html`](build-contract.html). Full mock detail: [`mock-a/BUILD-CONTRACT.md`](mock-a/BUILD-CONTRACT.md).

## Product

Replace Mailchimp export → CSV → FTT Mail with in-app **Import from Mailchimp** (stored API key → SES/Contacts).

**Flow:** Entry → Audience picker → Confirm/options → Progress/summary → Error (bad key).

## Recommended direction

**A — Guided wizard** (`directions/a/`, deepened in `mock-a/`).

## Defaults (open questions)

| # | Topic | Default |
|---|-------|---------|
| 1 | Re-import | One-shot primary; optional “Refresh from Mailchimp” on list later (secondary) |
| 2 | Conflicts | **FTT Mail wins** — never silently re-subscribe local unsubscribe/bounce; show skipped count |
| 3 | Who | Advisor self-serve where Mailchimp is connected; admin can act on behalf |
| 4 | Target list | Default **new FTT Mail list named after the Mailchimp audience**; alternate: add to existing (radio) |

## In / out of scope

**In:** Entry, audience multi-select, target radios, conflict policy + skipped, progress, summary, bad-key reconnect, mobile wizard, FC admin shell.

**Out:** Two-way sync, push to Mailchimp, campaign history, live API (mock only), full Refresh implementation.

## Related

#130, #129 — Mailchimp connection / FTT Mail list model.

## Tokens

bg `#f4f8fc`/`#fafafa`, cards `#fff`, ink `#1e2a4a`, muted `#5b6572`, blue `#2b7de9`/`#2196f3`, borders `#d4e4f2`, mint `#e6f1fb`, Inter, 12px/8px/pills.

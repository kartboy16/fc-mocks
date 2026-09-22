# Mock A — Guided wizard (RECOMMENDED)

Full clickable mock for **FinancialContent #149: FTT Mail — Import from Mailchimp**.

## Recommend: Direction A

Direction A (full-page stepper) is recommended over modal (B) and split pane (C): clearest primary CTA chain, room for conflict/re-import policy, and a natural progress → summary arc. See `../directions/compare.html`.

## Quick start

1. Open [`index.html`](index.html) — hub with **Import from Mailchimp** CTA + connected badge.
2. Click CTA → [`wizard.html`](wizard.html).
3. Smoke: **Continue → pick audience(s) → Start import → progress → summary**.
4. Return to hub — new list / member count bump.
5. [`error.html`](error.html) — invalid key → Reconnect.
6. [`mobile.html`](mobile.html) — narrow wizard.

## Files

| File | Role |
|------|------|
| `index.html` | Hub / lists |
| `wizard.html` | 5-step guided import |
| `error.html` | Bad API key |
| `mobile.html` | Mobile frame |
| `styles.css` | Tokens + FC admin shell |
| `app.js` | Navigation, fake progress, list bump |
| `BUILD-CONTRACT.md` | Screens, defaults, states, scope |

## Defaults (open questions)

Labeled on-screen with orange **DEFAULT** pills:

- Re-import: one-shot primary; Refresh secondary on list
- Conflicts: FTT Mail wins; show skipped
- Who: advisor self-serve; admin on behalf
- Target: new list named after audience (default); else existing

No git push from this deliverable folder.

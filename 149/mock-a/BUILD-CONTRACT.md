# Build contract — FTT Mail: Import from Mailchimp (#149)

**Direction:** A — Guided wizard (recommended)  
**Product:** Replace Mailchimp export → CSV → FTT Mail with in-app **Import from Mailchimp** (stored API key → SES/Contacts).

## Screens

| Screen | File | Purpose |
|--------|------|---------|
| Hub / lists | `index.html` | FTT Mail lists, connected badge, primary **Import from Mailchimp** CTA, secondary Refresh on row |
| Wizard 1 · Connect | `wizard.html` step 1 | Connection status for advisor (Jordan Lee, CFP) |
| Wizard 2 · Audiences | step 2 | Multi-select Mailchimp audiences |
| Wizard 3 · Target + conflicts | step 3 | New list vs existing (radio); conflict + re-import policy copy |
| Wizard 4 · Progress | step 4 | Fake progress animation |
| Wizard 5 · Summary | step 5 | Imported / skipped / errors; list count bump on hub |
| Error · bad key | `error.html` | Invalid/missing API key → Reconnect CTA |
| Mobile | `mobile.html` | Narrow (~390px) wizard |

Smoke path: **Import CTA → pick audience → confirm → progress → summary** (then hub shows bumped list).

## Defaults for open questions (bake into UI; labeled with DEFAULT pills)

1. **Re-import:** One-shot primary; optional “Refresh from Mailchimp” on list later (secondary).
2. **Conflicts:** **FTT Mail wins** — never silently re-subscribe a local unsubscribe/bounce; show skipped count.
3. **Who:** Advisor self-serve where Mailchimp is connected; admin can act on behalf.
4. **Target list:** Default **new FTT Mail list named after the Mailchimp audience**; alternate: add to existing list (radio).

## States

- Connected (happy path) — badge green; wizard enabled
- Disconnected / invalid key — `error.html`; hub badge via `index.html?error=1`
- Empty audience selection — block Continue on step 2
- Importing — progress bar; Back/Next disabled
- Complete — summary stats; sessionStorage list bump
- Multi-audience — create multiple new lists (or add combined to existing)

## In scope

- Entry from FTT Mail / Contacts hub
- Audience picker (multi-select)
- Target list: new (default) vs existing
- Conflict policy messaging + skipped count
- Progress + summary
- Error: bad API key → reconnect
- Mobile narrow wizard
- Advisor self-serve + admin-on-behalf framing

## Out of scope (non-goals)

- Two-way sync
- Push contacts or campaigns to Mailchimp
- Campaign history import
- Real Mailchimp / SES API calls (mock only)
- Full Refresh-from-Mailchimp implementation (CTA only)

## Fake data

- Audiences: Newsletter (1,248), Clients 2024 (862), Event RSVPs (214)
- Advisor: Jordan Lee, CFP
- Existing lists: Active clients (412), Newsletter archive (890)

## Related

- **#130** / **#129** — related FTT Mail / Contacts / Mailchimp connection work (coordinate API key storage and list model)
- Directions: `../directions/` (A recommend, B modal, C split pane)

## Tokens

bg `#f4f8fc` / `#fafafa`, cards `#fff`, ink `#1e2a4a`, muted `#5b6572`, blue `#2b7de9` / `#2196f3`, borders `#d4e4f2`, mint `#e6f1fb`, Inter, 12px / 8px radii, pills. FC admin shell (Contacts / FTT Mail).

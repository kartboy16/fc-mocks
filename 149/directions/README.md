# Direction boards — FTT Mail: Import from Mailchimp (#149)

Three interactive UI directions for replacing Mailchimp export → CSV → FTT Mail with an in-app **Import from Mailchimp** flow.

## Recommendation: **Direction B — Modal on Email Campaigns**

Product mock: [`../mock-b/`](../mock-b/). Entry = Email Campaigns (`/content-library/email-campaigns`) with faithful staging chrome; Import opens a compact multi-step modal. Directions **A** (guided wizard) and **C** (split pane) are archived explorations (`../mock-a/` kept for A).

## Defaults baked into recommended mock (open questions)

| Question | Default (labeled on boards) |
|----------|------------------------------|
| **Re-import** | One-shot primary; optional “Refresh from Mailchimp” on list later (secondary) |
| **Conflicts** | **FTT Mail wins** — never silently re-subscribe a local unsubscribe/bounce; show skipped count |
| **Who** | Advisor self-serve where Mailchimp is connected; admin can act on behalf |
| **Target list** | Default **new FTT Mail list named after the Mailchimp audience**; alternate: add to existing list (radio) |

## Non-goals

- Two-way sync
- Push contacts/campaigns to Mailchimp
- Campaign history import

## Boards

| Dir | Pattern | Entry |
|-----|---------|-------|
| [A](a/index.html) | Full-page guided stepper | Archived — see mock-a |
| [B](b/index.html) | Modal multi-step on Email Campaigns | **Recommend** — product mock in mock-b |
| [C](c/index.html) | Split pane audiences + preview | Archived |

## Compare

Open [compare.html](compare.html) side-by-side summary, or open each board alone.

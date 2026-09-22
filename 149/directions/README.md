# Direction boards — FTT Mail: Import from Mailchimp (#149)

Three interactive UI directions for replacing Mailchimp export → CSV → FTT Mail with an in-app **Import from Mailchimp** flow.

## Recommendation: **Direction A — Guided wizard**

Deepen A into the full clickable mock (`../mock-a/`). It gives the clearest primary CTA chain, room for conflict policy copy, and a natural progress → summary arc. Modal (B) is denser for power users; split pane (C) is great for multi-audience compare but weaker on stepper clarity.

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
| [A](a/index.html) | Full-page guided stepper | Recommend — deepen to mock |
| [B](b/index.html) | Modal multi-step from Contacts | Compact |
| [C](c/index.html) | Split pane audiences + preview | Sticky Import footer |

## Compare

Open [compare.html](compare.html) side-by-side summary, or open each board alone.

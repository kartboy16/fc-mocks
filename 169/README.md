# FC Website services scan results — visual directions (#169)

Redesign the **Scan website for services** results panel so durable services use **allowlist-only** tags (HTML Post / Master Category taxonomy) instead of free-text comma tags and a vague “Confirmed” checkbox. Goal: scan → match HTML Posts via good tags.

**Issue one-liner:** Free-text tags + “Confirmed” → editable name, allowlist chip picker, and a clear **“Use for suggestions”** toggle so scanned services can drive HTML Post matching.

## Paths

| Path | What |
|------|------|
| `index.html` | Pages hub — links, issue blurb, quick compare |
| `compare.html` | Side-by-side matrix + iframes |
| `directions/a/index.html` | **A — Dense table** (interactive) |
| `directions/b/index.html` | **B — Card stack** (interactive) |
| `directions/c/index.html` | **C — Split inspector** (interactive) |

## BEFORE (contrast strip in each board)

Grey free-text field: `life insurance, family, …` + **Confirmed** checkbox — vague, free typing, no taxonomy.

## AFTER (all directions)

Per service row:

- Editable **Name**
- **Tags** as multi-select / chip picker from allowlist only (scan suggests; user adds/removes from list — no free typing as primary)
- **Use for suggestions** toggle (replaces Confirmed)
- Empty / partial states (e.g. Annuities with no tags → prompt to pick)

### Fake allowlist (demo)

`life insurance` · `family` · `business` · `annuities` · `critical illness` · `disability` · `retirement` · `estate planning` · `investments`

### Example rows

| Service | Tags state |
|---------|------------|
| Annuities | Empty → “Pick tags…” CTA; annuity-related options available |
| Personal Life Insurance | Suggested: life insurance + family |
| Corporate Life Insurance | Suggested: life insurance + business |
| Critical Illness & Disability | Fully confirmed: critical illness + disability (+ Use for suggestions on) |

## Theses (for Alex / Angelina)

**A — Dense table**  
Admin table: Name | Tags (chip cell opens dropdown) | Use for suggestions (switch). Inline edit. Compact for power users reviewing many scanned services. *Best when volume is high and parity with other FC admin tables matters.*

**B — Card stack**  
Each service is a card: name field, tag chip area + “Add tag” searchable allowlist popover, Use for suggestions in card header. Empties show dashed “Pick tags to match HTML posts” CTA. *Best when each service needs breathing room and empty-state coaching.*

**C — Split inspector**  
Left list of scanned services (name + tag count + toggle pill). Right detail pane: name, full chip picker with search, suggested vs selected sections, Use for suggestions. *Best when the allowlist is long and deep editing one service at a time wins.*

## Shared board chrome

Each direction frames an admin **Scan website for services** results panel under Manage Advisor / Pick for me (light FC shell), includes a greyed **BEFORE** strip, and ships interactive JS (toggle switches, add/remove chips from allowlist, empty Annuities state).

## Tokens (FC staging)

`bg` `#f4f8fc` / `#fafafa` · cards `#fff` · ink `#1e2a4a` · muted `#5b6572` · blue `#2b7de9` / `#2196f3` · borders `#d4e4f2` · mint `#e6f1fb` · Inter/system-ui · cards 12px · buttons 8px · pills 999px.

Fake data only. No Meteor. Relative assets only. Do not git push.

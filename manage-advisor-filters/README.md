# Manage Advisor Posts — Crowded active filters

Temporary FC Designer mocks (no content-library issue yet). Presentation-only: how the **active filter chip strip** behaves when crowded (50+ excludes). Filters drawer stays as live today.

## Live pages

- Hub: https://kartboy16.github.io/fc-mocks/manage-advisor-filters/
- **A (recommended)** — Collapsed summary + expand: https://kartboy16.github.io/fc-mocks/manage-advisor-filters/directions/a/
- B — Grouped type chips → popover: https://kartboy16.github.io/fc-mocks/manage-advisor-filters/directions/b/
- C — Max 2 rows + Show all: https://kartboy16.github.io/fc-mocks/manage-advisor-filters/directions/c/
- Reference: https://kartboy16.github.io/fc-mocks/manage-advisor-filters/reference/crowded.png

## Problem

With many exclude chips (list source, suggest source, topics), the pill strip wraps across ~6 rows and pushes the advisor/post table down.

## Directions

| Dir | Idea | Default height |
|-----|------|----------------|
| **A ★** | Collapsed bar `Active filters · N` + group mini-counts + Expand / Clear all | ~1 row; expand → scrollable ~3 rows |
| B | ~3–6 summary chips; click opens popover with group chips + search | Always 1 row |
| C | Cap at 2 rows + fade + `Show all N` | ~2 rows |

## Scope

- Mocks only — no build-contract yet (lock later)
- No GitHub issue / agent-ready / Software developer ping from this deliverable
- Self-contained HTML (inline CSS/JS), Inter, FC colors `#2b7de9` / `#1e2a4a` / `#f4f8fc`

## Local

```
manage-advisor-filters/
  index.html
  directions/a|b|c/index.html
  reference/crowded.png
  README.md
```

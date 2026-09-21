# Mock A — Searchable grouped checklist (FC #176)

**Recommendation: Direction A** — this is the deepened full mock.

## Open
- [index.html](index.html) — desktop shell (Jordan Lee)
- [mobile.html](mobile.html) — stacked mobile + sticky Save
- Query: `?mode=empty` (default) · `?mode=edit` (life insurance + retirement pre-selected)

## Smoke
1. Open empty state → Save disabled.
2. Search “retire” → check retirement (and/or select-all on Wealth).
3. Chips update in sidebar; Save enables.
4. Save → toast **“Services saved for Pick for me”**.
5. “Scan website instead” → dismissible optional-scan note.
6. Switch to Edit existing → life insurance + retirement pre-checked.

## Tokens
bg `#f4f8fc`/`#fafafa`, cards `#fff`, ink `#1e2a4a`, muted `#5b6572`, blue `#2b7de9`/`#2196f3`, borders `#d4e4f2`, mint `#e6f1fb`, Inter, 12px cards, 8px buttons, pills.

## Fake Master Category tree
- **Insurance:** life insurance, critical illness, disability, annuities
- **Audience:** family, business
- **Wealth:** retirement, investments, estate planning
- **Tax:** tax planning

## Related
- [BUILD-CONTRACT.md](BUILD-CONTRACT.md)
- [Directions](../directions/README.md) · [Compare](../directions/compare.html)
- [Pages hub](../pages-root/index.html)

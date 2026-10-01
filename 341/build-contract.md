# Build contract · #341 MAP · Reduce density

> **PROVISIONAL** — Recommend Direction A. Soft Dev **not** woken. Do **not** mark agent-ready until Alex/Angelina lock a direction and attach the Pages mock URL.

**Recommend:** Direction A — Collapse Sources + Services to **“N topics” + View all**; rename **Load from WP** → **Load from website** and demote; keep **Pick a post for me** + **Suggest posts** primary (#266 shipped).

**Track:** Staging · Designer-first → Soft Dev after lock.

## One-liner

Make Manage Advisor Posts scannable: collapse tag piles into a compact topics summary with View all, demote website load so it no longer competes with Pick / Suggest, and reduce horizontal hunting.

## Row density rules (Direction A)

| Element | Behavior |
| --- | --- |
| Sources + Services & products tags | Collapse to **“N topics”** chip (or “N topics · sources”) |
| View all | Opens drawer / popover listing Sources + Services tags |
| Suggest posts | Primary (unchanged from #266) |
| Pick a post for me | Primary (unchanged from #266) |
| Load from WP | Rename → **Load from website**; secondary (muted text button or overflow) |
| Past / Suggested | Not redesigned (#254 area) |

## Acceptance mapping

| AC | Contract |
| --- | --- |
| AC-1 | Topics collapse + View all expand path |
| AC-2 | Load renamed + demoted / not competing with Pick / Suggest |
| AC-3 | Pick + Suggest remain primary / obvious |
| AC-4 | Typical row scannable with less horizontal hunt |
| AC-5 | Pages mock + this contract |

## Alternatives (not default)

- **B — Hide Load for non-admin:** Same collapse; Load from website behind More for non-admins (show admin note in mock).
- **C — Two-line row:** Topics on line 2; action cluster on the right with Pick / Suggest primary.

## In scope

- Designer mocks for MAP density (A/B/C)
- Topics collapse + View all pattern
- Rename / demote Load from website
- Keep #266 Pick / Suggest chrome as primary

## Out of scope

- Replacing Pick / Suggest behavior (#266)
- Full Past / Suggested rewrite (#254)
- Waking Soft Dev / marking **agent-ready**
- content-library app code (mocks-only)

## Open product questions

1. Count “topics” as union of Sources + Services, or separate chips (“2 sources · 5 services”)?
2. View all: drawer vs popover vs inline expand?
3. Who sees Load from website — all admins, or role-gated (see Dir B)?

## Reference

[Hub](index.html) · [Direction A](directions/a/) · [B](directions/b/) · [C](directions/c/) · [Issue #341](https://github.com/kartboy16/content-library/issues/341) · Related: [#266](https://github.com/kartboy16/content-library/issues/266) · [#254](https://github.com/kartboy16/content-library/issues/254)

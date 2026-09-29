# Build contract · #279 Multi email footers

> **PROVISIONAL** — Recommend Direction A. Not locked. Do **not** mark agent-ready until Alex/Angelina pick a direction and attach the Pages mock URL.

**Recommend:** Direction A — Named footers library + picker (Settings list + compose dropdown).

**Track:** Basic enhancement → staging after mock approved. Designer-first.

## One-liner

Let advisors/firms save **two or more named email footers** and **choose which one** when composing or scheduling an email newsletter. Migrate the legacy single footer to a named Default. Snapshot footer HTML at send so past campaigns stay intact when a footer is later edited or deleted.

## Recommended UI (Direction A)

- **Settings → Email footers:** list of named footers; **Default** badge; Edit / Set default / Delete; **Add footer**.
- **Edit footer:** name + HTML/body (same editor model as today’s single footer).
- **Newsletter compose / schedule:** **Email footer** dropdown (Default pre-selected if none picked); live preview strip shows chosen footer at bottom of email.
- **Legacy migrate callout** (first visit after upgrade): “Your existing footer is now called Standard (default).”
- **Delete confirm:** “Past newsletters keep the footer they already sent. New newsletters won’t offer this footer.”

## Acceptance criteria

- [ ] **AC-1:** Create/keep ≥2 distinct footers (name/label + HTML/content as today’s footer model).
- [ ] **AC-2:** Legacy single footer → migrate as default named footer; no breakage.
- [ ] **AC-3:** On compose/schedule email newsletter, choose which saved footer (clear default if none picked).
- [ ] **AC-4:** Chosen footer appears in preview and goes out on send (approval path included if applicable).
- [ ] **AC-5:** Edit/rename/delete non-default without breaking past campaigns — **recommend snapshot-at-send**.

## Build recommendations (provisional)

| Topic | Provisional stance |
| --- | --- |
| Past campaigns (AC-5) | **Snapshot footer HTML at send/schedule** (and at approval submit if that creates the immutable payload). Past sends keep the HTML they used. Delete hides from new picks with confirm. |
| Legacy migrate (AC-2) | Existing single footer → named **Standard** (or keep current label if one exists) marked **Default**. |
| Ownership | **LEFT OPEN** — firm-shared vs per-advisor footers (product Q). |
| Default delete | **LEFT OPEN** — who can delete Default; must always have ≥1? |
| Approval re-check | **LEFT OPEN** — if footer is edited after submit, does approval queue re-check? |

## Screens / states (Direction A)

| Screen | Purpose |
| --- | --- |
| Manage footers | AC-1 list + Default + actions |
| Edit footer | Name + content editor |
| Newsletter compose | AC-3 picker + AC-4 preview / approval note |
| Legacy migrate callout | AC-2 first-visit |
| Delete confirm | AC-5 safe delete copy |

## In scope

- Multi named email footers + picker on email newsletter compose/schedule
- Legacy migrate to Default
- Snapshot-at-send (recommended) for past-campaign safety
- Delete/rename/edit non-default with confirm

## Out of scope

- Per-recipient dynamic footers
- Redesigning the entire email composer
- Social or website footers

## Open product questions (do not invent lock)

1. Firm-shared footers vs per-advisor footers?
2. Who can delete Default? Must always have ≥1?
3. Snapshot-at-send vs live-reference for past campaigns? (**Recommend snapshot.**)
4. Does approval queue re-check footer if edited after submit?

## Alternatives (not recommended)

- **B — Inline on compose:** Save/manage from compose; weaker firm governance.
- **C — Default + override only:** Minimal UI; weaker when footers need equal weight.

## Reference

[Hub](index.html) · [Direction A](directions/a/) · [B](directions/b/) · [C](directions/c/) · [Issue #279](https://github.com/kartboy16/content-library/issues/279) · Reporter: Alana Read

# Manage Advisor Posts — Choose Services (modal → popover + column)

Temp path (no GitHub issue # yet). Clickable HTML directions for FC Designer.

## Locked decision (Alex)
- **Direction C** — row-anchored popover (not A or B).
- **Required tweak:** Services & products column shows **ALL** selected tags — **do not truncate with +N**. Chips wrap; cell grows vertically.

## Problem
- **Today:** Choose services expands an inline table row (`ChooseAdvisorServicesPanel`).
- **Wanted:** Open a **row-anchored popover** instead; after selection show a **Services & products** chip column on advisor rows (all chips visible).

## Live hub
https://kartboy16.github.io/fc-mocks/manage-advisor-choose-services/

## Directions
| Dir | Pattern | Status | URL |
|-----|---------|--------|-----|
| **C** | Anchored compact popover + all chips | **Alex-locked** | [directions/c](directions/c/index.html) |
| A | Centered modal + chip column | Not selected | [directions/a](directions/a/index.html) |
| B | Two-pane modal (Services \| Products) | Not selected | [directions/b](directions/b/index.html) |

## Build contract
- [build-contract.md](build-contract.md) · [build-contract.html](build-contract.html)

## Scope
Mocks + frozen build contract. Do **not** mark agent-ready; CoS will file the content-library issue.

## Sample data
Advisors: Jordan Lee (Coulas — many chips to demo wrap), Priya Shah, Marcus Chen, Aisha Rahman (empty).
Services: Retirement / Estate / Tax Planning, Insurance Review, Investment Strategy, …
Products: TFSA, RRSP, RESP, Whole Life, Group Benefits, Critical Illness, …

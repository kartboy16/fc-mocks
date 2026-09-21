# Directions — Manual Advisor Services (FC #176)

**Recommendation: Direction A — Searchable grouped checklist**

## Product thesis
Advisors pick services from Master Categories only (multi-select allowlist). No website crawl/LLM on the primary path. Selected categories write to the same durable advisor-services store used by Pick for me / suggestions. Scan website remains secondary/optional later.

## Direction A — Searchable grouped checklist (RECOMMENDED)
**Thesis:** One panel, familiar admin pattern: search → filter groups → check items → select-all-per-group → Save. Selected count stays visible. Lowest cognitive load; deepest mock for build.

**Why recommend:** Matches FC admin shell under Manage Advisor / Pick for me. Scales with Master Category tree. Clear empty/edit states. Easy to harden into production UI.

## Direction B — Dual-list transfer
**Thesis:** Explicit Available ↔ Selected transfer with Add/Remove. Strong for “what’s in / what’s out” clarity; heavier chrome and more clicks.

## Direction C — Chip picker sheet
**Thesis:** Selected chips on top; “Add service” opens searchable allowlist modal. Compact; modal friction for multi-pick sessions.

## Before / After
- **Before:** Scan website for services → unreliable / free-text results  
- **After:** Manual pick from Master Categories → durable, allowlisted services

## Fake Master Category tree (demo)
- **Insurance:** life insurance, critical illness, disability, annuities  
- **Audience:** family, business  
- **Wealth:** retirement, investments, estate planning  
- **Tax:** tax planning  

## Navigation
- [Direction A](a/index.html) · [B](b/index.html) · [C](c/index.html) · [Compare](compare.html)

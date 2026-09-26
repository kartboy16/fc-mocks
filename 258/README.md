# #258 — 30-day free trial + Stripe integration

Clickable HTML/CSS mocks for FinancialContent free trial + Stripe (Idea / playground).

**Live:** https://kartboy16.github.io/fc-mocks/258/

## Problem
Need a clear 30-day free trial and Stripe-backed payment/subscription. Product questions (who pays, card upfront, tiers, existing accounts) are still open.

## Directions
| | Direction | One-liner |
|---|---|---|
| **Recommend** | [A — Firm checkout + card-upfront](directions/a/) | Firm pays · Checkout stub · trial + Billing + portal |
| Alt | [B — Soft trial](directions/b/) | No card until convert · banner · paywall |
| Alt | [C — Advisor seats + firm overlay](directions/c/) | Surfaces firm vs advisor · EXAMPLE Starter/Growth CAD |

## Docs
- [directions-brief.md](directions-brief.md) — comparison  
- [build-contract.md](build-contract.md) / [build-contract.html](build-contract.html) — **provisional** (default A)

## Notes
- Track: **Idea / playground** (not staging/main)  
- Prices marked `Example · not locked`  
- Stripe flows are stubs / test mode only  
- Do not mark agent-ready from this mock  

## Audience
Firm admin / advisor billing & signup (Canada / FinancialContent tone).

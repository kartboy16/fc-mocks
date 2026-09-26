# Build contract · #258 30-day free trial + Stripe *(provisional)*

**Status:** Provisional — working default = **Direction A** until Alex/Angelina lock  
**Issue:** [content-library #258](https://github.com/kartboy16/content-library/issues/258)  
**Mocks:** https://kartboy16.github.io/fc-mocks/258/  
**Track:** Idea / playground (not staging/main)

## One-liner

Firm/admin starts a **30-day free trial** via **Stripe Checkout** (test mode) with **card collected upfront**, then sees trial start/end dates, days left, and converted/active status in **Billing & plan**, with **Customer Portal** for manage/cancel — until product locks otherwise.

## Acceptance criteria (from issue)

- **AC-1:** New or existing signup/billing UX clearly offers a 30-day free trial  
- **AC-2:** Stripe is used for payment method capture / subscription after trial (or at start if product requires card-upfront — call out open product question)  
- **AC-3:** Trial start/end and conversion states are visible to the account admin  
- **AC-4:** Happy-path playground demo without charging real money (Stripe test mode)

## Open product questions (must resolve before agent-ready)

1. Who pays — **firm** vs **advisor**?  
2. **Card required upfront** for trial?  
3. **Plan tiers / prices?** (mocks: EXAMPLE / placeholder CAD only)  
4. Do **existing accounts** get a trial?

Do not invent locked answers in implementation until product confirms.

## Working default (Direction A)

Until lock:

- **Payer:** Firm / admin (thesis of A; still open)  
- **Card:** Required at Checkout start of trial  
- **Prices:** EXAMPLE only — e.g. Firm Starter ~$79 CAD/mo, Firm Growth ~$199 CAD/mo — mark not locked  
- **Stripe:** Checkout Session with `trial_period_days=30` + Customer Portal for manage/cancel  
- **In-app:** Billing shows Trial · ends {date}, days left, and Active after convert

Directions B (soft trial) and C (firm vs advisor branch) remain comparison mocks.

## States

| State | Required behavior |
|---|---|
| Pricing / start trial | Clear 30-day offer; EXAMPLE prices labeled |
| Checkout (test mode) | Card capture stub / Stripe Checkout; $0 due today |
| Success | Trial started; end date shown; path into Billing |
| Trial active | Admin sees status, plan, trial end, Manage billing |
| Converted / active | Subscription active; next invoice / amount (example) |
| Soft-trial alt (B only) | No card at start; paywall if expired |
| Payer branch (C only) | Explicit firm vs advisor paths |

## In scope (provisional)

- Signup / pricing / start-trial UX for playground  
- Stripe test-mode Checkout + Customer Portal integration path  
- Billing & plan surfaces for trial / active

## Out of scope

- Live / production Stripe charges  
- Locked CAD prices or tier names  
- Marking issue `agent-ready` from mock work  
- Staging/main ship without product lock  
- Full tax/invoicing localization beyond Canada-tone placeholders  
- Soft-trial or dual-payer models unless Direction B/C is locked instead of A

## Primary files *(guessed — TBD until codebase confirmed)*

Flag as **TBD** — confirm in content-library before implementation:

- Billing / settings UI (likely admin or firm settings · **TBD**)  
- Signup / onboarding / pricing entry (**TBD**)  
- Stripe webhook / subscription helpers (**TBD**)  
- Env: Stripe **test** keys only for playground (**TBD**)

## Stripe / playground notes

- Use **Stripe test mode** only for AC-4 happy path  
- Mocks stub Checkout, Payment Element, and Customer Portal — no live keys in `fc-mocks`  
- Host mocks only at `/258/` on GitHub Pages

## Reference links

- Hub: https://kartboy16.github.io/fc-mocks/258/  
- Direction A: https://kartboy16.github.io/fc-mocks/258/directions/a/  
- Directions brief: [directions-brief.md](directions-brief.md)  
- Issue: https://github.com/kartboy16/content-library/issues/258

## Handoff

Provisional contract only. Parent / CoS posts Slack and GitHub updates. Do **not** mark agent-ready until Alex/Angelina pick a direction and confirm open questions.

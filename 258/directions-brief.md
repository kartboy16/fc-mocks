# #258 Directions brief — 30-day free trial + Stripe

> **Mocks only / Idea · playground.** Comparison for Alex / Angelina / Software / CoS — not a locked build contract. Working default = **Direction A** until product locks. Do not mark agent-ready from this mock.

**Issue:** [content-library #258](https://github.com/kartboy16/content-library/issues/258)  
**Mocks:** https://kartboy16.github.io/fc-mocks/258/  
**Recommend (Designer):** Direction A — Firm checkout + card-upfront trial

---

## Open product questions (all directions)

Do **not** invent locked answers. Surface on hub + every direction.

1. Who pays — **firm** vs **advisor**?
2. **Card required upfront** for trial?
3. **Plan tiers / prices?** (mocks use EXAMPLE / placeholder CAD only — mark `Example · not locked`)
4. Do **existing accounts** get a trial?

Legal/billing copy in mocks is **placeholder** for Canada / FC compliance review.

---

## Shared context

| | |
|---|---|
| **Track** | Idea / playground — **not** staging/main |
| **Ask** | Angelina: “Add in 30 day, free trial and stripe integration” |
| **Stripe** | Stubs only (Checkout UI, Payment Element shell, Customer Portal). Test mode / no real charges |
| **Chrome** | Advisor/admin app: left rail + top bar; Inter + FC blues |
| **Out of scope for mocks** | Live Stripe keys, agent-ready label, Slack/GH comments from designer executor |

---

## Direction A — Firm checkout + card-upfront trial *(recommend)*

**Thesis:** Firm/admin is the paying customer. Marketing/pricing → Stripe Checkout (stub) with 30-day trial + card collected now → success → in-app Billing “Trial · ends {date}” + Manage billing (Customer Portal stub). Ending-soon (≤7 days) banner + converted/active state.

**Screens:** Pricing · Checkout stub · Success · Billing (trial) · Ending soon · Converted

**Tradeoff:** Higher signup friction (card upfront) vs clearer conversion and fewer unpaid zombies. Assumes firm payer (still an open Q).

---

## Direction B — Soft trial (no card until convert)

**Thesis:** Lower signup friction. Signup starts trial **without** card → persistent trial chip/banner → Add payment via Stripe Payment Element stub before/at end → paywall if expired.

**Screens:** Signup/start trial · App home + trial banner · Add payment (modal + screen) · Expired paywall · Billing after convert

**Tradeoff:** Easier start; higher risk of unpaid usage and paywall surprise. Answers “card upfront?” with *no* for this direction only — still a product decision.

---

## Direction C — Advisor self-serve seats + optional firm overlay

**Thesis:** Explicitly surfaces **firm vs advisor** payer. Advisor personal trial **or** firm admin buys seats. Plan picker with 2 EXAMPLE tiers (Starter / Growth — placeholder CAD). Seat invite stub. Branch UI labeled open.

**Screens:** Plan picker / who pays · Advisor trial start · Firm admin seats · Billing summary

**Tradeoff:** More product surface area; best when payer model is undecided and stakeholders need to see both paths.

---

## Before → after (plain words)

| Today | After (any direction, once locked) |
|---|---|
| No clear 30-day trial UX | Trial start/end and conversion visible to account admin |
| No Stripe playground path | Stripe test-mode stubs for capture / subscription |
| Unclear who pays / card / tiers | Open questions called out; EXAMPLE CAD only until lock |

---

## Clickable in mocks

- Direction step chips / tabs between screens  
- Primary CTAs advance the flow  
- Toasts for portal / invite / convert stubs  
- Optional `localStorage` for last screen (demo state)

---

## Recommendation

**Ship Direction A as working default** for playground demos until Alex/Angelina lock payer + card-upfront + tiers. Keep B and C as comparison for the open questions.

# FC Ads Phase 1 — Direction B mock (Guided Wizard-First)

Clickable static HTML/CSS + light vanilla JS. No build step, no Meteor, no APIs.

## Open locally

```bash
# Option A — open the file directly
open /workspace/fc-ads-phase1/mock-b/index.html
# or double-click index.html in your file manager

# Option B — tiny local server (recommended for consistent relative paths)
cd /workspace/fc-ads-phase1/mock-b
python3 -m http.server 8765
# then visit http://127.0.0.1:8765/
```

**Entry:** [`index.html`](./index.html) — Ads home.

## Pages

| Page | File |
|------|------|
| Ads home | `index.html` |
| Create wizard | `wizard.html` |
| Approvals | `approvals.html` |
| Public landing (no shell) | `landing.html` |
| Performance | `performance.html` (`campaign.html?id=` redirects here) |
| Funding / wallet | `funding.html` |

Shared: `styles.css`, `app.js`.

## Click-path smoke

1. **Home** → filter chips → **Create campaign**  
2. **Wizard** steps 1→7 → **Submit for approval** → success → home (pending card)  
3. **Approvals** → open modal → **Approve** or **Reject**  
4. **Landing** (new tab from home demo bar) → submit with CASL  
5. Live campaign card → **Performance** KPIs  
6. Wallet chip → **Funding** → Add funds → **wizard funding** link  

Demo toggles on several screens (empty states, skeleton, error banner).  
“Reset sample data” on home restores seed campaigns.

## Spec for eng

See [`BUILD-CONTRACT.md`](./BUILD-CONTRACT.md).

## Note

Uses `localStorage` keys `fc_ads_mock_b_campaigns` and `fc_ads_mock_b_wallet` for demo persistence in the browser only.

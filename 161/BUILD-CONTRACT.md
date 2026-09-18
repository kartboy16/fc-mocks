# FC Ads Phase 1 — Direction B Build Contract

**For:** Software developer implementing Phase 1 against this mock  
**Direction:** B — Guided Wizard-First  
**Mock path:** `/workspace/fc-ads-phase1/mock-b/`

---

## One-liner product

**Canada-only paid lead-gen ads (Google Search + location + Meta Lead Ads) inside FinancialContent: advisors create campaigns via a guided full-page wizard, CS/compliance approves in a large preview modal, performance shows big KPIs, and spend is prepaid from a wallet.**

---

## Screens + routes

| Screen | File / route | Shell? | Purpose |
|--------|----------------|--------|---------|
| Ads home | `index.html` | App shell | Card grid of campaigns; filters; Create CTA |
| Create wizard | `wizard.html` (+ `?step=funding`, `?edit=`) | App shell | 7-step full-page wizard with progress rail |
| Approvals | `approvals.html` (+ `?id=`) | App shell | Pending queue + large review modal |
| Public landing | `landing.html` | **None** (mobile-first) | FC-hosted lead form + CASL |
| Performance | `performance.html` (+ `?id=`) | App shell | Big KPIs, rollup / per-campaign |
| Campaign alias | `campaign.html?id=…` | → redirects | Alias to performance |
| Funding / wallet | `funding.html` | App shell | Balance, add funds, transactions |

Shared assets: `styles.css`, `app.js` (vanilla; optional `localStorage` for demo campaigns).

### Navigation (app shell)

Left sidebar: **Library** · **Contacts** · **Ads** (active on ads flows) · **Approvals** · **Reports** · **Funding**  
Top bar: search stub · wallet chip (`$2,450 CAD` mock) linking to Funding.

---

## States per screen

### Ads home (`index.html`)
| State | Behavior |
|-------|----------|
| Default | Sample campaigns covering draft / pending / live / paused / rejected |
| Empty | Demo “Show empty” → empty illustration + Create CTA |
| Filter | Chips: All / Draft / Pending / Live / Paused / Rejected |
| After submit | Toast + pending campaign appears (via `localStorage`) |
| Card click | Live/paused → performance; pending → approvals; draft/rejected → wizard |

### Create wizard (`wizard.html`)
| State | Behavior |
|-------|----------|
| Steps 1–7 | Goal · Geo · Channel · Creative · Budget · Funding · Review |
| Admin mode | “Acting for” advisor picker visible when admin toggle on |
| Validation error | Inline errors if required fields empty (demo: “Force validation error”) |
| Loading | Overlay spinner on Submit for approval |
| Success | Modal confirmation → home (`?submitted=1`) or Approvals |
| Goal locked | Leads only (Phase 1) |

### Approvals (`approvals.html`)
| State | Behavior |
|-------|----------|
| Queue | List of `pending` campaigns |
| Empty queue | Demo toggle + empty state |
| Modal | Creative preview, geo, budget, channels, advisor |
| Approve | Success modal; campaign → `live` |
| Reject | Reason textarea required; campaign → `draft` + return messaging |

### Public landing (`landing.html`)
| State | Behavior |
|-------|----------|
| Form | Name, email, phone, CASL required |
| CASL error | Highlight + message if unchecked |
| Success | Thank-you state (no app shell) |
| Footer note | Leads → Contacts (mock) |

### Performance (`performance.html`)
| State | Behavior |
|-------|----------|
| Rollup | Aggregate KPIs across live/paused |
| Per-campaign | Selector / tab; deep-link `?id=` |
| Loading | Skeleton toggle (demo) |
| Error | Error banner toggle (demo) |
| Chart | Placeholder only |
| Leads CTA | “View leads in Contacts” stub toast |

### Funding (`funding.html`)
| State | Behavior |
|-------|----------|
| Balance | Shows wallet (persisted in `localStorage`) |
| Add funds | Mock card charge → balance up + tx row |
| Link out | “Continue to wizard funding” → `wizard.html?step=funding` |

---

## In-scope / out-of-scope (Phase 1)

### In scope
- Lead-gen goal only (Canada)
- Channels: Google Search + location; Meta Lead Ads; or both
- Geo: address+radius / city / postal FSA
- Creative templates + headline/body with **`[COMPLIANCE PLACEHOLDER]`** rails
- Daily + lifetime budget, date range
- Funding: wallet / card / split (UI)
- Submit → Approvals queue → Approve / Reject (with reason)
- FC-hosted public landing + CASL checkbox
- Performance KPIs: Spend, Impressions, Clicks, CTR, Leads, CPL
- Wallet balance + add funds + transaction list
- Admin “Acting for” advisor picker on create
- App shell parity with FC staging visual tokens

### Out of scope (Phase 1)
- Awareness / traffic / other goals
- Real Google / Meta API integration (mock only)
- Real payments / PCI
- Real PII or production advisor data
- Meteor / content-library code changes
- Full charting library / BI exports
- Multi-country geo
- Automated compliance NLP scoring
- A/B creative experiments
- Push / email notification delivery (toasts only in mock)

---

## Mobile vs desktop

| Surface | Priority | Notes |
|---------|----------|-------|
| App (home, wizard, approvals, performance, funding) | **Desktop-first** | Sidebar shell; wizard rail collapses to horizontal on narrow widths |
| Public landing | **Mobile-first** | No shell; single-column form; phone-friendly tap targets |

Do not require mobile parity for dense approval modal or KPI dashboard in Phase 1; ensure usable, not pixel-perfect, on tablet.

---

## Copy placeholders — `[COMPLIANCE PLACEHOLDER]`

Flagged in mock (must remain until Legal/Compliance supplies final copy):

1. Creative step — disclaimer / risk disclosure rail on ads  
2. Creative step — advisor credentials & firm disclosure on landing / Meta footer  
3. Review step — submit attestation language  
4. Approvals modal — disclaimer rail under creative preview  
5. Landing form — CASL consent wording  
6. Landing form — risk / firm disclosure footer  
7. Any live ad preview body appended with placeholder in submitted campaigns  

**Rule:** Never ship production without replacing these strings. UI should keep a visible compliance rail pattern even after copy is finalized.

---

## Direction B interaction notes

1. **Card grid home** — Soft marketing-product density; not a dense data table (contrast Direction A). Hero “Create campaign” CTA is primary entry.  
2. **Full-page wizard** — Stepped flow with left (or top-on-mobile) progress rail; Next/Back; not a drawer.  
3. **Approval modal** — Large creative-preview modal over the queue (not a separate detail page only). Approve / Reject with reject reason.  
4. **Big KPIs** — Performance is a dedicated dashboard with large metric cards + chart placeholder, not buried in table cells.  
5. **Wallet chip** — Persistent in top bar; Funding is a first-class nav item.  
6. **Guided feel** — Locked Phase 1 choices (Leads goal) + templates reduce blank-page anxiety for advisors new to paid ads.

---

## Visual tokens (match FC staging)

- Fonts: Inter, system-ui, Roboto, Helvetica, Arial  
- Colors: bg `#f4f8fc` / app `#fafafa`, cards `#fff`, ink `#1e2a4a` / `#2c3e50`, muted `#5b6572`, accent `#4a96e0`, blue `#2b7de9` / `#2196f3` / `#1976d2`, borders `#d4e4f2`, mint `#e6f1fb`  
- Status: draft blue, pending `#8E44AD`, live `#1E8449`, paused `#B7950B`, rejected `#C0392B`  
- Radius: cards 12px, buttons 8px, pills 999px  

---

## Fake data conventions

- Advisor names: e.g. “Jordan Lee, CFP”, “Sam Patel, CFP”, “Alex Rivera, CFP”  
- No real emails/phones in seed data; landing form accepts typed values but does not persist PII off-box  
- Currency: CAD  

---

## Acceptance smoke (from this mock)

1. Open `index.html` → see card grid + filters + Create  
2. Create campaign → walk all 7 wizard steps → Submit → success → pending on home  
3. Approvals → open modal → Approve (live) and separately Reject (draft + reason)  
4. Open `landing.html` → fail without CASL → succeed with CASL → thank-you  
5. Performance → KPIs + skeleton/error toggles; open from live card  
6. Funding → see balance → add funds → link to wizard funding step  

---

*Mock is static HTML/CSS + light vanilla JS. No Meteor, no APIs, no secrets.*

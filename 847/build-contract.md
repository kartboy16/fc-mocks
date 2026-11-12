# #847 One Dealer per advisor profile — zero-click revision

**Status:** Published on GitHub Pages. Not agent-ready. Soft Dev hold until a direction is picked. No build launched.

## Sources (read-only)
- Issue #847
- Published A/B/C mocks (preserved here)
- Request-thread follow-up: “make it simple- zero click”
- Related #280 and #788 (still open; not expanded here)

## Recommendation
**Zero-click** — the advisor does nothing to get the right dealer logo and disclaimer. The dealer default is assigned by staff/admin, or inferred from the existing footer/disclaimer. Email footer, website post disclaimer and compliance defaults inherit automatically. Staff/admin change is one switch; overridden items are listed and are never silently overwritten. A pre-send check flags mismatches automatically and never auto-removes or auto-sends. Optional 1:1 override and “Reset to dealer default” stay tucked away. No extra advisor screens or confirmation steps.

A, B and C are unchanged and kept for comparison. A is the previous Settings-centered pick; B is the three-step wizard; C is the dual-kit layout.

## Who sees what
| Surface | Facing | What happens |
| --- | --- | --- |
| Dealer list (add/edit logo, disclaimer, legal/privacy links) | Staff / admin | Catalog only |
| Profile dealer assignment (assigned or inferred) and one-switch change | Staff / admin | Advisor is not asked to set, select or confirm |
| Email footer, website post disclaimer, compliance defaults | Inherited automatically on advisor and client output | No advisor setup |
| Campaign item override + “Reset to dealer default” | Advisor or staff, tucked under “Override this item” | Optional; default path uses the dealer default |
| Pre-send / pre-approval mismatch flag | Automatic on the send path; hold is staff-visible; advisor is also flagged | Never auto-removes or auto-sends |
| Email recipient preview and website post preview | Client-facing | `yourfirm.ca` / `example.com` links only; disclaimer copy is placeholder |

## Screens (Zero-click)
| Screen | Facing | Notes |
| --- | --- | --- |
| Dealer list | Staff | Same catalog as A; empty/loading/error/success |
| Staff profile · Jane Advisor | Staff | Shows assigned or inferred dealer and MGA; inherit list; Change dealer. No advisor picker. |
| Change dealer | Staff | One switch: pick dealer, list “Will not be overwritten”, Update defaults |
| Advisor campaign | Advisor | Inherited footer by default. No dealer select. Override/Reset inside a collapsed control. |
| Website post preview | Client | Disclaimer inherits; share/email links on yourfirm.ca |
| Pre-send check | Automatic | Ready: no mismatches, Send to approval is a demo only. Mismatch: Send disabled, Keep on hold. |

A/B/C screens are unchanged from the earlier contract (Settings picker, wizard, kits).

## States
ready, loading, empty (no dealers / no dealer assigned), error/retry, success (defaults updated, overrides kept), mismatch (flag, send disabled). Staff profile also has assigned vs inferred source (mock switcher only).

## Copy
- “Assigned by staff” / “Inferred from existing footer”
- “Email footer, website post disclaimer, and compliance defaults inherit automatically.”
- “Change dealer” / “Will update” / “Will not be overwritten”
- “Dealer default” / “Override this item” / “Custom (overrides dealer default)” / “Reset to dealer default” / “Use a custom footer”
- “Mismatch flagged — not sent”
- “No dealer assigned.”
- Disclaimer: “[Placeholder — existing Example Dealer … disclaimer. Not invented legal text.]”
- Footer note: “[Placeholder — existing campaign footer / compliance copy, not invented legal text.]”

No estimates or explainer prose in the mock UI. Inference reliability is not stated.

## In / out of scope
**In (Zero-click):** staff assignment or inferred default, automatic inheritance, staff one-switch change with override review, tucked optional override/reset, automatic mismatch hold, client-facing email and website previews. **Out:** advisor dealer setup/confirmation, extra advisor wizard steps, building all of #280, rewriting #788, live DNS, actual email send, auto-migration of historical `dealerInfo`, real dealer names/logos, invented legal copy, invented inference accuracy.

Existing hand-placed footer content keeps rendering until migrated (issue AC). How inference is performed is an open question, not a specified algorithm in this mock.

## Desktop vs mobile
1280: side nav, staff profile with previews, centered one-switch panel. 390: stacked nav, full-height change sheet, 40–44px actions, override control stays collapsed by default.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | Zero-click | A | B | C |
| --- | --- | --- | --- | --- |
| Cloud agent build | 12–18 | 12–18 | 13–19 | 14–20 |
| FC Tester (inherit on email + website previews, no advisor setup, staff one-switch + override review, tucked reset, mismatch hold, 1280/390, no product-domain links on client previews) | 4–8 | 4–7 | 4–7 | 5–8 |
| Fix loop | 3–5 | 3–5 | 3–5 | 3–5 |
| **Total** | **19–31 h** | **19–30 h** | **20–31 h** | **22–33 h** |

Zero-click’s upper bound is a little higher than A because inheritance and any inferred-assignment cases still need tests, while the inference method itself is unspecified. High risk: touches email and website output. Playground first (issue track), then staging / FC Tester. QA inboxes only. Alex merges main. No build launched.

## Open questions
1. One profile with Investments + Insurance (as mocked) vs separate profiles from #280?
2. Path for sends that need **both** logos (#280) — default both, send-time kit, or later?
3. Does dealer default fully replace, or only prefill, the #788 website disclaimer box?
4. Who may edit the admin dealer list and approve logo/disclaimer changes?
5. Mismatch detector: true AI scan vs rules (known logo assets, names, link hosts)?
6. Migration plan for existing `dealerInfo` / hand-placed images (keep rendering until migrated).
7. After a dealer change, who must review listed overrides, and is send blocked until then?
8. How is a dealer inferred from an existing footer or disclaimer, and what happens when the footer is empty, mixed, or unclear?
9. Must staff confirm an inferred dealer before inheritance starts, or does it apply immediately?
10. Does the advisor ever see or confirm the assigned/inferred dealer, or is that staff-only (as mocked)?
11. On a mismatch in the zero-click path, must the advisor act, or is the hold resolved by staff only?

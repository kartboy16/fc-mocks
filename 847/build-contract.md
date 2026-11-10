# #847 One Dealer per advisor profile — local unpublished contract

**Status:** Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #847 (dealer list, Settings default, 1:1 override, change review, pre-approval mismatch check)
- Related #280 (dual-licensed investments / insurance / both — still open design; this mock uses two selects on one profile, not a full multi-profile product)
- Related #788 (per-advisor website disclaimer in Settings; dealer default should feed that surface, not invent a second disclaimer product)
- Slack thread (read-only) for the original ask; mocks use generic fixtures only

## Recommendation
**A** — keep work on the unified Settings page: Investments dealer + Insurance MGA, a single change confirmation that updates defaults and lists overrides, and a blocking pre-send/pre-approval check. Closest to the issue wording. B is the same logic with a longer change wizard and a drawer for flags. C leans toward #280 by showing two “kits”; use it only if the pick is to preview dual-license branding more strongly here.

## Screens
| Screen | Who | Notes |
| --- | --- | --- |
| Admin Dealer list | Admin | Logo (placeholder marks), default disclaimer, legal/privacy links; add/edit; empty/loading/error/success |
| Settings · profile | Admin / advisor | Dealer + MGA selects; email footer / website disclaimer / compliance pull defaults |
| Campaign / template / post item | Admin / advisor | “Custom (overrides dealer default)” + “Reset to dealer default” |
| Change dealer | Admin / advisor | Updates non-overridden defaults in one step; lists overridden items; no silent overwrite |
| Pre-approval / send check | Staff + advisor | Flags mismatched logos/names/links, including on overridden items; never auto-removes or auto-sends |

Client-facing email preview: Your Firm Name, jane.advisor@example.com, yourfirm.ca / example.com links. Legal/disclaimer text is explicitly placeholder.

## States
ready, loading, empty (no dealers), error/retry, success (saved / defaults updated), mismatch (flag, send disabled).

## Copy
- “Custom (overrides dealer default)”
- “Reset to dealer default”
- “Change investments dealer” / review list “Will not be overwritten”
- “Mismatch flagged — not sent” / “Flagged to staff and to Jane Advisor”
- Disclaimer: “[Placeholder — existing Example Dealer … disclaimer. Not invented legal text.]”

## In / out of scope
**In:** dealer catalog, profile defaults, per-item override + reset, change review, mismatch hold. **Out:** building all of #280 (separate profiles, “both logos” as a third profile), rewriting #788 into a new field model beyond “defaults from dealer”, live DNS, actual email send, auto-migration of historical `dealerInfo` (plan only; data migration is risk:high), real dealer names/logos.

Existing hand-placed footer content keeps rendering until migrated (issue AC).

## Desktop vs mobile
1280: side nav, optional split kits (C), centered change panel. 390: stacked nav, full-height sheets, 40–44px actions, drawer becomes a sheet (B).

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 12–18 | 13–19 | 14–20 |
| FC Tester (email previews, dual-license, override/reset, change review, mismatch hold, 1280/390, no FC links on previews) | 4–7 | 4–7 | 5–8 |
| Fix loop | 3–5 | 3–5 | 3–5 |
| **Total** | **19–30 h** | **20–31 h** | **22–33 h** |

High risk: touches email output. Playground first (issue track), then staging / FC Tester. QA inboxes only. Alex merges main. No build launched.

## Open questions
1. One profile with Investments + Insurance selects (as mocked) vs separate profiles from #280?
2. Path for sends that need **both** logos (#280) — default both, send-time kit, or later?
3. Does dealer default fully replace, or only prefill, the #788 website disclaimer box?
4. Who may edit the admin dealer list and approve logo/disclaimer changes?
5. Mismatch detector: true AI scan vs rules (known logo assets, names, link hosts)?
6. Migration plan for existing `dealerInfo` / hand-placed images (keep rendering until migrated).
7. After a dealer change, who must review listed overrides, and is send blocked until then?

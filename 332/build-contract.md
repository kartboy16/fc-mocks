# Build contract · #332 First login Contact us / help setup

**Alex lock:** Direction **B** — Soft welcome panel + persistent **?** help FAB (bottom-right). **Not** a one-time dialog.

**Soft Dev hold · Idea / playground · not agent-ready.** Soft Dev not woken. CosB can re-ask Alex if needed.

## Recommend / lock
**B — Soft panel + ? FAB.** First visit auto-opens soft right sheet; dismiss closes panel; **?** stays bottom-right and reopens anytime.

## Contact us (mandatory)
Primary CTA = `mailto:support@financialtechtools.ca` (subject/body prefill OK). Show address in UI where helpful.

## Related ≠ same
Do **not** rebuild [#155](https://github.com/kartboy16/content-library/issues/155) full profile walkthrough. This is a lighter help/contact panel for incomplete Social · Email · WordPress only.

## One-liner
When any of Social / Email / WordPress are not connected, auto-open a soft help panel on first visit; dismiss closes the panel but a persistent **?** stays bottom-right so advisors can reopen anytime. Primary: Contact us → mailto support@financialtechtools.ca.

## Entry points
| Entry | Dir |
| --- | --- |
| Soft right sheet + persistent ? FAB (first auto-open, reopen via ?) | **B** (Alex lock) |
| Centered modal checklist (one-time / rare) | A · superseded alt |
| Contact-first short form modal | C · superseded alt |

## Beats
1. First visit auto-open — soft panel + ? visible when ≥1 channel missing  
2. Checklist — Connected vs Not connected chips  
3. Contact us → mailto support@financialtechtools.ca  
4. Optional self-serve (Social / Email / Website settings)  
5. Dismiss — closes panel only; ? remains  
6. Help FAB — clicking ? reopens the soft panel (persistent, not one-time)

## Acceptance criteria (locked B)
- **AC-1:** Soft panel auto-opens on first eligible visit when ≥1 channel missing; ? FAB visible  
- **AC-2:** Lists Social / Email / WordPress with Connected vs Not connected  
- **AC-3:** Primary Contact us → `mailto:support@financialtechtools.ca`; optional self-serve  
- **AC-4:** Dismiss closes panel; ? remains bottom-right  
- **AC-5:** Clicking ? reopens the soft panel (persistent help)

## Out of scope
content-library app code · waking Soft Dev · agent-ready · full #155 · real OAuth/PII

## Live
https://kartboy16.github.io/fc-mocks/332/

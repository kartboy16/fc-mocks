# Build contract · #355 Social share without website destination

**PROVISIONAL** — Recommend Direction **C** (Hybrid). Not locked. Soft Dev hold · not agent-ready.

**Soft Dev hold · Designer-first.** Soft Dev not woken. Do **not** mark `agent-ready`. Wait for Alex pick + CosB tips.

## Recommend
**C — Hybrid warn + post without link.** Allow social when WP is missing, but warn before post/schedule. Matches independent Social / Email / WP connections (#332) and the new advisor menu (don’t hard-block), while preventing silent dead links.

- **A** fights recent product (independent channels).
- **B** is fine if Alex wants zero friction (no warn).

## One-liner
When Social is connected and WordPress is not, allow share/schedule but show a short warning before post: posts won’t include a site link — Connect website · Post without link · Cancel. Light banner on Social calendar/settings when WP missing.

## Entry points (provisional)
| Entry | Dir |
| --- | --- |
| Gate: block share until WP connected | A · alt |
| Social-native: copy + media, no link required | B · alt |
| Hybrid: warn + Connect / Post without link / Cancel | **C** (recommend) |

## Beats (recommend C)
1. Light banner on Social calendar / settings when WP missing  
2. Compose still available (share not hard-blocked)  
3. On Post now / Schedule → warn dialog  
4. **Connect website** (primary alt) → WP connect flow  
5. **Post without link** (secondary) → proceed social-native (copy + media)  
6. Cancel → back to compose  
7. After Post without link → no website URL on FB/LI/IG preview or published payload  

## Acceptance criteria (provisional · C)
- **AC-1:** Social share/schedule is allowed when WP is missing (not hard-gated like A)  
- **AC-2:** Before post or schedule with WP missing, show warn: “No website connected — posts won’t include a link to your site.”  
- **AC-3:** Dialog actions: Connect website · Post without link · Cancel  
- **AC-4:** Choosing Post without link proceeds with copy + media only (no site destination URL)  
- **AC-5:** Light banner on Social settings and/or calendar when WP missing  
- **AC-6:** No silent dead-link social shares for WP-less users  

## Out of scope
content-library / Meteor app code · waking Soft Dev · agent-ready · real OAuth/publish/PII

## Related
[#332](https://github.com/kartboy16/content-library/issues/332) independent Social / Email / WP connections · new advisor menu (WP not required to enter social)

## Live
https://kartboy16.github.io/fc-mocks/355/

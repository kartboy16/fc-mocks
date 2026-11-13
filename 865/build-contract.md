# #865 Slimmer app header and footer

**Status:** Published on GitHub Pages at https://kartboy16.github.io/fc-mocks/865/. Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #865 (related: #851 advisor home / sidebar idea)
- `imports/ui/ContentLibrary.jsx` left rail and mobile `AppBar` on `origin/main` (`10e691a`)
- `imports/ui/Navbar.jsx` is a separate thin AppBar used on a few older pages (Dashboard, websites), not the main Content Library chrome

## Recommendation
**A — keep the left rail and slim it.** Every nav item stays where it is. The screen space comes back from a shorter logo, tighter item padding, a smaller profile footer, and a shorter mobile header.

**B — slim top bar** is a real fork: remove the rail, put primary destinations in a 48px top header, and move Settings & Branding plus account items into More / Account menus. Consider B only if the team wants to leave the left edge for content (the #851 conversation) rather than trim the current rail.

## What exists today
Desktop Content Library has no top AppBar. Chrome is a permanent 90px left rail (`py: 3`) with a wide vertical product logo, large icons, `mb: 2` between items, and a pinned Profile footer (48px avatar + label + 16px padding). Rail items: Content, Website, Social Media, Email Campaigns, Calendar, Settings & Branding, Profile. Profile opens: View Profile, Branding & settings, Billing & plan, Help & Support, Sign Out (plus admin-only items, which stay in that menu).

Mobile: 56px AppBar (40px logo, menu, 36px avatar) and a temporary drawer of the same rail items.

Approximate heights used on the mock (from today’s layout, not a live tape measure):

| Chrome | Today | A | B |
| --- | --- | --- | --- |
| Desktop rail width | 90px | 76px | none (full-width content) |
| Logo block | 104px tall | 40px | 28–36px in the top bar |
| Nav row | ~72px | ~48px | 48px bar |
| Profile footer | ~88px | ~56px | 32px account button in the bar |
| Mobile header | 56px | 48px | 48px |

## Screens
Today, A, and B, each at 1280 and 390, with a height readout and a nav-item map.

## States
ready, mobile drawer open, More open (B), Account menu open (B). Admin-only items stay in the Profile / Account menu (not redesigned here).

## Copy
Existing labels only: Content, Website, Social Media, Email Campaigns, Calendar, Settings & Branding, Profile, View Profile, Branding & settings, Billing & plan, Help & Support, Sign Out, More, Menu.

No estimates or explainer prose on the mock pages beyond the height ticks and the item map.

## In / out of scope
**In:** slimmer header/footer chrome, all current destinations still reachable, desktop and mobile. **Out:** redesigning admin tools, changing #851’s advisor-home information architecture, rewriting page content, live logo asset (generic YFN mark used in fixtures).

## Desktop vs mobile
1280: A shows the slim rail; B shows the top bar. 390: hamburger + 48px header (A and B); drawer lists the same items. Targets stay 40px.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B |
| --- | --- | --- |
| Cloud agent build | 10–16 | 12–18 |
| FC Tester (every nav item, Profile menu, desktop + 390, no missing destinations, account/help/billing) | 5–8 | 5–8 |
| Fix loop | 3–5 | 3–5 |
| **Total** | **18–29 h** | **20–31 h** |

Touches the shell of every signed-in page. Staging first. No build launched.

## Open questions
1. Confirm the height targets (the table above is from code layout, not a device measurement).
2. Does the vertical product logo shrink in place (A), or is a horizontal mark required?
3. Short-height desktops already pin Profile earlier in the list (`isShortRail`); does A keep that behaviour?
4. If B is picked, is Calendar kept in the top bar or moved to More on mid-width screens?
5. How this should (or should not) line up with the #851 advisor-home sidebar idea.

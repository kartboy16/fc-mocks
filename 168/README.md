# FC Share destination picker — visual directions (#168)

Replace the combinatorial Share dropdown with **three independent channels** (Email · Social · Website). Advisors select any subset or all, then Continue.

**Issue one-liner:** Staging Share is a ~307px combo popover with four fixed mixes; redesign to independent multi-select, mobile-scannable, FC tokens.

## Paths

| Path | What |
|------|------|
| `index.html` | Pages hub — links, issue blurb, quick compare |
| `compare.html` | Side-by-side matrix + iframes |
| `directions/a/index.html` | **A — Checklist rows** (interactive) |
| `directions/b/index.html` | **B — Multi-select chips** (interactive) |
| `directions/c/index.html` | **C — Icon cards** (interactive) |
| `reference/` | Staging screenshots of current combo picker |

## BEFORE (staging, real labels)

From `reference/share-destination-picker-content-library-centered.png`:

1. **Email full article** — Full article in email  
2. **Website and Social** — Publish to site, then share link  
3. **Website and Email** — Publish to site and email a teaser  
4. **Website, Social and Email** — Publish to site, share link, email teaser  

## AFTER (all directions)

Independent toggles: **Email** · **Social** · **Website**. Select any mix. “Select all”, “N of 3 selected”, Continue/Next enabled only when ≥1 channel is on.

## Theses (for Alex / Angelina)

**A — Checklist rows**  
Vertical list of three large rows (icon + label + short helper + checkbox). Select all as text above the list. Mobile-first full-width rows — dense enough for one thumb scroll, not a matrix. *Best when clarity and form-like utility win.*

**B — Multi-select chips**  
“Where to share” + three large pill toggles that fill when selected; Select all / Clear as meta chips; helper explains mix-and-match. Softer marketing feel. *Best when the share moment should feel lighter and more brand-forward.*

**C — Icon cards**  
Three equal cards in a row on desktop / stack on mobile. Tap toggles selected ring + check. Select all in header. Slightly more visual; still scannable. *Best when glanceable icons and visual hierarchy matter most.*

## Shared board chrome

Each direction frames a **Share** sheet over a dimmed fake post (“RRSP tips for clients”), includes a greyed **BEFORE** strip with the four real combo labels, and ships lightly interactive JS (toggle channels, select all, enable Continue).

## Tokens (FC staging)

`bg` `#f4f8fc` / `#fafafa` · cards `#fff` · ink `#1e2a4a` / `#2c3e50` · muted `#5b6572` · blue `#2b7de9` / `#4a96e0` / `#2196f3` · borders `#d4e4f2` · mint `#e6f1fb` · Inter/system-ui · cards 12px · buttons 8px · pills 999px.

Fake copy only. No Meteor. Relative assets only.

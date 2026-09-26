# #260 Directions brief — My Media Library + compose media

> **Mocks only / Idea · playground.** Comparison for Alex / Angelina / Software / CoS — not a locked build contract. Working default = **Direction A** until product locks. Do not mark agent-ready from this mock.

**Issue:** [content-library #260](https://github.com/kartboy16/content-library/issues/260)  
**Mocks:** https://kartboy16.github.io/fc-mocks/260/  
**Recommend (Designer):** Direction A — Library drawer from compose

---

## Open product questions (all directions)

Do **not** invent locked answers. Surface on hub + every direction.

1. Library scoped **per advisor only** vs firm-shared later?
2. **Video size / format limits** copy?
3. Does **upload-to-compose also auto-add** to My Media?
4. Staging: is #153/#162 drag-drop actually findable, or only a **discoverability polish**?

---

## Shared context

| | |
|---|---|
| **Track** | Idea / playground — **not** staging/main |
| **Ask** | Angelina: drag-drop for social + “my media library?” (#fc-bugs `1790459709.508909`) |
| **Related shipped** | #153 compose drag-drop (closed); #162 drop indicator only while dragging (closed) |
| **#162 constraint** | Idle compose = no permanent giant drop zone |
| **Audience** | Advisor · desktop-first (~1280); mobile noted briefly |
| **Out of scope** | Full DAM / team folders / permissions v1; AI image drawer changes; live social publish; agent-ready from mock |

---

## Direction A — Library drawer from compose *(recommend)*

**Thesis:** Primary new surface is a **My Media** drawer/modal opened from Post Now media toolbar (“My Media” / “Library”). Grid of advisor’s prior uploads + Upload + drag into the drawer. Compose itself keeps #162: idle = no giant drop panel; while dragging over compose = clear overlay. Compact hint near media icon: “Drop image or video, or open My Media.” Pick attaches to draft; remove works. Lightweight dedicated Library page in nav for browse/manage.

**Screens:** Compose idle · Drag-over · Library drawer (populated) · Empty · Loading · Upload · Pick → attached / remove · Unsupported error · Discoverability note

**Tradeoff:** Library is one click from compose (high reuse) without making compose chrome heavier. Dedicated page is secondary for manage. Best default for advisor desktop Post Now.

---

## Direction B — Full My Media page + Choose from library

**Thesis:** First-class **My Media Library** nav page (browse, upload, empty/loading/error). On compose, media toolbar has **Choose from library** (opens picker) + existing upload icon. Drag-drop discoverability via one-time coachmark / tooltip on media icon (“You can also drop files here”). No permanent drop zone.

**Screens:** Same must-haves; library-as-page is the hero; coachmark for discoverability

**Tradeoff:** Clearer browse/manage destination; pick path is one extra mental hop from compose vs drawer. Good if library grows into a first-class asset home.

---

## Direction C — Compact media rail on compose

**Thesis:** Compose shows a **compact horizontal media rail** (recent thumbs + “+ Upload” + “Library”) always visible but small — NOT a giant drop zone. Drag-over expands to full overlay. Library browse is the same rail → “See all” full picker. Emphasizes reuse without a separate nav destination as the main path.

**Screens:** Same must-haves; rail idle vs drag-expand vs See-all picker

**Tradeoff:** Highest always-on reuse affordance; risks chrome density on compose. Still respects #162 (rail ≠ giant drop zone).

---

## Before → after (plain words)

| Today | After (any direction, once locked) |
|---|---|
| Drag-drop shipped (#153/#162) but library idea missing | Advisors browse / reuse prior uploads |
| Media mainly via icon/picker + drag while dragging | Explicit pick-from-library + optional discoverability hint |
| Unclear if staging drag-drop is findable | Open Q called out; polish ≠ reinvent #153 |

---

## Clickable in mocks

- Direction step chips between must-have screens  
- Primary CTAs open drawer / picker / attach / remove  
- Simulated drag-over and unsupported-type error  
- Optional toast for upload / attach stubs  

---

## Recommendation

**Ship Direction A as working default** for playground demos until Alex/Angelina lock. Keep B and C as comparison (page-first vs rail-first). Flag NG DAM and #162 constraint on hub + contract.

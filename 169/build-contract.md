# Build contract — Website services scan results (#169)

**Audience:** Software developer  
**Direction:** A — Dense table (approved mock path once Alex/Angelina pick)  
**Mock:** `/workspace/fc-scan-169/mock-a/` · Pages hub: `pages-root/`

---

## One-liner

Replace free-text comma tags + vague **Confirmed** with editable **Name**, **allowlist-only** multi-select chip tags, and a clear **Use for suggestions** toggle so scanned services become durable drivers of HTML Post matching.

---

## Screens / routes

| Screen | Route / entry | Notes |
|--------|---------------|--------|
| Scan results panel | Manage Advisor Posts → Pick for me → **Scan website for services** (results) | Primary surface — dense table in admin shell |
| Mobile / narrow | Same panel ≤640px | Horizontal scroll table **or** stacked card fallback with identical controls |
| (Out of scope UI) | Master Categories admin | Do not rewrite |

Mock files:

- `index.html` — desktop dense table in FC shell  
- `mobile.html` — phone-frame stacked layout  
- Empty-state toggle (demo only)

---

## Interaction rules

### Name
- Editable text input per row (websites phrase services oddly).
- Persist on blur/change; empty revert to previous value.

### Tags — allowlist only
- **Primary control:** multi-select chip picker from HTML Post / Master Category allowlist.
- **No free-text invent** as primary UX (do not ship a TextField that accepts arbitrary comma strings).
- Selected chips show × remove.
- Empty cell: dashed **Pick tags…** CTA opens searchable allowlist popover.
- **+ Add** opens same popover when chips already exist.
- Popover: filter-as-you-type; options only from allowlist; no “create tag”.
- **Suggested** tags (from scan/mapper): shown subtly (dashed / amber); click adds if not selected and tag ∈ allowlist.
- Demo allowlist: `life insurance`, `family`, `business`, `annuities`, `critical illness`, `disability`, `retirement`, `estate planning`, `investments`.

### Use for suggestions
- Toggle/switch replaces **Confirmed**.
- Copy must make intent clear: this service participates in Pick-for-me / HTML Post suggestion matching.
- Optional toolbar: **Select all Use** / **Clear Use**.
- Rows with Use off may be visually muted but remain editable.

### Toolbar / persistence
- **Save services** → persist durable services; success toast (mock: localStorage optional).
- **Re-scan** → stub / existing scan pipeline; confirm overwrite UX separately if needed.
- Row **Actions**: remove service from list (confirm).

---

## Mapping notes (backend / prompt — keep with UI)

Align `mapTagsToAllowlist` / extract prompt with richer multi-tag cases (follow-up to #52 / PR #143):

| Scanned service | Expected allowlist tags |
|-----------------|-------------------------|
| Annuities | Multi-tag (e.g. `annuities`, `retirement`) — not empty |
| Personal Life Insurance | `life insurance` + `family` (audience) |
| Corporate Life Insurance | `life insurance` + `business` |
| Critical Illness & Disability | Keep specific `critical illness` + `disability` from #52 work |

Scan may **suggest**; admin confirms via chips + Use toggle. Do not auto-publish without admin confirm.

---

## Replace

| Before | After |
|--------|--------|
| Free-text Tags TextField (`life insurance, family, …`) | Allowlist chip multi-select |
| **Confirmed** checkbox / green pill | **Use for suggestions** switch |
| Vague empty tags (Annuities) | Empty → Pick tags… + suggested chips |

---

## States to implement

| State | Behavior |
|-------|----------|
| Empty tags | Dashed Pick tags…; show suggested allowlist options subtly |
| Partial tags | Selected chips + suggested remainder + + Add |
| Full / confirmed tags | Chips match suggestions; Use on |
| Use off | Toggle off; row muted; still editable; excluded from suggestion matching |
| Empty list | Empty panel CTA to scan / no rows |
| Save success | Toast (and real persist in product) |

---

## In scope

- Results panel UI (Pick for me / Manage Advisor Posts scan flow)
- Allowlist multi-select wiring to existing Master Category / HTML post tag source
- Mapper / extract improvements for multi-tag + empty-tag cases above
- Rename Confirmed → Use for suggestions (copy + semantics)
- Galaxy memory-safe: no MasterCategories seed/harvest at boot (see PR #143)

## Out of scope

- Full MasterCategories admin rewrite
- Auto-publish without admin confirm
- Inventing taxonomy outside allowlist in this panel
- Directions B/C productization unless separately chosen

---

## Mobile notes

- **≥641px:** dense table — columns: Use for suggestions | Name | Tags | Actions.
- **≤640px:** prefer stacked cards with same controls (Name, chips, Use toggle, remove) **or** horizontal scroll table if engineering prefers one DOM.
- Touch targets ≥40px for switches and chip remove.
- Dropdown/popover should flip up near viewport bottom; close on outside tap / Escape.

---

## Acceptance smoke (mock + product)

1. Edit a service **Name** — value sticks after blur.  
2. On **Annuities**, open Pick tags…, add `annuities` / `retirement` from allowlist; remove with ×.  
3. Cannot add a free-typed invented tag.  
4. Toggle **Use for suggestions** on/off.  
5. **Save services** shows success toast (product: durable write).  

Do not git push from this mock package.

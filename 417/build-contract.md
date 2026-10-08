# Build contract · #417 Advisor media library: list uploaded media with copyable links

**PROVISIONAL.** One recommended direction (A), plus an optional staff add-on (B). **Alex has not picked.**

**Soft Dev hold · Designer-first · not agent-ready.** Software developer not woken. Do **not** mark `agent-ready`. No content-library / Meteor / Galaxy work until Alex picks and the Pages URL is on the issue.

- Issue: https://github.com/kartboy16/content-library/issues/417
- Reporter: Alana Read (#fc-bugs `1791482727.307279`): uploading WWF advisors' headshots and has nowhere to see them or grab the final links.
- Related: #260 (My Media Library), #400 (Infographic library). **One shared per-advisor library, not a third screen.**

## Mocks
- Hub: https://kartboy16.github.io/fc-mocks/417/
- Direction A (recommended): https://kartboy16.github.io/fc-mocks/417/directions/a/
- Direction B (staff add-on, optional): https://kartboy16.github.io/fc-mocks/417/directions/b/
- This contract: https://kartboy16.github.io/fc-mocks/417/build-contract.html

## Recommend: Direction A
Add a link and a **Copy link** button to every file in the #260 **My Media** library. Headshots are listed first. Staff open any advisor's library from **Manage Advisors → Media** and use **Copy all links**. Every upload (library, Settings → Branding headshot/logo, staff editing an advisor) shows the final link with Copy right away and lands in the library.

Direction B (firm headshot sheet: one row per advisor at a firm, batch upload matched by file name) is a later add-on for batch jobs like WWF. It reads from the same library. It is not needed for v1.

## Surfaces
| Surface | Who | What changes |
|---|---|---|
| **My Media** page (#260 nav item) | Advisor | Rows with thumbnail, file name, type, upload date, size/format, link field + Copy link, ⋯ menu (Open, Replace, Use as profile headshot, Delete). Tabs: All · Headshots · Logos · Infographics · Social images & video · Email images. |
| **Manage Advisors → [advisor] → Media** | Staff/admin only | Same page plus an advisor picker, **Upload for [first name]**, **Copy all N links** (respects current tab and search) and an "Include file names" option. |
| **Settings → Branding** headshot and logo (`AdvisorConfigManager`), admin **AdminUserEdit** | Advisor / staff | After upload: "Link to this headshot" + Copy link + "See all files in My Media". |
| **#260 compose drawer** | Advisor | Same files. Tile menu gains "Copy link". |
| **#400 Infographics manage** | Advisor | Becomes the Infographics tab of My Media (branding and insert extras stay). |
| *(B, optional)* **Admin → Firms → [firm] → Headshots** | Staff only | One row per advisor with current headshot link + Copy; Copy all (name, link); batch upload with match-by-file-name. |

## Data shown per file
Thumbnail · file name · type (Headshot / Logo / Infographic / Social image / Social video / Email image) · upload date · size · format · "In use on profile" badge · full public link · where it came from (Infographics / Social / Email).

**Sort:** headshots first, then everything else newest first. Search filters by file name.

## Links (verified pattern in code)
- Format today: `https://financialcontent.ca/ufs/mediaLibrary/{fileId}/{filename}` (`uploadAdvisorMedia` in `server/user-methods.js`, and `server/images-methods.js`). The IDs in the mock are fake.
- Headshots and logos uploaded via `uploadAdvisorMedia` (`kind: 'photo' | 'companyLogo' | 'email'`) are saved to the file store with `metadata.ownerId` + `kind`, **but are not added to the `MediaLibrary` collection**. Builder: list from both (or write a `MediaLibrary` record on upload) so headshots show up. Map `kind: 'photo'` → Headshot, `companyLogo` → Logo.
- **Link stability today:** replacing a headshot uploads a new file and **deletes the old one** (`previousPath`). The link changes, and anything pasted elsewhere breaks. The mock warns about this in the Replace dialog. See open decision 1.
- Delete: link stops working (mock warns).
- AC-5: the builder must open a copied link in a browser on staging and confirm the image loads.

## Permissions
- **Advisor:** sees and copies only their own files. Single Copy link on each file. No advisor picker.
- **Staff/admin:** opens any advisor's library, uploads on their behalf (`uploadAdvisorMedia` already accepts `targetAdvisorId` for admins), Copy all links.
- Copy all is **staff-only in the mock** (open decision 2).

## Copy behaviour
- Copy link → `navigator.clipboard.writeText`, fall back to a hidden textarea + `execCommand('copy')`. If both fail, select the link field and say "Press Ctrl+C (or ⌘C)". The button shows "✓ Copied" for 2 s, plus a toast.
- Copy all → one link per line, in the order shown (headshots first). The button shows the count ("Copy all 7 links" / "✓ Copied 7"). "Include file names" changes each line to `filename<TAB>link` so it pastes into a spreadsheet as two columns.

## Upload states
- One file: green success panel with the link + Copy, and the new row highlighted "New" in the list.
- Several files: one row per file with link + Copy, **Copy all N new links**, and failed files listed with a plain reason ("This file type isn't supported. Save it as JPG or PNG and try again.") plus "Try the failed file again".
- Limits match today's code: images under 5 MB (`MAX_UPLOAD_SIZE_BYTES`). Video limits follow #260.

## Empty / loading / error
- Empty (advisor): "No files yet" + Upload your first file. Empty (staff): "[Name] has no files yet" + Upload for [Name].
- Loading: skeleton rows + "Loading files…"; Copy all disabled.
- Error: "We couldn't load these files. Your files are safe…" + Try again; Copy all disabled.

## Phone
Below ~640 px the side menu hides, rows stack (thumbnail + name, then a full-width link and a full-width Copy link button), tabs scroll sideways, and Copy all / Upload go full width. Use the "📱 Phone width" chip in the mock to preview.

## Acceptance criteria (provisional, refines the issue's AC-1..6)
- **AC-1:** My Media lists every file stored for the advisor, including headshots and logos from Settings/admin edit. Headshots first, then newest first. Shows thumbnail, file name, date.
- **AC-2:** Each file shows its full public link + Copy link with "✓ Copied" feedback and a clipboard fallback.
- **AC-3:** Staff reach any advisor's library from Manage Advisors → Media, and **Copy all links** copies one per line with a count (optional file names).
- **AC-4:** After any upload (library, Settings → Branding headshot/logo, admin advisor edit) the final link shows with Copy, and the file appears in the library.
- **AC-5:** Empty / loading / error states as above. A copied link opens the image in a browser (check on staging).
- **AC-6:** Same library as #260/#400: one data source, with tabs rather than separate screens.
- **AC-7:** Plain advisor copy. No store names or technical terms in the UI.

## Open decisions (for Alex / Alana)
1. **Link permanence on replace:** keep today's behaviour (Replace = new link, old one breaks; the mock warns about this), or keep the same link when replacing? A related option: a permanent "current headshot" link per advisor that always shows the latest photo.
2. **Bulk copy for advisors too?** The mock gives Copy all to staff only.
3. **Headshot: a type or a tag?** The mock treats it as a type (from `kind: 'photo'`), with a "What are these?" choice on upload. A tag would let one file be both a headshot and a social image.
4. **Staff uploading for an advisor:** the mock puts it in Manage Advisors → Media ("Upload for Priya"), and it already exists in admin Edit advisor → Branding. Is that the right home, and should a staff upload also **set** the advisor's profile headshot or only add it to the library?
5. **Group by firm (WWF):** is per-advisor enough for v1 (A), or should Direction B's firm headshot sheet (Copy all for a whole firm, batch upload matched by file name) be included now?
6. **Delete:** should we warn when a file is in use on the profile, or block deleting it?

## Non-goals
- Full DAM: folders, team permissions, tags management (v1).
- Changing #260 compose or #400 insert pickers beyond adding "Copy link".
- Live social/email/WP actions during verification.
- Agent-ready or waking Soft Dev before Alex picks. No auto-merge.
- Rows use fictional advisors only (Priya Desai, Marcus Lee, Daniel Okafor, Elena Rossi, Sofia Hart, Tomás Rivera, Grace Whitfield; firms Harbourview Wealth, Northgate Advisory).

## Test plan (after pick + staging build)
Staging (`financialcontent-staging.sandbox.galaxycloud.app`), as admin: upload a test headshot for a test advisor → link shown with Copy → library lists it first → Copy all on that advisor → paste and open one link and the image loads. Repeat as the advisor (own library only, no picker). No live social/email/WP.

## Status
Soft Dev **hold**. **Not agent-ready.** Waiting for Alex/Alana to pick A (± B) and answer the open decisions.

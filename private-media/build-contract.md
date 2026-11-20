# Private posts: featured image upload and a private "My media" library: build contract

**Status:** **Picked: Direction A (picker dialog) plus the My media page. Alex, Nov 19, 2026, 10:55 PM PT**, relayed by Chief of Staff. He accepted all seven proposed defaults (questions 1–7 are closed below). Direction B and Direction C are **not picked**. The build was handed to Software developer by Chief of Staff. Build scope and estimate: **A plus My media, 24–35 agent hours.**

**Risk: high.** This stores files that belong to one advisor and serves them back. A missed access check would show one advisor's images to another advisor, or make a private image guessable by URL. Same care as private posts (#964): build to staging, run pstack blast-radius and interrogate on the PR, then FC Tester on staging. Alex merges to main.

Mock hub: https://kartboy16.github.io/fc-mocks/private-media/

## Request
Alex, Nov 19, 2026, 10:35 PM PT: "When creating a new private post, the featured image needs to be an upload, not a link. Each user needs their own private media library separate from ours."

At 10:37 PM PT he answered "Yes, but keep it separate from #260/#417."

So:

- The featured image of a private post is **an upload, never a link**. There is no URL or link field anywhere: not in the editor, not in the dialog, not on the server.
- Each advisor gets **their own private media library, "My media"**, visible only to the owner, plus admins and support.
- It is **separate from the shared library**. It is its own mock and its own build. It does not reuse, merge with or depend on the #260 (My Media Library) or #417 (advisor media list with copyable links) directions.

Related: private posts #964 (hub https://kartboy16.github.io/fc-mocks/private-posts/, approved Direction A, a separate "My posts" section).

## Pick
**Direction A plus the My media page, picked by Alex on Nov 19, 2026 at 10:55 PM PT.** B and C are not picked and stay in the mocks for reference only. Do not build them.

## Recommendation (as presented, now picked)
**Direction A: an inline "Featured image" field plus a picker dialog with two tabs, "Upload from computer" and "My media".** It is the smallest build, it reads the same on desktop and as a full-screen sheet at 390, and the same grid component is reused by the optional My media page.

- **A (picked, with the My media page):** 21–30 agent hours. **24–35 h with the My media page.**
- **B, a side drawer picker (not picked):** 22–31 agent hours. 25–36 h with the page.
- **C, an upload-first dropzone with a recent-uploads strip (not picked):** 24–34 agent hours. 27–39 h with the page.

All three share the same server work and the same rules. They differ only in the editor and picker UI.

## The three directions
**A. Inline field + dialog (PICKED, Nov 19, 10:55 PM PT).** The editor's side panel has a "Featured image" field. "Choose image" opens a dialog with two tabs: Upload from computer (drag and drop, or browse) and My media (a paged grid). Pick one, then "Use this image". Once set, the field shows the thumbnail with Replace and Remove. Two clear sources, one place to look.

**B. Side drawer (not picked).** "Choose image" opens a drawer from the right. Upload is always at the top (a compact drop strip), and the My media grid sits right under it, with no tabs. Good for quick uploads, because you see your library the whole time. The grid is narrower (4 columns), so more pages.

**C. Upload-first dropzone (not picked).** The featured image sits above the title as a wide dropzone: drop or browse, with a strip of your 7 most recent uploads right under it (click one to use it), and "Browse all {71}" opening the full My media grid in a dialog. Fastest for a person who uploads a new photo each time. It takes the most room in the editor and the most build time.

## The My media page (picked, in scope)
A standalone "My media" page under My posts (`my-media.html`). It has upload, search, newest-first sort, a paged grid, a tile menu with "Delete from My media…", and "In use" tags. It is also where an admin or support viewer sees someone's library (see below). Alex picked the page together with Direction A. It is a separate line in the estimate (+3–5 h).

## Screens and states
Every scene below exists at desktop and with `&phone=1` for 390.

### Featured image field (in the editor)
- **Empty:** "No featured image yet. Upload one from your computer, or pick one from My media." with **Choose image** (A, B). C shows the dropzone instead.
- **Set:** thumbnail, file name, size, "from My media", **Replace**, **Remove**, and a line saying it is kept in the advisor's private My media and only shown to others once the post is published.
- **Removed:** toast "Featured image removed. It is still in My media." Remove never deletes the file.
- **No link field.** There is no "paste an image address" anywhere. A pasted URL is not accepted (see Server).

### Direction A: `a-dialog.html`
| Scene | Link (add `&phone=1` for 390) |
|---|---|
| Field: empty | `a-dialog.html?s=field-empty` |
| Field: set | `a-dialog.html?s=field-set` |
| Field: removed | `a-dialog.html?s=field-removed` |
| Upload tab | `a-dialog.html?s=dlg-upload` |
| Dragging a file | `a-dialog.html?s=dlg-drag` |
| Uploading | `a-dialog.html?s=dlg-uploading` |
| Error: too large | `a-dialog.html?s=dlg-err-large` |
| Error: wrong type | `a-dialog.html?s=dlg-err-type` |
| Error: too small | `a-dialog.html?s=dlg-err-dim` |
| Error: network | `a-dialog.html?s=dlg-err-net` |
| Error: library full | `a-dialog.html?s=dlg-err-full` |
| My media | `a-dialog.html?s=dlg-lib` |
| Selected | `a-dialog.html?s=dlg-selected` |
| Just uploaded | `a-dialog.html?s=dlg-uploaded` |
| Page 2 | `a-dialog.html?s=dlg-page2` |
| Search | `a-dialog.html?s=dlg-search` |
| Search: none | `a-dialog.html?s=dlg-search-none` |
| Loading | `a-dialog.html?s=dlg-loading` |
| Load error | `a-dialog.html?s=dlg-load-error` |
| Empty library | `a-dialog.html?s=dlg-empty` |
| Replace | `a-dialog.html?s=dlg-replace` |
| Support viewer | `a-dialog.html?s=dlg-support` |
| Delete: confirm | `a-dialog.html?s=del-confirm` |
| Delete: in use | `a-dialog.html?s=del-used` |
| Delete: error | `a-dialog.html?s=del-error` |
| Deleted | `a-dialog.html?s=deleted` |

### Direction B: `b-drawer.html`
| Scene | Link (add `&phone=1` for 390) |
|---|---|
| Field: empty | `b-drawer.html?s=field-empty` |
| Field: set | `b-drawer.html?s=field-set` |
| Field: removed | `b-drawer.html?s=field-removed` |
| Drawer | `b-drawer.html?s=drawer-upload` |
| Dragging a file | `b-drawer.html?s=drawer-drag` |
| Uploading | `b-drawer.html?s=drawer-uploading` |
| Error: too large | `b-drawer.html?s=drawer-err-large` |
| Error: wrong type | `b-drawer.html?s=drawer-err-type` |
| Error: too small | `b-drawer.html?s=drawer-err-dim` |
| Error: network | `b-drawer.html?s=drawer-err-net` |
| Error: library full | `b-drawer.html?s=drawer-err-full` |
| Selected | `b-drawer.html?s=drawer-selected` |
| Just uploaded | `b-drawer.html?s=drawer-uploaded` |
| Page 2 | `b-drawer.html?s=drawer-page2` |
| Search | `b-drawer.html?s=drawer-search` |
| Search: none | `b-drawer.html?s=drawer-search-none` |
| Loading | `b-drawer.html?s=drawer-loading` |
| Load error | `b-drawer.html?s=drawer-load-error` |
| Empty library | `b-drawer.html?s=drawer-empty` |
| Replace | `b-drawer.html?s=drawer-replace` |
| Support viewer | `b-drawer.html?s=drawer-support` |
| Delete: confirm | `b-drawer.html?s=del-confirm` |
| Delete: in use | `b-drawer.html?s=del-used` |
| Delete: error | `b-drawer.html?s=del-error` |
| Deleted | `b-drawer.html?s=deleted` |

### Direction C: `c-dropzone.html`
| Scene | Link (add `&phone=1` for 390) |
|---|---|
| Field: empty | `c-dropzone.html?s=field-empty` |
| Dragging a file | `c-dropzone.html?s=field-drag` |
| Uploading | `c-dropzone.html?s=field-uploading` |
| Error: too large | `c-dropzone.html?s=field-err-large` |
| Error: wrong type | `c-dropzone.html?s=field-err-type` |
| Error: too small | `c-dropzone.html?s=field-err-dim` |
| Error: network | `c-dropzone.html?s=field-err-net` |
| Error: library full | `c-dropzone.html?s=field-err-full` |
| Recent: loading | `c-dropzone.html?s=strip-loading` |
| Recent: error | `c-dropzone.html?s=strip-error` |
| Recent: none yet | `c-dropzone.html?s=strip-empty` |
| Field: set | `c-dropzone.html?s=field-set` |
| Field: removed | `c-dropzone.html?s=field-removed` |
| My media | `c-dropzone.html?s=browse-lib` |
| Selected | `c-dropzone.html?s=browse-selected` |
| Page 2 | `c-dropzone.html?s=browse-page2` |
| Search | `c-dropzone.html?s=browse-search` |
| Search: none | `c-dropzone.html?s=browse-search-none` |
| Loading | `c-dropzone.html?s=browse-loading` |
| Load error | `c-dropzone.html?s=browse-load-error` |
| Replace | `c-dropzone.html?s=browse-replace` |
| Support viewer | `c-dropzone.html?s=browse-support` |
| Delete: confirm | `c-dropzone.html?s=del-confirm` |
| Delete: in use | `c-dropzone.html?s=del-used` |
| Delete: error | `c-dropzone.html?s=del-error` |
| Deleted | `c-dropzone.html?s=deleted` |

### My media page: `my-media.html`
| Scene | Link (add `&phone=1` for 390) |
|---|---|
| My media | `my-media.html?s=lib` |
| Page 2 | `my-media.html?s=lib-page2` |
| Search | `my-media.html?s=lib-search` |
| Search: none | `my-media.html?s=lib-search-none` |
| Loading | `my-media.html?s=lib-loading` |
| Load error | `my-media.html?s=lib-load-error` |
| Empty | `my-media.html?s=lib-empty` |
| Dragging a file | `my-media.html?s=lib-drag` |
| Uploading | `my-media.html?s=lib-uploading` |
| Error: too large | `my-media.html?s=lib-err-large` |
| Error: wrong type | `my-media.html?s=lib-err-type` |
| Error: too small | `my-media.html?s=lib-err-dim` |
| Error: network | `my-media.html?s=lib-err-net` |
| Error: full | `my-media.html?s=lib-err-full` |
| Tile menu | `my-media.html?s=lib-menu` |
| Delete: confirm | `my-media.html?s=lib-delete` |
| Delete: in use | `my-media.html?s=lib-delete-used` |
| Delete: error | `my-media.html?s=lib-delete-error` |
| Deleted | `my-media.html?s=lib-deleted` |
| Support viewer | `my-media.html?s=lib-support` |
| Admin viewer | `my-media.html?s=lib-admin` |

## Behaviour
- **Two sources only:** Upload from computer (drag and drop plus browse) or pick from My media. The shared library is **not a tab** and is not shown. No link source.
- **Upload:** one or several files. Every upload is saved to My media first. The advisor then picks one. After an upload from the field, the new image is selected ("Just uploaded") so one click uses it.
- **Grid:** 24 per page, search by file name, sort Newest first (default; Oldest first and Name are listed in the sort control). The pager shows "1–24 of 71", Prev, page numbers, Next. At 390 it shows "Page 1 of 3".
- **Selecting:** click a tile. It gets a check and a blue outline. "Use this image" enables. Replace opens the same picker with the current image tagged "Current image".
- **Delete from My media:** the tile menu opens a confirm. If the image is used by any post, the confirm lists each post (title, status and what happens) and the button reads "Delete anyway". Emails already sent keep their copy.
- **Support or admin viewer:** a dark banner, "Viewing Jane Advisor's private media (Support)", with a Read only tag. Upload, Use and Delete are not shown. The banner reads "(Admin)" for an admin. Fixtures only: Sam Support, Pat Admin.
- **Mobile (390):** the dialog and the drawer become full-screen sheets. Tiles are 3 across (2 across on the My media page). The dropzone says "Choose a photo to upload" and drops the "drag" wording. Buttons stack to full width. In the editor the Featured image panel moves above the title.

## Copy
Placeholders are flagged: **[P]** means the wording or number needs Alex or legal.

| Where | Copy |
|---|---|
| Field title | Featured image |
| Field empty | No featured image yet. Upload one from your computer, or pick one from My media. |
| Button | Choose image |
| Lock pill | Private to you |
| Dialog title and sub | Featured image / For your private post "{post title}" |
| Dropzone | Drag an image here, or Browse your computer. Phone: Choose a photo to upload |
| Dropzone, drag over | Drop to upload to My media |
| Limits line **[P]** | JPG, PNG, WebP or GIF · up to 5 MB · at least 600 × 315 px |
| Library full **[P]** | You have 200 images, the most My media can hold. Delete some you no longer need, then upload again. |
| Too large | {file} is too large. It is 14.2 MB. The limit is 5 MB. Try a smaller copy. |
| Wrong type | {file} isn't an image. Use a JPG, PNG, WebP or GIF. |
| Too small | {file} is too small. It is 120 × 80 px. Use at least 600 × 315 px so it looks sharp on your post. |
| Network | {file} didn't upload. The connection dropped at 64%. Check your connection and try again. |
| Library load error | We couldn't load My media. Your images are safe. Check your connection and try again. |
| Library empty | No images in My media yet. Images you upload appear here. Only you can see them. |
| Search, none | No images match "{query}". Check the spelling, or search for part of the file name. |
| Delete, unused | Delete this image from My media? It will be removed for good. None of your posts use it. |
| Delete, in use | This image is used by {n} post(s). If you delete it: {title}, {status}. {effect} Emails you have already sent keep their copy of the image. |
| Delete, scheduled post **[P]** | It will be put on hold until you check it and schedule it again. |
| Delete, live post **[P]** | It loses its featured image on your website. |
| Delete error | Couldn't delete the image. Nothing was removed. Try again in a moment. |
| Viewer banner | Viewing Jane Advisor's private media (Support). Read only. |
| Page subtitle | Images you upload for your private posts. They are separate from the Content Library and are never shared with other advisors. |
| Remove toast | Featured image removed. It is still in My media. |

Legal has not reviewed any wording on the privacy line.

## In scope
- Featured image of **private posts** (#964) is an upload from the computer or a pick from the advisor's own My media.
- A per-advisor private library, "My media", with upload, search by file name, newest-first sort, paging, and delete.
- Access for the owner, plus admins and support (view only, decided: question 1).
- States: empty library, loading, load error, uploading with progress, upload errors (too large, wrong type, too small, network, library full), selected, set, removed, delete confirm and delete-in-use warning, viewer banner.
- The optional My media page.

## Out of scope
- **#260 (My Media Library) and #417 (advisor media list with copyable links).** No shared code path, no shared collection, no shared screens, no shared UI. Nothing here changes or waits on them.
- **Any link field or "copy link".** No URL input and no copyable image address anywhere, including the library.
- **The shared library.** It is not a tab or a source, and no image moves between it and My media.
- Video, PDFs and other files. Images only.
- Body images in the post editor (the toolbar picture button). Decided (question 5): not in this build.
- Editing images (crop, rotate, filters).
- Sharing My media with other advisors or a team.
- Existing private posts with a link-based image: none exist, because private posts are not built yet.

## Server notes
**Owner-only is enforced on the server in every method and route. The UI is never the control.**

### Storage and data
- **A new owner-scoped collection, `PrivateMedia`.** Fields: `_id` (random), `ownerId`, `createdAt`, `filename` (display name, sanitised), `mime` (sniffed, not trusted from the client), `bytes`, `width`, `height`, `sha256`, `storageKey`, `deletedAt`. A first-build alternative is a per-owner storage prefix (`private-media/<ownerId>/<id>`) with the same collection. Do the prefix too: it makes a bulk delete, an export and an audit one operation.
- **No new meaning for existing media code.** Do not add a flag to a shared media or infographic collection. A query on those can never return a private image.
- **Default deny at the collection layer.** `PrivateMedia` is reachable only through one module whose every query ANDs in `ownerId`. Raw collection access to it is a lint error. Add a test that fails if a new raw call appears.
- **The post holds a reference, not a URL.** For owner-only posts, `featuredImage` is `{ mediaId }`. `myPosts.create` and `myPosts.update` **reject a string or URL** for `featuredImage` and reject a `mediaId` that is not owned by the caller. That is how "no link field" is enforced server-side.
- **Content hash.** The featured image counts in `computePostContentHash` (decided for the Held feature). The hash uses `mediaId`. Media are immutable, so the id is enough. Changing, replacing or removing the image on a scheduled post holds it, as already decided.

### Upload (`privateMedia.upload`, one HTTP route)
- Authenticated owner only. A multipart upload, streamed to storage, with a hard byte cap enforced while streaming, not after.
- **Validate on the server:** type by reading the file's magic bytes (JPEG, PNG, WebP, GIF only; no SVG; the extension and the client mime are ignored), size (decided: 5 MB), dimensions (decided: min 600 × 315, max 8000 × 8000), pixel count (decompression-bomb guard), and a per-owner count cap (decided: 200).
- **Re-encode and strip metadata.** Remove EXIF, including GPS location. Advisors upload phone photos; location must never leave with them. Generate a thumbnail (about 320 px) and a post-size rendition at upload time.
- Return a typed error the UI can show: `too-large`, `wrong-type`, `too-small`, `library-full`, `network` is client-side. The error copy above is keyed to these.
- Rate-limit uploads per owner.
- A duplicate (same `sha256` for the same owner) returns the existing item instead of storing a second copy.

### Access checks (list, serve, delete)
| Action | Owner | Other advisor | Support | Admin | Signed-out |
|---|---|---|---|---|---|
| List | Own only | Never. Not found, never "not allowed". | Any advisor's, read only | Any advisor's, read only | No |
| Serve an image | Yes | No (404) | Yes | Yes | No |
| Upload | Yes | n/a | **No (decided)** | **No (decided)** | No |
| Delete | Yes | No (404) | **No (decided)** | **No (decided)** | No |

- Every method filters by `ownerId` **in the query**, not after. A wrong id returns not found, so existence is not revealed.
- **Impersonation.** `server/support-impersonation.js` makes `this.userId` the advisor. If support must be read only, the upload and delete methods must also check the impersonation flag and refuse. Otherwise a support session could delete the advisor's images. Add a test.
- Admin and support list through a separate method (`privateMedia.listForOwner(ownerId)`) that checks the caller's role and writes an access log line (who, which owner, when).

### Serving images without leaking them
- Files are never publicly listed and the storage path is never guessable.
- The picker thumbnails and the field preview load from a **signed URL**: `id`, an expiry (placeholder: 10 minutes) and an HMAC. The list method issues them only after the access check. An `<img>` tag cannot send a login header, so a signed URL is the simple way. The alternative is a cookie-checked route that re-runs the same access check on every request.
- Serve with `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`, `X-Robots-Tag: noindex`, and the stored sniffed type. Never serve SVG or HTML.
- **Publishing is the only way out.** When the owner publishes the post (website, email, social), the system writes a **published copy** of the post-size rendition under a random 128-bit token path, referenced by the published snapshot (as private posts already do for the page). The private original and the My media list stay owner-only. Images on client-facing pages may be served from the platform's shared image host, but there is no visible link and no branding on the page, the email or the social card.
- Taking the page down removes the published copy. An email already sent keeps its image, because it cannot be recalled.

### Lists
- `privateMedia.page({ limit, skip or cursor, q, sort })`: `limit` default 24, **max 48**, paging, and **field projection** to tile fields only (`_id`, `filename`, `createdAt`, `bytes`, `width`, `height`, `thumbUrl`, `usedCount`). Never return the storage key or the original URL in a list.
- Index `{ ownerId: 1, createdAt: -1 }`. Search is a case-insensitive prefix or contains match on `filename`, always scoped by `ownerId` (regex input escaped, length-capped).
- `privateMedia.count` for the "71 images" line and the pager.

### Delete, and delete when in use
- `privateMedia.usage(id)` returns the posts that use the image (title, status, a count, capped at 10). The confirm calls it. The usage check is a query on `featuredImage.mediaId`, indexed.
- **Decided by Alex (question 3): delete anyway, with the warning.** The server then, in one operation: soft-deletes the media (URLs 404 at once), clears `featuredImage` on each post that used it, **removes the published copy**, and recomputes each post's content hash. A scheduled post therefore becomes **Held** under the existing hold rule, with the existing once-per-hold email. A purge job removes the stored files after a short grace period (placeholder: 7 days) so an accidental delete can be fixed by support.
- Alternative: block the delete while a live or scheduled post uses the image. It is simpler and safer, and an advisor then has to swap the image first. Decided (question 3): not chosen. The default (allow with a warning) is what is built.
- Deleting a user (or their private posts) deletes their My media.

### Tests (must pass on staging before FC Tester)
- Owner can upload, list, serve and delete their own image.
- **Advisor B can never list, serve or delete advisor A's image**, by id, by search, by a guessed or reused signed URL, by an expired signed URL, or through the post methods. The response is the same as for a missing image.
- Support and admin can list and serve any advisor's images. Support and admin cannot upload or delete (decided). An impersonation session cannot upload or delete.
- A signed-out request to the list or serve route fails. A tampered or expired signature fails.
- `featuredImage` as a string or URL is rejected by create and update. A `mediaId` owned by someone else is rejected.
- Upload validation: wrong type with a renamed extension, SVG, a file over the byte cap (stops while streaming), too-small and too-large dimensions, a decompression bomb, the 200 cap, and a duplicate.
- EXIF and GPS are gone from the stored and published images.
- Lists respect `limit` (default 24, max 48), paging and projection (no storage key). Search is scoped to the owner.
- Delete when in use: the post loses the image, the published copy is gone, a scheduled post is Held with one email, the confirm lists the right posts.
- The image never appears in the shared library, Pick for me, search, the embed APIs or the public routes.
- The hash changes when the image is set, replaced or removed.
- UI (FC Tester): every scene above, at desktop and 390, including drag over, progress, each error, empty, loading, load error, paging, search, delete confirm and the viewer banner.

## White label
Fixtures only: Jane Advisor, Sam Support, Pat Admin, Your Firm Name, and files like team-photo.jpg. No firm name, no vendor name, no real client or advisor on any page. No link to the platform's own domain is visible anywhere in the mock, the picker or the library.

## Estimate (real agent hours: cloud agent build plus FC Tester time)
**Picked scope: Direction A plus the My media page = 24–35 agent hours.** The B and C columns are kept for reference only (not picked).

| Piece | A | B | C |
|---|---|---|---|
| Server: collection, upload route with validation and re-encode, list/serve/delete with access checks, signed URLs, published copy, in-use and delete rule, tests | 12–17 | 12–17 | 12–17 |
| Picker and field UI (all states, 390) | 5–7 | 6–8 | 7–10 |
| FC Tester on staging | 4–6 | 4–6 | 5–7 |
| **Total** | **21–30** | **22–31** | **24–34** |
| Optional My media page (grid reuse, viewer banner, delete, FC Tester) | +3–5 | +3–5 | +3–5 |
| **Total with the page** | **24–35** | **25–36** | **27–39** |

The server row is the risk. Do not cut its tests to hit a number.

## Decisions (all seven questions closed, Alex, Nov 19, 10:55 PM PT)
Alex accepted every proposed default.

1. **Support and admin: upload or delete in an advisor's My media?** **Decided: no. View only**, as mocked. The server refuses upload and delete for admin, support and impersonation sessions.
2. **Limits.** **Decided: JPG, PNG, WebP or GIF, up to 5 MB, at least 600 × 315 px, up to 200 images per advisor.** The copy flagged [P] for these limits is now final.
3. **Deleting an image that a post uses.** **Decided: allowed, with the warning as mocked.** The post loses the image, the published copy is removed, and a scheduled post goes **Held** (the existing hold rule and once-per-hold email).
4. **A live post whose image is deleted.** **Decided: it loses the image on the website too.** Emails already sent cannot be recalled.
5. **Body picture button in the post editor.** **Decided: it does not pick from My media in this build.** Featured image only.
6. **My media and the account.** **Decided: My media is deleted with the account.**
7. **Alt text.** **Decided: none for now.**

Nothing is left open.

Direction A plus My media page is picked. B and C are not picked. Software developer holds the build (handed over by Chief of Staff).

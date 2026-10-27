# #665 Up to 5 photos in one social post: build contract

Issue: [#665](https://github.com/kartboy16/content-library/issues/665). Related: #153 (drag-drop, shipped), #260 and #417 (media library). Mocks: [hub](index.html). **Not agent-ready. Soft Dev hold until Alex picks.**

## Today (from the code, read-only at `38b2983`)

- Social compose (`CreatePostFlow.jsx`) holds **one** `imageState`, or one `videoState`.
- `ComposeMediaDropZone` (#153) accepts a drop anywhere on the compose card. The overlay reads "Drop to attach" or "Drop to replace".
- `ComposeMediaToolbar` has "Add image" (Upload, My library, Stock photos) and "Add video".
- Images are JPEG, PNG, GIF or WebP (`composeMediaFiles.js`). The upload goes through `social.uploadImageToLibrary`, which stores files in GridFS with a **20MB** cap.
- Existing messages we reuse: "Please select a JPEG, PNG, GIF, or WebP image" and "Image must be under 20MB".
- Publishing:
  - Facebook: `/{page}/photos`, one photo.
  - Instagram: a single `image_url` container.
  - LinkedIn: legacy `ugcPosts` with `shareMediaCategory: IMAGE` for images (video already uses `/rest/posts`).
- FC connects **LinkedIn, Facebook and Instagram** today. There is no X.

## Recommendation: A, a photo strip in the existing composer

**[A](a-photo-strip.html):** the same compose card and the same #153 drop target, with a row of up to 5 thumbnails under the text.
- Drag to reorder (arrow buttons on phone). × removes a photo, and an "+ Add photos" tile sits at the end.
- A "3 of 5 photos" counter, with a "First" tag on photo 1.
- Short per-network notes under the strip, and the preview tabs (LinkedIn, Facebook, Instagram) show the layout for each network.
- It's the smallest change for advisors and keeps one screen.

**[B](b-gallery-step.html):** compose shows a small summary ("3 of 5 photos · Edit photos"). An "Arrange your photos" step has big tiles and a preview, then Done. It's roomier for reordering, but adds a step and hides the photos while you write.

**[C](c-per-network.html):** one photo pool, plus a checkbox per photo for each network. It gives the most control, but every post gets more complex, and approval has to show a different set for each network.

## Screens and states (`?st=`, plus `?phone`)

| State | What shows |
|---|---|
| `empty` | Drop zone: "**Drag photos here** or choose files". Up to 5 photos · JPEG, PNG, GIF or WebP · under 20MB each. |
| `filled` | 3 thumbnails, counter "3 of 5 photos · drag to change the order", per-network notes, preview. |
| `uploading` | Thumbnails with a progress bar. × is hidden while a photo uploads. |
| `error` | "**"statement.pdf" wasn't added.** Please select a JPEG, PNG, GIF, or WebP image." / "**"Big-banner.png" wasn't added.** Image must be under 20MB." Any good files in the same drop are still added. |
| `limit` | 5 of 5, and the Add tile reads "5 of 5 · Full". The 6th photo gets: "**You can add up to 5 photos to one post.** "Extra photo.jpg" wasn't added. Remove a photo to add a different one." Dropping several files at once: "We added 2. 1 more didn't fit…" |
| `mixed` | "**A post can have photos or one video, not both.** Remove the photos to add a video, or remove the video to keep your photos." |

The mock also has an `x=1` toggle (an X account connected, future) that shows how a network with a lower limit is handled:
- "**X** shows up to 4 photos. Photo 5 won't be posted on X."
- "Networks that only take one photo get **the first photo only**. We'll say so here before you post."

The mock's top bar can add 1 photo, drop 2 files, or drop a bad file plus a too-big file. Real files work too: pick or drop images from your computer.

### Copy

| Where | Text |
|---|---|
| Counter | "3 of 5 photos · drag to change the order" (on phone: "(or use the arrows)") |
| First tile | "First" tag (it leads the post, and Instagram crops the others to its shape) |
| LinkedIn / Facebook note | "LinkedIn and Facebook post all 3 photos together." |
| Instagram note | "Instagram posts them as a swipeable post. It crops every photo to the shape of the first one (square by default)." |
| Lower-limit network | "X shows up to 4 photos. Photo 5 won't be posted on X." |
| One-photo network | "Networks that only take one photo get the first photo only." |
| Remove | Toast: "Photo removed" |

No compliance or legal copy is involved. The approval email just shows all the photos.

## In and out of scope

- **In:**
  - Up to 5 images per post in create and edit (`ScheduledPostEditDialog` too): upload, drop, library and stock add to the strip.
  - Reorder and remove, the 6th-photo block, and the per-network preview.
  - Publish as one multi-photo post on FB, IG and LinkedIn.
  - Approval email and compliance views show all photos. Scheduled posts keep them all.
  - Single-image and video posts don't regress.
- **Out:**
  - Mixing a video with photos.
  - More than 5 photos.
  - Per-photo captions or alt text (an open question).
  - Cropping or editing tools.
  - Media library redesign (#260, #417).
  - X publishing (not connected today; the copy is ready for it).

## Mobile (390px)

- Tiles show 3 per row and keep their square shape.
- HTML5 drag doesn't work on touch, so each tile has ◀ ▶ move buttons. × stays at the top right with a 22px target (consider 32px).
- The preview stacks under the composer.
- B's "Arrange your photos" step has a sticky Cancel / Done bar.

## Build note

- **Data:** `images: [{fileId, url, thumbnailUrl, width, height, sizeBytes, mime}]`, ordered, max 5, on the draft and on `social_post_queue`.
  - Keep `imageState` (or `imageUrl`) as `images[0]` for older readers and the approval email until everything has moved over.
  - Validate the count server-side (`Meteor.Error('too-many-images')`), and reject images together with a video.
- **Upload:** reuse `social.uploadImageToLibrary` (GridFS, 20MB) once per file, running in parallel (2–3 at a time) with per-tile progress.
  - Drop handling reuses `ComposeMediaDropZone` and `bindComposeFormFileDrop`. Change "Drop to replace" to "Drop to add" when there's room, and treat a drop as "Full" at 5.
  - Reordering inside the strip must not trigger the file-drop overlay: check for `text/x-fc-photo`, not `Files`.
- **Facebook Page:**
  1. Upload each photo with `POST /{page-id}/photos` and `published=false` (add `temporary=true` if Facebook does the scheduling).
  2. Then `POST /{page-id}/feed` with `message` and `attached_media[i]={"media_fbid":…}`.
  - Unpublished photos expire after about 24 hours, so upload them at publish time, not at schedule time.
  - Video and photos can't be mixed. Meta's docs don't state a hard maximum; third-party docs say 10, which is above 5 (open question).
- **Instagram:**
  1. Create a container per image with `is_carousel_item=true` (`image_url` on a public URL).
  2. Create the parent with `media_type=CAROUSEL` and `children`.
  3. Publish with `media_publish`.
  - Limits: 2–10 items. Every item is cropped to the first item's aspect ratio (1:1 by default). A carousel counts as 1 of the 50 posts allowed per 24 hours.
  - Images must be ≤ 8MB (error 2207004) and in an allowed type. The code allows jpeg, png and gif for Instagram, so **WebP needs converting** to JPEG server-side. Anything over 8MB needs downscaling.
- **LinkedIn:**
  1. Images API `initializeUpload` per image, giving `urn:li:image:…`.
  2. `POST /rest/posts` with `content.multiImage.images[]` (2–20, organic only).
  - Supported formats are JPG, GIF and PNG, so **WebP needs converting**.
  - This means moving the image path off legacy `ugcPosts` onto `/rest/posts`. That's already done for video.
  - Check that it works for both organization and personal (member) authors.
- **X** (future, not connected): up to 4 images per post. Send the first 4 and show the notice.
- **One photo:** keep today's single-image calls. Multi-image paths only run for 2 or more.
- **Partial failure:** if one network fails, the others still post, and that network's status gets a retry (same as today). Don't silently fall back to one image.
- **Storage:** 5 × 20MB worst case per post in GridFS. Add cleanup for uploads removed before saving (an orphan sweep).

## Estimate (days)

| Piece | A | B | C |
|---|---|---|---|
| Data model, migration shim (`images[]` + `imageState`), server validation | 1 | 1 | 1.5 |
| Compose UI: strip or step, reorder (mouse and touch), remove, limit, errors, parallel upload | 1.5–2 | 2–2.5 | 2.5–3 |
| Per-network preview (grid, FB +N, IG carousel) and notes | 0.75–1 | 1 | 1.5 |
| Facebook multi-photo publish | 0.75–1 | 0.75–1 | 1 |
| Instagram carousel (containers, WebP/8MB convert) | 1–1.5 | 1–1.5 | 1–1.5 |
| LinkedIn multiImage (Images API, `/rest/posts` for images) | 1–1.5 | 1–1.5 | 1–1.5 |
| Edit-scheduled dialog, approval email, compliance view | 0.5–0.75 | 0.5–0.75 | 1–1.5 |
| QA (staging, draft only, no live posts) | 0.5 | 0.5 | 0.75 |
| **Total** | **≈7–9.25** | **≈7.75–9.75** | **≈10.25–12.25** |

## Open questions

1. Facebook Pages: what's the real maximum for `attached_media`? We need 5 (third-party docs say 10, and Meta's docs don't say). Verify on staging.
2. LinkedIn: does multiImage work for **personal** (member) posts as well as company pages, with our current scopes? Verify.
3. Instagram crops to the first photo's shape. Should we warn when shapes differ, or let advisors pick square vs portrait?
4. WebP and large files: convert silently on the server (suggested), or block at upload?
5. Is 5 a hard product limit? All 3 networks allow more (Instagram 10, LinkedIn 20).
6. Alt text per photo (LinkedIn, Facebook and Instagram support it): now, or later?
7. If a network rejects the multi-photo post at publish time, should it retry, post only the first photo, or fail that network and tell the advisor? (Suggested: fail with retry, and never silently drop photos.)
8. X: when it's connected later, confirm "first 4 photos plus a notice" is the behaviour Alex wants.
9. Should "My library" and "Stock photos" let you pick several at once (multi-select), or one at a time into the strip?
10. Approval email: show all photos in a row, or the first one plus "+2 more"?

# #520 / #521 Trash: view a trashed post — build contract

**Status:** Not agent-ready. Soft Dev hold until Alex picks a direction.
**Recommended:** A (side drawer). B and C are alternatives.

## Who
Admins only. The Open Trash button, the list, View and Restore are all admin-only and checked on the server.

## What the admin sees
- Trash list (existing `HTMLPostsTrashDialog`): each row shows title, "Deleted <date/time PT> by <name>", "Removed for good <date>", plus **View** and **Restore**.
- **View** opens a read-only preview: "In Trash · read-only" tag, title, deleted by/when, removed-for-good date, rendered body, and a **Restore to library** button. A: right-side drawer over the list. B: near full-screen window. C: expands under the row.
- Header copy: "Deleted posts are kept for 60 days, then removed for good." (use the real `retentionDays`).

## States
- **Empty:** "Trash is empty. Deleted posts show up here for 60 days, then they're removed for good."
- **List failed:** "We couldn't load Trash." + Try again.
- **Preview failed:** "We couldn't load this post's preview. You can still restore it." + Try again; Restore stays available.
- **Restore failed:** inline error inside the view, view stays open: "Restore didn't work. Please try again."
- **Already gone** (restored by someone else or purged; server `post-not-found`): "This post is no longer in Trash. It may have been restored by someone else or removed for good." Hide Restore; refresh list.
- **After restore:** close the view, remove the row, call `onRestored`, snackbar "Restored "<title>" to the library." with **Open post** link. Post returns to the library with original visibility (isPublic / privateToUserId untouched).

## Server (required)
1. **New method `HTMLPosts.getTrashed(postId)`** — admin-only (`assertTrashAdmin`), `check(postId, String)`, finds `{_id, trashedAt: {$ne: null}}` with `includeTrashed: true`, returns `name, content` (plus legacy cells/html fields the normal preview uses), `trashedAt, trashedBy, createdBy, privateToUserId, isPublic`, and computed `purgeAt`. Throw `post-not-found` if not trashed. `listTrash` stays body-free.
2. **`purgeAt`**: add to `listTrash` rows and `getTrashed`: `trashedAt + retentionDays`, shown as the date of the first daily 03:17 (server time) run after that (purge selector is strictly-before cutoff). Show date only.
3. **`trashedBy` name**: list returns a user id only. Resolve to display name server-side (admin-only), or show "an admin"/"the advisor". Keep it in the method, not a client lookup of all users.
4. **Sanitize the body.** Existing previews use `dangerouslySetInnerHTML` with no sanitizer. Trashed preview must either sanitize (DOMPurify/sanitize-html allowlist: no script, on* handlers, javascript: URLs, iframes/forms) **or** render in a sandboxed `<iframe sandbox srcdoc>` with no `allow-scripts`/`allow-same-origin`. Preview also must not fire tracking pixels/embeds (block remote scripts).
5. Restore stays `HTMLPosts.restore` (already admin-only). Leave `trashHtmlPost` owner-or-admin rules as is.

## Tests
- Non-admin calling `getTrashed`/`listTrash`/`restore` → `not-authorized`.
- `getTrashed` on non-trashed or purged id → `post-not-found`.
- Script/onerror in body does not execute in preview.
- Restore from inside the view removes row, refreshes library, snackbar shown.
- purgeAt = trashedAt + retentionDays respects settings clamp (1–365, default 60).

## Open questions for Alex
1. Pick A, B or C.
2. Show who deleted it by name, or keep generic?
3. Add "Delete forever now" in the view? (Not in scope; not mocked.)
4. Should the list warn on posts purging within 3 days (highlight)?
5. Show where the post was used (scheduled/sent) in the view? Not mocked.

## Effort
~1–1.5 dev days: method + purgeAt + name ~0.5d, drawer UI + states ~0.5d, sanitizer + tests ~0.25–0.5d. B similar; C slightly less UI.

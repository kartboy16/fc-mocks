# Build contract · content-library #237

**Working direction: A — Checklist modal + amber callout**  
(Alex has not formally locked; Designer recommendation / concept-mock alignment. Revisit if he picks B or C.)

**Mocks:** https://kartboy16.github.io/fc-mocks/237/directions/a/  
**Issue:** https://github.com/kartboy16/content-library/issues/237

## Audience (hard)

Show reminders **only** when:
- session is a true **admin**, or
- **admin logged in as a user** (impersonation).

**Never** show to regular users (including self-serve Facebook connect).

## Placements (both required)

### A — Pre-Meta gate

**When:** Admin / admin-as-user clicks account-card **Reconnect** (or renewal path about to redirect to Meta) for a shared / admin-refresh Facebook token.

**Where:** Modal before `getFacebookAuthorizationURL` redirect. Do **not** open OAuth until primary CTA.

**Chrome / copy (new):**
- Badge: `Admin only`
- Title: `Before you continue to Facebook`
- Checklist:
  1. On Facebook’s Pages screen, select **ALL Pages** this token needs — not just one company Page.
  2. Accept **every permission** Meta asks for.
  3. Back here, choose **only** the Page(s) this account should post to.
- Amber warning: `Selecting only one Page on Facebook often breaks posting for shared admin tokens.`
- Primary: `Continue to Facebook` (new CTA — not in app today; issue-specified)
- Secondary: `Cancel`

**Existing entry labels to hook (do not rename):** `Reconnect`, `Add Facebook Account`, renewal `Reconnect Facebook` / `Redirecting to Facebook…`  
Source: `imports/ui/SocialSettings.jsx`, `imports/ui/RenewSocialLanding.jsx`

### B — FC Page destination picker callout

**When:** Admin / admin-as-user on Facebook destination picker after connect/refresh (and on **Edit Destinations** when editing after an admin refresh — same callout).

**Where:** Inside existing picker dialogs:
- Post-OAuth / configure: title `Almost done — choose where to post` (`SocialSettings.jsx` / `RenewSocialDone.jsx`)
- Edit Destinations: title `Configure Facebook Posting Preferences` (live staging)

**Callout copy:**
- Strong: `On Facebook you selected all Pages for this token.`
- Body: `Here, pick only the Page(s) this advisor should post to.`
- Helper: `Meta grant is broad · FC destinations are narrow`

**Keep existing picker chrome:** `Select which Facebook pages you'd like to post to when sharing content`, `Editing account: …`, `Facebook account` selector, `SocialAssetPickerList` rows, `Save Preferences` / `I'll finish later` / renewal `Save destinations`.

Source: `imports/ui/SocialSettings.jsx`, `imports/ui/social-settings/SocialAssetPickerList.jsx`, `imports/ui/RenewSocialDone.jsx`

## States

| State | Behavior |
|-------|----------|
| Admin / admin-as-user · Reconnect shared token | Show gate A before OAuth |
| Admin / admin-as-user · post-OAuth / Edit Destinations | Show callout B |
| Regular user · connect / reconnect / picker | No A, no B |
| Empty pages list | Existing empty copy; still show B for admin audience if picker is shown |
| Loading / Saving | Existing `Saving...`; callout stays visible |

## In scope

- Visibility gates for A and B
- Copy + amber styling consistent with FC warn tokens
- Wire Continue to Facebook → existing OAuth URL helper

## Out of scope (issue optional follow-up)

- Fail-connect if `/me/accounts` missing needed Pages / perms
- Mapping Graph impersonation errors to this reconnect guidance (can reuse same copy later)

## Acceptance (from issue)

- [ ] Reminder A only for admin or admin-as-user before Facebook OAuth on reconnect/refresh of shared token
- [ ] Reminder B only for admin or admin-as-user on FC Page destination picker after connect/refresh
- [ ] Regular users never see A or B
- [ ] Copy matches Meta-all / FC-narrow rule
- [ ] Mocks published under fc-mocks/237 (done)

## Handoff notes for Software developer

Primary files: `SocialSettings.jsx`, `RenewSocialLanding.jsx`, `RenewSocialDone.jsx`, `server/oauth-social.js` (redirect only — no scope change).  
Admin detection: mirror existing `userRoles.isAdmin` / support-impersonation patterns used for `Send refresh email`.

# #547 Admin: Add user (build contract)

Recommended: Direction A (step-by-step wizard, save and leave at any step), with "Copy settings from another advisor at the firm" and "Prefill from website" on the Account step.

## Surfaces
- Admin users list (`imports/ui/AdminUserList.jsx`): **+ Add user** button; status column Draft (not invited) / Invited / Invite bounced / Active; setup "n of 7".
- New wizard route `/content-library/admin/users/new` and `/admin/users/:id/setup` (reuses field components from `AdminUserEdit.jsx`, `SESSettings.jsx`).
- Invite preview + advisor first-login "ready" screen (hooks into #155 walkthrough).

## Who owns what
| Section | Admin can finish | Advisor-owned |
|---|---|---|
| Account | name, email, firm, plan | password (set via invite link) |
| Section access | all | none |
| Profile & branding | all (media library #417) | none |
| Compliance | disclaimer, officer, approval mode (#415/#416) | none |
| Email | sender name, from email, footer, approvers, default list (#387), start domain verification | DNS records, unless FTT manages the domain |
| Social | send / resend connect link, see status | OAuth sign-in for LinkedIn / Facebook / Instagram |

## Data / methods
| Field | Store | Exists? |
|---|---|---|
| user, email, profile.name | `Meteor.users` | yes; but no admin create method. Only self-signup `Accounts.createUser` in `imports/ui/LoginPage.jsx:275`. **Build** `admin.createAdvisorDraft` (server `Accounts.createUser` with no password, `profile.setupStatus='draft'`). |
| sectionAccess | user doc, edited from AdminUserList section-access modal | yes |
| profile/branding/details | `advisorPreferences` (`imports/collections/advisor_preferences.js`) via `admin.updateAdvisorDetails` (`server/admin-methods.js:732`) | yes, extend |
| social approval | `admin.setAdvisorSocialApproval` | yes |
| fromName | `ses.updateFromSettings` (SESSettings.jsx:316) | yes, admin path needed |
| domain verification | `ses.verifyDomainIdentity` in `server/ses-campaign-service.js:272` | yes; needs admin-callable status + "check again" |
| social tokens | `AdvisorSocialTokens`, `server/oauth-social.js` | connect exists; **build** connect-link (signed, single-use, expiring token) |
| invite | `admin.sendLoginInvite` (`server/admin-methods.js:642`) uses reset-password token | yes; add "only after finish", bounce state, resend |
| setup checklist / audit | none | **build** `advisorSetup` record + audit log |

## Server-side checks
- All `admin.*` setup methods: `isAdmin(this.userId)` (as `sendLoginInvite` already does).
- No invite until `finishSetup` called, or an explicit "send anyway" with reason logged.
- Audit log: who set which field, when, old/new value (admin-set vs advisor-set flag so #155/#156 never overwrite admin values).
- Draft users cannot log in and are excluded from billing until invited/active (open question).
- Connect link: random token bound to userId + provider, 7-day expiry, single use; OAuth runs in the advisor's own browser.
- Fix found: OAuth `state` is the raw userId (`server/oauth-social.js:984,1005`), so it can be forged; use a signed nonce before shipping connect links.
- Fix found: `sendLoginInvite` logs the full reset URL to the server console, and lets you send to a recipient other than the account email. Remove the URL log; limit recipients.

## #155 / #156 interaction
- #156 lookup offered to Admin as "Prefill from website"; if used, advisor first login skips the lookup.
- #155 walkthrough reads the setup record and skips completed steps; shows only advisor-owned leftovers (social connect, DNS).
- Alex's automatic onboarding canvas: Admin wizard is the same confirm-card data, filled by staff instead of on day one.

## Open questions
1. Who can add users: all admins or a new "onboarding" role?
2. Is plan/billing set here or in Billing; do draft users count toward billing?
3. Invite bounce: show "Invite bounced" with fix-email + resend?
4. Can admin connect social for the advisor? Assumed no (OAuth must be the owner).
5. Domain DNS: FTT-managed domains vs advisor IT; who is notified?
6. Impersonation vs direct edit for later changes?
7. Copy-from-advisor: which fields copy (branding, disclaimer, approvers) and which never (email, name, social)?

## Effort
About 6 to 9 days: create-draft method + setup record + audit (2–3), wizard UI reusing existing fields (2–3), connect link + OAuth state fix (1–2), first-login/#155 skip + list states (1).

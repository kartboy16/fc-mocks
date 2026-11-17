# #869 Blocked send when the sending domain isn’t verified (also #900)

**Status:** Not agent-ready. Soft Dev hold until a direction is picked.

**Risk:** high — this is the email send and schedule path in `CreateCampaign.jsx` and `SESCampaignsList.jsx`, and it also changes the From-policy behaviour described in #900.

## Sources (read-only)
- Issues [#869](https://github.com/kartboy16/content-library/issues/869) and [#900](https://github.com/kartboy16/content-library/issues/900)
- Product rule from Alex (Nov 16, 2026, 6:48–6:51 PM PT): if the advisor’s custom sending domain isn’t verified, hard-block the send. Do not fall back to a default platform sender. Nothing is sent or queued. The campaign stays as it was (draft, or already scheduled). UI wording waits on this mock.
- Live bug on #869: `performSend` in `imports/ui/EmailCampaigns/CreateCampaign.jsx` catches `domain-not-verified`, shows a `window.confirm` offering a default sender, then calls `ses.updateCampaign(advisorId, id, …)` with `id` declared inside the `try`, so the advisor sees **id is not defined**. The campaign stays a draft. The same confirm exists in `SESCampaignsList.jsx` `handleSendCampaign` (that path uses `campaignId`, which is in scope).
- Live Settings: `imports/ui/EmailCampaigns/SESSettings.jsx` — Email Campaigns → Settings tab, “Email Campaign From Settings” and “Custom domain”. Today the Settings tab cannot be deep-linked; this work adds a link such as `?tab=settings`.
- #900 (merged) resolved the From at send time and, at that time, fell back to the platform default when a custom domain was unverified. This hard-block UI, plus a matching server change, replaces that fallback. Don’t ship the UI while the server still sends from the default.

## Recommendation
**A. A hard-block dialog at Send or Schedule, plus a short unverified-domain hint on Create Campaign. 14–24 h.** This is the first slice. The advisor can still click Send or Schedule (and the list row actions still work). Instead of a confirm, they get a clear dialog: the domain isn’t verified, it must be verified before sending, nothing went out, and the campaign stays a draft — or an already-scheduled campaign keeps its existing schedule, and a newly picked schedule is not saved. Primary **Verify your domain** opens Email Campaigns → Settings. Secondary **Get help setting up your domain** opens a mailto to support@financialtechtools.ca, prefilled with firm name and domain. A compact hint on the Create Campaign form (not a disabled button) lets them see the problem before they click. Same dialog from the list.

**B (16–26 h)** shows a blocking banner on Create Campaign and on the campaigns list, and disables Send / Schedule (and the list Send action) with a reason. Same two actions on the banner. This needs a verified-domain pre-check on load, not only a catch at send time, and the disabled list action is easier to miss.

**C (18–30 h)** opens a pre-flight checklist when the advisor clicks Send or Schedule. Name, subject, audience, and From pass; Sending domain fails and blocks Continue. Same two actions and the same campaign-state copy. Heavier than a two-action block needs — don’t build this first.

## Hard-block rules (all directions)
- The send is hard-blocked. Nothing is sent, queued, or scheduled, and nothing goes from financialcontent.ca. There is no “use default sender” confirm, dialog, or button on the Send / Schedule path.
- Remove the current `window.confirm` default-sender fallback in `CreateCampaign.jsx` `performSend` and `SESCampaignsList.jsx` `handleSendCampaign`, and any retry that updates From and calls `ses.sendCampaign` again.
- The server must refuse the same way (including scheduled, cool-down, recurring, and resend paths from #900). Do not keep a default-sender fallback on the server after this UI ships.
- Show the block from both **Send** and **Schedule**, in **Create Campaign** and in the **campaigns list** row action (Send immediately / Send later).
- Campaign state: a draft stays a draft (Send does not send; Schedule does not save the date). An already-scheduled campaign keeps its existing scheduled time; a send-now or reschedule attempt does not change it.
- Save Draft, Send Test, and Cancel stay available. This mock does not change Send Test policy; call out in the PR if test sends should also be blocked.
- Advisor-facing copy never offers a default platform sender and never names that platform domain.

## Screens
| Screen | Direction | Notes |
| --- | --- | --- |
| Today, Create Campaign Send / Schedule | — | Native confirm offering a default sender. On OK, Create Campaign shows **id is not defined**. Campaign stays a draft. |
| Today, campaigns list Send / Schedule | — | Same confirm on the list row action. |
| Create Campaign Send | A, B, C | Draft “November market notes”, From jane.advisor@yourfirm.com. A/C: action then block. B: banner, buttons disabled. A also has a non-blocking hint. |
| Create Campaign Schedule | A, B, C | Date picked (Thu, Nov 20, 2026, 9:00 AM PT) is not saved. Stays a draft. |
| Campaigns list Send | A, B, C | Row action “Send immediately” on the draft. |
| Campaigns list Schedule | A, B, C | “Send later” then the date; schedule is not saved; stays a draft. |
| Already scheduled | A, C | “Year-end planning tips” stays scheduled for Thursday, Nov 20, 2026, 9:00 AM PT. |
| Settings | A, B, C | Email Campaigns → Settings, Custom domain, yourfirm.com not verified, Check Status, DNS records. Landed from **Verify your domain**. |
| Help email | A, B, C | mailto to support@financialtechtools.ca, prefilled with Your Firm Name and yourfirm.com. |
| 390 | A, B, C | Full-screen editor, bottom sheet for the dialog / checklist, 44px targets, stacked actions. |

## States
Unverified domain (the blocking state), draft stays draft, schedule not saved, already-scheduled unchanged, Settings (unverified domain + DNS), help email compose, Today confirm + Create Campaign error. Out of scope for this mock: verified-domain success path, loading/error on Check Status (already in Settings).

## Copy
- Title: **Your domain isn’t verified**
- Send (draft): “yourfirm.com isn’t verified yet, so this campaign can’t be sent.”
- Schedule (draft): “yourfirm.com isn’t verified yet, so this campaign can’t be scheduled.”
- Already scheduled: “yourfirm.com isn’t verified yet, so this campaign can’t be sent or rescheduled.”
- Pointer: “Verify yourfirm.com in Email Campaigns → Settings before you send.” (use “before you schedule” on the Schedule path)
- State, Send: “This campaign stays a draft. Nothing has been sent.”
- State, Schedule: “This campaign stays a draft. The date and time you chose were not saved.”
- State, already scheduled: “This campaign is still scheduled for Thursday, Nov 20, 2026, 9:00 AM PT. Nothing was sent, and the schedule was not changed.”
- Primary: **Verify your domain**
- Secondary: **Get help setting up your domain**
- Dismiss: **Close**
- A hint on Create Campaign: “yourfirm.com isn’t verified yet. You can save this draft, but you can’t send or schedule until the domain is verified.”
- B banner / disabled reason: “yourfirm.com isn’t verified yet. Send and Schedule are unavailable until the domain is verified.”
- Settings: “yourfirm.com is not verified yet. Add the DNS records below, then click Check Status. You can’t send or schedule campaigns until this domain is verified.”
- Mailto To: support@financialtechtools.ca
- Mailto Subject: `Help verifying a custom sending domain — Your Firm Name`
- Mailto Body:

```
Hello,

Please help me set up and verify a custom sending domain.

Firm: Your Firm Name
Domain: yourfirm.com
Advisor: Jane Advisor

Thank you.
```

Fixtures: Jane Advisor, Your Firm Name, yourfirm.com, jane.advisor@yourfirm.com, All subscribers (248). Campaigns: **November market notes** (Draft), **Year-end planning tips** (Scheduled), **October newsletter** (Sent). No estimates or explainer prose in the mock UI (hub and contract only).

## In / out of scope
**In:** hard-block dialog (A) or disabled Send/Schedule + banner (B) or pre-flight checklist (C); both Send and Schedule; Create Campaign and the campaigns list; campaign stays draft or keeps its existing schedule; **Verify your domain** → Settings tab deep link (`?tab=settings` or equivalent); mailto with prefilled firm and domain; remove the default-sender confirm and retry on both call sites; matching server refusal on every send path (immediate, scheduled, cool-down, recurring, resend) so nothing goes out from the unverified domain; 1280 and 390; generic fixtures.

**Out of scope:** redesigning the Custom domain wizard or DNS helper; changing who may use a custom domain; backfilling old campaign From values; Send Test policy (unless called out); approval / compliance emails; list import; verified-domain success UX beyond landing on today’s Settings.

## Desktop vs mobile
1280: Create Campaign as the existing large dialog over the campaigns list; block dialog ~480px centered; Settings tab in the Email Campaigns page; 90px left rail.
390: editor is full screen; block dialog / checklist / help email are a bottom sheet; 44px targets; actions stack; rail behind Menu; From fields stack.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | A | B | C |
| --- | --- | --- | --- |
| Cloud agent build | 8–14 | 10–16 | 11–18 |
| FC Tester | 4–6 | 4–6 | 5–8 |
| Fix loop | 2–4 | 2–4 | 2–4 |
| **Total** | **14–24 h** | **16–26 h** | **18–30 h** |

A covers the dialog on both call sites, the Create Campaign hint, Settings deep link, mailto, campaign-state behaviour, removing the default-sender fallback in the client and on the server, and tests that an unverified domain cannot send or schedule. B adds a pre-check that disables the actions. C adds the checklist panel.

## Open questions
1. Should Send Test also be blocked until the domain is verified? (Recommended: leave Send Test available unless Alex says otherwise.)
2. If a campaign was already scheduled and the domain later isn’t verified, should the scheduler itself hard-block at fire time and leave the campaign scheduled, or move it back to draft? (Recommended: don’t send, keep it scheduled, and surface the same message if the advisor opens it.)
3. Settings deep link: `?tab=settings` on the Email Campaigns route, and should the Custom domain section be scrolled into view or highlighted?
4. Ship the server hard-block in the same PR as the UI (recommended: yes — don’t leave a window where the UI blocks but a scheduled send still goes out).

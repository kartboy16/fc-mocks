# #654 Multiple email header & footer templates: build contract

> **Not agent-ready. Soft Dev hold until Alex picks.** Mocks only. Generic names only (Your Firm Name, Partner Firm, Jane Advisor, example.com). The partner disclosure line is a **placeholder that needs compliance review**.

Mocks: [Hub](index.html) · [Today](today.html) · [A, template list + picker (recommended)](a-template-list.html) · [B, gallery in compose](b-compose-gallery.html) · [C, separate headers and footers](c-mix-match.html). Every page has a Desktop / Phone toggle (`?phone`).

## 1. Today (staging, read from code)

- One header and one footer per advisor, stored on `advisor_configs` (`emailHeaderMode` / `emailFooterMode`, `emailHeaderHtml`, `emailHeaderAdvancedHtml`, `emailHeaderSimpleImageUrl`, the `emailFooterSimple*` fields and others).
- They're edited in **Email Campaigns › Settings › Headers & Footers** (`EmailHeaderFooterSettings.jsx`, used by both `SESSettings` and `MailchimpSettings`). Changes save as you type.
- In compose (`CreateCampaign.jsx`, `MailchimpCreateCampaignDialog.jsx`), "Header preview" › **Edit** writes to that same global config.
- FTT Mail (SES) builds the header and footer **at send time** from the advisor config (`server/ses-campaign-html.js` `buildWrappedCampaignEmailHtml`, also used for tests and compliance copies). A scheduled email picks up later edits.
- Mailchimp builds the full HTML in the dialog (`buildMailchimpTemplateHtml`) and pushes it to Mailchimp, so later edits don't reach campaigns already saved there.

## 2. Recommendation

**A: a "Header & footer templates" list in Settings, and a "Header & footer" drop-down in compose with a live preview.** It's the smallest change to how advisors work today. One template is a header and footer pair, which matches the ask (co-branded vs own brand), and it works the same for FTT Mail and Mailchimp.

- **B** puts a thumbnail gallery in compose, with "Save as new template / Update / Only this email" when editing. It's more visual but adds a 3-way save choice.
- **C** has separate header and footer libraries that you mix and match. It's the most flexible, but it allows mismatches, like a co-branded header with an own-brand footer.

## 3. Screens (A)

| Screen | What's on it |
|---|---|
| Settings › Header & footer templates | Cards with a thumbnail, name, **Default** chip, "Used by N scheduled · N sent · edited date", and Edit, Duplicate, Set as default and Delete. **+ New template**. With only one template, a dashed card suggests a second one. |
| Edit template | Name (required, unique), Header Simple/Advanced, Footer Simple/Advanced (the same editors as today), live preview, Save. If scheduled emails use it: "Changes apply to the N scheduled emails using this template. Sent emails don't change." |
| Delete dialog | If it's the default: "Pick a new default" (required). If scheduled emails use it: "N scheduled emails use it. Switch them to: [template]". "Sent emails keep the header and footer they were sent with." You can't delete your last template. |
| Compose (FTT Mail) | **Header & footer** drop-down (default preselected, "(default)" label), live preview, "Edit this template" and "Manage templates" links. Test emails and compliance copies use the same pick. |
| Compose (Mailchimp) | Same picker and preview. "Mailchimp gets a copy when you save the campaign. Editing the template later doesn't change campaigns already in Mailchimp." |
| Campaigns list | Optional column showing the template name. Sent rows show "As sent". |

## 4. States

| State | Copy / behaviour |
|---|---|
| First visit after release (migration) | "Your header and footer are now a template. We named it "My template" and made it your default. Nothing in your emails changed." |
| Loading | Skeleton cards |
| Error loading | "We couldn't load your templates. Your emails aren't affected." + Try again |
| Save in progress / error / success | Spinner on Save / "Couldn't save. Check your connection and try again." / toast "Template saved." |
| Validation | Empty name: "Give the template a name." Duplicate name: "You already have a template with that name." |
| Set default | Toast: ""X" is now your default. New emails start with it." |
| Delete | See the dialog. Toast: "Deleted. N scheduled emails now use "Y"." |

## 5. Migration

On release, a one-time migration copies each advisor's current header and footer fields into a template called **"My template"**, marked default. Existing campaigns (drafts, scheduled) get that `templateId`. Keep the old `advisor_configs` fields read-only as a fallback for one release. Advisors with no header or footer still get an empty default template.

## 6. Scheduled and sent emails

- **Sent:** snapshot the final header and footer HTML on the campaign at send time, so history, reports and resends show what was actually sent, whatever happens to the template later. Today SES doesn't store it, so this is new.
- **Scheduled FTT Mail:** uses the picked template at send time, so edits apply (as today, with a warning in the editor). Deleting it forces a reassign in the dialog.
- **Scheduled Mailchimp:** keeps the copy already pushed to Mailchimp. Edits and deletes don't change it (see question 3).
- **Awaiting compliance:** the compliance copy shows the picked template (see question 4).

## 7. In scope / out of scope

**In:** templates per advisor (create, name, edit, duplicate, delete, set default); migration; picker and preview in FTT Mail and Mailchimp compose; test and compliance emails using the pick; delete and default rules; snapshot on send; acting-as / admin views use the advisor's own templates; unit tests, with no live sends in QA.

**Out:** per-list default templates; sharing templates between advisors or firms; templates for social or website; a template marketplace; changing body content templates.

## 8. Mobile

Cards stack in one column. The editor's preview moves below the form, and the compose picker is a full-width native select. The delete dialog is full width.

## 9. Backend notes

- New `email_header_footer_templates` collection (`ownedBy`, `name`, `isDefault`, header/footer mode + html + simple fields, `updatedAt`), or an array on `advisor_configs`. A collection is cleaner for acting-as publications.
- Add `headerFooterTemplateId` to SES campaigns and Mailchimp scheduled campaigns. Add `sentHeaderHtml` / `sentFooterHtml` snapshots on send.
- `resolveEffectiveCampaignHeaderHtml(config)` → `resolve…(template)`. Pass the campaign's template into `buildWrappedCampaignEmailHtml`, and fall back to the default if it's missing.
- Server methods: create, update, delete (with `reassignTo` and `newDefaultId`), set default. Each one checks ownership, including when acting as.
- Ory import (`ImportOryHeaderFooterControls`) imports into the template being edited.

## 10. Estimates (one developer)

| | A | B | C |
|---|---|---|---|
| Data model + migration | 1–1.5 | 1–1.5 | 1.5–2 |
| Settings list + editor (reuse editors) | 1.5–2 | 1 | 2–2.5 |
| Compose picker + preview (FTT Mail + Mailchimp) | 1.5–2 | 2–2.5 | 2–2.5 |
| Send pipeline, snapshot, test/compliance | 1–1.5 | 1–1.5 | 1.5–2 |
| Delete / default rules, acting-as, tests | 1.5–2 | 2–2.5 | 1.5–2 |
| **Total** | **6.5–9** | **7–9.5** | **8.5–11** |

## 11. Open questions

1. Should editing a template change **scheduled** FTT Mail emails that use it (as mocked), or lock each email to its version at schedule time?
2. Is there a limit on how many templates an advisor can have (e.g. 10)?
3. **Mailchimp:** should we update scheduled Mailchimp campaigns when a template changes, or leave them (as mocked)?
4. If the template changes after compliance approved an email, should it go back for approval? A partner disclosure could matter.
5. Who writes the partner disclosure line, and is it required on co-branded templates? It's a placeholder for now.
6. Should "Edit" in compose edit the template (A), or also offer "only this email"? B shows all three choices.
7. Later, should each list have its own default template (e.g. partner clients → co-branded)?
8. Should the migrated template be called "My template" or "Own brand"?

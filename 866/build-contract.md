# #866 Guided step-by-step flow for a new email

**Status:** Published on GitHub Pages at https://kartboy16.github.io/fc-mocks/866/. Not agent-ready. Soft Dev hold until a direction is picked.

## Sources (read-only)
- Issue #866
- Live editor (no git writes): `imports/ui/EmailCampaigns/CreateCampaign.jsx` and the Campaigns list “Create Campaign” control in `SESCampaignsList.jsx`
- Required-field checks in `handleSave` / `handleSend` (CreateCampaign.jsx): campaign name, subject, and HTML content; a list **or** at least one tag; From Email, and it must be a valid address; Compliance Email if “Send copy to compliance?” is on; approval recipients if “Send approval email” is on; schedule date in the future if scheduling
- Related: #851 (Write a campaign on the advisor home) — a later question is whether that path should start this flow

## Recommendation
**A. A four-step guided flow in front of the current editor.** One direction only. The issue is that required fields are easy to miss on the all-at-once form, not that the form should go away. Advanced users get a visible **Use the full editor** hatch, and everything already entered is carried over.

Steps, as asked, with fields matched to the live editor:

1. **Audience** — Send to List or Send to Tags. Helper: “Choose a list or one or more tags to send to.” Required: one or the other (same rule as today). Choosing a list clears tags, and choosing a tag clears the list.
2. **Subject** — Campaign Name (required), Subject (required), From Name (optional, as today), From Email (required, valid). Preheader is shown as optional because the issue asked for a subject/preheader step; it is **not** a field on the live form (open question).
3. **Content** — Email Content (required), the same body field as today.
4. **Review** — a checklist of every required item (with Fix links), a summary preview, optional compliance copy and approval email (same conditionals as today), Send now or Schedule, then **Save draft**, **Schedule**, or **Send**. Nothing sends without an explicit confirm.

Continue is blocked when the step is invalid (inline errors, step-level stay). Jumping ahead on the stepper is blocked for the same reason. The review actions are blocked until the checklist is complete.

## Screens
| Screen | Notes |
| --- | --- |
| Campaigns list | Existing “Create Campaign” starts the guided flow; a full-editor link is also here |
| Step 1 Audience | Lists: All subscribers, Clients, Newsletter, Prospects (counts are fixtures). Tags: Clients, Newsletter, Prospects |
| Step 2 Subject | Name, subject, optional preheader, from name, from email |
| Step 3 Content | Email Content textarea; optional “Insert sample article text” uses a yourfirm.example Insights link |
| Step 4 Review | Checklist, preview, compliance / approval / schedule options, Save draft / Schedule / Send |
| Validation / blocked | Empty audience Continue stays on step 1 with “Please select a list or at least one tag” |
| Full editor | “Create New Campaign” — live field labels, prefilled, “Back to guided steps” |
| Confirm send / schedule | Explicit confirm; cancel leaves the review |
| Saved / sent / scheduled | Draft is draft-only; send and schedule are queued in the mock only |

Menu matches the #851 / #860 advisor chrome. Home, Library, and Settings are stubs.

## States
empty form, filled sample, step 1–4, blocked validation, full editor with carried data, confirm, saved draft, queued send, scheduled. Loading and a generic send error are not the core of this issue; the block/empty/review path is.

## Copy (aligned with the live editor where it already exists)
- “Create Campaign” / “Create New Campaign”
- “Use the full editor” / “Back to guided steps” / “This is the current editor. Everything you already entered came with you.”
- “Choose a list or one or more tags to send to.”
- “Please select a list or at least one tag”
- “Campaign name is required” / “Subject is required” / “From Email is required” / “Please enter a valid email address” / “Email content is required”
- “Send copy to compliance?” / “Compliance Officer Name” / “Compliance Email” / “Compliance Email is required when sending copy to compliance”
- “Send approval email” / “Approval Recipients” / “Approval recipients are required” / “Saves the draft, then sends the approval package with the current email body.”
- “Schedule date must be in the future”
- “Send this email?” / “Schedule this email?” / “Nothing has been sent yet.” / “Confirm send” / “Confirm schedule”
- “Draft — not sent” / “This draft is saved as a draft only. It has not been sent, scheduled, or sent for approval.”
- Banner: “Proposal mockup — not on the live site. Example data only. Nothing is sent.”
- Preheader helper: “Not required. The live Create Campaign form does not have this field today.”

No estimates or explainer prose in the mock UI except the short preheader note (it is a product fact, not an estimate).

Sample campaign: **November money update**. Subject: **Your November money update: TFSA room, the RRSP deadline, and a retirement check-in**. From: Jane Advisor &lt;jane.advisor@example.com&gt;. Audience: Newsletter (1,104 contacts). Body links to `https://yourfirm.example/insights/november-money-update` only.

## In / out of scope
**In:** guided four-step new-email flow, required fields matched to CreateCampaign.jsx, inline and step-level validation, review checklist, explicit confirm before send/schedule, Use the full editor with data carried over, 1280/390, generic fixtures, playground tryout.
**Out of scope:** replacing the current editor, live send or SES/Mailchimp wiring, inventing legal footer/CASL copy, spell-check / header-footer unsaved-edits / external compliance attestation (those stay in the current editor path; open question whether review should run them too), client-site branding or product-domain links, production deploy.

Playground first (issue track). High risk if a later build can send mail. The mocked path does not send. No build launched.

## Desktop vs mobile
1280: navy sidebar 232px, ~760px step column, two-up from-name / from-email.
390: sidebar behind Menu, stacked fields, stepper can scroll sideways, 44px actions, hatch is full width.

## Agent-time estimate (hours, cloud build + FC Tester + fix loop)
| | Hours |
| --- | --- |
| Cloud agent build (four steps, validation, review checklist, confirm, data-carrying escape hatch into the current editor) | 10–16 |
| FC Tester (each required field blocks Continue, review blocks Send/Schedule, hatch carries data both ways, list-or-tags rule, from-email format, compliance/approval conditionals, nothing sends without confirm, 1280/390, generic fixtures, yourfirm.example links only in the sample body) | 4–7 |
| Fix loop | 2–4 |
| **Total** | **16–27 h** |

Playground first. No build launched.

## Open questions
1. Preheader is in the requested steps but is not a field on the live Create Campaign form. Add it to both, or drop it from the guided flow?
2. Does “Use the full editor” keep the same in-progress campaign (as mocked), or start a copy in the existing dialog?
3. After review, should Send / Schedule also run today’s spell-check, unsaved header/footer check, cooldown, and compliance attestation before the confirm?
4. Should **Write a campaign** on the #851 / #860 home start this guided flow, or still open the suggested-campaign draft?
5. Is the guided flow the default for every new email, or an optional path beside Create Campaign?
6. Who may use it (every advisor, or only accounts that still miss required fields)?

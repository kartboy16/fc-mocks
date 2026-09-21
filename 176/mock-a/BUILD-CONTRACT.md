# BUILD-CONTRACT — FC #176 Manual advisor services (Direction A)

**One-liner:** Advisors multi-select Master Categories as services; save to durable store for Pick for me — no website scan on the primary path.

## UI location
Manage Advisor Posts / **Pick for me** → panel **Choose services** (FC admin shell).

## Persistence
Save writes selected Master Category IDs/names to the **durable advisor services** store (same store a successful scan would populate for Pick for me / suggestions).

## Relationship to Scan
- **Primary:** Manual pick from Master Categories allowlist.
- **Secondary / optional:** “Scan website instead” opens existing scan flow (stub in this mock). Scan is not required.

## Allowlist
**Master Categories only.** No free-text service names. Fake demo tree: Insurance, Audience, Wealth, Tax (see README).

## States
| State | Behavior |
|-------|----------|
| Empty | None selected; Save disabled until ≥1 |
| Edit existing | Pre-select e.g. life insurance + retirement |
| Filtering | Search filters groups/items; select-all applies to visible |
| Save success | Toast: “Services saved for Pick for me” |
| Scan stub | Dismissible note: scan remains optional |

## In scope
- Searchable grouped checklist + select-all-per-group
- Selected chips summary
- Save → durable services (mocked toast)
- Secondary scan entry (stub)

## Out of scope
- Live website crawl / LLM extraction
- Creating new Master Categories
- Mapping free-text scan names (that was #169 territory)
- Production API / auth

## Playground track
Designer interactive mock → engineering wires save to advisor-services API; Master Category tree from existing taxonomy.

## Mapping note vs #169
**#176:** Selected Master Categories **ARE** the services.  
**#169:** Tagged / mapped scanned free-text names onto categories. Different primary path.

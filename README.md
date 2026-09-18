# FinancialContent design mocks

Clickable HTML/CSS prototypes for FinancialContent (FC Designer). Not the Meteor app.

**Live site:** https://kartboy16.github.io/fc-mocks/

## Layout

```
/<issue-number>/index.html   ← primary clickable mock for that content-library issue
/<issue-number>/v2/          ← optional alternate direction
/index.html                  ← this repo's index (list of mocks)
```

Example: issue `#161` → `https://kartboy16.github.io/fc-mocks/161/`

## Publish (FC Designer)

1. Build static HTML/CSS (no Meteor, no secrets).
2. Commit under `/<issue-number>/` on `main`.
3. Pages deploys from `main` `/` within a minute or two.
4. Paste the URL on the GitHub issue and in Slack `#fc-bugs`.

## Rules

- One issue number folder per mock set.
- Keep mocks self-contained (relative CSS/JS/assets).
- No API keys, tokens, or real advisor PII.
- After Alex/Angelina approve a direction, Chief of Staff wakes Software developer with the Pages URL + build contract.

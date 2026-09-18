# FC Share destination picker — Direction A product mock (#168)

Clickable static HTML/CSS + light JS for **FinancialContent** Share destinations: **Checklist rows**.

**Issue:** [content-library#168](https://github.com/kartboy16/content-library/issues/168)  
**Build contract:** [BUILD-CONTRACT.md](./BUILD-CONTRACT.md)

## Open locally

From this folder:

```bash
cd /workspace/fc-share-168/mock-a
python3 -m http.server 8768
```

Then open:

- http://127.0.0.1:8768/index.html — library + Share picker  
- http://127.0.0.1:8768/mobile.html — ~375px phone frame  
- http://127.0.0.1:8768/flow.html — empty-guard (or arrive via Continue)  

Or open `index.html` directly in a browser (sessionStorage still works for Continue → flow).

## Smoke path

1. Open **Content library** (`index.html`).  
2. On **RRSP tips for clients**, click **Share**.  
3. Select one or more of Email / Social / Website (or **Select all**).  
4. **Continue** → channel chips + next-step stubs (`flow.html`).  
5. Stub buttons say **Open draft** / **Preview** (toast only — nothing sent).

Optional: demo strip presets (0 / 1 / 2 / all selected). Escape or outside click closes the picker.

## Files

| File | Role |
|------|------|
| `index.html` | FC app shell + content card + popover/sheet picker |
| `flow.html` | Post-Continue summary |
| `mobile.html` | Phone-frame sheet demo |
| `styles.css` | FC staging tokens + layout |
| `app.js` | Multi-select, select-all, Continue gate, flow render |
| `BUILD-CONTRACT.md` | Spec for software developer |

## Tokens

`#f4f8fc` / `#fafafa` bg · `#fff` cards · `#1e2a4a` / `#2c3e50` ink · `#5b6572` muted · `#2b7de9` / `#4a96e0` / `#2196f3` blue · `#d4e4f2` borders · `#e6f1fb` mint · Inter/system-ui · 12px cards · 8px buttons · pill chips.

## Notes

- Product mock = **new UI only** (no grey “Before” combo strip — that stays on direction boards).  
- Fake advisor/content names only. Vanilla JS. No live sends.  
- Do **not** git push from this workspace unless a parent agent asks.

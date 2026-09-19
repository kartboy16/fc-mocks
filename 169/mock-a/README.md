# Direction A — Dense table mock (#169)

Clickable static HTML/CSS + vanilla JS for **FinancialContent** Website services scan results.

**Product one-liner:** Free-text tags + Confirmed → editable Name, allowlist chip picker, **Use for suggestions**.

## Paths (absolute)

| Path | What |
|------|------|
| `/workspace/fc-scan-169/mock-a/index.html` | Results panel in FC admin shell (dense table + ≤640px card stack) |
| `/workspace/fc-scan-169/mock-a/mobile.html` | Phone-frame stacked layout |
| `/workspace/fc-scan-169/mock-a/styles.css` | Tokens + layout |
| `/workspace/fc-scan-169/mock-a/app.js` | Allowlist picker, toggles, toast, optional localStorage |
| `/workspace/fc-scan-169/mock-a/BUILD-CONTRACT.md` | Contract for Software developer |
| `/workspace/fc-scan-169/pages-root/` | Pages hub package (CTA → mock-a, archive directions) |

## Open locally

```bash
# from mock-a
python3 -m http.server 8769 --directory /workspace/fc-scan-169/mock-a
# → http://127.0.0.1:8769/
```

Or open `index.html` in a browser (file:// works; Google Fonts need network).

## Smoke checklist

1. Edit **Name** on any row  
2. **Annuities** → Pick tags… → add `annuities` / `retirement`; remove with ×  
3. Click a **Suggested** chip to add  
4. Toggle **Use for suggestions**  
5. **Save services** → toast  
6. Optional: Select all Use / Clear Use; Empty state demo toggle; Reset demo  

Edits optionally persist in `localStorage` key `fc-scan-169-mock-a`.

## Tokens

`bg` `#f4f8fc` / `#fafafa` · cards `#fff` · ink `#1e2a4a` / `#2c3e50` · muted `#5b6572` · blue `#2b7de9` / `#2196f3` · borders `#d4e4f2` · mint `#e6f1fb` · Inter · cards 12px · buttons 8px · pill chips.

## Related

- GitHub: [kartboy16/content-library#169](https://github.com/kartboy16/content-library/issues/169)  
- Prior: #52 / PR #143  

Fake data only. Do not git push.

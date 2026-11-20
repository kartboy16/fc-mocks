(function () {
  const state = { dir: "a", s: "field-empty", dev: "desk" };
  const PAGES = { a: "a-dialog.html", b: "b-drawer.html", c: "c-dropzone.html", m: "my-media.html" };
  const DIRN = { a: "A: inline field + dialog", b: "B: side drawer", c: "C: upload-first dropzone", m: "My media page" };
  const TOTAL = 71, PER = 24;
  const BASES = ["team-photo", "office-front", "coffee-meeting", "family-budget", "retirement-plan", "spring-seminar", "client-welcome", "handshake", "calculator-desk", "home-keys", "graduation-cap", "piggy-bank", "sunrise-hills", "notebook-pen", "workshop-room", "community-hall", "planning-table", "tax-forms", "book-stack", "city-skyline"];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const P_SCHED = { t: "Why I review your plan every spring", st: "Scheduled for Nov 24", eff: "It will be put on hold until you check it and schedule it again." };
  const P_LIVE = { t: "Welcome to my practice", st: "Live on your website", eff: "It loses its featured image on your website." };
  const USED = { 2: [P_SCHED, P_LIVE], 3: [P_SCHED] };
  const FEAT = 3;

  function img(i) {
    const ext = i % 3 === 2 ? "png" : i % 7 === 6 ? "webp" : "jpg";
    const n = Math.floor(i / 20);
    const kb = 180 + ((i * 173) % 2400);
    const d = new Date(2026, 10, 19 - Math.floor(i * 1.3));
    return { i, name: BASES[i % 20] + (n ? "-" + (n + 1) : "") + "." + ext, size: kb >= 1000 ? (kb / 1000).toFixed(1) + " MB" : kb + " KB", date: MON[d.getMonth()] + " " + d.getDate(), dim: [1600, 1920, 1200, 2400][i % 4] + " × " + [900, 1080, 800, 1350][i % 4] };
  }
  const ALL = Array.from({ length: TOTAL }, (_, i) => img(i));
  function th(i) {
    const h = (i * 47 + 200) % 360;
    return `background:radial-gradient(circle at ${60 + ((i * 7) % 25)}% ${28 + ((i * 5) % 12)}%,rgba(255,255,255,.7) 0 9%,transparent 10%),linear-gradient(${165 + (i % 3) * 8}deg,transparent 58%,rgba(0,0,0,.16) 59%),linear-gradient(135deg,hsl(${h},50%,44%),hsl(${(h + 45) % 360},58%,72%))`;
  }
  const phone = () => state.dev === "phone";

  /* ---------- scenes ---------- */
  const UPS = {
    drag: { tab: "up", drag: 1, label: "Dragging a file" },
    uploading: { tab: "up", up: "progress", label: "Uploading" },
    "err-large": { tab: "up", err: "large", label: "Error: too large" },
    "err-type": { tab: "up", err: "type", label: "Error: wrong type" },
    "err-dim": { tab: "up", err: "dim", label: "Error: too small" },
    "err-net": { tab: "up", err: "net", label: "Error: network" },
    "err-full": { tab: "up", err: "full", label: "Error: library full" }
  };
  const LIBS = {
    lib: { label: "My media" },
    selected: { sel: 1, label: "Selected" },
    uploaded: { sel: 0, fresh: 1, label: "Just uploaded" },
    page2: { p: 2, label: "Page 2" },
    search: { q: "team", label: "Search" },
    "search-none": { q: "beach", label: "Search: none" },
    loading: { lib: "loading", label: "Loading" },
    "load-error": { lib: "error", label: "Load error" },
    empty: { lib: "empty", label: "Empty library" },
    replace: { replace: 1, sel: FEAT, label: "Replace" },
    support: { viewer: "support", label: "Support viewer" }
  };
  const SC = {};
  const add = (dir, arr) => (SC[dir] = arr);
  const U = (pre, keys) => keys.map((k) => [pre + "-" + k, UPS[k].label]);
  const L = (pre, keys) => keys.map((k) => [pre + "-" + k, LIBS[k].label]);
  const FIELD = [["field-empty", "Field: empty"], ["field-set", "Field: set"], ["field-removed", "Field: removed"]];
  const DEL = [["del-confirm", "Delete: confirm"], ["del-used", "Delete: in use"], ["del-error", "Delete: error"], ["deleted", "Deleted"]];
  add("a", [].concat(FIELD, [["dlg-upload", "Upload tab"]], U("dlg", ["drag", "uploading", "err-large", "err-type", "err-dim", "err-net", "err-full"]), L("dlg", ["lib", "selected", "uploaded", "page2", "search", "search-none", "loading", "load-error", "empty", "replace", "support"]), DEL));
  add("b", [].concat(FIELD, [["drawer-upload", "Drawer"]], U("drawer", ["drag", "uploading", "err-large", "err-type", "err-dim", "err-net", "err-full"]), L("drawer", ["selected", "uploaded", "page2", "search", "search-none", "loading", "load-error", "empty", "replace", "support"]), DEL));
  add("c", [["field-empty", "Field: empty"]].concat(U("field", ["drag", "uploading", "err-large", "err-type", "err-dim", "err-net", "err-full"]), [["strip-loading", "Recent: loading"], ["strip-error", "Recent: error"], ["strip-empty", "Recent: none yet"], ["field-set", "Field: set"], ["field-removed", "Field: removed"]], L("browse", ["lib", "selected", "page2", "search", "search-none", "loading", "load-error", "replace", "support"]), DEL));
  add("m", [["lib", "My media"], ["lib-page2", "Page 2"], ["lib-search", "Search"], ["lib-search-none", "Search: none"], ["lib-loading", "Loading"], ["lib-load-error", "Load error"], ["lib-empty", "Empty"], ["lib-drag", "Dragging a file"], ["lib-uploading", "Uploading"], ["lib-err-large", "Error: too large"], ["lib-err-type", "Error: wrong type"], ["lib-err-dim", "Error: too small"], ["lib-err-net", "Error: network"], ["lib-err-full", "Error: full"], ["lib-menu", "Tile menu"], ["lib-delete", "Delete: confirm"], ["lib-delete-used", "Delete: in use"], ["lib-delete-error", "Delete: error"], ["lib-deleted", "Deleted"], ["lib-support", "Support viewer"], ["lib-admin", "Admin viewer"]]);

  function model(s) {
    const d = state.dir;
    const m = { s, view: "editor", field: "empty", pick: null, tab: "lib", lib: "ok", p: 1, q: "", sel: null, up: null, err: null, drag: 0, viewer: null, del: null, toast: "", fresh: 0, replace: 0, menu: 0, strip: "ok", delIdx: 4, back: "field-empty" };
    const PK = { a: "dlg", b: "drawer", c: "browse" }[d];
    if (s === "field-empty") return m;
    if (s === "field-set") { m.field = "set"; return m; }
    if (s === "field-removed") { m.toast = "Featured image removed. It is still in My media."; return m; }
    if (d === "m") {
      m.view = "page";
      const r = s.replace(/^lib-?/, "");
      if (r === "page2") m.p = 2;
      else if (r === "search") m.q = "team";
      else if (r === "search-none") m.q = "beach";
      else if (r === "loading") m.lib = "loading";
      else if (r === "load-error") m.lib = "error";
      else if (r === "empty") m.lib = "empty";
      else if (r === "drag") m.drag = 1;
      else if (r === "uploading") m.up = "progress";
      else if (/^err-/.test(r)) m.err = r.slice(4);
      else if (r === "menu") { m.menu = 1; m.menuIdx = 2; }
      else if (r === "delete") m.del = "plain";
      else if (r === "delete-used") { m.del = "used"; m.delIdx = 2; }
      else if (r === "delete-error") m.del = "error";
      else if (r === "deleted") m.toast = "Deleted retirement-plan.jpg from My media.";
      else if (r === "support") m.viewer = "support";
      else if (r === "admin") m.viewer = "admin";
      return m;
    }
    if (s === "del-confirm" || s === "del-used" || s === "del-error" || s === "deleted") {
      m.pick = PK; m.tab = "lib"; m.back = PK + "-lib";
      if (s === "del-confirm") m.del = "plain";
      if (s === "del-used") { m.del = "used"; m.delIdx = 2; }
      if (s === "del-error") m.del = "error";
      if (s === "deleted") m.toast = "Deleted retirement-plan.jpg from My media.";
      if (d === "c") m.field = "empty";
      return m;
    }
    if (d === "c" && /^strip-/.test(s)) { m.strip = s.slice(6); return m; }
    if (d === "c" && /^field-/.test(s)) { const k = s.slice(6); Object.assign(m, UPS[k], { pick: null, tab: null, fieldUp: 1 }); return m; }
    const suf = s.replace(PK + "-", "");
    m.pick = PK;
    if (suf === "upload") { m.tab = "up"; return m; }
    if (UPS[suf]) { Object.assign(m, UPS[suf]); if (d === "b") m.tab = "lib"; return m; }
    if (LIBS[suf]) { Object.assign(m, LIBS[suf]); m.tab = "lib"; if (m.replace) m.field = "set"; return m; }
    return m;
  }

  /* ---------- helpers ---------- */
  window.sw = function (k, v) {
    if (k === "dev") state.dev = v; else state.s = v;
    const p = new URLSearchParams(location.search);
    p.set("s", state.s);
    if (state.dev === "phone") p.set("phone", "1"); else p.delete("phone");
    try { history.replaceState(null, "", "?" + p.toString()); } catch (e) {}
    render();
  };
  const go = (s) => `onclick="sw('s','${s}')"`;
  const noop = `onclick="return false"`;
  const scrim = (inner, cls) => `<div class="scrim pm-scrim ${cls || ""}">${inner}</div>`;
  const toast = (t) => `<div class="toast">${t}</div>`;
  const lock = (t) => `<span class="lockpill">🔒 ${t}</span>`;
  const viewerName = (v) => (v === "admin" ? "Pat Admin" : "Sam Support");
  const viewerRole = (v) => (v === "admin" ? "Admin" : "Support");

  function mockbar() {
    const links = ["a", "b", "c"].map((d) => `<a href="${PAGES[d]}"${d === state.dir ? ' style="font-weight:700;color:#fff"' : ""}>${d.toUpperCase()}</a>`).join(" · ");
    const btns = SC[state.dir].map((x) => `<button type="button" class="${state.s === x[0] ? "on" : ""}" onclick="sw('s','${x[0]}')">${x[1]}</button>`).join("");
    return `<div class="mockbar"><a href="../">All mocks</a> · <a href="index.html">Private media hub</a> · ${links} · <a href="my-media.html"${state.dir === "m" ? ' style="font-weight:700;color:#fff"' : ""}>My media page</a> · <a href="build-contract.html">Contract</a><span class="sp"></span>
      <button type="button" class="${state.dev === "desk" ? "on" : ""}" onclick="sw('dev','desk')">Desktop</button>
      <button type="button" class="${state.dev === "phone" ? "on" : ""}" onclick="sw('dev','phone')">390</button>${btns}</div>`;
  }
  function rail(active) {
    const it = (k, ico, lbl) => `<div class="ri${active === k ? " on" : ""}"><span class="ico">${ico}</span>${lbl}</div>`;
    return `<nav class="rail"><div class="logo">YFN<small>Your Firm Name</small></div>
      <div class="ri" style="margin-bottom:12px"><span class="ico" style="background:#1976d2;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center">+</span>Create</div>
      ${it("content", "📄", "Content")}${it("website", "🖥", "Website")}${it("social", "🔗", "Social Media")}${it("email", "✉", "Email Campaigns")}${it("cal", "📅", "Calendar")}</nav>`;
  }
  function frame(inner, overlay, av) {
    return `<div class="stagewrap"><div id="stage" class="${state.dev}"><div class="app">${rail("content")}<div class="col">
      <div class="mbar"><button type="button" aria-label="Menu">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">YFN</div><div class="av">${av || "JA"}</div></div>
      <main class="main">${inner}</main></div></div>${overlay || ""}</div></div>`;
  }

  /* ---------- library pieces ---------- */
  function filtered(m) {
    const q = (m.q || "").toLowerCase();
    return q ? ALL.filter((x) => x.name.toLowerCase().includes(q)) : ALL;
  }
  function tile(x, o) {
    o = o || {};
    const tag = o.fresh ? `<span class="tg fresh">Just uploaded</span>` : o.cur ? `<span class="tg cur">Current image</span>` : o.used && USED[x.i] ? `<span class="tg">In use · ${USED[x.i].length} post${USED[x.i].length > 1 ? "s" : ""}</span>` : "";
    return `<div style="position:relative"><button type="button" class="pm-tile${o.sel ? " sel" : ""}" ${o.click ? go(o.click) : noop}><span class="th" style="${th(x.i)}">${o.sel ? `<span class="ck">✓</span>` : ""}${tag}</span><span class="nm">${x.name}</span><span class="mt">${x.date} · ${x.size}</span></button>${o.dots ? `<button type="button" class="dots" aria-label="More" ${go(o.dots)}>⋯</button>` : ""}${o.menu || ""}</div>`;
  }
  function skelGrid(cls) {
    let h = "";
    for (let i = 0; i < PER; i++) h += `<div class="pm-tile sk"><span class="th skel" style="border-radius:0"></span><span class="nm"><span class="skel" style="display:block;height:11px;width:80%"></span></span><span class="mt"><span class="skel" style="display:block;height:9px;width:55%;margin-top:6px"></span></span></div>`;
    return `<div class="pm-grid ${cls}">${h}</div>`;
  }
  function box(ic, h, p, btn) {
    return `<div class="empty" style="padding:36px 16px"><div class="big">${ic}</div><h3>${h}</h3><p>${p}</p>${btn || ""}</div>`;
  }
  function toolbar(m, o) {
    o = o || {};
    const q = m.q ? `<b>${m.q}</b><span class="x">✕</span>` : `Search by file name`;
    return `<div class="pm-bar"><div class="pm-search">🔍 ${q}</div><div class="pm-sort">Sort: <b style="font-weight:600">Newest first</b> ▾</div>${o.upload ? `<button class="btn" type="button" ${go(o.upload)}>＋ Upload</button>` : ""}</div>`;
  }
  /* body of a library list: toolbar + grid; cls = g6|g4|pg. opts: pick (tile click target), dots, viewer */
  function libList(m, cls, o) {
    o = o || {};
    const list = filtered(m);
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PER));
    const page = Math.min(m.p, pages);
    const slice = list.slice((page - 1) * PER, page * PER);
    if (m.lib === "error") return box("⚠", "We couldn't load My media", "Your images are safe. Check your connection and try again.", `<button class="btn pri" type="button" ${noop}>Try again</button>`);
    if (m.lib === "empty") return box("🖼", "No images in My media yet", "Images you upload appear here. Only you can see them.", o.emptyBtn || "");
    const bar = toolbar(m, { upload: o.uploadTo });
    if (m.lib === "loading") return bar + `<div class="pm-count"><span class="skel" style="display:inline-block;height:11px;width:90px"></span></div>` + skelGrid(cls);
    if (!slice.length) return bar + box("🔍", `No images match “${m.q}”`, "Check the spelling, or search for part of the file name.", `<button class="btn" type="button" ${go(o.clear || m.s)}>Clear search</button>`);
    const count = m.q ? `${total} image${total === 1 ? "" : "s"} match “${m.q}”` : `${total} images · newest first`;
    const tiles = slice.map((x, k) => {
      const isSel = m.sel === x.i;
      const menu = m.menu && m.menuIdx === x.i ? `<div class="pm-menu"><button type="button" ${noop}>Use in a new post</button><button type="button" class="dg" ${go("lib-delete")}>Delete from My media…</button></div>` : "";
      return tile(x, { sel: isSel, click: o.pick, dots: !m.viewer && o.dots ? o.dots(x) : null, fresh: m.fresh && x.i === 0, cur: m.replace && x.i === FEAT, used: o.used, menu });
    }).join("");
    return `${bar}<div class="pm-count">${count}</div><div class="pm-grid ${cls}">${tiles}</div>`;
  }
  function pager(m) {
    if (m.lib !== "ok") return "";
    const total = filtered(m).length;
    if (!total) return "";
    const pages = Math.ceil(total / PER);
    const page = Math.min(m.p, pages);
    const from = (page - 1) * PER + 1, to = Math.min(total, page * PER);
    const nums = Array.from({ length: pages }, (_, k) => `<button class="pg-btn${k + 1 === page ? " on" : ""}" type="button" ${noop}>${k + 1}</button>`).join("");
    return `<div class="pm-pager"><span class="rng">${from}–${to} of ${total}</span><span class="sp"></span><button class="pg-btn" type="button" ${page === 1 ? "disabled" : noop}>‹ Prev</button><span class="nums" style="display:inline-flex;gap:6px">${nums}</span><span class="pgof">Page ${page} of ${pages}</span><button class="pg-btn" type="button" ${page === pages ? "disabled" : noop}>Next ›</button></div>`;
  }
  const NAMES = { large: "huge-panorama.jpg", type: "annual-report.pdf", dim: "tiny-icon.png", net: "team-photo.jpg" };
  function errAlert(e) {
    const a = {
      large: [`huge-panorama.jpg is too large`, `It is 14.2 MB. The limit is 5 MB. Try a smaller copy.`, ["Choose another image"]],
      type: [`annual-report.pdf isn't an image`, `Use a JPG, PNG, WebP or GIF.`, ["Choose another image"]],
      dim: [`tiny-icon.png is too small`, `It is 120 × 80 px. Use at least 600 × 315 px so it looks sharp on your post.`, ["Choose another image"]],
      net: [`team-photo.jpg didn't upload`, `The connection dropped at 64%. Check your connection and try again.`, ["Try again", "Remove"]],
      full: [`My media is full`, `You have 200 images, the most My media can hold. Delete some you no longer need, then upload again.`, ["Open My media"]]
    }[e];
    return `<div class="alert error"><b>${a[0]}</b>${a[1]}<div class="alert-acts">${a[2].map((x, k) => `<button class="btn sm${k ? " quiet" : ""}" type="button" ${noop}>${x}</button>`).join("")}</div></div>`;
  }
  function progressRows() {
    const rows = [[0, "team-photo.jpg", "1.4 MB", 64], [3, "family-budget.jpg", "2.1 MB", 21], [6, "client-welcome.jpg", "0.8 MB", 0]];
    return rows.map((r) => `<div class="pm-up"><span class="th" style="${th(r[0] + 30)}"></span><div class="bd"><div class="nm">${r[1]}</div><div class="pm-bar2${r[3] ? "" : " idle"}"><i style="width:${r[3]}%"></i></div><div class="sz">${r[3] ? r[3] + "% of " + r[2] : "Waiting · " + r[2]}</div></div><button class="ico-btn" type="button" aria-label="Cancel upload" ${noop}>✕</button></div>`).join("");
  }
  const LIMITS = "JPG, PNG, WebP or GIF · up to 5 MB · at least 600 × 315 px";
  function dropBig(m) {
    const ph = phone();
    return `<div class="pm-drop${m.drag ? " drag" : ""}"><div class="ic">⬆</div><b>${m.drag ? "Drop to upload to My media" : ph ? "Choose a photo to upload" : "Drag an image here"}</b>${m.drag || ph ? "" : `<span class="or">or</span>`}<button class="btn pri" type="button" ${noop}>${ph ? "Choose from your device" : "Browse your computer"}</button><small>${LIMITS}</small></div>`;
  }
  function dropSm(m) {
    const ph = phone();
    return `<div class="pm-drop sm${m.drag ? " drag" : ""}"><span class="ic">⬆</span><div class="tx"><b>${m.drag ? "Drop to upload to My media" : ph ? "Upload a photo" : "Drag images here to upload"}</b><small>${LIMITS}</small></div><button class="btn" type="button" ${noop}>${ph ? "Choose" : "Browse"}</button></div>`;
  }
  function uploadArea(m, sm) {
    return (m.err ? errAlert(m.err) : "") + (m.up === "progress" ? progressRows() : "") + (sm ? dropSm(m) : dropBig(m));
  }
  function viewerBar(m, cls) {
    if (!m.viewer) return "";
    return `<div class="pm-viewer ${cls || ""}"><b>👁 Viewing Jane Advisor's private media (${viewerRole(m.viewer)})</b><span class="ro">Read only</span><a href="#" ${noop}>Exit</a></div>`;
  }

  /* ---------- delete confirm ---------- */
  function delConfirm(m, back) {
    const x = ALL[m.delIdx];
    const head = `<div class="pm-del"><span class="th" style="${th(x.i)}"></span><div><b>${x.name}</b><small>${x.dim} · ${x.size} · added ${x.date}</small></div></div>`;
    let c;
    if (m.del === "plain") c = `<div class="ct">Delete this image from My media?</div>${head}<p>It will be removed for good. None of your posts use it.</p><div class="cf"><button class="btn quiet" type="button" ${go(back)}>Cancel</button><button class="btn danger" type="button" ${go("deleted")}>Delete image</button></div>`;
    else if (m.del === "error") c = `<div class="ct">Delete this image from My media?</div>${head}<div class="alert error"><b>Couldn't delete the image</b>Nothing was removed. Try again in a moment.</div><div class="cf"><button class="btn quiet" type="button" ${go(back)}>Cancel</button><button class="btn danger" type="button" ${noop}>Try again</button></div>`;
    else {
      const ps = USED[x.i];
      c = `<div class="ct">This image is used by ${ps.length} post${ps.length > 1 ? "s" : ""}</div>${head}<div class="pm-used"><b>If you delete it:</b><ul>${ps.map((p) => `<li><div><b>${p.t}</b><span>${p.st}. ${p.eff}</span></div></li>`).join("")}</ul></div><p>Emails you have already sent keep their copy of the image.</p><div class="cf"><button class="btn quiet" type="button" ${go(back)}>Keep image</button><button class="btn danger" type="button" ${go("deleted")}>Delete anyway</button></div>`;
    }
    return scrim(`<div class="confirm pmc">${c}</div>`, "top");
  }

  /* ---------- editor ---------- */
  function fieldSet(i, kind) {
    const x = ALL[i];
    const rep = kind === "dlg" ? "dlg-replace" : kind === "drawer" ? "drawer-replace" : "browse-replace";
    return `<div class="pm-field"><div class="prev" style="${th(i)}"></div><div class="fm"><b>${x.name}</b>${x.dim} · ${x.size} · from My media</div>
      <div class="fa"><button class="btn" type="button" ${go(rep)}>Replace</button><button class="btn quiet" type="button" ${go("field-removed")}>Remove</button></div>
      <div class="priv">🔒 <span>Kept in your private My media. It is only shown to others once you publish the post.</span></div></div>`;
  }
  function fieldAB(m, kind) {
    const open = kind === "dlg" ? "dlg-lib" : "drawer-upload";
    if (m.field === "set") return `<div class="panel"><h3>Featured image</h3>${fieldSet(FEAT, kind)}</div>`;
    return `<div class="panel"><h3>Featured image</h3><div class="pm-field"><div class="box"><span class="ic">🖼</span>No featured image yet<br><span style="font-size:12px">Upload one from your computer, or pick one from My media.</span><br><button class="btn pri" type="button" ${go(open)}>Choose image</button></div></div></div>`;
  }
  function strip(m) {
    const lbl = (extra) => `<div class="lbl">Recent uploads${extra || ""}</div>`;
    if (m.strip === "loading") return lbl() + `<div class="pm-strip">${[1, 2, 3, 4, 5, 6].map(() => `<div class="pm-rt" style="cursor:default"><span class="th skel" style="border-radius:0"></span><span class="nm"><span class="skel" style="display:block;height:9px;width:70%;margin:2px 0"></span></span></div>`).join("")}</div>`;
    if (m.strip === "error") return lbl() + `<div class="alert error" style="margin:0"><b>Couldn't load your recent uploads</b>You can still upload a new image above.<div class="alert-acts"><button class="btn sm" type="button" ${go("field-empty")}>Try again</button></div></div>`;
    if (m.strip === "empty") return lbl() + `<div class="pm-note" style="padding:6px 0">Images you upload are saved to My media, a private library only you can see. They will show up here for next time.</div>`;
    const n = phone() ? 3 : 7;
    const rt = ALL.slice(0, n).map((x) => `<button class="pm-rt" type="button" ${go("field-set")}><span class="th" style="${th(x.i)}"></span><span class="nm">${x.name}</span></button>`).join("");
    return lbl() + `<div class="pm-strip">${rt}<button class="pm-rt more" type="button" ${go("browse-lib")}>Browse all<br>${TOTAL} →</button></div>`;
  }
  function fieldC(m) {
    if (m.field === "set") return `<div class="pm-hero pm-field"><h3>Featured image</h3><div class="prev" style="${th(FEAT)}"></div><div class="fm"><b>${ALL[FEAT].name}</b>${ALL[FEAT].dim} · ${ALL[FEAT].size} · from My media</div><div class="fa" style="max-width:360px"><button class="btn" type="button" ${go("browse-replace")}>Replace</button><button class="btn quiet" type="button" ${go("field-removed")}>Remove</button></div><div class="priv">🔒 <span>Kept in your private My media. It is only shown to others once you publish the post.</span></div></div>`;
    const showStrip = !m.fieldUp || m.up !== "progress";
    return `<div class="pm-hero pm-field"><h3>Featured image ${lock("Only you can see your uploads")}</h3>${uploadArea(m, false)}${m.fieldUp ? "" : ""}${strip(m)}</div>`;
  }
  function editor(m) {
    const d = state.dir;
    const top = `<div class="ed-top"><button class="btn link" type="button" ${noop}>← My posts</button><h2>New post</h2><span class="sp"></span><button class="btn quiet" type="button" ${noop}>Save draft</button><button class="btn pri" type="button" ${noop}>Save post</button></div>`;
    const lockRow = `<div class="panel lockrow" style="padding:12px 16px;display:flex;gap:10px;align-items:center;margin:0 0 12px;background:#f5f7f8"><span class="lockpill">🔒 Only you can see this post</span><span style="font-size:13px;color:#5b6572">Other advisors, the Content Library, search and Pick for me never show it.</span></div>`;
    const main = `<div class="panel">
      <div class="field"><label>Title</label><input value="Planning for the year ahead" placeholder="Post title"></div>
      <div class="field"><label>Summary</label><textarea placeholder="One or two sentences shown on the card">A short checklist to start the year with a clear plan.</textarea></div>
      <div class="field" style="margin:0"><label>Post</label><div class="tb"><span>B</span><span><i>I</i></span><span><u>U</u></span><span>❝</span><span>≡</span><span>🔗</span><span>🖼</span></div><div class="ebody"><p>A new year is a good time to look at what you have, what you want, and what changed since last spring.</p><p>Here are three questions to bring to our next meeting.</p></div></div></div>`;
    if (d === "c") return `${top}${lockRow}<div class="ed-grid one"><div>${fieldC(m)}${main}</div></div>`;
    const side = `<div class="pm-side">${fieldAB(m, d === "a" ? "dlg" : "drawer")}</div>`;
    return `${top}${lockRow}<div class="ed-grid">${main}${side}</div>`;
  }

  /* ---------- pickers ---------- */
  function selNote(m) {
    if (m.viewer) return `<span class="pm-selnote">Read only. You can't pick or change images for Jane Advisor.</span>`;
    return `<span class="pm-selnote">${m.sel != null ? "Selected: <b>" + ALL[m.sel].name + "</b>" : m.up === "progress" ? "Uploading 3 images…" : ""}</span>`;
  }
  function useBtn(m) {
    if (m.viewer) return "";
    const dis = m.sel == null || m.up === "progress" || m.tab === "up" ? "disabled" : "";
    return `<button class="btn pri" type="button" ${dis} ${dis ? "" : go("field-set")}>Use this image</button>`;
  }
  const listOpts = (m, pre) => ({ pick: pre + "-selected", dots: () => "del-confirm", used: false, uploadTo: pre === "browse" ? "field-empty" : pre + "-upload", clear: pre + "-lib", emptyBtn: pre === "browse" ? "" : `<button class="btn pri" type="button" ${go(pre + "-upload")}>Upload an image</button>` });
  function dlgA(m) {
    const up = m.tab === "up";
    const tabs = `<div class="pm-tabs"><button type="button" class="${up ? "on" : ""}" ${m.viewer ? "disabled" : go("dlg-upload")}>Upload from computer</button><button type="button" class="${up ? "" : "on"}" ${go("dlg-lib")}>My media <span class="n">${m.lib === "empty" ? 0 : TOTAL}</span></button></div>`;
    const body = up ? uploadArea(m, false) : libList(m, "g6", listOpts(m, "dlg"));
    return `<div class="dlg pm"><div class="dh"><div><div class="hd"><span class="ttl">${m.replace ? "Replace featured image" : "Featured image"}</span>${lock(m.viewer ? "Jane Advisor's private media" : "Private to you")}</div><div class="sub">For your private post “Planning for the year ahead”</div></div><button class="ico-btn" type="button" ${go(m.back || "field-empty")}>✕</button></div>
      ${viewerBar(m)}${tabs}<div class="db">${body}</div>${up ? "" : pager(m)}
      <div class="df"><button class="btn quiet" type="button" ${go("field-empty")}>${m.viewer ? "Close" : "Cancel"}</button>${useBtn(m)}${selNote(m)}</div></div>`;
  }
  function drawerB(m) {
    const ul = m.err || m.up || m.drag;
    const topZone = m.viewer ? "" : ul ? (m.up === "progress" ? progressRows() : "") + (m.err ? errAlert(m.err) : "") + dropSm(m) : dropSm(m);
    const body = topZone + libList(m, "g4", listOpts(m, "drawer"));
    return `<div class="pm-dim"></div><div class="drawer pm"><div class="dh"><div class="ttl"><div class="hd">${m.replace ? "Replace featured image" : "Featured image"} ${lock(m.viewer ? "Jane Advisor's private media" : "Private to you")}</div><div class="sub">For your private post “Planning for the year ahead”</div></div><button class="x" type="button" aria-label="Close" ${go("field-empty")}>×</button></div>
      ${viewerBar(m)}<div class="db">${body}</div>${pager(m)}
      <div class="df"><button class="btn quiet" type="button" ${go("field-empty")}>${m.viewer ? "Close" : "Cancel"}</button>${useBtn(m)}${selNote(m)}</div></div>`;
  }
  function browseC(m) {
    return `<div class="dlg pm"><div class="dh"><div><div class="hd"><span class="ttl">${m.replace ? "Replace featured image" : "My media"}</span>${lock(m.viewer ? "Jane Advisor's private media" : "Private to you")}</div><div class="sub">Pick one image for your private post “Planning for the year ahead”</div></div><button class="ico-btn" type="button" ${go(m.back || "field-empty")}>✕</button></div>
      ${viewerBar(m)}<div class="db">${libList(m, "g6", listOpts(m, "browse"))}</div>${pager(m)}
      <div class="df"><button class="btn quiet" type="button" ${go("field-empty")}>${m.viewer ? "Close" : "Cancel"}</button>${useBtn(m)}${selNote(m)}</div></div>`;
  }

  /* ---------- standalone page ---------- */
  function pageView(m) {
    const av = m.viewer ? (m.viewer === "admin" ? "PA" : "SS") : "JA";
    const own = !m.viewer;
    const head = `<a class="btn link pm-back" href="#" ${noop}>← My posts</a><div class="pm-page-head"><h2>My media</h2>${lock(own ? "Only you can see these" : "Jane Advisor's private media")}<span class="sp"></span>${own ? `<button class="btn pri" type="button" ${noop}>＋ Upload images</button>` : `<button class="btn pri" type="button" disabled>＋ Upload images</button>`}</div>
      <p class="pm-sub">${own ? "Images you upload for your private posts. They are separate from the Content Library and are never shared with other advisors." : "Read only. Support and admins can look at a library to help, but can't upload or delete."}</p>`;
    const zone = own ? ((m.up === "progress" ? progressRows() : "") + (m.err ? errAlert(m.err) : "") + (m.lib === "empty" ? dropBig(m) : dropSm(m))) : "";
    const opts = { dots: () => "lib-menu", used: true, emptyBtn: "", clear: "lib" };
    let list = libList(m, "pg", opts);
    if (m.lib === "empty") list = box("🖼", "No images in My media yet", "Images you upload appear here. Only you can see them.", "");
    const card = `<div class="pm-card">${zone}${m.lib === "empty" ? "" : ""}${list}${m.lib === "ok" ? pager(m).replace('padding:8px 24px', "") : ""}</div>`;
    let ov = "";
    if (m.del) ov += delConfirm(m, "lib");
    if (m.toast) ov += toast(m.toast);
    return mockbar() + frame(viewerBar(m, "pgv") + head + card, ov, av);
  }

  /* ---------- scenes ---------- */
  function editorView(m) {
    let ov = "";
    if (m.pick === "dlg") ov = scrim(dlgA(m));
    else if (m.pick === "drawer") ov = drawerB(m);
    else if (m.pick === "browse") ov = scrim(browseC(m));
    if (m.del) ov += delConfirm(m, m.back);
    if (m.toast) ov += toast(m.toast);
    const mm = Object.assign({}, m, { field: m.pick && !m.replace ? "empty" : m.field });
    return frame(editor(mm), ov, m.viewer ? "SS" : "JA");
  }
  function render() {
    const m = model(state.s);
    document.getElementById("root").innerHTML = m.view === "page" ? pageView(m) : mockbar() + editorView(m);
    document.title = "Private media " + DIRN[state.dir];
  }
  window.PMApp = {
    boot: function (o) {
      state.dir = o.dir;
      state.s = o.s;
      const p = new URLSearchParams(location.search);
      const s = p.get("s");
      if (s && SC[o.dir].some((x) => x[0] === s)) state.s = s;
      if (p.get("phone") === "1") state.dev = "phone";
      render();
    }
  };
})();

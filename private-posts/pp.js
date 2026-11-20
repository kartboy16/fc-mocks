(function () {
  const DOM = "example-advisor.ca";
  const state = { dir: "a", s: "list", dev: "desk", tab: null };
  const PAGES = { a: "a-section.html", b: "b-visibility.html", c: "c-private-space.html" };

  const MINE = [
    { id: "m1", t: "Welcome to my practice", x: "A short introduction to how I work with families, and what to expect from our first meeting.", d: "Nov 18", st: "live", stl: "Live on your website", bg: "pt1", slug: "welcome-to-my-practice", ck: "ok" },
    { id: "m2", t: "March client seminar: notes and talking points", x: "Draft outline for the spring seminar at the community hall.", d: "Nov 17", st: "draft", stl: "Draft", bg: "pt2", slug: "march-client-seminar", ck: "warn" },
    { id: "m3", t: "Why I review your plan every spring", x: "A yearly check-in keeps your goals, budget and insurance in step with real life.", d: "Nov 15", st: "sched", stl: "Scheduled for Nov 24", bg: "pt3", slug: "why-i-review-your-plan-every-spring", ck: "ok" },
    { id: "m4", t: "A note on market ups and downs", x: "What I tell clients when the headlines get loud.", d: "Nov 12", st: "sent", stl: "Emailed Nov 12", bg: "pt4", slug: "a-note-on-market-ups-and-downs", ck: "ok" }
  ];
  const FC = [
    { t: "Five year-end tax moves worth a look", x: "A quick checklist to review before December 31.", d: "Nov 19", bg: "f1" },
    { t: "Mortgage renewal checklist", x: "What to compare before you sign your next term.", d: "Nov 16", bg: "f2" },
    { t: "Understanding your emergency fund", x: "How much to keep, and where to keep it.", d: "Nov 14", bg: "f3" },
    { t: "RRSP or TFSA: which first?", x: "A plain-language way to choose.", d: "Nov 10", bg: "f4" },
    { t: "Starting a college savings plan", x: "Small monthly amounts add up over 18 years.", d: "Nov 8", bg: "f5" },
    { t: "How inflation changes your plan", x: "Why a plan needs a yearly refresh.", d: "Nov 5", bg: "f6" }
  ];
  const SEL = MINE[2];
  let POST = SEL;
  let NOTE = "";

  const SCENES = {
    a: [["all", "All Content"], ["list", "My posts"], ["empty", "Empty"], ["loading", "Loading"], ["error-load", "Load error"], ["create", "Create"], ["error-title", "Title missing"], ["saving", "Saving"], ["saved", "Saved"], ["error-save", "Save error"], ["edit", "Edit"], ["check-idle", "Check: not run"], ["save-check", "Check on save"], ["checking", "Check: checking"], ["check-found", "Check: findings"], ["check-proof", "Check: proofreading"], ["check-fixed", "Check: some fixed"], ["check-clean", "Check: no findings"], ["check-stale", "Check: out of date"], ["check-error", "Check: error"], ["check-partial", "Check: partial error"], ["use", "Use menu"], ["ack", "Acknowledge: website"], ["ack-checked", "Acknowledge: ticked"], ["ack-email", "Acknowledge: email"], ["ack-social", "Acknowledge: social"], ["ack-stale", "Acknowledge: out of date"], ["ack-error", "Acknowledge: error"], ["ack-clear", "Website: no findings"], ["ack-done", "Website: acknowledged"], ["attr-reviewed", "Attribution: reviewed"], ["attr-dismissed", "Attribution: dismissed"], ["attr-ack", "Attribution: acknowledged"], ["attr-undo", "Attribution: undo"], ["attr-undo-support", "Attribution: owner undoes a support review"], ["attr-undo-ack", "Attribution: undo acknowledgement"], ["attr-support", "Attribution: support"], ["attr-admin", "Attribution: admin"], ["attr-ack-support", "Attribution: support acknowledged"], ["attr-time", "Attribution: time formats"], ["held-reschedule-cancel", "Held: reschedule, channel unticked"], ["held-rescheduled-cancel", "Held: rescheduled, channel cancelled"], ["held-email", "Held: email"], ["list-held", "Cards: Held"], ["sched", "Scheduled list"], ["sched-held", "Scheduled: Held"], ["sched-held-only", "Held filter"], ["sched-held-none", "Held: none"], ["sched-empty", "Scheduled: empty"], ["sched-loading", "Scheduled: loading"], ["sched-error", "Scheduled: error"], ["edit-scheduled", "Edit scheduled"], ["edit-warn", "Edit: hold warning"], ["edit-held-saved", "Edit: held saved"], ["held-edit", "Held: editor"], ["held-recheck", "Held: re-check"], ["held-recheck-error", "Re-check error"], ["held-ack", "Held: acknowledge"], ["held-reschedule", "Held: reschedule"], ["held-reschedule-error", "Reschedule error"], ["held-past-time", "Held: past time"], ["held-rescheduled", "Rescheduled"], ["site", "Website"], ["site-done", "Published"], ["email", "Email"], ["social", "Social"], ["no-site", "No website"], ["pv-web", "Client: website"], ["pv-email", "Client: email"], ["pv-social", "Client: social"], ["trash", "Trash"]],
    b: [["all", "All, mixed"], ["search", "Search"], ["mine", "My posts filter"], ["empty", "Empty"], ["loading", "Loading"], ["error-load", "Load error"], ["create", "Create"], ["error-title", "Title missing"], ["saving", "Saving"], ["saved", "Saved"], ["error-save", "Save error"], ["edit", "Edit"], ["use", "Use menu"], ["site", "Website"], ["site-done", "Published"], ["email", "Email"], ["social", "Social"], ["no-site", "No website"], ["pv-web", "Client: website"], ["pv-email", "Client: email"], ["pv-social", "Client: social"], ["trash", "Trash"]],
    c: [["content", "Content tab"], ["copy", "Private copy"], ["list", "My posts"], ["empty", "Empty"], ["loading", "Loading"], ["error-load", "Load error"], ["create", "Create"], ["error-title", "Title missing"], ["saving", "Saving"], ["saved", "Saved"], ["error-save", "Save error"], ["edit", "Edit"], ["use", "Use menu"], ["site", "Website"], ["site-done", "Published"], ["email", "Email"], ["social", "Social"], ["no-site", "No website"], ["pv-web", "Client: website"], ["pv-email", "Client: email"], ["pv-social", "Client: social"], ["trash", "Trash"]]
  };
  const DIRNAME = { a: "A. My posts section", b: "B. Visibility control", c: "C. Private space" };

  function qs() {
    const p = new URLSearchParams(location.search);
    return { s: p.get("s"), phone: p.get("phone") === "1" };
  }
  window.sw = function (k, v) {
    if (k === "dev") state.dev = v; else { state.s = v; state.tab = null; }
    const p = new URLSearchParams(location.search);
    p.set("s", state.s);
    if (state.dev === "phone") p.set("phone", "1"); else p.delete("phone");
    try { history.replaceState(null, "", "?" + p.toString()); } catch (e) {}
    render();
  };
  const go = (s) => `onclick="sw('s','${s}')"`;

  /* ---------- chrome ---------- */
  function mockbar() {
    const links = ["a", "b", "c"].map((d) => `<a href="${PAGES[d]}"${d === state.dir ? ' style="font-weight:700;color:#fff"' : ""}>${d.toUpperCase()}</a>`).join(" · ");
    const btns = SCENES[state.dir].map((x) => `<button type="button" class="${state.s === x[0] ? "on" : ""}" onclick="sw('s','${x[0]}')">${x[1]}</button>`).join("");
    return `<div class="mockbar"><a href="../">All mocks</a> · <a href="index.html">Private posts hub</a> · ${links} · <a href="build-contract.html">Contract</a><span class="sp"></span>
      <button type="button" class="${state.dev === "desk" ? "on" : ""}" onclick="sw('dev','desk')">Desktop</button>
      <button type="button" class="${state.dev === "phone" ? "on" : ""}" onclick="sw('dev','phone')">390</button>${btns}</div>`;
  }
  function rail(active) {
    const it = (k, ico, lbl) => `<div class="ri${active === k ? " on" : ""}"><span class="ico">${ico}</span>${lbl}</div>`;
    return `<nav class="rail"><div class="logo">YFN<small>Your Firm Name</small></div>
      <div class="ri" style="margin-bottom:12px"><span class="ico" style="background:#1976d2;color:#fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center">+</span>Create</div>
      ${it("content", "📄", "Content")}${state.dir === "c" ? it("mine", "🔒", "My posts") : ""}${it("website", "🖥", "Website")}${it("social", "🔗", "Social Media")}${it("email", "✉", "Email Campaigns")}${it("cal", "📅", "Calendar")}</nav>`;
  }
  function frame(active, inner, overlay) {
    return `<div class="stagewrap"><div id="stage" class="${state.dev}"><div class="app">${rail(active)}<div class="col">
      <div class="mbar"><button type="button" aria-label="Menu">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">YFN</div><div class="av">JA</div></div>
      <main class="main">${inner}</main></div></div>${overlay || ""}</div></div>`;
  }
  const scrim = (inner) => `<div class="scrim">${inner}</div>`;
  const toast = (t) => `<div class="toast">${t}</div>`;
  const lock = (t) => `<span class="lockpill">🔒 ${t || "Only me"}</span>`;

  /* ---------- library bits ---------- */
  function libHead(onPill, extraPill) {
    const p = (label, k, n) => `<button type="button" class="pbtn${onPill === k ? " on" : ""}" ${k === "all" ? go(state.dir === "c" ? "content" : "all") : ""}>${label}${n != null ? ` <span class="n">${n}</span>` : ""}</button>`;
    return `<h2 class="grad">What will you share today?</h2><div class="pillsearch"><span>🔍</span> ${state.s === "search" ? "tax" : "Search"}</div>
      <div class="pills">${p("All Content", "all")}${p("Favorites", "fav")}${p("Hidden", "hid")}${p("Topics", "top")}${p("Compliance Approved", "ca")}${p("Pick for me", "pfm")}${extraPill || ""}</div>`;
  }
  const chipFor = (m) => (state.s === "list-held" && m.id === "m3") ? `<span class="chip heldchip">⏸ Held</span>` : `<span class="chip ${m.st === "live" ? "live" : m.st === "sched" ? "sched2" : m.st === "sent" ? "sent2" : "draft2"}">${m.stl}</span>`;
  function privCard(m, withMenu) {
    return `<div class="pc"><div class="th ${m.bg}">${lock()}</div><div class="cb"><div class="ct">${m.t}</div><div class="ce">${m.x}</div><div class="cm">${m.d} ${chipFor(m)}${ckChip(m)}</div></div>
      <div class="ca"><button class="btn quiet" type="button" ${go("edit")}>Edit</button><button class="btn" type="button" ${go("use")}>Use ▾</button>${withMenu ? useMenu() : ""}</div></div>`;
  }
  function fcCard(p, copy) {
    return `<div class="pc"><div class="th ${p.bg}"></div><div class="cb"><div class="ct">${p.t}</div><div class="ce">${p.x}</div><div class="cm">${p.d}</div></div>
      <div class="ca"><button class="btn" type="button">Add Now ▾</button>${copy ? `<button class="btn quiet" type="button" ${go("copy")}>Make a private copy</button>` : ""}</div></div>`;
  }
  function useMenu() {
    const a = state.dir === "a";
    return `<div class="menu pp"><button type="button" ${go(a ? "ack" : "site")}>Add to my website</button><button type="button" ${go(a ? "ack-email" : "email")}>Email my clients</button><button type="button" ${go(a ? "ack-social" : "social")}>Share on social</button><hr><button type="button" ${go("pv-web")}>Preview what clients see</button><button type="button" ${go("edit")}>Edit</button><button type="button" class="dg" ${go("trash")}>Move to Trash</button></div>`;
  }
  function skeletons(n) {
    let h = "";
    for (let i = 0; i < n; i++) h += `<div class="pc sk"><div class="th skel"></div><div class="cb"><div class="skel" style="height:16px;width:80%;margin:0 0 8px"></div><div class="skel" style="height:12px;width:95%;margin:0 0 6px"></div><div class="skel" style="height:12px;width:60%"></div></div><div class="ca"></div></div>`;
    return `<div class="grid">${h}</div>`;
  }
  function emptyBox() {
    return `<div class="empty"><div class="big">🔒</div><h3>You haven't written any posts yet</h3><p>Posts you write here are only visible to you. Other advisors never see them, and they never show up in the Content Library, search or Pick for me.</p><button class="btn pri" type="button" ${go("create")}>Write a post</button></div>`;
  }
  function errBox() {
    return `<div class="errbox"><div class="alert error" style="text-align:left"><b>Couldn't load your posts</b>Check your connection and try again. Nothing was changed.</div><button class="btn pri" type="button" ${go(state.dir === "a" ? "list" : state.dir === "b" ? "mine" : "list")}>Try again</button></div>`;
  }

  /* ---------- checker (direction A) ---------- */
  const CK_TIME = "Nov 19, 2026, 3:12 PM PT";
  const CK_VER = "Checker v1";
  const FIND = {
    c1: { g: "c", k: "Guarantee wording", q: "guarentees better returns", m: "Possible promise of returns.", fx: "aims to improve outcomes", fb: "Fix" },
    c2: { g: "c", k: "No-risk claim", q: "there is no risk to your savings", m: "Wording that implies no risk.", fx: "investing always carries risk", fb: "Fix" },
    c3: { g: "c", k: "Past performance", q: "Past results show a 12% yearly gain, so you can expect the same going forward.", m: "Past results used to predict future results, with no disclosure.", fx: "[Disclosure wording to be supplied]", fb: "Add disclosure" },
    p1: { g: "p", k: "Spelling", q: "guarentees", m: "Possible misspelling.", fx: "guarantees", fb: "Fix" },
    p2: { g: "p", k: "Grammar", q: "Their are", m: "Wrong word.", fx: "There are", fb: "Fix" },
    p3: { g: "p", k: "Repeated word", q: "we we", m: "Repeated word.", fx: "we", fb: "Fix" }
  };
  const ALLOPEN = { c1: "open", c2: "open", c3: "open", p1: "open", p2: "open", p3: "open" };
  const CK_SCENES = ["check-idle", "save-check", "checking", "check-found", "check-proof", "check-fixed", "check-clean", "check-stale", "check-error", "check-partial"];
  /* ---------- reviewer attribution (A) ---------- */
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ACT = { jane: { n: "Jane Advisor", role: "" }, sam: { n: "Sam Support", role: "Support" }, pat: { n: "Pat Admin", role: "Admin" } };
  function parts(iso) {
    const a = iso.split("T"), d = a[0].split("-").map(Number), t = a[1].split(":").map(Number);
    return { y: d[0], mo: d[1], da: d[2], h: t[0], mi: t[1], se: t[2] || 0 };
  }
  const p2 = (n) => String(n).padStart(2, "0");
  function fmtAt(iso, always) {
    const p = parts(iso), ap = p.h >= 12 ? "PM" : "AM", h12 = ((p.h + 11) % 12) + 1;
    const time = h12 + ":" + p2(p.mi) + "\u00a0" + ap;
    const today = p.y === 2026 && p.mo === 11 && p.da === 19;
    if (today && !always) return time;
    if (p.y === 2026) return MON[p.mo - 1] + " " + p.da + ", " + time;
    return MON[p.mo - 1] + " " + p.da + ", " + p.y + ", " + time;
  }
  function fullAt(iso) {
    const p = parts(iso), ap = p.h >= 12 ? "PM" : "AM", h12 = ((p.h + 11) % 12) + 1;
    return MON[p.mo - 1] + " " + p.da + ", " + p.y + ", " + h12 + ":" + p2(p.mi) + ":" + p2(p.se) + " " + ap + " PT (America/Vancouver)";
  }
  function attrLine(verb, w, always, tip) {
    const a = ACT[w.by];
    return `<span class="attr" title="${fullAt(w.iso)}">${verb} by <b>${a.n}</b>${a.role ? ` <span class="role">(${a.role})</span>` : ""}, ${fmtAt(w.iso, always)}${tip ? `<span class="tip">${fullAt(w.iso)}</span>` : ""}</span>`;
  }
  const ATTR_SCENES = ["attr-reviewed", "attr-dismissed", "attr-ack", "attr-undo", "attr-undo-support", "attr-undo-ack", "attr-support", "attr-admin", "attr-ack-support", "attr-time"];
  CK_SCENES.push.apply(CK_SCENES, ATTR_SCENES);
  function attrModel(s) {
    const m = ckModel("check-fixed");
    m.who = { c3: { by: "jane", iso: "2026-11-19T18:40:31" }, p2: { by: "jane", iso: "2026-11-19T18:41:05" } };
    m.openRes = true; m.tab = "c"; m.ack = null; m.toast = null; m.tip = null; m.reopen = {};
    if (s === "attr-dismissed") m.tab = "p";
    if (s === "attr-ack") m.ack = { by: "jane", iso: "2026-11-19T18:45:20" };
    if (s === "attr-undo") { m.f.c3 = "open"; delete m.who.c3; m.reopen.c3 = { by: "jane", iso: "2026-11-19T18:43:10" }; m.toast = "Undone. This finding needs review again."; }
    if (s === "attr-undo-support") { m.f.c3 = "open"; delete m.who.c3; m.reopen.c3 = { by: "jane", iso: "2026-11-19T18:55:42" }; m.toast = "Undone. You reopened a review made by Sam Support."; }
    if (s === "attr-undo-ack") { m.ack = "withdrawn"; m.wd = { by: "jane", iso: "2026-11-19T18:46:30" }; m.toast = "Acknowledgement withdrawn. Acknowledge the open findings again before you schedule, email or share."; }
    if (s === "attr-support") { m.who.c3 = { by: "sam", iso: "2026-11-19T18:52:08" }; m.who.p2 = { by: "sam", iso: "2026-11-19T18:52:40" }; }
    if (s === "attr-ack-support") { m.ack = { by: "sam", iso: "2026-11-19T18:53:15" }; m.who.c3 = { by: "sam", iso: "2026-11-19T18:52:08" }; }
    if (s === "attr-admin") { m.who.c3 = { by: "pat", iso: "2026-11-18T16:15:44" }; m.who.p2 = { by: "pat", iso: "2026-11-18T16:16:20" }; m.ack = { by: "jane", iso: "2026-11-19T18:45:20" }; }
    if (s === "attr-time") { m.who.c3 = { by: "jane", iso: "2026-11-18T16:15:44" }; m.tip = "c3"; }
    return m;
  }
  /* state per scene: status, finding states, tab */
  function ckModel(s) {
    if (ATTR_SCENES.includes(s)) return attrModel(s);
    const m = { status: "idle", f: Object.assign({}, ALLOPEN), tab: "c", stale: false, err: null, time: null };
    if (s === "create" || s === "error-title") m.status = "new";
    else if (s === "check-idle") m.status = "idle";
    else if (s === "save-check" || s === "checking") m.status = "checking";
    else if (s === "check-found") { m.status = "found"; m.time = CK_TIME; }
    else if (s === "check-proof") { m.status = "found"; m.tab = "p"; m.time = CK_TIME; }
    else if (s === "check-fixed") { m.status = "found"; m.time = CK_TIME; m.f = { c1: "fixed", c2: "open", c3: "reviewed", p1: "fixed", p2: "dismissed", p3: "open" }; }
    else if (s === "check-clean") { m.status = "clean"; m.time = CK_TIME; m.f = { c1: "fixed", c2: "fixed", c3: "fixed", p1: "fixed", p2: "fixed", p3: "fixed" }; }
    else if (s === "check-stale") { m.status = "stale"; m.stale = true; m.time = CK_TIME; }
    else if (s === "check-error") { m.status = "error"; m.err = "both"; }
    else if (s === "check-partial") { m.status = "partial"; m.err = "p"; m.time = CK_TIME; }
    else { m.status = "clean"; m.time = CK_TIME; m.f = { c1: "fixed", c2: "fixed", c3: "fixed", p1: "fixed", p2: "fixed", p3: "fixed" }; }
    if (state.tab && ["found", "stale", "partial"].includes(m.status)) m.tab = state.tab;
    return m;
  }
  const openIds = (m, g) => Object.keys(FIND).filter((k) => FIND[k].g === g && m.f[k] === "open");
  function ckCounts(m) { return { c: openIds(m, "c").length, p: openIds(m, "p").length }; }
  function ckChipHtml(m) {
    const n = ckCounts(m);
    const t = n.c + n.p;
    if (m.status === "new") return `<span class="chip draft2">Not checked</span>`;
    if (m.status === "idle") return `<span class="chip draft2">Not checked</span>`;
    if (m.status === "checking") return `<span class="chip sent2"><span class="spin sm"></span> Checking…</span>`;
    if (m.status === "stale") return `<span class="chip sched2">Out of date</span>`;
    if (m.status === "error") return `<span class="chip ckerr">Couldn't run</span>`;
    if (m.status === "partial") return `<span class="chip ckerr">Proofreading couldn't run</span>`;
    if (m.status === "clean" || t === 0) return `<span class="chip live">No findings</span>`;
    return `<span class="chip sched2">${t} to review</span>`;
  }
  function ckChip(p) {
    if (state.dir !== "a" || !p.ck) return "";
    return p.ck === "ok" ? ` <span class="chip live">Checked</span>` : p.ck === "warn" ? ` <span class="chip sched2">6 to review</span>` : ` <span class="chip draft2">Not checked</span>`;
  }
  function ckBodyHtml(m) {
    const none = ["idle", "new", "checking", "error"].includes(m.status);
    const f = none ? { c1: "reviewed", c2: "reviewed", c3: "reviewed", p1: "dismissed", p2: "dismissed", p3: "dismissed" } : m.f;
    const mk = (cls, inner) => `<mark class="mk ${cls}${m.stale ? " old" : ""}">${inner}</mark>`;
    const spell = f.p1 === "fixed" ? "guarantees" : "guarentees";
    const spellHtml = f.p1 === "open" ? mk("p", spell) : spell;
    let s2c;
    if (f.c1 === "fixed") s2c = FIND.c1.fx;
    else if (f.c1 === "open") s2c = mk("c", `${spellHtml} better returns`);
    else s2c = `${spellHtml} better returns`;
    let s2d;
    if (f.c2 === "fixed") s2d = FIND.c2.fx;
    else if (f.c2 === "open") s2d = mk("c", FIND.c2.q);
    else s2d = FIND.c2.q;
    const their = f.p2 === "fixed" ? "There are" : f.p2 === "open" ? mk("p", "Their are") : "Their are";
    const wewe = f.p3 === "fixed" ? "we" : f.p3 === "open" ? mk("p", "we we") : "we we";
    let s4;
    if (f.c3 === "fixed") s4 = "Past results do not predict future results. " + FIND.c3.fx;
    else if (f.c3 === "open") s4 = mk("c", FIND.c3.q);
    else s4 = FIND.c3.q;
    const edited = m.stale ? ` <span class="edited">Call me any time this week.</span>` : "";
    return `<p>Every spring I sit down with each family and walk through what changed: income, goals, insurance and the plan itself.</p><p>Our approach ${s2c} than going it alone, and ${s2d}.</p><p>${their} usually two or three small things to update. Most years ${wewe} finish in about an hour.</p><p>${s4}${edited}</p>`;
  }
  function findingCard(id, m) {
    const d = FIND[id];
    const st = m.f[id];
    const isC = d.g === "c";
    const done = st !== "open";
    const lbl = { fixed: "Fixed", dismissed: "Dismissed", reviewed: "Reviewed" }[st];
    const w = m.who && m.who[id];
    const verb = { fixed: "Fixed", dismissed: "Dismissed", reviewed: "Reviewed" }[st];
    const acts = done
      ? `<span class="fstate">${w ? attrLine(verb, w, false, m.tip === id) : lbl}</span><button class="btn link" type="button" ${w && w.by !== "jane" ? `title="You can undo a review made by ${ACT[w.by].role}"` : ""}>Undo</button>`
      : `<button class="btn quiet" type="button" ${m.stale ? "disabled" : ""}>${d.fb}</button><button class="btn quiet" type="button" ${m.stale ? "disabled" : ""}>${isC ? "Mark reviewed" : "Dismiss"}</button>`;
    return `<div class="fd ${d.g}${done ? " done" : ""}${m.stale ? " stale" : ""}"><div class="fh"><span class="fk">${d.k}</span></div><div class="fq">“${d.q}”</div><div class="fm">${d.m}</div>${!done && m.reopen && m.reopen[id] ? `<div class="fm">${attrLine("Reopened", m.reopen[id], false)}</div>` : ""}${done ? "" : `<div class="fx">Suggested: <b>${d.fx}</b></div>`}<div class="fa">${acts}</div></div>`;
  }
  function ckPanel(m, s) {
    const n = ckCounts(m);
    const tab = m.tab;
    let inner = "";
    if (m.status === "new") {
      inner = `<p class="ckmsg">Checks run automatically when you save.</p>`;
    } else if (m.status === "idle") {
      inner = `<p class="ckmsg">Not checked yet. Checks run automatically when you save. You can also run them now.</p><button class="btn pri" type="button" ${go("checking")}>Run check</button>`;
    } else if (m.status === "checking") {
      inner = `<div class="ckwait"><span class="spin"></span><div><b>Checking compliance and proofreading…</b><div class="hintrow">${s === "save-check" ? "Started automatically after save." : "This takes a few seconds."} You can keep reading. Editing is paused.</div></div></div>`;
    } else if (m.status === "error") {
      inner = `<div class="alert error"><b>The checker couldn't run</b>Your post is saved. You can try again. Until the checks run, you can't schedule, email or share this post.</div><button class="btn pri" type="button" ${go("checking")}>Try again</button>`;
    } else {
      const tabs = `<div class="cktabs"><button type="button" class="${tab === "c" ? "on" : ""}" onclick="ckTab('c')">Compliance <span class="n">${m.status === "clean" ? 0 : n.c}</span></button><button type="button" class="${tab === "p" ? "on" : ""}" onclick="ckTab('p')">Proofreading <span class="n">${m.err === "p" ? "–" : m.status === "clean" ? 0 : n.p}</span></button></div>`;
      let list = "";
      const g = tab;
      const ids = Object.keys(FIND).filter((k) => FIND[k].g === g);
      if (m.stale) list += `<div class="alert warn"><b>You've edited this post since the last check</b>These results may be out of date. Checks run again when you save, or run them now.</div>`;
      if (m.err === "p" && g === "p") {
        list += `<div class="alert error"><b>Proofreading couldn't run</b>Try again. Until it runs, you can't schedule, email or share this post.</div><button class="btn pri" type="button" ${go("checking")}>Try again</button>`;
      } else if (m.status === "clean") {
        list += `<div class="alert ok"><b>No findings</b>${g === "c" ? "Nothing to review in compliance." : "No spelling or grammar issues found."}</div>`;
      } else {
        if (g === "c") list += `<div class="ph">Compliance rule wording to be supplied by legal. These are sample findings.</div>`;
        const open = ids.filter((k) => m.f[k] === "open");
        const res = ids.filter((k) => m.f[k] !== "open");
        list += open.map((k) => findingCard(k, m)).join("");
        if (!open.length) list += `<div class="alert ok"><b>Nothing left to review here</b>${res.length} resolved.</div>`;
        if (res.length) list += `<details class="resd"${m.openRes ? " open" : ""}><summary>Resolved (${res.length})</summary>${res.map((k) => findingCard(k, m)).join("")}</details>`;
      }
      let ackc = "";
      if (m.ack && m.ack !== "withdrawn") ackc = `<div class="ackrec"><div>${attrLine("Acknowledged", m.ack, true)}</div><div class="hintrow">2 open findings, for Website. Valid for this version of the post.</div><button class="btn link" type="button" ${m.ack.by !== "jane" ? `title="You can undo an acknowledgement made by ${ACT[m.ack.by].role}"` : ""} ${go("attr-undo-ack")}>Undo</button></div>`;
      else if (m.ack === "withdrawn") ackc = `<div class="ackrec none"><div><b>Not acknowledged</b></div>${m.wd ? `<div class="hintrow">${attrLine("Acknowledgement withdrawn", m.wd, true)}</div>` : ""}<div class="hintrow">2 findings are still open. Acknowledge them before you schedule, email or share.</div></div>`;
      inner = ackc + tabs + list;
    }
    let foot = "";
    if (m.time) foot = `<div class="ckf"><span>Checked ${m.time} · ${CK_VER}</span><button class="btn link" type="button" ${go("checking")}>${m.stale ? "Run check" : "Run again"}</button></div>`;
    return `<div class="panel ck"><div class="ckh"><h3>Checks</h3>${ckChipHtml(m)}</div>${inner}${foot}</div>`;
  }
  function ckBar(m) {
    const n = ckCounts(m);
    const t = n.c + n.p;
    let tone = "n", txt;
    if (m.status === "new") { txt = "Checks run automatically when you save."; }
    else if (m.status === "idle") { txt = "Not checked yet."; }
    else if (m.status === "checking") { tone = "b"; txt = "Checking compliance and proofreading…"; }
    else if (m.status === "stale") { tone = "w"; txt = "Out of date. You've edited this post since the last check."; }
    else if (m.status === "error") { tone = "e"; txt = "The checker couldn't run. You can't schedule, email or share yet."; }
    else if (m.status === "partial") { tone = "e"; txt = `Compliance: ${n.c} to review. Proofreading couldn't run.`; }
    else if (m.status === "clean" || t === 0) { tone = "g"; txt = "No findings. Compliance and proofreading both checked."; }
    else { tone = "w"; txt = `${t} to review: ${n.c} compliance, ${n.p} proofreading.`; }
    if (m.ack && m.ack !== "withdrawn") txt += " " + attrLine("Acknowledged", m.ack, true) + ".";
    return `<div class="ckbar ${tone}"><b>Checks</b> ${txt}</div>`;
  }
  window.ckTab = function (t) { state.tab = t; render(); };

  function ackList(items) {
    return items.map((k) => { const d = FIND[k]; return `<div class="ackit ${d.g}"><span class="tg">${d.g === "c" ? "Compliance" : "Proofreading"}</span><div><b>“${d.q}”</b><div class="hintrow" style="margin:2px 0 0">${d.m}</div></div></div>`; }).join("");
  }
  function ackDlg(kind) {
    const target = { ack: "Add to your website", "ack-checked": "Add to your website", "ack-email": "Email my clients", "ack-social": "Share on social" }[kind];
    const next = { ack: "ack-done", "ack-checked": "ack-done", "ack-email": "email", "ack-social": "social" }[kind];
    const on = kind === "ack-checked";
    POST = MINE[1];
    const body = `<div class="alert warn"><b>2 findings are still unresolved</b>You can continue, but you need to confirm you've reviewed them. Your confirmation is saved with the time and your name.</div>
      ${ackList(["c2", "p3"])}
      <label class="checkline" style="margin-top:12px"><input type="checkbox" ${on ? "checked" : ""} onchange="document.getElementById('ackgo').disabled=!this.checked"> I've reviewed these findings and want to continue.</label>
      <div class="ph">Acknowledgement wording to be supplied by legal.</div>
      <div class="hintrow">Checked ${CK_TIME} · ${CK_VER}</div>`;
    const foot = `<button class="btn quiet" type="button" ${go("check-fixed")}>Go back and fix</button><button id="ackgo" class="btn pri" type="button" ${on ? "" : "disabled"} ${go(next)}>Continue</button>`;
    return dlg("Review before you continue", `${target} · ${POST.t}`, body, foot);
  }
  function ackStaleDlg() {
    POST = MINE[1];
    return dlg("Checks are out of date", POST.t,
      `<div class="alert warn"><b>You've edited this post since it was last checked</b>Run the checks again before you schedule, email or share it. This keeps the check in step with what your clients will read.</div><div class="hintrow">Last checked ${CK_TIME} · ${CK_VER}</div>`,
      `<button class="btn quiet" type="button" ${go("list")}>Cancel</button><button class="btn pri" type="button" ${go("checking")}>Run checks</button>`);
  }
  function ackErrDlg() {
    POST = MINE[1];
    return dlg("The checks couldn't run", POST.t,
      `<div class="alert error"><b>You can't schedule, email or share yet</b>The compliance and proofreading checks didn't finish. Your post is saved. Try again in a moment.</div>`,
      `<button class="btn quiet" type="button" ${go("list")}>Cancel</button><button class="btn pri" type="button" ${go("checking")}>Try again</button>`);
  }

  /* ---------- held after edit (direction A, #964 follow-up) ---------- */
  const SCHED = [
    { t: MINE[2].t, slug: MINE[2].slug, ch: ["Website", "Email", "Social"], when: "Nov 24, 9:00 AM", held: true },
    { t: "Open house invitation", slug: "open-house-invitation", ch: ["Email"], when: "Nov 27, 10:00 AM" },
    { t: "Holiday office hours", slug: "holiday-office-hours", ch: ["Website", "Social"], when: "Dec 2, 8:30 AM" }
  ];
  const EDITED_AT = "Nov 19, 5:42 PM PT";
  const HELD_SCENES = ["held-reschedule-cancel", "sched-held", "sched-held-only", "held-edit", "edit-held-saved", "held-recheck", "held-recheck-error", "held-ack", "held-reschedule", "held-reschedule-error", "held-past-time", "list-held"];
  const SCHED_ED = ["edit-scheduled", "edit-warn", "edit-held-saved", "held-edit"];
  const isHeld = (s) => HELD_SCENES.includes(s);
  const origWhen = (s) => (s === "held-past-time" ? "Nov 19, 4:00 PM" : "Nov 24, 9:00 AM");
  function stepper(n) {
    const st = (i, l) => `<span class="${n === i ? "on" : n > i ? "done" : ""}">${i} ${l}</span>`;
    return `<div class="steps">${st(1, "Check")}${st(2, "Review")}${st(3, "Schedule")}</div>`;
  }
  function heldBar(s) {
    return `<div class="heldbar"><span class="hi">⏸</span><div><b>Held: edited after scheduling</b><div>It will not send. It was scheduled for ${origWhen(s)} on Website, Email and Social. Edited ${EDITED_AT}.</div></div><button class="btn pri" type="button" ${go("held-recheck")}>Re-check &amp; reschedule</button></div>`;
  }
  function schedBar() {
    return `<div class="schedbar"><span class="hi">📅</span><div><b>Scheduled for Nov 24, 2026, 9:00 AM</b><div>Website, Email and Social. Saving changes holds it until you check it and schedule it again.</div></div></div>`;
  }
  function chn(list, off) { return list.map((c) => `<span class="chn${off ? " off" : ""}">${c}</span>`).join(""); }
  function schedList(s) {
    const held = isHeld(s) && !["list-held"].includes(s);
    const onlyHeld = s === "sched-held-only";
    const past = s === "held-past-time";
    let rows = SCHED.map((r, i) => Object.assign({}, r, { held: i === 0 && held }));
    if (s === "held-rescheduled") rows[0].ch = ["Website", "Social"];
    if (s === "held-rescheduled-cancel") rows[0].ch = ["Website"];
    if (onlyHeld) rows = rows.filter((r) => r.held);
    const nHeld = held ? 1 : 0;
    const tabs = `<div class="fchips"><button type="button" class="${onlyHeld ? "" : "on"}" ${go(held ? "sched-held" : "sched")}>All scheduled <span class="n">${SCHED.length}</span></button><button type="button" class="held ${onlyHeld ? "on" : ""}" ${go(held ? "sched-held-only" : "sched-held-none")}>⏸ Held <span class="n">${nHeld}</span></button></div>`;
    if (s === "sched-held-none") {
      return `${tabs}<div class="empty" style="padding:32px 24px"><div class="big">✓</div><h3>Nothing is on hold</h3><p>Everything you scheduled is ready to send.</p><button class="btn" type="button" ${go("sched")}>Show all scheduled</button></div>`;
    }
    const banner = held ? `<div class="alert warn"><b>1 post is on hold</b>You edited it after it was scheduled. Held posts are not sent until you check them and schedule them again.</div>` : "";
    const when = (r) => r.held ? `<div class="wh"><s>${origWhen(s)}</s></div><div class="reason">Held: edited ${EDITED_AT}, after it was scheduled. It will not send.${past ? " The original time has passed." : ""}</div>` : `<div>${r.when}</div>`;
    const status = (r) => r.held ? `<span class="chip heldchip">⏸ Held</span>` : `<span class="chip sched2">Scheduled</span>`;
    const acts = (r) => r.held
      ? `<button class="btn pri sm" type="button" ${go("held-recheck")}>Re-check &amp; reschedule</button><button class="btn quiet sm" type="button" ${go("held-edit")}>Edit</button>`
      : `<button class="btn quiet sm" type="button" ${go("edit-scheduled")}>Edit</button>`;
    const trs = rows.map((r) => `<tr class="${r.held ? "heldrow" : ""}"><td><div class="t">${r.t}</div><div class="u">${DOM}/news/${r.slug}</div></td><td>${chn(r.ch, r.held)}</td><td>${when(r)}</td><td>${status(r)}</td><td><div class="acts">${acts(r)}</div></td></tr>`).join("");
    const cards = rows.map((r) => `<div class="pcard ${r.held ? "heldcard" : ""}"><div class="nm">${r.t}</div><div style="margin:6px 0">${chn(r.ch, r.held)}</div><div class="meta">${status(r)} ${r.held ? "" : r.when}</div>${r.held ? `<div class="wh" style="margin-top:6px"><s>${origWhen(s)}</s></div><div class="reason">Held: edited ${EDITED_AT}, after it was scheduled. It will not send.${past ? " The original time has passed." : ""}</div>` : ""}<div class="acts" style="justify-content:flex-start;margin-top:8px">${acts(r)}</div></div>`).join("");
    return `${banner}${tabs}<div class="card list-wrap"><table class="list"><thead><tr><th>Post</th><th>Sends to</th><th>When</th><th>Status</th><th></th></tr></thead><tbody>${trs}</tbody></table><div class="cards">${cards}</div></div>`;
  }
  function heldEmail() {
    return `<div class="ed-top"><button class="btn link" type="button" ${go("sched-held")}>← Scheduled</button><h2>Email to the advisor</h2></div><div class="pvwrap"><div class="mailv"><div class="mh"><b>To:</b> Jane Advisor &lt;jane@example.com&gt;<br><b>From:</b> Your Firm Name &lt;notifications@example.com&gt;<br><b>Subject:</b> Your scheduled post is on hold: ${MINE[2].t}</div>
      <div class="mb"><p>Hi Jane,</p><p>You edited <b>${MINE[2].t}</b> after it was scheduled, so it is on hold and will not send.</p>
      <p>Held:</p><ul style="margin:0 0 12px;padding-left:20px"><li>Website: was scheduled for Nov 24, 2026, 9:00 AM PT</li><li>Email: was scheduled for Nov 24, 2026, 9:00 AM PT</li><li>Social: was scheduled for Nov 24, 2026, 9:00 AM PT</li></ul><p>Edited ${EDITED_AT}.</p>
      <a class="cta" href="#" ${go("held-edit")}>Review held post</a>
      <div class="ph">Email wording to be supplied. The button opens this post in the app: My posts, Scheduled, Held, with the post open.</div>
      <p style="font-size:13px;color:#78909c">Button not working? Copy this address into your browser:<br>app.example.com/my-posts/scheduled/held/9f3c2a</p>
      <p style="font-size:13px;color:#78909c">To send it, check it and schedule it again. Nothing is sent until you do. If you didn't edit this post, contact support.</p></div>
      <div class="mf">You are getting this because you edited a scheduled post.</div></div></div>`;
  }
  function viewToggle(on) {
    const held = HELD_SCENES.includes(state.s) && state.s !== "list-held";
    return `<div class="seg"><button type="button" class="${on === "all" ? "on" : ""}" ${go("list")}>All</button><button type="button" class="${on === "sched" ? "on" : ""}" ${go("sched")}>Scheduled${held ? ' <span class="hdot"></span>' : ""}</button><button type="button" disabled>Published</button></div>`;
  }
  function schedChan(noSocial) {
    return `<div class="hintrow" style="margin:0 0 6px">Untick a channel to cancel it. At least one stays ticked.</div>
      <div class="checkline"><input type="checkbox" checked> Website <span class="hintrow" style="margin:0 0 0 4px">${DOM}/news/${MINE[2].slug}</span></div>
      <div class="checkline"><input type="checkbox" checked> Email: Newsletter (128 contacts)</div>
      <div class="chnote">Email goes back to Drafts to rebuild. Its text is a snapshot of the old post, so it can't be rescheduled in place.</div>
      <div class="checkline"><input type="checkbox" ${noSocial ? "" : "checked"}> Social: LinkedIn and Facebook</div>${noSocial ? `<div class="chnote off">Social will be cancelled. It won't be sent.</div>` : ""}`;
  }
  const heldFoot = (back, label, next) => `<button class="btn quiet" type="button" ${go(back)}>Back</button><button class="btn pri" type="button" ${go(next)}>${label}</button>`;
  function heldDlg(s) {
    POST = MINE[2];
    const sub = `Re-check &amp; reschedule · ${POST.t}`;
    if (s === "held-recheck") return dlg(`Checking your post${stepper(1)}`, sub, `<div class="ckwait"><span class="spin"></span><div><b>Checking compliance and proofreading…</b><div class="hintrow">Your post is still on hold. Nothing is sent while this runs.</div></div></div>`, `<button class="btn quiet" type="button" ${go("sched-held")}>Close</button>`);
    if (s === "held-recheck-error") return dlg(`The checks couldn't run${stepper(1)}`, sub, `<div class="alert error"><b>Your post is still on hold</b>Nothing was sent and nothing was changed. Try again in a moment.</div>`, `<button class="btn quiet" type="button" ${go("sched-held")}>Close</button><button class="btn pri" type="button" ${go("held-recheck")}>Try again</button>`);
    if (s === "held-ack") {
      const body = `<div class="alert warn"><b>2 findings are still unresolved</b>You can continue, but you need to confirm you've reviewed them. Your confirmation is saved with the time and your name.</div>${ackList(["c2", "p3"])}
        <label class="checkline" style="margin-top:12px"><input type="checkbox" onchange="document.getElementById('ackgo').disabled=!this.checked"> I've reviewed these findings and want to continue.</label>
        <div class="ph">Acknowledgement wording to be supplied by legal.</div><div class="hintrow">Checked Nov 19, 2026, 5:44 PM PT · ${CK_VER}</div>`;
      return dlg(`Review before you continue${stepper(2)}`, sub, body, `<button class="btn quiet" type="button" ${go("held-edit")}>Go back and fix</button><button id="ackgo" class="btn pri" type="button" disabled ${go("held-reschedule")}>Continue</button>`);
    }
    if (s === "held-reschedule") return dlg(`Schedule again${stepper(3)}`, sub,
      `<div class="alert ok"><b>Checks done</b>You acknowledged 2 findings, Nov 19, 2026, 5:45 PM PT, by Jane Advisor.</div>
       <div class="row2"><div class="field"><label>Date</label><input value="Nov 24, 2026"></div><div class="field"><label>Time</label><input value="9:00 AM"></div></div>
       <div class="hintrow" style="margin:-6px 0 12px">Your original date and time are filled in. Change them if you like.</div>${schedChan()}
       <div class="ph">Compliance wording to be supplied by legal.</div>`, heldFoot("held-ack", "Schedule again for Nov 24", "held-rescheduled"));
    if (s === "held-reschedule-cancel") return dlg(`Schedule again${stepper(3)}`, sub,
        `<div class="alert ok"><b>Checks done</b>You acknowledged 2 findings, Nov 19, 2026, 5:45 PM PT, by Jane Advisor.</div>
         <div class="row2"><div class="field"><label>Date</label><input value="Nov 24, 2026"></div><div class="field"><label>Time</label><input value="9:00 AM"></div></div>${schedChan(true)}
         <div class="ph">Compliance wording to be supplied by legal.</div>`, heldFoot("held-ack", "Schedule again for Nov 24", "held-rescheduled-cancel"));
      if (s === "held-reschedule-error") return dlg(`Schedule again${stepper(3)}`, sub,
      `<div class="alert error"><b>Couldn't schedule it again</b>Your post is still on hold and nothing was sent. Try again in a moment.</div>
       <div class="row2"><div class="field"><label>Date</label><input value="Nov 24, 2026"></div><div class="field"><label>Time</label><input value="9:00 AM"></div></div>${schedChan()}`, heldFoot("held-ack", "Try again", "held-rescheduled"));
    if (s === "held-past-time") return dlg(`Schedule again${stepper(3)}`, sub,
      `<div class="alert warn"><b>The original time has passed</b>It was scheduled for Nov 19, 2026, 4:00 PM. Pick a new date and time.</div>
       <div class="row2"><div class="field"><label>Date</label><input class="bad" value="Nov 20, 2026"></div><div class="field"><label>Time</label><input class="bad" value="9:00 AM"></div></div>
       <div class="hintrow" style="margin:-6px 0 12px">Suggested: tomorrow at 9:00 AM. The time must be in the future.</div>${schedChan()}
       <div class="ph">Compliance wording to be supplied by legal.</div>`, heldFoot("held-ack", "Schedule for Nov 20", "held-rescheduled"));
    return "";
  }
  function resultDlg(s) {
    POST = MINE[2];
    const cancel = s === "held-rescheduled-cancel";
    const row = (c, d, w, cls) => `<div class="ackit ${cls || "ch"}"><span class="tg">${c}</span><div><b>${d}</b><div class="hintrow" style="margin:2px 0 0">${w}</div></div></div>`;
    const body = `<div class="alert ok"><b>${cancel ? "Scheduled again on Website" : "Scheduled again on Website and Social"}</b>Nov 24, 2026, 9:00 AM. Your post is no longer on hold.</div>
      ${row("Website", `${DOM}/news/${POST.slug}`, "Scheduled for Nov 24, 9:00 AM")}
      ${row("Email", "Newsletter: back in Drafts", "Rebuild the email from the post, then schedule it. Nothing was sent.", "drafts")}
      ${cancel ? row("Social", "LinkedIn and Facebook: cancelled", "You unticked it. It won't be sent.", "off") : row("Social", "LinkedIn and Facebook", "Scheduled for Nov 24, 9:00 AM")}`;
    return dlg("Scheduled again", POST.t, body, `<button class="btn quiet" type="button" ${go("list")}>Go to Drafts</button><button class="btn pri" type="button" ${go("sched")}>Done</button>`);
  }
  function editWarnDlg() {
    POST = MINE[2];
    const it = (c, d, w) => `<div class="ackit ch"><span class="tg">${c}</span><div><b>${d}</b><div class="hintrow" style="margin:2px 0 0">${w}</div></div></div>`;
    const body = `<div class="alert warn"><b>This post is scheduled for Nov 24, 2026, 9:00 AM</b>Saving changes holds it until you check it and schedule it again. Nothing is sent while it is on hold.</div>
      ${it("Website", `${DOM}/news/${POST.slug}`, "Nov 24, 9:00 AM")}${it("Email", "Newsletter (128 contacts)", "Nov 24, 9:00 AM")}${it("Social", "LinkedIn and Facebook", "Nov 24, 9:00 AM")}
      <div class="hintrow">You'll find it in Scheduled, under Held. Your original time is kept for when you schedule it again.</div>`;
    return dlg("Saving will hold this post", POST.t, body, `<button class="btn quiet" type="button" ${go("edit-scheduled")}>Cancel</button><button class="btn pri" type="button" ${go("edit-held-saved")}>Save and hold</button>`);
  }

  /* ---------- editor ---------- */
  function editor(mode) {
    const edit = mode === "edit" || mode === "saved" || mode === "saving" && false;
    const isA = state.dir === "a";
    const ckScene = isA && CK_SCENES.includes(mode);
    const filled = mode !== "create" && mode !== "error-title";
    const schedEd = isA && SCHED_ED.includes(mode);
    const heldEd = schedEd && (mode === "edit-held-saved" || mode === "held-edit");
    const ckm = !isA ? null : schedEd ? (mode === "edit-scheduled" ? ckModel("check-clean") : mode === "edit-warn" ? { status: "idle", f: {}, tab: "c" } : ckModel("check-fixed")) : ckModel(mode === "saving" ? "create" : mode);
    const busy = mode === "saving" || (isA && ckm.status === "checking");
    const m = ckScene ? MINE[1] : SEL;
    const title = filled ? (schedEd ? MINE[2].t : m.t) : mode === "error-title" ? "" : "";
    const sum = filled ? (schedEd ? MINE[2].x : m.x) : "";
    const h = mode === "create" || mode === "error-title" ? "New post" : "Edit post";
    const bodyHtml = schedEd ? (mode === "edit-warn" ? ckBodyHtml(ckModel("check-clean")) + ` <p><span class="edited">I also offer a short call in January for anyone who wants a second look.</span></p>` : ckBodyHtml(mode === "edit-scheduled" ? ckModel("check-clean") : ckModel("check-fixed"))) : ckScene ? ckBodyHtml(ckm) : filled
      ? `<p>Every spring I sit down with each family and walk through what changed: income, goals, insurance and the plan itself.</p><p>It takes about an hour, and most years we make two or three small adjustments. Some years nothing needs to move, which is a good result too.</p><p>If it has been more than a year since we last spoke, reply to this note and we will find a time.</p>`
      : `<p class="ph2">Start writing your post…</p>`;
    const vis = state.dir === "b"
      ? `<div class="panel"><h3>Who can see this post</h3>
          <div class="vis on"><span class="ic">🔒</span><div><b>Only me</b><small>Default. Nobody else can find or open it.</small></div></div>
          <div class="vis off"><span class="ic">👥</span><div><b>Other advisors</b><small>Not available</small></div></div>
          <p class="hintrow">You decide where it goes later: your website, email or social.</p></div>`
      : "";
    const img = `<div class="panel"><h3>Featured image</h3>${filled ? `<div class="imgdrop has ${m.bg}">sample-image.jpg</div>` : `<div class="imgdrop">Drop an image or <a href="#" onclick="return false">browse</a></div>`}</div>`;
    const lockBanner = state.dir === "b" ? "" : `<div class="panel lockrow" style="padding:12px 16px;display:flex;gap:10px;align-items:center;margin:0 0 12px;background:#f5f7f8"><span class="lockpill">🔒 Only you can see this post</span><span style="font-size:13px;color:#5b6572">Other advisors, the Content Library, search and Pick for me never show it.</span></div>`;
    const alerts = (mode === "error-save" ? `<div class="alert error"><b>Couldn't save your post</b>Your changes are still on this screen. Try again in a moment.</div>` : "") +
      (mode === "error-title" ? `<div class="alert error"><b>Add a title</b>A post needs a title before it can be saved.</div>` : "");
    const back = state.dir === "c" ? "← My posts" : state.dir === "a" ? "← My posts" : "← Content";
    const backTo = state.dir === "b" ? "mine" : "list";
    const top = `<div class="ed-top"><button class="btn link" type="button" ${go(backTo)}>${back}</button><h2>${h}</h2>${heldEd ? `<span class="chip heldchip">⏸ Held</span>` : ""}${state.dir === "b" ? lock() : ""}<span class="sp"></span>
      ${mode === "saved" || mode === "save-check" ? `<span class="saved-note">Saved just now</span>` : ""}
      <button class="btn quiet" type="button" ${busy ? "disabled" : ""} ${go(isA ? (schedEd ? (heldEd ? "edit-held-saved" : "edit-warn") : "save-check") : "saved")}>Save draft</button>
      <button class="btn pri" type="button" ${busy ? "disabled" : ""} ${go(isA ? (schedEd ? (heldEd ? "edit-held-saved" : "edit-warn") : "save-check") : "saving")}>${mode === "saving" ? "Saving…" : "Save post"}</button></div>`;
    const main = `<div class="panel">
        <div class="field"><label>Title</label><input class="${mode === "error-title" ? "bad" : ""}" value="${title}" placeholder="Post title" ${busy ? "disabled" : ""}>${mode === "error-title" ? `<span class="err">Title is required</span>` : ""}</div>
        <div class="field"><label>Summary</label><textarea placeholder="One or two sentences shown on the card" ${busy ? "disabled" : ""}>${sum}</textarea></div>
        <div class="field" style="margin:0"><label>Post</label><div class="tb"><span>B</span><span><i>I</i></span><span><u>U</u></span><span>❝</span><span>≡</span><span>🔗</span><span>🖼</span></div><div class="ebody">${bodyHtml}</div></div></div>`;
    const side = `<div>${isA ? ckPanel(ckm, mode) : ""}${vis}${img}</div>`;
    const inner = `${top}${alerts}${lockBanner}${schedEd ? (heldEd ? heldBar("held-edit") : schedBar()) : ""}${isA ? ckBar(ckm) : ""}<div class="ed-grid${ckScene && ATTR_SCENES.includes(mode) ? " attrfirst" : ""}">${main}${side}</div>`;
    return inner;
  }

  /* ---------- use dialogs ---------- */
  function dlg(title, sub, body, foot) {
    return `<div class="dlg sm" style="max-width:520px"><div class="dh"><div>${title}${sub ? `<div class="sub">${sub}</div>` : ""}</div><button class="ico-btn" type="button" ${go(baseList())}>✕</button></div><div class="db">${body}</div><div class="df">${foot}</div></div>`;
  }
  function baseList() { if (state.dir === "a" && /^(held-|sched)/.test(state.s)) return "sched-held"; return state.dir === "b" ? "mine" : "list"; }
  function siteDlg() {
    return dlg("Add to your website", POST.t,
      `<div class="timing"><label><input type="radio" name="t"> Publish now</label><label><input type="radio" name="t" checked> Schedule</label></div>
       <div class="row2"><div class="field"><label>Date</label><input value="Nov 24, 2026"></div><div class="field"><label>Time</label><input value="9:00 AM"></div></div>
       <div class="linkprev"><span>It will be published at</span><b>${DOM}/news/${POST.slug}</b></div>
       ${NOTE}<div class="alert info"><b>This puts the post on your website</b>Anyone with the link can read it there. It is still not shared with other advisors.</div>
       <div class="ph">Compliance wording to be supplied by legal.</div>`,
      `<button class="btn quiet" type="button" ${go("pv-web")}>Preview</button><button class="btn" type="button" ${go(baseList())}>Cancel</button><button class="btn pri" type="button" ${go("site-done")}>Schedule for Nov 24</button>`);
  }
  function emailDlg() {
    return dlg("Email my clients", POST.t,
      `<div class="field"><label>Send to</label><select><option>Newsletter (128 contacts)</option></select></div>
       <div class="field"><label>From</label><input value="Jane Advisor &lt;jane@${DOM}&gt;" readonly></div>
       <div class="field"><label>Subject</label><input value="${POST.t}"></div>
       <div class="linkprev"><span>The email links to</span><b>${DOM}/news/${POST.slug}</b></div>
       ${NOTE}<div class="alert info"><b>Your clients will read it on your website</b>Publishing the email also publishes this post on ${DOM}.</div>
       <div class="ph">Compliance wording to be supplied by legal.</div>`,
      `<button class="btn quiet" type="button" ${go("pv-email")}>Preview</button><button class="btn" type="button" ${go(baseList())}>Cancel</button><button class="btn pri" type="button" ${go("site-done")}>Continue</button>`);
  }
  function socialDlg() {
    return dlg("Share on social", POST.t,
      `<div class="checkline"><input type="checkbox" checked> LinkedIn (Jane Advisor)</div><div class="checkline"><input type="checkbox" checked> Facebook (Your Firm Name)</div>
       <div class="field" style="margin-top:10px"><label>Caption</label><textarea>A yearly check-in keeps your goals, budget and insurance in step. Read more on my website.</textarea></div>
       <div class="linkprev"><span>The post links to</span><b>${DOM}/news/${POST.slug}</b></div>
       ${NOTE}<div class="alert info"><b>Followers open the post on your website</b>Sharing also publishes this post on ${DOM}.</div>
       <div class="ph">Compliance wording to be supplied by legal.</div>`,
      `<button class="btn quiet" type="button" ${go("pv-social")}>Preview</button><button class="btn" type="button" ${go(baseList())}>Cancel</button><button class="btn pri" type="button" ${go("site-done")}>Schedule posts</button>`);
  }
  function noSiteDlg() {
    return dlg("Connect your website first", "", `<div class="alert warn"><b>Your website isn't connected yet</b>Posts you write are shared through your own website, so your clients always see your address. Connect it, then try again.</div>`,
      `<button class="btn" type="button" ${go(baseList())}>Not now</button><button class="btn pri" type="button">Connect website</button>`);
  }
  function trashDlg() {
    const m = MINE[0];
    return `<div class="confirm"><div class="ct danger">Move "${m.t}" to Trash?</div><p>It is live on your website, so it will come down from ${DOM}/news/${m.slug} too. You can restore it from Trash for 60 days, then it is deleted for good.</p><div class="cf"><button class="btn quiet" type="button" ${go(baseList())}>Cancel</button><button class="btn pri" style="background:#c62828" type="button" ${go(baseList())}>Move to Trash</button></div></div>`;
  }
  function copyDlg() {
    return `<div class="confirm"><div class="ct">Make a private copy of "Mortgage renewal checklist"?</div><p>The copy goes to My posts. Only you can see it, and you can change anything in it. The original stays in the Content Library, unchanged.</p><div class="cf"><button class="btn quiet" type="button" ${go("content")}>Cancel</button><button class="btn pri" type="button" ${go("edit")}>Make a copy</button></div></div>`;
  }

  /* ---------- client previews ---------- */
  function pvTabs(on) {
    const b = (k, l) => `<button type="button" class="pbtn${on === k ? " on" : ""}" ${go(k)}>${l}</button>`;
    return `<div class="ed-top"><button class="btn link" type="button" ${go(baseList())}>← Back</button><h2>Preview</h2></div><div class="pvtabs">${b("pv-web", "Website")}${b("pv-email", "Email")}${b("pv-social", "Social")}</div>`;
  }
  function pvWeb() {
    return `${pvTabs("pv-web")}<div class="pvwrap"><div class="browser"><div class="bar"><span>●●●</span><span class="url">${DOM}/news/${SEL.slug}</span></div>
      <div class="site-h"><b>Jane Advisor</b><span>Your Firm Name · Home · News · Contact</span></div>
      <div class="site-art"><h1>${SEL.t}</h1><div class="by">Jane Advisor · Nov 24, 2026</div>
      <p>Every spring I sit down with each family and walk through what changed: income, goals, insurance and the plan itself.</p><p>It takes about an hour, and most years we make two or three small adjustments.</p><p>If it has been more than a year since we last spoke, reply to this note and we will find a time.</p></div>
      <div class="site-f">© 2026 Your Firm Name · ${DOM}</div></div></div>`;
  }
  function pvEmail() {
    return `${pvTabs("pv-email")}<div class="pvwrap"><div class="mailv"><div class="mh"><b>From:</b> Jane Advisor &lt;jane@${DOM}&gt;<br><b>Subject:</b> ${SEL.t}</div>
      <div class="mb"><p>Hello,</p><p>Every spring I review each client's plan. Here is why it matters, and what we look at.</p><a class="cta" href="#" onclick="return false">Read the post</a><p style="font-size:13px;color:#78909c">${DOM}/news/${SEL.slug}</p><p>Jane Advisor<br>Your Firm Name</p></div>
      <div class="mf">Your Firm Name · 123 Example Street, Sampletown · Unsubscribe</div></div></div>`;
  }
  function pvSocial() {
    return `${pvTabs("pv-social")}<div class="pvwrap"><div class="soc"><div class="who"><div class="av2">JA</div><div><b>Jane Advisor</b><div style="font-size:12px;color:#78909c">Your Firm Name · Nov 24</div></div></div>
      <div>A yearly check-in keeps your goals, budget and insurance in step. Read more on my website.</div>
      <div class="lc"><div class="im pt3"></div><div class="tx"><small>${DOM}</small><b>${SEL.t}</b></div></div></div></div>`;
  }

  /* ---------- scenes per direction ---------- */
  function contentActive() { return state.dir === "c" ? "content" : "content"; }
  function overlayFor(s, withListMenu) {
    if (s === "ack" || s === "ack-checked" || s === "ack-email" || s === "ack-social") return scrim(ackDlg(s));
    if (s === "ack-stale") return scrim(ackStaleDlg());
    if (s === "ack-error") return scrim(ackErrDlg());
    if (s === "ack-clear" || s === "ack-done") return scrim(siteDlg());
    if (s === "site") return scrim(siteDlg());
    if (s === "email") return scrim(emailDlg());
    if (s === "social") return scrim(socialDlg());
    if (s === "no-site") return scrim(noSiteDlg());
    if (s === "trash") return scrim(trashDlg());
    if (s === "site-done") return toast(`Scheduled for Nov 24 on ${DOM}. Only you can see it until then.`);
    return "";
  }
  function myGrid(menuOn, at) {
    return `<div class="grid">${MINE.map((m, i) => privCard(m, menuOn && i === (at == null ? 2 : at))).join("")}</div>`;
  }

  function sceneA() {
    const s = state.s;
    const mine = `<button type="button" class="pbtn${s !== "all" ? " on" : ""}" ${go("list")}>🔒 My posts <span class="n">${s === "empty" ? 0 : MINE.length}</span></button>`;
    if (s === "all") return frame("content", `${libHead("all", mine)}<div class="grid">${FC.map((p) => fcCard(p)).join("")}</div>`);
    if (["pv-web", "pv-email", "pv-social"].includes(s)) return frame("content", { "pv-web": pvWeb, "pv-email": pvEmail, "pv-social": pvSocial }[s]());
    if (["create", "error-title", "saving", "saved", "error-save", "edit"].concat(CK_SCENES, SCHED_ED).includes(s)) return frame("content", editor(s), s === "saved" ? toast("Saved. Only you can see this post.") : s === "save-check" ? toast("Saved. Running checks…") : ATTR_SCENES.includes(s) ? (attrModel(s).toast ? toast(attrModel(s).toast) : "") : s === "edit-warn" ? scrim(editWarnDlg()) : s === "edit-held-saved" ? toast("Saved. This post is on hold until you check it and schedule it again.") : "");
    if (s === "held-email") return frame("content", heldEmail());
    if (/^(sched|held-)/.test(s)) {
      const hd = `${libHead("mine", mine)}<div class="secthead"><h2>My posts</h2>${lock("Only you can see these")}${viewToggle("sched")}<span class="sp"></span><button class="btn pri" type="button" ${go("create")}>+ Write a post</button></div>`;
      let bd;
      if (s === "sched-empty") bd = `<div class="empty"><div class="big">📅</div><h3>Nothing is scheduled</h3><p>Posts you schedule to your website, email or social show up here.</p><button class="btn" type="button" ${go("list")}>Back to My posts</button></div>`;
      else if (s === "sched-loading") bd = `<div class="card" style="padding:16px">${[1, 2, 3].map(() => `<div class="skel" style="height:56px;margin:0 0 10px"></div>`).join("")}</div>`;
      else if (s === "sched-error") bd = `<div class="errbox"><div class="alert error" style="text-align:left"><b>Couldn't load your scheduled posts</b>Check your connection and try again. Nothing was changed, and nothing was sent.</div><button class="btn pri" type="button" ${go("sched")}>Try again</button></div>`;
      else bd = schedList(s);
      const ov = (s === "held-rescheduled" || s === "held-rescheduled-cancel") ? scrim(resultDlg(s)) : (heldDlg(s) ? scrim(heldDlg(s)) : "");
      return frame("content", hd + bd, ov);
    }
    POST = MINE[1]; NOTE = "";
    if (s === "list") { /* toggle shown below */ }
    if (s === "ack-clear") { POST = MINE[2]; NOTE = `<div class="alert ok"><b>Checked, no findings</b>Compliance and proofreading, ${CK_TIME}.</div>`; }
    if (s === "ack-done") NOTE = `<div class="alert ok"><b>You acknowledged 2 findings</b>Nov 19, 2026, 3:20 PM PT, by Jane Advisor. This is saved with the post.</div>`;
    const head = `${libHead("mine", mine)}<div class="secthead"><h2>My posts</h2>${lock("Only you can see these")}${viewToggle("all")}<span class="sp"></span><button class="btn pri" type="button" ${go("create")}>+ Write a post</button></div>`;
    let body;
    if (s === "empty") body = emptyBox();
    else if (s === "loading") body = skeletons(4);
    else if (s === "error-load") body = errBox();
    else body = myGrid(s === "use", 1);
    return frame("content", head + body, overlayFor(s));
  }

  function sceneB() {
    const s = state.s;
    const srcOn = s === "mine" || s === "empty" || s === "loading" || s === "error-load" ? "mine" : "all";
    const src = `<div class="srcrow"><span class="lbl">Source</span><div class="seg"><button type="button" class="${srcOn === "all" ? "on" : ""}" ${go("all")}>All</button><button type="button" ${go("all")}>Content Library</button><button type="button" class="${srcOn === "mine" ? "on" : ""}" ${go("mine")}>🔒 My posts</button></div></div>`;
    if (["pv-web", "pv-email", "pv-social"].includes(s)) return frame("content", { "pv-web": pvWeb, "pv-email": pvEmail, "pv-social": pvSocial }[s]());
    if (["create", "error-title", "saving", "saved", "error-save", "edit"].includes(s)) return frame("content", editor(s), s === "saved" ? toast("Saved. This post is Only me.") : "");
    const newBtn = `<div class="secthead"><span class="sp"></span><button class="btn pri" type="button" ${go("create")}>+ Write a post</button></div>`;
    let body;
    if (s === "empty") body = emptyBox();
    else if (s === "loading") body = skeletons(6);
    else if (s === "error-load") body = errBox();
    else if (s === "mine") body = myGrid(false);
    else if (s === "search") {
      body = `<div class="grid">${privCard({ ...MINE[2], t: "Year-end tax talking points for clients", x: "Notes for my own clients, not for the library.", st: "draft", stl: "Draft", bg: "pt2" }, false)}${fcCard(FC[0])}${fcCard({ t: "Tax-free savings: common questions", x: "Short answers to what clients ask most.", d: "Oct 29", bg: "f3" })}</div>`;
    } else {
      const mixed = [FC[0], MINE[0], FC[1], MINE[1], FC[2], MINE[2], FC[3], MINE[3], FC[4]];
      body = `<div class="grid">${mixed.map((p) => (p.id ? privCard(p, s === "use" && p.id === "m3") : fcCard(p))).join("")}</div>`;
    }
    return frame("content", libHead("all") + src + newBtn + body, overlayFor(s));
  }

  function sceneC() {
    const s = state.s;
    if (["pv-web", "pv-email", "pv-social"].includes(s)) return frame("mine", { "pv-web": pvWeb, "pv-email": pvEmail, "pv-social": pvSocial }[s]());
    if (s === "content" || s === "copy") {
      return frame("content", `${libHead("all")}<div class="grid">${FC.map((p, i) => fcCard(p, i === 1)).join("")}</div>`, s === "copy" ? scrim(copyDlg()) : "");
    }
    const list = (on) => `<div class="mini">${MINE.map((m) => `<div class="it${on === m.id ? " on" : ""}" ${go("edit")}><b>${m.t}</b><small>${m.d} · ${m.stl}</small></div>`).join("")}</div>`;
    if (["create", "error-title", "saving", "saved", "error-save", "edit"].includes(s)) {
      const ed = editor(s);
      const inner = state.dev === "phone" ? ed : `<div class="secthead"><h2>🔒 My posts</h2><span class="sp"></span></div><div class="split">${list(s === "create" || s === "error-title" ? "" : "m3")}<div>${ed}</div></div>`;
      return frame("mine", inner, s === "saved" ? toast("Saved. Only you can see this post.") : "");
    }
    const head = `<div class="secthead"><h2>🔒 My posts</h2>${lock("Only you can see these")}<span class="sp"></span><button class="btn quiet" type="button" ${go("content")}>Copy from Content</button><button class="btn pri" type="button" ${go("create")}>+ Write a post</button></div>`;
    let body;
    if (s === "empty") body = emptyBox();
    else if (s === "loading") body = `<div class="card" style="padding:16px">${[1, 2, 3, 4].map(() => `<div class="skel" style="height:44px;margin:0 0 10px"></div>`).join("")}</div>`;
    else if (s === "error-load") body = errBox();
    else {
      const rows = MINE.map((m, i) => `<tr class="${i === 2 && s === "use" ? "hi" : ""}"><td><div class="t">${m.t}</div><div class="u">${m.slug ? DOM + "/news/" + m.slug : ""}</div></td><td>${chipFor(m)}</td><td>${m.d}</td><td><div class="acts" style="position:relative"><button class="btn quiet" type="button" ${go("edit")}>Edit</button><button class="btn" type="button" ${go("use")}>Use ▾</button>${s === "use" && i === 2 ? useMenu() : ""}</div></td></tr>`).join("");
      const cards = MINE.map((m) => `<div class="pcard"><div class="nm">${m.t}</div><div class="meta">${m.d} · ${m.stl}</div><div class="acts" style="justify-content:flex-start;margin-top:8px;position:relative"><button class="btn quiet" type="button" ${go("edit")}>Edit</button><button class="btn" type="button" ${go("use")}>Use ▾</button>${s === "use" && m.id === "m3" ? useMenu() : ""}</div></div>`).join("");
      body = `<div class="card list-wrap"><table class="list"><thead><tr><th>Title</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>${rows}</tbody></table><div class="cards">${cards}</div></div>`;
    }
    return frame("mine", head + body, overlayFor(s));
  }

  function render() {
    const root = document.getElementById("root");
    const html = state.dir === "a" ? sceneA() : state.dir === "b" ? sceneB() : sceneC();
    root.innerHTML = mockbar() + html;
    document.title = "Private posts " + DIRNAME[state.dir];
  }

  window.PPApp = {
    boot: function (o) {
      state.dir = o.dir;
      state.s = o.s;
      const q = qs();
      if (q.s && SCENES[o.dir].some((x) => x[0] === q.s)) state.s = q.s;
      if (q.phone) state.dev = "phone";
      render();
    }
  };
})();

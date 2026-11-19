(function () {
  const DOM = "example-advisor.ca";
  const state = { dir: "a", s: "list", dev: "desk" };
  const PAGES = { a: "a-section.html", b: "b-visibility.html", c: "c-private-space.html" };

  const MINE = [
    { id: "m1", t: "Welcome to my practice", x: "A short introduction to how I work with families, and what to expect from our first meeting.", d: "Nov 18", st: "live", stl: "Live on your website", bg: "pt1", slug: "welcome-to-my-practice" },
    { id: "m2", t: "March client seminar: notes and talking points", x: "Draft outline for the spring seminar at the community hall.", d: "Nov 17", st: "draft", stl: "Draft", bg: "pt2", slug: "march-client-seminar" },
    { id: "m3", t: "Why I review your plan every spring", x: "A yearly check-in keeps your goals, budget and insurance in step with real life.", d: "Nov 15", st: "sched", stl: "Scheduled for Nov 24", bg: "pt3", slug: "why-i-review-your-plan-every-spring" },
    { id: "m4", t: "A note on market ups and downs", x: "What I tell clients when the headlines get loud.", d: "Nov 12", st: "sent", stl: "Emailed Nov 12", bg: "pt4", slug: "a-note-on-market-ups-and-downs" }
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

  const SCENES = {
    a: [["all", "All Content"], ["list", "My posts"], ["empty", "Empty"], ["loading", "Loading"], ["error-load", "Load error"], ["create", "Create"], ["error-title", "Title missing"], ["saving", "Saving"], ["saved", "Saved"], ["error-save", "Save error"], ["edit", "Edit"], ["use", "Use menu"], ["site", "Website"], ["site-done", "Published"], ["email", "Email"], ["social", "Social"], ["no-site", "No website"], ["pv-web", "Client: website"], ["pv-email", "Client: email"], ["pv-social", "Client: social"], ["trash", "Trash"]],
    b: [["all", "All, mixed"], ["search", "Search"], ["mine", "My posts filter"], ["empty", "Empty"], ["loading", "Loading"], ["error-load", "Load error"], ["create", "Create"], ["error-title", "Title missing"], ["saving", "Saving"], ["saved", "Saved"], ["error-save", "Save error"], ["edit", "Edit"], ["use", "Use menu"], ["site", "Website"], ["site-done", "Published"], ["email", "Email"], ["social", "Social"], ["no-site", "No website"], ["pv-web", "Client: website"], ["pv-email", "Client: email"], ["pv-social", "Client: social"], ["trash", "Trash"]],
    c: [["content", "Content tab"], ["copy", "Private copy"], ["list", "My posts"], ["empty", "Empty"], ["loading", "Loading"], ["error-load", "Load error"], ["create", "Create"], ["error-title", "Title missing"], ["saving", "Saving"], ["saved", "Saved"], ["error-save", "Save error"], ["edit", "Edit"], ["use", "Use menu"], ["site", "Website"], ["site-done", "Published"], ["email", "Email"], ["social", "Social"], ["no-site", "No website"], ["pv-web", "Client: website"], ["pv-email", "Client: email"], ["pv-social", "Client: social"], ["trash", "Trash"]]
  };
  const DIRNAME = { a: "A. My posts section", b: "B. Visibility control", c: "C. Private space" };

  function qs() {
    const p = new URLSearchParams(location.search);
    return { s: p.get("s"), phone: p.get("phone") === "1" };
  }
  window.sw = function (k, v) {
    if (k === "dev") state.dev = v; else state.s = v;
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
  const chipFor = (m) => `<span class="chip ${m.st === "live" ? "live" : m.st === "sched" ? "sched2" : m.st === "sent" ? "sent2" : "draft2"}">${m.stl}</span>`;
  function privCard(m, withMenu) {
    return `<div class="pc"><div class="th ${m.bg}">${lock()}</div><div class="cb"><div class="ct">${m.t}</div><div class="ce">${m.x}</div><div class="cm">${m.d} ${chipFor(m)}</div></div>
      <div class="ca"><button class="btn quiet" type="button" ${go("edit")}>Edit</button><button class="btn" type="button" ${go("use")}>Use ▾</button>${withMenu ? useMenu() : ""}</div></div>`;
  }
  function fcCard(p, copy) {
    return `<div class="pc"><div class="th ${p.bg}"></div><div class="cb"><div class="ct">${p.t}</div><div class="ce">${p.x}</div><div class="cm">${p.d}</div></div>
      <div class="ca"><button class="btn" type="button">Add Now ▾</button>${copy ? `<button class="btn quiet" type="button" ${go("copy")}>Make a private copy</button>` : ""}</div></div>`;
  }
  function useMenu() {
    return `<div class="menu pp"><button type="button" ${go("site")}>Add to my website</button><button type="button" ${go("email")}>Email my clients</button><button type="button" ${go("social")}>Share on social</button><hr><button type="button" ${go("pv-web")}>Preview what clients see</button><button type="button" ${go("edit")}>Edit</button><button type="button" class="dg" ${go("trash")}>Move to Trash</button></div>`;
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

  /* ---------- editor ---------- */
  function editor(mode) {
    const edit = mode === "edit" || mode === "saved" || mode === "saving" && false;
    const filled = mode !== "create" && mode !== "error-title";
    const busy = mode === "saving";
    const m = SEL;
    const title = filled ? m.t : mode === "error-title" ? "" : "";
    const sum = filled ? m.x : "";
    const h = mode === "create" || mode === "error-title" ? "New post" : "Edit post";
    const bodyHtml = filled
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
    const top = `<div class="ed-top"><button class="btn link" type="button" ${go(backTo)}>${back}</button><h2>${h}</h2>${state.dir === "b" ? lock() : ""}<span class="sp"></span>
      ${mode === "saved" ? `<span class="saved-note">Saved just now</span>` : ""}
      <button class="btn quiet" type="button" ${busy ? "disabled" : ""} ${go("saved")}>Save draft</button>
      <button class="btn pri" type="button" ${busy ? "disabled" : ""} ${go("saving")}>${busy ? "Saving…" : "Save post"}</button></div>`;
    const main = `<div class="panel">
        <div class="field"><label>Title</label><input class="${mode === "error-title" ? "bad" : ""}" value="${title}" placeholder="Post title" ${busy ? "disabled" : ""}>${mode === "error-title" ? `<span class="err">Title is required</span>` : ""}</div>
        <div class="field"><label>Summary</label><textarea placeholder="One or two sentences shown on the card" ${busy ? "disabled" : ""}>${sum}</textarea></div>
        <div class="field" style="margin:0"><label>Post</label><div class="tb"><span>B</span><span><i>I</i></span><span><u>U</u></span><span>❝</span><span>≡</span><span>🔗</span><span>🖼</span></div><div class="ebody">${bodyHtml}</div></div></div>`;
    const side = `<div>${vis}${img}</div>`;
    const inner = `${top}${alerts}${lockBanner}<div class="ed-grid">${main}${side}</div>`;
    return inner;
  }

  /* ---------- use dialogs ---------- */
  function dlg(title, sub, body, foot) {
    return `<div class="dlg sm" style="max-width:520px"><div class="dh"><div>${title}${sub ? `<div class="sub">${sub}</div>` : ""}</div><button class="ico-btn" type="button" ${go(baseList())}>✕</button></div><div class="db">${body}</div><div class="df">${foot}</div></div>`;
  }
  function baseList() { return state.dir === "b" ? "mine" : "list"; }
  function siteDlg() {
    return dlg("Add to your website", SEL.t,
      `<div class="timing"><label><input type="radio" name="t"> Publish now</label><label><input type="radio" name="t" checked> Schedule</label></div>
       <div class="row2"><div class="field"><label>Date</label><input value="Nov 24, 2026"></div><div class="field"><label>Time</label><input value="9:00 AM"></div></div>
       <div class="linkprev"><span>It will be published at</span><b>${DOM}/news/${SEL.slug}</b></div>
       <div class="alert info"><b>This puts the post on your website</b>Anyone with the link can read it there. It is still not shared with other advisors.</div>
       <div class="ph">Compliance wording to be supplied by legal.</div>`,
      `<button class="btn quiet" type="button" ${go("pv-web")}>Preview</button><button class="btn" type="button" ${go(baseList())}>Cancel</button><button class="btn pri" type="button" ${go("site-done")}>Schedule for Nov 24</button>`);
  }
  function emailDlg() {
    return dlg("Email my clients", SEL.t,
      `<div class="field"><label>Send to</label><select><option>Newsletter (128 contacts)</option></select></div>
       <div class="field"><label>From</label><input value="Jane Advisor &lt;jane@${DOM}&gt;" readonly></div>
       <div class="field"><label>Subject</label><input value="${SEL.t}"></div>
       <div class="linkprev"><span>The email links to</span><b>${DOM}/news/${SEL.slug}</b></div>
       <div class="alert info"><b>Your clients will read it on your website</b>Publishing the email also publishes this post on ${DOM}.</div>
       <div class="ph">Compliance wording to be supplied by legal.</div>`,
      `<button class="btn quiet" type="button" ${go("pv-email")}>Preview</button><button class="btn" type="button" ${go(baseList())}>Cancel</button><button class="btn pri" type="button" ${go("site-done")}>Continue</button>`);
  }
  function socialDlg() {
    return dlg("Share on social", SEL.t,
      `<div class="checkline"><input type="checkbox" checked> LinkedIn (Jane Advisor)</div><div class="checkline"><input type="checkbox" checked> Facebook (Your Firm Name)</div>
       <div class="field" style="margin-top:10px"><label>Caption</label><textarea>A yearly check-in keeps your goals, budget and insurance in step. Read more on my website.</textarea></div>
       <div class="linkprev"><span>The post links to</span><b>${DOM}/news/${SEL.slug}</b></div>
       <div class="alert info"><b>Followers open the post on your website</b>Sharing also publishes this post on ${DOM}.</div>
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
    if (s === "site") return scrim(siteDlg());
    if (s === "email") return scrim(emailDlg());
    if (s === "social") return scrim(socialDlg());
    if (s === "no-site") return scrim(noSiteDlg());
    if (s === "trash") return scrim(trashDlg());
    if (s === "site-done") return toast(`Scheduled for Nov 24 on ${DOM}. Only you can see it until then.`);
    return "";
  }
  function myGrid(menuOn) {
    return `<div class="grid">${MINE.map((m, i) => privCard(m, menuOn && i === 2)).join("")}</div>`;
  }

  function sceneA() {
    const s = state.s;
    const mine = `<button type="button" class="pbtn${s !== "all" ? " on" : ""}" ${go("list")}>🔒 My posts <span class="n">${s === "empty" ? 0 : MINE.length}</span></button>`;
    if (s === "all") return frame("content", `${libHead("all", mine)}<div class="grid">${FC.map((p) => fcCard(p)).join("")}</div>`);
    if (["pv-web", "pv-email", "pv-social"].includes(s)) return frame("content", { "pv-web": pvWeb, "pv-email": pvEmail, "pv-social": pvSocial }[s]());
    if (["create", "error-title", "saving", "saved", "error-save", "edit"].includes(s)) return frame("content", editor(s), s === "saved" ? toast("Saved. Only you can see this post.") : "");
    const head = `${libHead("mine", mine)}<div class="secthead"><h2>My posts</h2>${lock("Only you can see these")}<span class="sp"></span><button class="btn pri" type="button" ${go("create")}>+ Write a post</button></div>`;
    let body;
    if (s === "empty") body = emptyBox();
    else if (s === "loading") body = skeletons(4);
    else if (s === "error-load") body = errBox();
    else body = myGrid(s === "use");
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

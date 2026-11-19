(function () {
  const D = () => window.FC908;
  const NOW = "Nov 19, 2026, 1:05 PM";
  const NOW_PT = "Nov 19, 2026, 1:05 PM PT";
  const JORDAN = "jordan.sample@example.com";
  const CASEY = "casey.example@example.com";
  const state = { opt: 1, s: "list", dev: "desk", jp: false, cr: false };
  let live = [];
  let histExtra = {};
  let timer = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function attr(s) { return String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"); }

  function resetLive() {
    live = D().people.map(function (p) { return Object.assign({}, p, { tags: (p.tags || []).slice() }); });
    live.splice(5, 0, { email: JORDAN, first: "Jordan", last: "Sample", status: "unsubscribed", tags: ["Newsletter"], phone: "", city: "Burnaby", changed: "Nov 3, 2026, 10:30 AM", consent: "Website form", consentNote: "" });
    histExtra = {};
  }
  function find(email) { return live.filter(function (p) { return p.email === email; })[0] || null; }
  function nameOf(p) { return ((p.first || "") + " " + (p.last || "")).trim() || "—"; }
  function pushHist(email, action) {
    (histExtra[email] = histExtra[email] || []).unshift({ who: "Jane Advisor", action: action, when: NOW_PT });
  }
  function toTop(email) {
    const i = live.findIndex(function (p) { return p.email === email; });
    if (i > 0) live.unshift(live.splice(i, 1)[0]);
  }
  function makePending(email, resend) {
    const p = find(email);
    if (!p) return;
    p.status = "pending";
    p.changed = NOW;
    p.sentAt = "Nov 19";
    toTop(email);
    pushHist(email, (resend ? "sent the confirmation email again to " : "asked Mailchimp to send a confirmation email to ") + email + ". Status is Pending until they confirm");
  }
  function chip(p) {
    const label = p.status.charAt(0).toUpperCase() + p.status.slice(1);
    return `<span class="chip ${esc(p.status)}">${esc(label)}</span>`;
  }
  function pendNote(p) {
    if (p.status !== "pending") return "";
    return `<span class="st-sub">Confirmation sent ${esc(p.sentAt || "Nov 15")}</span>`;
  }
  function tagsOf(p) {
    if (!p.tags || !p.tags.length) return "—";
    return p.tags.map(function (t) { return `<span class="tag">${esc(t)}</span>`; }).join("");
  }

  /* which contact each scene is about */
  function subject() {
    const s = state.s;
    if (s === "already" || s === "add-pending" || s === "resent" || s === "edit-pending" || s === "history-pending") return CASEY;
    return JORDAN;
  }

  function mcTabs() {
    return ["Campaigns", "Default Lists", "Templates", "Audiences", "Subscribers", "Reports", "Settings"].map(function (n) {
      return `<button type="button" class="etab${n === "Subscribers" ? " on" : ""}" ${n === "Subscribers" ? "onclick=\"sw('list')\"" : ""}>${n}</button>`;
    }).join("");
  }
  function shell(body, overlay, toast) {
    return `<div class="stagewrap"><div id="stage" class="${state.dev}">
      <div class="app">
        <nav class="rail">
          <div class="logo">YFN<small>Your Firm Name</small></div>
          <div class="ri"><span class="ico">📄</span>Content</div>
          <div class="ri"><span class="ico">🖥</span>Website</div>
          <div class="ri"><span class="ico">🔗</span>Social Media</div>
          <div class="ri on"><span class="ico">✉</span>Email Campaigns</div>
        </nav>
        <div class="col">
          <div class="mbar"><button type="button" aria-label="Menu">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">YFN</div><div class="av">JA</div></div>
          <main class="main">
            <h1 class="page">Email Campaigns</h1>
            <div class="etabs">${mcTabs()}</div>
            ${body}
          </main>
        </div>
      </div>
      ${overlay || ""}
      ${toast ? `<div class="toast" role="status">${toast}</div>` : ""}
    </div></div>`;
  }

  /* ---------- list ---------- */
  function strip(p) {
    const s = state.s;
    const e = esc(p.email);
    if (state.opt !== 3) return "";
    if (s === "offer") {
      return stripHtml("warn", `<b>Not added. ${e} unsubscribed earlier.</b>Mailchimp won't add someone back after they unsubscribe. Mailchimp can email them a confirmation link instead. They stay Pending until they confirm.<div class="legal">[Placeholder CASL copy, to be confirmed by compliance] Only send this if they asked to hear from you again.</div>`,
        `<button class="btn pri" type="button" data-act="send" onclick="doSend()">Send confirmation email</button><button class="btn quiet" type="button" onclick="sw('list')">Dismiss</button>`);
    }
    if (s === "sending") {
      return stripHtml("info", `<span class="spin-sm"></span><b style="display:inline">Sending confirmation email…</b>`,
        `<button class="btn pri" type="button" disabled>Sending…</button>`);
    }
    if (s === "failed") {
      return stripHtml("error", `<b>Couldn't send the confirmation email</b>Mailchimp didn't accept the request. Nothing was changed, and ${e} is still Unsubscribed. Try again in a moment.`,
        `<button class="btn pri" type="button" onclick="doSend()">Try again</button><button class="btn quiet" type="button" onclick="sw('list')">Dismiss</button>`);
    }
    if (s === "already") {
      return stripHtml("info", `<b>Already Pending. Nothing new was added.</b>We emailed ${e} a confirmation link on Nov 15, 2026, 4:05 PM PT. They haven't confirmed yet.`,
        `<button class="btn pri" type="button" onclick="doResend()">Resend confirmation email</button><button class="btn quiet" type="button" onclick="sw('list')">Dismiss</button>`);
    }
    return "";
  }
  function stripHtml(kind, text, acts) {
    return `<div class="strip ${kind}"><div class="tx">${text}</div><div class="acts2">${acts}</div></div>`;
  }
  function rowStrip() {
    if (state.opt !== 3) return null;
    if (["offer", "sending", "failed", "already"].indexOf(state.s) === -1) return null;
    return find(subject());
  }

  function listBody() {
    const hiSet = {};
    const sub = ["offer", "sending", "failed", "already", "sent", "resent", "edit-pending", "history-pending", "add", "add-pending"].indexOf(state.s) !== -1 ? subject() : "";
    hiSet[sub] = true;
    const sp = rowStrip();
    const tr = live.map(function (p) {
      const main = `<tr class="${hiSet[p.email] ? "hi" : ""}" data-email="${esc(p.email)}">
        <td>${esc(p.email)}</td><td>${esc(nameOf(p))}</td>
        <td>${chip(p)}${pendNote(p)}</td><td>${tagsOf(p)}</td><td>${esc(p.changed || "—")}</td>
        <td class="acts-cell">${rowActs(p)}</td></tr>`;
      const extra = sp && sp.email === p.email ? `<tr class="offer-row"><td colspan="6">${strip(p)}</td></tr>` : "";
      return main + extra;
    }).join("");
    const cards = live.map(function (p) {
      const hi = hiSet[p.email];
      const extra = sp && sp.email === p.email ? strip(p) : "";
      return `<div class="pcard" data-email="${esc(p.email)}" style="${hi ? "background:#f5f9fd" : ""}">
        <div class="top"><div class="body"><div class="nm">${esc(p.email)}</div>
        <div class="meta">${esc(nameOf(p))} · ${chip(p)}${pendNote(p)} · ${esc(p.changed || "")}</div>
        <div style="margin-top:6px">${tagsOf(p)}</div></div></div>
        ${rowActs(p)}${extra}</div>`;
    }).join("");
    return `<div class="ident"><div class="left"><h2>${esc(D().copy.title)} <span class="badge mc">Mailchimp</span></h2>
        <p class="help">${esc(D().copy.help)}</p></div>
        <button class="btn pri" type="button" onclick="sw('add')">Add subscriber</button></div>
      <div class="tools"><div class="left"><input class="search" type="search" placeholder="Search by email" aria-label="Search by email"></div>
        <div class="right"><div class="pager"><span class="nums">1–50 of 1,285</span>
        <button class="btn quiet" type="button" disabled>Previous</button><button class="btn quiet" type="button" disabled>Next</button></div></div></div>
      <div class="card list-wrap"><table class="list"><thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Tags</th><th>Last changed</th><th></th></tr></thead>
      <tbody>${tr}</tbody></table><div class="cards">${cards}</div></div>`;
  }
  function rowActs(p) {
    const a = attr(p.email);
    const edit = p.status === "pending" ? "edit-pending" : "edit-other";
    return `<div class="row-acts">
      <button class="btn quiet" type="button" onclick="event.stopPropagation();openRow('${a}','edit')">Edit</button>
      <button class="btn link" type="button" onclick="event.stopPropagation();openRow('${a}','history')">History</button></div>`;
  }

  /* ---------- add drawer ---------- */
  function addFields(email, locked, hideNote) {
    const casey = email === CASEY;
    const first = casey ? "Casey" : "Jordan", last = casey ? "Example" : "Sample";
    const dis = locked ? " disabled" : "";
    const src = casey ? "In person" : "Website form";
    return `<div class="${locked ? "fieldlock" : ""}">
      <div class="field"><label for="addEmail">Email</label><input id="addEmail" type="email" value="${esc(email)}"${dis}></div>
      <div class="row2">
        <div class="field"><label for="addFirst">First name</label><input id="addFirst" value="${first}"${dis}></div>
        <div class="field"><label for="addLast">Last name</label><input id="addLast" value="${last}"${dis}></div>
      </div>
      <div class="field"><label for="addSource">Consent source</label>
        <select id="addSource"${dis}>${D().sources.map(function (s) { return `<option${s === src ? " selected" : ""}>${esc(s)}</option>`; }).join("")}</select></div>
      <label class="checkline"><input id="casl" type="checkbox" checked${dis}> ${esc(D().copy.casl)}</label>
      ${hideNote ? "" : `<p class="note">${esc(D().copy.caslNote)}</p>`}</div>`;
  }
  function notice(kind) {
    const e = esc(subject());
    if (kind === "offer") {
      return `<div class="alert warn" id="offerNotice"><b>${e} unsubscribed earlier</b>
        Mailchimp won't add someone back after they unsubscribe. Mailchimp can email them a confirmation link instead. They stay Pending, and get no campaigns, until they confirm.
        <div class="legal">[Placeholder CASL copy, to be confirmed by compliance] Only send this if they asked to hear from you again.</div></div>`;
    }
    if (kind === "sending") {
      return `<div class="alert info"><b><span class="spin-sm"></span>Sending confirmation email…</b>Asking Mailchimp to email ${e}.</div>`;
    }
    if (kind === "failed") {
      return `<div class="alert error"><b>Couldn't send the confirmation email</b>Mailchimp didn't accept the request. Nothing was changed, and ${e} is still Unsubscribed. Try again in a moment.</div>`;
    }
    if (kind === "already") {
      return `<div class="alert info"><b>${e} is already Pending</b>We emailed them a confirmation link on Nov 15, 2026, 4:05 PM PT. They haven't confirmed yet, so nothing new was added.</div>`;
    }
    return "";
  }
  function addDrawer() {
    const s = state.s;
    const o = state.opt;
    const pend = s === "already" || s === "add-pending";
    const email = pend ? CASEY : JORDAN;
    let nt = "", foot = "", locked = false;
    const cancel = `<button class="btn quiet" type="button" onclick="sw('list')">Cancel</button>`;
    const save = `<button class="btn pri" type="button" onclick="doSave()">Add subscriber</button>`;
    if (o === 1 && (s === "offer" || s === "sending" || s === "failed" || s === "already")) {
      nt = notice(s);
      locked = s === "sending";
      if (s === "offer") foot = cancel + `<button class="btn pri" type="button" data-act="send" onclick="doSend()">Send confirmation email</button>`;
      if (s === "sending") foot = `<button class="btn quiet" type="button" disabled>Cancel</button><button class="btn pri" type="button" disabled><span class="spin-sm"></span>Sending…</button>`;
      if (s === "failed") foot = cancel + `<button class="btn pri" type="button" onclick="doSend()">Try again</button>`;
      if (s === "already") foot = cancel + `<button class="btn quiet" type="button" onclick="openRow('${attr(CASEY)}','edit')">View subscriber</button><button class="btn pri" type="button" onclick="doResend()">Resend confirmation email</button>`;
    } else {
      foot = cancel + save;
      if (o === 2 && (s === "offer" || s === "sending" || s === "failed" || s === "already")) {
        foot = `<button class="btn quiet" type="button" disabled>Cancel</button><button class="btn pri" type="button" disabled>Add subscriber</button>`;
      }
    }
    return `<div class="scrim" ${o === 1 || s === "add" || s === "add-pending" ? "onclick=\"if(event.target===this)sw('list')\"" : ""}>
      <aside class="drawer" role="dialog" aria-label="Add subscriber" onclick="event.stopPropagation()">
        <div class="dh"><div class="ttl">Add subscriber<div class="sub">News page audience · Mailchimp</div></div>
          <button class="x" type="button" aria-label="Close" onclick="sw('list')">×</button></div>
        <div class="db">${nt}${addFields(email, locked, !!nt && s !== "already")}</div>
        <div class="df">${foot}</div>
      </aside></div>`;
  }

  /* ---------- option 2 dialog ---------- */
  function dialog() {
    const s = state.s;
    const e = esc(subject());
    let title = "", body = "", cf = "";
    if (s === "offer") {
      title = "Send a confirmation email?";
      body = `<p>${e} unsubscribed earlier, so Mailchimp can't add them directly. Mailchimp can email them a confirmation link instead. They stay Pending, and get no campaigns, until they confirm.</p>
        <p class="legal" style="margin-top:-6px">[Placeholder CASL copy, to be confirmed by compliance] Only send this if they asked to hear from you again.</p>`;
      cf = `<button class="btn quiet" type="button" onclick="sw('add')">Cancel</button><button class="btn pri" type="button" data-act="send" onclick="doSend()">Send confirmation email</button>`;
    } else if (s === "sending") {
      title = "Sending confirmation email…";
      body = `<p><span class="spin-sm"></span>Asking Mailchimp to email ${e}.</p>`;
      cf = `<button class="btn quiet" type="button" disabled>Cancel</button><button class="btn pri" type="button" disabled>Sending…</button>`;
    } else if (s === "failed") {
      title = "Couldn't send the confirmation email";
      body = `<div class="alert error" style="margin:0 0 12px">Mailchimp didn't accept the request. Nothing was changed, and ${e} is still Unsubscribed. Try again in a moment.</div>`;
      cf = `<button class="btn quiet" type="button" onclick="sw('add')">Cancel</button><button class="btn pri" type="button" onclick="doSend()">Try again</button>`;
    } else if (s === "already") {
      title = "Already waiting for confirmation";
      body = `<p>We emailed ${e} a confirmation link on Nov 15, 2026, 4:05 PM PT. They haven't confirmed yet, so nothing new was added.</p>`;
      cf = `<button class="btn quiet" type="button" onclick="sw('list')">Close</button><button class="btn pri" type="button" onclick="doResend()">Resend confirmation email</button>`;
    }
    return `<div class="scrim top"><div class="confirm" role="alertdialog" aria-label="${esc(title)}" onclick="event.stopPropagation()">
      <div class="ct">${esc(title)}</div>${body}<div class="cf">${cf}</div></div></div>`;
  }

  /* ---------- pending Edit / History drawer ---------- */
  function histItems(email) {
    const items = (histExtra[email] || []).concat(D().history[email] || []);
    if (!items.length) return `<p class="hint">No changes recorded for this subscriber yet.</p>`;
    return `<ul class="hist">${items.map(function (h) {
      return `<li><div><span class="who">${esc(h.who)}</span> ${esc(h.action)}</div><div class="when">${esc(h.when)}</div></li>`;
    }).join("")}</ul>`;
  }
  function rowDrawer(email, tab) {
    const p = find(email) || find(JORDAN);
    const a = attr(p.email);
    const tabs = `<div class="dtabs">
      <button type="button" class="dtab${tab === "profile" ? " on" : ""}" onclick="openRow('${a}','edit')">Profile</button>
      <button type="button" class="dtab${tab === "history" ? " on" : ""}" onclick="openRow('${a}','history')">History</button></div>`;
    const pend = p.status === "pending";
    let body, foot;
    if (tab === "history") {
      body = tabs + histItems(p.email);
      foot = `<button class="btn quiet" type="button" onclick="sw('list')">Close</button>`;
    } else {
      const box = pend ? `<div class="alert warn pend-box"><b>Waiting for confirmation</b>
          We emailed ${esc(p.email)} a confirmation link on ${p.email === CASEY ? "Nov 15, 2026, 4:05 PM PT" : "Nov 19, 2026, 1:05 PM PT"}. They get no campaigns until they confirm.
          <div class="alert-acts"><button class="btn pri" type="button" onclick="doResend('${a}')">Resend confirmation email</button>
          <button class="btn quiet" type="button" onclick="sw('list')">Cancel the request</button></div></div>` : "";
      body = tabs + box + `<div class="field"><label>Email</label><input value="${esc(p.email)}" disabled></div>
        <div class="row2"><div class="field"><label>First name</label><input value="${esc(p.first || "")}"></div>
        <div class="field"><label>Last name</label><input value="${esc(p.last || "")}"></div></div>
        <div class="row2"><div class="field"><label>Phone (merge field)</label><input value="${esc(p.phone || "")}" placeholder="604-555-0100"></div>
        <div class="field"><label>City (merge field)</label><input value="${esc(p.city || "")}"></div></div>
        <div class="field"><label>Tags</label><div>${tagsOf(p)}</div></div>`;
      foot = `<div class="left-acts">${pend ? `<button class="btn quiet" type="button" disabled title="Remove isn't available while a contact is Pending">Remove</button>` : `<button class="btn quiet" type="button">Remove</button>`}
        <button class="btn quiet" type="button" style="color:#c62828;border-color:#c62828">Permanently delete</button></div>
        <button class="btn quiet" type="button" onclick="sw('list')">Cancel</button><button class="btn pri" type="button" onclick="sw('list')">Save changes</button>`;
    }
    return `<div class="scrim" onclick="if(event.target===this)sw('list')">
      <aside class="drawer" role="dialog" aria-label="${esc(nameOf(p))}" onclick="event.stopPropagation()">
        <div class="dh"><div class="ttl">${esc(nameOf(p))}<div class="sub">${esc(p.email)} · Mailchimp</div></div>
          <button class="x" type="button" aria-label="Close" onclick="sw('list')">×</button></div>
        <div class="db">${body}</div><div class="df">${foot}</div></aside></div>`;
  }

  /* ---------- scene engine ---------- */
  function applyPreset(s) {
    if (s === "sent") state.jp = true;
    if (s === "resent") state.cr = true;
    if (state.jp) makePending(JORDAN, false);
    if (state.cr) { const p = find(CASEY); pushHist(CASEY, "sent the confirmation email again to " + CASEY + ". Status is Pending until they confirm"); p.changed = NOW; p.sentAt = "Nov 19"; toTop(CASEY); }
  }
  function toastFor() {
    const s = state.s;
    if (s === "sent") return `Confirmation email sent to ${JORDAN}. Their status is Pending until they confirm.`;
    if (s === "resent") return `Confirmation email sent again to ${CASEY}. Their status is Pending until they confirm.`;
    if (state.opt === 3 && s === "offer") return `${JORDAN} wasn't added: they unsubscribed earlier.`;
    if (state.opt === 3 && s === "already") return `${CASEY} is already Pending.`;
    return "";
  }
  function overlayFor() {
    const s = state.s, o = state.opt;
    if (s === "add" || s === "add-pending") return addDrawer();
    if (["offer", "sending", "failed", "already"].indexOf(s) !== -1) {
      if (o === 3) return "";
      if (o === 1) return addDrawer();
      return addDrawer() + dialog();
    }
    if (s === "edit-pending") return rowDrawer(CASEY, "profile");
    if (s === "history-pending") return rowDrawer(CASEY, "history");
    if (s === "edit-jordan") return rowDrawer(JORDAN, "profile");
    if (s === "history-jordan") return rowDrawer(JORDAN, "history");
    return "";
  }
  function render() {
    document.getElementById("root").innerHTML = shell(listBody(), overlayFor(), toastFor());
    const st = document.querySelector(".pcard .strip");
    if (st && state.dev === "phone") { const m = document.querySelector(".main"); m.scrollTop = st.getBoundingClientRect().top - m.getBoundingClientRect().top + m.scrollTop - 150; }
    document.querySelectorAll("[data-sw]").forEach(function (b) {
      const parts = b.getAttribute("data-sw").split(":");
      b.classList.toggle("on", parts[0] === "dev" ? state.dev === parts[1] : state.s === parts[1]);
    });
  }
  function writeQ() {
    const q = new URLSearchParams();
    if (state.s !== "list") q.set("s", state.s);
    if (state.dev === "phone") q.set("phone", "1");
    const qs = q.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }
  function go(s, auto) {
    clearTimeout(timer);
    resetLive();
    state.s = s;
    applyPreset(s);
    writeQ();
    render();
    if (auto) timer = setTimeout(auto, 1300);
  }
  function sw(s) { go(s); }
  function jump(s) { state.jp = false; state.cr = false; go(s); }
  function swDev(d) { state.dev = d; writeQ(); render(); }
  function doSave() {
    const pend = state.s === "add-pending";
    go(pend ? "already" : "offer");
  }
  function doSend() {
    go("sending", function () { go("sent"); });
  }
  function doResend() {
    go("resent");
  }
  function openRow(email, kind) {
    const p = find(email);
    if (email === CASEY) go(kind === "history" ? "history-pending" : "edit-pending");
    else go(kind === "history" ? "history-jordan" : "edit-jordan");
  }
  function boot(opts) {
    state.opt = opts.opt || 1;
    const q = new URLSearchParams(location.search);
    state.dev = (q.get("phone") === "1" || q.get("dev") === "phone") ? "phone" : "desk";
    resetLive();
    state.s = q.get("s") || opts.s || "list";
    applyPreset(state.s);
    window.sw = sw; window.jump = jump; window.swDev = swDev; window.doSave = doSave; window.doSend = doSend; window.doResend = doResend; window.openRow = openRow;
    render();
  }
  window.Optin = { boot: boot, state: state };
})();

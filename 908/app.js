(function () {
  const D = () => window.FC908;
  const C = () => D().copy;
  const NOW = "Nov 17, 2026, 10:20 AM";
  const NOW_PT = "Nov 17, 2026, 10:20 AM PT";
  const state = { dir: "a", s: "list", dev: "desk", email: "", menu: "", selected: [], cameFrom: "" };
  let live = [];
  let livePage2 = [];
  let histExtra = {};

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function attr(s) {
    return String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }
  function cloneP(p) {
    return Object.assign({}, p, { tags: (p.tags || []).slice(), gone: false });
  }
  function resetLive() {
    live = D().people.map(cloneP);
    livePage2 = (D().page2 || []).map(cloneP);
    histExtra = {};
  }
  function allLive() { return live.concat(livePage2); }
  function pageSource() { return (state.s === "page2" || state.page === 2) ? livePage2 : live; }
  function visibleRows() {
    if (state.s === "empty") return [];
    if (state.s === "search") {
      const q = (state.q || "subscriber@example.com").toLowerCase();
      return allLive().filter(function (p) { return !p.gone && p.email.toLowerCase().indexOf(q) !== -1; });
    }
    return pageSource().filter(function (p) { return !p.gone; });
  }
  function findLive(email) {
    return allLive().filter(function (p) { return p.email === email; })[0] || null;
  }
  function nameOf(p) {
    if (!p) return "—";
    return ((p.first || "") + " " + (p.last || "")).trim() || "—";
  }
  function chip(status) {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="chip ${esc(status)}">${esc(label)}</span>`;
  }
  function tagsOf(p) {
    if (!p.tags || !p.tags.length) return "—";
    return p.tags.map(function (t) { return `<span class="tag">${esc(t)}</span>`; }).join("");
  }
  function targetEmail() {
    if (state.email) return state.email;
    if (state.s === "resub" || state.s === "pending" || state.s === "resub-done") return "alex.client@example.com";
    return "subscriber@example.com";
  }
  function targetPerson() {
    return findLive(targetEmail()) || D().people[0];
  }
  function defaultBulk() {
    return live.filter(function (p) { return !p.gone && p.status === "subscribed"; }).slice(0, 2).map(function (p) { return p.email; });
  }
  function selectedPeople() {
    return allLive().filter(function (p) { return state.selected.indexOf(p.email) !== -1 && !p.gone; });
  }
  function selectedSubscribed() {
    return selectedPeople().filter(function (p) { return p.status === "subscribed"; });
  }
  function pushHist(email, action) {
    if (!histExtra[email]) histExtra[email] = [];
    histExtra[email].unshift({ who: "Jane Advisor", action: action, when: NOW_PT });
  }
  function setStatus(email, status) {
    const p = findLive(email);
    if (!p) return;
    p.status = status;
    p.changed = NOW;
  }
  function markGone(email) {
    const p = findLive(email);
    if (!p) return;
    p.gone = true;
  }
  function goneCount() {
    return allLive().filter(function (p) { return p.gone; }).length;
  }

  function mcTabs(active) {
    const dir = state.dir;
    const items = dir === "today"
      ? ["Campaigns", "Default Lists", "Templates", "Audiences", "Reports", "Settings"]
      : dir === "b"
        ? ["Campaigns", "Default Lists", "Templates", "Audiences", "Subscribers", "History", "Reports", "Settings"]
        : ["Campaigns", "Default Lists", "Templates", "Audiences", "Subscribers", "Reports", "Settings"];
    return items.map(function (name) {
      const on = (active === "settings" && name === "Settings")
        || (active === "audiences" && name === "Audiences")
        || (active === "history" && name === "History")
        || (active === "subscribers" && name === "Subscribers");
      let click = "";
      if (name === "Settings") click = "onclick=\"sw('s','settings')\"";
      if (name === "Audiences" && dir === "today") click = "onclick=\"sw('s','audiences')\"";
      if (name === "Subscribers") click = "onclick=\"sw('s','list')\"";
      if (name === "History") click = "onclick=\"sw('s','history-tab')\"";
      return `<button type="button" class="etab${on ? " on" : ""}" ${click}>${name}</button>`;
    }).join("");
  }

  function shell(opts) {
    opts = opts || {};
    const tab = opts.tab || "subscribers";
    return `
      <div class="stagewrap"><div id="stage" class="${state.dev}">
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
              <div class="etabs">${mcTabs(tab)}</div>
              ${opts.body || ""}
            </main>
          </div>
        </div>
        ${opts.overlay || ""}
        ${opts.toast ? `<div class="toast" role="status">${opts.toast}</div>` : ""}
      </div></div>`;
  }

  function ident(opts) {
    opts = opts || {};
    const addBtn = opts.add === false ? "" : `<button class="btn pri" type="button" onclick="openScene('add')">Add subscriber</button>`;
    return `<div class="ident">
      <div class="left">
        <h2>${esc(C().title)} <span class="badge mc">Mailchimp</span></h2>
        <p class="help">${esc(opts.help || C().help)}</p>
      </div>
      ${addBtn}
    </div>`;
  }

  function pagerText() {
    const s = state.s;
    const total = D().total - goneCount();
    const totalLbl = total.toLocaleString("en-US");
    if (s === "empty") return { label: "0–0 of 0", prev: true, next: true };
    if (s === "search") {
      const n = visibleRows().length;
      return { label: n ? ("1–" + n + " of " + n) : "0–0 of 0", prev: true, next: true };
    }
    if (s === "page2" || state.page === 2) {
      return { label: "51–100 of " + totalLbl, prev: false, next: false };
    }
    const goneHere = live.filter(function (p) { return p.gone; }).length;
    const end = Math.max(0, 50 - goneHere);
    if (end === 0) return { label: "0–0 of " + totalLbl, prev: true, next: true };
    return { label: "1–" + end + " of " + totalLbl, prev: true, next: false };
  }

  function tools() {
    const pg = pagerText();
    const q = state.s === "search" ? (state.q || "subscriber@example.com") : "";
    const prevDis = pg.prev ? " disabled" : "";
    const nextDis = pg.next ? " disabled" : "";
    const prevClick = pg.prev ? "" : "onclick=\"sw('s','list')\"";
    const nextClick = pg.next ? "" : "onclick=\"sw('s','page2')\"";
    return `<div class="tools">
      <div class="left">
        <input class="search" id="searchBox" type="search" placeholder="Search by email" value="${esc(q)}" aria-label="Search by email">
      </div>
      <div class="right">
        <div class="pager">
          <span class="nums">${esc(pg.label)}</span>
          <button class="btn quiet" type="button"${prevDis} ${prevClick}>Previous</button>
          <button class="btn quiet" type="button"${nextDis} ${nextClick}>Next</button>
        </div>
      </div>
    </div>`;
  }

  function statusAction(p) {
    if (p.status === "subscribed") return { kind: "unsub", label: "Unsubscribe" };
    if (p.status === "unsubscribed") return { kind: "resub", label: "Re-subscribe" };
    return null;
  }

  function rowActs(p) {
    const email = p.email;
    const a = attr(email);
    const editS = state.dir === "c" ? "detail" : "edit";
    const histS = state.dir === "b" ? "history-modal" : (state.dir === "c" ? "detail-history" : "history");
    return `<div class="row-acts">
      <button class="btn quiet" type="button" data-act="edit" data-email="${esc(email)}" onclick="event.stopPropagation();act('${editS}','${a}')">Edit</button>
      <button class="btn link" type="button" data-act="history" data-email="${esc(email)}" onclick="event.stopPropagation();act('${histS}','${a}')">History</button>
    </div>`;
  }

  function personActs(p) {
    const email = p.email;
    const a = attr(email);
    const st = statusAction(p);
    const stBtn = st
      ? `<button class="btn quiet" type="button" data-act="${st.kind}" data-email="${esc(email)}" onclick="act('${st.kind}','${a}')">${esc(st.label)}</button>`
      : "";
    return `${stBtn}
      <button class="btn quiet" type="button" data-act="remove" data-email="${esc(email)}" onclick="act('remove','${a}')">Remove</button>
      <button class="btn quiet" type="button" data-act="delete" data-email="${esc(email)}" style="color:#c62828;border-color:#c62828" onclick="act('delete','${a}')">Permanently delete</button>`;
  }

  function table(rows, hiEmail) {
    const vis = rows;
    const tr = vis.map(function (p) {
      const on = hiEmail && p.email === hiEmail;
      return `<tr class="${on ? "hi" : ""}" data-email="${esc(p.email)}">
        <td>${esc(p.email)}</td>
        <td>${esc(nameOf(p))}</td>
        <td>${chip(p.status)}</td>
        <td>${tagsOf(p)}</td>
        <td>${esc(p.changed || "—")}</td>
        <td class="acts-cell">${rowActs(p)}</td>
      </tr>`;
    }).join("");
    const cards = vis.map(function (p) { return cardItem(p, hiEmail); }).join("");
    return `<div class="card list-wrap">
      <table class="list">
        <thead><tr>
          <th>Email</th><th>Name</th><th>Status</th><th>Tags</th><th>Last changed</th><th></th>
        </tr></thead>
        <tbody>${tr}</tbody>
      </table>
      <div class="cards">${cards}</div>
    </div>`;
  }

  function cardItem(p, hiEmail) {
    const hi = hiEmail && p.email === hiEmail;
    const go = state.dir === "c" ? `onclick="if(!event.target.closest('button,input,.row-acts'))act('detail','${attr(p.email)}')"` : "";
    return `<div class="pcard" data-email="${esc(p.email)}" style="${hi ? "background:#f5f9fd" : ""}" ${go}>
      <div class="top">
        <div class="body">
          <div class="nm">${esc(p.email)}</div>
          <div class="meta">${esc(nameOf(p))} · ${chip(p.status)} · ${esc(p.changed || "")}</div>
          <div style="margin-top:6px">${tagsOf(p)}</div>
        </div>
      </div>
      ${rowActs(p)}
    </div>`;
  }

  function cardList(rows, hiEmail) {
    return `<div class="card">${rows.map(function (p) { return cardItem(p, hiEmail); }).join("")}</div>`;
  }

  function historyItems(email, extra) {
    const items = (histExtra[email] || []).concat(D().history[email] || []);
    if (extra) items.unshift(extra);
    if (!items.length) return `<p class="hint">No changes recorded for this subscriber yet.</p>`;
    return `<ul class="hist">${items.map(function (h) {
      return `<li><div><span class="who">${esc(h.who)}</span> ${esc(h.action)}</div><div class="when">${esc(h.when)}</div></li>`;
    }).join("")}</ul>`;
  }

  function addForm(opts) {
    opts = opts || {};
    const source = opts.source || "";
    return `
      <div class="field"><label for="addEmail">Email</label><input id="addEmail" type="email" value="${esc(opts.email || "")}" placeholder="name@example.com"></div>
      <div class="row2">
        <div class="field"><label for="addFirst">First name</label><input id="addFirst" value="${esc(opts.first || "")}"></div>
        <div class="field"><label for="addLast">Last name</label><input id="addLast" value="${esc(opts.last || "")}"></div>
      </div>
      <div class="field">
        <label for="addSource">Consent source</label>
        <select id="addSource">
          <option value="">Select a source</option>
          ${D().sources.map(function (s) {
            return `<option${s === source ? " selected" : ""}>${esc(s)}</option>`;
          }).join("")}
        </select>
      </div>
      ${source === "Other" ? `<div class="field"><label for="addNote">Note</label><textarea id="addNote" placeholder="How did you get consent?"></textarea></div>` : ""}
      <label class="checkline"><input id="casl" type="checkbox"${opts.casl ? " checked" : ""}> ${esc(C().casl)}</label>
      <p class="note">${esc(C().caslNote)}</p>
      ${opts.blocked ? `<div class="alert error">${esc(C().caslError)}</div>` : ""}
    `;
  }

  function editForm(p) {
    const selected = {};
    (p.tags || []).forEach(function (t) { selected[t] = true; });
    const tagBtns = D().tags.map(function (t) {
      const on = selected[t];
      return `<span class="tag" style="${on ? "" : "background:#fff;color:#455a64;border-color:#c4c4c4"}">${esc(t)}</span>`;
    }).join("");
    return `
      <div class="field"><label>Email</label><input value="${esc(p.email)}" disabled></div>
      <div class="row2">
        <div class="field"><label>First name</label><input value="${esc(p.first || "")}"></div>
        <div class="field"><label>Last name</label><input value="${esc(p.last || "")}"></div>
      </div>
      <div class="row2">
        <div class="field"><label>Phone (merge field)</label><input value="${esc(p.phone || "")}" placeholder="604-555-0100"></div>
        <div class="field"><label>City (merge field)</label><input value="${esc(p.city || "")}"></div>
      </div>
      <div class="field"><label>Tags</label><div>${tagBtns}</div></div>
    `;
  }

  function closeToList() { return "onclick=\"goList()\""; }
  function scrimClose() { return "onclick=\"if(event.target===this)goList()\""; }

  function drawer(kind) {
    const email = targetEmail();
    const p = targetPerson();
    let title = "Subscriber";
    let sub = email;
    let body = "";
    let foot = `<button class="btn quiet" type="button" ${closeToList()}>Cancel</button>`;
    const tab = (kind === "history" || kind === "detail-history") ? "history" : "profile";
    if (kind === "add" || kind === "add-err") {
      title = "Add subscriber";
      sub = "News page audience · Mailchimp";
      body = addForm({ blocked: kind === "add-err", casl: false, email: kind === "add-err" ? "new.client@example.com" : "", first: kind === "add-err" ? "New" : "", last: kind === "add-err" ? "Client" : "" });
      foot = `<button class="btn quiet" type="button" ${closeToList()}>Cancel</button>
              <button class="btn pri" type="button" id="addBtn">Add subscriber</button>`;
    } else {
      title = nameOf(p);
      sub = p.email + " · Mailchimp";
      const tabs = `<div class="dtabs">
        <button type="button" class="dtab${tab === "profile" ? " on" : ""}" onclick="act('edit','${attr(p.email)}')">Profile</button>
        <button type="button" class="dtab${tab === "history" ? " on" : ""}" onclick="act('history','${attr(p.email)}')">History</button>
      </div>`;
      if (tab === "history") {
        body = tabs + historyItems(p.email);
        foot = `<div class="left-acts">${personActs(p)}</div>
                <button class="btn quiet" type="button" ${closeToList()}>Close</button>`;
      } else {
        body = tabs + editForm(p);
        foot = `<div class="left-acts">${personActs(p)}</div>
                <button class="btn quiet" type="button" ${closeToList()}>Cancel</button>
                <button class="btn pri" type="button" onclick="sw('s','edit-done')">Save changes</button>`;
      }
    }
    return `<div class="scrim" ${scrimClose()}>
      <aside class="drawer" role="dialog" aria-label="${esc(title)}" onclick="event.stopPropagation()">
        <div class="dh"><div class="ttl">${esc(title)}<div class="sub">${esc(sub)}</div></div>
          <button class="x" type="button" aria-label="Close" ${closeToList()}>×</button></div>
        <div class="db">${body}</div>
        <div class="df">${foot}</div>
      </aside>
    </div>`;
  }

  function dialogCopy(kind) {
    const email = targetEmail();
    const list = selectedPeople();
    if (kind === "unsub") {
      return {
        title: "Unsubscribe this person?",
        body: `<p>${esc(email)} will be marked Unsubscribed in Mailchimp and will stop getting campaigns. You can ask Mailchimp to send them a confirmation email later if they want to subscribe again.</p>`,
        ok: "Unsubscribe",
        okKind: "unsub-done",
        danger: false
      };
    }
    if (kind === "resub") {
      return {
        title: "Mailchimp will send a confirmation email",
        body: `<p>${esc(email)} unsubscribed earlier, so Mailchimp will not add them back right away. Mailchimp will email them a confirmation link instead. Their status stays Pending until they confirm.</p>`,
        ok: "Send confirmation email",
        okKind: "pending",
        danger: false
      };
    }
    if (kind === "remove") {
      return {
        title: "Remove this subscriber?",
        body: `<p>Remove archives ${esc(email)} in Mailchimp. They stop getting campaigns, and you can add them again later if you have consent. This is not a permanent delete.</p>`,
        ok: "Remove",
        okKind: "remove-done",
        danger: false
      };
    }
    if (kind === "delete") {
      return {
        title: "Permanently delete this subscriber?",
        body: `<div class="warnbox">This cannot be undone. Mailchimp permanently deletes ${esc(email)} from the News page audience and will not let you add this address again easily. Type the email to confirm.</div>
          <div class="field typein"><label for="confirmEmail">Type ${esc(email)} to confirm</label>
          <input id="confirmEmail" type="text" name="fc-confirm-delete" value="" placeholder="${esc(email)}" autocomplete="off" autocapitalize="off" spellcheck="false" data-expect="${esc(email)}"></div>`,
        ok: "Permanently delete",
        okKind: "delete-done",
        danger: true,
        typeConfirm: email
      };
    }
    if (kind === "bulk-unsub") {
      const targets = selectedSubscribed();
      const skipped = list.length - targets.length;
      const items = targets.map(function (p) { return `<li>${esc(p.email)}</li>`; }).join("");
      const skip = skipped ? `<p class="hint">${skipped} selected ${skipped === 1 ? "person isn’t" : "people aren’t"} subscribed and will be skipped.</p>` : "";
      return {
        title: targets.length === 1 ? "Unsubscribe this person?" : "Unsubscribe these people?",
        body: `<p>${targets.length} ${targets.length === 1 ? "subscriber" : "subscribers"} will be marked Unsubscribed in Mailchimp and will stop getting campaigns.</p><ul class="bulk-list">${items}</ul>${skip}`,
        ok: "Unsubscribe",
        okKind: "bulk-unsub-done",
        danger: false
      };
    }
    if (kind === "bulk-remove") {
      const items = list.map(function (p) { return `<li>${esc(p.email)}</li>`; }).join("");
      return {
        title: list.length === 1 ? "Remove this subscriber?" : "Remove these subscribers?",
        body: `<p>Remove archives ${list.length} ${list.length === 1 ? "subscriber" : "subscribers"} in Mailchimp. They stop getting campaigns, and you can add them again later if you have consent. This is not a permanent delete.</p><ul class="bulk-list">${items}</ul>`,
        ok: "Remove",
        okKind: "bulk-remove-done",
        danger: false
      };
    }
    return { title: "", body: "", ok: "OK", okKind: "list" };
  }

  function modal(kind) {
    if (kind === "add" || kind === "add-err" || kind === "edit" || kind === "history-modal") {
      return formModal(kind);
    }
    const d = dialogCopy(kind);
    const cls = "dlg sm";
    const okClass = d.danger ? "btn danger" : "btn pri";
    const okId = d.typeConfirm ? "id=\"delBtn\" disabled" : "";
    const okClick = d.typeConfirm ? "" : `onclick="confirmDo('${d.okKind}')"`;
    return `<div class="scrim" ${scrimClose()}>
      <div class="${cls}" role="dialog" aria-label="${esc(d.title)}" onclick="event.stopPropagation()">
        <div class="dh">${esc(d.title)}</div>
        <div class="db">${d.body}</div>
        <div class="df">
          <button class="btn quiet" type="button" ${closeToList()}>Cancel</button>
          <button class="${okClass}" type="button" ${okId} ${okClick} data-confirm="${d.okKind}">${esc(d.ok)}</button>
        </div>
      </div>
    </div>`;
  }

  function formModal(kind) {
    const p = targetPerson();
    let title = "";
    let body = "";
    let foot = "";
    const cls = "dlg";
    if (kind === "add" || kind === "add-err") {
      title = "Add subscriber";
      body = `<p class="hint">Adds this person to the Mailchimp audience “News page audience”. This is not the FTT Mail list.</p>` + addForm({ blocked: kind === "add-err", casl: false, email: kind === "add-err" ? "new.client@example.com" : "" });
      foot = `<button class="btn quiet" type="button" ${closeToList()}>Cancel</button>
              <button class="btn pri" type="button" id="addBtn">Add subscriber</button>`;
    } else if (kind === "edit") {
      title = "Edit subscriber";
      body = `<p class="hint">${esc(p.email)} · Mailchimp · News page audience</p>` + editForm(p);
      foot = `<div class="left-acts">${personActs(p)}</div>
              <button class="btn quiet" type="button" ${closeToList()}>Cancel</button>
              <button class="btn pri" type="button" onclick="sw('s','edit-done')">Save changes</button>`;
    } else if (kind === "history-modal") {
      title = "Change history";
      body = `<p class="hint">${esc(p.email)}</p>` + historyItems(p.email);
      foot = `<div class="left-acts">${personActs(p)}</div>
              <button class="btn quiet" type="button" ${closeToList()}>Close</button>`;
    }
    return `<div class="scrim" ${scrimClose()}>
      <div class="${cls}" role="dialog" aria-label="${esc(title)}" onclick="event.stopPropagation()">
        <div class="dh">${esc(title)}</div>
        <div class="db">${body}</div>
        <div class="df">${foot}</div>
      </div>
    </div>`;
  }

  function listPane() {
    const s = state.s;
    if (s === "loading") {
      return ident({ add: false }) + `<div class="loading"><div class="spin"></div><div>${esc(C().loading)}</div></div>`;
    }
    if (s === "error-connect") {
      return ident({ add: false }) + `<div class="errbox"><div class="al"><b>Mailchimp isn’t connected</b><div>${esc(C().errConnect)}</div></div>
        <button class="btn pri" type="button" onclick="sw('s','settings')">Open Settings</button></div>`;
    }
    if (s === "error-api") {
      return ident({ add: false }) + `<div class="errbox"><div class="al"><b>Couldn’t load subscribers</b><div>${esc(C().errApi)}</div></div>
        <button class="btn pri" type="button" onclick="sw('s','list')">Try again</button></div>`;
    }
    if (s === "empty") {
      return ident() + tools() + `<div class="empty">${esc(C().empty)}</div>`;
    }
    const rows = visibleRows();
    const hi = ["unsub", "unsub-done", "remove", "delete", "delete-done", "edit", "history", "history-modal", "menu", "add", "search", "resub", "pending"].indexOf(s) !== -1
      ? targetEmail()
      : "";
    const body = state.dir === "c" ? cardList(rows, hi) : table(rows, hi);
    if (s === "search" && rows.length === 0) {
      return ident() + tools() + `<div class="empty">${esc(C().emptySearch)}</div>`;
    }
    return ident() + tools() + body;
  }

  function historyTab() {
    const items = (function () {
      const extras = [];
      Object.keys(histExtra).forEach(function (email) {
        histExtra[email].forEach(function (h) { extras.push(Object.assign({ email: email }, h)); });
      });
      return extras.concat(D().allHistory);
    })();
    const rows = items.map(function (h) {
      return `<tr>
        <td class="nowrap">${esc(h.when)}</td>
        <td class="nowrap">${esc(h.who)}</td>
        <td>${esc(h.action)}</td>
        <td class="nowrap">${esc(h.email)}</td>
      </tr>`;
    }).join("");
    const cards = items.map(function (h) {
      return `<div class="pcard"><div class="nm">${esc(h.action)}</div><div class="meta">${esc(h.who)} · ${esc(h.when)}</div></div>`;
    }).join("");
    return `<div class="ident">
      <div class="left">
        <h2>Mailchimp change history <span class="badge mc">Mailchimp</span></h2>
        <p class="help">${esc(C().historyHelp)}</p>
      </div>
    </div>
    <div class="tools"><div class="left"><input class="search" type="search" placeholder="Search by email" aria-label="Search history by email"></div>
      <div class="right"><div class="pager"><span class="nums">1–${items.length} of ${items.length}</span></div></div></div>
    <div class="card list-wrap">
      <table class="list">
        <thead><tr><th>When</th><th>Who</th><th>Change</th><th>Email</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="cards">${cards}</div>
    </div>`;
  }

  function detailPage() {
    const p = targetPerson();
    if (!p || p.gone) {
      return `<div class="detail">
        <div class="back"><button class="btn link" type="button" onclick="sw('s','list')">← Mailchimp Subscribers</button></div>
        <p class="hint">That subscriber is no longer in this Mailchimp audience.</p>
      </div>`;
    }
    return `<div class="detail">
      <div class="back"><button class="btn link" type="button" onclick="sw('s','list')">← Mailchimp Subscribers</button></div>
      <h2>${esc(nameOf(p))} ${chip(p.status)} <span class="badge mc">Mailchimp</span></h2>
      <p class="em">${esc(p.email)} · News page audience</p>
      <div class="sec">
        <h3>Profile</h3>
        ${editForm(p)}
        <div class="df-row" style="margin-top:8px">
          <button class="btn pri" type="button" onclick="sw('s','edit-done')">Save changes</button>
        </div>
      </div>
      <div class="sec">
        <h3>Actions</h3>
        <div class="row-acts" style="justify-content:flex-start">${personActs(p)}</div>
      </div>
      <div class="sec">
        <h3>Change history</h3>
        ${historyItems(p.email)}
      </div>
    </div>`;
  }

  function todayBody() {
    const rows = D().audiences.map(function (a) {
      return `<tr><td>${esc(a.name)}</td><td>${a.count.toLocaleString("en-US")}</td><td>${a.id === "news" ? "Default" : "—"}</td></tr>`;
    }).join("");
    return `<div class="ident">
      <div class="left">
        <h2>Audiences <span class="badge mc">Mailchimp</span></h2>
        <p class="help">${esc(C().todayHelp)}</p>
      </div>
    </div>
    <div class="aud">
      <div class="field" style="max-width:320px">
        <label>Default audience</label>
        <select><option>News page audience (1,284 subscribers)</option><option>Event follow-ups (86 subscribers)</option></select>
      </div>
    </div>
    <div class="card list-wrap">
      <table class="list">
        <thead><tr><th>Name</th><th>Subscribers</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  function settingsBody(connected) {
    return `<div class="settings">
      <h2>Mailchimp</h2>
      ${connected
        ? `<div class="alert info"><b>Mailchimp is connected</b>Your Firm Name is sending through Mailchimp. Subscriber changes in the Subscribers tab update this Mailchimp account only. There is no sync with FTT Mail.</div>
           <p class="hint">Connected account: Jane Advisor · example.com</p>`
        : `<div class="alert error"><b>Mailchimp isn’t connected</b><div>${esc(C().errConnect)}</div></div>
           <button class="btn pri" type="button">Connect Mailchimp</button>`}
    </div>`;
  }

  function toastFor() {
    const s = state.s;
    const email = targetEmail();
    if (s === "edit-done") return C().toastEdit;
    if (s === "unsub-done") return "Jane Advisor unsubscribed " + email + ", " + NOW_PT + ".";
    if (s === "remove-done") return "Removed " + email + " from the Mailchimp audience.";
    if (s === "delete-done") return "Permanently deleted " + email + ". This cannot be undone.";
    if (s === "pending" || s === "resub-done") return "Confirmation email sent to " + email + ". Their status is Pending until they confirm.";
    if (s === "add-done") return C().toastAdd;
    if (s === "bulk-unsub-done") {
      const n = state.lastBulk || selectedSubscribed().length;
      return "Jane Advisor unsubscribed " + n + " subscriber" + (n === 1 ? "" : "s") + ", " + NOW_PT + ".";
    }
    if (s === "bulk-remove-done") {
      const n = state.lastBulk || 0;
      return "Removed " + n + " subscriber" + (n === 1 ? "" : "s") + " from the Mailchimp audience.";
    }
    return "";
  }

  function overlayFor() {
    const s = state.s;
    const dir = state.dir;
    if (s === "add" || s === "add-err") return dir === "a" ? drawer(s) : modal(s);
    if (s === "edit") {
      if (dir === "c") return "";
      return dir === "a" ? drawer("edit") : modal("edit");
    }
    if (s === "history") {
      if (dir === "c") return "";
      return dir === "a" ? drawer("history") : modal("history-modal");
    }
    if (s === "history-modal") return modal("history-modal");
    if (s === "unsub" || s === "resub" || s === "remove" || s === "delete") {
      return modal(s);
    }
    return "";
  }

  function applyPreset(s) {
    if (s === "unsub-done") {
      if (!state.email) state.email = "subscriber@example.com";
      setStatus(targetEmail(), "unsubscribed");
      pushHist(targetEmail(), "unsubscribed " + targetEmail());
    }
    if (s === "pending" || s === "resub-done") {
      if (!state.email) state.email = "alex.client@example.com";
      setStatus(targetEmail(), "pending");
      pushHist(targetEmail(), "asked Mailchimp to send a confirmation email to " + targetEmail() + ". Status is Pending until they confirm");
    }
    if (s === "remove-done" || s === "delete-done") {
      if (!state.email) state.email = "subscriber@example.com";
      markGone(targetEmail());
      pushHist(targetEmail(), (s === "delete-done" ? "permanently deleted " : "removed (archived) ") + targetEmail());
    }
    if (s === "resub" && !state.email) state.email = "alex.client@example.com";
    if ((s === "unsub" || s === "remove" || s === "delete" || s === "edit" || s === "history" || s === "history-modal" || s === "detail" || s === "detail-history") && !state.email) {
      state.email = "subscriber@example.com";
    }
  }

  function render() {
    const s = state.s;
    const dir = state.dir;
    let html = "";
    if (dir === "today" && s !== "settings") {
      html = shell({ tab: "audiences", body: todayBody() });
    } else if (s === "settings") {
      const connected = state.cameFrom !== "error-connect";
      html = shell({ tab: "settings", body: settingsBody(connected) });
    } else if (s === "history-tab") {
      html = shell({ tab: "history", body: historyTab() });
    } else if (dir === "c" && (s === "detail" || s === "detail-history" || s === "edit") && !overlayFor()) {
      html = shell({ tab: "subscribers", body: detailPage(), overlay: overlayFor(), toast: toastFor() });
    } else if (dir === "c" && (s === "detail" || s === "detail-history" || s === "edit")) {
      // Confirm overlays sit on the detail page
      html = shell({ tab: "subscribers", body: detailPage(), overlay: overlayFor(), toast: toastFor() });
    } else {
      html = shell({ tab: "subscribers", body: listPane(), overlay: overlayFor(), toast: toastFor() });
    }
    document.getElementById("root").innerHTML = html;
    bind();
    syncBar();
  }

  function bind() {
    const box = document.getElementById("searchBox");
    if (box) {
      box.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          state.q = box.value || "";
          state.s = "search";
          state.page = 1;
          writeQ();
          render();
        }
      });
    }
    const casl = document.getElementById("casl");
    const addSource = document.getElementById("addSource");
    const addBtn = document.getElementById("addBtn");
    if (casl && addSource && addBtn) {
      addBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (casl.checked && addSource.value) sw("s", "add-done");
        else sw("s", "add-err");
      });
    }
    const confirmEmail = document.getElementById("confirmEmail");
    const delBtn = document.getElementById("delBtn");
    if (confirmEmail && delBtn) {
      const expect = (confirmEmail.getAttribute("data-expect") || targetEmail()).trim().toLowerCase();
      function syncDel() {
        const ok = confirmEmail.value.trim().toLowerCase() === expect;
        delBtn.disabled = !ok;
        if (ok) delBtn.onclick = function () { confirmDo("delete-done"); };
      }
      confirmEmail.addEventListener("input", syncDel);
      syncDel();
    }
    const addSourceEl = document.getElementById("addSource");
    if (addSourceEl && !document.getElementById("addNote")) {
      addSourceEl.addEventListener("change", function () {
        if (addSourceEl.value === "Other") {
          const field = document.createElement("div");
          field.className = "field";
          field.innerHTML = '<label for="addNote">Note</label><textarea id="addNote" placeholder="How did you get consent?"></textarea>';
          addSourceEl.parentNode.parentNode.insertBefore(field, addSourceEl.parentNode.nextSibling);
        }
      });
    }
    const selAll = document.getElementById("selAll");
    if (selAll && selAll.getAttribute("data-indeterminate")) selAll.indeterminate = true;
    document.addEventListener("click", onDocClick, { once: true });
  }

  function onDocClick(e) {
    if (state.menu && !e.target.closest(".menu-wrap")) {
      state.menu = "";
      render();
    }
  }

  function syncBar() {
    document.querySelectorAll("[data-sw]").forEach(function (b) {
      const parts = (b.getAttribute("data-sw") || "").split(":");
      const on = (parts[0] === "dev" && state.dev === parts[1]) || (parts[0] === "s" && state.s === parts[1]);
      b.classList.toggle("on", on);
    });
  }

  function isBulkScene(s) {
    return false;
  }

  function readQ() {
    const q = new URLSearchParams(location.search);
    if (q.get("phone") === "1") state.dev = "phone";
    if (q.get("dev") === "phone") state.dev = "phone";
    if (q.get("s")) {
      const scene = q.get("s");
      state.s = (scene === "bulk" || scene.indexOf("bulk-") === 0) ? "list" : scene;
    }
    if (q.get("email")) state.email = q.get("email");
    if (q.get("q")) state.q = q.get("q");
  }

  function writeQ() {
    const q = new URLSearchParams();
    if (state.s && state.s !== defaultScene()) q.set("s", state.s);
    if (state.dev === "phone") q.set("phone", "1");
    if (state.email && state.s !== "list" && state.s !== "page2" && !isBulkScene(state.s)) q.set("email", state.email);
    const qs = q.toString();
    history.replaceState(null, "", qs ? ("?" + qs) : location.pathname);
  }

  function defaultScene() {
    if (state.dir === "today") return "audiences";
    return "list";
  }

  function goList() {
    state.cameFrom = state.s;
    state.s = state.page === 2 ? "page2" : "list";
    state.menu = "";
    writeQ();
    render();
  }

  function openScene(s) {
    state.cameFrom = state.s;
    state.s = s;
    state.menu = "";
    writeQ();
    render();
  }

  function sw(k, v) {
    if (k === "dev") {
      state.dev = v;
    }
    if (k === "s") {
      resetLive();
      state.cameFrom = state.s;
      if (v === "bulk" || v === "bulk-unsub" || v === "bulk-remove" || v === "bulk-unsub-done" || v === "bulk-remove-done") v = "list";
      state.s = v;
      if (v === "page2") state.page = 2;
      else if (v !== "search") state.page = 1;
      state.menu = "";
      state.selected = [];
      state.lastBulk = 0;
      if (v !== "search") state.q = "";
      if (!(v === "resub" || v === "pending" || v === "resub-done")) {
        // keep email if it was set via query for this jump; otherwise clear then preset
        if (!new URLSearchParams(location.search).get("email") || state.cameFrom) {
          // When mockbar jumps, start from a clean default email for the scene
          state.email = "";
        }
      } else {
        state.email = state.email || "alex.client@example.com";
      }
      applyPreset(v);
    }
    writeQ();
    render();
  }

  function act(kind, email) {
    if (email) state.email = email;
    state.cameFrom = state.s;
    state.s = kind;
    state.menu = "";
    writeQ();
    render();
  }

  function confirmDo(kind) {
    if (kind === "unsub-done") {
      setStatus(targetEmail(), "unsubscribed");
      pushHist(targetEmail(), "unsubscribed " + targetEmail());
    } else if (kind === "pending" || kind === "resub-done") {
      setStatus(targetEmail(), "pending");
      pushHist(targetEmail(), "asked Mailchimp to send a confirmation email to " + targetEmail() + ". Status is Pending until they confirm");
      kind = "pending";
    } else if (kind === "remove-done") {
      markGone(targetEmail());
      pushHist(targetEmail(), "removed (archived) " + targetEmail());
    } else if (kind === "delete-done") {
      markGone(targetEmail());
      pushHist(targetEmail(), "permanently deleted " + targetEmail());
    }
    state.s = kind;
    state.menu = "";
    writeQ();
    render();
  }

  function toggleSel(email) {
    const i = state.selected.indexOf(email);
    if (i === -1) state.selected.push(email);
    else state.selected.splice(i, 1);
    if (state.s === "list" || state.s === "page2" || state.s === "search" || state.s === "bulk" || state.s === "unsub-done" || state.s === "pending" || state.s === "add-done" || state.s === "edit-done") {
      if (state.selected.length && state.s === "list") {
        // stay on list so the bar shows; use bulk only as a named screenshot scene
      }
    }
    render();
  }

  function toggleAll() {
    const rows = visibleRows();
    const allOn = rows.length > 0 && rows.every(function (p) { return isSel(p.email); });
    if (allOn) {
      const vis = {};
      rows.forEach(function (p) { vis[p.email] = true; });
      state.selected = state.selected.filter(function (e) { return !vis[e]; });
    } else {
      rows.forEach(function (p) {
        if (!isSel(p.email)) state.selected.push(p.email);
      });
    }
    render();
  }

  function clearSel() {
    state.selected = [];
    render();
  }

  function toggleMenu(email) {
    state.menu = state.menu === email ? "" : email;
    render();
  }

  function boot(opts) {
    opts = opts || {};
    state.dir = opts.dir || "a";
    state.s = opts.s || defaultScene();
    state.dev = "desk";
    state.email = "";
    state.menu = "";
    state.selected = [];
    state.q = "";
    state.page = 1;
    resetLive();
    readQ();
    if (opts.s && !new URLSearchParams(location.search).get("s")) state.s = opts.s;
    if (state.s === "page2") state.page = 2;
    applyPreset(state.s);
    window.sw = sw;
    window.act = act;
    window.confirmDo = confirmDo;
    window.toggleSel = toggleSel;
    window.toggleAll = toggleAll;
    window.clearSel = clearSel;
    window.toggleMenu = toggleMenu;
    window.goList = goList;
    window.openScene = openScene;
    render();
  }

  window.FC908App = {
    boot: boot,
    reset: function () { resetLive(); state.selected = []; state.menu = ""; state.email = ""; state.s = "list"; applyPreset("list"); render(); },
    getState: function () { return state; },
    visibleRows: function () { return visibleRows(); },
    findLive: findLive
  };
})();

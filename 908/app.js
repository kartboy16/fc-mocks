(function () {
  const D = () => window.FC908;
  const C = () => D().copy;
  const state = { dir: "a", s: "list", dev: "desk" };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function nameOf(p) {
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

  function mcTabs(active) {
    const dir = state.dir;
    const items = dir === "today"
      ? ["Campaigns", "Default Lists", "Templates", "Audiences", "Reports", "Settings"]
      : dir === "b"
        ? ["Campaigns", "Default Lists", "Templates", "Audiences", "Subscribers", "History", "Reports", "Settings"]
        : ["Campaigns", "Default Lists", "Templates", "Audiences", "Subscribers", "Reports", "Settings"];
    return items.map(function (name) {
      const key = name.toLowerCase();
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

  function peopleForScene() {
    const s = state.s;
    let rows = D().people.map(function (p) { return Object.assign({}, p, { tags: p.tags.slice() }); });
    if (s === "unsub-done") {
      rows = rows.map(function (p) {
        if (p.email === "subscriber@example.com") {
          return Object.assign({}, p, { status: "unsubscribed", changed: "Nov 17, 2026, 10:20 AM" });
        }
        return p;
      });
    }
    if (s === "pending" || s === "resub-done") {
      rows = rows.map(function (p) {
        if (p.email === "alex.client@example.com") {
          return Object.assign({}, p, { status: "pending", changed: "Nov 17, 2026, 10:24 AM" });
        }
        return p;
      });
    }
    if (s === "remove-done" || s === "delete-done") {
      rows = rows.filter(function (p) { return p.email !== "subscriber@example.com"; });
    }
    if (s === "search") {
      rows = rows.filter(function (p) { return p.email === "subscriber@example.com"; });
    }
    if (s === "empty") return [];
    if (s === "page2") {
      rows = [
        { email: "lee.client@example.com", first: "Lee", last: "Client", status: "subscribed", tags: ["Newsletter"], changed: "Sep 18, 2026, 9:10 AM" },
        { email: "cameron.example@example.com", first: "Cameron", last: "Example", status: "subscribed", tags: ["Clients"], changed: "Sep 16, 2026, 4:02 PM" },
        { email: "skyler.client@example.com", first: "Skyler", last: "Client", status: "unsubscribed", tags: [], changed: "Sep 12, 2026, 11:28 AM" },
        { email: "jamie.client@example.com", first: "Jamie", last: "Client", status: "subscribed", tags: ["News page"], changed: "Sep 9, 2026, 2:51 PM" },
        { email: "robin.example@example.com", first: "Robin", last: "Example", status: "subscribed", tags: ["Prospects"], changed: "Sep 3, 2026, 8:17 AM" }
      ];
    }
    return rows;
  }

  function pagerText() {
    const s = state.s;
    if (s === "empty") return { label: "0–0 of 0", prev: true, next: true };
    if (s === "search") return { label: "1–1 of 1", prev: true, next: true };
    if (s === "page2") return { label: "51–100 of 1,284", prev: false, next: false };
    if (s === "remove-done" || s === "delete-done") return { label: "1–50 of 1,283", prev: true, next: false };
    return { label: "1–50 of 1,284", prev: true, next: false };
  }

  function ident(opts) {
    opts = opts || {};
    const addClick = opts.add === false ? "" : "onclick=\"sw('s','add')\"";
    const addBtn = opts.add === false ? "" : `<button class="btn pri" type="button" ${addClick}>Add subscriber</button>`;
    return `<div class="ident">
      <div class="left">
        <h2>${esc(C().title)} <span class="badge mc">Mailchimp</span></h2>
        <p class="help">${esc(opts.help || C().help)}</p>
      </div>
      ${addBtn}
    </div>`;
  }

  function tools(q) {
    const pg = pagerText();
    const prevDis = pg.prev ? " disabled" : "";
    const nextDis = pg.next ? " disabled" : "";
    const prevClick = pg.prev ? "" : "onclick=\"sw('s','list')\"";
    const nextClick = pg.next ? "" : "onclick=\"sw('s','page2')\"";
    return `<div class="tools">
      <div class="left">
        <input class="search" id="searchBox" type="search" placeholder="Search by email" value="${esc(q || "")}" aria-label="Search by email">
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

  function featured() {
    const s = state.s;
    if (s === "resub" || s === "pending" || s === "resub-done") return "alex.client@example.com";
    return "subscriber@example.com";
  }

  function actionMenu(p) {
    const email = p.email;
    const isFeat = email === featured() || email === "subscriber@example.com" || email === "alex.client@example.com";
    const editS = state.dir === "c" ? "detail" : "edit";
    const histS = state.dir === "b" ? "history-modal" : (state.dir === "c" ? "detail-history" : "history");
    let mid = "";
    if (p.status === "subscribed") {
      mid = `<button type="button" ${isFeat && email === "subscriber@example.com" ? "onclick=\\\"sw('s','unsub')\\\"" : ""}>Unsubscribe</button>`;
    } else if (p.status === "unsubscribed") {
      mid = `<button type="button" ${email === "alex.client@example.com" ? "onclick=\\\"sw('s','resub')\\\"" : ""}>Send confirmation email</button>`;
    }
    const delS = email === "subscriber@example.com" ? "onclick=\\\"sw('s','delete')\\\"" : "";
    const rmS = email === "subscriber@example.com" ? "onclick=\\\"sw('s','remove')\\\"" : "";
    const open = state.s.indexOf("menu") === 0 && email === featured();
    return `<div class="acts">
      <button class="ico-btn" type="button" title="Edit" onclick="sw('s','${editS}')">✎</button>
      <button class="ico-btn" type="button" title="History" onclick="sw('s','${histS}')">🕒</button>
      <button class="ico-btn" type="button" title="More" ${isFeat ? "onclick=\\\"sw('s','menu')\\\"" : ""}>⋮</button>
      ${open ? `<div class="menu" role="menu">
        ${mid}
        <button type="button" ${rmS}>Remove</button>
        <button type="button" style="color:#c62828" ${delS}>Permanently delete</button>
      </div>` : ""}
    </div>`;
  }

  function table(rows, hiEmail) {
    const tr = rows.map(function (p) {
      const on = hiEmail && p.email === hiEmail;
      return `<tr class="${on ? "hi" : ""}">
        <td>${esc(p.email)}</td>
        <td>${esc(nameOf(p))}</td>
        <td>${chip(p.status)}</td>
        <td>${tagsOf(p)}</td>
        <td>${esc(p.changed || "—")}</td>
        <td>${actionMenu(p)}</td>
      </tr>`;
    }).join("");
    const cards = rows.map(function (p) {
      const go = "onclick=\"sw('s','" + (p.email === "alex.client@example.com" && (state.s === "resub" || state.s === "pending") ? "detail" : (p.email === "subscriber@example.com" || state.dir === "c" ? "detail" : "list")) + "')\"";
      return `<div class="pcard" ${state.dir === "c" ? go : ""}>
        <div class="nm">${esc(p.email)}</div>
        <div class="meta">${esc(nameOf(p))} · ${chip(p.status)} · ${esc(p.changed || "")}</div>
        <div style="margin-top:6px">${tagsOf(p)}</div>
        ${state.dir === "c" ? "" : `<div style="margin-top:8px">${actionMenu(p)}</div>`}
      </div>`;
    }).join("");
    return `<div class="card list-wrap">
      <table class="list">
        <thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Tags</th><th>Last changed</th><th></th></tr></thead>
        <tbody>${tr}</tbody>
      </table>
      <div class="cards">${cards}</div>
    </div>`;
  }

  function cardList(rows) {
    const cards = rows.map(function (p) {
      const hi = p.email === featured() && (state.s === "list" || state.s === "search" || state.s === "page2");
      return `<div class="pcard" style="cursor:pointer${hi ? ";background:#f5f9fd" : ""}" onclick="sw('s','detail')">
        <div class="nm">${esc(p.email)}</div>
        <div class="meta">${esc(nameOf(p))} · ${chip(p.status)}</div>
        <div class="meta">${esc(p.changed || "")}</div>
        <div style="margin-top:6px">${tagsOf(p)}</div>
      </div>`;
    }).join("");
    return `<div class="card">${cards}</div>`;
  }

  function findPerson(email) {
    const rows = peopleForScene();
    return rows.filter(function (p) { return p.email === email; })[0]
      || D().people.filter(function (p) { return p.email === email; })[0]
      || D().people[0];
  }

  function historyItems(email, extra) {
    const items = (D().history[email] || []).slice();
    if (extra) items.unshift(extra);
    if (!items.length) return `<p class="hint">No changes recorded for this subscriber yet.</p>`;
    return `<ul class="hist">${items.map(function (h) {
      return `<li><div><span class="who">${esc(h.who)}</span> ${esc(h.action)}</div><div class="when">${esc(h.when)}</div></li>`;
    }).join("")}</ul>`;
  }

  function addForm(opts) {
    opts = opts || {};
    const blocked = !!opts.blocked;
    const other = !!opts.other;
    const source = other ? "Other" : (opts.source || "");
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
      ${other || source === "Other" ? `<div class="field"><label for="addNote">Note</label><textarea id="addNote" placeholder="How did you get consent?">${esc(opts.note || "")}</textarea></div>` : ""}
      <label class="checkline"><input id="casl" type="checkbox"${opts.casl ? " checked" : ""}> ${esc(C().casl)}</label>
      <p class="note">${esc(C().caslNote)}</p>
      ${blocked ? `<div class="alert error">${esc(C().caslError)}</div>` : ""}
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

  function drawer(kind) {
    const email = featured();
    const p = findPerson(email);
    let title = "Subscriber";
    let sub = email;
    let body = "";
    let foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>`;
    const tab = (kind === "history" || kind === "detail-history") ? "history" : "profile";
    if (kind === "add" || kind === "add-err") {
      title = "Add subscriber";
      sub = "News page audience · Mailchimp";
      body = addForm({ blocked: kind === "add-err", casl: false, email: kind === "add-err" ? "new.client@example.com" : "", first: kind === "add-err" ? "New" : "", last: kind === "add-err" ? "Client" : "" });
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn pri" type="button" id="addBtn">Add subscriber</button>`;
    } else if (kind === "edit" || kind === "history" || kind === "detail-history") {
      title = nameOf(p);
      sub = p.email + " · Mailchimp";
      const tabs = `<div class="dtabs">
        <button type="button" class="dtab${tab === "profile" ? " on" : ""}" onclick="sw('s','edit')">Profile</button>
        <button type="button" class="dtab${tab === "history" ? " on" : ""}" onclick="sw('s','history')">History</button>
      </div>`;
      if (tab === "history") {
        let extra = null;
        if (state.s === "unsub-done") {
          extra = { who: "Jane Advisor", action: "unsubscribed subscriber@example.com", when: "Nov 17, 2026, 10:20 AM PT" };
        }
        body = tabs + historyItems(p.email, extra);
        foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Close</button>`;
      } else {
        body = tabs + editForm(p);
        foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
                <button class="btn pri" type="button" onclick="sw('s','edit-done')">Save changes</button>`;
      }
    }
    return `<div class="scrim" onclick="if(event.target===this)sw('s','list')">
      <aside class="drawer" role="dialog" aria-label="${esc(title)}" onclick="event.stopPropagation()">
        <div class="dh"><div class="ttl">${esc(title)}<div class="sub">${esc(sub)}</div></div>
          <button class="x" type="button" aria-label="Close" onclick="sw('s','list')">×</button></div>
        <div class="db">${body}</div>
        <div class="df">${foot}</div>
      </aside>
    </div>`;
  }

  function modal(kind) {
    const p = findPerson(featured());
    let title = "";
    let body = "";
    let foot = "";
    let cls = "dlg sm";
    if (kind === "add" || kind === "add-err") {
      cls = "dlg";
      title = "Add subscriber";
      body = `<p class="hint">Adds this person to the Mailchimp audience “News page audience”. This is not the FTT Mail list.</p>` + addForm({ blocked: kind === "add-err", casl: false, email: kind === "add-err" ? "new.client@example.com" : "" });
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn pri" type="button" id="addBtn">Add subscriber</button>`;
    } else if (kind === "edit") {
      cls = "dlg";
      title = "Edit subscriber";
      body = `<p class="hint">${esc(p.email)} · Mailchimp · News page audience</p>` + editForm(p);
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn pri" type="button" onclick="sw('s','edit-done')">Save changes</button>`;
    } else if (kind === "history-modal") {
      cls = "dlg";
      title = "Change history";
      body = `<p class="hint">${esc(p.email)}</p>` + historyItems(p.email);
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Close</button>`;
    } else if (kind === "unsub") {
      title = C().unsubTitle;
      body = `<p>${esc(C().unsubBody)}</p>`;
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn pri" type="button" onclick="sw('s','unsub-done')">Unsubscribe</button>`;
    } else if (kind === "resub") {
      title = C().resubTitle;
      body = `<p>${esc(C().resubBody)}</p>`;
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn pri" type="button" onclick="sw('s','pending')">${esc(C().resubOk)}</button>`;
    } else if (kind === "remove") {
      title = C().removeTitle;
      body = `<p>${esc(C().removeBody)}</p>`;
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn" type="button" onclick="sw('s','remove-done')">Remove</button>`;
    } else if (kind === "delete") {
      title = C().deleteTitle;
      body = `<div class="warnbox">${esc(C().deleteBody)}</div>
        <div class="field typein"><label for="confirmEmail">Type subscriber@example.com to confirm</label>
        <input id="confirmEmail" type="text" name="fc-confirm-delete" value="" placeholder="subscriber@example.com" autocomplete="off" autocapitalize="off" spellcheck="false"></div>`;
      foot = `<button class="btn quiet" type="button" onclick="sw('s','list')">Cancel</button>
              <button class="btn danger" id="delBtn" type="button" disabled>Permanently delete</button>`;
    }
    return `<div class="scrim" onclick="if(event.target===this)sw('s','list')">
      <div class="${cls}" role="dialog" aria-label="${esc(title)}" onclick="event.stopPropagation()">
        <div class="dh">${esc(title)}</div>
        <div class="db">${body}</div>
        <div class="df">${foot}</div>
      </div>
    </div>`;
  }

  function confirmOverlay(kind) {
    // A uses a confirm dialog (not the drawer) for destructive actions
    return modal(kind);
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
      return ident() + tools("") + `<div class="empty">${esc(C().empty)}</div>`;
    }
    const q = s === "search" ? "subscriber@example.com" : "";
    const rows = peopleForScene();
    const hi = (s === "unsub" || s === "unsub-done" || s === "remove" || s === "delete" || s === "menu" || s === "edit" || s === "history" || s === "add" || s === "search")
      ? "subscriber@example.com"
      : ((s === "resub" || s === "pending") ? "alex.client@example.com" : "");
    const body = state.dir === "c" ? cardList(rows) : table(rows, hi);
    const emptySearch = s === "search" && rows.length === 0
      ? `<div class="empty">${esc(C().emptySearch)}</div>`
      : body;
    return ident() + tools(q) + emptySearch;
  }

  function historyTab() {
    const items = D().allHistory;
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
      <div class="right"><div class="pager"><span class="nums">1–10 of 10</span></div></div></div>
    <div class="card list-wrap">
      <table class="list">
        <thead><tr><th>When</th><th>Who</th><th>Change</th><th>Email</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="cards">${cards}</div>
    </div>`;
  }

  function detailPage() {
    const email = featured();
    const p = findPerson(email);
    const histExtra = state.s === "unsub-done"
      ? { who: "Jane Advisor", action: "unsubscribed subscriber@example.com", when: "Nov 17, 2026, 10:20 AM PT" }
      : null;
    const showHist = state.s === "detail-history" || state.s === "history";
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
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${p.status === "subscribed" ? `<button class="btn quiet" type="button" onclick="sw('s','unsub')">Unsubscribe</button>` : ""}
          ${p.status === "unsubscribed" ? `<button class="btn quiet" type="button" onclick="sw('s','resub')">Send confirmation email</button>` : ""}
          <button class="btn quiet" type="button" onclick="sw('s','remove')">Remove</button>
          <button class="btn quiet" type="button" style="color:#c62828;border-color:#c62828" onclick="sw('s','delete')">Permanently delete</button>
        </div>
      </div>
      <div class="sec">
        <h3>Change history</h3>
        ${historyItems(p.email, histExtra)}
        ${showHist ? "" : ""}
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
        : `<div class="alert error"><b>Mailchimp isn’t connected</b>${esc(C().errConnect)}</div>
           <button class="btn pri" type="button">Connect Mailchimp</button>`}
    </div>`;
  }

  function toastFor() {
    const s = state.s;
    if (s === "edit-done") return C().toastEdit;
    if (s === "unsub-done") return C().toastUnsub;
    if (s === "remove-done") return C().toastRemove;
    if (s === "delete-done") return C().toastDelete;
    if (s === "pending" || s === "resub-done") return C().toastResub;
    if (s === "add-done") return C().toastAdd;
    return "";
  }

  function overlayFor() {
    const s = state.s;
    const dir = state.dir;
    if (s === "add" || s === "add-err") {
      return dir === "a" ? drawer(s) : modal(s);
    }
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
      return confirmOverlay(s);
    }
    if (s === "menu") return "";
    return "";
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
    } else if (dir === "c" && (s === "detail" || s === "detail-history" || s === "edit")) {
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
          if ((box.value || "").toLowerCase().indexOf("subscriber@example.com") !== -1) sw("s", "search");
          else sw("s", "search");
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
      function syncDel() {
        const ok = confirmEmail.value.trim().toLowerCase() === "subscriber@example.com";
        delBtn.disabled = !ok;
        if (ok) delBtn.onclick = function () { sw("s", "delete-done"); };
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
  }

  function syncBar() {
    document.querySelectorAll("[data-sw]").forEach(function (b) {
      const parts = (b.getAttribute("data-sw") || "").split(":");
      const on = (parts[0] === "dev" && state.dev === parts[1]) || (parts[0] === "s" && state.s === parts[1]);
      b.classList.toggle("on", on);
    });
  }

  function readQ() {
    const q = new URLSearchParams(location.search);
    if (q.get("phone") === "1") state.dev = "phone";
    if (q.get("dev") === "phone") state.dev = "phone";
    if (q.get("s")) state.s = q.get("s");
  }

  function writeQ() {
    const q = new URLSearchParams();
    if (state.s && state.s !== defaultScene()) q.set("s", state.s);
    if (state.dev === "phone") q.set("phone", "1");
    const qs = q.toString();
    history.replaceState(null, "", qs ? ("?" + qs) : location.pathname);
  }

  function defaultScene() {
    if (state.dir === "today") return "audiences";
    return "list";
  }

  function sw(k, v) {
    if (k === "dev") state.dev = v;
    if (k === "s") {
      state.cameFrom = state.s;
      state.s = v;
    }
    writeQ();
    render();
  }

  function boot(opts) {
    opts = opts || {};
    state.dir = opts.dir || "a";
    state.s = opts.s || defaultScene();
    state.dev = "desk";
    readQ();
    if (opts.s && !new URLSearchParams(location.search).get("s")) state.s = opts.s;
    window.sw = sw;
    render();
  }

  window.FC908App = { boot: boot };
})();

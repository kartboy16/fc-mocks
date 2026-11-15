(function () {
  const F = window.FC890;
  window.FC890App = {
    shell(opts) {
      const admin = opts.who !== "advisor";
      const menu = opts.adminPage
        ? `<div class="ri"><span class="ico">📄</span>Content</div>
           <div class="ri"><span class="ico">🖥</span>Website</div>
           <div class="ri"><span class="ico">🔗</span>Social Media</div>
           <div class="ri"><span class="ico">✉</span>Email Campaigns</div>
           <div class="ri on"><span class="ico">⚙</span>Admin</div>`
        : `<div class="ri"><span class="ico">📄</span>Content</div>
           <div class="ri"><span class="ico">🖥</span>Website</div>
           <div class="ri"><span class="ico">🔗</span>Social Media</div>
           <div class="ri on"><span class="ico">✉</span>Email Campaigns</div>`;
      const tabs = opts.adminPage
        ? `<div class="etabs"><div class="etab">Users</div><div class="etab">Categories</div><div class="etab on">Delivery log</div></div>`
        : `<div class="etabs"><div class="etab">Campaigns</div><div class="etab">Lists</div><div class="etab">Default Lists</div><div class="etab">Subscribers</div><div class="etab">Forms</div><div class="etab on">Reports</div><div class="etab">Settings</div></div>`;
      const title = opts.adminPage ? "Delivery log" : "Reports";
      const banner = admin
        ? `<div class="impbar" id="impbar">Viewing as <b>Jane Advisor</b> · Your Firm Name <button type="button" class="end" onclick="alert('Ends the impersonation session. This is a mock.')">End session</button></div>`
        : "";
      return `
        ${banner}
        <div class="stagewrap"><div id="stage" class="${opts.dev || "desk"}">
          <div class="app">
            <nav class="rail"><div class="logo">YFN<small>Your Firm Name</small></div>${menu}</nav>
            <div style="flex:1;min-width:0;display:flex;flex-direction:column">
              <div class="mbar"><button type="button" aria-label="Menu">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">YFN</div><div class="av">JA</div></div>
              <main class="main">
                <h1 class="page">${title}</h1>
                ${tabs}
                ${opts.adminPage ? "" : `<div class="rpt"><table><thead><tr><th>Campaign</th><th>Sent</th><th>Recipients</th><th>Delivered</th><th>Open rate</th><th>Bounces</th><th></th></tr></thead><tbody>
                  <tr><td>November market notes</td><td>Nov 10, 2026, 9:00 AM PT</td><td>1,240</td><td>1,186</td><td>43.2%</td><td>28</td><td><button class="link" type="button">View report</button></td></tr>
                  <tr><td>October newsletter</td><td>Oct 13, 2026, 10:00 AM PT</td><td>1,198</td><td>1,190</td><td>41.0%</td><td>6</td><td><button class="link" type="button">View report</button></td></tr>
                </tbody></table></div>`}
              </main>
            </div>
          </div>
          ${opts.body || ""}
        </div></div>`;
    },

    badge() {
      return `<span class="badge"><span class="dot"></span>Admin only · not visible to advisor</span>`;
    },

    countStats() {
      const C = F.CAMPAIGN;
      return `<div class="stats">
        <div class="stat"><div class="v">${C.sent.toLocaleString()}</div><div class="l">Sent</div></div>
        <div class="stat"><div class="v ok">${C.delivered.toLocaleString()}</div><div class="l">Delivered</div></div>
        <div class="stat"><div class="v err">${C.bounced}</div><div class="l">Bounced</div><div class="s">${C.permanent} permanent · ${C.temporary} temporary</div></div>
        <div class="stat"><div class="v" style="color:#6a1b9a">${C.complained}</div><div class="l">Complained</div></div>
        <div class="stat"><div class="v mute">${C.noResult}</div><div class="l">No result yet</div></div>
      </div>`;
    },

    reportStats() {
      const C = F.CAMPAIGN;
      return `<div class="stats" style="grid-template-columns:repeat(5,minmax(0,1fr))">
        <div class="stat"><div class="v">${C.sent.toLocaleString()}</div><div class="l">Sent</div></div>
        <div class="stat"><div class="v ok">${C.delivered.toLocaleString()}</div><div class="l">Delivered</div></div>
        <div class="stat"><div class="v" style="color:#0277bd">${C.uniqueOpens}</div><div class="l">Opens</div></div>
        <div class="stat"><div class="v" style="color:#6a1b9a">${C.uniqueClicks}</div><div class="l">Clicks</div></div>
        <div class="stat"><div class="v err">${C.bounced}</div><div class="l">Bounces</div></div>
      </div>`;
    },

    eventRows(events) {
      return events.map(function (e) {
        const bits = [];
        if (e.bounceType) bits.push(e.bounceType + (e.bounceSubType ? " · " + e.bounceSubType : ""));
        if (e.smtp) bits.push("SMTP " + e.smtp);
        if (e.diagnostic) bits.push(e.diagnostic);
        if (e.feedback) bits.push("Feedback: " + e.feedback);
        if (e.url) bits.push(e.url);
        const cls = e.type === "Bounce" ? (String(e.bounceType).indexOf("Permanent") >= 0 ? "permanent" : "temporary") : e.type.toLowerCase();
        const chipKind = ({ Send: "sent", Delivery: "delivered", Bounce: cls, Complaint: "complained", Open: "sent", Click: "sent" })[e.type] || "none";
        return `<tr>
          <td><span class="chip ${chipKind}">${e.type}</span></td>
          <td>${e.at}</td>
          <td class="mono">${bits.join("<br>") || "—"}</td>
        </tr>`;
      }).join("");
    },

    eventBlock(events) {
      return `<div class="evt"><table>
        <thead><tr><th>Event</th><th>SES event time</th><th>Diagnostics</th></tr></thead>
        <tbody>${this.eventRows(events)}</tbody>
      </table>
      <div class="hint" style="padding:4px 8px 8px">These are SES event times, not the send time.</div>
      </div>`;
    },

    filters(state) {
      return `<div class="tbar">
        <label class="grow">Search email
          <input class="srch" id="q" placeholder="Search email" value="${state.q || ""}" oninput="FC890App.onFilter()">
        </label>
        <label>Status
          <select class="sel" id="st" onchange="FC890App.onFilter()">
            <option value="all"${state.status==="all"?" selected":""}>All</option>
            <option value="delivered"${state.status==="delivered"?" selected":""}>Delivered</option>
            <option value="bounced"${state.status==="bounced"?" selected":""}>Bounced</option>
            <option value="complained"${state.status==="complained"?" selected":""}>Complained</option>
            <option value="none"${state.status==="none"?" selected":""}>No result yet</option>
          </select>
        </label>
        <label>Bounce type
          <select class="sel" id="bt" onchange="FC890App.onFilter()">
            <option value="all"${state.bounce==="all"?" selected":""}>All</option>
            <option value="permanent"${state.bounce==="permanent"?" selected":""}>Permanent</option>
            <option value="temporary"${state.bounce==="temporary"?" selected":""}>Temporary</option>
          </select>
        </label>
        <label>Domain
          <select class="sel" id="dm" onchange="FC890App.onFilter()">
            <option value="all"${state.domain==="all"?" selected":""}>All domains</option>
            <option value="example.com"${state.domain==="example.com"?" selected":""}>example.com</option>
            <option value="outlook.example"${state.domain==="outlook.example"?" selected":""}>outlook.example</option>
            <option value="hotmail.example"${state.domain==="hotmail.example"?" selected":""}>hotmail.example</option>
          </select>
        </label>
        <label>Per page
          <select class="sel" id="ps" onchange="FC890App.onFilter()">
            <option${String(state.pageSize)==="25"?" selected":""}>25</option>
            <option${String(state.pageSize)==="50"?" selected":""}>50</option>
          </select>
        </label>
      </div>`;
    },

    filtered(state) {
      let rows = F.ROWS.slice();
      const q = (state.q || "").trim().toLowerCase();
      if (q) rows = rows.filter(function (r) { return r.email.indexOf(q) !== -1; });
      if (state.status && state.status !== "all") rows = rows.filter(function (r) { return r.status === state.status; });
      if (state.bounce && state.bounce !== "all") rows = rows.filter(function (r) { return r.status === "bounced" && r.bounceType === state.bounce; });
      if (state.domain && state.domain !== "all") rows = rows.filter(function (r) { return r.domain === state.domain; });
      return rows;
    },

    pageSlice(rows, state) {
      const size = Number(state.pageSize) || 25;
      const pages = Math.max(1, Math.ceil(rows.length / size));
      const page = Math.min(Math.max(1, Number(state.page) || 1), pages);
      const start = (page - 1) * size;
      return { rows: rows.slice(start, start + size), total: rows.length, page, pages, size, start };
    },

    renderList(el, state) {
      const all = this.filtered(state);
      const pg = this.pageSlice(all, state);
      if (!all.length) {
        el.innerHTML = `<div class="emp">${state.status === "none" ? "No subscribers are still waiting for a delivery result." : "No subscribers match these filters."}</div>
          ${state.status === "none" ? `<p class="hint" style="text-align:center">“No result yet” means a send was recorded, but SES has not reported a delivery, bounce, or complaint. The webhook may still be catching up, or the message is delayed.</p>` : ""}`;
        return;
      }
      const self = this;
      const body = pg.rows.map(function (r, i) {
        const open = state.expand === r.email;
        const bounce = F.bounceLabel(r);
        return `<tr data-e="${r.email}">
          <td><button class="ex" type="button" aria-expanded="${open}" onclick="FC890App.toggle('${r.email}')">${open ? "▾" : "▸"}</button></td>
          <td><button class="link" type="button" onclick="FC890App.openHistory('${r.email}')">${r.email}</button></td>
          <td><span class="chip ${F.chipClass(r.status, r.bounceType)}">${F.statusLabel(r.status)}</span></td>
          <td>${bounce}${r.bounceSubType ? " · " + r.bounceSubType : ""}</td>
          <td>${r.lastEventAt}</td>
        </tr>${open ? `<tr class="exp"><td colspan="5">${self.eventBlock(r.events)}${r.status === "none" ? `<p class="hint">No delivery, bounce, or complaint yet for this address. The campaign still shows Sent. This is the “sent but not received” case to investigate.</p>` : ""}</td></tr>` : ""}`;
      }).join("");
      const cards = pg.rows.map(function (r) {
        const open = state.expand === r.email;
        return `<div class="card">
          <div class="em"><button class="link" type="button" onclick="FC890App.openHistory('${r.email}')">${r.email}</button></div>
          <div class="meta"><span class="chip ${F.chipClass(r.status, r.bounceType)}">${F.statusLabel(r.status)}</span> ${F.bounceLabel(r)} · ${r.lastEventAt}</div>
          <button class="btn ghost" type="button" onclick="FC890App.toggle('${r.email}')">${open ? "Hide events" : "Show events"}</button>
          ${open ? `<div class="more">${self.eventBlock(r.events)}</div>` : ""}
        </div>`;
      }).join("");
      const from = pg.start + 1;
      const to = pg.start + pg.rows.length;
      el.innerHTML = `<div class="list-wrap"><table class="list">
        <thead><tr><th style="width:44px"></th><th>Subscriber</th><th>Result</th><th>Bounce</th><th>Last SES event</th></tr></thead>
        <tbody>${body}</tbody>
      </table><div class="cards">${cards}</div></div>
      <div class="page">
        <div>Showing ${from.toLocaleString()}–${to.toLocaleString()} of ${pg.total.toLocaleString()} · page ${pg.page} of ${pg.pages}</div>
        <div class="btns">
          <button class="btn" type="button" ${pg.page<=1?"disabled":""} onclick="FC890App.setPage(${pg.page-1})">Previous</button>
          <button class="btn" type="button" ${pg.page>=pg.pages?"disabled":""} onclick="FC890App.setPage(${pg.page+1})">Next</button>
        </div>
      </div>`;
    },

    afterRender() {
      var t = document.querySelector(".tabs .tab.on");
      var bar = document.querySelector(".tabs");
      if (t && bar) {
        var left = t.offsetLeft - Math.max(0, (bar.clientWidth - t.offsetWidth) / 2);
        bar.scrollLeft = Math.max(0, left);
      }
    },

    historyBody(email) {
      const H = F.HISTORY;
      const isPat = !email || email === H.email;
      const row = F.ROWS.find(function (r) { return r.email === email; }) || F.FEATURED[0];
      const title = email || H.email;
      const soft = isPat ? H.softBounceCount : row.softBounceCount;
      const status = isPat ? H.contactStatus : row.contactStatus;
      const supp = isPat ? H.suppression : row.suppression;
      const delivery = isPat ? H.delivery : [{ campaign: F.CAMPAIGN.name, events: row.events }];
      const timelines = delivery.map(function (d) {
        return `<div style="padding:8px 12px 4px;font-weight:600;font-size:13px;border-bottom:1px solid #eef1f4">${d.campaign}</div>
          <div class="timeline">${d.events.map(function (e) {
            const bits = [];
            if (e.bounceType) bits.push(e.bounceType + (e.bounceSubType ? " · " + e.bounceSubType : ""));
            if (e.smtp) bits.push("SMTP " + e.smtp);
            if (e.diagnostic) bits.push(e.diagnostic);
            if (e.url) bits.push(e.url);
            const cls = e.type === "Bounce" ? (String(e.bounceType).indexOf("Permanent") >= 0 ? "permanent" : "temporary") : (e.type === "Delivery" ? "delivered" : e.type === "Complaint" ? "complained" : "sent");
            return `<div class="trow"><div class="when">${e.at}</div><div><span class="chip ${cls}">${e.type}</span></div><div>${bits.join(" · ") || "—"}</div></div>`;
          }).join("")}</div>`;
      }).join("");
      return `
        <div class="meta-row">
          <div class="meta-card"><div class="v">${isPat ? H.totalOpens : (row.events.filter(function(e){return e.type==="Open"}).length)}</div><div class="l">Total opens</div></div>
          <div class="meta-card"><div class="v">${isPat ? H.totalClicks : (row.events.filter(function(e){return e.type==="Click"}).length)}</div><div class="l">Total clicks</div></div>
          <div class="meta-card"><div class="v"><span class="chip ${status==="bounced"?"permanent":status==="unsubscribed"?"none":"ok"}">${status}</span></div><div class="l">Contact status</div></div>
          <div class="meta-card"><div class="v">${soft}</div><div class="l">softBounceCount</div></div>
          <div class="meta-card"><div class="v"><span class="chip ${supp==="unknown"?"unknown":supp==="not suppressed"?"ok":"permanent"}">${supp}</span></div><div class="l">Suppression</div></div>
        </div>
        <div class="tlh">Delivery timeline ${this.badge()}</div>
        <p class="hint">SES events for this subscriber across campaigns, in real event time. A Temporary bounce does not always change contact status; suppression is shown as unknown when it has not been confirmed.</p>
        ${timelines}
        <div class="tlh">Campaign-by-campaign engagement</div>
        <table class="list"><thead><tr><th>Campaign</th><th>Opens</th><th>Clicks</th><th>Last engagement</th></tr></thead><tbody>
          ${(isPat ? H.campaigns : [{ name: F.CAMPAIGN.name, opens: row.events.filter(function(e){return e.type==="Open"}).length, clicks: row.events.filter(function(e){return e.type==="Click"}).length, last: row.lastEventAt }]).map(function (c) {
            return `<tr><td>${c.name}</td><td>${c.opens}</td><td>${c.clicks}</td><td>${c.last}</td></tr>`;
          }).join("")}
        </tbody></table>`;
    }
  };
})();

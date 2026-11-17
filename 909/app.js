(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const HISTORY = [
    { at: "Nov 11, 2026, 02:00 AM", chip: "Auto · 7d", kind: "auto" },
    { at: "Nov 7, 2026, 02:00 AM", chip: "Auto · 3d", kind: "auto" },
    { at: "Nov 5, 2026, 02:00 AM", chip: "Auto · 1d", kind: "auto" },
    { at: "Nov 3, 2026, 03:13 PM", chip: "Initial", kind: "initial" }
  ];

  const CAMPAIGNS = [
    { id: "sample", name: "Sample Campaign: The Financial Side of Caregiving", subject: "The financial side of caregiving", status: "Draft", approval: "Sent", sent: "—", opens: "—", clicks: "—", created: "Nov 3, 2026" },
    { id: "nov", name: "November market notes", subject: "November market notes", status: "Draft", approval: "—", sent: "—", opens: "—", clicks: "—", created: "Nov 14, 2026" },
    { id: "oct", name: "October newsletter", subject: "October market notes", status: "Sent", approval: "Approved", sent: "241", opens: "98", clicks: "22", created: "Oct 8, 2026" }
  ];

  const COPY = {
    title: "Approval email",
    campaign: "Sample Campaign: The Financial Side of Caregiving",
    lastSent: "Last sent 6d ago",
    stats: "Opens 1 · Clicks 0",
    declinedBy: "Declined by Jane Admin (admin) · Nov 17, 2026, 9:30 AM",
    bannerTitle: "This approval request has been declined.",
    bannerBody: "All reminder emails have been stopped.",
    remindOn: "At 1, 3, 7, and 14 days if not approved.",
    remindOffDeclined: "Reminders stopped because this request was declined",
    adminHint: "Admins can decline on the advisor’s behalf. Declining stops all reminders.",
    errPerm: "You don’t have permission to change automatic reminders. The setting was not changed.",
    errSession: "Your support session has expired, so the setting was not changed.",
    savedOff: "Reminders turned off. This campaign will be skipped by the reminder job.",
    savedOn: "Reminders turned on.",
    confirmTitle: "Decline this approval request?",
    confirmBody: "The request will be marked declined, and automatic reminders will be turned off. No further reminder emails will be sent.",
    reasonLabel: "Reason (optional)",
    todaySnack: "Only admins or authorized impersonation sessions can change auto-reminder settings.",
    signinTitle: "Your support session has expired",
    signinBody: "Return to your account, then log in as Jane Advisor again to change automatic reminders or decline this request."
  };

  const STATES = [
    "pending", "saving", "saved", "err-perm", "err-session",
    "confirm", "declined", "undone", "advisor", "signin", "today", "today-err"
  ];

  function isToday(s) {
    return s === "today" || s === "today-err";
  }

  function showBar(s) {
    return s !== "advisor";
  }

  function isDeclined(s) {
    return s === "declined";
  }

  function remindersOn(s) {
    if (s === "declined" || s === "undone" || s === "saved") return false;
    return true;
  }

  function remindersDisabled(s) {
    return s === "declined" || s === "saving";
  }

  function canDecline(s) {
    if (isToday(s) || s === "advisor" || s === "declined" || s === "signin") return false;
    return true;
  }

  function shell(opts) {
    const bar = opts.bar
      ? `<div class="supportbar">You're logged in as Jane Advisor for support.
           <button class="ret" type="button">Return to my account</button>
         </div>`
      : "";
    const tabs = ["Campaigns", "Lists", "Default Lists", "Subscribers", "Forms", "Reports", "Settings"]
      .map(function (name) {
        const on = name === "Campaigns" ? " on" : "";
        return `<button type="button" class="etab${on}">${name}</button>`;
      }).join("");
    return `
      <div class="stagewrap"><div id="stage" class="${opts.dev || "desk"}">
        <div class="app-col">
          ${bar}
          <div class="app-body">
            <div class="app-row">
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
                  <div class="etabs">${tabs}</div>
                  ${opts.body || ""}
                </main>
              </div>
            </div>
            ${opts.overlay || ""}
          </div>
        </div>
      </div></div>`;
  }

  function campaignList() {
    const dir = window.FC909State && window.FC909State.dir;
    const cur = window.FC909State && window.FC909State.s;
    const openTo = dir === "today" ? "today" : (cur === "advisor" || dir === "advisor" ? "advisor" : "pending");
    const tr = CAMPAIGNS.map(function (c) {
      const on = c.id === "sample" ? " hi" : "";
      const open = c.id === "sample" ? ` onclick="sw('s','${openTo}')"` : "";
      return `<tr class="${on}">
        <td>${esc(c.name)}</td>
        <td>${esc(c.subject)}</td>
        <td><span class="chip ${c.status.toLowerCase()}">${esc(c.status)}</span></td>
        <td>—</td>
        <td>—</td>
        <td>${esc(c.approval)}</td>
        <td style="text-align:center">${esc(c.sent)}</td>
        <td style="text-align:center">${esc(c.opens)}</td>
        <td style="text-align:center">${esc(c.clicks)}</td>
        <td>${esc(c.created)}</td>
        <td class="acts">
          <button class="ico-btn" type="button" title="Manage approval email"${open}>✉</button>
          <button class="ico-btn danger" type="button" title="Delete">🗑</button>
        </td>
      </tr>`;
    }).join("");
    const cards = CAMPAIGNS.map(function (c) {
      const open = c.id === "sample" ? ` onclick="sw('s','${openTo}')"` : "";
      return `<div class="pcard">
        <div class="nm">${esc(c.name)}</div>
        <div class="meta">${esc(c.subject)}</div>
        <div class="meta"><span class="chip ${c.status.toLowerCase()}">${esc(c.status)}</span> · Created ${esc(c.created)}</div>
        <div class="acts">
          <button class="ico-btn" type="button" title="Manage approval email"${open}>✉</button>
        </div>
      </div>`;
    }).join("");
    return `<div class="toolbar">
        <button class="btn quiet" type="button">Refresh</button>
        <button class="btn pri" type="button">Create Campaign</button>
      </div>
      <div class="card list-wrap">
        <table class="list">
          <thead><tr>
            <th>Name</th><th>Subject</th><th>Status</th><th>Links</th><th>Compliance</th><th>Approval</th>
            <th style="text-align:center">Sent</th><th style="text-align:center">Opens</th><th style="text-align:center">Clicks</th>
            <th>Created</th><th style="text-align:right">Actions</th>
          </tr></thead>
          <tbody>${tr}</tbody>
        </table>
        <div class="cards">${cards}</div>
      </div>`;
  }

  function historyBlock() {
    return `<div class="ae-sec">Send history</div>
      <div class="hist">${HISTORY.map(function (h) {
        return `<div class="hist-row"><span>${esc(h.at)}</span><span class="chip ${h.kind}">${esc(h.chip)}</span></div>`;
      }).join("")}</div>`;
  }

  function customize(expanded) {
    const body = expanded
      ? `<div class="acc-b">
           <div class="field">
             <label>Recipients</label>
             <input type="text" value="jane@example.com, assistant@example.com">
             <div class="hint">Comma-separated email addresses</div>
           </div>
           <div class="alert info">Recipients can be changed here. Approval message editing is available for Mailchimp campaigns only, for now.</div>
         </div>`
      : "";
    return `<div class="acc-row">
      <button class="acc-h" type="button" onclick="sw('custom', window.FC909State.custom === 'on' ? 'off' : 'on')">
        Customize before send <span class="chev">${expanded ? "▴" : "▾"}</span>
      </button>
      ${body}
    </div>`;
  }

  function remindersCard(s) {
    const on = remindersOn(s);
    const dis = remindersDisabled(s);
    const busy = s === "saving";
    const sub = isDeclined(s) ? COPY.remindOffDeclined : COPY.remindOn;
    let extra = "";
    if (s === "saving") {
      extra = `<div class="hint" style="margin:8px 0 0">Saving…</div>`;
    } else if (s === "saved") {
      extra = `<div class="remind-ok">${esc(COPY.savedOff)}</div>`;
    } else if (s === "err-perm") {
      extra = `<div class="remind-err">${esc(COPY.errPerm)}
        <div class="alert-acts">
          <button class="btn quiet" type="button" onclick="goSave()">Retry</button>
        </div>
      </div>`;
    } else if (s === "err-session") {
      extra = `<div class="remind-err">${esc(COPY.errSession)}
        <div class="alert-acts">
          <button class="btn quiet" type="button" onclick="goSave()">Retry</button>
          <button class="btn link" type="button" onclick="sw('s','signin')">Sign in again</button>
        </div>
      </div>`;
    } else if (s === "today-err") {
      extra = "";
    } else if (s === "undone") {
      extra = `<div class="hint" style="margin:8px 0 0">Reminders are off. Turn them back on if this request should be reminded again.</div>`;
    }
    const next = isToday(s) ? "today-err" : (on ? "saving" : "pending");
    const click = dis ? "" : ` onclick="sw('s','${next}')"`;
    const spin = busy ? `<span class="spin" aria-hidden="true"></span>` : "";
    return `<div class="remind">
      <div style="flex:1;min-width:0">
        <div class="t">Automatic reminders</div>
        <div class="d">${esc(sub)}</div>
        ${extra}
      </div>
      <div class="sw-wrap">
        ${spin}
        <button type="button" class="switch${on ? " on" : ""}${busy ? " busy" : ""}" role="switch"
          aria-checked="${on ? "true" : "false"}" aria-label="Automatic reminder emails"
          ${dis ? "disabled" : ""}${click}></button>
      </div>
    </div>`;
  }

  function footer(s) {
    if (isDeclined(s)) {
      return `<div class="df">
        <button class="btn link" type="button" onclick="sw('overlay','off')">Close</button>
        <button class="btn link" type="button" onclick="sw('s','undone')">Undo decline</button>
      </div>`;
    }
    const decline = canDecline(s)
      ? `<button class="btn danger left" type="button" onclick="sw('s','confirm')">Decline request</button>`
      : "";
    return `<div class="df">
      ${decline}
      <button class="btn link" type="button" onclick="sw('overlay','off')">Close</button>
      <button class="btn pri" type="button"><span class="send-ico" aria-hidden="true"></span> Resend now</button>
    </div>`;
  }

  function approvalModal(s, customOn) {
    const declined = isDeclined(s);
    const banner = declined
      ? `<div class="ae-declined"><span class="ic" aria-hidden="true">✓</span>
           <div><b>${esc(COPY.bannerTitle)}</b>${esc(COPY.bannerBody)}</div>
         </div>`
      : "";
    const chip = declined
      ? `<span class="chip declined">Declined</span>`
      : `<span class="chip pending">Pending approval</span>`;
    const who = declined ? `<div class="ae-who">${esc(COPY.declinedBy)}</div>` : "";
    const confirm = s === "confirm"
      ? `<div class="confirm-in" role="group" aria-label="Confirm decline">
           <div class="ct">${esc(COPY.confirmTitle)}</div>
           <p>${esc(COPY.confirmBody)}</p>
           <div class="field">
             <label for="decline-reason">${esc(COPY.reasonLabel)}</label>
             <textarea id="decline-reason" rows="2" placeholder="Add a note for the audit log"></textarea>
           </div>
           <div class="cf">
             <button class="btn link" type="button" onclick="sw('s','pending')">Cancel</button>
             <button class="btn danger" type="button" onclick="sw('s','declined')">Decline request</button>
           </div>
         </div>`
      : "";
    const hint = (canDecline(s) && s !== "confirm")
      ? `<p class="admin-hint">${esc(COPY.adminHint)}</p>`
      : "";

    return `<div class="scrim"><div class="dlg sm ae" role="dialog" aria-labelledby="ae-title">
      <div class="dh" id="ae-title">${esc(COPY.title)}</div>
      <div class="db">
        ${banner}
        <p class="ae-sub">${esc(COPY.campaign)}</p>
        <div class="ae-status">${chip}<span class="ae-meta">${esc(COPY.lastSent)}</span></div>
        ${who}
        <div class="ae-meta">${esc(COPY.stats)}</div>
        <div class="ae-sec">Next send to</div>
        <div class="ae-chips">
          <span class="chip email">jane@example.com</span>
          <span class="chip email">assistant@example.com</span>
        </div>
        ${customize(customOn)}
        ${historyBlock()}
        ${remindersCard(s)}
        ${hint}
        ${confirm}
      </div>
      ${s === "confirm" ? `<div class="df"><button class="btn link" type="button" onclick="sw('s','pending')">Close</button></div>` : footer(s)}
    </div></div>`;
  }

  function signinOverlay() {
    return `<div class="scrim"><div class="signin-card" role="dialog" aria-labelledby="si-title">
      <h2 id="si-title">${esc(COPY.signinTitle)}</h2>
      <p>${esc(COPY.signinBody)}</p>
      <div class="cf" style="display:flex;justify-content:flex-end;gap:8px">
        <button class="btn link" type="button" onclick="sw('s','err-session')">Back</button>
        <button class="btn pri" type="button">Return to my account</button>
      </div>
    </div></div>`;
  }

  function normalize(S) {
    if (STATES.indexOf(S.s) < 0) S.s = S.dir === "today" ? "today" : "pending";
    if (S.dev !== "phone") S.dev = "desk";
    if (S.overlay !== "off") S.overlay = "on";
    if (S.custom !== "on") S.custom = "off";
  }

  function render() {
    const S = window.FC909State;
    normalize(S);
    writeQ();
    const s = S.s;
    let overlay = "";
    if (S.overlay === "on") {
      if (s === "signin") overlay = signinOverlay();
      else overlay = approvalModal(s, S.custom === "on");
    }
    if (s === "today-err") {
      overlay += `<div class="snack" role="status">${esc(COPY.todaySnack)}</div>`;
    }
    document.getElementById("root").innerHTML = shell({
      dev: S.dev,
      bar: showBar(s) || (S.overlay === "off" && S.dir !== "advisor"),
      body: campaignList(),
      overlay: overlay
    });
    document.querySelectorAll("[data-sw]").forEach(function (b) {
      const p = b.getAttribute("data-sw").split(":");
      b.classList.toggle("on", String(S[p[0]]) === p[1]);
    });
    const confirmEl = document.querySelector(".confirm-in");
    if (confirmEl) {
      confirmEl.scrollIntoView({ block: "end", behavior: "instant" });
    } else {
      const errEl = document.querySelector(".remind-err, .remind-ok");
      if (errEl) errEl.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }

  function readQ(S) {
    const q = new URLSearchParams(location.search);
    if (q.get("phone") === "1") S.dev = "phone";
    const s = q.get("s");
    if (s) S.s = s;
    if (q.get("overlay") === "off") S.overlay = "off";
    if (q.get("custom") === "1") S.custom = "on";
  }

  function writeQ() {
    const S = window.FC909State;
    const u = new URL(location.href);
    u.searchParams.delete("phone");
    u.searchParams.delete("overlay");
    u.searchParams.delete("custom");
    u.searchParams.set("s", S.s);
    if (S.dev === "phone") u.searchParams.set("phone", "1");
    if (S.overlay === "off") u.searchParams.set("overlay", "off");
    if (S.custom === "on") u.searchParams.set("custom", "1");
    history.replaceState(null, "", u);
  }

  function goSave() {
    const S = window.FC909State;
    S._fromClick = true;
    sw("s", "saving");
  }

  function sw(k, v) {
    const S = window.FC909State;
    if (k === "custom") {
      S.custom = v;
    } else if (k === "s") {
      S.s = v;
      S.overlay = "on";
      if (v === "saving" && S._fromClick) {
        S._fromClick = false;
        window.setTimeout(function () {
          if (window.FC909State.s === "saving") sw("s", "saved");
        }, 700);
      }
      S._fromClick = false;
    } else if (k === "overlay") {
      S.overlay = v;
    } else {
      S[k] = v;
    }
    render();
  }

  function boot(opts) {
    const S = { dir: opts.dir || "mock", dev: "desk", s: opts.s || "pending", overlay: "on", custom: "off" };
    window.FC909State = S;
    window.sw = sw;
    window.goSave = goSave;
    readQ(S);
    render();
  }

  window.FC909App = { boot: boot, render: render, sw: sw };
})();

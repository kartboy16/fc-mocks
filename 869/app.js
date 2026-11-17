(function () {
  const D = () => window.FC869;
  const C = () => D().copy;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function campFor(s) {
    if (s === "list-keep" || s === "create-keep") return D().scheduled;
    return D().draft;
  }

  function isSched(s) {
    return s === "create-sched" || s === "list-sched";
  }
  function isKeep(s) {
    return s === "list-keep" || s === "create-keep";
  }
  function isList(s) {
    return s.indexOf("list-") === 0;
  }
  function isCreate(s) {
    return s.indexOf("create-") === 0;
  }
  function tabFor(s) {
    return s === "settings" ? "settings" : "campaigns";
  }

  function blockCopy(s) {
    const c = C();
    if (isKeep(s)) return { intro: c.introKeep, point: c.point, state: c.stateKeep };
    if (isSched(s)) return { intro: c.introSched, point: c.pointSched, state: c.stateDraftSched };
    return { intro: c.introSend, point: c.point, state: c.stateDraftSend };
  }

  function shell(opts) {
    const tab = opts.tab || "campaigns";
    const tabs = ["Campaigns", "Lists", "Default Lists", "Subscribers", "Forms", "Reports", "Settings"]
      .map(function (name) {
        const key = name === "Default Lists" ? "default" : name.toLowerCase();
        const on = (tab === "settings" && name === "Settings") || (tab === "campaigns" && name === "Campaigns");
        const click = name === "Settings" ? "onclick=\"sw('s','settings')\"" : (name === "Campaigns" ? "onclick=\"sw('s','list-send')\"" : "");
        return `<button type="button" class="etab${on ? " on" : ""}" ${click}>${name}</button>`;
      }).join("");
    const title = tab === "settings" ? "Email Campaigns" : "Email Campaigns";
    return `
      <div class="stagewrap"><div id="stage" class="${opts.dev || "desk"}">
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
              <h1 class="page">${title}</h1>
              <div class="etabs">${tabs}</div>
              ${opts.body || ""}
            </main>
          </div>
        </div>
        ${opts.overlay || ""}
      </div></div>`;
  }

  function statusChip(st) {
    const k = st.toLowerCase();
    return `<span class="chip ${k}">${esc(st)}</span>`;
  }

  function actions(camp, opts) {
    opts = opts || {};
    const disabled = !!opts.disabled;
    const dis = disabled ? " disabled" : "";
    const tip = disabled ? ` title="${esc(C().disabledReason)}"` : "";
    if (camp.status === "Sent") {
      return `<div class="acts"><button class="ico-btn" type="button" title="View">👁</button><button class="ico-btn" type="button" title="Duplicate">⧉</button></div>`;
    }
    const send = `<button class="ico-btn" type="button"${dis}${tip} title="Send" onclick="sw('s','${camp.status === "Scheduled" ? "list-keep" : "list-send"}')">${disabled ? "✈" : "✈"}</button>`;
    const cancel = camp.status === "Scheduled"
      ? `<button class="ico-btn warn" type="button" title="Cancel schedule">⏰</button>` : "";
    return `<div class="acts">
      <button class="ico-btn" type="button" title="Edit" onclick="sw('s','create-send')">✎</button>
      <button class="ico-btn" type="button" title="Send test email">⚗</button>
      ${send}
      ${cancel}
    </div>`;
  }

  function campaignList(opts) {
    opts = opts || {};
    const rows = [D().draft, D().scheduled, D().sent];
    const hi = opts.hi;
    const disabled = !!opts.disabled;
    const errBan = opts.error
      ? `<div class="alert error"><b>Something went wrong</b>${esc(opts.error)}</div>` : "";
    const banner = opts.banner
      ? `<div class="alert warn"><b>Your domain isn’t verified</b>${esc(opts.banner)}
          <div class="alert-acts">
            <button class="btn pri" type="button" onclick="sw('s','settings')">${esc(C().primary)}</button>
            <button class="btn quiet" type="button" onclick="sw('s','mail')">${esc(C().secondary)}</button>
          </div>
        </div>` : "";
    const menu = opts.menu
      ? `<div class="menu" role="menu" style="top:210px">
           <button type="button" onclick="sw('s','list-send')">Send immediately</button>
           <button type="button" onclick="sw('s','list-sched')">Send later</button>
         </div>` : "";
    const tr = rows.map(function (c) {
      const on = hi && c.id === hi;
      const sched = c.status === "Scheduled" ? `<div class="hint" style="margin:4px 0 0">${esc(c.scheduledAt)}</div>` : "";
      return `<tr class="${on ? "hi" : ""}">
        <td>${esc(c.name)}</td>
        <td>${esc(c.subject)}</td>
        <td>${statusChip(c.status)}${sched}</td>
        <td>—</td>
        <td>—</td>
        <td>—</td>
        <td style="text-align:center">${c.sent}</td>
        <td style="text-align:center">${c.opens}</td>
        <td style="text-align:center">${c.clicks}</td>
        <td>${esc(c.created)}</td>
        <td>${actions(c, { disabled: disabled })}</td>
      </tr>`;
    }).join("");
    const cards = rows.map(function (c) {
      const sched = c.status === "Scheduled" ? `<div class="meta">${esc(c.scheduledAt)}</div>` : "";
      return `<div class="pcard">
        <div class="nm">${esc(c.name)}</div>
        <div class="meta">${esc(c.subject)}</div>
        <div class="meta">${statusChip(c.status)} · Created ${esc(c.created)}</div>
        ${sched}
        ${actions(c, { disabled: disabled })}
      </div>`;
    }).join("");
    return `<div class="toolbar"><button class="btn pri" type="button" onclick="sw('s','create-send')">Create Campaign</button></div>${errBan}${banner}
      <div class="card list-wrap" style="position:relative">
        <table class="list">
          <thead><tr>
            <th>Name</th><th>Subject</th><th>Status</th><th>Links</th><th>Compliance</th><th>Approval</th>
            <th style="text-align:center">Sent</th><th style="text-align:center">Opens</th><th style="text-align:center">Clicks</th>
            <th>Created</th><th style="text-align:right">Actions</th>
          </tr></thead>
          <tbody>${tr}</tbody>
        </table>
        <div class="cards">${cards}</div>
        ${menu}
      </div>`;
  }

  function fromBanner(kind) {
    if (!kind) return "";
    const c = C();
    const text = kind === "block" ? c.bannerBlock : c.bannerHint;
    const acts = `<div class="alert-acts">
      <button class="btn pri" type="button" onclick="sw('s','settings')">${esc(c.primary)}</button>
      <button class="btn quiet" type="button" onclick="sw('s','mail')">${esc(c.secondary)}</button>
    </div>`;
    return `<div class="alert warn"><b>Your domain isn’t verified</b>${esc(text)}${acts}</div>`;
  }

  function createCampaign(opts) {
    opts = opts || {};
    const camp = opts.camp || D().draft;
    const sched = opts.sched;
    const disabled = !!opts.disabled;
    const err = opts.error;
    const title = "Edit Campaign";
    const when = `
      <div class="when">
        <div style="font-weight:600;margin-bottom:8px">When to send:</div>
        <div class="radios">
          <label><input type="radio" name="when" ${sched ? "" : "checked"} onclick="sw('s','create-send')"> Send immediately</label>
          <label><input type="radio" name="when" ${sched ? "checked" : ""} onclick="sw('s','create-sched')"> Schedule for later</label>
        </div>
        ${sched ? `<div class="field" style="margin:12px 0 0;max-width:320px"><label>Schedule Date &amp; Time</label>
          <input type="datetime-local" value="${esc(D().schedulePickValue)}"></div>` : ""}
        ${disabled ? `<p class="reason">${esc(C().disabledReason)}</p>` : ""}
      </div>`;
    const primary = sched
      ? `<button class="btn pri" type="button"${disabled ? " disabled" : ""} onclick="${disabled ? "" : "sw('s','create-sched')"}">Schedule Campaign</button>`
      : `<button class="btn pri" type="button"${disabled ? " disabled" : ""} onclick="${disabled ? "" : "sw('s','create-send')"}">Send Now</button>`;
    return `<div class="scrim"><div class="dlg" role="dialog" aria-label="${title}">
      <div class="dh"><div>${title}<div class="sub">${esc(camp.name)} · ${statusChip(camp.status)}${camp.scheduledAt ? " · " + esc(camp.scheduledAt) : ""}</div></div></div>
      <div class="db">
        ${err ? `<div class="alert error"><b>Something went wrong</b>${esc(err)}</div>` : ""}
        ${fromBanner(opts.banner)}
        <div class="field"><label>Campaign Name</label><input value="${esc(camp.name)}"></div>
        <div class="field"><label>Subject</label><input value="${esc(camp.subject)}"></div>
        <div class="row2">
          <div class="field"><label>From Name</label><input value="${esc(D().fromName)}"></div>
          <div class="field"><label>From Email</label><input value="${esc(D().fromEmail)}"></div>
        </div>
        <div class="field"><label>Send to List</label>
          <select><option selected>${esc(D().listName)} (${D().listCount} contacts)</option></select>
        </div>
        <p class="hint">Choose a list or one or more tags to send to.</p>
        <div class="editor">
          <div class="eh">Email Content · Header preview</div>
          <div class="eb">
            <p style="margin:0 0 8px"><b>November market notes</b></p>
            <p style="margin:0">A short look at what’s been moving markets this month, and three talking points for your next client meeting.</p>
          </div>
        </div>
      </div>
      <div class="df colfoot">
        ${when}
        <div class="df-row">
          <div class="left">
            <button class="btn quiet" type="button">Cancel</button>
            <button class="btn" type="button">Save Draft</button>
            <button class="btn" type="button">Send Test</button>
          </div>
          ${primary}
        </div>
      </div>
    </div></div>`;
  }

  function settingsPane() {
    const c = C();
    return `<div class="settings">
      <h2>Email Settings</h2>
      <p class="hint">Configure your email sending settings.</p>
      <div class="acc hl" id="custom-domain">
        <h3>Email Campaign From Settings</h3>
        <div class="ab">
          <p class="hint">Configure the sender name and email for campaigns.</p>
          <div class="toggles">
            <button type="button">Use default sender (recommended)</button>
            <button type="button" class="on">Use my own domain</button>
          </div>
          <div class="row2">
            <div class="field"><label>From Name</label><input value="${esc(D().fromName)}"></div>
            <div class="field"><label>From Email</label><input value="${esc(D().fromEmail)}"></div>
          </div>
          <div class="alert warn"><b>yourfirm.com is not verified</b>${esc(c.settingsLead)}</div>
          <div style="font-weight:600;margin:8px 0 4px">Custom domain</div>
          <p class="hint">Custom domain sending requires DNS setup and verification.</p>
          <div class="dom-enter">
            <div class="field"><label>Domain Name</label><input value="yourfirm.com"></div>
            <button class="btn pri" type="button">Verify Domain</button>
          </div>
          <div style="font-weight:600;margin:4px 0">Verified Domains</div>
          <div class="dom-row">
            <span class="dom-chip">⚠ yourfirm.com</span>
            <button class="btn" type="button">Check Status</button>
          </div>
          <div class="dns">
            <h4>DNS Records to Add</h4>
            <p class="hint">Add these DNS records at your domain registrar, then click Check Status.</p>
            <p><b>TXT</b> · Host: <code>_amazonses.yourfirm.com</code><br>Value: <code>verification-token-example</code></p>
            <p style="margin-bottom:0"><b>CNAME</b> · Host: <code>hash1._domainkey.yourfirm.com</code><br>Value: <code>hash1.dkim.example.net</code></p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function blockModal(s) {
    const c = C();
    const t = blockCopy(s);
    return `<div class="scrim" style="z-index:20;background:rgba(0,0,0,.45)"><div class="dlg sm" role="dialog" aria-labelledby="block-title">
      <div class="dh"><div id="block-title">${esc(c.title)}</div></div>
      <div class="db">
        <p style="margin:0 0 10px">${esc(t.intro)}</p>
        <p style="margin:0 0 10px">${esc(t.point)}</p>
        <p style="margin:0;font-weight:500">${esc(t.state)}</p>
      </div>
      <div class="df">
        <button class="btn quiet left" type="button" onclick="sw('overlay','off')">${esc(c.close)}</button>
        <button class="btn" type="button" onclick="sw('s','mail')">${esc(c.secondary)}</button>
        <button class="btn pri" type="button" onclick="sw('s','settings')">${esc(c.primary)}</button>
      </div>
    </div></div>`;
  }

  function todayConfirm(s) {
    const next = s.indexOf("sched") >= 0 ? s + "-err" : (s.indexOf("-err") >= 0 ? s : s + "-err");
    // map create-send -> create-send-err, etc. already handled by caller
    return `<div class="scrim" style="z-index:20;background:rgba(0,0,0,.45)"><div class="confirm" role="dialog" aria-label="Confirm">
      <p>${esc(C().todayConfirm)}</p>
      <div class="cf">
        <button class="btn quiet" type="button" onclick="sw('overlay','off')">Cancel</button>
        <button class="btn pri" type="button" onclick="sw('s','${esc(next)}')">OK</button>
      </div>
    </div></div>`;
  }

  function mailCompose(from) {
    const d = D();
    return `<div class="scrim" style="z-index:22;background:rgba(0,0,0,.45)"><div class="dlg mail" role="dialog" aria-label="New message">
      <div class="dh"><div>New message<div class="sub">Help setting up your domain</div></div></div>
      <div class="db">
        <div class="mailhead">
          <div><span>To</span><b>${esc(d.support)}</b></div>
          <div><span>Subject</span><b>${esc(d.mailSubject)}</b></div>
        </div>
        <div class="mailbody">${esc(d.mailBody)}</div>
      </div>
      <div class="df">
        <button class="btn quiet left" type="button" onclick="sw('s','${esc(from || "create-send")}')">${esc(C().close)}</button>
        <a class="btn pri" href="${esc(d.mailto)}">Open in your email app</a>
      </div>
    </div></div>`;
  }

  function checklist(s) {
    const c = C();
    const t = blockCopy(s);
    const camp = campFor(s);
    const action = isSched(s) ? "Schedule" : (isKeep(s) ? "Send now" : "Send now");
    return `<div class="scrim" style="z-index:20"><div class="dlg sm" role="dialog" aria-labelledby="pf-title" style="max-width:520px">
      <div class="dh"><div id="pf-title">Ready to ${isSched(s) ? "schedule" : "send"}?<div class="sub">${esc(camp.name)}</div></div></div>
      <div class="db">
        <ul class="check">
          <li><span class="mark ok">✓</span><div><div class="t">Campaign name and subject</div><div class="d">${esc(camp.name)} · ${esc(camp.subject)}</div></div></li>
          <li><span class="mark ok">✓</span><div><div class="t">Audience</div><div class="d">${esc(D().listName)} · ${D().listCount} contacts</div></div></li>
          <li><span class="mark ok">✓</span><div><div class="t">From name</div><div class="d">${esc(D().fromName)}</div></div></li>
          <li><span class="mark no">!</span><div><div class="t">Sending domain</div><div class="d">${esc(t.intro)} ${esc(t.point)}</div></div></li>
        </ul>
        <p style="margin:12px 0 0;font-weight:500">${esc(t.state)}</p>
      </div>
      <div class="df">
        <button class="btn quiet left" type="button" onclick="sw('overlay','off')">${esc(c.close)}</button>
        <button class="btn" type="button" onclick="sw('s','mail')">${esc(c.secondary)}</button>
        <button class="btn pri" type="button" onclick="sw('s','settings')">${esc(c.primary)}</button>
      </div>
    </div></div>`;
  }

  function scheduleDialog(s) {
    // Shown behind or instead? For list-sched we show the block after confirm.
    // Optional: a date dialog only if overlay is off. Not used when block is up.
    return `<div class="scrim" style="z-index:18"><div class="dlg sm" role="dialog" aria-label="Schedule campaign">
      <div class="dh"><div>Schedule campaign<div class="sub">${esc(D().draft.name)}</div></div></div>
      <div class="db">
        <div class="field"><label>Date and time</label>
          <input type="datetime-local" value="${esc(D().schedulePickValue)}"></div>
      </div>
      <div class="df">
        <button class="btn quiet" type="button" onclick="sw('overlay','off')">Cancel</button>
        <button class="btn pri" type="button" onclick="sw('overlay','on')">Schedule</button>
      </div>
    </div></div>`;
  }

  function normalize(S) {
    const known = [
      "create-send", "create-send-err", "create-sched", "create-sched-err",
      "list-send", "list-send-err", "list-sched", "list-sched-err",
      "list-keep", "settings", "mail"
    ];
    if (known.indexOf(S.s) < 0) S.s = "create-send";
    if (S.dev !== "phone") S.dev = "desk";
    if (S.overlay !== "off") S.overlay = "on";
  }

  function baseScene(s) {
    return s.replace(/-err$/, "");
  }

  function render() {
    const S = window.FC869State;
    normalize(S);
    writeQ();
    const dir = S.dir;
    const s = S.s;
    const scene = baseScene(s);
    const errored = /-err$/.test(s);
    const overlayOn = S.overlay === "on";

    let tab = tabFor(scene);
    let body = "";
    let overlay = "";

    const listOpts = {
      disabled: dir === "b",
      banner: dir === "b" ? C().listBanner : (dir === "c" && isList(scene) ? C().bannerHint : ""),
      hi: isKeep(scene) ? "year" : "nov",
      menu: dir === "today" && scene === "list-send" && overlayOn && !errored,
      error: (dir === "today" && errored && isList(scene)) ? C().todayError : ""
    };

    if (scene === "settings") {
      body = settingsPane();
    } else if (isList(scene) || scene === "mail" && S.returnTo && isList(S.returnTo)) {
      body = campaignList(listOpts);
    } else {
      body = campaignList({ disabled: dir === "b", banner: dir === "b" ? C().listBanner : "" });
    }

    // Create campaign overlay (under the block)
    if (isCreate(scene) || (scene === "mail" && (!S.returnTo || isCreate(S.returnTo)))) {
      const ret = scene === "mail" ? (S.returnTo || "create-send") : scene;
      overlay += createCampaign({
        camp: isKeep(ret) ? D().scheduled : D().draft,
        sched: isSched(ret) || ret === "create-sched",
        banner: dir === "a" ? "hint" : (dir === "b" ? "block" : (dir === "c" ? "hint" : null)),
        disabled: dir === "b",
        error: (dir === "today" && errored) ? C().todayError : ""
      });
    }

    // List schedule date dialog (only today or if overlay off? For A/B/C list-sched we go straight to block after they picked a date.)
    // Show send menu on list-send? Better to show the block directly as the result of the action.

    // Top overlay: today confirm / error already in editor / A modal / B none extra if disabled / C checklist / mail
    if (scene === "mail") {
      overlay += mailCompose(S.returnTo || "create-send");
    } else if (dir === "today" && overlayOn && !errored) {
      const nxt = scene + "-err";
      overlay += `<div class="scrim" style="z-index:20;background:rgba(0,0,0,.45)"><div class="confirm" role="dialog" aria-label="Confirm">
        <p>${esc(C().todayConfirm)}</p>
        <div class="cf">
          <button class="btn quiet" type="button" onclick="sw('overlay','off')">Cancel</button>
          <button class="btn pri" type="button" onclick="sw('s','${nxt}')">OK</button>
        </div>
      </div></div>`;
    } else if (dir === "a" && overlayOn && scene !== "settings") {
      overlay += blockModal(scene);
    } else if (dir === "c" && overlayOn && scene !== "settings") {
      overlay += checklist(scene);
    } else if (dir === "b" && isList(scene) && overlayOn && scene !== "settings") {
      // B disables actions; still show a reason popover? Skip — the list banner covers it.
    }

    document.getElementById("root").innerHTML = shell({ dev: S.dev, tab: tab, body: body, overlay: overlay });
    document.querySelectorAll("[data-sw]").forEach(function (b) {
      const p = b.getAttribute("data-sw").split(":");
      b.classList.toggle("on", String(S[p[0]]) === p[1]);
    });
  }

  function readQ(S) {
    const q = new URLSearchParams(location.search);
    if (q.get("phone") === "1") S.dev = "phone";
    const s = q.get("s");
    if (s) S.s = s;
    if (q.get("overlay") === "off") S.overlay = "off";
  }

  function writeQ() {
    const S = window.FC869State;
    const u = new URL(location.href);
    u.searchParams.delete("phone");
    u.searchParams.delete("overlay");
    u.searchParams.set("s", S.s);
    if (S.dev === "phone") u.searchParams.set("phone", "1");
    if (S.overlay === "off") u.searchParams.set("overlay", "off");
    history.replaceState(null, "", u);
  }

  function sw(k, v) {
    const S = window.FC869State;
    if (k === "s" && v === "mail") {
      S.returnTo = baseScene(S.s);
      S.s = "mail";
      S.overlay = "on";
    } else if (k === "s") {
      if (S.s === "mail" && v === S.returnTo) {
        // coming back
      }
      if (v !== "mail") S.returnTo = null;
      S.s = v;
      S.overlay = "on";
    } else if (k === "overlay") {
      S.overlay = v;
    } else {
      S[k] = v;
    }
    render();
  }

  function boot(opts) {
    const S = { dir: opts.dir, dev: "desk", s: opts.s || "create-send", overlay: "on", returnTo: null };
    window.FC869State = S;
    window.sw = sw;
    readQ(S);
    render();
  }

  window.FC869App = { boot: boot, render: render, sw: sw };
})();

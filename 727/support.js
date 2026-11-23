(function () {
  var SITE = "example-advisor.ca";
  var MAIL = "mailto:jane.advisor@example.com?subject=" + encodeURIComponent("Your website setup") + "&body=" + encodeURIComponent("Hi Jane,\n\nAn update on connecting example-advisor.ca.\n\nSam Support");
  var SC = [["queue", "Queue"], ["req", "Requested (not hosted)"], ["progress", "In progress (stuck partway)"], ["failed", "Failed"], ["done", "Connected"], ["noaccess", "No access"], ["nav", "Support nav"], ["new", "Open request"], ["new-search", "Search advisor"], ["new-picked", "Advisor picked"], ["new-dup", "Duplicate blocked"], ["new-done", "Request opened"],
    ["adv-requested", "Advisor: requested"], ["adv-progress", "Advisor: in progress"], ["adv-failed", "Advisor: failed"]];
  var S = { s: "queue", dev: "desk", v: "" };
  var $ = function (i) { return document.getElementById(i); };
  var spin = '<span class="spin"></span>';

  var ROWS = [
    ["Jane Advisor", "jane.advisor@example.com", "example-advisor.ca", "Not hosted by us", "r", "Requested", "n", "Nov 22, 4:10 PM PT", "req"],
    ["Sam Advisor", "sam.advisor@example.com", "example.ca", "Stuck partway", "p", "In progress", "b", "Nov 22, 1:32 PM PT", "progress"],
    ["Lee Advisor", "lee.advisor@example.com", "example.org", "Stuck partway", "p", "Failed", "r", "Nov 21, 9:05 AM PT", "failed"]
  ];
  var SRC = ["Advisor asked for help", "Opened by Sam Support", "Advisor asked for help"];
  var ROW_RC = ["Kim Advisor", "kim.advisor@example.com", "example-kim.ca", "Reconnect failed", "p", "Requested", "n", "Nov 23, 11:48 AM PT", "req", "Reconnect failed"];
  var ROW_NEW = ["Taylor Advisor", "taylor.advisor@example.com", "example-taylor.ca", "Not hosted by us", "r", "Requested", "n", "Nov 23, 12:40 PM PT", "req", "Opened by Sam Support"];
  function item(state, t, cap) {
    var ic = state === "done" ? "✓" : state === "fail" ? "!" : state === "cur" ? spin : "•";
    return '<li class="' + state + '"><span class="ic">' + ic + '</span>' + t + '<span class="cap">' + (cap || "") + '</span></li>';
  }
  function steps(list) { return '<ul class="plist">' + list.map(function (x) { return item(x[0], x[1], x[2]); }).join("") + '</ul>'; }
  var LOG = {
    req: [["Nov 22, 4:10 PM PT", "Jane Advisor asked our team for help (website isn’t hosted by us)"]],
    progress: [["Nov 22, 1:32 PM PT", "Sam Support started manual setup"], ["Nov 22, 1:40 PM PT", "Login checked"], ["Nov 22, 1:44 PM PT", "Backup saved"]],
    failed: [["Nov 21, 9:05 AM PT", "Pat Admin ran the test post: failed"], ["Nov 21, 8:58 AM PT", "Pat Admin saved the login"], ["Nov 21, 8:40 AM PT", "Lee Advisor asked our team for help"]],
    done: [["Nov 22, 5:02 PM PT", "Sam Support: test post passed. Website connected"], ["Nov 22, 4:58 PM PT", "Sam Support saved the login"], ["Nov 22, 4:10 PM PT", "Jane Advisor asked our team for help"]]
  };
  function logBlock(k) {
    return '<div class="card pad" style="margin-top:16px"><h2 style="font-size:15px">Activity</h2><ul class="log">' + LOG[k].map(function (l) { return '<li>' + l[1] + '<br><small>' + l[0] + '</small></li>'; }).join("") + '</ul></div>';
  }

  function who(n, role) { return '<div class="who">Signed in as <b>' + n + '</b><span class="role">' + role + '</span><span>Visible to support and admin only</span></div>'; }

  function rowHtml(r, src) {
    return '<div class="reqrow"><div><b>' + r[0] + '</b><small>' + r[1] + '</small></div><div class="c2">' + r[2] + '</div><div class="c3">' + r[3] + '<small>Source: ' + src + '</small></div><div><span class="badge ' + r[6] + '">' + r[5] + '</span></div><div class="c5"><small style="font-size:12.5px">' + r[7] + '</small></div><div><button class="btn" style="min-height:34px" type="button" onclick="SP.go(\'' + r[8] + '\')">Open</button></div></div>';
  }
  function queue(opts) {
    opts = opts || {};
    var rows = [[ROW_RC, ROW_RC[9]]].concat(ROWS.map(function (r, k) { return [r, SRC[k]]; }));
    if (opts.added) rows.unshift([ROW_NEW, ROW_NEW[9]]);
    var n = rows.length;
    var h = who(opts.name || "Pat Admin", opts.role || "Admin") +
      (opts.added ? '<div class="alertb info">✓ Request opened for Taylor Advisor (example-taylor.ca). The advisor was not notified.</div>' : '') +
      '<div class="toolbar2"><div class="filters" style="margin:0"><span class="fchip on">All (' + n + ')</span><span class="fchip">Not hosted by us</span><span class="fchip">Stuck partway</span><span class="fchip">Requested</span><span class="fchip">In progress</span><span class="fchip">Failed</span></div><button class="btn pri" type="button" onclick="SP.go(\'new\')">+ Open request</button></div>' +
      '<div class="card"><div class="reqrow h"><div>Advisor</div><div>Website</div><div>Reason</div><div>Status</div><div>Updated</div><div></div></div>';
    h += rows.map(function (x) { return rowHtml(x[0], x[1]); }).join("");
    return h + '<div class="pager"><span>1–' + n + ' of ' + n + ' · 20 per page</span><span>‹ Prev · Next ›</span></div></div>';
  }
  /* staff opens a request */
  var ADV = [["Jane Advisor", "jane.advisor@example.com", "Your Firm Name"], ["Janet Sample", "janet.sample@example.com", "Sample Firm One"], ["Jan Example", "jan.example@example.com", "Sample Firm Two"], ["Janice Demo", "janice.demo@example.com", "Sample Firm Three"], ["Jane Test", "jane.test@example.com", "Sample Firm Four"], ["Janelle Sample", "janelle.sample@example.com", "Sample Firm Five"], ["Jana Example", "jana.example@example.com", "Sample Firm Six"], ["Janine Demo", "janine.demo@example.com", "Sample Firm Seven"], ["Janae Test", "janae.test@example.com", "Sample Firm Eight"], ["Janessa Sample", "janessa.sample@example.com", "Sample Firm Nine"]];
  function newForm(k) {
    var picked = k === "new-picked" || k === "new-dup";
    var dup = k === "new-dup";
    var adv = dup ? ["Sam Advisor", "sam.advisor@example.com", "Your Firm Name"] : ["Taylor Advisor", "taylor.advisor@example.com", "Sample Firm Two"];
    var site = dup ? "example.ca" : "example-taylor.ca";
    var search = k === "new-search";
    var h = who("Sam Support", "Support") + '<button class="btn link back" type="button" onclick="SP.go(\'queue\')">← All requests</button><div class="card pad" style="max-width:720px"><h2>Open a setup request</h2><p class="sub">For an advisor who needs our team’s help connecting their website.</p>';
    h += '<div class="fld"><label>Advisor</label>';
    if (picked) h += '<div class="mc" style="margin:0"><div class="grow"><b>' + adv[0] + '</b><small>' + adv[1] + ' · ' + adv[2] + '</small></div><button class="btn link" type="button" onclick="SP.go(\'new\')">Change</button></div>';
    else h += '<input value="' + (search ? "jane" : "") + '" placeholder="Search by name, email or firm" aria-label="Search advisors">';
    h += '</div>';
    if (search) {
      h += '<div class="pick">' + ADV.map(function (a, n) { return '<div class="pr' + (n === 0 ? " hi" : "") + '" onclick="SP.go(\'new-picked\')"><b>' + a[0] + '</b><small>' + a[1] + ' · ' + a[2] + '</small></div>'; }).join("") +
        '<div class="pager" style="padding:8px 12px"><span>Showing 1–10 of 37</span><span>‹ Prev · <b>Next ›</b></span></div></div><p class="fhelp">Search shows 10 at a time and only name, email and firm. It never loads all advisors.</p>';
    } else if (!picked) {
      h += '<p class="fhelp">Type at least 2 letters. Results show 10 at a time.</p>';
    }
    if (dup) {
      h += '<div class="alertb warn"><b>Sam Advisor already has an open request for example.ca.</b> In progress since Nov 22, 1:32 PM PT, assigned to Sam Support. We keep one open request per advisor and website.<div class="acts" style="margin-top:8px"><button class="btn" type="button" onclick="SP.go(\'progress\')">Open existing request</button></div></div>' +
        '<div class="fld"><label>Add a note to the existing request</label><textarea rows="3" style="border:1px solid #c4c4c4;border-radius:6px;padding:8px 10px">Advisor phoned again; still can’t publish the test post.</textarea></div><div class="acts" style="margin:0"><button class="btn pri" type="button">Add note</button><button class="btn quiet" type="button" onclick="SP.go(\'queue\')">Cancel</button></div></div>';
      return h;
    }
    var dis = picked ? "" : " disabled";
    h += '<div class="fld"><label>Website address</label><input value="' + (picked ? "https://" + site : "") + '" placeholder="https://example-advisor.ca"' + dis + '>' + (picked ? '<span class="fhelp" style="margin:2px 0 0">From the advisor’s profile. You can edit it.</span>' : "") + '</div>' +
      '<div class="fld"><label>Hosting</label><div class="radios2"><label><input type="radio" name="h"' + dis + '> Hosted by us</label><label><input type="radio" name="h"' + (picked ? " checked" : " disabled") + '> Not hosted by us</label></div></div>' +
      '<div class="fld"><label>Reason or note (required)</label><textarea rows="3" style="border:1px solid #c4c4c4;border-radius:6px;padding:8px 10px"' + dis + ' placeholder="What does the advisor need?">' + (picked ? "Advisor emailed to say the Connect card can’t reach their website." : "") + '</textarea></div>' +
      '<div class="fld"><label class="tgrow"><span class="tgl' + (picked ? "" : "") + '"></span> Notify advisor by email</label><span class="fhelp" style="margin:0">Off by default. When on, the advisor gets a plain “our team is helping” email with no links that change anything.</span></div>' +
      '<div class="acts" style="margin:0"><button class="btn pri" type="button"' + (picked ? ' onclick="SP.go(\'new-done\')"' : " disabled") + '>Open request</button><button class="btn quiet" type="button" onclick="SP.go(\'queue\')">Cancel</button></div></div>';
    return h;
  }
  function navScene() {
    var rail = '<div class="ri"><span class="ico">📄</span>Advisor Posts</div><div class="ri on"><span class="ico">🌐</span>Website setup</div>';
    return '<div class="app adm"><nav class="rail"><div class="logo">ADMIN<small>Staff only</small></div>' + rail + '</nav><div class="col"><div class="mbar"><button type="button">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">ADMIN</div><div class="av">SS</div></div>' +
      '<div class="navdrop"><div class="ri">Advisor Posts</div><div class="ri on">Website setup</div></div><main class="main"><h1 class="page">Website setup requests</h1>' + queue({ name: "Sam Support", role: "Support" }) + '</main></div></div>';
  }
  function head(name, site, reason, st, cls) {
    return '<button class="btn link back" type="button" onclick="SP.go(\'queue\')">← All requests</button>' +
      '<div class="status" style="margin:0 0 14px"><div class="grow"><h2 style="margin:0;font-size:22px">' + site + '</h2><p class="sub" style="margin:2px 0 0">' + name + ' · Your Firm Name · ' + reason + '</p></div><span class="badge ' + cls + '">' + st + '</span></div>';
  }
  var RULE = '# Allow the Authorization header\nRewriteEngine On\nRewriteCond %{HTTP:Authorization} ^(.*)\nRewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]';
  function form(k) {
    var saved = k === "progress" || k === "failed" || k === "done";
    var dis = k === "done";
    var f = '<div class="card pad"><h2>Manual setup</h2><p class="sub">Use this only when the advisor can’t connect on their own. The advisor never sees these fields.</p>' +
      '<div class="fld"><label>Website address</label><input value="https://' + (k === "failed" ? "example.org" : k === "progress" ? "example.ca" : SITE) + '" readonly></div>' +
      '<div class="fld"><label>WordPress username</label><input value="' + (saved ? (k === "failed" ? "lee.advisor" : "sam.advisor") : "") + '" placeholder="Username"' + (dis ? " readonly" : "") + '></div>' +
      '<div class="fld"><label>Application password</label><input type="password" value="' + (saved ? "••••••••••••••••" : "") + '" placeholder="Paste application password"' + (dis ? " readonly" : "") + '><span class="fhelp" style="margin:2px 0 0">' + (saved ? "Saved and encrypted. It can’t be shown again; paste a new one to replace it." : "Created in WordPress under Users → Profile → Application Passwords. It’s stored encrypted and never shown again.") + '</span></div>';
    if (k === "req") f += '<div class="alertb info">We don’t host this website, so we can’t change its server. We’ll check the login and test publishing only.</div>';
    if (k === "failed") f += '<div class="alertb bad"><b>Test post failed (401 unauthorized).</b> The website isn’t passing the login header through. Last step reached: Publishing a test post. Nothing was changed on the website beyond the backup.</div><p class="sub" style="margin:0 0 6px">If we don’t host this website, send the host or web person this rule:</p><div class="code">' + RULE + '</div>';
    if (k === "done") f += '<div class="alertb info">✓ Connected. The advisor now sees Connected on their Website tab.</div>';
    var acts = k === "done" ? '<button class="btn quiet" type="button" onclick="SP.go(\'queue\')">Back to queue</button>' :
      k === "failed" ? '<button class="btn pri" type="button" onclick="SP.go(\'done\')">Check login and retry</button><button class="btn quiet" type="button">Add note</button><a class="btn quiet" href="' + MAIL + '">Email advisor</a>' :
      '<button class="btn pri" type="button" onclick="SP.go(\'' + (k === "req" ? "progress" : "done") + '\')">' + (k === "req" ? "Start setup" : "Check login and connect") + '</button><button class="btn quiet" type="button">Save progress</button>';
    return f + '<div class="acts" style="margin-top:4px">' + acts + '</div></div>';
  }
  function detail(k) {
    var cfg = {
      req: ["Jane Advisor", SITE, "Not hosted by us", "Requested", "n", [["todo", "Website address confirmed"], ["todo", "Checking the website login"], ["todo", "Saving a backup"], ["todo", "Publishing a test post"]]],
      progress: ["Sam Advisor", "example.ca", "Stuck partway through a manual setup", "In progress", "b", [["done", "Website address confirmed", "Done"], ["done", "Checking the website login", "Done"], ["done", "Saving a backup", "Done"], ["cur", "Publishing a test post", "Working…"]]],
      failed: ["Lee Advisor", "example.org", "Stuck partway through a manual setup", "Failed", "r", [["done", "Website address confirmed", "Done"], ["done", "Checking the website login", "Done"], ["done", "Saving a backup", "Done"], ["fail", "Publishing a test post", "Didn’t finish"]]],
      done: ["Jane Advisor", SITE, "Not hosted by us", "Connected", "g", [["done", "Website address confirmed", "Done"], ["done", "Checking the website login", "Done"], ["done", "Saving a backup", "Done"], ["done", "Publishing a test post", "Done"]]]
    }[k];
    var asg = '<div class="card pad"><h2 style="font-size:15px">Setup steps</h2>' + steps(cfg[5]) + '<p class="fhelp">Assigned to Sam Support</p></div>' + logBlock(k);
    return who("Sam Support", "Support") + head(cfg[0], cfg[1], cfg[2], cfg[3], cfg[4]) + '<div class="two"><div>' + asg + '</div>' + form(k) + '</div>';
  }
  function noaccess() {
    return '<div class="card pad" style="max-width:560px"><div class="res"><div class="rico info">🔒</div><div><h3>Only support and admin can open this page</h3><p>You’re signed in as Jane Advisor. Website setup help is handled by our team. Your Website tab has everything you need to connect.</p><div class="acts"><a class="btn pri" href="#" onclick="SP.go(\'adv-requested\');return false">Go to Website</a></div></div></div></div>';
  }
  /* advisor view: no manual form, ever */
  function adv(k) {
    var info = {
      "adv-requested": ["info", "i", "Our team will set up your website", "We got your request for " + SITE + ". Our team will connect it for you and email you when it’s done. You don’t need to do anything.", "Requested", "n"],
      "adv-progress": ["info", "…", "Our team is setting up your website", "Our team is working on " + SITE + " now. We’ll email you when it’s connected.", "In progress", "b"],
      "adv-failed": ["warn", "!", "We’re still working on your website", "We hit a snag connecting " + SITE + ". Our team is on it and will contact you. You don’t need to do anything.", "In progress", "b"]
    }[k];
    var body = '<div class="card pad"><div class="status"><div class="grow"><h2>Connect your website</h2><p class="sub" style="margin-bottom:0">' + SITE + '</p></div><span class="badge ' + info[5] + '">' + info[4] + '</span></div><div style="height:16px"></div>' +
      '<div class="res"><div class="rico ' + info[0] + '">' + info[1] + '</div><div><h3>' + info[2] + '</h3><p>' + info[3] + '</p><div class="acts"><a class="btn quiet" href="mailto:support@financialtechtools.ca?subject=' + encodeURIComponent("My website setup") + '">Contact support</a><button class="btn link" type="button">Cancel request</button></div></div></div></div>';
    return shell("Website", ["Posts", "Settings", "Analytics"], body, false);
  }
  function shell(title, tabs, inner, admin) {
    var rail = admin ?
      '<div class="ri"><span class="ico">👥</span>Users</div><div class="ri"><span class="ico">📄</span>Advisor Posts</div><div class="ri on"><span class="ico">🌐</span>Website setup</div><div class="ri"><span class="ico">⚙</span>Settings</div>' :
      '<div class="ri"><span class="ico">📄</span>Content</div><div class="ri on"><span class="ico">🖥</span>Website</div><div class="ri"><span class="ico">🔗</span>Social Media</div><div class="ri"><span class="ico">✉</span>Email Campaigns</div>';
    var t = tabs ? '<div class="etabs">' + tabs.map(function (x) { return '<span class="etab' + (x === "Settings" ? " on" : "") + '">' + x + '</span>'; }).join("") + '</div>' : "";
    return '<div class="app ' + (admin ? "adm" : "") + '"><nav class="rail"><div class="logo">' + (admin ? "ADMIN" : "YFN") + '<small>' + (admin ? "Staff only" : "Your Firm Name") + '</small></div>' + rail + '</nav><div class="col"><div class="mbar"><button type="button">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">' + (admin ? "ADMIN" : "YFN") + '</div><div class="av">' + (admin ? "PA" : "JA") + '</div></div><main class="main"><h1 class="page">' + title + '</h1>' + t + inner + '</main></div></div>';
  }
  function render() {
    var s = S.s, inner;
    if (s === "nav") inner = navScene();
    else if (s === "new-done") inner = shell("Website setup requests", null, queue({ added: true, name: "Sam Support", role: "Support" }), true);
    else if (s.indexOf("new") === 0) inner = shell("Open request", null, newForm(s), true);
    else if (s === "queue") inner = shell("Website setup requests", null, queue(), true);
    else if (s === "noaccess") inner = shell("Website setup requests", null, noaccess(), false);
    else if (s.indexOf("adv-") === 0) inner = adv(s);
    else inner = shell("Website setup", null, detail(s), true);
    var bar = '<a href="../">All mocks</a> · <a href="index.html">#727 hub</a> · <a href="a-inline.html">A</a> · <a href="support-setup.html" style="font-weight:700;color:#fff">Support tool</a> · <a href="build-contract.html">Contract</a><span class="sp"></span>' +
      '<button type="button" data-k="dev:desk" onclick="SP.dev(\'desk\')">Desktop</button><button type="button" data-k="dev:phone" onclick="SP.dev(\'phone\')">390</button><span class="gap"></span>' +
      SC.map(function (x) { return '<button type="button" data-k="s:' + x[0] + '" onclick="SP.go(\'' + x[0] + '\')">' + x[1] + '</button>'; }).join("");
    $("bar").innerHTML = bar;
    $("root").innerHTML = '<div class="stagewrap"><div id="stage" class="' + S.dev + '">' + inner + '</div></div>';
    Array.prototype.forEach.call(document.querySelectorAll("#bar button[data-k]"), function (b) {
      var k = b.getAttribute("data-k").split(":");
      b.classList.toggle("on", k[0] === "dev" ? S.dev === k[1] : S.s === k[1]);
    });
  }
  function sync() { var q = new URLSearchParams(); q.set("s", S.s); if (S.dev === "phone") q.set("phone", "1"); history.replaceState(null, "", "?" + q); }
  window.SP = {
    go: function (s) { S.s = s; sync(); render(); window.scrollTo(0, 0); },
    dev: function (d) { S.dev = d; sync(); render(); },
    boot: function () {
      var q = new URLSearchParams(location.search), s = q.get("s");
      if (SC.some(function (x) { return x[0] === s; })) S.s = s;
      S.dev = q.has("phone") ? "phone" : "desk";
      render();
    }
  };
})();

(function () {
  var SITE = "example-advisor.ca";
  var SUPPORT = "support@financialtechtools.ca";
  var MAIL = "mailto:" + SUPPORT + "?subject=" + encodeURIComponent("Help connecting my website") +
    "&body=" + encodeURIComponent("Hi,\n\nI'd like help connecting my website.\n\nName: Jane Advisor\nFirm: Your Firm Name\nWebsite: " + SITE + "\n\nThanks");
  var SCENES = [
    ["url", "1 Enter URL"], ["wp", "2 WordPress approve"], ["connecting", "3 Connecting"], ["connected", "4 Connected"],
    ["err-domain", "Not hosted by us"], ["err-apppw", "App passwords off"], ["err-reject", "Rejected"],
    ["err-role", "Not admin/editor"], ["err-test", "Test post failed"]
  ];
  var RC = [["rc-url", "R1 Reconnect card"], ["rc-wp", "R2 WordPress approve"], ["rc-connecting", "R3 Reconnecting"], ["rc-done", "R4 Reconnected"], ["rc-fail", "R5 Failed, unchanged"]];
  var DC = [["dc-a", "D1 Inline confirm"], ["dc-b", "D2 Modal confirm"], ["dc-c", "D3 Undo toast"], ["dc-done", "D4 Disconnected"]];
  var DIRS = { a: "A Inline card", b: "B Guided page", c: "C Modal" };
  var FILES = { a: "a-inline.html", b: "b-wizard.html", c: "c-modal.html" };
  var STEPS = ["Your website", "Approve", "Connecting", "Connected"];
  var PLIST = ["Checking your website login", "Saving a backup of your website", "Allowing FinancialContent to post", "Publishing a test post"];
  function isDc(s) { return s.indexOf("dc-") === 0; }
  function isRc(s) { return s.indexOf("rc-") === 0; }
  var S = { dir: "a", s: "url", dev: "desk", v: "", p: 2 };

  function $(id) { return document.getElementById(id); }

  function stepper(cur, fail) {
    return '<div class="stp">' + STEPS.map(function (t, i) {
      var c = fail === i ? "fail" : i < cur ? "done" : i === cur && fail < 0 ? "cur" : "";
      var d = fail === i ? "!" : i < cur ? "✓" : String(i + 1);
      return '<div class="st ' + c + '"><span class="dot">' + d + '</span><span class="lb">' + t + '</span></div>';
    }).join("") + '</div>';
  }
  function stepInfo(s) {
    if (s === "rc-url") return { cur: 0, fail: -1, n: 1 };
    if (s === "rc-wp") return { cur: 1, fail: -1, n: 2 };
    if (s === "rc-connecting") return { cur: 2, fail: -1, n: 3 };
    if (s === "rc-done") return { cur: 4, fail: -1, n: 4 };
    if (s === "rc-fail") return { cur: 1, fail: S.v.indexOf("test") === 0 ? 3 : 1, n: 2 };
    if (s === "url") return { cur: 0, fail: -1, n: 1 };
    if (s === "wp") return { cur: 1, fail: -1, n: 2 };
    if (s === "connecting") return { cur: 2, fail: -1, n: 3 };
    if (s === "connected") return { cur: 4, fail: -1, n: 4 };
    if (s === "err-domain") return { cur: 0, fail: 0, n: 1 };
    if (s === "err-test") return { cur: 3, fail: 3, n: 4 };
    return { cur: 1, fail: 1, n: 2 };
  }
  function spin() { return '<span class="spin"></span>'; }

  function urlForm() {
    var v = S.v || "filled";
    var val = v === "filled" || v === "checking" ? SITE : v === "invalid" ? "example advisor" : "";
    var bad = v === "invalid";
    var chk = v === "checking";
    return '<div class="field"><label for="u">Website address</label><div class="urlrow">' +
      '<div class="urlin' + (bad ? " err" : "") + '"><span class="pre">https://</span><input id="u" value="' + val + '" placeholder="example-advisor.ca"' + (chk ? " readonly" : "") + ' aria-label="Website address"></div>' +
      '<button class="btn pri" type="button"' + (chk ? " disabled" : ' onclick="FC.connect()"') + '>' + (chk ? spin() + "Checking…" : "Connect") + '</button></div>' +
      (bad ? '<p class="ferr">Enter your website address, like example-advisor.ca.</p>' : '<p class="fhelp">' + (chk ? "Looking up " + SITE + "…" : "No need to log in to anything yet. You’ll approve the connection once in WordPress.") + '</p>') + '</div>';
  }
  function plist(p, fail) {
    return '<ul class="plist">' + PLIST.map(function (t, i) {
      var n = i + 1;
      var c = fail === n ? "fail" : n < p ? "done" : n === p ? "cur" : "todo";
      var ic = c === "done" ? "✓" : c === "fail" ? "!" : c === "cur" ? spin() : String(n);
      var cap = c === "done" ? "Done" : c === "cur" ? "Working…" : c === "fail" ? "Didn’t finish" : "";
      return '<li class="' + c + '"><span class="ic">' + ic + '</span>' + t + '<span class="cap">' + cap + '</span></li>';
    }).join("") + '</ul>';
  }
  function connectingBody() {
    var p = Math.min(4, Math.max(1, S.p));
    return '<div class="okline">✓ Approved in WordPress by Jane Advisor</div>' + plist(p, 0) +
      '<p class="fhelp">Keep this page open. This usually takes under a minute.</p>';
  }
  function testFailBody() { return plist(4, 4); }

  function connectedBody(big) {
    return '<div class="' + (big ? "big" : "res") + '"><div class="rico ok">✓</div><div><h3>' + (big ? "" : "") + 'Your website is connected</h3>' +
      '<p>FinancialContent can now publish your posts to the news page on ' + SITE + '. We published a test post and removed it again.</p>' +
      '<div class="facts"><div>Website<b>' + SITE + '</b></div><div>Connected<b>Nov 19, 11:24 AM PT</b></div><div>Backup<b>Saved</b></div></div>' +
      '<div class="acts"><a class="btn pri" href="#" onclick="return false">View my news page</a><button class="btn quiet" type="button" onclick="FC.go(\'url\')">Done</button><button class="btn link" type="button"' + (S.dir === "a" ? " onclick=\"FC.go('dc-a')\"" : "") + '>Disconnect website</button>' + (S.dir === "a" ? '<button class="btn link" type="button" onclick="FC.go(\'rc-url\')">Reconnect</button>' : "") + '</div></div></div>';
  }

  var ERR = {
    "err-domain": { cls: "warn", ic: "!", title: "We can’t connect " + SITE + " ourselves", nochg: true,
      body: "<p>This website isn’t hosted with us, so we can’t set it up in one step. Our team can help you connect it.</p><p class=\"fhelp\">" + SUPPORT + "</p>",
      acts: '<a class="btn pri" href="' + MAIL + '">Email support</a><button class="btn quiet" type="button" onclick="FC.go(\'url\')">Try a different address</button>' },
    "err-apppw": { cls: "warn", ic: "!", title: "WordPress isn’t allowing connections yet", nochg: true,
      body: "<p>A security setting on " + SITE + " is blocking the approval step. Switch this setting off, then try again:</p>" +
        '<div class="setbox"><b>In your security plugin (for example Wordfence)</b>Find <u>Disable WordPress application passwords</u> and make sure it is turned off.<div class="tg"><span class="tgl"></span>Disable WordPress application passwords: Off</div></div>' +
        "<p class=\"fhelp\">Not sure where to find it? Our team can do this with you.</p>",
      acts: '<button class="btn pri" type="button" onclick="FC.go(\'wp\')">Try again</button><a class="btn quiet" href="' + MAIL + '">Contact support</a>' },
    "err-reject": { cls: "info", ic: "✕", title: "You didn’t approve the connection", nochg: true,
      body: "<p>No problem. You can connect again whenever you’re ready.</p>",
      acts: '<button class="btn pri" type="button" onclick="FC.go(\'wp\')">Connect again</button><button class="btn quiet" type="button" onclick="FC.go(\'url\')">Cancel</button>' },
    "err-role": { cls: "warn", ic: "!", title: "An administrator or editor needs to approve", nochg: true,
      body: "<p>The WordPress account you used can’t approve this connection. Ask an administrator or editor of " + SITE + " to approve it, or sign in with that kind of account and try again.</p>",
      acts: '<button class="btn pri" type="button" onclick="FC.go(\'wp\',\'login\')">Try again with another account</button><a class="btn quiet" href="' + MAIL + '">Contact support</a>' },
    "err-test": { cls: "bad", ic: "!", title: "Almost there: the test post didn’t publish", nochg: false,
      body: "<p>Your website approved the connection and your backup is saved, but the test post didn’t go through. Nothing has changed on your news page.</p>",
      acts: '<button class="btn pri" type="button" onclick="FC.go(\'connecting\',\'\',4)">Try the test again</button><a class="btn quiet" href="' + MAIL + '">Contact support</a>' }
  };
  function errBlock(s, big) {
    var e = ERR[s];
    var nochg = e.nochg ? '<div class="nochg">✓ No changes were made to your website</div>' : "";
    var extra = s === "err-test" ? testFailBody() : "";
    return '<div class="' + (big ? "big" : "res") + '"><div class="rico ' + e.cls + '">' + e.ic + '</div><div><h3>' + e.title + '</h3>' + nochg + e.body + extra + '<div class="acts">' + e.acts + '</div></div></div>';
  }

  /* ---------- WordPress context ---------- */
  function wpScreen() {
    var login = S.v === "login";
    var inner;
    if (login) {
      inner = '<div class="wplogin"><div class="wlogo">W</div><div class="wpbox"><label>Username or Email Address</label><input value="jane.advisor" aria-label="Username"><label>Password</label><input type="password" value="••••••••••" aria-label="Password"><button class="wpbtn p" type="button" onclick="FC.go(\'' + S.s + '\',\'\')">Log In</button><div style="clear:both"></div></div><p class="small" style="margin-top:16px;color:#50575e">Lost your password?</p></div>';
    } else {
      inner = '<div class="wpbar"><span class="wl">W</span><span>Your Firm Name</span><span class="sp"></span><span>Howdy, Jane Advisor</span></div><div class="wpbody"><div class="wpside"><div>Dashboard</div><div>Posts</div><div>Media</div><div>Pages</div><div>Users</div><div class="on">Profile</div><div>Settings</div></div>' +
        '<div class="wpmain"><div class="wpbox"><h1>Authorize Application</h1>' +
        '<p>Howdy, <strong>Jane Advisor</strong>! An application would like to connect to your account on <strong>Your Firm Name</strong>.</p>' +
        '<p><strong>FinancialContent</strong> would like to connect. Would you like to give it access to your account? You should only do this if you trust it.</p>' +
        '<p class="small">Approving creates an application password named <code>FinancialContent</code>. You can revoke it at any time from your profile. You will be sent back to FinancialContent after approving.</p>' +
        '<p style="margin-top:18px"><button class="wpbtn p b" type="button" onclick="FC.go(\'' + (isRc(S.s) ? 'rc-connecting' : 'connecting') + '\',\'\',1)">Yes, I approve of this connection</button> <button class="wpbtn b" type="button" onclick="FC.go(\'' + (isRc(S.s) ? 'rc-fail' : 'err-reject') + '\')">No, I do not approve of this connection</button></p></div></div></div>';
    }
    return '<div class="ctxlab"><span class="pill">WORDPRESS</span>WordPress screen (context)</div><div class="bw"><div class="browser"><div class="bbar"><span class="dots"><i></i><i></i><i></i></span><span class="url">https://' + SITE + (login ? '/wp-login.php?redirect_to=…authorize-application.php' : '/wp-admin/authorize-application.php?app_name=FinancialContent') + '</span></div><div class="wpa">' + inner + '</div></div></div>';
  }

  /* ---------- FC shell ---------- */
  function shell(inner, overlay) {
    var tabs = ["Posts", "Settings", "Analytics"].map(function (t) { return '<span class="etab' + (t === "Settings" ? " on" : "") + '">' + t + '</span>'; }).join("");
    return '<div class="app"><nav class="rail"><div class="logo">YFN<small>Your Firm Name</small></div>' +
      '<div class="ri"><span class="ico">📄</span>Content</div><div class="ri on"><span class="ico">🖥</span>Website</div><div class="ri"><span class="ico">🔗</span>Social Media</div><div class="ri"><span class="ico">✉</span>Email Campaigns</div></nav>' +
      '<div class="col"><div class="mbar"><button type="button" aria-label="Menu">☰</button><div class="logo" style="height:40px;width:auto;padding:0 8px;margin:0">YFN</div><div class="av">JA</div></div>' +
      '<main class="main"><h1 class="page">Website</h1><div class="etabs">' + tabs + '</div>' + inner + '</main></div></div>' + (overlay || "");
  }
  function otherWays() {
    return '<div class="card pad muted-card"><h2 style="font-size:15px">Other ways to publish</h2><p class="sub" style="margin:0 0 10px">Already set up another way? It keeps working.</p>' +
      '<div class="mc"><div class="grow"><b>Embed on your page</b><small>Paste a code on your site</small></div><span class="btn quiet" style="min-height:32px">Set up</span></div>' +
      '<div class="mc" style="margin:0"><div class="grow"><b>PHP on your server</b><small>Upload a small folder</small></div><span class="btn quiet" style="min-height:32px">Set up</span></div></div>';
  }

  /* ---------- Direction A: inline card + stepper ---------- */
  function renderRc() {
    var s = S.s, i = stepInfo(s);
    var site = '<div class="mc" style="margin:0 0 14px"><div class="grow"><small>Reconnecting this website</small><b style="font-size:16px">' + SITE + '</b><small>Your Firm Name · Jane Advisor</small></div><span class="badge g">Connected</span></div>';
    var keep = '<p class="fhelp">News delivery stays the same. Your current connection keeps working until the new approval succeeds.</p>';
    var title = s === "rc-done" ? "Website connection" : "Reconnect your website";
    var body;
    if (s === "rc-url") {
      body = site + '<div class="acts" style="margin-top:0"><button class="btn pri" type="button" onclick="FC.go(\'rc-wp\')">Reconnect</button><button class="btn quiet" type="button" onclick="FC.go(\'connected\')">Cancel</button></div>' + keep;
    } else if (s === "rc-connecting") {
      body = site + '<div class="okline">✓ Approved in WordPress by Jane Advisor</div>' + plist(Math.min(4, Math.max(1, S.p)), 0) + '<p class="fhelp">Keep this page open. Your current connection stays active until this finishes.</p>';
    } else if (s === "rc-done") {
      body = '<div class="res"><div class="rico ok">✓</div><div><h3>Your website is reconnected</h3><p>The new approval replaced the old one. FinancialContent can still publish to the news page on ' + SITE + ', and news delivery is unchanged.</p>' +
        '<div class="facts"><div>Website<b>' + SITE + '</b></div><div>Reconnected<b>Nov 23, 12:10 AM PT</b></div><div>Backup<b>Saved</b></div></div>' +
        '<div class="acts"><a class="btn pri" href="#" onclick="return false">View my news page</a><button class="btn quiet" type="button" onclick="FC.go(\'connected\')">Done</button></div></div></div>';
    } else {
      var t = S.v.indexOf("test") === 0, sent = /sent/.test(S.v);
      body = '<div class="res"><div class="rico warn">!</div><div><h3>' + (t ? "We couldn’t finish reconnecting" : "We couldn’t reconnect your website") + '</h3>' +
        '<div class="nochg">✓ Your existing connection is unchanged</div>' +
        '<p>' + (t ? "The new approval didn’t pass our check, so we didn’t use it. " : "The approval in WordPress wasn’t completed. ") + 'Your website is still connected and publishing as before.</p>' +
        (t ? plist(4, 4) : "") +
        '<div class="mc" style="max-width:620px"><div class="grow"><small>Current connection</small><b>' + SITE + '</b><small>Connected Nov 19, 11:24 AM PT · still working</small></div><span class="badge g">Connected</span></div>' +
        '<div class="acts"><button class="btn pri" type="button" onclick="FC.go(\'rc-wp\')">Try again</button><button class="btn quiet" type="button" onclick="FC.go(\'connected\')">Cancel</button>' + (sent ? '<span class="sent">✓ Request sent to support</span>' : '<button class="btn link" type="button" onclick="FC.go(\'rc-fail\',\'' + (t ? "test-sent" : "sent") + '\')">Contact support</button>') + '</div>' + (sent ? '<p class="fhelp">Our team will look at example-advisor.ca and email you. Your existing connection is unchanged.</p>' : "") + '</div></div>';
    }
    var badge = s === "rc-connecting" ? '<span class="badge b">Reconnecting…</span>' : '<span class="badge g">Connected</span>';
    var head = '<div class="status"><div class="grow"><h2>' + title + '</h2><p class="sub" style="margin-bottom:0">' + SITE + '</p></div>' + badge + '</div><div style="height:16px"></div>';
    return shell('<div class="card pad">' + head + (s === "rc-done" ? "" : stepper(i.cur, i.fail)) + body + '</div>');
  }
  var PREV = "Embed on your page";
  function dcList() {
    return '<ul class="hl" style="margin:0 0 14px">' +
      '<li><span class="n">•</span><div>Posts stop going to the news page on ' + SITE + '.</div></li>' +
      '<li><span class="n">•</span><div>Posts already published stay on your website.</div></li>' +
      '<li><span class="n">•</span><div>Delivery goes back to your previous method: <b>' + PREV + '</b>.</div></li>' +
      '<li><span class="n">•</span><div>You can reconnect any time.</div></li></ul>' +
      (S.v === "sched" ? '<div class="alertb warn"><b>2 scheduled posts</b> were going to your news page (Nov 24, 9:00 AM PT and Nov 26, 9:00 AM PT). They will be delivered by ' + PREV + ' instead.</div>' : "") +
      (S.v === "err" ? '<div class="alertb bad"><b>We couldn’t disconnect your website.</b> It is still connected and publishing as before. Nothing was changed. Try again.</div>' : "");
  }
  function connectedCard() {
    return '<div class="card pad"><div class="status"><div class="grow"><h2>Website connection</h2><p class="sub" style="margin-bottom:0">' + SITE + '</p></div><span class="badge g">Connected</span></div><div style="height:16px"></div>' + connectedBody(false) + '</div>';
  }
  function renderDc() {
    var s = S.s;
    if (s === "dc-a") {
      var retry = S.v === "err";
      return shell('<div class="card pad"><div class="status"><div class="grow"><h2>Disconnect your website?</h2><p class="sub" style="margin-bottom:0">' + SITE + ' · Your Firm Name</p></div><span class="badge g">Connected</span></div><div style="height:16px"></div>' +
        dcList() + '<div class="acts" style="margin-top:0"><button class="btn dng" type="button" onclick="FC.go(\'dc-done\',\'' + (S.v === "sched" ? "sched" : "") + '\')">' + (retry ? "Try disconnecting again" : "Disconnect") + '</button><button class="btn quiet" type="button" onclick="FC.go(\'connected\')">Keep connected</button></div></div>');
    }
    if (s === "dc-b") {
      var ok = S.v === "ok" || S.v === "sched" || S.v === "err";
      var body = '<p class="fhelp" style="margin:0 0 10px">' + SITE + ' · Your Firm Name</p>' + dcList() +
        '<label class="chk"><input type="checkbox"' + (ok ? " checked" : "") + ' onclick="FC.go(\'dc-b\',this.checked?\'ok\':\'\')"> I understand posts will stop going to my news page</label>';
      var dlg = '<div class="scrim"><div class="dlg" role="dialog" aria-label="Disconnect your website"><div class="dh"><span>Disconnect your website?</span><button class="x" type="button" aria-label="Close" onclick="FC.go(\'connected\')">×</button></div><div class="db">' + body +
        '<div class="acts"><button class="btn dng" type="button"' + (ok ? ' onclick="FC.go(\'dc-done\',\'' + (S.v === "sched" ? "sched" : "") + '\')"' : " disabled") + '>' + (S.v === "err" ? "Try disconnecting again" : "Disconnect") + '</button><button class="btn quiet" type="button" onclick="FC.go(\'connected\')">Keep connected</button></div></div></div></div>';
      return shell(connectedCard(), dlg);
    }
    if (s === "dc-c") {
      var err = S.v === "err";
      var toast = err ? '<div class="toast bad"><span>We couldn’t disconnect your website. It is still connected.</span><button type="button" onclick="FC.go(\'dc-c\',\'err\')">Try again</button></div>'
        : '<div class="toast"><span>Website disconnected. ' + (S.v === "sched" ? "2 scheduled posts will go out by " + PREV + "." : "Posts now go out by " + PREV + ".") + '</span><button type="button" onclick="FC.go(\'connected\')">Undo</button><i class="tbar"></i></div>';
      var card = err ? connectedCard() : '<div class="card pad"><div class="status"><div class="grow"><h2>Connect your website</h2><p class="sub" style="margin-bottom:0">Enter your website address and we’ll connect it to your news page.</p></div><span class="badge n">Not connected</span></div><div style="height:16px"></div>' + stepper(0, -1) + urlForm() + '</div>';
      return shell(card + otherWays(), toast);
    }
    var sched = S.v === "sched";
    return shell('<div class="card pad"><div class="status"><div class="grow"><h2>Connect your website</h2><p class="sub" style="margin-bottom:0">' + SITE + '</p></div><span class="badge n">Not connected</span></div><div style="height:16px"></div>' +
      '<div class="res"><div class="rico info">✓</div><div><h3>Your website is disconnected</h3><p>Posts no longer go to the news page on ' + SITE + '. Posts already published stay on your website. Delivery is back to your previous method: <b>' + PREV + '</b>.</p>' +
      (sched ? '<div class="alertb info" style="max-width:620px">2 scheduled posts will be delivered by ' + PREV + ' instead.</div>' : "") +
      '<div class="acts"><button class="btn pri" type="button" onclick="FC.go(\'url\')">Connect again</button><button class="btn quiet" type="button" onclick="FC.go(\'url\')">Done</button></div></div></div></div>' + otherWays());
  }
  function renderA() {
    if (isDc(S.s)) return renderDc();
    if (isRc(S.s)) return renderRc();
    var s = S.s, i = stepInfo(s);
    var badge = s === "connected" ? '<span class="badge g">Connected</span>' : s === "connecting" ? '<span class="badge b">Connecting…</span>' : '<span class="badge n">Not connected</span>';
    var head = '<div class="status"><div class="grow"><h2>' + (s === "connected" ? "Website connection" : "Connect your website") + '</h2><p class="sub" style="margin-bottom:0">' +
      (s === "url" ? "Enter your website address and we’ll connect it to your news page." : s === "connected" ? SITE : SITE) + '</p></div>' + badge + '</div><div style="height:16px"></div>';
    var body;
    if (s === "url") body = urlForm();
    else if (s === "connecting") body = connectingBody();
    else if (s === "connected") body = connectedBody(false);
    else body = errBlock(s, false);
    return shell('<div class="card pad">' + head + stepper(i.cur, i.fail) + body + '</div>' + (s === "connected" ? "" : otherWays()));
  }

  /* ---------- Direction B: guided full page ---------- */
  function renderB() {
    var s = S.s, i = stepInfo(s), isErr = s.indexOf("err-") === 0;
    var pct = isErr ? i.n * 25 : s === "connected" ? 100 : i.n * 25;
    var bar = '<div class="wzbar"><i style="width:' + pct + '%;' + (isErr ? "background:#c62828" : "") + '"></i></div>';
    var hdr = '<div class="wzh"><div class="logo">YFN</div><div class="t">Connect your website</div><span class="sp"></span><button class="btn link" type="button" onclick="FC.go(\'url\')">' + (s === "connected" ? "Close" : "Exit") + '</button></div>';
    var body;
    if (s === "url") {
      body = '<p class="wzstep">Step 1 of 4</p><h2>What’s your website address?</h2><p class="lead">We’ll connect it to your news page. It takes about a minute.</p>' +
        '<ul class="hl"><li><span class="n">1</span><div><b>Enter your address</b></div></li><li><span class="n">2</span><div><b>Approve in WordPress</b> (one click)</div></li><li><span class="n">3</span><div><b>We do the rest</b> and publish a test post</div></li></ul>' +
        '<div class="card pad">' + urlForm() + '</div>';
    } else if (s === "connecting") {
      body = '<p class="wzstep">Step 3 of 4</p><h2>Connecting your website</h2><p class="lead">Keep this page open. This usually takes under a minute.</p><div class="card pad"><div class="okline">✓ Approved in WordPress by Jane Advisor</div>' + plist(Math.min(4, Math.max(1, S.p)), 0) + '</div>';
    } else if (s === "connected") {
      body = '<div class="card pad">' + connectedBody(true) + '</div>';
    } else {
      body = '<button class="btn link" type="button" onclick="FC.go(\'url\')" style="margin:0 0 10px">← Back to Website</button><div class="card pad">' + errBlock(s, true) + '</div>';
    }
    return '<div class="wz">' + hdr + bar + '<div class="wzbody"><div class="wzp">' + body + '</div></div></div>';
  }

  /* ---------- Direction C: modal over Website tab ---------- */
  function renderC() {
    var s = S.s, i = stepInfo(s), isErr = s.indexOf("err-") === 0;
    var connected = s === "connected";
    var bg = '<div class="card pad"><div class="status"><div class="grow"><h2>Website connection</h2><p class="sub" style="margin-bottom:0">' +
      (connected ? SITE + ' · Connected Nov 19, 11:24 AM PT' : 'Publish your posts to the news page on your own website.') + '</p></div>' +
      (connected ? '<span class="badge g">Connected</span>' : s === "connecting" ? '<span class="badge b">Connecting…</span>' : '<span class="badge n">Not connected</span>') +
      (connected ? "" : '<button class="btn pri" type="button">Connect website</button>') + '</div></div>' + otherWays();
    var close = s === "connecting" ? "" : '<button class="x" type="button" aria-label="Close" onclick="FC.go(\'url\')">×</button>';
    var title = s === "connected" ? "Website connected" : isErr ? "Couldn’t finish connecting" : "Connect your website";
    var body;
    if (s === "url") body = '<p class="wzstep">Step 1 of 4</p>' + urlForm();
    else if (s === "connecting") body = '<p class="wzstep">Step 3 of 4</p>' + connectingBody();
    else if (s === "connected") body = connectedBody(false).replace('<div class="facts">', '<div class="facts" style="grid-template-columns:1fr">');
    else body = errBlock(s, false).replace(/<div class="rico[^>]*>.*?<\/div>/, "");
    var dlg = '<div class="scrim"><div class="dlg" role="dialog" aria-label="' + title + '"><div class="dh"><span>' + title + '</span>' + close + '</div><div class="db">' + body + '</div></div></div>';
    return shell(bg, dlg);
  }

  /* ---------- chrome / routing ---------- */
  function bar() {
    var h = '<a href="../">All mocks</a> · <a href="index.html">#727 hub</a> · ';
    h += Object.keys(DIRS).map(function (d) { return '<a href="' + FILES[d] + location.search + '"' + (d === S.dir ? ' style="font-weight:700;color:#fff"' : "") + '>' + DIRS[d] + '</a>'; }).join(" · ");
    h += ' · <a href="build-contract.html">Contract</a><span class="sp"></span>';
    h += '<button type="button" data-k="dev:desk" onclick="FC.dev(\'desk\')">Desktop</button><button type="button" data-k="dev:phone" onclick="FC.dev(\'phone\')">390</button><span class="gap"></span>';
    h += SCENES.map(function (x) { return '<button type="button" data-k="s:' + x[0] + '" onclick="FC.go(\'' + x[0] + '\')">' + x[1] + '</button>'; }).join("");
    if (S.dir === "a") h += '<span class="gap"></span>' + RC.map(function (x) { return '<button type="button" data-k="s:' + x[0] + '" onclick="FC.go(\'' + x[0] + '\')">' + x[1] + '</button>'; }).join("");
    if (S.dir === "a") h += '<span class="gap"></span>' + DC.map(function (x) { return '<button type="button" data-k="s:' + x[0] + '" onclick="FC.go(\'' + x[0] + '\')">' + x[1] + '</button>'; }).join("");
    if (isDc(S.s)) h += '<span class="gap"></span>' + (S.s === "dc-b" ? '<button type="button" data-k="v:" onclick="FC.go(\'dc-b\',\'\')">Not ticked</button><button type="button" data-k="v:ok" onclick="FC.go(\'dc-b\',\'ok\')">Ticked</button>' : '<button type="button" data-k="v:" onclick="FC.go(\'' + S.s + '\',\'\')">Default</button>') + '<button type="button" data-k="v:sched" onclick="FC.go(\'' + S.s + '\',\'sched\')">Scheduled posts</button>' + (S.s === "dc-done" ? "" : '<button type="button" data-k="v:err" onclick="FC.go(\'' + S.s + '\',\'err\')">Disconnect failed</button>');
    if (S.s === "rc-fail") h += '<span class="gap"></span><button type="button" data-k="v:" onclick="FC.go(\'rc-fail\',\'\')">Not approved</button><button type="button" data-k="v:test" onclick="FC.go(\'rc-fail\',\'test\')">Check failed</button><button type="button" data-k="v:sent" onclick="FC.go(\'rc-fail\',\'sent\')">Request sent</button>';
    if (S.s === "url") h += '<span class="gap"></span>' + [["filled", "Filled"], ["empty", "Empty"], ["invalid", "Invalid"], ["checking", "Checking"]].map(function (x) { return '<button type="button" data-k="v:' + x[0] + '" onclick="FC.go(\'url\',\'' + x[0] + '\')">' + x[1] + '</button>'; }).join("");
    if (S.s === "wp" || S.s === "rc-wp") h += '<span class="gap"></span><button type="button" data-k="v:" onclick="FC.go(\'' + S.s + '\',\'\')">Approve screen</button><button type="button" data-k="v:login" onclick="FC.go(\'' + S.s + '\',\'login\')">Login first</button>';
    if (S.s === "connecting" || S.s === "rc-connecting") h += '<span class="gap"></span>' + [1, 2, 3, 4].map(function (n) { return '<button type="button" data-k="p:' + n + '" onclick="FC.go(\'' + S.s + '\',\'\',' + n + ')">Step ' + n + '</button>'; }).join("");
    return h;
  }
  function render() {
    var inner = S.s === "wp" || S.s === "rc-wp" ? wpScreen() : S.dir === "b" ? renderB() : S.dir === "c" ? renderC() : renderA();
    $("bar").innerHTML = bar();
    $("root").innerHTML = '<div class="stagewrap"><div id="stage" class="' + S.dev + (S.s === 'wp' || S.s === 'rc-wp' ? ' wps' : '') + '">' + inner + '</div></div>';
    Array.prototype.forEach.call(document.querySelectorAll("#bar button[data-k]"), function (b) {
      var k = b.getAttribute("data-k").split(":"), on = false;
      if (k[0] === "dev") on = S.dev === k[1];
      else if (k[0] === "s") on = S.s === k[1];
      else if (k[0] === "v") on = (S.s === "url" ? (S.v || "filled") : S.v) === k[1];
      else if (k[0] === "p") on = S.p === Number(k[1]);
      b.classList.toggle("on", on);
    });
    document.title = "#727 " + DIRS[S.dir] + " · " + S.s;
  }
  function sync() {
    var q = new URLSearchParams();
    q.set("s", S.s);
    if (S.v) q.set("v", S.v);
    if ((S.s === "connecting" || S.s === "rc-connecting") && S.p !== 2) q.set("p", S.p);
    if (S.dev === "phone") q.set("phone", "1");
    history.replaceState(null, "", "?" + q.toString());
  }
  window.FC = {
    go: function (s, v, p) { S.s = s; S.v = v || ""; if (p) S.p = p; else if (s !== "connecting" && s !== "rc-connecting") S.p = 2; sync(); render(); window.scrollTo(0, 0); },
    dev: function (d) { S.dev = d; sync(); render(); },
    connect: function () {
      var el = $("u"), val = (el && el.value || "").trim();
      if (!val || val.indexOf(".") < 0 || /\s/.test(val)) { FC.go("url", "invalid"); return; }
      if (val === "example.com") { FC.go("err-domain"); return; }
      FC.go("wp");
    },
    boot: function (o) {
      var q = new URLSearchParams(location.search);
      S.dir = o.dir;
      var s = q.get("s");
      if (SCENES.concat(RC, DC).some(function (x) { return x[0] === s; })) S.s = s;
      S.v = q.get("v") || "";
      S.p = Number(q.get("p")) || 2;
      S.dev = q.has("phone") || q.get("dev") === "phone" ? "phone" : "desk";
      render();
    }
  };
})();

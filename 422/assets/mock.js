(function () {
  const DIR = window.DIR || "a";
  const stage = document.getElementById("stage");
  const noteEl = document.getElementById("demoNote");
  const toastEl = document.getElementById("toast");
  let phone = false;
  let state = { screen: "login" };

  const POSTS = [
    { id: "p1", title: "RRSP contribution room for 2026", status: "pending", date: "Oct 7, 2026", cat: "Retirement" },
    { id: "p2", title: "TFSA tips for new parents", status: "live", date: "Oct 3, 2026", cat: "Tax" },
    { id: "p3", title: "Market update: what clients ask in October", status: "live", date: "Sep 28, 2026", cat: "Markets" },
    { id: "p4", title: "Estate planning checklist", status: "draft", date: "Oct 6, 2026", cat: "Estate" }
  ];
  const ADVISORS = [
    { name: "Priya Desai", firm: "Northshore Wealth", email: "priya.desai@example.com" },
    { name: "Marcus Lee", firm: "Harbour Financial", email: "marcus.lee@example.com" },
    { name: "Jordan Okonkwo", firm: "Cedar Ridge Advisors", email: "jordan.okonkwo@example.com" },
    { name: "Sam Rivera", firm: "Northshore Wealth", email: "sam.rivera@example.com" }
  ];

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    setTimeout(() => toastEl.classList.remove("on"), 1800);
  }

  function statusChip(s) {
    if (s === "pending") return '<span class="chip warn">Waiting for FTT review</span>';
    if (s === "live") return '<span class="chip ok">Live for advisors</span>';
    if (s === "draft") return '<span class="chip gray">Draft</span>';
    if (s === "direct") return '<span class="chip ok">Published</span>';
    if (s === "unpub") return '<span class="chip err">Unpublished by FTT</span>';
    return '<span class="chip gray">' + s + '</span>';
  }

  function topbar(extra) {
    const themes = { a: "", b: "fsb", c: "wl" };
    const cls = themes[DIR] || "";
    const brand = DIR === "c"
      ? '<div class="logo">FSB Partner Portal <span style="opacity:.7;font-weight:500;font-size:11px">powered by FinancialContent</span></div>'
      : '<div class="logo">Financial<span>Content</span></div><span class="partner">FSB partner</span>';
    return '<div class="topbar ' + cls + '">' + brand +
      '<span class="scope">Showing FSB content only</span>' +
      (extra || '') +
      '<div class="who"><span class="av">RK</span> Riley Khan · FSB</div></div>';
  }

  function fttTopbar() {
    return '<div class="topbar"><div class="logo">Financial<span>Content</span></div>' +
      '<span class="ftt-badge">FTT ADMIN</span>' +
      '<div class="who"><span class="av">JT</span> Jordan Trent · Admin</div></div>';
  }

  function sideNav(active) {
    const items = DIR === "c"
      ? [
          ["library", "Library"],
          ["create", "Create"],
          ["advisors", "My advisors"],
          ["schedule", "Schedule & send"]
        ]
      : [
          ["library", "Library"],
          ["create", "Create"],
          ["advisors", "My advisors"]
        ];
    let html = '<div class="side">';
    html += '<div class="sec">FSB workspace</div>';
    items.forEach(([id, label]) => {
      html += '<button type="button" class="navitem' + (active === id ? ' on' : '') + '" data-go="' + id + '">' + label + '</button>';
    });
    html += '<div class="sec">Not available</div>';
    ["Manage all advisors (MAP)", "Billing", "Global settings", "Other content sources"].forEach((label) => {
      html += '<button type="button" class="navitem deny" data-go="hidden" title="Not available for your account">' + label + '</button>';
    });
    html += '</div>';
    return html;
  }

  function shell(active, body) {
    return '<div class="app' + (phone ? ' phone' : '') + '">' + topbar() +
      '<div class="sidenav">' + sideNav(active) + '<div class="main page">' + body + '</div></div></div>';
  }

  function renderLogin() {
    const title = DIR === "c" ? "FSB Partner Portal" : "Sign in · FSB partner";
    const sub = DIR === "c"
      ? "Partner workspace powered by FinancialContent. You only see FSB content and FSB advisors."
      : "You'll land in the FSB Content Library — only FSB content and FSB advisors.";
    return '<div class="app' + (phone ? ' phone' : '') + '"><div class="login-wrap"><div class="login-card">' +
      (DIR === "c" ? '<div style="font-weight:800;font-size:18px;margin-bottom:4px;color:#1a3a2a">FSB</div>' : '<div class="logo" style="font-weight:700;margin-bottom:8px;color:#1e2a4a">Financial<span style="color:#2b7de9">Content</span> <span class="chip fsb">FSB</span></div>') +
      '<h2>' + title + '</h2><p class="hint">' + sub + '</p>' +
      '<div class="field"><label>Email</label><input value="riley.khan@fsb-partner.example" readonly /></div>' +
      '<div class="field"><label>Password</label><input type="password" value="••••••••" readonly /></div>' +
      '<button type="button" class="btn pri" style="width:100%;justify-content:center;margin-top:8px" data-go="library">Sign in</button>' +
      '<p class="small muted" style="margin-top:14px;text-align:center">Accounts are created by FTT staff. Multiple FSB logins are allowed.</p>' +
      '</div></div></div>';
  }

  function postsForDir() {
    if (DIR === "b") {
      return POSTS.map((p) => ({
        ...p,
        status: p.status === "pending" ? "direct" : (p.id === "p4" ? "draft" : p.status === "live" ? "direct" : p.status)
      })).concat([{ id: "p5", title: "Bond ladder basics", status: "unpub", date: "Sep 20, 2026", cat: "Fixed income" }]);
    }
    return POSTS;
  }

  function renderLibrary() {
    const posts = postsForDir();
    const reviewNote = DIR === "a"
      ? '<div class="banner fsb"><strong>FTT reviews new items before advisors see them.</strong> Pending items stay in your library until FinancialContent approves. You can edit drafts anytime.</div>'
      : DIR === "b"
        ? '<div class="banner info"><strong>Items go live when you publish.</strong> FTT can unpublish anything. One item below was unpublished by FTT.</div>'
        : '<div class="banner ok"><strong>Partner portal.</strong> You can publish and schedule to your FSB advisors. FTT still sees everything.</div>';
    let cards = posts.map((p) =>
      '<div class="pcard"><div class="thumb">📄</div><div class="body"><h3>' + p.title + '</h3>' +
      '<div class="meta">' + p.cat + ' · ' + p.date + '</div>' + statusChip(p.status) +
      '<div class="actions" style="margin-top:8px"><button type="button" class="btn sm" data-go="create">Edit</button></div></div></div>'
    ).join("");
    const body = '<div class="row" style="justify-content:space-between;margin-bottom:8px">' +
      '<div><h2>FSB Content Library</h2><p class="sub">Only content tagged <span class="chip fsb lock">FSB-Content · locked</span></p></div>' +
      '<button type="button" class="btn pri" data-go="create">+ New content</button></div>' +
      reviewNote +
      '<div class="toolbar"><input class="search" placeholder="Search FSB content…" /><span class="grow"></span><span class="chip gray">' + posts.length + ' items</span></div>' +
      '<div class="grid-cards">' + cards + '</div>';
    return shell("library", body);
  }

  function renderCreate() {
    const publishLabel = DIR === "a" ? "Submit for FTT review" : (DIR === "c" ? "Publish & continue to schedule" : "Publish to FSB advisors");
    const body = '<h2>' + (DIR === "a" ? "Create FSB content" : "Create content") + '</h2>' +
      '<p class="sub">Website post · email to the advisor\'s clients · featured image. Source is set automatically.</p>' +
      '<div class="locked" style="margin-bottom:14px"><span class="chip fsb lock">🔒 Advisor source: FSB-Content (fsb-content)</span>' +
      '<span class="small muted">Set by the server. You can\'t pick another source.</span></div>' +
      '<div class="form">' +
      '<div class="field"><label>Title</label><input value="RESP withdrawals for first-year students" /></div>' +
      '<div class="field"><label>Website post (body)</label><textarea>When a student starts college, families often ask how to take RESP money out without surprises…</textarea></div>' +
      '<div class="field"><label>Email to the user (advisor\'s clients)</label><textarea>Hi {{first_name}}, a quick note on RESP withdrawals this fall…</textarea></div>' +
      '<div class="field"><label>Featured image</label><div class="row"><div style="width:120px;height:72px;border-radius:8px;background:linear-gradient(135deg,#c7d2fe,#a5f3fc);display:grid;place-items:center;font-size:11px;color:#475569">campus.jpg</div><button type="button" class="btn sm" data-toast="Featured image picker (mock)">Replace image</button></div></div>' +
      '<div class="field"><label>Category</label><select><option>Education</option><option>Retirement</option><option>Tax</option></select>' +
      '<p class="small muted" style="margin-top:4px">' + (DIR === "c" ? "Shared FC categories (open question: FSB-only set?)." : "Uses shared FC categories for now (open question).") + '</p></div>' +
      '<div class="row"><button type="button" class="btn pri" data-toast="' + (DIR === "a" ? "Submitted — waiting for FTT review" : "Published to FSB advisors") + '">' + publishLabel + '</button>' +
      '<button type="button" class="btn" data-toast="Saved as draft">Save draft</button>' +
      '<button type="button" class="btn text" data-go="library">Cancel</button></div>' +
      (DIR === "a" ? '<p class="small muted">After FTT approves, FSB advisors with source fsb-content will see this in their library. You can edit your own drafts; live edit/delete is an open question.</p>' : '') +
      '</div>';
    return shell("create", body);
  }

  function renderAdvisors() {
    const extra = DIR === "c"
      ? '<div class="banner info" style="margin-bottom:12px">You can schedule or send to these advisors from <strong>Schedule &amp; send</strong>. Other firms\' advisors stay hidden.</div>'
      : '<div class="banner info" style="margin-bottom:12px"><strong>Read-only list in v1 (Directions A &amp; B).</strong> You see who receives your content. Scheduling and sending stay with FTT / the advisor — open question for later.</div>';
    const rows = ADVISORS.map((a) =>
      '<tr><td><strong>' + a.name + '</strong></td><td>' + a.firm + '</td><td class="small">' + a.email + '</td><td><span class="chip fsb">fsb-content</span></td></tr>'
    ).join("");
    const body = '<h2>My FSB advisors</h2><p class="sub">Only advisors whose AdvisorSource is <code>fsb-content</code>.</p>' + extra +
      '<table class="tbl"><thead><tr><th>Advisor</th><th>Firm</th><th>Email</th><th>Source</th></tr></thead><tbody>' + rows + '</tbody></table>';
    return shell("advisors", body);
  }

  function renderSchedule() {
    const body = '<h2>Schedule &amp; send</h2><p class="sub">Direction C only — light partner MAP for FSB advisors.</p>' +
      '<div class="banner warn">Open question for Alex: should FSB schedule/send in v1, or stay write-only (A/B)?</div>' +
      '<div class="toolbar"><select class="search"><option>Pick FSB advisor…</option><option>Priya Desai</option><option>Marcus Lee</option></select>' +
      '<select class="search"><option>TFSA tips for new parents</option><option>Market update…</option></select>' +
      '<button type="button" class="btn pri" data-toast="Scheduled for Priya · Oct 12 (mock)">Schedule website + email</button></div>' +
      '<table class="tbl"><thead><tr><th>Advisor</th><th>Item</th><th>When</th><th>Channels</th></tr></thead><tbody>' +
      '<tr><td>Priya Desai</td><td>TFSA tips for new parents</td><td>Oct 12, 9:00 PT</td><td>Website, Email</td></tr>' +
      '<tr><td>Marcus Lee</td><td>Market update: October</td><td>Oct 14, 8:30 PT</td><td>Email</td></tr>' +
      '</tbody></table>';
    return shell("schedule", body);
  }

  function renderHidden() {
    const body = '<div class="deny-panel"><div style="font-size:40px;margin-bottom:8px">🔒</div>' +
      '<h3>Not available for your account</h3>' +
      '<p>Billing, global settings, Manage Advisor Posts for all advisors, and other content sources stay with FinancialContent staff. Your role is scoped to FSB content and FSB advisors only.</p>' +
      '<p class="small muted">UI hiding is not enough — the server must deny these methods and publications for <code>admin-fsb</code>.</p>' +
      '<button type="button" class="btn pri" data-go="library">Back to FSB library</button></div>';
    return shell("hidden", body);
  }

  function renderFttUsers() {
    const body = '<h2>Admin users</h2><p class="sub">FTT creates <code>admin-fsb</code> accounts. Full <code>admin</code> is unchanged.</p>' +
      '<div class="banner info">New role option: <strong>FSB partner (admin-fsb)</strong>. Not full admin — scoped to source <code>fsb-content</code>.</div>' +
      '<div class="two-col">' +
      '<div class="form" style="border:1px solid var(--border);border-radius:10px;padding:14px">' +
      '<strong style="display:block;margin-bottom:10px">Create FSB partner login</strong>' +
      '<div class="field"><label>Name</label><input value="Riley Khan" /></div>' +
      '<div class="field"><label>Email</label><input value="riley.khan@fsb-partner.example" /></div>' +
      '<div class="field"><label>Role</label><select><option>FSB partner (admin-fsb)</option><option>Admin (full)</option><option>Support</option></select></div>' +
      '<div class="field"><label>Scoped source</label><div class="locked"><span class="chip fsb lock">FSB-Content · fsb-content</span></div></div>' +
      '<button type="button" class="btn pri" data-toast="Invite sent (mock)">Create &amp; send invite</button></div>' +
      '<div><strong style="display:block;margin-bottom:10px">Existing partner logins</strong>' +
      '<table class="tbl"><thead><tr><th>Person</th><th>Role</th><th>Source</th></tr></thead><tbody>' +
      '<tr><td>Riley Khan</td><td><span class="chip fsb">admin-fsb</span></td><td>fsb-content</td></tr>' +
      '<tr><td>Casey Nguyen</td><td><span class="chip fsb">admin-fsb</span></td><td>fsb-content</td></tr>' +
      '</tbody></table>' +
      '<p class="small muted" style="margin-top:10px">Open question: can FSB invite more of their own staff, or only FTT?</p></div></div>';
    return '<div class="app' + (phone ? ' phone' : '') + '">' + fttTopbar() + '<div class="page">' + body + '</div></div>';
  }

  function renderFttReview() {
    const pending = DIR === "b"
      ? '<div class="banner ok">Direction B: FSB publishes directly. FTT watches a feed and can <strong>Unpublish</strong>.</div>'
      : '<div class="banner warn"><strong>2 FSB items waiting for review.</strong> Approve → advisors with fsb-content see them. Reject → stays with FSB as draft.</div>';
    const rows = DIR === "b"
      ? '<tr><td>Bond ladder basics</td><td>Riley Khan</td><td>Sep 20</td><td><span class="chip err">Unpublished</span></td><td><button type="button" class="btn sm" data-toast="Re-published (mock)">Re-publish</button></td></tr>' +
        '<tr><td>TFSA tips for new parents</td><td>Riley Khan</td><td>Oct 3</td><td><span class="chip ok">Live</span></td><td><button type="button" class="btn sm danger" data-toast="Unpublished (mock)">Unpublish</button></td></tr>'
      : '<tr><td>RRSP contribution room for 2026</td><td>Riley Khan</td><td>Oct 7</td><td><span class="chip warn">Pending</span></td><td><button type="button" class="btn sm pri" data-toast="Approved — live for FSB advisors">Approve</button> <button type="button" class="btn sm" data-toast="Returned to FSB as draft">Reject</button></td></tr>' +
        '<tr><td>Estate planning checklist</td><td>Casey Nguyen</td><td>Oct 6</td><td><span class="chip warn">Pending</span></td><td><button type="button" class="btn sm pri" data-toast="Approved">Approve</button> <button type="button" class="btn sm">Reject</button></td></tr>' +
        '<tr><td>TFSA tips for new parents</td><td>Riley Khan</td><td>Oct 3</td><td><span class="chip ok">Live</span></td><td><button type="button" class="btn sm danger" data-toast="Unpublished">Unpublish</button></td></tr>';
    const body = '<h2>FSB submissions</h2><p class="sub">What FTT sees for partner-authored content. Full admin library still shows all sources.</p>' +
      pending +
      '<table class="tbl"><thead><tr><th>Title</th><th>Author</th><th>Submitted</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';
    return '<div class="app' + (phone ? ' phone' : '') + '">' + fttTopbar() + '<div class="page">' + body + '</div></div>';
  }

  const VIEWS = {
    login: { note: "FSB partner signs in. Landing is the scoped library — never full admin home.", render: renderLogin },
    library: { note: "Scoped Content Library. Header shows <b>FSB partner</b> + <b>Showing FSB content only</b>. Source chip is locked.", render: renderLibrary },
    create: { note: "Create flow: website post, email to the user, featured image. Server auto-tags <code>fsb-content</code> and rejects any other source from the client.", render: renderCreate },
    advisors: { note: "Advisor list/picker scoped to advisors whose AdvisorSource is <code>fsb-content</code> (Prefs.advisorCategories).", render: renderAdvisors },
    schedule: { note: "Direction C only: light schedule/send to FSB advisors. A/B keep this out of v1.", render: renderSchedule },
    hidden: { note: "MAP for all advisors, billing, global settings, other sources — absent or blocked. Server must deny, not just hide.", render: renderHidden },
    ftt_users: { note: "FTT admin: create <code>admin-fsb</code> users with locked source scope. Full admin role unchanged.", render: renderFttUsers },
    ftt_review: { note: DIR === "b" ? "FTT feed of FSB items with Unpublish." : "FTT review queue before FSB content reaches advisors (recommended in A).", render: renderFttReview }
  };

  function apply() {
    const v = VIEWS[state.screen] || VIEWS.library;
    if (noteEl) noteEl.innerHTML = v.note;
    stage.innerHTML = v.render();
    document.querySelectorAll(".demo-btn").forEach((b) => {
      b.classList.toggle("on", b.getAttribute("data-view") === state.screen || (b.getAttribute("data-view") === "__phone" && phone));
    });
  }

  function go(screen) {
    if (screen === "schedule" && DIR !== "c") {
      state.screen = "hidden";
    } else {
      state.screen = screen;
    }
    apply();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go]");
    if (btn) { e.preventDefault(); go(btn.getAttribute("data-go")); return; }
    const t = e.target.closest("[data-toast]");
    if (t) { e.preventDefault(); toast(t.getAttribute("data-toast")); return; }
    const demo = e.target.closest(".demo-btn");
    if (!demo) return;
    const view = demo.getAttribute("data-view");
    if (view === "__phone") { phone = !phone; apply(); return; }
    if (view === "__reset") { phone = false; state = { screen: "login" }; apply(); return; }
    if (VIEWS[view]) { state.screen = view; apply(); }
  });

  // hash support e.g. #library
  const hash = (location.hash || "").replace(/^#/, "");
  if (hash && VIEWS[hash]) state.screen = hash;
  apply();
})();

/**
 * #149 Direction B — Import from Mailchimp modal on Email Campaigns → Subscribers
 * Entry: /content-library/email-campaigns (Subscribers tab)
 */
(function () {
  const AUDIENCES = [
    { id: 'nl', name: 'Newsletter', count: 1248 },
    { id: 'c24', name: 'Clients 2024', count: 862 },
    { id: 'rsvp', name: 'Event RSVPs', count: 214 },
  ];

  const CAMPAIGNS = [
    {
      name: 'Recession-proof your portfolio',
      subject: 'Here’s how we’re navigating markets in 2026',
      list: 'Financial Tech Tools - Internal · 5 subscribers',
      status: 'draft',
      links: 'ok',
      compliance: null,
      approval: null,
      sent: 0, opens: 0, clicks: 0,
      created: 'Sep 11, 2026, 01:49 PM',
    },
    {
      name: 'Email: Honoring Account (FHSA)',
      subject: 'You should know about the FHSA',
      list: 'Clients 2024 · 12 subscribers',
      status: 'draft',
      links: 'ok',
      compliance: 'pending',
      approval: null,
      sent: 0, opens: 0, clicks: 0,
      created: 'Sep 9, 2026, 10:22 AM',
    },
    {
      name: 'Company status update',
      subject: 'Q3 note from the desk',
      list: 'Financial Tech Tools - Internal · 5 subscribers',
      status: 'draft',
      links: 'ok',
      compliance: null,
      approval: 'failed',
      sent: 0, opens: 0, clicks: 0,
      created: 'Aug 28, 2026, 03:05 PM',
    },
    {
      name: 'Weekly market brief',
      subject: 'What moved markets this week',
      list: 'Newsletter · 48 subscribers',
      status: 'draft',
      links: 'ok',
      compliance: null,
      approval: null,
      sent: 0, opens: 0, clicks: 0,
      created: 'Aug 15, 2026, 09:12 AM',
    },
    {
      name: 'Event RSVP reminder',
      subject: 'You’re invited — client appreciation night',
      list: 'Event RSVPs · 8 subscribers',
      status: 'draft',
      links: 'ok',
      compliance: null,
      approval: null,
      sent: 0, opens: 0, clicks: 0,
      created: 'Jul 30, 2026, 04:40 PM',
    },
  ];

  /* Seed rows inspired by staging Subscribers screenshot; pad to 192 */
  const SUB_SEED = [
    { email: 'thomas.anderson@example.com', name: 'Thomas Anderson', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['High net worth — handle with care', 'From Outlook'] },
    { email: 'kendall.garcia175@example-mail.test', name: 'Kendall Garcia', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['Referred by Jane Doe', 'Client'] },
    { email: 'lisa.nguyen@example.com', name: 'Lisa Nguyen', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['Tax', 'Client', 'Newsletter'] },
    { email: 'marcus.chen@example.com', name: 'Marcus Chen', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['Spanish-speaking client'] },
    { email: 'priya.patel@example.com', name: 'Priya Patel', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['Event Attendee', 'Newsletter'] },
    { email: 'jordan.lee@example.com', name: 'Jordan Lee', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['Client', 'High net worth — handle with care'] },
    { email: 'sam.okafor@example.com', name: 'Sam Okafor', status: 'subscribed', engagement: 'No activity', lists: null, tags: ['From Outlook', 'Tax'] },
    { email: 'emily.ross@example.com', name: 'Emily Ross', status: 'subscribed', engagement: 'No activity', lists: 'Fake List', tags: ['Newsletter', 'Client'] },
    { email: 'daniel.kim@example.com', name: 'Daniel Kim', status: 'subscribed', engagement: 'No activity', lists: 'Fake List', tags: ['Event Attendee'] },
    { email: 'nina.volkov@example.com', name: 'Nina Volkov', status: 'subscribed', engagement: 'No activity', lists: 'Fake List', tags: ['Referred by Jane Doe', 'Spanish-speaking client', 'Client'] },
    { email: 'aaron.blake@example.com', name: 'Aaron Blake', status: 'subscribed', engagement: 'No activity', lists: 'Fake List', tags: ['From Outlook'] },
    { email: 'sofia.martinez@example.com', name: 'Sofia Martinez', status: 'unsubscribed', engagement: 'No activity', lists: null, tags: ['Client'] },
    { email: 'ryan.foster@example.com', name: 'Ryan Foster', status: 'bounced', engagement: 'No activity', lists: null, tags: ['Newsletter'] },
    { email: 'amelia.wright@example.com', name: 'Amelia Wright', status: 'pending', engagement: 'No activity', lists: null, tags: ['Event Attendee', 'Tax'] },
  ];

  const EXTRA_FIRST = ['Alex', 'Blair', 'Casey', 'Dana', 'Eden', 'Finn', 'Gray', 'Harper', 'Indie', 'Jules', 'Kai', 'Lane', 'Morgan', 'Noel', 'Oakley', 'Parker', 'Quinn', 'Reese', 'Sage', 'Taylor', 'Uma', 'Vale', 'Wes', 'Xander', 'Yael', 'Zion'];
  const EXTRA_LAST = ['Adams', 'Baker', 'Clark', 'Diaz', 'Evans', 'Ford', 'Green', 'Hayes', 'Ito', 'Jones', 'Khan', 'Lopez', 'Moore', 'Ng', 'Ortiz', 'Perez', 'Quinn', 'Reed', 'Singh', 'Tran', 'Ueda', 'Voss', 'Wong', 'Xu', 'Young', 'Zhang'];
  const TAG_POOL = [
    ['Client'],
    ['Newsletter'],
    ['Tax', 'Client'],
    ['Event Attendee'],
    ['From Outlook'],
    ['High net worth — handle with care'],
    ['Referred by Jane Doe', 'Client'],
    ['Spanish-speaking client'],
    ['Newsletter', 'Client'],
    ['Tax'],
  ];

  function buildSubscribers(total) {
    const rows = SUB_SEED.map((r) => Object.assign({}, r, { tags: r.tags.slice() }));
    let i = 0;
    while (rows.length < total) {
      const fn = EXTRA_FIRST[i % EXTRA_FIRST.length];
      const ln = EXTRA_LAST[Math.floor(i / EXTRA_FIRST.length) % EXTRA_LAST.length];
      const n = i + 1;
      const statuses = ['subscribed', 'subscribed', 'subscribed', 'subscribed', 'unsubscribed', 'pending', 'bounced'];
      rows.push({
        email: (fn + '.' + ln + n + '@example-mail.test').toLowerCase(),
        name: fn + ' ' + ln,
        status: statuses[i % statuses.length],
        engagement: 'No activity',
        lists: i % 7 === 0 ? 'Fake List' : null,
        tags: TAG_POOL[i % TAG_POOL.length].slice(),
      });
      i += 1;
    }
    return rows;
  }

  const SUBSCRIBERS = buildSubscribers(192);
  const VISIBLE_ROWS = 24; // dense scrollable backdrop; count chip = 192

  const KEY = 'fc149_b_lists';
  const KEY_CONN = 'fc149_b_conn'; // 'ok' | 'bad'

  function getLists() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [
      { id: 'active', name: 'Active clients', count: 412, source: 'FTT Mail' },
      { id: 'archive', name: 'Newsletter archive', count: 890, source: 'FTT Mail' },
    ];
  }
  function saveLists(lists) {
    sessionStorage.setItem(KEY, JSON.stringify(lists));
  }
  function connOk() {
    return sessionStorage.getItem(KEY_CONN) !== 'bad';
  }
  function setConn(ok) {
    sessionStorage.setItem(KEY_CONN, ok ? 'ok' : 'bad');
    syncConnUI();
  }

  /* ---- Render campaigns table ---- */
  function actionIcons() {
    const icons = [
      ['Edit', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z'],
      ['Design', 'M12 2l3 7h7l-5.5 4.5L19 22l-7-4-7 4 2.5-8.5L2 9h7z'],
      ['Send', 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z'],
      ['PDF', 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'],
      ['Code', 'M16 18l6-6-6-6M8 6l-6 6 6 6'],
      ['Duplicate', 'M8 8h12v12H8zM4 4h12v4'],
    ];
    let html = icons
      .map(
        ([t, d]) =>
          `<button type="button" class="icon-btn" title="${t}" aria-label="${t}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="${d}"/></svg></button>`
      )
      .join('');
    html +=
      '<button type="button" class="icon-btn danger" title="Delete" aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg></button>';
    return html;
  }

  function pill(kind, label) {
    if (!kind) return '<span class="dash">—</span>';
    const map = {
      draft: ['draft', 'draft'],
      ok: ['ok', '✓ OK'],
      pending: ['warn', 'Pending confirmation'],
      failed: ['err', 'Failed'],
    };
    const [cls, text] = map[kind] || ['draft', label || kind];
    return `<span class="pill ${cls}">${text}</span>`;
  }

  function statusPill(status) {
    const map = {
      subscribed: ['ok', 'subscribed'],
      unsubscribed: ['draft', 'unsubscribed'],
      bounced: ['err', 'bounced'],
      pending: ['warn', 'pending'],
    };
    const [cls, text] = map[status] || ['draft', status];
    return `<span class="pill ${cls}">${text}</span>`;
  }

  function engagePill(label) {
    return `<span class="pill draft">${label || 'No activity'}</span>`;
  }

  function listCell(list) {
    if (!list) return '<span class="dash">—</span>';
    return `<span class="pill draft">${list}</span>`;
  }

  function tagsCell(tags) {
    if (!tags || !tags.length) return '<span class="dash">—</span>';
    const max = 2;
    const shown = tags.slice(0, max);
    const more = tags.length - shown.length;
    let html = shown.map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('');
    if (more > 0) html += `<span class="tag-more">+${more}</span>`;
    return `<div class="tags">${html}</div>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function subActionIcons() {
    return (
      '<div class="sub-actions">' +
      '<button type="button" class="icon-btn" title="Edit" aria-label="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></button>' +
      '<button type="button" class="icon-btn danger" title="Delete" aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg></button>' +
      '</div>'
    );
  }

  function renderCampaigns() {
    const tb = document.getElementById('campaignRows');
    if (!tb) return;
    tb.innerHTML = CAMPAIGNS.map(
      (c) => `<tr>
        <td><div class="camp-name">${c.name}</div><div class="camp-meta">List: ${c.list}</div></td>
        <td>${c.subject}</td>
        <td>${pill(c.status)}</td>
        <td>${pill(c.links)}</td>
        <td>${pill(c.compliance)}</td>
        <td>${pill(c.approval)}</td>
        <td class="num">${c.sent}</td>
        <td class="num">${c.opens}</td>
        <td class="num">${c.clicks}</td>
        <td class="created">${c.created}</td>
        <td><div class="actions">${actionIcons()}</div></td>
      </tr>`
    ).join('');
  }

  function renderSubscribers() {
    const tb = document.getElementById('subscriberRows');
    const label = document.getElementById('subCountLabel');
    if (label) label.textContent = SUBSCRIBERS.length.toLocaleString() + ' contacts';
    if (!tb) return;
    const rows = SUBSCRIBERS.slice(0, VISIBLE_ROWS);
    tb.innerHTML = rows
      .map(
        (s) => `<tr>
        <td class="col-check"><input type="checkbox" aria-label="Select ${escapeHtml(s.email)}" /></td>
        <td class="email-cell">${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${statusPill(s.status)}</td>
        <td>${engagePill(s.engagement)}</td>
        <td>${listCell(s.lists)}</td>
        <td>${tagsCell(s.tags)}</td>
        <td>${subActionIcons()}</td>
      </tr>`
      )
      .join('');
    if (SUBSCRIBERS.length > VISIBLE_ROWS) {
      tb.insertAdjacentHTML(
        'beforeend',
        `<tr class="more-row"><td colspan="8" class="muted">Showing ${VISIBLE_ROWS} of ${SUBSCRIBERS.length.toLocaleString()} contacts (staging density)</td></tr>`
      );
    }
  }

  function renderLists() {
    const grid = document.getElementById('listsGrid');
    const chip = document.getElementById('listCountChip');
    const lists = getLists();
    if (chip) {
      chip.textContent = lists.length + ' list' + (lists.length === 1 ? '' : 's');
      chip.classList.remove('bump');
      void chip.offsetWidth;
      chip.classList.add('bump');
    }
    if (!grid) return;
    grid.innerHTML = lists
      .map(
        (l) => `<div class="list-card">
        <h3>${l.name}</h3>
        <div class="count">${l.count.toLocaleString()}</div>
        <div class="src">${l.source || 'FTT Mail'}</div>
        <div class="actions-row">
          <button type="button" class="btn btn-sm btn-outline refresh-btn" data-id="${l.id}">Refresh from Mailchimp</button>
        </div>
      </div>`
      )
      .join('');
    grid.querySelectorAll('.refresh-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        alert('Secondary: Refresh from Mailchimp (not fully implemented in mock).');
      });
    });
  }

  function renderAudiences() {
    const box = document.getElementById('audienceList');
    if (!box) return;
    box.innerHTML = AUDIENCES.map(
      (a, i) => `<label class="row-check${i === 0 ? ' sel' : ''}">
        <input type="checkbox" class="aud-cb" value="${a.id}" ${i === 0 ? 'checked' : ''} />
        <span><span class="aud-name">${a.name}</span><br/><span class="aud-count">${a.count.toLocaleString()} contacts</span></span>
      </label>`
    ).join('');
    box.querySelectorAll('.row-check').forEach((row) => {
      const input = row.querySelector('input');
      const sync = () => row.classList.toggle('sel', input.checked);
      input.addEventListener('change', sync);
      row.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          input.checked = !input.checked;
          sync();
          updateHints();
        } else sync();
        updateHints();
      });
    });
  }

  function selectedAudiences() {
    return AUDIENCES.filter((a) => {
      const el = document.querySelector('.aud-cb[value="' + a.id + '"]');
      return el && el.checked;
    });
  }

  function estimate(selected) {
    const total = selected.reduce((s, a) => s + a.count, 0);
    const imported = Math.round(total * 0.951);
    const skipped = Math.round(total * 0.042);
    const errors = Math.max(0, total - imported - skipped);
    return { total, imported, skipped, errors };
  }

  function updateHints() {
    const hint = document.getElementById('newListHint');
    if (!hint) return;
    const sel = selectedAudiences();
    if (!sel.length) hint.textContent = 'Named after the Mailchimp audience(s) you selected.';
    else if (sel.length === 1) hint.textContent = 'Will create list “' + sel[0].name + '”.';
    else hint.textContent = 'Will create lists: ' + sel.map((a) => '“' + a.name + '”').join(', ') + '.';
  }

  function syncTargetRadios() {
    document.querySelectorAll('.radio-block label').forEach((lab) => {
      const input = lab.querySelector('input[type="radio"]');
      if (input) lab.classList.toggle('sel', input.checked);
    });
    const mode = document.querySelector('input[name="target"]:checked');
    const sel = document.getElementById('existingList');
    if (sel && mode) sel.disabled = mode.value !== 'existing';
  }

  /* ---- Tabs ---- */
  function switchTab(name) {
    document.querySelectorAll('.tab').forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    document.querySelectorAll('.panel').forEach((p) => {
      const on = p.id === 'panel-' + name;
      p.classList.toggle('active', on);
      if (on) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    if (name === 'lists') renderLists();
    if (name === 'subscribers') renderSubscribers();
  }

  /* ---- Modal ---- */
  let step = 1;
  let progressTimer = null;
  const modal = document.getElementById('modal');
  const dots = () => [...document.querySelectorAll('#dots .dot')];

  function openModal(forceErr) {
    if (!connOk() || forceErr) {
      showStep('err');
      modal.classList.remove('hidden');
      return;
    }
    showStep(1);
    modal.classList.remove('hidden');
  }
  function closeModal() {
    modal.classList.add('hidden');
    if (progressTimer) clearInterval(progressTimer);
  }

  function showStep(n) {
    step = n;
    document.querySelectorAll('.step').forEach((el) => {
      const match = el.dataset.s === String(n);
      el.classList.toggle('active', match);
    });
    const isErr = n === 'err';
    document.getElementById('dots').style.display = isErr ? 'none' : 'flex';
    document.getElementById('modalFt').style.display = isErr ? 'none' : 'flex';
    if (!isErr) {
      const idx = +n;
      dots().forEach((d, i) => {
        d.classList.toggle('on', i + 1 === idx);
        d.classList.toggle('done', i + 1 < idx);
      });
      const back = document.getElementById('backBtn');
      const next = document.getElementById('nextBtn');
      back.disabled = idx === 1 || idx === 3;
      next.disabled = idx === 3;
      if (idx === 1) next.textContent = 'Continue';
      else if (idx === 2) next.textContent = 'Start import';
      else if (idx === 3) next.textContent = 'Working…';
      else if (idx === 4) next.textContent = 'Done';
      if (idx === 2) {
        updateHints();
        syncTargetRadios();
      }
      if (idx === 3) runProgress();
    }
  }

  function runProgress() {
    const sel = selectedAudiences();
    const label = document.getElementById('progressLabel');
    label.textContent =
      sel.length === 1
        ? 'Importing “' + sel[0].name + '”…'
        : 'Importing ' + sel.length + ' audiences…';
    const bar = document.getElementById('bar');
    const pct = document.getElementById('pct');
    bar.style.width = '0%';
    let w = 0;
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      w = Math.min(100, w + 8 + Math.random() * 14);
      bar.style.width = w + '%';
      pct.textContent = Math.round(w) + '%';
      if (w >= 100) {
        clearInterval(progressTimer);
        progressTimer = null;
        finishImport(sel);
        setTimeout(() => showStep(4), 280);
      }
    }, 220);
  }

  function finishImport(sel) {
    const stats = estimate(sel.length ? sel : [AUDIENCES[0]]);
    document.getElementById('statImported').textContent = stats.imported.toLocaleString();
    document.getElementById('statSkipped').textContent = stats.skipped.toLocaleString();
    document.getElementById('statErrors').textContent = stats.errors.toLocaleString();

    const mode = document.querySelector('input[name="target"]:checked');
    const lists = getLists();
    let note = '';
    if (!mode || mode.value === 'new') {
      (sel.length ? sel : [AUDIENCES[0]]).forEach((a) => {
        const est = estimate([a]);
        const existing = lists.find((l) => l.name === a.name);
        if (existing) existing.count = est.imported;
        else
          lists.push({
            id: 'mc-' + a.id,
            name: a.name,
            count: est.imported,
            source: 'Imported from Mailchimp',
          });
      });
      note =
        sel.length === 1
          ? 'List “' + sel[0].name + '” · ' + stats.imported.toLocaleString() + ' members'
          : 'Created ' + sel.length + ' lists · ' + stats.imported.toLocaleString() + ' members total';
    } else {
      const selEl = document.getElementById('existingList');
      const id = selEl.value;
      const target = lists.find((l) => l.id === id);
      if (target) {
        target.count += stats.imported;
        note =
          'Added to “' +
          target.name +
          '” · now ' +
          target.count.toLocaleString() +
          ' members';
      }
    }
    saveLists(lists);
    document.getElementById('summaryNote').textContent = note;
  }

  function applyImportDone() {
    closeModal();
    switchTab('lists');
    renderLists();
  }

  function syncConnUI() {
    const ok = connOk();
    const chip = document.getElementById('connChip');
    const banner = document.getElementById('keyBanner');
    if (chip) {
      chip.textContent = ok
        ? '● Mailchimp · Jordan Lee, CFP'
        : '● Mailchimp disconnected';
      chip.style.background = ok ? '' : '#fdecea';
      chip.style.color = ok ? '' : '#c62828';
    }
    if (banner) banner.classList.toggle('show', !ok);
  }

  /* ---- Wire up ---- */
  function init() {
    renderCampaigns();
    renderAudiences();
    renderLists();
    renderSubscribers();
    syncConnUI();
    updateHints();

    document.querySelectorAll('.tab').forEach((t) => {
      t.addEventListener('click', () => switchTab(t.dataset.tab));
    });

    const openers = ['importSubscribersBtn', 'demoSubsImport'];
    openers.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', () => {
        if (id === 'demoSubsImport') switchTab('subscribers');
        openModal();
      });
    });

    document.getElementById('closeModal').onclick = closeModal;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.getElementById('backBtn').onclick = () => {
      if (step === 2) showStep(1);
      else if (step === 4) showStep(2);
    };
    document.getElementById('nextBtn').onclick = () => {
      if (step === 1) {
        if (!selectedAudiences().length) {
          alert('Select at least one audience.');
          return;
        }
        showStep(2);
      } else if (step === 2) showStep(3);
      else if (step === 4) applyImportDone();
    };

    document.querySelectorAll('input[name="target"]').forEach((r) => {
      r.addEventListener('change', syncTargetRadios);
    });

    document.getElementById('demoBadKey').onclick = () => {
      setConn(false);
      openModal(true);
    };
    document.getElementById('demoResetKey').onclick = () => setConn(true);
    document.getElementById('bannerReconnect').onclick = () => setConn(true);
    document.getElementById('modalReconnect').onclick = () => {
      setConn(true);
      showStep(1);
    };
    document.getElementById('settingsReconnect').onclick = () => setConn(true);

    const createCampaign = document.getElementById('createCampaign');
    if (createCampaign) {
      createCampaign.onclick = () => {
        alert('Create Campaign — staging action (not in #149 scope).');
      };
    }
    const addContact = document.getElementById('addContact');
    if (addContact) {
      addContact.onclick = () => {
        alert('Add Contact — staging action (not in #149 scope).');
      };
    }
    const importCsv = document.getElementById('importCsvBtn');
    if (importCsv) {
      importCsv.onclick = () => {
        alert('Import CSV — staging action (not in #149 scope).');
      };
    }
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.onclick = () => {
        alert('Export — staging action (not in #149 scope).');
      };
    }

    // Default: Subscribers tab. URL helpers.
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'lists') switchTab('lists');
    else if (tab === 'campaigns') switchTab('campaigns');
    else switchTab('subscribers');
    if (params.get('error') === '1') {
      setConn(false);
      openModal(true);
    }
    if (params.get('open') === '1') openModal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

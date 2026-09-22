/**
 * #149 Direction B — Import from Mailchimp modal on Email Campaigns page
 * Entry: /content-library/email-campaigns
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
    syncConnUI();
    updateHints();

    document.querySelectorAll('.tab').forEach((t) => {
      t.addEventListener('click', () => switchTab(t.dataset.tab));
    });

    const openers = [
      'importCampaignsBtn',
      'importListsBtn',
      'overflowImport',
      'demoListsImport',
    ];
    openers.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', () => {
        if (id === 'demoListsImport' || id === 'importListsBtn') switchTab('lists');
        document.getElementById('overflowMenu').classList.remove('open');
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

    document.getElementById('overflowBtn').onclick = (e) => {
      e.stopPropagation();
      document.getElementById('overflowMenu').classList.toggle('open');
    };
    document.addEventListener('click', () => {
      document.getElementById('overflowMenu').classList.remove('open');
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

    document.getElementById('createCampaign').onclick = () => {
      alert('Create Campaign — staging action (not in #149 scope).');
    };

    // URL helpers
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'lists') switchTab('lists');
    if (params.get('error') === '1') {
      setConn(false);
      openModal(true);
    }
    if (params.get('open') === '1') openModal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

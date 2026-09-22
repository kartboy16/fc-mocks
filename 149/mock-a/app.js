/**
 * FTT Mail — Import from Mailchimp (#149) mock-a
 * Fake progress; persists list bump in sessionStorage.
 */
(function () {
  const AUDIENCES = [
    { id: 'nl', name: 'Newsletter', count: 1248 },
    { id: 'c24', name: 'Clients 2024', count: 862 },
    { id: 'rsvp', name: 'Event RSVPs', count: 214 },
  ];

  const EXISTING_LISTS = [
    { id: 'active', name: 'Active clients', count: 412 },
    { id: 'archive', name: 'Newsletter archive', count: 890 },
  ];

  function getLists() {
    try {
      const raw = sessionStorage.getItem('fc149_lists');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [
      { id: 'active', name: 'Active clients', count: 412, source: 'FTT Mail' },
      { id: 'archive', name: 'Newsletter archive', count: 890, source: 'FTT Mail' },
    ];
  }

  function saveLists(lists) {
    sessionStorage.setItem('fc149_lists', JSON.stringify(lists));
  }

  function getSelectedAudiences() {
    return AUDIENCES.filter((a) => {
      const el = document.querySelector('.aud-cb[value="' + a.id + '"]');
      return el && el.checked;
    });
  }

  function estimateImport(selected) {
    const total = selected.reduce((s, a) => s + a.count, 0);
    // Fake split: ~95% imported, ~4% skipped (FTT wins), ~1% errors
    const imported = Math.round(total * 0.951);
    const skipped = Math.round(total * 0.042);
    const errors = Math.max(0, total - imported - skipped);
    return { total, imported, skipped, errors };
  }

  function syncCheckRows() {
    document.querySelectorAll('.row-check').forEach((row) => {
      const input = row.querySelector('input[type="checkbox"], input[type="radio"]');
      if (input) row.classList.toggle('sel', input.checked);
    });
    document.querySelectorAll('.radio-block label').forEach((lab) => {
      const input = lab.querySelector('input[type="radio"]');
      if (input) lab.classList.toggle('sel', input.checked);
    });
  }

  function updateExistingSelect() {
    const mode = document.querySelector('input[name="target"]:checked');
    const sel = document.getElementById('existingList');
    if (!sel || !mode) return;
    sel.disabled = mode.value !== 'existing';
  }

  function updateNameHints() {
    const hint = document.getElementById('newListHint');
    if (!hint) return;
    const sel = getSelectedAudiences();
    if (!sel.length) {
      hint.textContent = 'Named after the Mailchimp audience(s) you selected.';
      return;
    }
    hint.textContent =
      sel.length === 1
        ? 'Will create list “' + sel[0].name + '”.'
        : 'Will create lists: ' + sel.map((a) => '“' + a.name + '”').join(', ') + '.';
  }

  /* ---- Hub (index.html) ---- */
  function initHub() {
    const tbody = document.getElementById('listsBody');
    if (!tbody) return;
    const lists = getLists();
    const bumped = sessionStorage.getItem('fc149_bumped');
    tbody.innerHTML = lists
      .map((l) => {
        const bumpClass = bumped && bumped.split(',').includes(l.id) ? ' bump' : '';
        return (
          '<tr><td><strong>' +
          l.name +
          '</strong></td><td class="' +
          bumpClass.trim() +
          '" data-count="' +
          l.id +
          '">' +
          l.count.toLocaleString() +
          '</td><td>' +
          (l.source || 'FTT Mail') +
          '</td><td><button type="button" class="btn btn-ghost btn-sm refresh-btn" data-id="' +
          l.id +
          '" title="Secondary action">Refresh from Mailchimp</button></td></tr>'
        );
      })
      .join('');
    if (bumped) {
      setTimeout(() => sessionStorage.removeItem('fc149_bumped'), 2000);
    }
    tbody.querySelectorAll('.refresh-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        alert(
          'Secondary action (DEFAULT): Refresh from Mailchimp would re-pull this list without replacing the primary one-shot import flow. Out of scope for this mock beyond the CTA.'
        );
      });
    });

    const connBadge = document.getElementById('connBadge');
    const demoErr = new URLSearchParams(location.search).get('error');
    if (demoErr === '1' && connBadge) {
      connBadge.className = 'badge err';
      connBadge.textContent = '● Mailchimp key invalid';
    }
  }

  /* ---- Wizard ---- */
  let step = 1;
  let progressTimer = null;

  function setStep(n) {
    step = n;
    document.querySelectorAll('.wizard-step').forEach((p) => {
      p.classList.toggle('hidden', +p.dataset.step !== n);
    });
    document.querySelectorAll('.step-pill').forEach((p) => {
      const g = +p.dataset.go;
      p.classList.toggle('on', g === n);
      p.classList.toggle('done', g < n);
    });
    const back = document.getElementById('btnBack');
    const next = document.getElementById('btnNext');
    if (back) {
      back.disabled = n === 1 || n === 4;
      back.classList.toggle('hidden', n === 5);
    }
    const cancel = document.getElementById('btnCancel');
    if (cancel) {
      if (n === 5) {
        cancel.textContent = 'Import another';
        cancel.setAttribute('href', 'wizard.html');
      } else if (n === 4) {
        cancel.style.visibility = 'hidden';
      } else {
        cancel.textContent = 'Cancel';
        cancel.setAttribute('href', 'index.html');
        cancel.style.visibility = 'visible';
      }
      if (n !== 4) cancel.style.visibility = 'visible';
    }
    if (next) {
      next.classList.toggle('hidden', false);
      if (n === 5) {
        next.textContent = 'Done — view lists';
        next.disabled = false;
      } else if (n === 4) {
        next.textContent = 'Importing…';
        next.disabled = true;
      } else if (n === 3) {
        next.textContent = 'Start import';
        next.disabled = false;
      } else {
        next.textContent = 'Continue';
        next.disabled = false;
      }
    }
    if (n === 2) updateNameHints();
    if (n === 3) {
      updateNameHints();
      updateExistingSelect();
      syncCheckRows();
    }
    if (n === 4) runProgress();
    if (n === 5) renderSummary();
  }

  function canLeaveStep(from) {
    if (from === 2) {
      const sel = getSelectedAudiences();
      if (!sel.length) {
        alert('Select at least one Mailchimp audience.');
        return false;
      }
    }
    return true;
  }

  function runProgress() {
    if (progressTimer) clearInterval(progressTimer);
    const bar = document.getElementById('progBar');
    const pct = document.getElementById('progPct');
    const lead = document.getElementById('progLead');
    const sel = getSelectedAudiences();
    const names = sel.map((a) => a.name).join(', ') || 'audiences';
    if (lead) lead.textContent = 'Pulling contacts from Mailchimp (' + names + ') into FTT Mail / SES Contacts…';
    let w = 0;
    if (bar) bar.style.width = '0%';
    progressTimer = setInterval(() => {
      w = Math.min(100, w + 7 + Math.random() * 14);
      if (bar) bar.style.width = w + '%';
      if (pct) pct.textContent = Math.round(w) + '%';
      if (w >= 100) {
        clearInterval(progressTimer);
        progressTimer = null;
        applyListBump();
        setTimeout(() => setStep(5), 450);
      }
    }, 260);
  }

  function applyListBump() {
    const sel = getSelectedAudiences();
    const est = estimateImport(sel);
    const mode = document.querySelector('input[name="target"]:checked');
    const lists = getLists();
    const bumpedIds = [];

    if (!mode || mode.value === 'new') {
      sel.forEach((a) => {
        const per = estimateImport([a]);
        let existing = lists.find((l) => l.name === a.name);
        if (existing) {
          existing.count = per.imported;
          existing.source = 'Mailchimp import';
          bumpedIds.push(existing.id);
        } else {
          const id = 'mc_' + a.id;
          lists.push({
            id,
            name: a.name,
            count: per.imported,
            source: 'Mailchimp import',
          });
          bumpedIds.push(id);
        }
      });
    } else {
      const exId = document.getElementById('existingList').value;
      const target = lists.find((l) => l.id === exId);
      if (target) {
        target.count += est.imported;
        target.source = 'Mailchimp import';
        bumpedIds.push(target.id);
      }
    }
    saveLists(lists);
    sessionStorage.setItem('fc149_last_summary', JSON.stringify({ sel, est, mode: mode ? mode.value : 'new' }));
    sessionStorage.setItem('fc149_bumped', bumpedIds.join(','));
  }

  function renderSummary() {
    let data;
    try {
      data = JSON.parse(sessionStorage.getItem('fc149_last_summary') || 'null');
    } catch (_) {
      data = null;
    }
    if (!data) {
      const sel = getSelectedAudiences();
      data = { sel, est: estimateImport(sel), mode: 'new' };
    }
    const { sel, est, mode } = data;
    const elImp = document.getElementById('sImp');
    const elSkip = document.getElementById('sSkip');
    const elErr = document.getElementById('sErr');
    if (elImp) elImp.textContent = est.imported.toLocaleString();
    if (elSkip) elSkip.textContent = est.skipped.toLocaleString();
    if (elErr) elErr.textContent = est.errors.toLocaleString();
    const detail = document.getElementById('summaryDetail');
    if (detail) {
      const names = (sel || []).map((a) => a.name).join(', ');
      if (mode === 'existing') {
        const ex = document.getElementById('existingList');
        const label = ex ? ex.options[ex.selectedIndex].text : 'existing list';
        detail.innerHTML =
          'Added to <strong>' +
          label +
          '</strong> from <strong>' +
          names +
          '</strong>. Skipped contacts kept local unsubscribe/bounce status (FTT Mail wins).';
      } else {
        detail.innerHTML =
          'Created list(s) named after Mailchimp audience(s): <strong>' +
          names +
          '</strong>. Member counts updated on the hub.';
      }
    }
  }

  function initWizard() {
    if (!document.getElementById('wizard')) return;

    // Populate existing list select
    const sel = document.getElementById('existingList');
    if (sel && !sel.options.length) {
      getLists().forEach((l) => {
        const o = document.createElement('option');
        o.value = l.id;
        o.textContent = l.name + ' (' + l.count.toLocaleString() + ')';
        sel.appendChild(o);
      });
    }

    document.querySelectorAll('.aud-cb').forEach((cb) => {
      cb.addEventListener('change', () => {
        syncCheckRows();
        updateNameHints();
      });
    });
    document.querySelectorAll('input[name="target"]').forEach((r) => {
      r.addEventListener('change', () => {
        syncCheckRows();
        updateExistingSelect();
      });
    });

    document.getElementById('btnNext')?.addEventListener('click', () => {
      if (step === 5) {
        location.href = 'index.html';
        return;
      }
      if (!canLeaveStep(step)) return;
      setStep(Math.min(5, step + 1));
    });
    document.getElementById('btnBack')?.addEventListener('click', () => {
      if (step === 4) return;
      setStep(Math.max(1, step - 1));
    });
    document.querySelectorAll('.step-pill').forEach((p) => {
      p.addEventListener('click', () => {
        const g = +p.dataset.go;
        if (g < step || g === step) setStep(g);
        else if (g === step + 1 && canLeaveStep(step)) setStep(g);
      });
    });

    syncCheckRows();
    updateExistingSelect();
    setStep(1);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHub();
    initWizard();
  });
})();

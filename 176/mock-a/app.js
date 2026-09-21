/**
 * FC #176 Mock A — Searchable grouped checklist
 * Master Categories allowlist only. Selected categories ARE the services.
 */
(function () {
  const TREE = [
    { group: 'Insurance', items: ['life insurance', 'critical illness', 'disability', 'annuities'] },
    { group: 'Audience', items: ['family', 'business'] },
    { group: 'Wealth', items: ['retirement', 'investments', 'estate planning'] },
    { group: 'Tax', items: ['tax planning'] },
  ];

  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || 'empty'; // empty | edit

  const selected = new Set(
    mode === 'edit' ? ['life insurance', 'retirement'] : []
  );

  const els = {
    groups: document.getElementById('groups'),
    search: document.getElementById('search'),
    count: document.getElementById('count'),
    save: document.getElementById('save'),
    saveSticky: document.getElementById('saveSticky'),
    chips: document.getElementById('chips'),
    toast: document.getElementById('toast'),
    scanBtn: document.getElementById('scanBtn'),
    scanNote: document.getElementById('scanNote'),
    dismissScan: document.getElementById('dismissScan'),
    modeEmpty: document.getElementById('modeEmpty'),
    modeEdit: document.getElementById('modeEdit'),
  };

  function syncModeButtons() {
    if (els.modeEmpty) els.modeEmpty.classList.toggle('active', mode === 'empty');
    if (els.modeEdit) els.modeEdit.classList.toggle('active', mode === 'edit');
  }

  function updateCount() {
    const n = selected.size;
    const label = n + ' selected';
    if (els.count) els.count.textContent = label;
    const stickyCount = document.getElementById('stickyCount');
    if (stickyCount) stickyCount.textContent = label;
    const disabled = n < 1;
    if (els.save) els.save.disabled = disabled;
    if (els.saveSticky) els.saveSticky.disabled = disabled;
  }

  function renderChips() {
    if (!els.chips) return;
    els.chips.innerHTML = '';
    if (!selected.size) {
      els.chips.innerHTML = '<span class="empty">None selected — pick at least one to Save</span>';
      return;
    }
    [...selected].sort().forEach((name) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML =
        name +
        ' <button type="button" aria-label="Remove ' +
        name +
        '">×</button>';
      chip.querySelector('button').addEventListener('click', () => {
        selected.delete(name);
        render(els.search ? els.search.value : '');
      });
      els.chips.appendChild(chip);
    });
  }

  function render(filter) {
    const q = (filter || '').trim().toLowerCase();
    if (!els.groups) return;
    els.groups.innerHTML = '';

    TREE.forEach((g, gi) => {
      const visible = g.items.filter(
        (i) => !q || i.includes(q) || g.group.toLowerCase().includes(q)
      );
      const wrap = document.createElement('div');
      wrap.className = 'group' + (visible.length ? '' : ' hidden');
      wrap.dataset.gi = String(gi);

      const allChecked = visible.length > 0 && visible.every((i) => selected.has(i));
      const head = document.createElement('div');
      head.className = 'group-head';
      head.innerHTML =
        '<label><input type="checkbox" class="select-all" data-gi="' +
        gi +
        '"' +
        (allChecked ? ' checked' : '') +
        ' /> ' +
        g.group +
        '</label><span class="meta">' +
        visible.length +
        ' shown</span>';
      wrap.appendChild(head);

      const itemsEl = document.createElement('div');
      itemsEl.className = 'items';
      g.items.forEach((name) => {
        const show = !q || name.includes(q) || g.group.toLowerCase().includes(q);
        const row = document.createElement('label');
        row.className = 'item' + (show ? '' : ' hidden');
        row.innerHTML =
          '<input type="checkbox" data-name="' +
          name +
          '"' +
          (selected.has(name) ? ' checked' : '') +
          ' /> <span>' +
          name +
          '</span>';
        itemsEl.appendChild(row);
      });
      wrap.appendChild(itemsEl);
      els.groups.appendChild(wrap);
    });

    updateCount();
    renderChips();
  }

  if (els.groups) {
    els.groups.addEventListener('change', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement)) return;

      if (t.classList.contains('select-all')) {
        const gi = Number(t.dataset.gi);
        const q = (els.search && els.search.value.trim().toLowerCase()) || '';
        TREE[gi].items.forEach((name) => {
          const show =
            !q || name.includes(q) || TREE[gi].group.toLowerCase().includes(q);
          if (show) {
            if (t.checked) selected.add(name);
            else selected.delete(name);
          }
        });
        render(els.search ? els.search.value : '');
        return;
      }

      if (t.dataset.name) {
        if (t.checked) selected.add(t.dataset.name);
        else selected.delete(t.dataset.name);
        updateCount();
        renderChips();
        const gi = TREE.findIndex((g) => g.items.includes(t.dataset.name));
        if (gi >= 0) {
          const q = (els.search && els.search.value.trim().toLowerCase()) || '';
          const visible = TREE[gi].items.filter(
            (i) => !q || i.includes(q) || TREE[gi].group.toLowerCase().includes(q)
          );
          const sa = els.groups.querySelector('.select-all[data-gi="' + gi + '"]');
          if (sa) sa.checked = visible.length > 0 && visible.every((i) => selected.has(i));
        }
      }
    });
  }

  if (els.search) {
    els.search.addEventListener('input', (e) => render(e.target.value));
  }

  function showToast() {
    if (!els.toast) return;
    els.toast.textContent = 'Services saved for Pick for me';
    els.toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove('show'), 3200);
  }

  if (els.save) els.save.addEventListener('click', showToast);
  if (els.saveSticky) els.saveSticky.addEventListener('click', showToast);

  if (els.scanBtn && els.scanNote) {
    els.scanBtn.addEventListener('click', () => {
      els.scanNote.classList.add('open');
    });
  }
  if (els.dismissScan && els.scanNote) {
    els.dismissScan.addEventListener('click', () => {
      els.scanNote.classList.remove('open');
    });
  }

  syncModeButtons();
  render('');
})();

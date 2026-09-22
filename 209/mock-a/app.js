/* FC #209 Mock A — AdvisorSource CRUD (localStorage) */
(function () {
  const STORAGE_KEY = 'fc209.advisorSources.v1';
  const SELECTED_KEY = 'fc209.userEdit.selected.v1';
  const SEED = [
    { id: 'src_independent', name: 'Independent', slug: 'independent', logoUrl: '' },
    { id: 'src_bank', name: 'Bank-owned', slug: 'bank-owned', logoUrl: '' },
    { id: 'src_cu', name: 'Credit Union', slug: 'credit-union', logoUrl: '' },
  ];

  const ADMIN_ITEMS = [
    { label: 'View Analytics' },
    { label: 'CS advisor metrics' },
    { label: 'User Approvals' },
    { label: 'Admin Management' },
    { label: 'View User List', href: 'user-edit-context.html' },
    { label: 'Manage Advisor Posts' },
    { label: 'AFA WordPress migration' },
    { label: 'Manage Categories', sibling: true, note: 'topic tags' },
    {
      label: 'Manage Advisor Categories',
      href: 'manage.html',
      highlight: true,
      note: 'NEW · AdvisorSource',
    },
    { label: 'Carousel Manager' },
    { label: 'Manage Infographics' },
    { label: 'Media Library' },
    { label: 'Create New Post' },
    { label: 'Help & Support' },
  ];

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function uid() {
    return 'src_' + Math.random().toString(36).slice(2, 10);
  }

  function loadSources() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        return SEED.map((x) => Object.assign({}, x));
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('bad');
      return parsed;
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED.map((x) => Object.assign({}, x));
    }
  }

  function persistSources(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('fc209:sources-changed', { detail: list }));
  }

  function showToast(msg) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove('show');
    }, 2200);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }
  function truncate(s, n) {
    s = String(s || '');
    return s.length > n ? s.slice(0, n - 1) + '\u2026' : s;
  }

  function renderAdminMenu(menuEl) {
    var adminHtml = ADMIN_ITEMS.map(function (it) {
      var cls = ['pm-item'];
      if (it.highlight) cls.push('highlight');
      if (it.sibling) cls.push('sibling');
      var tag = it.href ? 'a' : 'button';
      var href = it.href ? ' href="' + it.href + '"' : ' type="button"';
      var note = it.note ? ' <span class="pm-note">' + it.note + '</span>' : '';
      return (
        '<' +
        tag +
        ' class="' +
        cls.join(' ') +
        '"' +
        href +
        '><span class="dot"></span><span>' +
        it.label +
        '</span>' +
        note +
        '</' +
        tag +
        '>'
      );
    }).join('');

    menuEl.innerHTML =
      '<div class="pm-head">' +
      '<div class="avatar">AH</div>' +
      '<div><div class="name">Alex Hung</div><div class="email">alex@financialtechtools.ca</div></div>' +
      '</div>' +
      '<div class="pm-section">' +
      '<button type="button" class="pm-item"><span class="dot"></span>Profile settings</button>' +
      '<button type="button" class="pm-item"><span class="dot"></span>Account</button>' +
      '</div>' +
      '<div class="pm-section"><div class="pm-label">Admin</div>' +
      adminHtml +
      '</div>' +
      '<div class="pm-section pm-section-last">' +
      '<button type="button" class="pm-item danger"><span class="dot danger-dot"></span>Sign Out</button>' +
      '</div>';
  }

  function wireProfileMenu() {
    var btn = document.getElementById('profileBtn');
    var menu = document.getElementById('profileMenu');
    var backdrop = document.getElementById('menuBackdrop');
    if (!btn || !menu || !backdrop) return;
    renderAdminMenu(menu);

    function open() {
      menu.classList.add('show');
      backdrop.classList.add('show');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      menu.classList.remove('show');
      backdrop.classList.remove('show');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function () {
      if (menu.classList.contains('show')) close();
      else open();
    });
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    if (document.body.getAttribute('data-open-menu') === '1') open();
  }

  function initManage() {
    var tbody = document.getElementById('catBody');
    if (!tbody) return;

    var nameInput = document.getElementById('newName');
    var logoInput = document.getElementById('newLogo');
    var slugPrev = document.getElementById('slugPreview');
    var addBtn = document.getElementById('addBtn');
    var resetBtn = document.getElementById('resetSeed');
    var backdrop = document.getElementById('deleteBackdrop');
    var confirmBtn = document.getElementById('confirmDelete');
    var cancelDel = document.getElementById('cancelDelete');
    var delName = document.getElementById('deleteName');

    var editingId = null;
    var pendingDelete = null;

    function refreshSlug() {
      var s = slugify(nameInput.value);
      slugPrev.innerHTML = s
        ? 'Slug preview: <code>' + escapeHtml(s) + '</code>'
        : 'Slug preview: <code>\u2014</code> (auto from name)';
      addBtn.disabled = !nameInput.value.trim();
    }
    nameInput.addEventListener('input', refreshSlug);
    refreshSlug();

    function render() {
      var list = loadSources();
      if (!list.length) {
        tbody.innerHTML =
          '<tr class="empty-row"><td colspan="4">No advisor categories yet. Add one above.</td></tr>';
        return;
      }
      tbody.innerHTML = list
        .map(function (row) {
          if (editingId === row.id) {
            return (
              '<tr class="editing" data-id="' +
              row.id +
              '"><td colspan="4">' +
              '<div class="inline-grid">' +
              '<div class="field"><label>Name</label>' +
              '<input id="editName" value="' +
              escapeAttr(row.name) +
              '" />' +
              '<div class="slug-preview" id="editSlugPrev">Slug: <code>' +
              escapeHtml(row.slug) +
              '</code></div></div>' +
              '<div class="field"><label>Logo URL <span class="opt">(optional)</span></label>' +
              '<input id="editLogo" value="' +
              escapeAttr(row.logoUrl || '') +
              '" placeholder="https://\u2026" /></div>' +
              '</div>' +
              '<div class="inline-actions">' +
              '<button type="button" class="btn btn-primary btn-sm" data-save="' +
              row.id +
              '">Save</button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-cancel>Cancel</button>' +
              '</div></td></tr>'
            );
          }
          var logo = row.logoUrl
            ? '<img class="logo-thumb" src="' +
              escapeAttr(row.logoUrl) +
              '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'" />' +
              '<span class="logo-ph" style="display:none">?</span>'
            : '<span class="logo-ph">\u2014</span>';
          return (
            '<tr data-id="' +
            row.id +
            '">' +
            '<td class="name-cell">' +
            escapeHtml(row.name) +
            '</td>' +
            '<td class="slug-cell">' +
            escapeHtml(row.slug) +
            '</td>' +
            '<td class="logo-cell">' +
            logo +
            '<span>' +
            (row.logoUrl ? escapeHtml(truncate(row.logoUrl, 36)) : 'No logo') +
            '</span></td>' +
            '<td class="actions-cell">' +
            '<button type="button" class="btn btn-outline btn-sm" data-edit="' +
            row.id +
            '">Edit</button>' +
            '<button type="button" class="btn-icon danger" title="Delete" data-del="' +
            row.id +
            '" aria-label="Delete">\ud83d\uddd1</button>' +
            '</td></tr>'
          );
        })
        .join('');

      var en = document.getElementById('editName');
      if (en) {
        var prev = document.getElementById('editSlugPrev');
        en.addEventListener('input', function () {
          prev.innerHTML = 'Slug: <code>' + escapeHtml(slugify(en.value)) + '</code>';
        });
      }
    }

    tbody.addEventListener('click', function (e) {
      var edit = e.target.closest('[data-edit]');
      var del = e.target.closest('[data-del]');
      var saveBtn = e.target.closest('[data-save]');
      var cancel = e.target.closest('[data-cancel]');
      if (edit) {
        editingId = edit.getAttribute('data-edit');
        render();
        return;
      }
      if (cancel) {
        editingId = null;
        render();
        return;
      }
      if (saveBtn) {
        var id = saveBtn.getAttribute('data-save');
        var name = document.getElementById('editName').value.trim();
        var logoUrl = document.getElementById('editLogo').value.trim();
        if (!name) {
          showToast('Name is required');
          return;
        }
        var list = loadSources();
        var i = list.findIndex(function (x) {
          return x.id === id;
        });
        if (i >= 0) {
          var newSlug = slugify(name);
          if (
            list.some(function (x) {
              return x.slug === newSlug && x.id !== id;
            })
          ) {
            showToast('Slug already exists \u2014 pick a different name');
            return;
          }
          list[i] = Object.assign({}, list[i], { name: name, slug: newSlug, logoUrl: logoUrl });
          persistSources(list);
          showToast('Category updated');
        }
        editingId = null;
        render();
        return;
      }
      if (del) {
        pendingDelete = del.getAttribute('data-del');
        var row = loadSources().find(function (x) {
          return x.id === pendingDelete;
        });
        delName.textContent = row ? row.name : 'this category';
        backdrop.classList.add('show');
      }
    });

    addBtn.addEventListener('click', function () {
      var name = nameInput.value.trim();
      if (!name) return;
      var logoUrl = logoInput.value.trim();
      var list = loadSources();
      var slug = slugify(name);
      if (
        list.some(function (x) {
          return x.slug === slug;
        })
      ) {
        showToast('Slug already exists \u2014 pick a different name');
        return;
      }
      list.push({ id: uid(), name: name, slug: slug, logoUrl: logoUrl });
      persistSources(list);
      nameInput.value = '';
      logoInput.value = '';
      refreshSlug();
      showToast('Category added');
      render();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        editingId = null;
        showToast('Reset to seed data');
        render();
      });
    }

    function closeDeleteModal() {
      backdrop.classList.remove('show');
      pendingDelete = null;
    }
    cancelDel.addEventListener('click', closeDeleteModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeDeleteModal();
    });
    confirmBtn.addEventListener('click', function () {
      if (!pendingDelete) return;
      persistSources(
        loadSources().filter(function (x) {
          return x.id !== pendingDelete;
        })
      );
      showToast('Category deleted');
      closeDeleteModal();
      render();
    });

    render();
  }

  function initUserEdit() {
    var listEl = document.getElementById('advisorCatList');
    if (!listEl) return;

    function selectedSet() {
      try {
        var raw = localStorage.getItem(SELECTED_KEY);
        if (!raw) return new Set(['src_independent', 'src_cu']);
        return new Set(JSON.parse(raw));
      } catch (e) {
        return new Set(['src_independent', 'src_cu']);
      }
    }

    function render() {
      var sources = loadSources();
      var sel = selectedSet();
      if (!sources.length) {
        listEl.innerHTML =
          '<div class="cat-empty">No Advisor Categories yet. <a href="manage.html">Add some</a>.</div>';
        return;
      }
      listEl.innerHTML = sources
        .map(function (s) {
          var checked = sel.has(s.id) ? 'checked' : '';
          return (
            '<label class="cat-row">' +
            '<input type="checkbox" data-id="' +
            s.id +
            '" ' +
            checked +
            ' />' +
            '<span><span class="nm">' +
            escapeHtml(s.name) +
            '</span><span class="sl">' +
            escapeHtml(s.slug) +
            '</span></span></label>'
          );
        })
        .join('');
    }

    listEl.addEventListener('change', function (e) {
      var cb = e.target.closest('input[type=checkbox][data-id]');
      if (!cb) return;
      var sel = selectedSet();
      if (cb.checked) sel.add(cb.getAttribute('data-id'));
      else sel.delete(cb.getAttribute('data-id'));
      localStorage.setItem(SELECTED_KEY, JSON.stringify(Array.from(sel)));
    });

    var saveUser = document.getElementById('saveUser');
    if (saveUser) {
      saveUser.addEventListener('click', function () {
        showToast('Advisor saved (demo)');
      });
    }

    window.addEventListener('fc209:sources-changed', render);
    window.addEventListener('storage', function (e) {
      if (e.key === STORAGE_KEY) render();
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    wireProfileMenu();
    initManage();
    initUserEdit();
  });

  window.FC209 = {
    loadSources: loadSources,
    persistSources: persistSources,
    slugify: slugify,
    SEED: SEED,
    STORAGE_KEY: STORAGE_KEY,
  };
})();

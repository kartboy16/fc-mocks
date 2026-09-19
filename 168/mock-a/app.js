/**
 * FC Share #168 — Direction A: Checklist rows
 * Shared picker interactions for index.html + mobile.html
 */
(function () {
  'use strict';

  var CHANNELS = {
    email: { label: 'Email', help: 'Full article if Email only; teaser + link when Website is on' },
    social: { label: 'Social', help: 'Post to linked networks' },
    website: { label: 'Website', help: 'Publish on your site' }
  };

  var STORAGE_KEY = 'fc168-channels';

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function getSelected() {
    return $$('.picker .row[aria-checked="true"]').map(function (r) {
      return r.getAttribute('data-channel');
    });
  }

  function setSelected(ids) {
    var set = {};
    (ids || []).forEach(function (id) { set[id] = true; });
    $$('.picker .row').forEach(function (row) {
      var on = !!set[row.getAttribute('data-channel')];
      row.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    sync();
  }

  function sync() {
    var n = getSelected().length;
    var countEl = $('#count');
    var continueBtn = $('#continue');
    var selectAll = $('#selectAll');
    var clearLink = $('#clearLink');

    if (countEl) countEl.textContent = n + ' of 3 selected';
    if (continueBtn) continueBtn.disabled = n < 1;
    if (selectAll) selectAll.textContent = n === 3 ? 'Clear all' : 'Select all';
    if (clearLink) {
      if (n > 0) clearLink.classList.add('is-visible');
      else clearLink.classList.remove('is-visible');
    }

    var hint = $('#emailModeHint');
    if (hint) {
      var ids = getSelected();
      var emailOnly = ids.indexOf('email') !== -1 && ids.indexOf('website') === -1;
      if (emailOnly) {
        hint.hidden = false;
        hint.textContent = 'Email only → full article in the campaign (no site link). Maps old “Email full article”.';
      } else if (ids.indexOf('email') !== -1 && ids.indexOf('website') !== -1) {
        hint.hidden = false;
        hint.textContent = 'Email + Website → teaser email with link to the site post.';
      } else {
        hint.hidden = true;
      }
    }
  }

  function openPicker(anchor) {
    var overlay = $('#overlay');
    var picker = $('#picker');
    var shareBtn = $('#shareBtn');
    if (!picker) return;

    picker.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    if (shareBtn) shareBtn.setAttribute('aria-expanded', 'true');

    positionPicker(anchor || shareBtn);
    // Focus first row for a11y
    var first = $('.picker .row');
    if (first) first.focus();
  }

  function closePicker() {
    var overlay = $('#overlay');
    var picker = $('#picker');
    var shareBtn = $('#shareBtn');
    if (picker) picker.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    if (shareBtn) {
      shareBtn.setAttribute('aria-expanded', 'false');
      shareBtn.focus();
    }
  }

  function isPickerOpen() {
    var picker = $('#picker');
    return picker && picker.classList.contains('is-open');
  }

  function positionPicker(anchor) {
    var picker = $('#picker');
    if (!picker || !anchor) return;

    // Sheet mode (mobile page or narrow CSS) — skip absolute coords
    if (picker.classList.contains('is-sheet')) return;
    if (window.matchMedia('(max-width: 640px)').matches) return;

    var rect = anchor.getBoundingClientRect();
    var width = picker.offsetWidth || 340;
    var gap = 8;
    var left = rect.right - width;
    if (left < 12) left = 12;
    if (left + width > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - width - 12);
    }
    var top = rect.bottom + gap;
    var estimatedH = picker.offsetHeight || 420;
    if (top + estimatedH > window.innerHeight - 12) {
      top = Math.max(12, rect.top - estimatedH - gap);
    }
    picker.style.left = left + 'px';
    picker.style.top = top + 'px';
  }

  function continueFlow() {
    var selected = getSelected();
    if (selected.length < 1) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch (e) { /* ignore */ }
    var params = selected.map(encodeURIComponent).join(',');
    window.location.href = 'flow.html?channels=' + params;
  }

  function bindPicker() {
    var picker = $('#picker');
    if (!picker) return;

    $$('.picker .row').forEach(function (row) {
      row.addEventListener('click', function () {
        var on = row.getAttribute('aria-checked') === 'true';
        row.setAttribute('aria-checked', on ? 'false' : 'true');
        sync();
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          row.click();
        }
      });
    });

    var selectAll = $('#selectAll');
    if (selectAll) {
      selectAll.addEventListener('click', function () {
        var allOn = getSelected().length === 3;
        setSelected(allOn ? [] : ['email', 'social', 'website']);
      });
    }

    var clearLink = $('#clearLink');
    if (clearLink) {
      clearLink.addEventListener('click', function () {
        setSelected([]);
      });
    }

    var continueBtn = $('#continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', continueFlow);
    }

    var cancelBtn = $('#cancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', closePicker);

    var closeBtn = $('#pickerClose');
    if (closeBtn) closeBtn.addEventListener('click', closePicker);

    var overlay = $('#overlay');
    if (overlay) {
      overlay.addEventListener('click', closePicker);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isPickerOpen()) {
        e.preventDefault();
        closePicker();
      }
    });

    window.addEventListener('resize', function () {
      if (isPickerOpen()) positionPicker($('#shareBtn'));
    });

    sync();
  }

  function bindShareButton() {
    var shareBtn = $('#shareBtn');
    if (!shareBtn) return;
    shareBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isPickerOpen()) closePicker();
      else openPicker(shareBtn);
    });
  }

  function bindDemoToggles() {
    var demo = $('#demoStrip');
    if (!demo) return;

    demo.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-demo]');
      if (!btn) return;
      var mode = btn.getAttribute('data-demo');
      if (!isPickerOpen()) openPicker($('#shareBtn'));
      if (mode === 'none') setSelected([]);
      else if (mode === 'one') setSelected(['email']);
      else if (mode === 'two') setSelected(['email', 'social']);
      else if (mode === 'all') setSelected(['email', 'social', 'website']);
    });
  }

  /* —— flow.html —— */
  function parseChannelsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    // Explicit ?channels= (even empty) wins — enables empty-guard deep links
    if (params.has('channels')) {
      var raw = params.get('channels') || '';
      return raw.split(',').map(function (s) { return s.trim(); }).filter(function (id) {
        return id && CHANNELS[id];
      });
    }
    try {
      var stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(stored) && stored.length) {
        return stored.filter(function (id) { return CHANNELS[id]; });
      }
    } catch (e) { /* ignore */ }
    return [];
  }

  function showToast(msg) {
    var t = $('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      t.classList.remove('is-show');
    }, 2200);
  }

  function renderFlow() {
    var root = $('#flowRoot');
    if (!root) return;

    var channels = parseChannelsFromUrl();
    if (!channels.length) {
      root.innerHTML =
        '<div class="empty-guard summary-card">' +
        '<h2>No channels selected</h2>' +
        '<p>Pick at least one destination to continue.</p>' +
        '<a class="btn-sm" href="index.html">← Back to Share</a>' +
        '</div>';
      // Soft bounce: also offer auto-redirect hint
      setTimeout(function () {
        if (document.body.classList.contains('flow-page')) {
          /* stay on guard — user clicks back */
        }
      }, 0);
      return;
    }

    var chipIcons = {
      email: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
      social: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2"/></svg>',
      website: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>'
    };

    var hasWebsite = channels.indexOf('website') !== -1;
    var emailStub = hasWebsite
      ? (
        'Mode: Teaser + link (Website also selected)\n' +
        'To: Client list (248 contacts)\n' +
        'Subject: RRSP tips for clients\n' +
        '—\n' +
        'Hi {{first_name}},\n' +
        'Quick tip before contribution season…\n' +
        'Read more: https://advisor-demo.example/insights/rrsp-tips-for-clients'
      )
      : (
        'Mode: Full article (Email only — AC-6)\n' +
        'To: Client list (248 contacts)\n' +
        'Subject: RRSP tips for clients\n' +
        '—\n' +
        'Hi {{first_name}},\n' +
        'Three practical talking points before contribution season —\n' +
        'contribution room, spousal RRSPs, and timing withdrawals.\n' +
        '[Full article body continues…]'
      );

    var stubs = {
      email: emailStub,
      social:
        'Network: LinkedIn (demo)\n' +
        'Post preview:\n' +
        '“RRSP tips for clients — contribution room, spousal RRSPs, and timing withdrawals.”',
      website:
        'Site: advisor-demo.example\n' +
        'Status: Draft unpublished\n' +
        'Slug: /insights/rrsp-tips-for-clients'
    };

    var emailHelp = hasWebsite
      ? 'Teaser + link to the site post'
      : 'Full article in the email (no site link)';

    var ctas = {
      email: 'Open draft',
      social: 'Preview',
      website: 'Preview'
    };

    var chipsHtml = channels.map(function (id) {
      return (
        '<span class="channel-chip">' +
        (chipIcons[id] || '') +
        CHANNELS[id].label +
        '</span>'
      );
    }).join('');

    var stepsHtml = channels.map(function (id) {
      return (
        '<article class="step-card" data-channel="' + id + '">' +
        '<div class="step-icon" aria-hidden="true">' + (chipIcons[id] || '') + '</div>' +
        '<div class="step-body">' +
        '<h3>' + CHANNELS[id].label + '</h3>' +
        '<p>' + (id === 'email' ? emailHelp : CHANNELS[id].help) + ' — draft / preview only (no live send).</p>' +
        '<div class="step-stub">' + stubs[id] + '</div>' +
        '<button type="button" class="btn-sm" data-stub-action="' + id + '">' + ctas[id] + '</button>' +
        '</div></article>'
      );
    }).join('');

    root.innerHTML =
      '<a class="back-link" href="index.html">← Back to library</a>' +
      '<div class="summary-card">' +
      '<h2>Ready to share</h2>' +
      '<p class="lead">You selected <strong>' + channels.length + '</strong> channel' +
      (channels.length === 1 ? '' : 's') +
      ' for <em>RRSP tips for clients</em>.</p>' +
      '<div class="channel-chips">' + chipsHtml + '</div>' +
      '</div>' +
      '<div class="steps-label">Next steps (stubs)</div>' +
      stepsHtml;

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-stub-action]');
      if (!btn) return;
      var id = btn.getAttribute('data-stub-action');
      var verb = ctas[id] || 'Preview';
      showToast(verb + ' · ' + CHANNELS[id].label + ' (mock — nothing sent)');
    });
  }

  /* init */
  document.addEventListener('DOMContentLoaded', function () {
    bindPicker();
    bindShareButton();
    bindDemoToggles();
    renderFlow();
  });

  // Expose for demo / tests
  window.FC168 = {
    openPicker: openPicker,
    closePicker: closePicker,
    setSelected: setSelected,
    getSelected: getSelected,
    CHANNELS: CHANNELS
  };
})();

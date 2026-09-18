/**
 * FC Ads Phase 1 — Direction B shared helpers (vanilla JS)
 * Fake data only; localStorage for submitted campaigns demo.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'fc_ads_mock_b_campaigns';
  var WALLET_KEY = 'fc_ads_mock_b_wallet';

  var SEED = [
    {
      id: 'c1',
      name: 'RRSP Spring Outreach',
      status: 'live',
      channels: ['Google', 'Meta'],
      spend: 842,
      budget: 1500,
      leads: 28,
      cpl: 30.07,
      advisor: 'Jordan Lee, CFP',
      geo: 'Toronto, ON · 25 km',
      created: '2026-09-02'
    },
    {
      id: 'c2',
      name: 'Retirement Readiness Q3',
      status: 'pending',
      channels: ['Meta'],
      spend: 0,
      budget: 800,
      leads: 0,
      cpl: null,
      advisor: 'Jordan Lee, CFP',
      geo: 'M5V · Toronto FSA',
      created: '2026-09-15',
      headline: 'Plan your retirement with confidence',
      body: 'Book a complimentary discovery call with Jordan Lee, CFP. [COMPLIANCE PLACEHOLDER]',
      goal: 'Leads',
      funding: 'Wallet'
    },
    {
      id: 'c3',
      name: 'TFSA Top-Up Campaign',
      status: 'draft',
      channels: ['Google'],
      spend: 0,
      budget: 500,
      leads: 0,
      cpl: null,
      advisor: 'Sam Patel, CFP',
      geo: 'Vancouver · 15 km',
      created: '2026-09-14'
    },
    {
      id: 'c4',
      name: 'Estate Planning Webinar',
      status: 'paused',
      channels: ['Google', 'Meta'],
      spend: 410,
      budget: 1200,
      leads: 11,
      cpl: 37.27,
      advisor: 'Alex Rivera, CFP',
      geo: 'Calgary, AB · 40 km',
      created: '2026-08-20'
    },
    {
      id: 'c5',
      name: 'First-Home Buyers Lead Gen',
      status: 'rejected',
      channels: ['Meta'],
      spend: 0,
      budget: 600,
      leads: 0,
      cpl: null,
      advisor: 'Jordan Lee, CFP',
      geo: 'Ottawa · postal K1P',
      created: '2026-09-10',
      rejectReason: 'Creative claims require disclosure revision.'
    },
    {
      id: 'c6',
      name: 'Year-End Tax Planning',
      status: 'live',
      channels: ['Google'],
      spend: 1240,
      budget: 2000,
      leads: 41,
      cpl: 30.24,
      advisor: 'Sam Patel, CFP',
      geo: 'Mississauga · 20 km',
      created: '2026-08-01'
    }
  ];

  function loadCampaigns() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        return SEED.slice();
      }
      return JSON.parse(raw);
    } catch (e) {
      return SEED.slice();
    }
  }

  function saveCampaigns(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getCampaign(id) {
    return loadCampaigns().find(function (c) { return c.id === id; }) || null;
  }

  function upsertCampaign(camp) {
    var list = loadCampaigns();
    var i = list.findIndex(function (c) { return c.id === camp.id; });
    if (i >= 0) list[i] = camp;
    else list.unshift(camp);
    saveCampaigns(list);
    return camp;
  }

  function resetCampaigns() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED.slice();
  }

  function getWallet() {
    try {
      var v = localStorage.getItem(WALLET_KEY);
      return v ? parseFloat(v) : 2450;
    } catch (e) {
      return 2450;
    }
  }

  function setWallet(n) {
    localStorage.setItem(WALLET_KEY, String(n));
  }

  function fmtCAD(n) {
    return '$' + Number(n).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' CAD';
  }

  function fmtMoney(n) {
    return '$' + Number(n).toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function statusLabel(s) {
    return ({ draft: 'Draft', pending: 'Pending', live: 'Live', paused: 'Paused', rejected: 'Rejected' })[s] || s;
  }

  function showToast(msg, type) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 3200);
  }

  function showLoading(on) {
    var el = document.getElementById('loadingOverlay');
    if (!el) {
      el = document.createElement('div');
      el.id = 'loadingOverlay';
      el.className = 'loading-overlay';
      el.innerHTML = '<div class="spinner"></div><div style="font-weight:600;color:var(--ink)">Submitting…</div>';
      document.body.appendChild(el);
    }
    el.classList.toggle('open', !!on);
  }

  function qs(name) {
    var p = new URLSearchParams(window.location.search);
    return p.get(name);
  }

  function uid() {
    return 'c' + Date.now().toString(36);
  }

  /** Shared shell markup helpers */
  function shellNav(active) {
    var items = [
      { id: 'library', label: 'Library', icon: '📚', href: '#' },
      { id: 'contacts', label: 'Contacts', icon: '👥', href: '#' },
      { id: 'ads', label: 'Ads', icon: '📣', href: 'index.html' },
      { id: 'approvals', label: 'Approvals', icon: '✅', href: 'approvals.html' },
      { id: 'reports', label: 'Reports', icon: '📊', href: 'performance.html' },
      { id: 'funding', label: 'Funding', icon: '💳', href: 'funding.html' }
    ];
    return items.map(function (it) {
      var cls = 'nav-item' + (it.id === active ? ' active' : '');
      return '<a class="' + cls + '" href="' + it.href + '"><span class="nav-icon">' + it.icon + '</span><span>' + it.label + '</span></a>';
    }).join('');
  }

  global.FCAds = {
    loadCampaigns: loadCampaigns,
    saveCampaigns: saveCampaigns,
    getCampaign: getCampaign,
    upsertCampaign: upsertCampaign,
    resetCampaigns: resetCampaigns,
    getWallet: getWallet,
    setWallet: setWallet,
    fmtCAD: fmtCAD,
    fmtMoney: fmtMoney,
    statusLabel: statusLabel,
    showToast: showToast,
    showLoading: showLoading,
    qs: qs,
    uid: uid,
    shellNav: shellNav,
    SEED: SEED
  };
})(window);

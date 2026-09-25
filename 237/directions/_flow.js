(function () {
  const gate = document.getElementById('gate');
  const pre = document.getElementById('screen-pre');
  const post = document.getElementById('screen-post');
  const tabs = document.querySelectorAll('.screen-tabs button');
  function show(screen) {
    const isPre = screen === 'pre';
    if (pre) pre.classList.toggle('hidden', !isPre);
    if (post) post.classList.toggle('hidden', isPre);
    const banner = document.getElementById('banner');
    if (banner) banner.classList.toggle('hidden', isPre);
    tabs.forEach(t => t.classList.toggle('on', t.dataset.screen === screen));
    if (gate) gate.classList.remove('open');
  }
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.screen)));
  document.querySelectorAll('[data-screen]').forEach(el => {
    if (el.closest('.actions') || el.closest('.btns')) {
      el.addEventListener('click', () => show(el.dataset.screen));
    }
  });
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => show(el.dataset.goto));
  });
  function openGate() { if (gate) gate.classList.add('open'); }
  ['open-gate','open-gate-2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openGate);
  });
  ['close-gate','cancel-gate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => gate && gate.classList.remove('open'));
  });
  const cont = document.getElementById('continue-fb');
  if (cont) cont.addEventListener('click', () => { if (gate) gate.classList.remove('open'); show('post'); });
  const cancelInt = document.getElementById('cancel-int');
  if (cancelInt) cancelInt.addEventListener('click', () => alert('Mock: returns to Social Media Settings without OAuth.'));
  document.querySelectorAll('.page-row').forEach(row => {
    const sync = () => row.classList.toggle('sel', row.querySelector('input').checked);
    row.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return;
      const cb = row.querySelector('input');
      cb.checked = !cb.checked;
      sync();
    });
    const inp = row.querySelector('input');
    if (inp) inp.addEventListener('change', sync);
  });
})();

var S = S || { s: 'list', aud: 'one' };
function qs(sel){ return document.querySelectorAll(sel); }
function q(sel){ return document.querySelector(sel); }
function setDev(d){
  var el = document.getElementById('dev');
  if (el) el.className = d;
  qs('[data-dev]').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-dev') === d); });
}
function toast(m){
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = m;
  t.style.display = 'block';
  clearTimeout(t._t);
  t._t = setTimeout(function(){ t.style.display = 'none'; }, 2800);
}
function visibleFor(e){
  if (e.hasAttribute('data-s')) {
    var ok = e.getAttribute('data-s').split(/\s+/).indexOf(String(S.s)) > -1;
    if (!ok) return false;
  }
  if (e.hasAttribute('data-role')) {
    var allow = e.getAttribute('data-role').split(/\s+/);
    if (allow.indexOf(String(S.role)) < 0) return false;
  }
  if (e.hasAttribute('data-aud')) {
    var ok = e.getAttribute('data-aud').split(/\s+/).indexOf(String(S.aud)) > -1;
    if (!ok) return false;
  }
  return true;
}
function apply(){
  qs('[data-s], [data-role], [data-aud]').forEach(function(e){
    var shown = e.getAttribute('data-show') || '';
    e.style.display = visibleFor(e) ? shown : 'none';
  });
  qs('[data-sb]').forEach(function(b){
    var p = b.getAttribute('data-sb').split(':');
    b.classList.toggle('on', String(S[p[0]]) === p[1]);
  });
  document.title = document.title.replace(/ \u2014 .*$/, '') + ' \u2014 ' + (S.s || 'list');
  if (window.onApply) window.onApply();
}
function set(k, v){
  S[k] = v;
  apply();
  if (k === 's') {
    window.scrollTo(0, 0);
    var d = document.getElementById('dev');
    if (d) d.scrollTop = 0;
  }
}
function initBase(){
  var query = location.search;
  setDev(/[?&]phone(?:&|$|=)/.test(query) || /[?&]phone$/.test(query) ? 'phone' : 'desk');
  ['s', 'role', 'aud'].forEach(function(k){
    var m = query.match(new RegExp('[?&]' + k + '=([a-z0-9-]+)'));
    if (m) S[k] = m[1];
  });
  if (!S.s) S.s = 'list';
  if (!S.role) S.role = (window.DIR === 'C') ? 'admin' : 'advisor';
  if (!S.aud) S.aud = 'one';
  apply();
}
function toggleCheck(el){
  el.classList.toggle('on');
  var inp = el.querySelector('input');
  if (inp) inp.checked = el.classList.contains('on');
  var n = document.querySelectorAll('.js-profile.on').length;
  qs('.js-need-profile').forEach(function(b){
    if (n > 0) b.classList.remove('disabled');
    else b.classList.add('disabled');
    if (b.tagName === 'BUTTON') b.disabled = n === 0;
  });
}
function pickAud(v){
  S.aud = v;
  qs('.js-aud').forEach(function(e){ e.classList.toggle('on', e.getAttribute('data-pick') === v); });
  apply();
}
function doParse(){
  set('s', 'parsing');
  setTimeout(function(){ set('s', 'profiles'); }, 700);
}
function doPreview(){
  if (window.DIR === 'C' && S.s === 'profiles') {
    set('s', 'preview');
    return;
  }
  set('s', 'preview');
}
function afterProfiles(){
  if (window.DIR === 'C') set('s', 'audience');
  else set('s', 'preview');
}
function doSchedule(){
  if (window.DIR === 'C' && S.aud === 'all') {
    set('s', 'confirm');
    return;
  }
  runSchedule();
}
function runSchedule(){
  set('s', 'scheduling');
  setTimeout(function(){
    set('s', 'done');
    if (window.DIR === 'C' && S.aud === 'all') {
      toast('8 posts scheduled for 12 advisors. 3 rows skipped. Nothing has been published yet.');
    } else {
      toast('8 posts scheduled, 3 skipped. Nothing has been published yet.');
    }
  }, 900);
}
function remainingBad(){
  return document.querySelectorAll('.prow.bad:not(.gone)').length;
}
function validCount(){
  return document.querySelectorAll('.prow.valid:not(.gone)').length;
}
function updatePreviewCounts(){
  var bad = remainingBad();
  var ok = validCount();
  qs('.js-ok-count').forEach(function(e){ e.textContent = String(ok); });
  qs('.js-bad-count').forEach(function(e){ e.textContent = String(bad); });
  var schedule = q('#btn-schedule');
  var note = q('#b-block-note');
  if (window.DIR === 'B') {
    if (schedule) {
      schedule.disabled = bad > 0 || ok === 0;
      schedule.textContent = bad > 0 ? 'Schedule' : ('Schedule ' + ok + ' posts');
    }
    if (note) note.style.display = bad > 0 ? '' : 'none';
  } else if (schedule) {
    var skip = bad;
    schedule.disabled = ok === 0;
    if (window.DIR === 'C' && S.aud === 'all') {
      schedule.textContent = skip ? ('Schedule ' + ok + ' posts for 12 advisors (' + skip + ' skipped)') : ('Schedule ' + ok + ' posts for 12 advisors');
    } else {
      schedule.textContent = skip ? ('Schedule ' + ok + ' posts (' + skip + ' skipped)') : ('Schedule ' + ok + ' posts');
    }
  }
}
function removeRow(id){
  var el = document.getElementById(id);
  if (el) el.classList.add('gone');
  updatePreviewCounts();
  toast('Row removed from this upload. It will not be scheduled.');
}
function fixRow(id, kind){
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('bad');
  el.classList.add('valid');
  var flag = el.querySelector('.flag');
  if (flag) flag.remove();
  var actions = el.querySelector('.js-fix');
  if (actions) actions.remove();
  if (kind === 'message') {
    var p = el.querySelector('.js-msg');
    if (p) p.textContent = 'A short year-end note: contribution deadlines are coming up, and a plan review can wait until January.';
  }
  if (kind === 'date') {
    var d = el.querySelector('.js-date');
    if (d) d.textContent = 'Thu, Dec 17, 2026 · 9:00 AM PT';
  }
  if (kind === 'image') {
    var th = el.querySelector('.thumb');
    if (th) {
      th.className = 'thumb sm th-check';
      th.textContent = 'Photo';
    }
  }
  updatePreviewCounts();
  toast('Row updated and will be scheduled.');
}
function onApply(){
  if (S.s === 'preview' || S.s === 'previewfixed') updatePreviewCounts();
}
document.addEventListener('DOMContentLoaded', initBase);

/* #420 bounce guidance mock engine. Direction set per page: window.DIR = 'a' | 'b' | 'c' */
(function(){
var D = window.DIR || 'a';
var ADV = {name:'Jordan Lee', init:'JL'};
var CAMP = {name:'Critical Illness Insurance: what it covers', sent:'Oct 6, 2026, 9:00 AM', recipients:759, delivered:739, opens:281, clicks:46};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* ---------- plain-language copy (the deliverable) ---------- */
var TYPE = {
  Permanent:{label:'Won\u2019t be emailed again', short:'Permanent', cls:'perm',
    explain:'The address doesn\u2019t work: the account was closed, there\u2019s a typo, or it never existed. We stop sending to it automatically, so it won\u2019t get your next campaign.'},
  Transient:{label:'Temporary', short:'Transient', cls:'temp',
    explain:'The address exists but couldn\u2019t take the email this time (for example, a full inbox). It stays subscribed and we try again next campaign. After 3 temporary bounces in a row, we pause the address.'}
};
var SUB = {
  'Permanent/General':{label:'Address rejected', explain:'Their email provider says this address doesn\u2019t accept mail. Usually a closed account (old work email, changed provider).'},
  'Permanent/NoEmail':{label:'Address doesn\u2019t exist', explain:'There\u2019s no mailbox at this address. Often a typo, like gmial.com.'},
  'Permanent/Suppressed':{label:'Bounced before', explain:'This address already bounced permanently in the past, so it was skipped this time.'},
  'Transient/MailboxFull':{label:'Inbox full', explain:'Their inbox is out of space. This usually clears up on its own.'},
  'Transient/General':{label:'Temporarily refused', explain:'Their email provider turned the email away for now without saying why. Sometimes it means the account is being closed.'}
};
function guide(r){
  var k = r.type+'/'+r.sub;
  if (r.type==='Permanent') return {kind:'perm', next:'Won\u2019t be emailed again until you update the address. Edit this subscriber and change Status to Subscribed if you have a new email.', shortNext:'Update the address if you have a new one', act:'Edit subscriber'};
  if (r.soft>=3) return {kind:'paused', next:'Paused after 3 temporary bounces in a row, so it won\u2019t get your next campaign. Check the address is still current. If you have a new one, edit this subscriber.', shortNext:'Paused. Check the address', act:'Check address'};
  if (r.sub==='MailboxFull') return {kind:'temp', next:'Temporary. We\u2019ll try again next campaign. Their inbox may be full.', shortNext:'Nothing to do. We\u2019ll retry', act:null};
  return {kind:'temp', next:'Temporary refusal. Worth double-checking the address is still current.', shortNext:'Double-check the address', act:'Check address'};
}

/* ---------- fictional data ---------- */
var P = [
 ['Dana','Morales','dana.morales@oldfirm.example','General'],['Ken','Watanabe','kwatanabe@example.net','General'],['Leah','Fortin','leah.fortin@example.ca','General'],
 ['Omar','Haddad','ohaddad@retired-mail.example','General'],['Grace','Liu','grace.liu@example.com','General'],['Marco','Bellini','m.bellini@example.org','General'],
 ['Sofia','Ruiz','sruiz@formerco.example','General'],['Tom','Becker','tbecker@example.net','General'],['Nadia','Petrov','nadia.p@example.com','General'],
 ['Ray','Singh','ray.singh@oldbank.example','General'],['Eva','Novak','eva.novak@example.ca','General'],
 ['Chris','Adeyemi','chris.adeyemi@gmial.example','NoEmail'],['Hannah','Kim','hanah.kim@example.com','NoEmail'],['Luis','Ortega','luis.ortega@exmple.com','NoEmail'],
 ['Paul','Gagnon','pgagnon@example.org','Suppressed'],['Ivy','Chen','ivy.chen@example.net','Suppressed']
];
var BOUNCES = [], i;
for (i=0;i<P.length;i++) BOUNCES.push({id:'b'+(i+1), first:P[i][0], last:P[i][1], email:P[i][2], type:'Permanent', sub:P[i][3], date:'Oct 6, 9:0'+(1+i%8)+' AM', status:'bounced'});
BOUNCES.push({id:'b17', first:'Mei', last:'Tanaka', email:'mei.tanaka@example.com', type:'Transient', sub:'MailboxFull', soft:1, date:'Oct 6, 9:04 AM', status:'subscribed'});
BOUNCES.push({id:'b18', first:'Ben', last:'Clarke', email:'ben.clarke@example.ca', type:'Transient', sub:'MailboxFull', soft:2, date:'Oct 6, 9:06 AM', status:'subscribed'});
BOUNCES.push({id:'b19', first:'Rosa', last:'Delgado', email:'rdelgado@example.org', type:'Transient', sub:'General', soft:1, date:'Oct 6, 9:07 AM', status:'subscribed'});
BOUNCES.push({id:'b20', first:'Sam', last:'Okafor', email:'sam.okafor@example.net', type:'Transient', sub:'General', soft:3, date:'Oct 6, 9:08 AM', status:'bounced'});
var OTHERS = [
 {id:'c1', first:'Amy', last:'Chen', email:'amy.chen@example.com', status:'subscribed'},
 {id:'c2', first:'Victor', last:'Hale', email:'vhale@example.net', status:'subscribed'},
 {id:'c3', first:'Joan', last:'Price', email:'joan.price@example.org', status:'bounced', note:'Bounced Sep 14 (Permanent)'},
 {id:'c4', first:'Ali', last:'Rahman', email:'ali.rahman@example.ca', status:'bounced', note:'Bounced Aug 30 (Permanent)'},
 {id:'c5', first:'Nora', last:'Quinn', email:'nora.quinn@example.com', status:'unsubscribed'}
];
BOUNCES.forEach(function(b){ b.bEmail = b.email; });
var ORIG = JSON.stringify(BOUNCES);

/* ---------- state ---------- */
var S;
function reset(){ BOUNCES = JSON.parse(ORIG); S = {screen:'bounces', phone:false, scen:'full', explain:false, pop:null, edit:null, editEmail:'', editStatus:'', sel:null, filter:'all', fix:{}, fixErr:{}, fixDraft:{}, skipped:{}}; }
reset();
function rows(){
  if (S.scen==='none') return [];
  if (S.scen==='temp') return BOUNCES.filter(function(r){return r.type==='Transient' && r.soft<3;});
  return BOUNCES;
}
function byId(id){ var a = BOUNCES.concat(OTHERS); for (var j=0;j<a.length;j++) if (a[j].id===id) return a[j]; }
function counts(){ var r = rows(), c = {all:r.length, perm:0, temp:0, paused:0, fixed:0, needs:0};
  r.forEach(function(x){ var g = guide(x); if (x.type==='Permanent') c.perm++; else c.temp++; if (g.kind==='paused') c.paused++; if (S.fix[x.id]) c.fixed++; else if (g.kind!=='temp') c.needs++; });
  return c; }
function name(r){ return esc(r.first+' '+r.last); }

/* ---------- pieces ---------- */
function typeChip(r){ var t = TYPE[r.type]; if (S.fix[r.id]) return '<span class="chip ok">\u2713 Updated</span>';
  var g = guide(r); if (g.kind==='paused') return '<span class="chip perm">Paused</span>';
  return '<span class="chip '+t.cls+'">'+t.label+'</span>'; }
function raw(r){ return '<div class="raw">'+r.type+' \u00b7 '+r.sub+(r.type==='Transient'?' \u00b7 '+r.soft+' of 3 in a row':'')+'</div>'; }
function fixedLine(r){ return S.fix[r.id] ? '<div class="fixed">\u2713 Updated to '+esc(S.fix[r.id])+' \u00b7 Subscribed</div>' : ''; }
function actBtn(r, cls){ var g = guide(r); if (S.fix[r.id]) return '<button class="btn sm text" data-act="edit:'+r.id+'">Open</button>';
  if (!g.act) return '<span class="muted small">No action needed</span>';
  return '<button class="btn sm '+(cls||'')+'" data-act="edit:'+r.id+'">'+g.act+'</button>'; }
function explainPanel(){
  return '<div class="explain" id="explain"><div style="display:flex;justify-content:space-between;align-items:center"><h4>What do these bounce types mean?</h4><button class="btn sm text" data-act="explain">Hide</button></div>'+
  '<div class="cols"><dl><dt><span class="chip perm">Permanent</span> Won\u2019t be emailed again</dt><dd>'+TYPE.Permanent.explain+'</dd>'+
  '<dt>What to do</dt><dd>If you have a new email for this person, <b>edit the subscriber</b>, change the email, and set Status to Subscribed. Don\u2019t re-subscribe the same address: it will just bounce again.</dd></dl>'+
  '<dl><dt><span class="chip temp">Transient</span> Temporary</dt><dd>'+TYPE.Transient.explain+'</dd>'+
  '<dt>Inbox full vs. Temporarily refused</dt><dd><b>Inbox full:</b> '+SUB['Transient/MailboxFull'].explain+'<br><b>Temporarily refused:</b> '+SUB['Transient/General'].explain+' Worth checking the address.</dd></dl></div></div>';
}
function popFor(kind){
  var h = kind==='type' ? '<h5>Bounce type</h5><p><span class="chip perm">Permanent</span> '+TYPE.Permanent.explain+'</p><p style="margin-top:6px"><span class="chip temp">Transient</span> '+TYPE.Transient.explain+'</p>'
    : '<h5>Sub-type</h5><p><b>General</b> (Permanent): '+SUB['Permanent/General'].explain+'</p><p style="margin-top:4px"><b>General</b> (Transient): '+SUB['Transient/General'].explain+'</p><p style="margin-top:4px"><b>MailboxFull:</b> '+SUB['Transient/MailboxFull'].explain+'</p><p style="margin-top:4px"><b>NoEmail:</b> '+SUB['Permanent/NoEmail'].explain+'</p><p style="margin-top:4px"><b>Suppressed:</b> '+SUB['Permanent/Suppressed'].explain+'</p>';
  return '<div class="pop" style="top:'+300+'px;left:'+(kind==='type'?260:420)+'px">'+h+'<div style="text-align:right;margin-top:6px"><button class="btn sm text" data-act="pop:">Got it</button></div></div>';
}

/* ---------- report list ---------- */
function reportList(){
  var c = counts();
  var b = S.scen==='none'?0:c.all;
  var hint = (D==='a' && c.needs>0) ? '<div class="small" style="color:var(--err);margin-top:3px">'+c.needs+' need an update</div>' : '';
  return '<div class="tabs"><span class="tab on">Campaign Reports</span><span class="tab">Failed Unsubscribes</span></div>'+
  '<table class="tbl"><thead><tr><th>Campaign</th><th>Sent</th><th>Recipients</th><th>Delivered</th><th>Open Rate</th><th>Click Rate</th><th>Bounces</th><th style="text-align:right">Actions</th></tr></thead><tbody>'+
  '<tr><td><b>'+esc(CAMP.name)+'</b></td><td>'+CAMP.sent+'</td><td>'+CAMP.recipients+'</td><td>'+(CAMP.recipients-b)+'</td><td>38.0%</td><td>6.2%</td><td><span class="chip '+(b?'perm':'gray')+'">'+b+'</span>'+hint+'</td><td style="text-align:right"><button class="btn sm pri" data-act="open-report">View Report</button></td></tr>'+
  '<tr><td><b>September market update</b></td><td>Sep 15, 2026</td><td>751</td><td>748</td><td>41.2%</td><td>7.9%</td><td><span class="chip perm">3</span></td><td style="text-align:right"><button class="btn sm">View Report</button></td></tr>'+
  '</tbody></table>';
}

/* ---------- bounces tab per direction ---------- */
function bouncesA(){
  var r = rows(), c = counts();
  if (!r.length) return emptyState();
  var h = '';
  var pct = (c.all/CAMP.recipients*100).toFixed(1);
  h += '<div class="banner"><div style="flex:1"><div class="ttl">'+c.all+' bounced ('+pct+'% of '+CAMP.recipients+')'+(c.perm?' \u00b7 '+c.perm+' won\u2019t be emailed again':'')+(c.temp?' \u00b7 '+c.temp+' temporary':'')+' \u2014 here\u2019s what to do</div>'+
    '<div class="small muted">A few bounces per campaign is normal. <a href="#" data-act="explain">What do these mean?</a></div><div class="cards">';
  if (c.perm) h += '<div class="gcard"><h4><span class="chip perm">'+c.perm+'</span> Won\u2019t be emailed again</h4>These addresses don\u2019t work anymore. If you have a new email for someone, edit them and set Status to Subscribed.'+
    (c.fixed?'<div class="fixed" style="margin-top:4px">\u2713 '+c.fixed+' updated so far</div>':'')+
    '<div class="acts"><button class="btn sm" data-act="filter:perm">Show these '+c.perm+'</button><button class="btn sm" data-act="subs">Open Subscribers \u203a Bounced</button></div></div>';
  if (c.temp) h += '<div class="gcard"><h4><span class="chip temp">'+c.temp+'</span> Temporary</h4>Still subscribed. We\u2019ll try again next campaign.'+(c.paused?' <b>'+c.paused+' was paused</b> after 3 temporary bounces in a row: check that address.':' Most need nothing from you.')+
    '<div class="acts"><button class="btn sm" data-act="filter:temp">Show these '+c.temp+'</button></div></div>';
  h += '</div></div></div>';
  if (S.explain) h += explainPanel();
  h += '<div class="chips" style="margin-bottom:8px">'+['all','perm','temp'].map(function(f){var lab={all:'All '+c.all,perm:'Won\u2019t be emailed again '+c.perm,temp:'Temporary '+c.temp}[f];return '<button class="btn sm '+(S.filter===f?'pri':'')+'" data-act="filter:'+f+'">'+lab+'</button>';}).join('')+'</div>';
  h += '<table class="tbl"><thead><tr><th>Subscriber</th><th>What happened</th><th>What to do</th><th></th><th>Date</th></tr></thead><tbody>';
  function grp(kind, title, sub){
    var list = r.filter(function(x){ return kind==='perm' ? x.type==='Permanent' : x.type==='Transient'; });
    if (!list.length || (S.filter!=='all' && S.filter!==kind)) return '';
    var o = '<tr class="grp"><td colspan="5">'+title+' ('+list.length+') <span class="muted" style="font-weight:500">\u00b7 '+sub+'</span></td></tr>';
    list.forEach(function(x){ var g = guide(x), sl = SUB[x.type+'/'+x.sub];
      o += '<tr'+(g.kind==='paused'&&!S.fix[x.id]?' style="background:#fffaf5"':'')+'><td><b>'+esc(x.bEmail)+'</b><div class="small muted">'+name(x)+'</div>'+fixedLine(x)+'</td>'+
        '<td>'+typeChip(x)+'<div class="small" style="margin-top:3px">'+sl.label+'</div>'+raw(x)+'</td>'+
        '<td class="next">'+(S.fix[x.id]?'<span class="muted">Done. Next campaign goes to the new address.</span>':esc(g.next))+'</td><td>'+actBtn(x, g.kind==='temp'?'':'pri')+'</td><td class="small muted">'+x.date+'</td></tr>'; });
    return o;
  }
  h += grp('perm','Won\u2019t be emailed again','update the address if you have a new one');
  h += grp('temp','Temporary','still subscribed, we\u2019ll retry next campaign');
  h += '</tbody></table>';
  return h;
}
function bouncesB(){
  var r = rows();
  if (!r.length) return emptyState();
  var h = '<div class="strip"><span><span class="chip perm">Permanent</span> we won\u2019t email that address again</span><span><span class="chip temp">Transient</span> temporary, we\u2019ll retry next campaign</span><a href="#" data-act="explain" style="margin-left:auto">'+(S.explain?'Hide explainer':'What do these mean?')+'</a></div>';
  if (S.explain) h += explainPanel();
  h += '<table class="tbl"><thead><tr><th>Email</th><th>Bounce type <span class="info-ico" data-act="pop:type">?</span></th><th>Sub-type <span class="info-ico" data-act="pop:sub">?</span></th><th>What to do</th><th>Date</th></tr></thead><tbody>';
  r.forEach(function(x){ var g = guide(x), sl = SUB[x.type+'/'+x.sub];
    h += '<tr><td>'+esc(x.bEmail)+fixedLine(x)+'</td><td><span class="chip '+(x.type==='Permanent'?'perm':'temp')+'">'+x.type+'</span></td><td>'+x.sub+'<div class="raw">'+sl.label+'</div></td>'+
      '<td class="next">'+(S.fix[x.id]?'<span class="muted">Updated. Next campaign goes to the new address.</span>':esc(g.next)+(g.act?' <a href="#" data-act="edit:'+x.id+'">Edit subscriber</a>':''))+'</td><td class="small muted">'+x.date+'</td></tr>'; });
  h += '</tbody></table>';
  h += '<div style="margin-top:10px" class="small"><a href="#" data-act="subs">View all bounced subscribers \u203a</a></div>';
  if (S.pop) h += popFor(S.pop);
  return h;
}
function bouncesC(){
  var r = rows(), c = counts();
  if (!r.length) return emptyState();
  var h = '<div class="strip"><b>'+c.all+' bounced.</b> '+(c.needs?c.needs+' address'+(c.needs>1?'es':'')+' need'+(c.needs>1?'':'s')+' an update before your next campaign.':'Nothing needs an update.')+
    (c.fixed?' <span class="fixed">\u2713 '+c.fixed+' updated</span>':'')+
    '<span style="margin-left:auto;display:flex;gap:6px">'+(c.needs?'<button class="btn sm pri" data-act="fix">Fix '+c.needs+' addresses</button>':'')+'<button class="btn sm" data-act="subs">Subscribers \u203a Bounced</button></span></div>';
  if (S.explain) h += explainPanel();
  h += '<div class="split"><div class="main"><table class="tbl"><thead><tr><th>Email</th><th>Result</th><th>Date</th></tr></thead><tbody>';
  r.forEach(function(x){ var sl = SUB[x.type+'/'+x.sub];
    h += '<tr class="click'+(S.sel===x.id?' sel':'')+'" data-act="sel:'+x.id+'"><td>'+esc(x.bEmail)+fixedLine(x)+'</td><td>'+typeChip(x)+' <span class="small muted">'+sl.label+'</span></td><td class="small muted">'+x.date+'</td></tr>'; });
  h += '</tbody></table></div>';
  var s = S.sel && byId(S.sel);
  if (s) { var g = guide(s), sl = SUB[s.type+'/'+s.sub];
    h += '<aside class="drawer"><div style="display:flex;justify-content:space-between"><span class="small muted">Bounce details</span><button class="btn sm text" data-act="sel:">\u2715</button></div><h4>'+esc(s.bEmail)+'</h4><div class="small muted">'+name(s)+'</div>'+
      '<div class="sec"><b>What happened</b>'+typeChip(s)+' '+sl.label+'<p style="margin-top:4px">'+sl.explain+'</p>'+raw(s)+'</div>'+
      '<div class="sec"><b>What happens next</b>'+(s.type==='Permanent'?'We\u2019ve stopped sending to this address. It won\u2019t get your next campaign.':(g.kind==='paused'?'This was the 3rd temporary bounce in a row, so we\u2019ve paused the address.':'Still subscribed. We\u2019ll try again next campaign ('+s.soft+' of 3 temporary bounces in a row).'))+'</div>'+
      '<div class="sec"><b>What to do</b>'+(S.fix[s.id]?'<span class="fixed">\u2713 Updated to '+esc(S.fix[s.id])+'</span>':esc(g.next))+'</div>'+
      '<div class="sec" style="display:flex;gap:6px;flex-wrap:wrap">'+(g.act||S.fix[s.id]?'<button class="btn sm pri" data-act="edit:'+s.id+'">Edit subscriber</button>':'')+'<button class="btn sm">History</button></div>'+
      '<div class="sec small"><a href="#" data-act="explain">'+(S.explain?'Hide':'What do bounce types mean?')+'</a></div></aside>';
  } else h += '<aside class="drawer muted"><b style="color:var(--ink)">Click a bounce</b> to see what it means and what to do.<p style="margin-top:8px"><a href="#" data-act="explain">What do bounce types mean?</a></p></aside>';
  h += '</div>';
  return h;
}
function fixC(){
  var r = rows().filter(function(x){ return guide(x).kind!=='temp'; }), c = counts(), done = 0;
  r.forEach(function(x){ if (S.fix[x.id]) done++; });
  var others = rows().filter(function(x){ return guide(x).kind==='temp'; });
  var h = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><button class="btn sm text" data-act="back">\u2039 Back to bounces</button><b>Fix bounced addresses</b><span class="small muted" style="margin-left:auto">'+done+' of '+r.length+' updated</span></div>'+
    '<div class="progress"><i style="width:'+(r.length?done/r.length*100:0)+'%"></i></div>'+
    '<div class="alert info">These addresses won\u2019t get your next campaign. If you have a <b>new email</b> for someone, type it in and save: we update the same subscriber and set them back to Subscribed (no duplicates). Don\u2019t have one? Skip it.</div>'+
    '<div class="fixlist">';
  r.forEach(function(x){ var g = guide(x), sl = SUB[x.type+'/'+x.sub];
    h += '<div class="fixrow"><div class="who"><b>'+esc(x.bEmail)+'</b><span class="small muted">'+name(x)+' \u00b7 '+(g.kind==='paused'?'Paused after 3 temporary bounces':sl.label)+'</span></div>';
    if (S.fix[x.id]) h += '<span class="fixed" style="flex:1 1 200px">\u2713 Now '+esc(S.fix[x.id])+' \u00b7 Subscribed</span><button class="btn sm text" data-act="unfix:'+x.id+'">Undo</button>';
    else if (S.skipped[x.id]) h += '<span class="muted small" style="flex:1 1 200px">Skipped, stays Bounced</span><button class="btn sm text" data-act="unskip:'+x.id+'">Undo</button>';
    else h += '<input placeholder="New email address" data-fix="'+x.id+'" value="'+esc(S.fixDraft[x.id]||'')+'"><button class="btn sm pri" data-act="fixsave:'+x.id+'">Save</button><button class="btn sm" data-act="skip:'+x.id+'">Skip</button>'+
      (S.fixErr[x.id]?'<div class="small" style="flex-basis:100%;color:var(--err)">'+S.fixErr[x.id]+'</div>':'');
    h += '</div>'; });
  h += '</div>';
  if (others.length) h += '<div class="small muted" style="margin-top:10px">'+others.length+' temporary bounce'+(others.length>1?'s':'')+' not shown: still subscribed, we\u2019ll try again next campaign.</div>';
  return h;
}
function emptyState(){
  return '<div class="empty">No bounces recorded for this campaign. Every address accepted the email.</div>';
}

/* ---------- report dialog ---------- */
function reportDialog(){
  var c = counts(), b = S.scen==='none'?0:c.all;
  var body = S.screen==='fix' ? fixC() : (D==='a'?bouncesA():D==='b'?bouncesB():bouncesC());
  return '<div class="scrim"><div class="dlg"><div class="dlg-h">Campaign Report: '+esc(CAMP.name)+'</div><div class="dlg-b">'+
    '<div class="stats"><div class="stat"><b style="color:var(--blue)">'+CAMP.recipients+'</b><span>Sent</span></div><div class="stat"><b style="color:var(--ok)">'+(CAMP.recipients-b)+'</b><span>Delivered</span></div><div class="stat"><b style="color:#0288d1">'+CAMP.opens+'</b><span>Opens</span></div><div class="stat"><b style="color:#9c27b0">'+CAMP.clicks+'</b><span>Clicks</span></div><div class="stat"><b style="color:var(--err)">'+b+'</b><span>Bounces</span></div></div>'+
    '<div class="tabs"><span class="tab">Opens ('+CAMP.opens+')</span><span class="tab">Clicks ('+CAMP.clicks+')</span><span class="tab on">Bounces ('+b+')</span><span class="tab">Recipients ('+CAMP.recipients+')</span></div>'+
    body+'</div><div class="dlg-f"><button class="btn" data-act="close-report">Close</button></div></div></div>';
}

/* ---------- edit subscriber dialog (shared, carries the AC-4 guard) ---------- */
function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function dupOf(e, selfId){ var a = BOUNCES.concat(OTHERS); e = e.trim().toLowerCase(); for (var j=0;j<a.length;j++) if (a[j].id!==selfId && a[j].email.toLowerCase()===e) return a[j]; return null; }
function editDialog(){
  var x = byId(S.edit); if (!x) return '';
  var orig = x.email, changed = S.editEmail.trim().toLowerCase()!==orig.toLowerCase(), dup = changed && dupOf(S.editEmail, x.id), bad = changed && !validEmail(S.editEmail.trim());
  var wasBounced = x.status==='bounced', g = x.type ? guide(x) : null;
  var h = '<div class="scrim" style="z-index:7"><div class="dlg sm"><div class="dlg-h">Edit Subscriber</div><div class="dlg-b">';
  if (x.type && S.fix[x.id]) {
    h += '<div class="alert ok"><b>Updated.</b> Changed from '+esc(x.bEmail)+' after it bounced on Oct 6. '+esc(x.first)+' is Subscribed and gets your next campaign.</div>';
  } else if (wasBounced && x.type) {
    var sl = SUB[x.type+'/'+x.sub];
    h += '<div class="alert warn"><b>'+(g.kind==='paused'?'Paused after 3 temporary bounces in a row.':'This address bounced permanently on '+x.date.split(',')[0]+' ('+sl.label.toLowerCase()+').')+'</b> It won\u2019t be emailed again. To keep emailing '+esc(x.first)+', enter their <b>new email address</b> below and set Status to Subscribed.</div>';
  } else if (wasBounced) {
    h += '<div class="alert warn"><b>'+esc(x.note||'Bounced')+'.</b> To keep emailing '+esc(x.first)+', enter their new email address and set Status to Subscribed.</div>';
  } else if (x.type) {
    h += '<div class="alert info"><b>Temporary bounce ('+x.soft+' of 3 in a row).</b> '+esc(x.first)+' is still subscribed and will get your next campaign. If the address has changed, update it here.</div>';
  }
  h += '<div class="fld'+(dup||bad?' err':'')+'"><label>Email *</label><input id="editEmail" value="'+esc(S.editEmail)+'" data-input="email">';
  if (dup) h += '<div class="errt">'+esc(dup.email)+' is already a subscriber ('+name(dup)+', '+dup.status+'). <a href="#" data-act="edit:'+dup.id+'">Open '+name(dup)+'</a> instead so you don\u2019t end up with two copies.</div>';
  else if (bad) h += '<div class="errt">Enter a full email address.</div>';
  else if (wasBounced && changed) h += '<div class="help" style="color:var(--ok)">\u2713 New address. Status set to Subscribed. Lists, tags and history stay with '+esc(x.first)+'.</div>';
  else if (wasBounced) h += '<div class="help">Was this a typo? Fix it here. This updates '+esc(x.first)+'\u2019s existing record, it doesn\u2019t add a new one.</div>';
  h += '</div><div class="fld"><label>First Name</label><input value="'+esc(x.first)+'"></div><div class="fld"><label>Last Name</label><input value="'+esc(x.last)+'"></div>';
  var lockSub = wasBounced && !changed;
  h += '<div class="fld"><label>Status</label><select data-input="status"><option value="subscribed"'+(S.editStatus==='subscribed'?' selected':'')+(lockSub?' disabled':'')+'>Subscribed'+(lockSub?' (enter a new email first)':'')+'</option><option value="unsubscribed"'+(S.editStatus==='unsubscribed'?' selected':'')+'>Unsubscribed</option><option value="bounced"'+(S.editStatus==='bounced'?' selected':'')+'>Bounced</option></select>';
  if (lockSub) h += '<div class="help">This address already bounced, so re-subscribing it would just bounce again. Change the email to subscribe them.</div>';
  h += '</div><div class="fld"><label>Lists</label><div class="chips"><span class="chip blue">Clients</span><span class="chip blue">Insurance interest</span></div></div>';
  h += '</div><div class="dlg-f"><button class="btn" data-act="edit-cancel">Cancel</button><button class="btn pri" data-act="edit-save"'+(dup||bad?' disabled':'')+'>Save</button></div></div></div>';
  return h;
}

/* ---------- subscribers tab (filtered to Bounced) ---------- */
function subscribers(){
  var all = BOUNCES.concat(OTHERS).filter(function(x){ return S.subFilter==='all' || x.status===S.subFilter; });
  var h = '<div class="filterbar"><input placeholder="Search subscribers"><span class="small muted">Status:</span>'+
    ['all','subscribed','bounced','unsubscribed'].map(function(f){ return '<button class="btn sm '+(S.subFilter===f?'pri':'')+'" data-act="subf:'+f+'">'+f.charAt(0).toUpperCase()+f.slice(1)+'</button>'; }).join('')+'</div>';
  if (S.subFilter==='bounced') h += '<div class="alert info" style="margin-bottom:10px">Bounced subscribers aren\u2019t emailed. If you have a new address for someone, click <b>Edit</b>, change the email, and set Status to Subscribed. <a href="#" data-act="explain-subs">Why did they bounce?</a></div>';
  if (S.explain) h += explainPanel();
  h += '<table class="tbl"><thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Last bounce</th><th style="text-align:right">Actions</th></tr></thead><tbody>';
  all.forEach(function(x){ var st = x.status;
    var last = (x.type && S.fix[x.id]) ? 'Fixed \u00b7 new address' : x.type ? (guide(x).kind==='paused'?'3 temporary in a row':TYPE[x.type].short+' \u00b7 '+SUB[x.type+'/'+x.sub].label)+' \u00b7 Oct 6' : (x.note||'\u2014');
    h += '<tr><td>'+esc(x.email)+(S.fix[x.id]?'<div class="fixed">\u2713 Updated from '+esc(x.bEmail)+'</div>':'')+'</td><td>'+name(x)+'</td><td><span class="chip '+(st==='bounced'?'perm':st==='subscribed'?'ok':'gray')+'">'+st.charAt(0).toUpperCase()+st.slice(1)+'</span></td><td class="small muted">'+last+'</td><td style="text-align:right"><button class="btn sm" data-act="edit:'+x.id+'">Edit</button></td></tr>'; });
  h += '</tbody></table>';
  return h;
}

/* ---------- render ---------- */
var VIEWS = window.VIEWS || [];
function render(){
  var tabs = ['Campaigns','Lists','Default Lists','Subscribers','Forms','Reports','Settings'];
  var on = S.screen==='subs' ? 'Subscribers' : 'Reports';
  var h = '<div class="app'+(S.phone?' phone':'')+'"><div class="topbar"><span class="logo">Financial<span>Content</span></span><span class="who"><span>'+ADV.name+'</span><span class="av">'+ADV.init+'</span></span></div><div class="page"><h2>Email Campaigns</h2>'+
    '<div class="tabs">'+tabs.map(function(t){ return '<span class="tab'+(t===on?' on':'')+'"'+(t==='Reports'?' data-act="goto:list"':t==='Subscribers'?' data-act="subs"':'')+'>'+t+'</span>'; }).join('')+'</div>';
  h += S.screen==='subs' ? subscribers() : reportList();
  h += '</div>';
  if (S.screen==='bounces' || S.screen==='fix') h += reportDialog();
  if (S.edit) h += editDialog();
  h += '</div>';
  document.getElementById('stage').innerHTML = h;
  var app = document.querySelector('#stage .app'), need = 0;
  [].forEach.call(document.querySelectorAll('#stage .scrim > .dlg'), function(d){ need = Math.max(need, d.offsetHeight + 60); });
  if (need) app.style.minHeight = need + 'px';
  var btns = document.querySelectorAll('.demo-btn[data-view]');
  for (var j=0;j<btns.length;j++) btns[j].classList.toggle('on', btns[j].dataset.view===S.view);
  var pb = document.querySelector('.demo-btn[data-view="__phone"]'); if (pb) pb.classList.toggle('on', S.phone);
}
function toast(t){ var el = document.getElementById('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(function(){ el.classList.remove('on'); }, 3200); }
function openEdit(id){ var x = byId(id); S.edit = id; S.editEmail = x.email; S.editStatus = x.status; }
function applyView(id){
  var v; for (var j=0;j<VIEWS.length;j++) if (VIEWS[j].id===id) v = VIEWS[j];
  if (id==='__reset'){ var ph = S.phone; reset(); S.phone = ph; S.view = VIEWS[1] && VIEWS[1].id; document.getElementById('demoNote').innerHTML = ''; render(); return; }
  if (id==='__phone'){ S.phone = !S.phone; render(); return; }
  if (!v) return;
  var ph2 = S.phone; reset(); S.phone = ph2; S.view = id;
  var st = v.state || {}; for (var k in st) if (k!=='edit') S[k] = st[k];
  if (st.edit) { openEdit(st.edit); if (st.editEmail) { S.editEmail = st.editEmail; } }
  if (S.editEmail && S.edit) syncStatus();
  document.getElementById('demoNote').innerHTML = v.note || '';
  if (history.replaceState) history.replaceState(null, '', '#'+id);
  render();
}
function syncStatus(){ var x = byId(S.edit); if (!x || x.status!=='bounced') return; var changed = S.editEmail.trim().toLowerCase()!==x.email.toLowerCase();
  if (changed && validEmail(S.editEmail.trim()) && !dupOf(S.editEmail, x.id)) S.editStatus = 'subscribed'; else if (!changed) S.editStatus = 'bounced'; }
document.addEventListener('click', function(e){
  var vb = e.target.closest('.demo-btn[data-view]'); if (vb) { applyView(vb.dataset.view); return; }
  var a = e.target.closest('[data-act]'); if (!a) return;
  var act = a.dataset.act, arg = act.indexOf(':')>=0 ? act.split(':')[1] : null; act = act.split(':')[0];
  if (a.tagName==='A') e.preventDefault();
  switch(act){
    case 'open-report': S.screen = 'bounces'; break;
    case 'close-report': S.screen = 'list'; break;
    case 'goto': S.screen = arg; S.edit = null; break;
    case 'explain': S.explain = !S.explain; break;
    case 'explain-subs': S.explain = !S.explain; break;
    case 'pop': S.pop = arg || null; break;
    case 'filter': S.filter = arg; break;
    case 'subs': S.screen = 'subs'; S.subFilter = 'bounced'; S.explain = false; break;
    case 'subf': S.subFilter = arg; break;
    case 'sel': S.sel = arg || null; break;
    case 'fix': S.screen = 'fix'; break;
    case 'back': S.screen = 'bounces'; break;
    case 'edit': openEdit(arg); break;
    case 'edit-cancel': S.edit = null; break;
    case 'edit-save':
      var x = byId(S.edit), ne = S.editEmail.trim(), changed = ne.toLowerCase()!==x.email.toLowerCase();
      if (changed && (dupOf(ne, x.id) || !validEmail(ne))) return;
      if (changed && x.type) { S.fix[x.id] = ne; }
      if (changed) { x.email = ne; }
      x.status = S.editStatus;
      S.edit = null;
      toast(changed ? 'Saved. '+x.first+'\u2019s next campaign goes to '+ne+'.' : 'Saved.');
      break;
    case 'fixsave':
      var inp = document.querySelector('input[data-fix="'+arg+'"]'), v = (inp && inp.value || '').trim(), y = byId(arg);
      S.fixDraft[arg] = v;
      if (!validEmail(v)) { S.fixErr[arg] = 'Enter a full email address.'; break; }
      if (v.toLowerCase()===y.bEmail.toLowerCase()) { S.fixErr[arg] = 'That\u2019s the address that bounced. Enter a different one, or Skip.'; break; }
      var d = dupOf(v, y.id); if (d) { S.fixErr[arg] = esc(v)+' is already a subscriber ('+name(d)+'). Skip this one and keep '+esc(d.first)+'\u2019s existing record, so there are no duplicates.'; break; }
      delete S.fixErr[arg]; S.fix[arg] = v; y.email = v; y.status = 'subscribed'; toast('Updated '+y.first+' \u2192 '+v+' \u00b7 Subscribed'); break;
    case 'unfix': delete S.fix[arg]; byId(arg).status = 'bounced'; byId(arg).email = byId(arg).bEmail; break;
    case 'skip': S.skipped[arg] = true; break;
    case 'unskip': delete S.skipped[arg]; break;
    default: return;
  }
  render();
});
document.addEventListener('input', function(e){
  var t = e.target;
  if (t.dataset.input==='email') { S.editEmail = t.value; var pos = t.selectionStart; syncStatus(); render(); var n = document.getElementById('editEmail'); if (n) { n.focus(); n.setSelectionRange(pos,pos); } }
  else if (t.dataset.fix) { S.fixDraft[t.dataset.fix] = t.value; }
});
document.addEventListener('change', function(e){ if (e.target.dataset.input==='status') { S.editStatus = e.target.value; render(); } });
window.MOCK = {S:function(){return S;}, applyView:applyView, guide:guide, SUB:SUB, TYPE:TYPE};
window.addEventListener('hashchange', function(){ var h = (location.hash||'').slice(1); if (h && h!==S.view && VIEWS.some(function(v){return v.id===h;})) applyView(h); });
var start = (location.hash||'').slice(1);
applyView(VIEWS.some(function(v){return v.id===start;}) ? start : (VIEWS[1] ? VIEWS[1].id : VIEWS[0].id));
})();

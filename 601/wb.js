(function(){
  var q=new URLSearchParams(location.search);
  var s=q.get("s")||document.body.getAttribute("data-default");
  var phone=q.has("phone");
  if(phone)document.body.classList.add("phone");
  var el=document.querySelector('.scene[data-s="'+s+'"]')||document.querySelector('.scene');
  el.classList.add("on");s=el.getAttribute("data-s");
  document.querySelectorAll('.mockbar button[data-s]').forEach(function(b){
    if(b.getAttribute("data-s")===s)b.classList.add("on");
    b.onclick=function(){go(b.getAttribute("data-s"))};});
  document.querySelectorAll('.mockbar button[data-dev]').forEach(function(b){
    if((b.getAttribute("data-dev")==="phone")===phone)b.classList.add("on");
    b.onclick=function(){var u=new URLSearchParams(location.search);u.set("s",s);if(b.getAttribute("data-dev")==="phone")u.set("phone","1");else u.delete("phone");location.search=u.toString();};});
  function go(x){var u=new URLSearchParams(location.search);u.set("s",x);location.search=u.toString();}
  document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();go(a.getAttribute("data-go"));});});
  var sc=el;
  /* phone panes */
  var work=sc.querySelector('.work');
  if(work&&phone){var p=work.getAttribute('data-mpane');if(p)work.setAttribute('data-pane',p);}
  sc.querySelectorAll('.mtabs>span').forEach(function(t){t.onclick=function(){
    sc.querySelectorAll('.mtabs>span').forEach(function(x){x.classList.remove('on')});t.classList.add('on');work.setAttribute('data-pane',t.getAttribute('data-p'));};});
  if(work&&phone){var cur=work.getAttribute('data-pane');sc.querySelectorAll('.mtabs>span').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-p')===cur)});}
  /* right-pane tabs (B) */
  sc.querySelectorAll('.ptabs>span[data-rt]').forEach(function(t){t.onclick=function(){
    sc.querySelectorAll('.ptabs>span').forEach(function(x){x.classList.remove('on')});t.classList.add('on');work.setAttribute('data-rt',t.getAttribute('data-rt'));};});
  /* site nav pages */
  sc.querySelectorAll('.site .snav a[data-pg]').forEach(function(a){a.onclick=function(e){e.preventDefault();
    var site=a.closest('.site');site.querySelectorAll('.snav a').forEach(function(x){x.classList.remove('on')});a.classList.add('on');
    site.querySelectorAll('.pg').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-pg')===a.getAttribute('data-pg'))});};});
  /* checks tabs */
  sc.querySelectorAll('.ctabs').forEach(function(ct){ct.querySelectorAll('span').forEach(function(t){t.onclick=function(){
    ct.querySelectorAll('span').forEach(function(x){x.classList.remove('on')});t.classList.add('on');
    var box=ct.parentNode;box.querySelectorAll('[data-grp]').forEach(function(f){f.style.display=f.getAttribute('data-grp')===t.getAttribute('data-g')?'':'none'});};});
    var on=ct.querySelector('span.on');if(on)on.onclick();});
  /* click-to-jump: finding -> highlight, highlight -> finding */
  function showPreview(){if(!work)return;if(work.hasAttribute('data-rt')){work.setAttribute('data-rt','preview');sc.querySelectorAll('.ptabs>span').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-rt')==='preview')});}
    if(phone){work.setAttribute('data-pane','preview');sc.querySelectorAll('.mtabs>span').forEach(function(t){t.classList.toggle('on',t.getAttribute('data-p')==='preview')});}}
  sc.querySelectorAll('[data-jump]').forEach(function(b){b.onclick=function(e){e.preventDefault();var id=b.getAttribute('data-jump');showPreview();
    var site=sc.querySelector('.site');if(site){site.querySelectorAll('.pg').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-pg')==='home')});}
    sc.querySelectorAll('mark.hl').forEach(function(m){m.classList.remove('pulse','sel')});
    var m=sc.querySelector('mark.hl[data-f="'+id+'"]');if(m){m.scrollIntoView({block:'center',behavior:'smooth'});void m.offsetWidth;m.classList.add('pulse');}
    sc.querySelectorAll('.fc').forEach(function(f){f.classList.toggle('sel',f.getAttribute('data-f')===id)});};});
  sc.querySelectorAll('mark.hl').forEach(function(m){m.onclick=function(){var id=m.getAttribute('data-f');
    sc.querySelectorAll('.fc').forEach(function(f){var hit=f.getAttribute('data-f')===id;f.classList.toggle('sel',hit);if(hit){
      var ct=f.parentNode.querySelector('.ctabs>span[data-g="'+f.getAttribute('data-grp')+'"]');if(ct)ct.onclick();
      if(work&&work.hasAttribute('data-rt')){work.setAttribute('data-rt','checks');sc.querySelectorAll('.ptabs>span').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-rt')==='checks')});}
      if(phone&&f.closest('.bchecks')){work.setAttribute('data-pane','checks');}
      f.scrollIntoView({block:'nearest',behavior:'smooth'});}});};});
  /* chat shows the latest message; preview shows what changed */
  setTimeout(function(){sc.querySelectorAll('.msgs').forEach(function(m){m.scrollTop=m.scrollHeight});
    var c=sc.querySelector('.viewport .chg')||sc.querySelector('.viewport mark.hl');var vp=sc.querySelector('.viewport');
    if(c&&vp){vp.scrollTop=Math.max(0,c.offsetTop-40);}},50);
  /* scene preselect */
  var pre=sc.getAttribute('data-pulse');if(pre){var b=sc.querySelector('[data-jump="'+pre+'"]');if(b)setTimeout(function(){b.onclick(new Event('click'))},300);}
  /* ack tick gates Continue */
  sc.querySelectorAll('input.ack').forEach(function(c){var b=sc.querySelector('.needs-ack');function u(){if(b&&!b.hasAttribute('data-blocked'))b.classList.toggle('dis',!c.checked)}c.onchange=u;u();});
  /* domain radio */
  sc.querySelectorAll('.opt input[type=radio]').forEach(function(r){r.onchange=function(){sc.querySelectorAll('.opt').forEach(function(o){o.classList.toggle('on',o.contains(r))});};});
})();

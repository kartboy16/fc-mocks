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
  window.FCgo=go;
  document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();go(a.getAttribute("data-go"));});});
  /* preview filter chips */
  document.querySelectorAll('.filters').forEach(function(f){
    var tb=f.parentNode.querySelector('tbody');
    f.querySelectorAll('button').forEach(function(b){b.onclick=function(){
      f.querySelectorAll('button').forEach(function(x){x.classList.remove("on")});b.classList.add("on");
      var k=b.getAttribute("data-f");
      tb.querySelectorAll('tr').forEach(function(tr){var r=tr.getAttribute("data-f");
        tr.style.display=(k==="all"||r===k||(k==="skipped"&&r!=="ready"))?"":"none";});};});
    var on=f.querySelector('button.on');if(on)on.onclick();
  });
  /* mapping: Email is required */
  document.querySelectorAll('.maps').forEach(function(m){
    var msg=m.parentNode.querySelector('.maperr'),cont=document.querySelectorAll('.scene.on .needs-email');
    function chk(){var has=[].some.call(m.querySelectorAll('select'),function(x){return x.value==="email"});
      var dup=[].filter.call(m.querySelectorAll('select'),function(x){return x.value==="email"}).length>1;
      if(msg){msg.style.display=(has&&!dup)?"none":"";msg.textContent=dup?"Only one column can be Email.":"Pick which column has the email address. Email is the only required column.";}
      cont.forEach(function(c){c.classList.toggle("dis",!(has&&!dup))});}
    m.querySelectorAll('select').forEach(function(x){x.onchange=function(){x.parentNode.classList.remove("auto");chk();}});chk();
  });
  /* permission checkbox gates import */
  document.querySelectorAll('.scene.on input.perm').forEach(function(c){
    var b=document.querySelectorAll('.scene.on .needs-perm');
    function u(){b.forEach(function(x){x.classList.toggle("dis",!c.checked)})}c.onchange=u;u();});
  /* new-list radio */
  document.querySelectorAll('.scene.on input[name^="tl"]').forEach(function(r){r.onchange=function(){
    var sc=r.closest('.scene');sc.querySelectorAll('.tl-ex').forEach(function(x){x.style.display=r.value==="ex"?"":"none"});
    sc.querySelectorAll('.tl-new').forEach(function(x){x.style.display=r.value==="new"?"":"none"});};});
  /* download skipped rows as CSV */
  document.querySelectorAll('.dlcsv').forEach(function(a){a.onclick=function(e){e.preventDefault();
    var csv="email,first_name,last_name,reason\n"+(window.SKIPPED||[]).map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"'}).join(",")}).join("\n");
    var bl=new Blob([csv],{type:"text/csv"}),u=URL.createObjectURL(bl),l=document.createElement("a");l.href=u;l.download="skipped-rows.csv";document.body.appendChild(l);l.click();l.remove();};});
})();

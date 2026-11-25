(function(){
  var q=new URLSearchParams(location.search);
  var s=q.get("s")||document.body.getAttribute("data-default");
  var phone=q.has("phone");
  if(phone)document.body.classList.add("phone");
  var el=document.querySelector('.scene[data-s="'+s+'"]')||document.querySelector('.scene');
  el.classList.add("on");s=el.getAttribute("data-s");
  function go(x){var u=new URLSearchParams(location.search);u.set("s",x);location.search=u.toString();}
  document.querySelectorAll('.mockbar button[data-s]').forEach(function(b){
    if(b.getAttribute("data-s")===s)b.classList.add("on");
    b.onclick=function(){go(b.getAttribute("data-s"))};});
  document.querySelectorAll('.mockbar button[data-dev]').forEach(function(b){
    if((b.getAttribute("data-dev")==="phone")===phone)b.classList.add("on");
    b.onclick=function(){var u=new URLSearchParams(location.search);u.set("s",s);if(b.getAttribute("data-dev")==="phone")u.set("phone","1");else u.delete("phone");location.search=u.toString();};});
  document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();go(a.getAttribute("data-go"));});});
  /* typed confirmation: the action stays disabled until the exact text is typed */
  document.querySelectorAll('.scene.on input[data-confirm]').forEach(function(i){
    var want=i.getAttribute("data-confirm"),bs=document.querySelectorAll('.scene.on .needs-type'),m=i.parentNode.querySelector('.tmsg');
    function u(){var ok=i.value.trim().toLowerCase()===want.toLowerCase();i.classList.toggle("okv",ok);bs.forEach(function(b){b.classList.toggle("dis",!ok)});
      if(m)m.textContent=(i.value&&!ok)?"That doesn't match. Type "+want+" exactly.":"";}
    i.oninput=u;u();});
  /* restore point radios highlight their row */
  document.querySelectorAll('.scene.on .pts input[type=radio]').forEach(function(r){r.onchange=function(){
    r.closest('.pts').querySelectorAll('li').forEach(function(li){li.classList.remove("sel")});r.closest('li').classList.add("sel");};});
})();

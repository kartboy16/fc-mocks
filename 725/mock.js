(function(){var q=new URLSearchParams(location.search),s=q.get('s'),ph=q.get('phone')==='1';
var secs=[].slice.call(document.querySelectorAll('section[data-s]'));if(!s||!document.querySelector('section[data-s="'+s+'"]'))s=secs[0].dataset.s;
secs.forEach(function(x){x.classList.toggle('on',x.dataset.s===s)});
document.getElementById('stage').className=ph?'phone':'desk';
document.querySelectorAll('.bar a.st').forEach(function(a){var u=new URL(a.href,location.href);if(u.searchParams.get('s')===s&&!a.dataset.ph)a.classList.add('on');if(ph&&!a.dataset.ph){u.searchParams.set('phone','1');a.href=u.pathname.split('/').pop()+u.search}});
var pt=document.getElementById('pt');if(pt){var u=new URL(location.href);if(ph){u.searchParams.delete('phone');pt.textContent='Desktop'}else{u.searchParams.set('phone','1');pt.textContent='390'}u.searchParams.set('s',s);pt.href=u.pathname.split('/').pop()+u.search}
document.querySelectorAll('#stage a[href^="?"],#stage a[href*=".html?"]').forEach(function(a){if(ph&&a.href.indexOf('phone=')<0){a.href=a.getAttribute('href')+'&phone=1'}});
document.querySelectorAll('form[data-next]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();location.href=f.dataset.next+(ph?'&phone=1':'')})});
})();

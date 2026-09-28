// سرویس‌ورکر SRJ — پوسته برنامه کش می‌شود؛ داده‌ها همیشه زنده از گیت‌هاب می‌آیند.
const CACHE='srj-shell-v3';
const SHELL=['./SRJ_Personnel_App.html','./SRJ_Widget.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.url.includes('api.github.com'))return;
  e.respondWith(fetch(r).then(res=>{if(res.ok&&r.url.startsWith(self.location.origin)){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r,{ignoreSearch:true})));
});

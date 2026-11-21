const NAME='plantao360-ios-v4-icone-final';
const FILES=['./index.html','./manifest.webmanifest','./icone-plantao.png','./apple-touch-icon.png'];
self.addEventListener('install',ev=>{ev.waitUntil(caches.open(NAME).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',ev=>{ev.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n!==NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',ev=>{if(ev.request.method!=='GET'||new URL(ev.request.url).origin!==self.location.origin)return;ev.respondWith(fetch(ev.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(NAME).then(c=>c.put(ev.request,copy))}return r}).catch(()=>caches.match(ev.request).then(r=>r||caches.match('./index.html'))))});

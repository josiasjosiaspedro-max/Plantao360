const CACHE = 'plantao360-v3.1-20261125';
const HOME = new URL('./index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE);
    await cache.add(new Request(HOME,{cache:'reload'}));
    await Promise.all(['./manifest.webmanifest','./icone-plantao.png','./apple-touch-icon.png'].map(async path=>{try{await cache.add(path)}catch{}}));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    for(const key of await caches.keys()) if(/^plantao[-_ ]?360/i.test(key)&&key!==CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event=>{
  const request=event.request;
  if(request.method!=='GET'||!request.url.startsWith(self.registration.scope))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(request,{cache:'no-cache'});
      if(response.ok){try{await cache.put(request.mode==='navigate'?HOME:request,response.clone())}catch{}}
      return response;
    }catch(error){const cached=await cache.match(request.mode==='navigate'?HOME:request);if(cached)return cached;throw error;}
  })());
});

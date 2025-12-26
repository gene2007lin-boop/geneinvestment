const CACHE_NAME = 'site-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/resume.pdf'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e)=>{
  // stale-while-revalidate: respond from cache immediately, update in background
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(networkRes => {
        try{ if(networkRes && networkRes.ok){ const copy = networkRes.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(e.request, copy)); } }catch(e){}
        return networkRes;
      }).catch(()=>null);
      return cached || networkFetch || caches.match('/index.html');
    })
  );
});

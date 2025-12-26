const CACHE_NAME = 'site-cache-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/resume.pdf',
  '/assets/img/icon-192.svg',
  '/assets/img/icon-512.svg',
  '/assets/img/project-smart-notes.svg',
  '/projects/smart-notes/',
  '/projects/smart-notes/index.html',
  '/projects/smart-notes/app.js',
  '/data/content.json'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{ if(k!==CACHE_NAME) return caches.delete(k); }))).then(()=>self.clients.claim()));
});

// stale-while-revalidate: respond from cache immediately, update in background
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => {
      const networkFetch = fetch(req).then(networkRes => {
        try{ if(networkRes && networkRes.ok){ const copy = networkRes.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req, copy)); } }catch(err){}
        return networkRes;
      }).catch(()=>null);
      return cached || networkFetch || caches.match('/index.html');
    })
  );
});

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
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(!e.request.url.startsWith('http')) return res;
    const resClone = res.clone();
    caches.open(CACHE_NAME).then(c=>c.put(e.request,resClone));
    return res;
  }).catch(()=>caches.match('/index.html'))));
});

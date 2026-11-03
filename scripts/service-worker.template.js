const CACHE = 'cardnet-pwa-__VERSION__';
const PRECACHE = __PRECACHE__;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('cardnet-pwa-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.includes('chatgpt')) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        return response;
      } catch {
        const route = url.pathname === '/index.html' ? '/' : url.pathname.replace(/\/index\.html$/, '/');
        return await caches.match(route) || await caches.match('/offline.html');
      }
    })());
    return;
  }
  const allowed = url.pathname.startsWith('/assets/') || url.pathname.startsWith('/pwa/') || url.pathname.startsWith('/images/cardnet/') || url.pathname === '/manifest.webmanifest';
  if (!allowed) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        const photos = keys.filter(key => new URL(key.url).pathname.startsWith('/images/cardnet/'));
        if (photos.length > 20) await cache.delete(photos[0]);
      }
      return response;
    } catch (error) {
      if (url.pathname.startsWith('/images/cardnet/')) {
        const photo = await cache.match(`/pwa/photos/${url.pathname.split('/').pop().replace(/\.png$/, '.webp')}`);
        if (photo) return photo;
      }
      throw error;
    }
  })());
});

const CACHE = 'cfh-v6';
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(k) {
    return Promise.all(k.map(function(c) { return caches.delete(c); }));
  }).then(function() { return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e) {
  if (e.request.method === 'GET') {
    e.respondWith(fetch(e.request).catch(function() { return caches.match(e.request); }));
  }
});

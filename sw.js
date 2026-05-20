const CACHE = 'cfh-v3';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png']).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(function(cache) {
      return fetch(e.request).then(function(response) {
        if (response && response.status === 200) cache.put(e.request, response.clone());
        return response;
      }).catch(function() {
        return caches.match(e.request);
      });
    })
  );
});

const CACHE_NAME = 'praynow-v11';
const DYNAMIC_CACHE_NAME = 'praynow-dynamic-v11';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If we get a valid response, clone it and put it in dynamic cache
                const responseToCache = networkResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    // Ignore caching certain browser extensions or non-http/https schemes
                    if (event.request.url.startsWith('http')) {
                        cache.put(event.request, responseToCache);
                    }
                });
                return networkResponse;
            })
            .catch(() => {
                // On network failure, try the cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If it's a page navigation request and not found in cache, return the root page
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                    return null;
                });
            })
    );
});

const CACHE_NAME = 'praynow-v13';
const DYNAMIC_CACHE_NAME = 'praynow-dynamic-v13';
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
                // On network failure, try the cache. 
                // ignoreVary is CRITICAL for Next.js App Router because it alters the `RSC` and `Next-Router-Prefetch` headers between prefetch and click. 
                return caches.match(event.request, { ignoreVary: true }).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Let the request cleanly fail rather than serving the root page. 
                    // Returning '/' to App Router causes hydration locks on alternate routes.
                    return Response.error();
                });
            })
    );
});

const CACHE_NAME = 'praynow-v15';
const DYNAMIC_CACHE_NAME = 'praynow-dynamic-v15';
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
                const responseToCache = networkResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    if (event.request.url.startsWith('http')) {
                        // DO NOT CACHE Next.js prefetch payloads. They are only incomplete "layouts"
                        // and will permanently freeze the router if served instead of a full page offline!
                        if (event.request.headers.get('Next-Router-Prefetch') === '1') {
                            return;
                        }
                        cache.put(event.request, responseToCache);
                    }
                });
                return networkResponse;
            })
            .catch(() => {
                // ignoreVary is CRITICAL for Next.js App Router
                return caches.match(event.request, { ignoreVary: true }).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // For hard navigations (e.g., refreshing or loading an unvisited route directly), 
                    // serve the root HTML as an App Shell. Next.js will boot up and dynamically 
                    // request the correct server components!
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                    if (event.request.headers.get('RSC') === '1') {
                        return new Response('Offline', { status: 504, statusText: "Offline" });
                    }
                    return Response.error();
                });
            })
    );
});

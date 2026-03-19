const CACHE_NAME = 'praynow-v16';
const DYNAMIC_CACHE_NAME = 'praynow-dynamic-v16';
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
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                const responseToCache = networkResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    if (event.request.url.startsWith('http')) {
                        cache.put(event.request, responseToCache);
                    }
                });
                return networkResponse;
            })
            .catch(async () => {
                const cache = await caches.open(DYNAMIC_CACHE_NAME);
                // Match all entries for the base URL path (ignoring volatile _rsc query hashes)
                const cachedResponses = await cache.matchAll(event.request, { ignoreSearch: true });

                if (cachedResponses && cachedResponses.length > 0) {
                    const isRscRequest = event.request.headers.get('RSC') === '1';

                    // Filter through the exact content-type to separate HTML app shells from JSON RSC payloads
                    for (const response of cachedResponses) {
                        const contentType = response.headers.get('content-type') || '';

                        if (isRscRequest && contentType.includes('text/x-component')) {
                            return response; // Exact RSC match found!
                        }
                        if (!isRscRequest && contentType.includes('text/html')) {
                            return response; // Exact HTML match found!
                        }
                    }

                    // If we only have an RSC payload but the browser wants HTML (hard reload), 
                    // or vice versa, fall through to error rather than fatally locking the browser.
                }

                // Native hard navigation fallback: display nothing/let browser show offline dinosaur
                return Response.error();
            })
    );
});

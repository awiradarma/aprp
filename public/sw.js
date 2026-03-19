const CACHE_NAME = 'praynow-v18';
const DYNAMIC_CACHE_NAME = 'praynow-dynamic-v18';
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
        Promise.race([
            fetch(event.request),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 4000))
        ])
            .then((networkResponse) => {
                const responseToCache = networkResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    if (event.request.url.startsWith('http')) {
                        // DO NOT CACHE Next.js prefetch payloads. They freeze the router offline.
                        if (event.request.headers.get('Next-Router-Prefetch') === '1') {
                            return;
                        }
                        cache.put(event.request, responseToCache);
                    }
                });
                return networkResponse;
            })
            .catch(async () => {
                const cache = await caches.open(DYNAMIC_CACHE_NAME);

                // 1. First attempt an exact standard match (ignoring headers like Next-Router-Prefetch)
                // This successfully handles 99% of requests including JS chunks, CSS, Images, and fully exact page routes.
                const exactMatch = await cache.match(event.request, { ignoreVary: true });
                if (exactMatch) {
                    return exactMatch;
                }

                // 2. If exact match fails (often because the Next.js `_rsc` build query hash rotated),
                // scrape all matched base paths and manually identify the exact Content-Type payload
                const cachedResponses = await cache.matchAll(event.request, { ignoreSearch: true });

                if (cachedResponses && cachedResponses.length > 0) {
                    const isRscRequest = event.request.headers.get('RSC') === '1';

                    // Filter through the exact content-type to separate HTML app shells from JSON RSC payloads
                    for (const response of cachedResponses) {
                        const contentType = response.headers.get('content-type') || '';

                        if (isRscRequest && contentType.includes('text/x-component')) {
                            return response; // Exact RSC match found!
                        }
                        if (event.request.mode === 'navigate' && contentType.includes('text/html')) {
                            return response; // Exact HTML match found!
                        }
                    }

                    // 3. Last ditch fallback: if it's a miscellaneous failed asset (like a generic font with query strings),
                    // just return the first matched variation.
                    return cachedResponses[0];
                }

                // Native hard navigation fallback: display nothing/let browser show offline dinosaur
                return Response.error();
            })
    );
});

const CACHE_NAME = 'praynow-v19';
const DYNAMIC_CACHE_NAME = 'praynow-dynamic-v19';
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

                // RSC Navigations: Provide a clean 504 to let Next Router catch it instead of freezing memory
                if (event.request.headers.get('RSC') === '1') {
                    return new Response('Offline', { status: 504, statusText: "Offline" });
                }

                // Native hard navigation fallback: PWA Standalone hides the browser Dinosaur,
                // resulting in a permanent blank white screen. We MUST return a synthetic HTML response!
                if (event.request.mode === 'navigate') {
                    return new Response(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Offline - PrayNow</title>
                            <style>
                                body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
                                h1 { margin-bottom: 8px; font-weight: 900; }
                                p { margin-bottom: 24px; color: #64748b; text-align: center; padding: 0 20px; line-height: 1.5;}
                                button { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); }
                            </style>
                        </head>
                        <body>
                            <span style="font-size: 64px; margin-bottom: 16px;">☁️</span>
                            <h1>You are offline</h1>
                            <p>This page wasn't saved fully to your device. Please reconnect to the internet to view it.</p>
                            <button onclick="window.location.href='/'">Go to Home Screen</button>
                        </body>
                        </html>
                    `, { headers: { 'Content-Type': 'text/html' } });
                }

                return Response.error();
            })
    );
});

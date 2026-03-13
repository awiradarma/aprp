importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: self.location.search.split('apiKey=')[1]?.split('&')[0] || '',
    projectId: self.location.search.split('projectId=')[1]?.split('&')[0] || '',
    messagingSenderId: self.location.search.split('messagingSenderId=')[1]?.split('&')[0] || '',
    appId: self.location.search.split('appId=')[1]?.split('&')[0] || '',
});

const messaging = firebase.messaging();

// Raw Push Listener (The most reliable for iOS 16.4+)
self.addEventListener('push', (event) => {
    console.log('[SW] Push Received');
    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        console.log('[SW] Push was not JSON, likely handled by OS notification block');
        return;
    }

    const title = data.notification?.title || data.data?.title || 'New Prayer Update';
    const options = {
        body: data.notification?.body || data.data?.body || '',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'praynow-alert'
    };

    event.waitUntil(
        Promise.all([
            self.registration.showNotification(title, options),
            'setAppBadge' in self.navigator ? self.navigator.setAppBadge(1) : Promise.resolve()
        ])
    );
});

// Firebase background listener (Backup)
messaging.onBackgroundMessage((payload) => {
    console.log('[Firebase SW] Background message incoming', payload);
});

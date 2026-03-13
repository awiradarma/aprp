importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: self.location.search.split('apiKey=')[1]?.split('&')[0] || '',
    projectId: self.location.search.split('projectId=')[1]?.split('&')[0] || '',
    messagingSenderId: self.location.search.split('messagingSenderId=')[1]?.split('&')[0] || '',
    appId: self.location.search.split('appId=')[1]?.split('&')[0] || '',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received:', payload);

    // Manual display fallback with deduplication tag
    const title = payload.data?.title || payload.notification?.title || 'New Prayer Update';
    const options = {
        body: payload.data?.body || payload.notification?.body || '',
        icon: '/icon-192x192.png',
        tag: 'praynow-alert' // The key to preventing double-notifications
    };

    self.registration.showNotification(title, options);

    // Update badge
    if ('setAppBadge' in self.navigator) {
        self.navigator.setAppBadge(1).catch(() => { });
    }
});

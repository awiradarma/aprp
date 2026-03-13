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
    console.log('[SW] Background message:', payload);

    const title = payload.notification?.title || payload.data?.title || 'New Prayer Update';
    const options = {
        body: payload.notification?.body || payload.data?.body || '',
        icon: '/icon-192x192.png',
        tag: 'praynow-notification', // This collapses duplicates into one
        renotify: true
    };

    self.registration.showNotification(title, options);

    if ('setAppBadge' in self.navigator) {
        self.navigator.setAppBadge(1).catch(() => { });
    }
});

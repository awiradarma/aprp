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
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Only show manual notification if the 'notification' object is missing
    // (meaning the OS hasn't handled it automatically)
    if (!payload.notification) {
        // Use data payload since we've silenced the automatic notification block
        const notificationTitle = payload.data?.title || 'New Prayer Update';
        const notificationOptions = {
            body: payload.data?.body || '',
            icon: '/icon-192x192.png'
        };
        self.registration.showNotification(notificationTitle, notificationOptions);
    } else {
        console.log('Notification handled by OS');
    }

    // Set app badge if supported
    if ('setAppBadge' in self.navigator) {
        self.navigator.setAppBadge(1).catch((error) => {
            console.error('Error setting app badge:', error);
        });
    }
});

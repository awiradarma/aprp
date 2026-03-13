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
    // We no longer call self.registration.showNotification here because 
    // the 'notification' object in the FCM payload triggers the OS banner automatically.
    // This prevents double-notifications on iOS.
    console.log('Background message handled by OS');

    // Set app badge if supported
    if ('setAppBadge' in self.navigator) {
        self.navigator.setAppBadge(1).catch((error) => {
            console.error('Error setting app badge:', error);
        });
    }
});

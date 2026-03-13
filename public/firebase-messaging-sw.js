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

    // On iOS 16.4+ PWAs, if the server sends a 'notification' block 
    // AND a valid 'aps' badge count, the OS handles the UI automatically.
    // We don't need to call registration.showNotification() anymore.

    // We only keep this listener active to allow the badge to be updated 
    // if the OS doesn't do it automatically.
    if ('setAppBadge' in self.navigator) {
        self.navigator.setAppBadge(1).catch(() => { });
    }
});

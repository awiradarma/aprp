'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('SW registered: ', registration);
                    },
                    (registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    }
                );
            });
        }

        // Clear app badge if supported when user enters the app
        if ('clearAppBadge' in navigator) {
            (navigator as any).clearAppBadge().catch((err: any) => console.error(err));
        }
    }, []);

    return null;
}

'use client';

import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-slate-800 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border-2 border-slate-600/50">
                <span className="text-lg">☁️</span>
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Working Offline</span>
                    <span className="text-[10px] opacity-80 font-medium">Changes will sync when online.</span>
                </div>
            </div>
        </div>
    );
}

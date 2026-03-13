'use client';

import { useState, useEffect } from 'react';
import { messaging } from '@/lib/firebase/client';
import { getToken } from 'firebase/messaging';
import { savePushTokenAction } from '@/app/actions/notifications';

export default function PushNotificationConsent({ t }: { t: any }) {
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!('Notification' in window)) {
                setPermission('unsupported');
            } else {
                setPermission(Notification.permission);
            }
        }
    }, []);

    const handleEnable = async () => {
        if (!messaging || permission === 'unsupported') return;

        setIsLoading(true);
        try {
            const status = await Notification.requestPermission();
            setPermission(status);

            if (status === 'granted') {
                const swRegistration = await navigator.serviceWorker.register(
                    `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '')}&projectId=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '')}&messagingSenderId=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '')}&appId=${encodeURIComponent(process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '')}`
                );

                const token = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                    serviceWorkerRegistration: swRegistration
                });

                if (token) {
                    await savePushTokenAction(token);
                    setIsSuccess(true);
                }
            }
        } catch (error) {
            console.error('Push consent error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (permission === 'granted' && !isSuccess) return null;
    if (permission === 'denied') return null;
    if (permission === 'unsupported') return null;

    return (
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="text-8xl">🔔</span>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-black">{isSuccess ? "Notifications Active!" : "Never misses a prayer"}</h3>
                    <p className="text-sm opacity-90 font-medium max-w-md">
                        {isSuccess
                            ? "We'll notify you when someone intercedes for your requests."
                            : "Enable push notifications to be alerted when a brother or sister in Christ prays for your request."}
                    </p>
                </div>

                {!isSuccess && (
                    <button
                        onClick={handleEnable}
                        disabled={isLoading}
                        className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? "Enabling..." : "Enable Alerts"}
                    </button>
                )}

                {isSuccess && (
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30 flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <span className="text-sm font-bold">Configured</span>
                    </div>
                )}
            </div>
        </section>
    );
}

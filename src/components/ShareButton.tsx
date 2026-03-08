"use client";
import { useState } from "react";
import type { T } from "@/lib/i18n";

export default function ShareButton({ id, t }: { id: string; t: T }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/p/${id}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: t.prayer.prayerRequest, text: t.prayer.prayerRequest, url });
                return;
            } catch { /* user cancelled */ }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            window.prompt("Copy this link:", url);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
            {copied ? t.prayer.shareCopied : t.prayer.shareUrl}
        </button>
    );
}

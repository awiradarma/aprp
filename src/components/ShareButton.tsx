"use client";
import { useState } from "react";

export default function ShareButton({ id }: { id: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/p/${id}`;

        // Use the native Web Share API if available (great on mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Prayer Request",
                    text: "Join me in prayer for this request.",
                    url,
                });
                return;
            } catch {
                // User cancelled share dialog — fall through to clipboard copy
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Last resort: manual prompt
            window.prompt("Copy this link:", url);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
            {copied ? "✓ Link Copied!" : "Share this URL"}
        </button>
    );
}

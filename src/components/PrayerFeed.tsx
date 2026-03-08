"use client";
import { useState } from "react";
import { fetchDiscoverPrayers, type DiscoverPrayer } from "@/app/actions/discover";
import Link from "next/link";
import type { T } from "@/lib/i18n";

export function timeAgo(iso: string, t: T["discover"]): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return t.justNow;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t.mAgo.replace("{n}", String(minutes));
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t.hAgo.replace("{n}", String(hours));
    return t.dAgo.replace("{n}", String(Math.floor(hours / 24)));
}

export function PrayerCard({ prayer, t }: { prayer: DiscoverPrayer; t: T }) {
    return (
        <Link href={`/p/${prayer.id}`}
            className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
            <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-lg mt-0.5">
                    {prayer.locationString ? "📍" : "🌐"}
                </div>
                <div className="flex-1 min-w-0">
                    {prayer.locationString && (
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{prayer.locationString}</p>
                    )}
                    <p className="text-gray-800 italic leading-relaxed line-clamp-3">&quot;{prayer.text}&quot;</p>
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">{timeAgo(prayer.createdAt, t.discover)}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                🙏 <span className="font-semibold text-gray-700">{prayer.prayedCount}</span> {t.discover.praying.replace("{n}", "").trim()}
                            </span>
                            <span className="text-xs font-semibold text-blue-600 group-hover:underline">{t.discover.joinPrayer}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

interface Props {
    initialPrayers: DiscoverPrayer[];
    initialCursor: string | null;
    totalShown: number;
    t: T;
}

export default function PrayerFeed({ initialPrayers, initialCursor, totalShown, t }: Props) {
    const [prayers, setPrayers] = useState<DiscoverPrayer[]>(initialPrayers);
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        if (!cursor || loading) return;
        setLoading(true);
        try {
            const result = await fetchDiscoverPrayers(cursor);
            setPrayers((prev) => [...prev, ...result.prayers]);
            setCursor(result.nextCursor);
        } finally {
            setLoading(false);
        }
    };

    if (prayers.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-4xl mb-4">🌍</p>
                <h2 className="text-lg font-semibold text-gray-800">{t.discover.noPrayers}</h2>
                <p className="text-sm text-gray-500 mt-2">{t.discover.noPrayersSub}</p>
                <Link href="/" className="mt-4 inline-block text-blue-600 font-medium text-sm hover:underline">{t.discover.submitRequest}</Link>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {prayers.map((prayer) => (
                    <PrayerCard key={prayer.id} prayer={prayer} t={t} />
                ))}
            </div>

            {cursor && (
                <div className="text-center pt-4">
                    <button onClick={loadMore} disabled={loading}
                        className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                        {loading ? t.discover.loading : t.discover.loadMore}
                    </button>
                </div>
            )}

            {!cursor && prayers.length >= totalShown && (
                <p className="text-center text-sm text-gray-400 pt-4">
                    {t.discover.endOfFeed.replace("{n}", String(prayers.length))} 🙏
                </p>
            )}
        </>
    );
}

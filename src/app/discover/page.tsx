import Link from "next/link";
import { fetchDiscoverPrayers } from "@/app/actions/discover";

function timeAgo(iso: string): string {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default async function DiscoverPage() {
    const prayers = await fetchDiscoverPrayers(50);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <main className="w-full max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Global Requests</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {prayers.length} prayer{prayers.length !== 1 ? "s" : ""} from around the world
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">
                            Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            + New Request
                        </Link>
                    </div>
                </header>

                {/* Empty State */}
                {prayers.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <p className="text-4xl mb-4">🌍</p>
                        <h2 className="text-lg font-semibold text-gray-800">No prayers yet</h2>
                        <p className="text-sm text-gray-500 mt-2">Be the first to submit a prayer request.</p>
                        <Link href="/" className="mt-4 inline-block text-blue-600 font-medium text-sm hover:underline">
                            Submit a request →
                        </Link>
                    </div>
                )}

                {/* Prayer Cards */}
                <div className="space-y-4">
                    {prayers.map((prayer) => (
                        <Link
                            key={prayer.id}
                            href={`/p/${prayer.id}`}
                            className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                        >
                            <div className="flex gap-4 items-start">
                                {/* Location Pin Icon */}
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-lg mt-0.5">
                                    {prayer.locationString ? "📍" : "🌐"}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Location tag */}
                                    {prayer.locationString && (
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                                            {prayer.locationString}
                                        </p>
                                    )}

                                    {/* Prayer text */}
                                    <p className="text-gray-800 italic leading-relaxed line-clamp-3">
                                        &quot;{prayer.text}&quot;
                                    </p>

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-gray-400">{timeAgo(prayer.createdAt)}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                🙏 <span className="font-semibold text-gray-700">{prayer.prayedCount}</span> praying
                                            </span>
                                            <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                                                Join in Prayer →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

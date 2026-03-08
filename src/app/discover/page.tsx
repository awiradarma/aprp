import Link from "next/link";
import { fetchDiscoverPrayers } from "@/app/actions/discover";
import PrayerFeed from "@/components/PrayerFeed";

export default async function DiscoverPage() {
    const { prayers, nextCursor } = await fetchDiscoverPrayers();

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <main className="w-full max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Global Requests</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Prayers from around the world
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

                {/* Paginated Feed */}
                <PrayerFeed
                    initialPrayers={prayers}
                    initialCursor={nextCursor}
                    totalShown={prayers.length}
                />
            </main>
        </div>
    );
}

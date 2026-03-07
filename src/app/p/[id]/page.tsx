import { adminDb } from "@/lib/firebase/server";
import { notFound } from "next/navigation";
import { intercedeAction } from "@/app/actions/intercede";
import { cookies } from "next/headers";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import PrayerOwnerActions from "@/components/PrayerOwnerActions";
import IntercessionMap from "@/components/IntercessionMap";
import { fetchIntercessionLocations } from "@/app/actions/intercessions";

export default async function PrayerPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let prayer = null;
    try {
        const doc = await adminDb.collection("prayers").doc(id).get();
        if (doc.exists) {
            prayer = doc.data();
        }
    } catch (err) {
        console.error("Firebase error", err);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-xl shadow text-center max-w-sm">
                    <h2 className="text-red-600 text-xl font-bold mb-2">Database Not Connected</h2>
                    <p className="text-gray-600">Please configure the .env Firebase credentials to view requests.</p>
                </div>
            </div>
        );
    }

    if (!prayer) {
        notFound();
    }

    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    const isOwner = !!(uuid && prayer.requesterId === uuid);
    const isAnswered = !!(prayer.answeredAt);

    let hasInterceded = false;
    if (uuid && !isOwner) {
        const intercessionDoc = await adminDb.collection("user_intercessions").doc(`${uuid}_${id}`).get();
        hasInterceded = intercessionDoc.exists;
    }

    // Fetch intercessor locations for the mini-map
    const intercessionLocations = await fetchIntercessionLocations(id);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex justify-between items-center px-5 py-3 bg-white border-b border-gray-100 text-sm">
                    <Link href="/" className="text-blue-600 hover:underline font-medium">← Home</Link>
                    <Link href="/discover" className="text-blue-600 hover:underline font-medium">🌍 Discover</Link>
                </div>

                <div className={`p-6 text-center ${isAnswered ? 'bg-green-600' : 'bg-blue-600'}`}>
                    <p className="text-sm uppercase tracking-wider font-semibold mb-1 opacity-75 text-white">
                        {isAnswered ? '🙌 Answered Prayer' : 'Prayer Request'}
                    </p>
                    <h1 className="text-lg font-semibold text-white italic leading-snug">
                        &ldquo;{prayer.text.length > 80 ? prayer.text.slice(0, 80) + "…" : prayer.text}&rdquo;
                    </h1>
                </div>

                <div className="p-6 space-y-6">
                    <div className={`border p-5 rounded-xl text-lg italic leading-relaxed ${isAnswered ? 'bg-green-50 text-green-900 border-green-100' : 'bg-blue-50 text-blue-900 border-blue-100'}`}>
                        &quot;{prayer.text}&quot;
                    </div>

                    <div className="flex justify-between items-center text-sm border-t pt-4">
                        <span className="text-gray-500">
                            {prayer.createdAt ? new Date(prayer.createdAt.toDate ? prayer.createdAt.toDate() : prayer.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${isAnswered ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {prayer.prayedCount || 0} Prayed
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Non-owners: show "I Prayed" form with optional location */}
                        {!isOwner && !hasInterceded && (
                            <form action={intercedeAction} className="space-y-2">
                                <input type="hidden" name="prayerId" value={id} />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Your location (optional) e.g. Lagos, Nigeria"
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-700"
                                />
                                <p className="text-xs text-gray-400">📍 Location is optional and privacy-preserving. Your exact coordinates are never stored.</p>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-sm"
                                >
                                    🙏 I Prayed
                                </button>
                            </form>
                        )}

                        {/* Already interceded */}
                        {!isOwner && hasInterceded && (
                            <div className="w-full bg-green-100 text-green-800 border border-green-200 py-3 px-4 rounded-lg font-semibold text-center">
                                ✓ You Prayed For This
                            </div>
                        )}

                        <ShareButton id={id} />

                        {/* Owner-only: edit + mark as answered */}
                        {isOwner && (
                            <PrayerOwnerActions
                                prayerId={id}
                                currentText={prayer.text}
                                isAnswered={isAnswered}
                            />
                        )}
                    </div>

                    {/* Intercessor mini-map — visible to everyone when locations exist */}
                    <IntercessionMap locations={intercessionLocations} />
                </div>
            </main>
        </div>
    );
}

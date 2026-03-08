import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { getOrCreateRecoveryCode } from "../actions/recovery";
import Link from "next/link";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    if (!uuid) return <div className="p-8 text-center text-red-500">Not authenticated.</div>;

    const recoveryCode = await getOrCreateRecoveryCode();

    // Fetch submitted prayers
    const prayersQuery = await adminDb.collection("prayers").where("requesterId", "==", uuid).get();
    const submittedPrayers = prayersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    // Fetch intercessions
    const intercessionsQuery = await adminDb.collection("user_intercessions").where("userId", "==", uuid).get();
    const intercessionDocs = intercessionsQuery.docs.map(doc => doc.data() as { prayerId: string });

    const intercededPrayers = [];
    for (const intercession of intercessionDocs) {
        const prayerDoc = await adminDb.collection("prayers").doc(intercession.prayerId).get();
        if (prayerDoc.exists) {
            intercededPrayers.push({ id: intercession.prayerId, ...prayerDoc.data() as any });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <main className="w-full max-w-4xl space-y-8">
                <header className="flex justify-between items-center text-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Prayers</h1>
                    <div className="flex gap-3">
                        <Link href="/discover" className="text-blue-600 hover:text-blue-800 font-medium text-sm">🌍 Discover</Link>
                        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-sm">New Request</Link>
                        <Link href="/faq" className="text-gray-400 hover:text-blue-600 font-medium text-sm">Privacy & FAQ</Link>
                    </div>
                </header>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">🔑 Your Prayer Key</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        This is your only connection to your prayers — like a key to an anonymous journal. Save it somewhere safe. If you ever switch devices or clear your browser, enter this key to restore your prayers. <Link href="/faq" className="text-blue-600 hover:underline">Learn how anonymity works →</Link>
                    </p>
                    <div className="bg-blue-50 text-blue-900 border border-blue-200 p-4 rounded-xl text-center mb-4">
                        <span className="font-mono text-2xl font-bold tracking-[0.2em]">{recoveryCode || "N/A"}</span>
                    </div>

                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Your Prayer Requests</h2>
                        {submittedPrayers.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No prayer requests submitted yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {submittedPrayers.map((p) => (
                                    <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <p className="text-gray-800 italic mb-3">&quot;{p.text}&quot;</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <Link href={`/p/${p.id}`} className="text-blue-600 font-medium hover:underline">View</Link>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{p.prayedCount || 0} Prayed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Prayer Requests You Followed</h2>
                        {intercededPrayers.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">You haven't interceded for any requests yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {intercededPrayers.map((p) => (
                                    <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <p className="text-gray-800 italic mb-3">&quot;{p.text}&quot;</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <Link href={`/p/${p.id}`} className="text-blue-600 font-medium hover:underline">View</Link>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

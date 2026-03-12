
import { adminDb } from "@/lib/firebase/server";
import { notFound } from "next/navigation";
import { approvePrayerAction, deletePrayerAction, dismissPrayerAction } from "@/app/actions/admin";

interface Props {
    params: Promise<{ key: string }>;
}

export default async function AdminPage({ params }: Props) {
    const { key } = await params;

    // Verify key
    const secretDoc = await adminDb.collection("admin_config").doc("secret").get();
    if (!secretDoc.exists || secretDoc.data()?.key !== key) {
        return notFound();
    }

    // Fetch flagged prayers
    const snapshot = await adminDb.collection("prayers")
        .where("moderation.status", "==", "flagged")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();

    const flaggedPrayers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as any[];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">🛡️ Admin Shield</h1>
                        <p className="text-gray-500">Content Moderation & Review Dashboard</p>
                    </div>
                    <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Secure Session
                    </div>
                </header>

                <div className="space-y-6">
                    {flaggedPrayers.length === 0 && (
                        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
                            <span className="text-4xl mb-4 block">✅</span>
                            <h2 className="text-xl font-bold text-gray-900">All Clear</h2>
                            <p className="text-gray-500">No prayers are currently flagged for review.</p>
                        </div>
                    )}

                    {flaggedPrayers.map((prayer) => (
                        <div key={prayer.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                        Prayer ID: {prayer.id}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                        "{prayer.text}"
                                    </h3>
                                </div>
                                <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                                    {prayer.moderation?.flaggedReason || "Flagged"}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <form action={approvePrayerAction.bind(null, key, prayer.id)}>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                        Approve & Public
                                    </button>
                                </form>
                                <form action={dismissPrayerAction.bind(null, key, prayer.id)}>
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                        Keep Private
                                    </button>
                                </form>
                                <form action={deletePrayerAction.bind(null, key, prayer.id)}>
                                    <button className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

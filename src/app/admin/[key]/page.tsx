
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

    // Analytics Data
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalUsers,
        activeUsers24h,
        activeUsers7d,
        activeUsers30d,
        staleUsers,
        totalPrayers,
        answeredPrayers,
        publicPrayers,
        privatePrayers,
        totalIntercessions
    ] = await Promise.all([
        adminDb.collection("users").count().get(),
        adminDb.collection("users").where("lastSeenAt", ">", oneDayAgo).get(),
        adminDb.collection("users").where("lastSeenAt", ">", sevenDaysAgo).get(),
        adminDb.collection("users").where("lastSeenAt", ">", thirtyDaysAgo).get(),
        adminDb.collection("users").where("lastSeenAt", "<", sevenDaysAgo).get(),
        adminDb.collection("prayers").count().get(),
        adminDb.collection("prayers").where("answeredAt", "!=", null).get(),
        adminDb.collection("prayers").where("visibility", "==", "public").get(),
        adminDb.collection("prayers").where("visibility", "==", "private").get(),
        adminDb.collection("user_intercessions").count().get()
    ]);

    const totalPrayersCount = totalPrayers.data().count;
    const intercessionRate = totalPrayersCount > 0
        ? ((totalIntercessions.data().count / totalPrayersCount) * 100).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-24">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">🛡️ Admin Shield</h1>
                        <p className="text-gray-500">Content Moderation & Review Dashboard</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <form action={async () => {
                            "use server";
                            const { cleanupAbandonedSessionsAction } = await import("@/app/actions/admin");
                            await cleanupAbandonedSessionsAction(key);
                        }}>
                            <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                🧹 Clean Stale Sessions ({staleUsers.size})
                            </button>
                        </form>
                        <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-red-200">
                            Secure Session
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Souls</span>
                        <div className="text-3xl font-black text-blue-600">{totalUsers.data().count}</div>
                        <div className="text-[10px] text-green-600 font-bold mt-1">+{activeUsers24h.size} active (24h)</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Prayers</span>
                        <div className="text-3xl font-black text-indigo-600">{totalPrayersCount}</div>
                        <div className="text-[10px] text-indigo-500/60 font-bold mt-1">{answeredPrayers.size} answered</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm border-l-4 border-l-orange-500">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Flagged Content</span>
                        <div className="text-3xl font-black text-orange-600">{flaggedPrayers.length}</div>
                        <div className="text-[10px] text-orange-500/60 font-bold mt-1">Pending review</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Engagement</span>
                        <div className="text-3xl font-black text-pink-600">{intercessionRate}%</div>
                        <div className="text-[10px] text-pink-500/60 font-bold mt-1">{totalIntercessions.data().count} intercessions</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b pb-4">Platform Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Privacy Breakdown</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 font-medium">Public</span>
                                        <span className="font-black text-gray-900">{publicPrayers.size}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{ width: `${(publicPrayers.size / (totalPrayersCount || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500 font-medium">Shadowed</span>
                                        <span className="font-black text-gray-900">{privatePrayers.size}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500"
                                            style={{ width: `${(privatePrayers.size / (totalPrayersCount || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Traffic Flow</h3>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">24 Hours</span>
                                        <span className={`font-black ${activeUsers24h.size > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                            {activeUsers24h.size} souls
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">7 Days</span>
                                        <span className="font-black text-gray-900">{activeUsers7d.size} souls</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 font-medium">30 Days</span>
                                        <span className="font-black text-gray-900">{activeUsers30d.size} souls</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100/50">
                                        <div className={`w-2 h-2 rounded-full ${activeUsers24h.size > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                        <span className="text-[10px] font-bold text-gray-700 uppercase">
                                            {activeUsers24h.size > 0 ? 'Live Access' : 'No Recent Activity'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Core Health</h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Stale Session Ratio</div>
                                        <div className="text-xl font-black text-gray-700">
                                            {((staleUsers.size / (totalUsers.data().count || 1)) * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">User Conversion</div>
                                        <div className="text-xl font-black text-gray-700">
                                            {intercessionRate}% <span className="text-[10px] text-gray-400">engaged</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="md:col-span-2 flex flex-col justify-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm italic text-gray-500 text-sm leading-relaxed">
                        "For where two or three are gathered together in My name, I am there in the midst of them." — Matthew 18:20
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-xl text-white">
                        <h2 className="text-sm font-black uppercase tracking-widest mb-6 opacity-80">Admin Tips</h2>
                        <ul className="space-y-4 text-sm font-medium opacity-90">
                            <li className="flex gap-3">
                                <span>🧹</span>
                                <p>Running cleanup affects users with no prayer history and 7+ days inactivity.</p>
                            </li>
                            <li className="flex gap-3">
                                <span>🛡️</span>
                                <p>Approve prayers to move them from 'Shadowed' (Private) to Public.</p>
                            </li>
                            <li className="flex gap-3">
                                <span>🌍</span>
                                <p>Discovery feeds exclusively show 'Clean' moderation status content.</p>
                            </li>
                        </ul>
                    </div>
                </div>

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
                                <div className="flex gap-2">
                                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm border border-orange-100">
                                        {prayer.moderation?.flaggedReason || "Flagged"}
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm border ${prayer.moderation?.requestedVisibility === "unlisted" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            prayer.moderation?.requestedVisibility === "private" ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                "bg-blue-50 text-blue-600 border-blue-100"
                                        }`}>
                                        Intent: {prayer.moderation?.requestedVisibility || "Public"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <form action={approvePrayerAction.bind(null, key, prayer.id)}>
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                        Approve as {prayer.moderation?.requestedVisibility?.toUpperCase() || "PUBLIC"}
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

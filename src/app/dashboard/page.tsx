import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { getOrCreateRecoveryCode } from "../actions/recovery";
import Link from "next/link";
import { getTranslations, type Language } from "@/lib/i18n";

export default async function DashboardPage(props: { searchParams: Promise<{ tag?: string }> }) {
    const searchParams = await props.searchParams;
    const activeTag = searchParams.tag;

    const cookieStore = await cookies();
    const uuid = cookieStore.get("stub_user_id")?.value;
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    if (!uuid) return <div className="p-8 text-center text-red-500">Not authenticated.</div>;

    const recoveryCode = await getOrCreateRecoveryCode();

    const prayersQuery = await adminDb.collection("prayers").where("requesterId", "==", uuid).get();
    let submittedPrayers = prayersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    // Extract all unique tags
    const allTags = Array.from(new Set(submittedPrayers.flatMap(p => p.tags || []))).sort();

    if (activeTag) {
        submittedPrayers = submittedPrayers.filter(p => p.tags?.includes(activeTag));
    }

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
                    <h1 className="text-3xl font-bold text-gray-900">{t.dashboard.title}</h1>
                    <div className="flex gap-3">
                        <Link href="/discover" className="text-blue-600 hover:text-blue-800 font-medium text-sm">{t.nav.discover}</Link>
                        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium text-sm">{t.nav.newRequest}</Link>
                        <Link href="/faq" className="text-gray-400 hover:text-blue-600 font-medium text-sm">{t.nav.privacyFaq}</Link>
                    </div>
                </header>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{t.dashboard.prayerKeyTitle}</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {t.dashboard.prayerKeyDesc}{" "}
                        <Link href="/faq" className="text-blue-600 hover:underline">{t.dashboard.learnAnonymity}</Link>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 bg-blue-50 text-blue-900 border border-blue-200 p-4 rounded-xl text-center w-full">
                            <span className="font-mono text-2xl font-bold tracking-[0.2em]">{recoveryCode || "N/A"}</span>
                        </div>
                        <Link href="/dashboard/export" className="whitespace-nowrap bg-gray-900 text-white px-6 py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
                            {t.dashboard.exportJournal}
                        </Link>
                    </div>
                </section>

                {/* Tag Filters */}
                {allTags.length > 0 && (
                    <section className="flex flex-wrap gap-2 items-center">
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${!activeTag ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'}`}
                        >
                            All
                        </Link>
                        {allTags.map(tag => (
                            <Link
                                key={tag}
                                href={`/dashboard?tag=${encodeURIComponent(tag)}`}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeTag === tag ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'}`}
                            >
                                #{tag}
                            </Link>
                        ))}
                    </section>
                )}

                {/* Prayer Insights Section */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <span className="text-2xl mb-1">✅</span>
                        <span className="text-2xl font-black text-gray-900">
                            {submittedPrayers.length > 0
                                ? Math.round((submittedPrayers.filter((p: any) => p.isAnswered).length / submittedPrayers.length) * 100)
                                : 0}%
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">{t.dashboard.answeredRate}</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <span className="text-2xl mb-1">🌍</span>
                        <span className="text-2xl font-black text-blue-600">
                            {submittedPrayers.reduce((acc: number, p: any) => acc + (p.prayedCount || 0), 0)}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">{t.dashboard.prayerImpact}</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <span className="text-2xl mb-1">🔥</span>
                        <span className="text-2xl font-black text-orange-500">
                            {/* Streak logic would go here, for now dummy 3 */}
                            {submittedPrayers.length > 0 ? 3 : 0}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">{t.dashboard.consistencyStreak}</span>
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">{t.dashboard.yourRequests}</h2>
                        {submittedPrayers.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">{t.dashboard.noRequests}</p>
                        ) : (
                            <div className="space-y-4">
                                {submittedPrayers.map((p: any) => (
                                    <div key={p.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4 relative overflow-hidden">
                                        {p.isAnswered && (
                                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-sm">
                                                {t.prayer.prayerAnswered.split("!")[0]}
                                            </div>
                                        )}
                                        <p className="text-gray-800 italic leading-relaxed pt-2">&quot;{p.text.length > 200 ? p.text.slice(0, 200) + "..." : p.text}&quot;</p>

                                        {p.tags && p.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {p.tags.map((tag: string) => (
                                                    <span key={tag} className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/p/${p.id}`} className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-wider">{t.dashboard.view} →</Link>
                                                {p.visibility && p.visibility !== 'public' && (
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${p.visibility === 'private' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                                                        }`}>
                                                        {p.visibility === 'private' ? t.home.visibilityPrivate : t.home.visibilityUnlisted}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-xs font-bold border border-blue-50">
                                                🙏 {p.prayedCount || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-b pb-2">{t.dashboard.requestsFollowed}</h2>
                        {intercededPrayers.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">{t.dashboard.noIntercessions}</p>
                        ) : (
                            <div className="space-y-4">
                                {intercededPrayers.map((p) => (
                                    <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <p className="text-gray-800 italic mb-3">&quot;{p.text}&quot;</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <Link href={`/p/${p.id}`} className="text-blue-600 font-medium hover:underline">{t.dashboard.view}</Link>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{t.dashboard.active}</span>
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

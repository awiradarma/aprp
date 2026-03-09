import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { getOrCreateRecoveryCode } from "../actions/recovery";
import Link from "next/link";
import { getTranslations, type Language } from "@/lib/i18n";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get("stub_user_id")?.value;
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    if (!uuid) return <div className="p-8 text-center text-red-500">Not authenticated.</div>;

    const recoveryCode = await getOrCreateRecoveryCode();

    const prayersQuery = await adminDb.collection("prayers").where("requesterId", "==", uuid).get();
    const submittedPrayers = prayersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

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
                    <div className="bg-blue-50 text-blue-900 border border-blue-200 p-4 rounded-xl text-center mb-4">
                        <span className="font-mono text-2xl font-bold tracking-[0.2em]">{recoveryCode || "N/A"}</span>
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
                                    <div key={p.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 space-y-4">
                                        <p className="text-gray-800 italic leading-relaxed">&quot;{p.text.length > 100 ? p.text.slice(0, 100) + "..." : p.text}&quot;</p>
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

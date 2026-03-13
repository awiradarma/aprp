import { adminDb } from "@/lib/firebase/server";
import { notFound } from "next/navigation";
import { intercedeAction } from "@/app/actions/intercede";
import { cookies } from "next/headers";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import PrayerOwnerActions from "@/components/PrayerOwnerActions";
import IntercessionMap from "@/components/IntercessionMap";
import { fetchIntercessionLocations } from "@/app/actions/intercessions";
import { getTranslations, type Language } from "@/lib/i18n";
import JournalTimeline from "@/components/JournalTimeline";

export default async function PrayerPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const cookieStore = await cookies();
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    let prayer = null;
    try {
        const doc = await adminDb.collection("prayers").doc(id).get();
        if (doc.exists) {
            const data = doc.data() as any;
            prayer = {
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                answeredAt: data.answeredAt?.toDate ? data.answeredAt.toDate() : data.answeredAt,
                followUps: (data.followUps || []).map((f: any) => ({
                    ...f,
                    createdAt: f.createdAt?.toDate ? f.createdAt.toDate() : f.createdAt
                }))
            };
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

    if (!prayer) notFound();

    const uuid = cookieStore.get("stub_user_id")?.value;
    const isOwner = !!(uuid && prayer.requesterId === uuid);

    // Enforce private visibility
    if (prayer.visibility === 'private' && !isOwner) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
                    <h2 className="text-gray-900 text-2xl font-black mb-3">{t.prayer.accessDenied}</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">{t.prayer.privateDeniedMessage}</p>
                    <Link href="/" className="inline-block mt-8 text-blue-600 font-bold hover:underline">
                        ← {t.recover.backHome.replace("Back to ", "")}
                    </Link>
                </div>
            </div>
        );
    }

    const isAnswered = !!(prayer.isAnswered || prayer.answeredAt);

    let hasInterceded = false;
    if (uuid && !isOwner) {
        const intercessionDoc = await adminDb.collection("user_intercessions").doc(`${uuid}_${id}`).get();
        hasInterceded = intercessionDoc.exists;
    }

    const intercessionLocations = await fetchIntercessionLocations(id);
    const translateUrl = `https://translate.google.com/?sl=auto&tl=${lang}&text=${encodeURIComponent(prayer.text)}&op=translate`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 md:py-16 px-4">
            <div className="w-full max-w-5xl">
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <Link href="/" className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all">
                        <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-bold text-sm uppercase tracking-wider">{t.recover.backHome.replace("Back to ", "")}</span>
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link href="/discover" className="text-sm font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">{t.nav.discover}</Link>
                        <Link href="/dashboard" className="text-sm font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">{t.nav.myPrayers}</Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: The Heart of the Prayer (8/12 wings) */}
                    <div className="lg:col-span-8 space-y-8">
                        <main className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden transform transition-all hover:shadow-blue-100/20">
                            {/* Visual Header */}
                            <div className={`p-10 md:p-16 text-center relative overflow-hidden ${isAnswered ? "bg-green-600" : "bg-blue-600"}`}>
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10"></div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>

                                <p className="text-xs md:text-sm uppercase tracking-[0.3em] font-black mb-6 text-white/70">
                                    {isAnswered ? t.prayer.answeredPrayer : t.prayer.prayerRequest}
                                </p>
                                <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight max-w-2xl mx-auto italic">
                                    &ldquo;{prayer.text.length > 80 ? prayer.text.slice(0, 80) + "..." : prayer.text}&rdquo;
                                </h1>
                            </div>

                            {/* Main Prayer Body */}
                            <div className="p-8 md:p-14 space-y-12">
                                {isOwner && prayer.visibility === 'private' && (
                                    <div className="bg-purple-50 text-purple-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 border border-purple-100 shadow-sm">
                                        <span>{t.prayer.privateNotice}</span>
                                    </div>
                                )}

                                <div className={`p-10 md:p-14 rounded-[2rem] text-xl md:text-3xl font-medium italic leading-relaxed shadow-inner border relative overflow-hidden ${isAnswered ? "bg-green-50 text-green-900 border-green-100" : "bg-blue-50 text-blue-900 border-blue-100"}`}>
                                    {/* Quote decoration */}
                                    <span className="absolute -top-6 -left-2 text-9xl font-serif text-blue-500/10 pointer-events-none selecion-none">&ldquo;</span>
                                    <p className="relative z-10">&quot;{prayer.text}&quot;</p>
                                </div>

                                {/* Metadata Footer */}
                                <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-gray-100 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🗓️</div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Posted On</span>
                                            <span className="text-base font-bold text-gray-700">
                                                {prayer.createdAt ? new Date(prayer.createdAt.toDate ? prayer.createdAt.toDate() : prayer.createdAt).toLocaleDateString(lang, { dateStyle: 'long' }) : ""}
                                            </span>
                                        </div>
                                    </div>

                                    {lang !== "en" && (
                                        <a href={translateUrl} target="_blank" rel="noopener noreferrer"
                                            className="group flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-all">
                                            <span>{t.prayer.translateContent}</span>
                                            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* Journaling Section (Owner Only) */}
                        {isOwner && (
                            <div className="pt-4">
                                <JournalTimeline
                                    prayerId={id}
                                    followUps={prayer.followUps}
                                    t={t}
                                    lang={lang}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column: Interaction & Community (4/12 wings) */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Action Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 space-y-10">
                            {/* Prayed Stats */}
                            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Intercessors</span>
                                    <span className="text-xl font-black text-gray-800 tracking-tight">Community Support</span>
                                </div>
                                <div className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-2xl font-black shadow-lg ${isAnswered ? "bg-green-100 text-green-700 shadow-green-100" : "bg-blue-100 text-blue-700 shadow-blue-100"}`}>
                                    <span className="animate-pulse">🙏</span>
                                    {prayer.prayedCount || 0}
                                </div>
                            </div>

                            {/* Intercession Form */}
                            {!isOwner && !hasInterceded && (
                                <div className="space-y-6">
                                    <form action={intercedeAction} className="space-y-5">
                                        <input type="hidden" name="prayerId" value={id} />
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                                                {t.home.locationLabel}
                                            </label>
                                            <input type="text" name="location"
                                                placeholder={t.prayer.locationPlaceholder}
                                                className="w-full text-base border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 text-gray-700 bg-gray-50 focus:bg-white focus:border-blue-200 transition-all font-medium placeholder:text-gray-300"
                                            />
                                            <p className="text-[10px] text-gray-400 text-center italic px-4 leading-relaxed line-clamp-2">
                                                {t.prayer.locationPrivacyNote}
                                            </p>
                                        </div>

                                        <button type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 px-8 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 active:scale-[0.97] group disabled:opacity-50 disabled:cursor-not-allowed">
                                            {t.prayer.iPrayed}
                                            <span className="inline-block ml-3 group-hover:translate-x-1 transition-all duration-300">→</span>
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Already Interceded State */}
                            {!isOwner && hasInterceded && (
                                <div className="w-full bg-green-50 text-green-700 border border-green-200 py-6 px-4 rounded-[2rem] font-black text-center text-lg flex flex-col items-center justify-center gap-3 shadow-inner">
                                    <span className="text-4xl">✨</span>
                                    {t.prayer.youPrayed}
                                </div>
                            )}

                            {/* Share Component */}
                            <div className="pt-2">
                                <ShareButton id={id} t={t} />
                            </div>

                            {/* Owner Controls */}
                            {isOwner && (
                                <div className="pt-6 border-t border-gray-100">
                                    <PrayerOwnerActions prayerId={id} currentText={prayer.text} isAnswered={isAnswered} t={t} />
                                </div>
                            )}
                        </div>

                        {/* Map Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 overflow-hidden group">
                            <div className="relative">
                                <IntercessionMap locations={intercessionLocations} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div >
        </div >
    );
}

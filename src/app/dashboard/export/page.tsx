import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { getTranslations, type Language } from "@/lib/i18n";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ExportPage() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get("stub_user_id")?.value;
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    if (!uuid) redirect("/dashboard");

    const prayersQuery = await adminDb.collection("prayers")
        .where("requesterId", "==", uuid)
        .get();

    const prayers = prayersQuery.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            followUps: (data.followUps || []).map((f: any) => ({
                ...f,
                createdAt: f.createdAt?.toDate ? f.createdAt.toDate() : f.createdAt
            })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        };
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="min-h-screen bg-white p-8 md:p-16 max-w-4xl mx-auto font-serif text-gray-900 printable-area">
            {/* Control Bar - Hidden on Print */}
            <div className="flex justify-between items-center mb-12 border-b pb-6 print:hidden font-sans">
                <Link href="/dashboard" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                    ← {t.recover.backHome.replace("Back to ", "")}
                </Link>
                <button
                    id="print-btn"
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                    style={{ cursor: 'pointer' }}
                >
                    Print or Save as PDF
                </button>
            </div>

            {/* Header */}
            <header className="text-center space-y-4 mb-20 border-b-4 border-gray-900 pb-12">
                <h1 className="text-5xl font-black tracking-tight">{t.dashboard.insightsTitle || "My Prayer Journal"}</h1>
                <p className="text-xl text-gray-500 italic">
                    {new Date().toLocaleDateString(lang, { dateStyle: 'full' })}
                </p>
                <div className="flex justify-center gap-8 pt-4">
                    <div className="text-center">
                        <span className="block text-2xl font-black">{prayers.length}</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t.dashboard.yourRequests}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-black">{prayers.filter((p: any) => p.isAnswered).length}</span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t.dashboard.answeredRate.replace('%', '')}</span>
                    </div>
                </div>
            </header>

            {/* Journal Entries */}
            <div className="space-y-16">
                {prayers.map((prayer: any) => (
                    <article key={prayer.id} className="break-inside-avoid page-break-after-auto border-b border-gray-100 pb-16 last:border-0">
                        {/* Prayer Card */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded">
                                    {new Date(prayer.createdAt).toLocaleDateString(lang, { dateStyle: 'medium' })}
                                </span>
                                {prayer.isAnswered && (
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-3 py-1 rounded">
                                        Answered
                                    </span>
                                )}
                            </div>

                            <blockquote className="text-3xl font-medium leading-relaxed italic border-l-8 border-gray-100 pl-8 py-2">
                                &ldquo;{prayer.text}&rdquo;
                            </blockquote>

                            {/* Tags */}
                            {prayer.tags && prayer.tags.length > 0 && (
                                <div className="flex gap-2 font-sans font-bold text-xs text-gray-400">
                                    {prayer.tags.map((tag: string) => (
                                        <span key={tag}>#{tag}</span>
                                    ))}
                                </div>
                            )}

                            {/* Journal Timeline (Notes) */}
                            {prayer.followUps && prayer.followUps.length > 0 && (
                                <div className="mt-12 ml-8 space-y-8 border-l-2 border-gray-100 pl-8">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Journal Notes</h3>
                                    {prayer.followUps.map((note: any) => (
                                        <div key={note.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">
                                                    {new Date(note.createdAt).toLocaleDateString(lang, { dateStyle: 'medium' })}
                                                </span>
                                            </div>
                                            <p className="text-lg leading-relaxed text-gray-700">
                                                {note.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-12 border-t border-gray-900 text-center text-gray-400 italic text-sm">
                Generated by praynow.live &bull; Built on Faith &bull; Private and Anonymous
            </footer>

            {/* Client-side Print Logic */}
            <script dangerouslySetInnerHTML={{
                __html: `
                document.getElementById('print-btn').addEventListener('click', () => window.print());
            `}} />

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .print\\:hidden { display: none !important; }
                    body { background: white !important; }
                    .printable-area { padding: 0 !important; width: 100% !important; max-width: none !important; }
                    blockquote { border-color: #f3f4f6 !important; }
                }
            `}} />
        </div>
    );
}

import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations, type Language } from "@/lib/i18n";

export default async function FAQPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <main className="max-w-2xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <Link href="/" className="text-sm text-blue-600 hover:underline">← {t.recover.backHome.replace("Back to ", "")}</Link>
                    <h1 className="text-3xl font-bold text-gray-900">{t.faq.title}</h1>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">{t.faq.subtitle}</p>
                </header>

                <div className="space-y-4">
                    {t.faq.questions.map((faq, i) => (
                        <details key={i} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-semibold text-gray-800 hover:text-blue-700 transition-colors">
                                <span>{faq.q}</span>
                                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
                            </summary>
                            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>

                <footer className="text-center text-xs text-gray-400 pt-4 space-y-1">
                    <div className="flex justify-center gap-4">
                        <Link href="/" className="hover:text-blue-600 transition-colors">{t.appName}</Link>
                        <Link href="/discover" className="hover:text-blue-600 transition-colors">{t.nav.discover}</Link>
                        <Link href="/dashboard" className="hover:text-blue-600 transition-colors">{t.nav.myPrayers}</Link>
                        <Link href="/recover" className="hover:text-blue-600 transition-colors">{t.nav.restoreSession}</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}

import Link from "next/link";
import { fetchDiscoverPrayers } from "@/app/actions/discover";
import PrayerFeed from "@/components/PrayerFeed";
import { cookies } from "next/headers";
import { getTranslations, type Language } from "@/lib/i18n";

export default async function DiscoverPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    const { prayers, nextCursor } = await fetchDiscoverPrayers();

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <main className="w-full max-w-3xl mx-auto space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t.discover.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">{t.discover.subtitle}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">{t.nav.myPrayers}</Link>
                        <Link href="/faq" className="text-sm text-gray-400 hover:text-blue-600 font-medium">{t.nav.privacyFaq}</Link>
                        <Link href="/" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            {t.nav.newRequest}
                        </Link>
                    </div>
                </header>

                <PrayerFeed
                    initialPrayers={prayers}
                    initialCursor={nextCursor}
                    totalShown={prayers.length}
                    t={t}
                />
            </main>
        </div>
    );
}

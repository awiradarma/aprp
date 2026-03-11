import PrayerForm from "@/components/PrayerForm";
import GlobalMap from "@/components/GlobalMap";
import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations, type Language } from "@/lib/i18n";
import { fetchDiscoverPrayers } from "./actions/discover";
import { PrayerCard } from "@/components/PrayerFeed";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
  const t = getTranslations(lang);

  const { prayers } = await fetchDiscoverPrayers(undefined, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl space-y-12">
        {/* Hero Section: Form + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Form */}
          <main className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">{t.appName}</h1>
              <p className="text-blue-100 text-sm">{t.home.subtitle}</p>
            </div>
            <div className="flex justify-center gap-4 bg-blue-50 border-b border-blue-100 py-2 px-4 text-sm flex-wrap">
              <Link href="/discover" className="text-blue-700 font-semibold hover:underline">{t.nav.discover}</Link>
              <Link href="/dashboard" className="text-blue-700 font-semibold hover:underline">{t.nav.myPrayers}</Link>
              <Link href="/faq" className="text-gray-500 hover:text-blue-700 font-semibold hover:underline">{t.nav.privacyFaq}</Link>
            </div>

            <div className="p-6">
              <PrayerForm t={t} />
            </div>
          </main>

          {/* Right Column: Map */}
          <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden p-4 h-full min-h-[400px]">
            <GlobalMap />
          </div>
        </div>

        {/* Community Feed Section */}
        {prayers.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{t.discover.title}</h2>
                <p className="text-sm text-gray-500">{t.discover.subtitle}</p>
              </div>
              <Link href="/discover" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                {t.discover.joinPrayer}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {prayers.map((prayer) => (
                <PrayerCard key={prayer.id} prayer={prayer} t={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

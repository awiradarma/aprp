import { submitPrayerAction } from "./actions/prayer";
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
              <form action={submitPrayerAction} className="space-y-4">
                <div>
                  <label htmlFor="prayerText" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.home.prayerLabel}
                  </label>
                  <textarea
                    name="prayerText"
                    id="prayerText"
                    rows={5}
                    required
                    className="w-full bg-white text-gray-800 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                    placeholder={t.home.prayerPlaceholder}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.home.locationLabel}
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="w-full bg-white text-gray-800 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder={t.home.locationPlaceholder}
                  />
                  <p className="text-xs text-gray-500 mt-1">{t.home.locationPrivacy}</p>
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t.home.privacyLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="relative flex flex-col p-3 border rounded-xl cursor-pointer hover:bg-blue-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                      <input type="radio" name="visibility" value="public" defaultChecked className="sr-only" />
                      <span className="font-bold text-sm text-blue-900">{t.home.visibilityPublic}</span>
                      <span className="text-[10px] text-blue-700/60 leading-tight mt-1">{t.home.visibilityPublicDesc}</span>
                    </label>
                    <label className="relative flex flex-col p-3 border rounded-xl cursor-pointer hover:bg-blue-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                      <input type="radio" name="visibility" value="unlisted" className="sr-only" />
                      <span className="font-bold text-sm text-gray-900">{t.home.visibilityUnlisted}</span>
                      <span className="text-[10px] text-gray-500/60 leading-tight mt-1">{t.home.visibilityUnlistedDesc}</span>
                    </label>
                    <label className="relative flex flex-col p-3 border rounded-xl cursor-pointer hover:bg-blue-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                      <input type="radio" name="visibility" value="private" className="sr-only" />
                      <span className="font-bold text-sm text-purple-900">{t.home.visibilityPrivate}</span>
                      <span className="text-[10px] text-purple-700/60 leading-tight mt-1">{t.home.visibilityPrivateDesc}</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                >
                  {t.home.submit}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">{t.home.anonNote}</p>
              </form>
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

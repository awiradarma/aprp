import { submitPrayerAction } from "./actions/prayer";
import GlobalMap from "@/components/GlobalMap";
import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations, type Language } from "@/lib/i18n";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
  const t = getTranslations(lang);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

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
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden p-4">
          <GlobalMap />
        </div>

      </div>
    </div>
  );
}

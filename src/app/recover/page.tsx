import { recoverSessionAction } from "../actions/recovery";
import Link from "next/link";
import { cookies } from "next/headers";
import { getTranslations, type Language } from "@/lib/i18n";

export default async function RecoverPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("lang")?.value ?? "en") as Language;
    const t = getTranslations(lang);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-xl font-bold text-white mb-2">{t.recover.title}</h1>
                    <p className="text-blue-100 text-sm">{t.recover.subtitle}</p>
                </div>

                <div className="p-6">
                    <form action={recoverSessionAction} className="space-y-4">
                        <div>
                            <label htmlFor="recoveryCode" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.recover.prayerKey}
                            </label>
                            <input
                                type="text"
                                name="recoveryCode"
                                id="recoveryCode"
                                required
                                pattern="[a-zA-Z0-9]{12}"
                                maxLength={12}
                                autoCapitalize="none"
                                autoCorrect="off"
                                className="w-full font-mono tracking-widest text-center bg-gray-50 text-gray-800 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                placeholder="aBc123XyZ456"
                            />
                            <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
                                Note: Recovery keys are case-sensitive.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex justify-center py-3 px-4 rounded-lg transition-colors shadow-sm"
                        >
                            {t.recover.button}
                        </button>

                        <div className="text-center mt-4 border-t pt-4 space-y-2">
                            <Link href="/" className="block text-sm text-blue-600 hover:underline">{t.recover.backHome}</Link>
                            <Link href="/faq" className="block text-xs text-gray-400 hover:text-blue-500">{t.recover.howAnonymity}</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

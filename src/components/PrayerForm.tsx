"use client";

import { useActionState } from "react";
import { submitPrayerAction, type PrayerState } from "@/app/actions/prayer";
import type { T } from "@/lib/i18n";

export default function PrayerForm({ t }: { t: T }) {
    const initialState: PrayerState = {};
    const [state, formAction, isPending] = useActionState(submitPrayerAction, initialState);

    // Get localized error message
    const getErrorMessage = (errorKey: string) => {
        const errors = t.faq.errors as any;
        let message = errors[errorKey] || errorKey;

        // Handle placeholders like {n}
        if (errorKey === "tooShort") message = message.replace("{n}", "10");
        if (errorKey === "tooLong") message = message.replace("{n}", "2000");

        return message;
    };

    return (
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <p className="text-sm font-bold text-red-700">
                            {getErrorMessage(state.error)}
                        </p>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="prayerText" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.home.prayerLabel}
                </label>
                <textarea
                    name="prayerText"
                    id="prayerText"
                    rows={5}
                    required
                    minLength={10}
                    maxLength={2000}
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
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-70 disabled:grayscale"
            >
                {isPending ? t.prayer.saving : t.home.submit}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">{t.home.anonNote}</p>
        </form>
    );
}

"use client";
import { useState } from "react";
import { markAnsweredAction, editPrayerAction } from "@/app/actions/owner";
import type { T } from "@/lib/i18n";

interface Props {
    prayerId: string;
    currentText: string;
    isAnswered: boolean;
    t: T;
}

export default function PrayerOwnerActions({ prayerId, currentText, isAnswered, t }: Props) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(currentText);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get localized error message (same logic as PrayerForm)
    const getErrorMessage = (errorKey: string) => {
        const errors = t.faq.errors as any;
        let message = errors[errorKey] || errorKey;
        if (errorKey === "tooShort") message = message.replace("{n}", "10");
        if (errorKey === "tooLong") message = message.replace("{n}", "2000");
        return message;
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const fd = new FormData();
            fd.append("prayerId", prayerId);
            fd.append("text", text);
            await editPrayerAction(fd);
            setSaving(false);
            setSaved(true);
            setEditing(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            console.error("Edit error:", err);
            setError(err.message || "An unexpected error occurred");
            setSaving(false);
        }
    };

    return (
        <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t.prayer.yourRequest}</p>

            {editing ? (
                <form onSubmit={handleEdit} className="space-y-2">
                    {error && (
                        <div className="bg-red-50 border border-red-100 p-3 rounded-xl mb-2">
                            <p className="text-xs font-bold text-red-600">⚠️ {getErrorMessage(error)}</p>
                        </div>
                    )}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        minLength={10}
                        maxLength={2000}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                    <div className="flex gap-2">
                        <button type="submit" disabled={saving}
                            className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                            {saving ? t.prayer.saving : t.prayer.saveChanges}
                        </button>
                        <button type="button" onClick={() => { setEditing(false); setText(currentText); }}
                            className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            {t.prayer.cancel}
                        </button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setEditing(true)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-2">
                    {t.prayer.editText}
                </button>
            )}

            {saved && <p className="text-green-600 text-xs font-semibold text-center">{t.prayer.prayerUpdated}</p>}

            {!isAnswered ? (
                <form action={markAnsweredAction}>
                    <input type="hidden" name="prayerId" value={prayerId} />
                    <button type="submit"
                        className="w-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                        {t.prayer.markAnswered}
                    </button>
                </form>
            ) : (
                <div className="w-full bg-green-100 border border-green-200 text-green-800 text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                    {t.prayer.prayerAnswered}
                </div>
            )}
        </div>
    );
}

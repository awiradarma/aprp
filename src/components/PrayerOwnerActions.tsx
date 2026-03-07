"use client";
import { useState } from "react";
import { markAnsweredAction, editPrayerAction } from "@/app/actions/owner";

interface Props {
    prayerId: string;
    currentText: string;
    isAnswered: boolean;
}

export default function PrayerOwnerActions({ prayerId, currentText, isAnswered }: Props) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(currentText);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData();
        fd.append("prayerId", prayerId);
        fd.append("text", text);
        await editPrayerAction(fd);
        setSaving(false);
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Request</p>

            {/* Edit section */}
            {editing ? (
                <form onSubmit={handleEdit} className="space-y-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setEditing(false); setText(currentText); }}
                            className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-2"
                >
                    ✏️ Edit Prayer Text
                </button>
            )}

            {saved && (
                <p className="text-green-600 text-xs font-semibold text-center">✓ Prayer updated!</p>
            )}

            {/* Mark as answered */}
            {!isAnswered ? (
                <form action={markAnsweredAction}>
                    <input type="hidden" name="prayerId" value={prayerId} />
                    <button
                        type="submit"
                        className="w-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                        ✅ Mark as Answered
                    </button>
                </form>
            ) : (
                <div className="w-full bg-green-100 border border-green-200 text-green-800 text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                    🙌 This prayer was answered!
                </div>
            )}
        </div>
    );
}

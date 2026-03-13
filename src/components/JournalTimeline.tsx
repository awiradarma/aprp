"use client";

import { useActionState, useRef, useEffect } from "react";
import { addFollowUpAction, type PrayerState } from "@/app/actions/prayer";
import type { T } from "@/lib/i18n";

type FollowUp = {
    id: string;
    text: string;
    createdAt: any;
    type: 'update' | 'answer';
};

export default function JournalTimeline({
    prayerId,
    followUps = [],
    t,
    lang
}: {
    prayerId: string;
    followUps: FollowUp[];
    t: T;
    lang: string;
}) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(addFollowUpAction, {});

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
        }
    }, [state.success]);

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                <span className="p-2 bg-blue-50 rounded-lg text-lg">📖</span>
                {t.prayer.journalTitle}
            </h2>

            {/* Add Note Form */}
            <form action={formAction} ref={formRef} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4 shadow-inner">
                <input type="hidden" name="prayerId" value={prayerId} />
                <textarea
                    name="note"
                    required
                    rows={3}
                    placeholder={t.prayer.notePlaceholder}
                    className="w-full bg-white text-gray-900 placeholder:text-gray-500 border-2 border-transparent focus:border-blue-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all resize-none shadow-sm"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {isPending ? t.prayer.saving : t.prayer.addNote}
                </button>
                {state.error && <p className="text-xs text-red-500 font-bold text-center mt-2">{state.error}</p>}
            </form>

            {/* Timeline */}
            <div className="relative space-y-10 pl-6 border-l-2 border-blue-50 ml-4">
                {followUps.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 italic text-sm">
                        No journal entries yet. Record how God is moving.
                    </div>
                ) : (
                    followUps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note) => (
                        <div key={note.id} className="relative">
                            {/* Dot */}
                            <div className="absolute -left-[33px] top-1.5 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-sm"></div>

                            <div className="bg-blue-50/40 p-6 rounded-3xl border border-blue-100/50 shadow-sm space-y-3">
                                <div className="flex justify-between items-center -mx-6 -mt-6 px-6 py-2 rounded-t-3xl border-b border-blue-100/30 mb-4">
                                    <span className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">
                                        {new Date(note.createdAt).toLocaleString(lang, { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                    {note.type === 'answer' && (
                                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                                            {t.prayer.answeredPrayer.replace('🙌 ', '')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-900 font-medium leading-relaxed italic">&quot;{note.text}&quot;</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

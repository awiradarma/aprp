"use client";
import { LANGUAGES, type Language } from "@/lib/i18n";
import { setLanguageAction } from "@/app/actions/language";
import { useTransition } from "react";

export default function LanguageSwitcher({ currentLang }: { currentLang: Language }) {
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value as Language;
        const fd = new FormData();
        fd.append("lang", lang);
        startTransition(async () => {
            await setLanguageAction(fd);
            window.location.reload();
        });
    };

    return (
        <div style={{
            position: "fixed", bottom: "16px", right: "16px", zIndex: 50,
            background: "white", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            border: "1px solid #e5e7eb", padding: "6px 10px",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontWeight: 600,
        }}>
            <span>🌐</span>
            <select
                value={currentLang}
                onChange={handleChange}
                disabled={isPending}
                style={{ border: "none", outline: "none", background: "transparent", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#374151" }}
                aria-label="Select language"
            >
                {(Object.entries(LANGUAGES) as [Language, { name: string; flag: string }][]).map(([code, { name, flag }]) => (
                    <option key={code} value={code}>{flag} {name}</option>
                ))}
            </select>
            {isPending && <span style={{ color: "#9ca3af" }}>…</span>}
        </div>
    );
}

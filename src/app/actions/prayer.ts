"use server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { adminDb } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { getGeohash, jitterCoordinate } from "@/lib/geo";

export type PrayerState = {
    error?: string;
    success?: boolean;
};

export async function submitPrayerAction(prevState: PrayerState, formData: FormData): Promise<PrayerState> {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    if (!uuid) {
        return { error: "unauthorized" };
    }

    try {
        let text = formData.get("prayerText") as string;
        const { validatePrayerText } = await import("@/lib/validation");
        text = validatePrayerText(text);

        const locationStr = formData.get("location") as string;
        let jitteredCoords: { lat: number, lon: number } | null = null;
        let geohash: string | null = null;

        if (locationStr && locationStr.trim() !== "") {
            try {
                // Use OpenStreetMap Nominatim (free, no API key required for server-side use)
                const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationStr)}&format=json&limit=1`;
                const res = await fetch(nominatimUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'APRP-GII-App/1.0'
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const rawLat = parseFloat(data[0].lat);
                        const rawLon = parseFloat(data[0].lon);

                        jitteredCoords = {
                            lat: jitterCoordinate(rawLat),
                            lon: jitterCoordinate(rawLon)
                        };
                        geohash = getGeohash(jitteredCoords.lat, jitteredCoords.lon, 6);
                    }
                }
            } catch (error) {
                console.error("Geocoding error:", error);
            }
        }

        const visibility = (formData.get("visibility") as string) || "public";
        const prayerId = nanoid(16);

        await adminDb.collection("prayers").doc(prayerId).set({
            text,
            requesterId: uuid,
            createdAt: new Date(),
            prayedCount: 0,
            locationString: locationStr || null,
            jitteredCoords,
            geohash,
            visibility
        });

        // Redirect to the newly created prayer page
        redirect(`/p/${prayerId}`);
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Error saving prayer:", error);
        return { error: error.message };
    }
}

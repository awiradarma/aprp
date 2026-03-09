"use server";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import { adminDb } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { getGeohash, jitterCoordinate } from "@/lib/geo";

export async function submitPrayerAction(formData: FormData) {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    if (!uuid) {
        throw new Error("Unauthorized: No stub user found.");
    }

    const text = formData.get("prayerText") as string;
    if (!text || text.trim() === "") {
        throw new Error("Prayer text is required.");
    }

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
                    // Nominatim requires a User-Agent header to identify the app
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
                    console.log(`Geocoded "${locationStr}" -> geohash: ${geohash}`);
                }
            } else {
                console.error("Nominatim geocoding error:", await res.text());
            }
        } catch (error) {
            console.error("Error fetching geocoding:", error);
        }
    }

    const visibility = (formData.get("visibility") as string) || "public";
    // visibility: 'public' | 'unlisted' | 'private'

    // Generate a unique, cryptographically secure URL component for the prayer
    const prayerId = nanoid(16);

    try {
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
    } catch (error) {
        console.error("Error saving prayer to Firestore:", error);
        // Even if saving to Firestore fails (e.g., missing credentials),
        // let's fall through or throw so the UI can handle it.
        throw new Error("Failed to save prayer. Please ensure Firebase is configured.");
    }

    // Redirect to the newly created prayer page
    redirect(`/p/${prayerId}`);
}

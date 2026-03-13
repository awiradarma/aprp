"use server";
import { cookies } from "next/headers";
import { adminDb, FieldValue } from "@/lib/firebase/server";
import { revalidatePath } from "next/cache";
import { jitterCoordinate, getGeohash } from "@/lib/geo";

export async function intercedeAction(formData: FormData) {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    if (!uuid) {
        throw new Error("Unauthorized: No stub user found.");
    }

    const prayerId = formData.get("prayerId") as string;
    if (!prayerId) {
        throw new Error("Prayer ID is required.");
    }

    try {
        // 1. Check if user already interceded
        const intercessionQuery = await adminDb
            .collection("user_intercessions")
            .where("userId", "==", uuid)
            .get();

        const hasInterceded = intercessionQuery.docs.some((doc: any) => doc.data().prayerId === prayerId);

        if (hasInterceded) {
            return;
        }

        // 2. Optional: geocode the intercessor's location if provided
        const locationStr = formData.get("location") as string;
        let jitteredCoords: { lat: number, lon: number } | null = null;
        let geohash: string | null = null;

        if (locationStr && locationStr.trim() !== "") {
            try {
                const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationStr)}&format=json&limit=1`;
                const res = await fetch(nominatimUrl, {
                    headers: { 'User-Agent': 'APRP-GII-App/1.0' }
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
            } catch (err) {
                console.error("Intercessor geocoding error:", err);
            }
        }

        // 3. Add intercession record (with optional geo data)
        const intercessionId = `${uuid}_${prayerId}`;
        await adminDb.collection("user_intercessions").doc(intercessionId).set({
            userId: uuid,
            prayerId: prayerId,
            createdAt: new Date(),
            locationString: locationStr || null,
            jitteredCoords,
            geohash,
        });

        // 4. Increment counter
        await adminDb.collection("prayers").doc(prayerId).update({
            prayedCount: FieldValue.increment(1),
        });

        // 5. Notify Requester
        try {
            const prayerDoc = await adminDb.collection("prayers").doc(prayerId).get();
            const requesterId = prayerDoc.data()?.requesterId;
            if (requesterId && requesterId !== uuid) {
                const { sendPushNotification } = await import("@/lib/notifications");
                await sendPushNotification(
                    requesterId,
                    "Someone just prayed for you!",
                    "A fellow believer has interceded for your request. You're not alone."
                );
            }
        } catch (pushErr) {
            console.error("Failed to send push notification:", pushErr);
        }

        revalidatePath(`/p/${prayerId}`);
    } catch (error) {
        console.error("Error interceding:", error);
        throw new Error("Failed to process intercession.");
    }
}

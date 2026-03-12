"use server";
import { adminDb } from "@/lib/firebase/server";

export async function fetchMapPrayers() {
    try {
        // Only fetch prayers that have geohashes
        // Usually, you'd do a prefix match on geohash here for a specific viewport
        // but for the global map overview, we'll fetch recently geocoded prayers
        const prayersSnapshot = await (adminDb.collection("prayers") as any)
            .where("visibility", "==", "public")
            .where("moderation.status", "==", "clean")
            .orderBy("createdAt", "desc")
            .limit(500)
            .get();

        const markers: { id: string, geohash: string, lat: number, lon: number, text: string }[] = [];

        prayersSnapshot.docs.forEach((doc: any) => {
            const data = doc.data();
            if (data.geohash && data.jitteredCoords) {
                markers.push({
                    id: doc.id,
                    geohash: data.geohash,
                    lat: data.jitteredCoords.lat,
                    lon: data.jitteredCoords.lon,
                    // Limit text length to avoid giant popups
                    text: data.text.length > 50 ? data.text.substring(0, 50) + "..." : data.text,
                });
            }
        });

        return markers;
    } catch (error) {
        console.error("Error fetching map prayers:", error);
        return [];
    }
}

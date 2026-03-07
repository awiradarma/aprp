"use server";
import { adminDb } from "@/lib/firebase/server";

export interface IntercessionLocation {
    lat: number;
    lon: number;
    locationString: string | null;
}

export async function fetchIntercessionLocations(prayerId: string): Promise<IntercessionLocation[]> {
    try {
        const snapshot = await (adminDb.collection("user_intercessions") as any)
            .where("prayerId", "==", prayerId)
            .get();

        const results: IntercessionLocation[] = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.jitteredCoords?.lat && data.jitteredCoords?.lon) {
                results.push({
                    lat: data.jitteredCoords.lat,
                    lon: data.jitteredCoords.lon,
                    locationString: data.locationString ?? null,
                });
            }
        }
        return results;
    } catch (error) {
        console.error("Error fetching intercession locations:", error);
        return [];
    }
}

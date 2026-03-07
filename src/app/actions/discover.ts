"use server";
import { adminDb } from "@/lib/firebase/server";

export interface DiscoverPrayer {
    id: string;
    text: string;
    prayedCount: number;
    locationString: string | null;
    geohash: string | null;
    createdAt: string; // ISO string
}

export async function fetchDiscoverPrayers(limit = 50): Promise<DiscoverPrayer[]> {
    try {
        const snapshot = await (adminDb.collection("prayers") as any)
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();

        return snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text ?? "",
                prayedCount: data.prayedCount ?? 0,
                locationString: data.locationString ?? null,
                geohash: data.geohash ?? null,
                // Firestore Timestamp → ISO string; plain Date also handled
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate().toISOString()
                    : new Date(data.createdAt).toISOString(),
            };
        });
    } catch (error) {
        console.error("Error fetching discover prayers:", error);
        return [];
    }
}

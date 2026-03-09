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

export interface DiscoverPage {
    prayers: DiscoverPrayer[];
    nextCursor: string | null; // ISO string of last prayer's createdAt, or null if no more
}

const PAGE_SIZE = 20;

export async function fetchDiscoverPrayers(cursorIso?: string, limit: number = PAGE_SIZE): Promise<DiscoverPage> {
    try {
        let query = (adminDb.collection("prayers") as any)
            .orderBy("createdAt", "desc")
            .limit(limit * 2 + 1); // fetch more to account for filtered out private ones

        if (cursorIso) {
            query = query.startAfter(new Date(cursorIso));
        }

        const snapshot = await query.get();
        const docs = snapshot.docs as any[];

        // Filter in-memory to avoid Firestore index requirement for equality + orderBy
        let filteredDocs = docs.filter((doc: any) => {
            const data = doc.data();
            return !data.visibility || data.visibility === 'public';
        });

        const hasMore = filteredDocs.length > limit;
        const pageDocs = hasMore ? filteredDocs.slice(0, limit) : filteredDocs;

        const prayers: DiscoverPrayer[] = pageDocs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text ?? "",
                prayedCount: data.prayedCount ?? 0,
                locationString: data.locationString ?? null,
                geohash: data.geohash ?? null,
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate().toISOString()
                    : new Date(data.createdAt).toISOString(),
            };
        });

        const nextCursor = hasMore ? prayers[prayers.length - 1].createdAt : null;

        return { prayers, nextCursor };
    } catch (error) {
        console.error("Error fetching discover prayers:", error);
        return { prayers: [], nextCursor: null };
    }
}

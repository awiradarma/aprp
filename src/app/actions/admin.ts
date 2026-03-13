
"use server";
import { adminDb } from "@/lib/firebase/server";
import { revalidatePath } from "next/cache";

async function verifyAdminKey(key: string) {
    const doc = await adminDb.collection("admin_config").doc("secret").get();
    if (!doc.exists) throw new Error("Admin not configured");
    if (doc.data()?.key !== key) throw new Error("Unauthorized");
    return true;
}

export async function approvePrayerAction(key: string, prayerId: string) {
    await verifyAdminKey(key);

    const prayerRef = adminDb.collection("prayers").doc(prayerId);
    const prayerDoc = await prayerRef.get();

    if (!prayerDoc.exists) throw new Error("Prayer not found");

    const data = prayerDoc.data();
    const finalVisibility = data?.moderation?.requestedVisibility || "public";

    await prayerRef.update({
        "moderation.status": "clean",
        "moderation.reviewed": true,
        "moderation.reviewedAt": new Date(),
        visibility: finalVisibility
    });

    revalidatePath("/discover");
    revalidatePath("/");
}

export async function dismissPrayerAction(key: string, prayerId: string) {
    await verifyAdminKey(key);
    await adminDb.collection("prayers").doc(prayerId).update({
        "moderation.reviewed": true,
        "moderation.reviewedAt": new Date(),
    });
}

export async function deletePrayerAction(key: string, prayerId: string) {
    await verifyAdminKey(key);
    await adminDb.collection("prayers").doc(prayerId).delete();
    revalidatePath("/discover");
    revalidatePath("/");
}

export async function cleanupAbandonedSessionsAction(key: string) {
    await verifyAdminKey(key);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const usersSnapshot = await adminDb.collection("users")
        .where("lastSeenAt", "<", sevenDaysAgo)
        .get();

    let deletedCount = 0;
    const batchSize = 500;
    let batch = adminDb.batch();

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        // Check for prayers
        const prayersQuery = await adminDb.collection("prayers")
            .where("requesterId", "==", userId)
            .limit(1)
            .get();

        if (!prayersQuery.empty) continue;

        // Check for intercessions
        const intercessionsQuery = await adminDb.collection("user_intercessions")
            .where("userId", "==", userId)
            .limit(1)
            .get();

        if (!intercessionsQuery.empty) continue;

        // Abandoned!
        batch.delete(userDoc.ref);
        deletedCount++;

        if (deletedCount % batchSize === 0) {
            await batch.commit();
            batch = adminDb.batch();
        }
    }

    if (deletedCount % batchSize !== 0) {
        await batch.commit();
    }

    revalidatePath(`/admin/${key}`);
    return { deletedCount };
}

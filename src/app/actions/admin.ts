
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
    await adminDb.collection("prayers").doc(prayerId).update({
        "moderation.status": "clean",
        "moderation.reviewed": true,
        "moderation.reviewedAt": new Date(),
        visibility: "public"
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

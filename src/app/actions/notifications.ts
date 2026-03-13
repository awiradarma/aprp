"use server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";

export async function savePushTokenAction(token: string) {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;
    if (!uuid) return { success: false, error: "No session found" };

    try {
        await adminDb.collection("users").doc(uuid).set({
            fcmToken: token,
            notificationsEnabled: true,
            updatedAt: new Date()
        }, { merge: true });

        return { success: true };
    } catch (e) {
        console.error("Failed to save push token", e);
        return { success: false, error: "Database error" };
    }
}

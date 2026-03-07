"use server";
import { cookies } from "next/headers";
import { customAlphabet } from "nanoid";
import { adminDb } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

// custom nanoid for 12-char alphanumeric
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

export async function getOrCreateRecoveryCode() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    if (!uuid) return null;

    try {
        const userDoc = await adminDb.collection("users").doc(uuid).get();
        if (userDoc.exists) {
            return userDoc.data()?.recoveryCode;
        }

        // Create a new recovery code
        const recoveryCode = nanoid();
        await adminDb.collection("users").doc(uuid).set({
            recoveryCode,
            createdAt: new Date(),
        });
        return recoveryCode;
    } catch (error) {
        console.error("Error creating recovery code", error);
        return null;
    }
}

export async function recoverSessionAction(formData: FormData) {
    const code = formData.get("recoveryCode") as string;
    if (!code || code.trim().length !== 12) {
        throw new Error("Invalid Recovery Code format.");
    }

    try {
        const usersSnapshot = await adminDb.collection("users").where("recoveryCode", "==", code.trim()).get();
        if (usersSnapshot.empty) {
            throw new Error("Recovery Code not found.");
        }

        const matchedUserId = usersSnapshot.docs[0].id;

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'stub_user_id',
            value: matchedUserId,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });
    } catch (error) {
        console.error("Error recovering session", error);
        throw new Error("Failed to recover session.");
    }

    redirect("/dashboard");
}

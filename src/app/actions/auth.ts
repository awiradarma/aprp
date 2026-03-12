"use server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;

    if (!uuid) {
        throw new Error("Unauthorized: No stub user found.");
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string; // in mock we won't even hash it

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    try {
        // Upgrade the user document from anonymous stub to registered profile
        await adminDb.collection("users").doc(uuid).set({
            isRegistered: true,
            email,
            // mock only, never store raw passwords normally
            mockPassword: password,
        }, { merge: true });

        // In a real Firebase flow, we might link the anonymous Auth credential 
        // to an Email/Password credential. 
    } catch (error) {
        console.error("Error registering user", error);
        throw new Error("Failed to register user.");
    }

    // Redirect to dashboard on success
    redirect("/dashboard");
}

export async function trackVisitAction() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;
    if (!uuid) return;

    try {
        await adminDb.collection("users").doc(uuid).set({
            lastSeenAt: new Date()
        }, { merge: true });
    } catch (e) {
        console.error("Failed to track visit", e);
    }
}

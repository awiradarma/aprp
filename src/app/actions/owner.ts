"use server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { revalidatePath } from "next/cache";

async function getOwnerOrThrow(prayerId: string) {
    const cookieStore = await cookies();
    const uuid = cookieStore.get('stub_user_id')?.value;
    if (!uuid) throw new Error("Unauthorized");

    const doc = await adminDb.collection("prayers").doc(prayerId).get();
    if (!doc.exists) throw new Error("Prayer not found");

    const data = doc.data() as any;
    if (data.requesterId !== uuid) throw new Error("Forbidden: not the owner");

    return { uuid, data };
}

export async function markAnsweredAction(formData: FormData) {
    const prayerId = formData.get("prayerId") as string;
    await getOwnerOrThrow(prayerId);

    await adminDb.collection("prayers").doc(prayerId).update({
        answeredAt: new Date(),
    });

    revalidatePath(`/p/${prayerId}`);
    revalidatePath("/discover");
}

export async function editPrayerAction(formData: FormData) {
    const prayerId = formData.get("prayerId") as string;
    let newText = formData.get("text") as string;

    const { validatePrayerText } = await import("@/lib/validation");
    newText = validatePrayerText(newText);

    await getOwnerOrThrow(prayerId);

    await adminDb.collection("prayers").doc(prayerId).update({
        text: newText,
        editedAt: new Date(),
    });

    revalidatePath(`/p/${prayerId}`);
    revalidatePath("/discover");
}

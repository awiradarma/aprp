"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLanguageAction(formData: FormData) {
    const lang = formData.get("lang") as string;
    const validLangs = ["en", "pt", "es", "fr", "ko", "id"];
    if (!validLangs.includes(lang)) return;

    const cookieStore = await cookies();
    cookieStore.set("lang", lang, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    });

    revalidatePath("/", "layout");
}

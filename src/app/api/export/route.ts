import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const uuid = cookieStore.get("stub_user_id")?.value;

    if (!uuid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const prayersQuery = await adminDb.collection("prayers").where("requesterId", "==", uuid).get();
        const prayers = prayersQuery.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
                followUps: (data.followUps || []).map((f: any) => ({
                    ...f,
                    createdAt: f.createdAt?.toDate ? f.createdAt.toDate().toISOString() : f.createdAt
                }))
            };
        });

        const exportData = {
            exportDate: new Date().toISOString(),
            userId: uuid,
            prayers
        };

        const jsonString = JSON.stringify(exportData, null, 2);

        return new NextResponse(jsonString, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="prayer_journal_${new Date().toISOString().split('T')[0]}.json"`,
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

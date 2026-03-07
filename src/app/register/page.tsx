import { registerAction } from "../actions/auth";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminDb } from "@/lib/firebase/server";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const cookieStore = await cookies();
    const uuid = cookieStore.get("stub_user_id")?.value;

    if (uuid) {
        // Check if already registered
        const userDoc = await adminDb.collection("users").doc(uuid).get();
        if (userDoc.exists && userDoc.data()?.isRegistered) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-xl font-bold text-white mb-2">Upgrade Profile</h1>
                    <p className="text-blue-100 text-sm">Convert your anonymous session into a permanent account.</p>
                </div>

                <div className="p-6">
                    <form action={registerAction} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="w-full bg-gray-50 text-gray-800 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                className="w-full bg-gray-50 text-gray-800 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                        >
                            Register & Sync Data
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Your existing prayer requests and intercessions will be kept.
                        </p>
                    </form>

                    <div className="text-center mt-4 border-t pt-4">
                        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

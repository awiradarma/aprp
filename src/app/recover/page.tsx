import { recoverSessionAction } from "../actions/recovery";
import Link from "next/link";

export default function RecoverPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <main className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-600 p-6 text-center">
                    <h1 className="text-xl font-bold text-white mb-2">Recover Session</h1>
                    <p className="text-blue-100 text-sm">Enter your 12-character alphanumeric code to restore your profile.</p>
                </div>

                <div className="p-6">
                    <form action={recoverSessionAction} className="space-y-4">
                        <div>
                            <label htmlFor="recoveryCode" className="block text-sm font-medium text-gray-700 mb-1">
                                Recovery Code
                            </label>
                            <input
                                type="text"
                                name="recoveryCode"
                                id="recoveryCode"
                                required
                                pattern="[a-zA-Z0-9]{12}"
                                maxLength={12}
                                className="w-full font-mono tracking-widest text-center uppercase bg-gray-50 text-gray-800 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                placeholder="ABC123XYZ456"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex justify-center py-3 px-4 rounded-lg transition-colors shadow-sm"
                        >
                            Recover My Profile
                        </button>

                        <div className="text-center mt-4 border-t pt-4">
                            <Link href="/" className="text-sm text-blue-600 hover:underline">
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

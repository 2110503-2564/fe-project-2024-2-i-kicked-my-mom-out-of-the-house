"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut, XCircle } from "lucide-react";

export default function LogoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen font-serif leading-relaxed tracking-wider">
            <div className="bg-white p-10 md:p-16 rounded-xl shadow-lg text-center w-[90%] max-w-lg leading-relaxed tracking-wider">
                <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-relaxed tracking-wider">Are you sure?</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed tracking-wider">Do you really want to log out?</p>

                <div className="grid grid-cols-2 gap-4">
                    {/* Cancel Button */}
                    <button
                        onClick={() => router.back()}
                        className="w-40 h-12 text-lg opacity-90 bg-gray-300 hover:bg-gray-400 rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider"
                    >
                        <XCircle className="w-6 h-6 mr-2" />
                        Cancel
                    </button>

                    {/* Confirm Logout Button */}
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="text-white w-40 h-12 text-lg opacity-90 bg-red-600 hover:bg-red-700  rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Logging out...
                            </>
                        ) : (
                            <>
                                <LogOut className="w-6 h-6 mr-2" /> Yes, Logout
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

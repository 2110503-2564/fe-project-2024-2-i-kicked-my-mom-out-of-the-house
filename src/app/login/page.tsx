"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import userLogIn from '@/libs/userLogin';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true);

        if (!email || !password) {
            setError("Email and password are required!");
            setLoading(false);
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        })

        if(res?.error) {
            setError("Invalid email or password");
        }else {
            router.push("/");
            router.refresh()
        }
    
        console.log("Submitting with:", { email, password });
        setLoading(false);
    };
    

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black font-serif p-6 leading-relaxed tracking-wider">
            <div className="w-full max-w-md bg-white shadow-lg p-6 rounded-lg">
                <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={onSubmit}>
                    {/* Email Input */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="email" className="text-sm font-serif w-full">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col space-y-1.5">
                        <label htmlFor="password" className="text-sm font-serif w-full">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        />
                    </div>

                    {/* Button group */}
                    <div className="flex justify-between mt-6">
                        {/* Register button */}
                        <button
                            type="button"
                            className="w-40 h-12 text-lg opacity-90 bg-gray-300 hover:bg-gray-400 rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider"
                            onClick={() => router.push("api/auth/register")} // ไปยังหน้า Register
                        >
                            Register
                        </button>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-40 h-12 text-lg opacity-90 ${loading ? "bg-gray-400 cursor-not-allowed" : "hover:shadow-inner hover:shadow-blue-800 hover:bg-blue-500 bg-blue-600 shadow-lg text-white"} py-2 px-4 rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

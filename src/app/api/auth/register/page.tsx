"use client";
import { useState } from 'react';
import { TextField } from "@mui/material";
import { useRouter } from 'next/navigation';
import { register } from 'module';

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        console.log({ name, tel, email, password }); // Log input data

        if (!name || !tel || !email || !password) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await fetch('https://ikickedmymom.vercel.app/RentalC01/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, tel, email, password, role: "user" }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Register successful.");
                router.push("api/auth/signin"); // Redirect to login
            } else {
                alert("Register failed. Please try again.");
            }
        } catch (error) {
            console.error("Error registering:", error);
            alert("Registration failed. Please try again.");
        }
    }

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black font-serif p-6 leading-relaxed tracking-wider">
            <div className="w-full max-w-sm bg-white shadow-lg p-6 rounded-lg">
                <h1 className="text-4xl font-bold mb-6 text-center">Register</h1>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <TextField
                        className='font-serif'
                        fullWidth variant="standard"
                        label="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        className='font-serif'
                        fullWidth variant="standard"
                        label="Tel"
                        type="tel"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                    />
                    <TextField
                        className='font-serif'
                        fullWidth variant="standard"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        className='font-serif'
                        fullWidth variant="standard"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {/* Centering the button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="w-40 h-12 text-lg opacity-90 hover:shadow-inner hover:shadow-blue-800 
                            hover:bg-blue-500 bg-blue-600 shadow-lg text-white py-2 px-4 
                            rounded-xl font-serif flex items-center justify-center relative group"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

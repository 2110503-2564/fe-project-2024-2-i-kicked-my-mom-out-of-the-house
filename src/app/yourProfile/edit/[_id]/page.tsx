"use client";
import getUserProfile from "@/libs/getUserProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function YourProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
  });

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(session.user.token);
        setUser(userProfile);
        setFormData({
          name: userProfile?.data?.name || "",
          email: userProfile?.data?.email || "",
          tel: userProfile?.data?.tel || "",
        });
      } catch (error) {
        console.error("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, [session]);

  const updateUser = async (id: string, updatedData: object, token: string) => {
    try {
      const response = await fetch(`https://ikickedmymom.vercel.app/RentalC01/auth/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User updated successfully:", data);
      alert("Profile updated successfully!");
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.data?._id || !session?.user?.token) {
      alert("User not found or unauthorized");
      return;
    }
    updateUser(user.data._id, formData, session.user.token);
  };

  if (status === "loading")
    return (
      <div className="h-screen flex flex-col items-center justify-center font-serif">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h1>
        <p className="text-lg text-blue-600 animate-pulse">Loading...</p>
      </div>
    );

  if (!session)
    return (
      <div className="h-screen flex flex-col items-center justify-center font-serif">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Profile</h1>
        <p className="text-lg text-red-600">You are not logged in</p>
      </div>
    );

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-6 font-serif">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Profile</h1>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Telephone</label>
            <input
              type="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-md shadow-md transition duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

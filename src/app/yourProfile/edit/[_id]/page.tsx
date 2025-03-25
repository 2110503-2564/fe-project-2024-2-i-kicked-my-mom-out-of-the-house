'use client';
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
        console.log("Failed to load user profile");
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

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in</p>;

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">tel</label>
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}

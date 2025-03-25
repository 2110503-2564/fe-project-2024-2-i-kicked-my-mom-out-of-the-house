"use client";
import getUserProfile from "@/libs/getUserProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function YourProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(session.user.token);
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  const handleRedirect = (id: string) => {
    router.push(`/yourProfile/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-serif">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <p className="text-lg text-blue-500 font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-serif">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h1>
        <h1 className="text-xl font-semibold text-red-600">Please login or register</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 font-serif">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <div className="space-y-4 text-center">
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold text-gray-900">Name:</span> {user?.data?.name}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold text-gray-900">Telephone:</span> {user?.data?.tel}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold text-gray-900">Email:</span> {user?.data?.email}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <span className="font-semibold text-gray-900">Role:</span> {user?.data?.role}
          </p>
          <button
            className="w-40 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-300"
            onClick={() => handleRedirect(user?.data?._id)}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

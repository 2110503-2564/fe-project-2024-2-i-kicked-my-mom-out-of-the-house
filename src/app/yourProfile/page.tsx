"use client"
import getUserProfile from "@/libs/getUserProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
export default function yourProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!session?.user?.token) return;

    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(session.user.token);
        setUser(userProfile);
      } catch (error) {
        console.log('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  const router = useRouter();
  const handleRedirect = (id: string) => {
    router.push(`/yourProfile/edit/${id}`);
  };
  if (!session) {
    return (<h1>Please login or Register</h1>);
  }
  return (<>
    <h1>Your Profile</h1>
    <div>
      <p>{user?.data?.name}</p>
      <p>{user?.data?.tel}</p>
      <p>{user?.data?.email}</p>
      <p>{user?.data?.role}</p>
      <button
        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
        onClick={() => handleRedirect(user?.data?._id)}
      >
        Update this reservation
      </button>
    </div>
  </>
  );
}
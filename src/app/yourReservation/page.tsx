"use client"
import { useAppSelector } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { removeReservation } from "@/redux/features/cartSlice"
import { useDispatch } from "react-redux"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import getUserProfile from '@/libs/getUserProfile';
import { useRouter } from "next/navigation"

export default function ReservationCart() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

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

  useEffect(() => {
    if (session?.user?.token) {
      getBooking();
    }
  }, [session]);

  if (!session) {
    return (<h1 className="text-center text-2xl font-serif mt-10">Please login or Register</h1>);
  }

  const getBooking = async () => {
    try {
      const response = await fetch('https://ikickedmymom.vercel.app/RentalC01/booking', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.data);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const deleteBooking = async (_id: string) => {
    try {
      const response = await fetch(`https://ikickedmymom.vercel.app/RentalC01/booking/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== _id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const router = useRouter();
  const handleRedirect = (id: string) => {
    router.push(`/reservation/update/${id}`);
  };

  const calculateDuration = (pickupDate: string, dropoffDate: string): number => {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const timeDifference = dropoff.getTime() - pickup.getTime();
    return timeDifference / (1000 * 3600 * 24);
  };

  // กรองรายการการจองของผู้ใช้
  const userBookings = bookings.filter((bookingItem) => bookingItem.user === user?.data?._id);

  return (
    <div className="container mx-auto max-w-4xl p-5">
      <h1 className="text-center text-3xl font-bold font-serif text-black mb-6 leading-relaxed tracking-wider">
        {user?.data && user?.data.role === 'admin' ? "All Bookings" : "Your Bookings"}
      </h1>

      <ul className="space-y-5">
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 text-lg leading-relaxed tracking-wider">No bookings found.</p>
        ) : (
          (user?.data.role === 'admin' ? bookings : userBookings).map((bookingItem) => (
            <div key={bookingItem._id} className="bg-white shadow-lg rounded-lg border p-5 space-y-3 leading-relaxed tracking-wider">
              {user?.data.role === 'admin' && (
                <div className="text-lg font-semibold text-gray-700">
                  User: <span className="font-bold leading-relaxed tracking-wider">{bookingItem.user?.name}</span>
                </div>
              )}
              <div className="text-lg font-semibold font-serif leading-relaxed tracking-wider">
                Provider: <span className="text-indigo-700">{bookingItem.rentalCarProvider?.name}</span>
              </div>
              <div className="text-gray-600 font-serif leading-relaxed tracking-wider">Pick-Up: {new Date(bookingItem.pickupDate).toLocaleDateString()}</div>
              <div className="text-gray-600 font-serif leading-relaxed tracking-wider">Drop-off: {new Date(bookingItem.dropoffDate).toLocaleDateString()}</div>
              <div className="text-indigo-700 font-semibold font-serif">
                Duration: {calculateDuration(bookingItem.pickupDate, bookingItem.dropoffDate)} days
              </div>

              <div className="flex space-x-3">
                <button
                  className="w-full h-12 text-lg opacity-90 bg-red-600 hover:bg-red-700 rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider text-white"
                  onClick={() => deleteBooking(bookingItem._id)}
                >
                  Remove Booking
                </button>
                <button
                  className="w-full h-12 text-lg opacity-90 hover:shadow-blue-800 hover:bg-blue-500 bg-blue-600 rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider text-white"
                  onClick={() => handleRedirect(bookingItem._id)}
                >
                  Update Booking
                </button>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
}
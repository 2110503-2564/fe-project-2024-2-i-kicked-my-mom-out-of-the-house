"use client"
import { useAppSelector } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { removeReservation } from "@/redux/features/cartSlice"
import { useDispatch, UseDispatch } from "react-redux"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import getUserProfile from '@/libs/getUserProfile';
import { useRouter } from "next/navigation"

export default function ReservationCart() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [editedBooking, setEditedBooking] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");

  const handleCheckboxChange = (bookingId: string) => {
    if (editedBooking === bookingId) {
      setEditedBooking(null);
      setIsEditing(false);
      setEditText("");
    } else {
      setEditedBooking(bookingId);
      setIsEditing(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(event.target.value);
  };

  const handleSave = () => {
    if (editedBooking && editText) {
      console.log(`Saving changes for booking ${editedBooking}: ${editText}`);
      setIsEditing(false);
      setEditedBooking(null);
      setEditText(""); // ล้างข้อความหลังจากบันทึก
    }
  };

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
    return (<h1>Please login or Register</h1>);
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
    <>
      {user?.data && user?.data.role === 'admin' ? (
        <>
          <h1>ALL bookings</h1>
          <ul>
            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              bookings.map((bookingItem) => (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={bookingItem._id}>
                  <div className="text-xl">{bookingItem.user?.name}</div>
                  <div className="text-l">Provider: {bookingItem.rentalCarProvider?.name}</div>
                  <div className="text-sm">Pick-Up: {new Date(bookingItem.pickupDate).toLocaleDateString()}</div>
                  <div className="text-sm">Drop-off: {new Date(bookingItem.dropoffDate).toLocaleDateString()}</div>
                  <div className="text-md">
                    Duration: {calculateDuration(bookingItem.pickupDate, bookingItem.dropoffDate)} days
                  </div>
                  <button
                    className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                    onClick={() => deleteBooking(bookingItem._id)}
                  >
                    Remove from Cart
                  </button>
                  <button
                    className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                    onClick={() => handleRedirect(bookingItem._id)}
                  >
                    Update this reservation
                  </button>
                </div>
              ))
            )}
          </ul>
        </>
      ) : (
        <>
          <h1>Your bookings</h1>
          <ul>
            {userBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              userBookings.map((bookingItem) => (
                <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={bookingItem._id}>
                  <div className="text-l">Provider: {bookingItem.rentalCarProvider?.name}</div>
                  <div className="text-sm">Pick-Up: {new Date(bookingItem.pickupDate).toLocaleDateString()}</div>
                  <div className="text-sm">Drop-off: {new Date(bookingItem.dropoffDate).toLocaleDateString()}</div>
                  <div className="text-md">
                    Duration: {calculateDuration(bookingItem.pickupDate, bookingItem.dropoffDate)} days
                  </div>
                  <button
                    className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                    onClick={() => deleteBooking(bookingItem._id)}
                  >
                    Remove from Cart
                  </button>
                  <button
                    className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                    onClick={() => handleRedirect(bookingItem._id)}
                  >
                    Update this reservation
                  </button>
                </div>
              ))
            )}
          </ul>
        </>
      )}
    </>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { TextField } from "@mui/material";
import { useRouter } from 'next/navigation';
import { register } from 'module';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { addReservation } from '@/redux/features/cartSlice';
import getUserProfile from '@/libs/getUserProfile';
import dayjs, { Dayjs } from "dayjs";
import getProviders from '@/libs/getProviders';
import DateReserve from '@/components/LocationDateReserve';
import { ProviderItem } from '../../../interfaces';


export default function Reservation() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [options, setOptions] = useState<{ _id: number, name: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>();
  const [pickupDate, setPickupDate] = useState<Dayjs | null>(null);
  const [dropoffDate, setDropOffDate] = useState<Dayjs | null>(null);
  const [selectOptionName, setSelectedOptionName] = useState<string>("...")

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    return <p>You are not logged in</p>;
  }

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getProviders();
        if (response?.data?.length) {
          setOptions(response.data.map((provider: ProviderItem) => ({
            _id: provider._id,  // แก้กลับมาใช้ `_id` ให้ตรงกับตัวเลือก
            name: provider.name,
          })));
        }
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };

    fetchProviders();
  }, []);

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
  }, [session]);  // 🔍 เช็คเฉพาะ session เปลี่ยนแปลง


  if (loading) return <div>Loading...</div>;

  const dispatch = useDispatch<AppDispatch>();

  const makeBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.data?._id || !selectedOption || !pickupDate || !dropoffDate) {
      alert("Please select all required fields.");
      return;
    }

    const bookingData = {
      user: user.data._id,
      pickupDate: dayjs(pickupDate).format("YYYY-MM-DD"),
      dropoffDate: dayjs(dropoffDate).format("YYYY-MM-DD"),
      rentalCarProvider: selectedOption,
      createdAt: dayjs().toISOString(),
    };

    console.log("Booking Data:", bookingData); // 🛠 Debug ข้อมูลก่อนส่ง

    try {
      const response = await fetch('https://ikickedmymom.vercel.app/RentalC01/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.token}` // ถ้าต้องใช้ Token
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log("Server Response:", data); // 🛠 Debug Response

      if (response.ok) {
        alert("Booking successful!");
      } else {
        alert(`Booking failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error Booking:", error);
      alert("Booking failed. Please try again.");
    }
  };




  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = JSON.parse(event.target.value);
    setSelectedOption(selected.id);
    setSelectedOptionName(selected.name);
  };


  return (
    <main className="w-[100%] flex flex-col items-center space-y-4">
      <div className="flex-flex-col items-center text-xl font-medium">New Reservation</div>
      <div className="flex-flex-col items-center text-xl font-medium">Provider</div>
      <select id="dynamic-dropdown" value={selectedOption} onChange={handleChange}>
        <option value="">Select a provider</option>
        {options.length > 0 ? (
          options.map((provider) => (
            <option key={provider._id} value={JSON.stringify({ id: provider._id, name: provider.name })}>
              {provider.name}
            </option>
          ))
        ) : (
          <option>Loading...</option>
        )}
      </select>

      {/* แสดงชื่อของ provider ที่เลือก */}
      {selectedOption && (
        <div className="mt-2 text-lg font-semibold text-blue-600">
          Selected Provider: {selectOptionName}
        </div>
      )}
      <div className="w-fit space-y-2">
        <div className="text-md text-left text-gray-600">Pick-Up Date</div>
        <DateReserve onDateChange={(value: Dayjs) => { setPickupDate(value) }} />
        <div className="text-md text-left text-gray-600">Return Date and Location</div>
        <DateReserve onDateChange={(value: Dayjs) => { setDropOffDate(value) }} />
      </div>
      <button
        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 shadow-sm text-white"
        onClick={(e) => {
          e.preventDefault();
          makeBooking(e);
          // alert("make resercation complete");
        }
        }
      >
        Make reservation with {selectOptionName} provider
      </button>
    </main >
  );
}

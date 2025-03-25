"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dayjs, { Dayjs } from "dayjs";
import getProviders from "@/libs/getProviders";
import getUserProfile from "@/libs/getUserProfile";
import DateReserve from "@/components/LocationDateReserve";
import { ProviderItem } from "../../../interfaces";

export default function Reservation() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [options, setOptions] = useState<{ _id: number; name: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const [selectOptionName, setSelectedOptionName] = useState<string>("...");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getProviders();
        if (response?.data?.length) {
          setOptions(
            response.data.map((provider: ProviderItem) => ({
              _id: provider._id,
              name: provider.name,
            }))
          );
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
        console.error("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, [session]);

  const makeBooking = async () => {
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

    try {
      const response = await fetch("https://ikickedmymom.vercel.app/RentalC01/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.token}`,
        },
        body: JSON.stringify(bookingData),
      });
      if (response.ok) {
        alert("Booking successful!");
      } else {
        const data = await response.json();
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
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center font-serif">
        New Reservation
      </h1>
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg leading-relaxed tracking-wider font-serif">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Rental Car Provider:</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={selectedOption}
              onChange={handleChange}
            >
              <option value="">Select a provider</option>
              {options.map((provider) => (
                <option
                  key={provider._id}
                  value={JSON.stringify({ id: provider._id, name: provider.name })}
                >
                  {provider.name}
                </option>
              ))}
            </select>
            {selectedOption && (
              <p className="mt-2 text-indigo-700">Selected Provider: {selectOptionName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Pick-Up Date:</label>
            <DateReserve onDateChange={(value: Dayjs) => setPickupDate(dayjs(value).format("YYYY-MM-DD"))} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Drop-Off Date:</label>
            <DateReserve onDateChange={(value: Dayjs) => setDropoffDate(dayjs(value).format("YYYY-MM-DD"))} />
          </div>
          <div className="flex justify-center">
            <button
              className="w-60 h-12 text-lg opacity-90 hover:shadow-blue-800 hover:bg-blue-500 bg-blue-600 rounded-xl font-serif flex items-center justify-center leading-relaxed tracking-wider text-white"
              onClick={makeBooking}
            >
              Make Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
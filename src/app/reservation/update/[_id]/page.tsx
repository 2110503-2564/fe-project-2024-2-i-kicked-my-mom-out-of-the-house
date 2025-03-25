"use client";
import DateReserve from "@/components/LocationDateReserve";
import getProviders from "@/libs/getProviders";
import getUserProfile from "@/libs/getUserProfile";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProviderItem } from "../../../../../interfaces";

export default function UpdatePage() {
  const { data: session } = useSession();
  const { _id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [options, setOptions] = useState<{ _id: number; name: string }[]>([]);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<any>(null);
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
    if (_id && typeof _id === "string") {
      fetchBookingDetails(_id);
    }
  }, [_id]);

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(
        `https://ikickedmymom.vercel.app/RentalC01/booking/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setBookingDetails(data.data);
      setPickupDate(data.data.pickupDate);
      setDropoffDate(data.data.dropoffDate);
      setSelectedOption(data.data.rentalCarProvider);
      setUser(data.data.user);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const SaveChanges = async () => {
    const updatedData = {
      user: bookingDetails.user,
      pickupDate: dayjs(pickupDate).format("YYYY-MM-DD"),
      dropoffDate: dayjs(dropoffDate).format("YYYY-MM-DD"),
      rentalCarProvider: selectedOption,
    };
    try {
      const response = await fetch(
        `https://ikickedmymom.vercel.app/RentalC01/booking/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      alert("Booking updated successfully");
    } catch (error) {
      alert("Error updating booking, please try again");
      console.error("Error updating booking:", error);
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
        Update Reservation
      </h1>
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg leading-relaxed tracking-wider font-serif">
        {bookingDetails ? (
          <div>
            {user?.data?.role === "admin" && (
              <p className="text-gray-600">User: {bookingDetails.user}</p>
            )}
            <h2 className="text-lg font-semibold text-gray-700">
              Reservation ID: {bookingDetails._id}
            </h2>
            <p className="text-gray-600">
              Provider: {bookingDetails.rentalCarProvider.name}
            </p>
            <p className="text-gray-600">
              Pick-Up Date: {new Date(bookingDetails.pickupDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Drop-Off Date: {new Date(bookingDetails.dropoffDate).toLocaleDateString()}
            </p>

            <h2 className="text-xl font-bold mt-4 text-gray-800">Edit Reservation</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold">
                  Rental Car Provider:
                </label>
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
                <label className="block text-gray-700 font-semibold">
                  Pick-Up Date:
                </label>
                <DateReserve
                  onDateChange={(value: Dayjs) => setPickupDate(dayjs(value).format("YYYY-MM-DD"))}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">
                  Drop-Off Date:
                </label>
                <DateReserve
                  onDateChange={(value: Dayjs) => setDropoffDate(dayjs(value).format("YYYY-MM-DD"))}
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="w-40 h-12 text-lg opacity-90 hover:shadow-blue-800 hover:bg-blue-500 bg-blue-600 rounded-xl font-serif flex items-center justify-center relative group leading-relaxed tracking-wider text-white"
                  onClick={SaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">Loading...</p>
        )}
      </div>
    </div>
  );
}

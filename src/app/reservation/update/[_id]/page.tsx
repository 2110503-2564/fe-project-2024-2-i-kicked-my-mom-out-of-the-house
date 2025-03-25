"use client"
import DateReserve from "@/components/LocationDateReserve";
import getProviders from "@/libs/getProviders";
import getUserProfile from "@/libs/getUserProfile";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";
import { ProviderItem } from "../../../../../interfaces";

export default function updatePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);

  const { _id } = useParams();
  console.log(_id)
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [options, setOptions] = useState<{ _id: number, name: string }[]>([]);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<any>(null); // Rental car provider
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectOptionName, setSelectedOptionName] = useState<string>("...")

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
    if (_id && typeof _id === 'string') {
      fetchBookingDetails(_id); // เรียกข้อมูลการจองด้วย id หาก id เป็น string
    }
  }, [_id]);


  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`https://ikickedmymom.vercel.app/RentalC01/booking/${id}`, {
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
      console.log(data.data)
      setBookingDetails(data.data);
      setPickupDate(data.data.pickupDate);
      setDropoffDate(data.data.dropoffDate);
      setSelectedOption(data.data.rentalCarProvider);
      setUser(data.data.user); // หรือดึงจาก session หรือจากข้อมูลอื่น
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching booking details:", error);
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
      }
    };

    fetchUserProfile();
  }, [session]);

  ///============updateBooking=============
  const SaveChanges = async () => {
    const updatedData = {
      user: bookingDetails.user,
      pickupDate: dayjs(pickupDate).format("YYYY-MM-DD"),
      dropoffDate: dayjs(dropoffDate).format("YYYY-MM-DD"),
      rentalCarProvider: selectedOption,
      createdAt: dayjs().toISOString(),
    };
    try {
      const response = await fetch(`https://ikickedmymom.vercel.app/RentalC01/booking/${_id}`, {
        method: 'PUT', // หรือ 'PATCH' ขึ้นอยู่กับ API ของคุณ
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.token}`,  // ถ้ามี token
        },
        body: JSON.stringify(updatedData),  // ส่งข้อมูลการอัปเดต
      });

      console.log(JSON.stringify(updatedData))
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      alert("Booking updated successfully")
      console.log('Booking updated successfully:', data);

    } catch (error) {
      alert("Error updating booking please Try again")
      console.error('Error updating booking:', error);
    }
  };


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = JSON.parse(event.target.value);
    setSelectedOption(selected.id);
    setSelectedOptionName(selected.name);
  };

  return (
    <>
      <h1>Update Reservation</h1>
      {bookingDetails ? (
        <div>
          {user?.data && user?.data.role === 'admin' ? <p>User: {bookingDetails.user}</p> : ''}
          <h2>Your Reservation Id: {bookingDetails._id}</h2> {/* จะไม่มีข้อผิดพลาดหาก bookingDetails ถูกโหลดแล้ว */}
          <p>provider: {bookingDetails.rentalCarProvider.name}</p>
          <p>Pick-Up Date: {new Date(bookingDetails.pickupDate).toLocaleDateString()}</p>
          <p>Drop-Off Date: {new Date(bookingDetails.dropoffDate).toLocaleDateString()}</p>

          <h1>EDIT</h1>

          <div>
            <div>
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
            </div>
            <div className="w-fit space-y-2">
              <div className="text-md text-left text-gray-600">Pick-Up Date</div>
              <DateReserve onDateChange={(value: Dayjs) => { setPickupDate(dayjs(value).format("YYYY-MM-DD")) }} />
              <div className="text-md text-left text-gray-600">Drop off</div>
              <DateReserve onDateChange={(value: Dayjs) => { setDropoffDate(dayjs(value).format("YYYY-MM-DD")) }} />
            </div>
            <div>
              <button onClick={SaveChanges
              }>Save Changes</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}
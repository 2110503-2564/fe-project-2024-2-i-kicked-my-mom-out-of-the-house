"use client"
import { useAppSelector } from "@/redux/store"
import { AppDispatch } from "@/redux/store"
import { removeReservation } from "@/redux/features/cartSlice"
import { useDispatch, UseDispatch } from "react-redux"
import { BookingItem } from "../../interfaces"

export default function ReservationCart() {
    const providerItems = useAppSelector((state) => state.cartSlice.providerItems || []);
    const dispatch = useDispatch<AppDispatch>()

    const calculateDuration = (pickupDate: string, dropoffDate: string): number => {
        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);
        const timeDifference = dropoff.getTime() - pickup.getTime();
        return timeDifference / (1000 * 3600 * 24);
    }
    return (
        <>
            {
                Array.isArray(providerItems) && providerItems.length > 0 ? (
                    providerItems.map((BookingItem) => (
                        <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={BookingItem._id}>
                            <div className="text-xl">{BookingItem.user}</div>
                            <div className="text-l">provider: {BookingItem.rentalCarProvider}</div>
                            <div className="text-sm">Pick-Up: {BookingItem.pickupDate}</div>
                            <div className="text-sm">Drop-off: {BookingItem.dropoffDate}</div>
                            <div className="text-md">
                                Duration: {calculateDuration(BookingItem.pickupDate, BookingItem.dropoffDate)} days
                            </div>
                            <button
                                className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm"
                                onClick={() => dispatch(removeReservation(BookingItem))}
                            >
                                Remove from Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No reservations in the cart.</div> // Optional message if no items
                )
            }

        </>
    )
}
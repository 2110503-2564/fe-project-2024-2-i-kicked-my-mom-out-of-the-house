import { createSlice } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interfaces";
import { PayloadAction } from "@reduxjs/toolkit";

type CartState = {
    providerItems: BookingItem[]
}

const initialState: CartState = { providerItems: [] }

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addReservation: (state, action: PayloadAction<BookingItem>) => {
            // console.log(state.providerItems);
            // if (!Array.isArray(state.providerItems)) {
            //     state.providerItems = []; // Safeguard against non-array state
            // }
            // state.providerItems.push(action.payload);

            const newBooking = action.payload;
            const existingBookingIndex = state.providerItems.findIndex(
                (booking) =>
                    // booking.nameLastname === newBooking.nameLastname &&
                    // booking.tel === newBooking.tel &&
                    // booking.venue === newBooking.venue &&
                    // booking.bookDate === newBooking.bookDate
                    booking.pickupDate === newBooking.pickupDate
                    && booking.dropoffDate === newBooking.dropoffDate
                    && booking.rentalCarProvider === newBooking.rentalCarProvider
            );

            if (existingBookingIndex !== -1) {
                // ถ้ามีการจองเดิมอยู่แล้วในวันเดียวกันและสถานที่เดียวกัน
                state.providerItems[existingBookingIndex] = newBooking;  // แทนที่ข้อมูลเดิม
            } else {
                // ถ้ายังไม่มีการจองเดิม เพิ่มข้อมูลใหม่เข้าไป
                state.providerItems.push(newBooking);
            }

        },

        removeReservation: (state, action: PayloadAction<BookingItem>) => {
            const remainItems = state.providerItems.filter(obj => {
                return ((obj.rentalCarProvider !== action.payload.rentalCarProvider)
                    || (obj.pickupDate !== action.payload.pickupDate)
                    || (obj.dropoffDate !== action.payload.dropoffDate))
            })
            state.providerItems = remainItems
        }
    }
})

export const { addReservation, removeReservation } = cartSlice.actions
export default cartSlice.reducer
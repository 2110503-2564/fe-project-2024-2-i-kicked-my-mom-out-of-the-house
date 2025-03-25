export interface ReservationItem {
    carId: string
    carModel: string
    numOfDays: number
    pickupDate: string
    pickupLocation: string
    returnDate: string
    returnLocation: string
}

export interface BookingItem {
    _id: string
    user: string
    pickupDate: string
    dropoffDate: string
    rentalCarProvider: string
    createdAt: string
}


export interface ProviderItem {
    _id: string
    name: string
    address: string
    district: string
    province: string
    postalcode: string
    tel: string
    region: string
}

export interface ProviderJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: ProviderItem[]
}

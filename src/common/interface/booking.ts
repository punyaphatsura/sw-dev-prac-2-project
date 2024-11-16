import { Shop } from './shop';

export interface Booking {
    _id: string;
    bookingDate: Date;
    serviceMinute: number;
    user: string;
    shop: Shop;
    createdAt: Date;
}

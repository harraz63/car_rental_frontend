import { create } from 'zustand';
import type { Booking } from '@/types';
import {
  createRental,
  getMyRentals,
  getPendingRentals,
  approveRental,
  rejectRental,
} from '@/api/rentals.api';

interface BookingState {
  bookings: Booking[];
  userBookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchAllBookings: () => Promise<void>;
  fetchUserBookings: (userId: string) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  userBookings: [],
  isLoading: false,
  error: null,

  // ADMIN: fetch all pending rentals
  fetchAllBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getPendingRentals();
      set({ bookings, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب الحجوزات', isLoading: false });
    }
  },

  // USER: fetch own rentals
  fetchUserBookings: async (_userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const userBookings = await getMyRentals();
      set({ userBookings, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب حجوزاتك', isLoading: false });
    }
  },

  // USER: create a rental request
  createBooking: async (booking) => {
    set({ isLoading: true, error: null });
    try {
      const newBooking = await createRental({
        carId: booking.car_id,
        startDate: booking.pickup_date,
        endDate: booking.dropoff_date,
      });
      set((state) => ({
        userBookings: [...state.userBookings, newBooking],
        isLoading: false,
      }));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'حدث خطأ أثناء إنشاء الحجز';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // ADMIN: approve or reject a booking
  updateBookingStatus: async (id: string, status: Booking['status']) => {
    set({ isLoading: true, error: null });
    try {
      let updated: Booking;
      if (status === 'confirmed') {
        updated = await approveRental(id);
      } else {
        updated = await rejectRental(id, 'Cancelled by admin');
      }
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        userBookings: state.userBookings.map((b) => (b.id === id ? updated : b)),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || 'حدث خطأ أثناء تحديث حالة الحجز', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

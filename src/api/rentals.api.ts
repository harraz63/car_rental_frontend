import axiosInstance from './axios';
import type { Booking } from '@/types';
import { adaptCar } from './cars.api';

// ── Shape adapter: backend Rental → frontend Booking ──────────────────────────
export function adaptRental(raw: any): Booking {
  const carRaw = raw.carId && typeof raw.carId === 'object' ? raw.carId : null;
  const userRaw = raw.userId && typeof raw.userId === 'object' ? raw.userId : null;

  // Map backend rental status → frontend booking status
  const statusMap: Record<string, Booking['status']> = {
    pending: 'pending',
    approved: 'confirmed',
    rejected: 'cancelled',
  };

  return {
    id: String(raw._id ?? raw.id),
    user_id: userRaw ? String(userRaw._id) : String(raw.userId ?? ''),
    user_name: userRaw?.name,
    user_phone: userRaw?.phone,
    car_id: carRaw ? String(carRaw._id) : String(raw.carId ?? ''),
    pickup_date: raw.startDate
      ? new Date(raw.startDate).toISOString().split('T')[0]
      : raw.pickup_date,
    dropoff_date: raw.endDate
      ? new Date(raw.endDate).toISOString().split('T')[0]
      : raw.dropoff_date,
    total_price: raw.totalPrice ?? raw.total_price ?? 0,
    payment_method: raw.payment_method ?? 'cash',
    status: statusMap[raw.status] ?? 'pending',
    notes: raw.notes,
    created_at: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    car: carRaw ? adaptCar(carRaw) : undefined,
    user: userRaw
      ? {
          id: String(userRaw._id),
          email: userRaw.email,
          full_name: userRaw.name,
          role: userRaw.role ?? 'user',
          created_at: userRaw.createdAt ?? new Date().toISOString(),
        }
      : undefined,
  };
}

// ── Rental endpoints ──────────────────────────────────────────────────────────

/** POST /rentals — user requests a rental */
export async function createRental(payload: {
  carId: string;
  startDate: string;
  endDate: string;
}): Promise<Booking> {
  const { data } = await axiosInstance.post('/rentals', payload);
  return adaptRental(data.data?.rental);
}

/** GET /rentals/my — current user's rentals */
export async function getMyRentals(): Promise<Booking[]> {
  const { data } = await axiosInstance.get('/rentals/my');
  return (data.data?.rentals ?? []).map(adaptRental);
}

/** GET /rentals/pending — admin only */
export async function getPendingRentals(): Promise<Booking[]> {
  const { data } = await axiosInstance.get('/rentals/pending');
  return (data.data?.rentals ?? []).map(adaptRental);
}

/** PATCH /rentals/:id/approve — admin */
export async function approveRental(id: string): Promise<Booking> {
  const { data } = await axiosInstance.patch(`/rentals/${id}/approve`);
  return adaptRental(data.data?.rental);
}

/** PATCH /rentals/:id/reject — admin */
export async function rejectRental(id: string, reason?: string): Promise<Booking> {
  const { data } = await axiosInstance.patch(`/rentals/${id}/reject`, { reason });
  return adaptRental(data.data?.rental);
}

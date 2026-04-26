import axiosInstance from './axios';
import type { Car, CarFilter } from '@/types';

// ── Shape adapter: backend → frontend ─────────────────────────────────────────
export function adaptCar(raw: any): Car {
  // ownerId may be a populated object or a plain string
  const ownerObj =
    raw.ownerId && typeof raw.ownerId === 'object' ? raw.ownerId : null;

  return {
    id: String(raw._id ?? raw.id),
    owner_id: ownerObj
      ? String(ownerObj._id)
      : raw.ownerId
        ? String(raw.ownerId)
        : undefined,
    owner_name: ownerObj?.name,
    owner_phone: ownerObj?.phone,
    brand: raw.brand,
    model: raw.model,
    year: raw.year,
    color: raw.color,
    daily_price: raw.dailyPrice ?? raw.daily_price,
    images:
      Array.isArray(raw.images) && raw.images.length > 0
        ? raw.images
        : [
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
          ],
    specifications: {
      seats: raw.numberOfSeats ?? raw.specifications?.seats,
      transmission: raw.transmission ?? raw.specifications?.transmission,
      fuel_type: raw.fuelType ?? raw.specifications?.fuel_type,
      engine: raw.engine ?? raw.specifications?.engine,
    },
    is_available: raw.status === 'approved',
    listing_status: (raw.status ?? raw.listing_status) as Car['listing_status'],
    description: raw.description,
    location: raw.location,
    rejection_reason: raw.rejectionReason ?? raw.rejection_reason,
    created_at: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updated_at: raw.updatedAt ?? raw.updated_at ?? new Date().toISOString(),
  };
}

// ── Adapter: frontend form → backend payload ──────────────────────────────────
export function buildCarPayload(form: {
  brand: string;
  model: string;
  year: number;
  color?: string;
  daily_price: number | string;
  location?: string;
  description?: string;
  seats?: number | string;
  transmission: string;
  fuel_type: string;
  engine?: string;
  images: string[];
}) {
  const validImages = form.images.filter((i) => i.trim());
  return {
    brand: form.brand,
    model: form.model,
    year: Number(form.year),
    color: form.color || undefined,
    dailyPrice: Number(form.daily_price),
    location: form.location || undefined,
    description: form.description || undefined,
    numberOfSeats: form.seats ? Number(form.seats) : undefined,
    // Map Arabic display values → backend enum values
    transmission: mapTransmission(form.transmission),
    fuelType: mapFuelType(form.fuel_type),
    engine: form.engine || undefined,
    images: validImages.length
      ? validImages
      : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'],
  };
}

function mapTransmission(val: string): 'automatic' | 'manual' {
  const lower = val.toLowerCase();
  if (lower === 'automatic' || lower === 'أوتوماتيك') return 'automatic';
  return 'manual';
}

function mapFuelType(val: string): 'petrol' | 'diesel' | 'hybrid' {
  const lower = val.toLowerCase();
  if (lower === 'diesel' || lower === 'ديزل') return 'diesel';
  if (lower === 'hybrid' || lower === 'هجين') return 'hybrid';
  return 'petrol';
}

// ── Car endpoints ─────────────────────────────────────────────────────────────

/** GET /cars — approved cars visible to users */
export async function getApprovedCars(_filters?: CarFilter): Promise<Car[]> {
  const { data } = await axiosInstance.get('/cars');
  return (data.data?.cars ?? []).map(adaptCar);
}

/** GET /cars/my — owner's own listings */
export async function getOwnerCars(): Promise<Car[]> {
  const { data } = await axiosInstance.get('/cars/my');
  return (data.data?.cars ?? []).map(adaptCar);
}

/** GET /cars/pending — admin only */
export async function getPendingCars(): Promise<Car[]> {
  const { data } = await axiosInstance.get('/cars/pending');
  return (data.data?.cars ?? []).map(adaptCar);
}

/** GET /cars/:id — single car (falls back to approved list scan) */
export async function getCarById(id: string): Promise<Car | null> {
  try {
    // Try approved list first (works for users)
    const { data } = await axiosInstance.get('/cars');
    const all: Car[] = (data.data?.cars ?? []).map(adaptCar);
    const found = all.find((c) => c.id === id);
    if (found) return found;
  } catch {
    // fall through
  }
  return null;
}

/** POST /cars — owner creates car */
export async function createCar(
  payload: ReturnType<typeof buildCarPayload>,
): Promise<Car> {
  const { data } = await axiosInstance.post('/cars', payload);
  return adaptCar(data.data?.car);
}

/** PATCH /cars/:id/approve — admin */
export async function approveCar(id: string): Promise<Car> {
  const { data } = await axiosInstance.patch(`/cars/${id}/approve`);
  return adaptCar(data.data?.car);
}

/** PATCH /cars/:id/reject — admin */
export async function rejectCar(id: string, reason?: string): Promise<Car> {
  const { data } = await axiosInstance.patch(`/cars/${id}/reject`, { reason });
  return adaptCar(data.data?.car);
}

/** DELETE /cars/:id — admin or owner */
export async function deleteCar(id: string): Promise<void> {
  await axiosInstance.delete(`/cars/${id}`);
}

/** PATCH /cars/:id — admin edit */
export async function updateCar(
  id: string,
  payload: Partial<ReturnType<typeof buildCarPayload>>,
): Promise<Car> {
  const { data } = await axiosInstance.patch(`/cars/${id}`, payload);
  return adaptCar(data.data?.car);
}

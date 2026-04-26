import { create } from 'zustand';
import type { Car, CarFilter } from '@/types';
import {
  getApprovedCars,
  getOwnerCars,
  getPendingCars,
  getCarById as apiGetCarById,
  createCar as apiCreateCar,
  approveCar as apiApproveCar,
  rejectCar as apiRejectCar,
  updateCar as apiUpdateCar,
  deleteCar as apiDeleteCar,
  buildCarPayload,
} from '@/api/cars.api';

interface CarState {
  cars: Car[];
  allCars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
  filters: CarFilter;
  fetchCars: (filters?: CarFilter) => Promise<void>;
  fetchAllCarsAdmin: () => Promise<void>;
  fetchOwnerCars: (ownerId: string) => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  createCar: (car: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCar: (id: string, updates: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  approveListing: (id: string) => Promise<void>;
  rejectListing: (id: string, reason: string) => Promise<void>;
  setFilters: (filters: CarFilter) => void;
  clearSelectedCar: () => void;
  clearError: () => void;
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  allCars: [],
  selectedCar: null,
  isLoading: false,
  error: null,
  filters: {},

  // USER: fetch approved cars (client-side filter by search text applied in component)
  fetchCars: async (filters?: CarFilter) => {
    set({ isLoading: true, error: null });
    try {
      let cars = await getApprovedCars(filters);

      // Client-side filters that the backend doesn't support directly
      if (filters?.maxPrice) cars = cars.filter((c) => c.daily_price <= filters.maxPrice!);
      if (filters?.location) cars = cars.filter((c) => c.location?.toLowerCase().includes(filters.location!.toLowerCase()));
      if (filters?.transmission) {
        const t = filters.transmission.toLowerCase();
        cars = cars.filter((c) =>
          c.specifications.transmission?.toLowerCase().includes(t)
        );
      }

      set({ cars, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  // ADMIN: fetch all cars including pending/rejected
  fetchAllCarsAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      // Admin sees pending + approved; combine both
      const [approved, pending] = await Promise.all([
        getApprovedCars(),
        getPendingCars(),
      ]);
      // Merge, deduplicate by id
      const map = new Map<string, Car>();
      [...approved, ...pending].forEach((c) => map.set(c.id, c));
      set({ allCars: Array.from(map.values()), isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  // OWNER: fetch own listings
  fetchOwnerCars: async (_ownerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cars = await getOwnerCars();
      set({ cars, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  // Fetch single car by id
  fetchCarById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const car = await apiGetCarById(id);
      set({ selectedCar: car, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  // OWNER: create car
  createCar: async (car) => {
    set({ isLoading: true, error: null });
    try {
      const payload = buildCarPayload({
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        daily_price: car.daily_price,
        location: car.location,
        description: car.description,
        seats: car.specifications?.seats,
        transmission: car.specifications?.transmission || 'automatic',
        fuel_type: car.specifications?.fuel_type || 'petrol',
        engine: car.specifications?.engine,
        images: car.images,
      });
      const newCar = await apiCreateCar(payload);
      set((state) => ({
        allCars: [...state.allCars, newCar],
        cars: newCar.listing_status === 'approved' ? [...state.cars, newCar] : state.cars,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  // ADMIN: edit car
  updateCar: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const payload = buildCarPayload({
        brand: updates.brand || '',
        model: updates.model || '',
        year: updates.year || new Date().getFullYear(),
        color: updates.color,
        daily_price: updates.daily_price || 0,
        location: updates.location,
        description: updates.description,
        seats: updates.specifications?.seats,
        transmission: updates.specifications?.transmission || 'automatic',
        fuel_type: updates.specifications?.fuel_type || 'petrol',
        engine: updates.specifications?.engine,
        images: updates.images || [],
      });
      const updatedCar = await apiUpdateCar(id, payload);
      set((state) => ({
        allCars: state.allCars.map((c) => (c.id === id ? updatedCar : c)),
        cars: state.cars.map((c) => (c.id === id ? updatedCar : c)),
        selectedCar: state.selectedCar?.id === id ? updatedCar : state.selectedCar,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  // ADMIN or OWNER: delete car — calls real API then removes from local state
  deleteCar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteCar(id);
      set((state) => ({
        allCars: state.allCars.filter((c) => c.id !== id),
        cars: state.cars.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  // ADMIN: approve listing
  approveListing: async (id: string) => {
    try {
      const car = await apiApproveCar(id);
      set((state) => ({
        allCars: state.allCars.map((c) => (c.id === id ? car : c)),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  // ADMIN: reject listing
  rejectListing: async (id: string, reason: string) => {
    try {
      const car = await apiRejectCar(id, reason);
      set((state) => ({
        allCars: state.allCars.map((c) => (c.id === id ? car : c)),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  setFilters: (filters) => { set({ filters }); get().fetchCars(filters); },
  clearSelectedCar: () => set({ selectedCar: null }),
  clearError: () => set({ error: null }),
}));

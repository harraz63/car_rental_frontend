import { createClient } from '@supabase/supabase-js';
import type { User, Car, Booking } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- PERSISTENCE HELPERS ----------
const CARS_KEY = 'car4u_cars';
const BOOKINGS_KEY = 'car4u_bookings';
const USERS_KEY = 'car4u_users';

function loadCars(): Car[] {
  try {
    const raw = localStorage.getItem(CARS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getInitialCars();
}

function saveCars(cars: Car[]) {
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
}

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ---------- INITIAL DATA ----------
function getInitialCars(): Car[] {
  return [
    {
      id: '1',
      brand: 'تويوتا',
      model: 'كامري',
      year: 2024,
      color: 'أبيض',
      daily_price: 250,
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800'],
      specifications: { seats: 5, transmission: 'أوتوماتيك', fuel_type: 'بنزين', engine: '2.5L', mileage: 'غير محدود' },
      is_available: true,
      listing_status: 'approved',
      description: 'سيارة عائلية فاخرة مع جميع وسائل الراحة الحديثة',
      location: 'القاهرة',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      brand: 'مرسيدس',
      model: 'E-Class',
      year: 2023,
      color: 'أسود',
      daily_price: 450,
      images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
      specifications: { seats: 5, transmission: 'أوتوماتيك', fuel_type: 'بنزين', engine: '3.0L', mileage: 'غير محدود' },
      is_available: true,
      listing_status: 'approved',
      description: 'سيارة فاخرة للأعمال والمناسبات الخاصة',
      location: 'الإسكندرية',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      brand: 'BMW',
      model: 'X5',
      year: 2024,
      color: 'رمادي',
      daily_price: 550,
      images: ['https://images.unsplash.com/photo-1555215695-3004980adade?w=800'],
      specifications: { seats: 7, transmission: 'أوتوماتيك', fuel_type: 'ديزل', engine: '3.0L', mileage: 'غير محدود' },
      is_available: true,
      listing_status: 'approved',
      description: 'دفع رباعي فاخر مع مساحة واسعة للعائلة',
      location: 'الجيزة',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      brand: 'هوندا',
      model: 'أكورد',
      year: 2023,
      color: 'أزرق',
      daily_price: 200,
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
      specifications: { seats: 5, transmission: 'أوتوماتيك', fuel_type: 'بنزين', engine: '1.5L', mileage: 'غير محدود' },
      is_available: true,
      listing_status: 'approved',
      description: 'سيارة اقتصادية موثوقة للاستخدام اليومي',
      location: 'القاهرة',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      brand: 'نيسان',
      model: 'باترول',
      year: 2024,
      color: 'أبيض',
      daily_price: 600,
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
      specifications: { seats: 8, transmission: 'أوتوماتيك', fuel_type: 'بنزين', engine: '5.6L', mileage: 'غير محدود' },
      is_available: true,
      listing_status: 'approved',
      description: 'دفع رباعي قوي للرحلات البرية والمغامرات',
      location: 'شرم الشيخ',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

// ---------- MOCK SERVICE ----------
export const mockSupabaseService = {
  // AUTH
  signUp: async (email: string, _password: string, fullName: string, phone: string, role: User['role'] = 'user') => {
    const users = loadUsers();
    if (users.find(u => u.email === email)) {
      return { data: { user: null }, error: { message: 'البريد الإلكتروني مسجل مسبقاً' } };
    }
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      full_name: fullName,
      phone,
      role,
      created_at: new Date().toISOString(),
    };
    users.push(mockUser);
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return { data: { user: mockUser }, error: null };
  },

  signIn: async (email: string, _password: string) => {
    const users = loadUsers();
    let user = users.find(u => u.email === email);
    if (!user) {
      // auto-create for demo
      user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        full_name: email.includes('admin') ? 'المدير' : 'مستخدم تجريبي',
        phone: '01000000000',
        role: email.includes('admin') ? 'admin' : 'user',
        created_at: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { data: { user }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem('currentUser');
    return { error: null };
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  },

  getAllUsers: (): User[] => loadUsers(),

  // CARS
  getCars: async (filters?: any): Promise<Car[]> => {
    let cars = loadCars().filter(c => c.listing_status === 'approved');
    if (filters) {
      if (filters.brand) cars = cars.filter(c => c.brand.includes(filters.brand));
      if (filters.minPrice) cars = cars.filter(c => c.daily_price >= filters.minPrice);
      if (filters.maxPrice) cars = cars.filter(c => c.daily_price <= filters.maxPrice);
      if (filters.availableOnly) cars = cars.filter(c => c.is_available);
      if (filters.location) cars = cars.filter(c => c.location?.includes(filters.location));
      if (filters.transmission) cars = cars.filter(c => c.specifications.transmission === filters.transmission);
    }
    return cars;
  },

  getAllCarsAdmin: async (): Promise<Car[]> => loadCars(),

  getPendingListings: async (): Promise<Car[]> => loadCars().filter(c => c.listing_status === 'pending'),

  getOwnerCars: async (ownerId: string): Promise<Car[]> => loadCars().filter(c => c.owner_id === ownerId),

  getCarById: async (id: string): Promise<Car | null> => loadCars().find(c => c.id === id) || null,

  createCar: async (car: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car> => {
    const cars = loadCars();
    const newCar: Car = {
      ...car,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    cars.push(newCar);
    saveCars(cars);
    return newCar;
  },

  updateCar: async (id: string, updates: Partial<Car>): Promise<Car | null> => {
    const cars = loadCars();
    const index = cars.findIndex(c => c.id === id);
    if (index === -1) return null;
    cars[index] = { ...cars[index], ...updates, updated_at: new Date().toISOString() };
    saveCars(cars);
    return cars[index];
  },

  deleteCar: async (id: string): Promise<boolean> => {
    const cars = loadCars();
    const index = cars.findIndex(c => c.id === id);
    if (index === -1) return false;
    cars.splice(index, 1);
    saveCars(cars);
    return true;
  },

  approveListing: async (id: string): Promise<Car | null> => {
    const cars = loadCars();
    const index = cars.findIndex(c => c.id === id);
    if (index === -1) return null;
    cars[index].listing_status = 'approved';
    cars[index].updated_at = new Date().toISOString();
    saveCars(cars);
    return cars[index];
  },

  rejectListing: async (id: string, reason: string): Promise<Car | null> => {
    const cars = loadCars();
    const index = cars.findIndex(c => c.id === id);
    if (index === -1) return null;
    cars[index].listing_status = 'rejected';
    cars[index].rejection_reason = reason;
    cars[index].updated_at = new Date().toISOString();
    saveCars(cars);
    return cars[index];
  },

  // BOOKINGS
  getBookings: async (userId?: string): Promise<Booking[]> => {
    const cars = loadCars();
    const users = loadUsers();
    let bookings = loadBookings();
    if (userId) bookings = bookings.filter(b => b.user_id === userId);
    return bookings.map(b => ({
      ...b,
      car: cars.find(c => c.id === b.car_id),
      user: users.find(u => u.id === b.user_id),
    }));
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const bookings = loadBookings();
    const cars = loadCars();
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    bookings.push(newBooking);
    saveBookings(bookings);
    return { ...newBooking, car: cars.find(c => c.id === booking.car_id) };
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking | null> => {
    const bookings = loadBookings();
    const cars = loadCars();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    bookings[index].status = status;
    saveBookings(bookings);
    return { ...bookings[index], car: cars.find(c => c.id === bookings[index].car_id) };
  },
};

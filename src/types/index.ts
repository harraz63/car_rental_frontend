export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'user' | 'owner';
  created_at: string;
}

export interface Car {
  id: string;
  owner_id?: string;
  owner_name?: string;
  owner_phone?: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  daily_price: number;
  images: string[];
  specifications: {
    seats?: number;
    transmission?: string;
    fuel_type?: string;
    engine?: string;
    mileage?: string;
    [key: string]: any;
  };
  is_available: boolean;
  listing_status: 'pending' | 'approved' | 'rejected';
  description?: string;
  location?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  car_id: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  payment_method: 'online' | 'cash';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  car?: Car;
  user?: User;
}

export interface CarFilter {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  transmission?: string;
  fuelType?: string;
  availableOnly?: boolean;
  location?: string;
}

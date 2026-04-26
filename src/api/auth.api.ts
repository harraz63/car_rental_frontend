import axiosInstance from './axios';
import type { User } from '@/types';

// ── Shape adapters ────────────────────────────────────────────────────────────
export function adaptUser(raw: any): User {
  return {
    id: raw._id ?? raw.id,
    email: raw.email,
    full_name: raw.name ?? raw.full_name,
    phone: raw.phone,
    role: raw.role,
    created_at: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
  };
}

function saveToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function clearToken() {
  localStorage.removeItem('auth_token');
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

/** POST /auth/signup-user */
export async function signUpUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  const { data } = await axiosInstance.post('/auth/signup-user', payload);
  const { user, token } = data.data;
  saveToken(token);
  return { user: adaptUser(user), token };
}

/**
 * POST /auth/signup-owner
 * Backend requires car object at signup time.
 * We pass a minimal placeholder car so the account is created;
 * the owner can update the car via /list-car right after.
 */
export async function signUpOwner(payload: {
  name: string;
  email: string;
  password: string;
  car: {
    brand: string;
    model: string;
    year: number;
    color?: string;
    dailyPrice: number;
    location?: string;
    description?: string;
    numberOfSeats?: number;
    engine?: string;
    transmission: 'automatic' | 'manual';
    fuelType: 'petrol' | 'diesel' | 'hybrid';
    images: string[];
  };
}): Promise<{ user: User; token: string }> {
  const { data } = await axiosInstance.post('/auth/signup-owner', payload);
  const { user, token } = data.data;
  saveToken(token);
  return { user: adaptUser(user), token };
}

/** POST /auth/login */
export async function signIn(payload: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  const { data } = await axiosInstance.post('/auth/login', payload);
  const { user, token } = data.data;
  saveToken(token);
  return { user: adaptUser(user), token };
}

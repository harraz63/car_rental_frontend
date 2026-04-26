import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { signUpUser, signUpOwner, signIn as apiSignIn, clearToken } from '@/api/auth.api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, fullName: string, phone: string, role?: User['role'], carPayload?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

function getPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    return JSON.parse(raw)?.state?.user ?? null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: getPersistedUser(),
      isLoading: false,
      error: null,

      signUp: async (email, password, fullName, _phone, role = 'user', carPayload?: any) => {
        set({ isLoading: true, error: null });
        try {
          let user: User;
          if (role === 'owner') {
            const result = await signUpOwner({ name: fullName, email, password, car: carPayload });
            user = result.user;
          } else {
            const result = await signUpUser({ name: fullName, email, password });
            user = result.user;
          }
          set({ user, isLoading: false });
        } catch (err: any) {
          const message = err.response?.data?.message || err.message || 'حدث خطأ أثناء التسجيل';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await apiSignIn({ email, password });
          set({ user, isLoading: false });
        } catch (err: any) {
          const message = err.response?.data?.message || err.message || 'حدث خطأ أثناء تسجيل الدخول';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        clearToken();
        set({ user: null, isLoading: false });
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user }) }
  )
);

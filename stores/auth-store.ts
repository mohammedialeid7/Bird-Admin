import { create } from 'zustand';
import type { User } from '@/lib/types';
import { mockAdminUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockAdminUser,
  isAuthenticated: true,
  login: () => {
    set({ user: mockAdminUser, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

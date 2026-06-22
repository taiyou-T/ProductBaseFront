"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { api } from "@/lib/api";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-session";

const TOKEN_KEY = "productbase_token";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHydrated: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setAuth: (token, user) => {
        setAuthCookie();
        set({ token, user });
      },
      clearAuth: () => {
        clearAuthCookie();
        set({ token: null, user: null });
      },
      setHydrated: () => set({ hydrated: true }),
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const data = await api<{ data: User }>("/auth/me", {}, token);
          set({ user: data.data });
        } catch {
          get().clearAuth();
        }
      },
    }),
    {
      name: TOKEN_KEY,
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthCookie();
        } else {
          clearAuthCookie();
        }
        state?.setHydrated();
      },
    },
  ),
);

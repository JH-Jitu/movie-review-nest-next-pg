import { User, UserObj } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { User } from '@/types';

interface AuthState {
  user: UserObj | null;
  fullUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: UserObj | null) => void;
  setFullUser: (fullUser: User | null) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      fullUser: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setFullUser: (fullUser) => set({ fullUser }),
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          fullUser: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

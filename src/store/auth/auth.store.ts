import { LoginUser } from "@/features/login/types/login.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: LoginUser | null;
  expiredAt: string | null;
  refreshExpiresAt: string | null;

  setSession: (
    user: LoginUser,
    expiredAt: string,
    refreshExpiresAt: string
  ) => void;

  updateSessionExpiration: (
    expiredAt: string,
    refreshExpiresAt: string
  ) => void;

  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      expiredAt: null,
      refreshExpiresAt: null,

      setSession: (user, expiredAt, refreshExpiresAt) => {
        set({
          user,
          expiredAt,
          refreshExpiresAt,
        });
      },

      updateSessionExpiration: (expiredAt, refreshExpiresAt) => {
        set({
          expiredAt,
          refreshExpiresAt,
        });
      },

      clearUser: () => {
        set({
          user: null,
          expiredAt: null,
          refreshExpiresAt: null,
        });
      },
    }),
    {
      name: "vorea-auth",
      partialize: (state) => ({
        user: state.user,
        expiredAt: state.expiredAt,
        refreshExpiresAt: state.refreshExpiresAt,
      }),
    }
  )
);
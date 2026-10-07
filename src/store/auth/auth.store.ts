import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthState } from "@/interfaces";
import { NO_SESSION_DATA, SESSION_STORAGE_KEY } from "@/utils";


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...NO_SESSION_DATA,

      startSession: ({ user, accessExpiresAt, refreshExpiresAt }) => {
        set({ user, accessExpiresAt, refreshExpiresAt });
      },

      updateSession: ({ accessExpiresAt, refreshExpiresAt }) => {
        set({ accessExpiresAt, refreshExpiresAt });
      },

      clearSession: () => {
        set(NO_SESSION_DATA);
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: ({ user, accessExpiresAt, refreshExpiresAt }) => ({
        user,
        accessExpiresAt,
        refreshExpiresAt,
      }),
    }
  )
);
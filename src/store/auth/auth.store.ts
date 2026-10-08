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

      // Sin nada guardado, zustand conserva por defecto lo que hay en memoria.
      // Aquí eso resucita la sesión: si alguien vacía el almacenamiento, las
      // otras pestañas seguirían con el usuario y la siguiente renovación lo
      // volvería a escribir. Que no haya nada guardado significa que no hay
      // sesión.
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState ?? NO_SESSION_DATA),
      }),
    }
  )
);
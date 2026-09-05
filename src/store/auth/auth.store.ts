import { LoginUser } from "@/features/login/types/login.types";
import { create } from "zustand";


interface AuthState {
  user: LoginUser | null;
  setUser: (user: LoginUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },
}));
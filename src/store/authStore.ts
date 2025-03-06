import { create } from "zustand";

interface AuthState {
  user: any; // Change `any` to a specific type if you know the user structure
  setUser: (userData: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
}));

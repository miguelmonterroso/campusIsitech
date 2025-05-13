import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getValidToken: () => Promise<string | null>;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Credenciales incorrectas");
          }

          const data = await response.json();
          const { token, user } = data;

          set({
            user: { ...user, token },
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Error durante el inicio de sesión:", error);
          throw new Error("Inicio de sesión fallido. Verifica tus credenciales.");
        }
      },

      logout: () => {
        fetch("/api/users/logout", { method: "POST" });
        set({ user: null, isAuthenticated: false });
      },

      getValidToken: async () => {
        const state = get();
        const token = state.user?.token;

        if (!token) return null;

        const res = await fetch("/api/users/refresh", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const newToken = data.accessToken;

          if (state.user) {
            set({
              user: { ...state.user, token: newToken },
            });
          }

          return newToken;
        }

        set({ user: null, isAuthenticated: false });
        return null;
      },
    }),
    {
      name: "auth-storage", 
    }
  )
);

export default useAuthStore;

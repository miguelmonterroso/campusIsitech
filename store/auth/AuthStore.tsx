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
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;

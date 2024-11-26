import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  loginWithTestUser: (email: string, password: string) => void;
  logout: () => void;
};

const TEST_USER: User = {
  id: 'test_user_123',
  name: 'Usuario de Prueba',
  email: 'test@example.com',
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: User) => set({ user: userData, isAuthenticated: true }),
      loginWithTestUser: (email: string, password: string) => {
        // Datos de prueba
        if (email === 'test@example.com' && password === 'password') {
          set({ user: TEST_USER, isAuthenticated: true });
        } else {
          alert('Credenciales incorrectas. Usa email: test@example.com y contraseña: password');
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

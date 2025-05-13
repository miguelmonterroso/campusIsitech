// fetchWithAuth.ts
import useAuthStore from "@/store/auth/AuthStore";

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const { getValidToken } = useAuthStore.getState();
  const token = await getValidToken();

  if (!token) {
    throw new Error("Sesión expirada. Inicia sesión nuevamente.");
  }

  const headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  return response;
}

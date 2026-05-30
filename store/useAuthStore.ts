import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id?: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem(name, value);

    try {
      const parsedValue = JSON.parse(value);
      const token = parsedValue.state?.token;

      if (token) {
        // تحديث الكوكي بالتوكن الجديد
        document.cookie = `auth-token=${token}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        // لو مفيش توكن (زي حالة الـ Logout) نمسح الكوكي
        document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    } catch (error) {
      console.error("Error parsing auth storage", error);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    // التأكد من مسح الكوكي عند الحذف
    document.cookie = `auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);

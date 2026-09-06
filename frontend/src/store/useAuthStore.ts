import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decodeToken, type UserRole } from "../services/auth.service";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  address?: string;
  departmentCode?: string;
  position?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;

  setAuth: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken }) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const decoded = decodeToken(accessToken);
        const user: UserProfile = {
          id: decoded?.sub || "",
          email: decoded?.email || "",
          role: decoded?.roleId || "customer",
          departmentCode: (decoded as any)?.departmentCode,
          position: (decoded as any)?.position,
        };

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        });
      },

      setUserProfile: (profile) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: { ...currentUser, ...profile },
        });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      initAuth: () => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (accessToken) {
          const decoded = decodeToken(accessToken);
          if (decoded) {
            const currentUser = get().user;
            set({
              accessToken,
              refreshToken,
              isAuthenticated: true,
              user: {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.roleId,
                departmentCode: (decoded as any)?.departmentCode,
                position: (decoded as any)?.position,
                ...currentUser, // Preserve profile details if previously set
              },
            });
            return;
          }
        }
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "cosmetics_auth_store",
    },
  ),
);

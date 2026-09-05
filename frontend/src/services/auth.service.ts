import api from "../config/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export type RegisterGender = "male" | "female" | "other";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  gender: RegisterGender;
  email: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export type UserRole = "admin" | "employee" | "customer" | string;

export interface TokenPayload {
  sub: string;
  email: string;
  roleId: UserRole;
  iat?: number;
  exp?: number;
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      "/auth-users/login",
      payload,
    );
    return data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      "/auth-users/register",
      payload,
    );
    return data;
  },

  getRole(): UserRole | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = decodeToken(token);
    return payload?.roleId ?? null;
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },
};

export { decodeToken };

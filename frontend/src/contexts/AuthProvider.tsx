import React, { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { LoginPayload, RegisterPayload, UserRole } from '../services/auth.service';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeUser = useAuthStore((s) => s.user);
  const storeIsAuth = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const storeLogout = useAuthStore((s) => s.logout);
  const initAuth = useAuthStore((s) => s.initAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      setAuth(response);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      setAuth(response);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const clearError = useCallback(() => setError(null), []);

  const role: UserRole | null = storeUser?.role || null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: storeIsAuth, role, isLoading, login, register, logout, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import type { LoginPayload, RegisterPayload, UserRole } from '../services/auth.service';
import { authService } from '../services/auth.service';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [role, setRole] = useState<UserRole | null>(authService.getRole());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setRole(authService.getRole());
      setIsAuthenticated(true);
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
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setRole(authService.getRole());
      setIsAuthenticated(true);
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
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, isLoading, login, register, logout, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

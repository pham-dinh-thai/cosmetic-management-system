import { createContext } from 'react';
import type { LoginPayload, RegisterPayload, UserRole } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export type { AuthContextType };

import { createContext } from 'react';
import type { User } from '../types';

/**
 * Authentication context data interface
 * Provides user state, loading status, and authentication methods
 */
export interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null, rememberMe?: boolean) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);


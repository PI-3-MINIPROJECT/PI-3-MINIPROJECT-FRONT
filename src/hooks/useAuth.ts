import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextValue';

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider component
 * @returns {import('../contexts/AuthContextValue').AuthContextData} Authentication context data (user, isLoading, isAuthenticated, setUser, logout, refreshUser)
 * @throws {Error} Throws error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


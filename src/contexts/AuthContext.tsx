import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser } from '../utils/api';
import { handleAuthError } from '../utils/auth';
import { getUserData, setUserData, clearSessionCookies } from '../utils/cookies';
import type { User } from '../types';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null, rememberMe?: boolean) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Wrapper para setUser que también actualiza cookies
  const setUser = useCallback((newUser: User | null, rememberMe: boolean = true) => {
    setUserState(newUser);
    if (newUser) {
      setUserData(newUser, rememberMe);
    } else {
      clearSessionCookies();
    }
  }, []);

  const logout = () => {
    setUser(null); // setUser ya limpia las cookies cuando se pasa null
  };

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData, true); // setUser ya guarda en cookies
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      // Si hay error 401, significa que no está autenticado
      const errorMessage = handleAuthError(error);
      if (errorMessage.includes('401') || errorMessage.includes('No autenticado')) {
        setUser(null);
      }
    }
  }, [setUser]);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Primero intentar restaurar desde cookies
      const userFromCookie = getUserData();
      if (userFromCookie) {
        setUserState(userFromCookie); // Solo actualizar estado, no cookies (ya están guardadas)
        setIsLoading(false);
        // Verificar en segundo plano si la sesión sigue válida
        try {
          await refreshUser();
        } catch {
          // Si falla, limpiar cookies y estado
          setUser(null);
        }
        return;
      }

      // Si no hay cookie, verificar con el servidor
      try {
        await refreshUser();
      } catch {
        // Error silencioso, el usuario simplemente no está autenticado
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [refreshUser, setUser]);

  const value: AuthContextData = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
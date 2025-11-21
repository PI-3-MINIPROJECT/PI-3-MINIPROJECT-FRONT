import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser } from '../utils/api';
import { getUserData, setUserData, clearSessionCookies, setSessionToken, getSessionToken } from '../utils/cookies';
import type { User } from '../types';
import { AuthContext } from './AuthContextValue';
import type { AuthContextData } from './AuthContextValue';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((newUser: User | null, rememberMe: boolean = true) => {
    if (newUser) {
      const { token: authToken, accessToken, ...userWithoutToken } = newUser;
      const sessionToken = authToken ?? accessToken;
      if (sessionToken) {
        setSessionToken(sessionToken, rememberMe);
      }
      setUserState(userWithoutToken as User);
      setUserData(userWithoutToken as User, rememberMe);
    } else {
      clearSessionCookies();
      setUserState(null);
    }
  }, []);

  const logout = () => {
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData, true);
    } catch {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      setIsLoading(true);

      const userFromCookie = getUserData();
      if (userFromCookie) {
        setUserState(userFromCookie);
      }

      if (!getSessionToken()) {
        if (isMounted) {
          setUserState(userFromCookie ?? null);
          setIsLoading(false);
        }
        return;
      }

      try {
        await refreshUser();
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
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
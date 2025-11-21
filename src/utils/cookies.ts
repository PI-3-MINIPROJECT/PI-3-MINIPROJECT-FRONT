import Cookies from 'js-cookie';
import type { User } from '../types';

const SESSION_COOKIE_NAME = 'session_token';
const USER_COOKIE_NAME = 'user_data';
const COOKIE_EXPIRY_DAYS = 7;
export function setSessionToken(token: string, rememberMe: boolean = false): void {
  const options: Cookies.CookieAttributes = {
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/',
  };

  if (rememberMe) {
    options.expires = COOKIE_EXPIRY_DAYS;
  }

  Cookies.set(SESSION_COOKIE_NAME, token, options);
}

export function getSessionToken(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME);
}

export function removeSessionToken(): void {
  Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
}

export function setUserData(user: User, rememberMe: boolean = false): void {
  const options: Cookies.CookieAttributes = {
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/',
  };

  if (rememberMe) {
    options.expires = COOKIE_EXPIRY_DAYS;
  }

  Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), options);
}

export function getUserData(): User | null {
  const userData = Cookies.get(USER_COOKIE_NAME);
  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    void error;
    return null;
  }
}

export function removeUserData(): void {
  Cookies.remove(USER_COOKIE_NAME, { path: '/' });
}

export function clearSessionCookies(): void {
  removeSessionToken();
  removeUserData();
}


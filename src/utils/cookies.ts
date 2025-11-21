import Cookies from 'js-cookie';
import type { User } from '../types';

const SESSION_COOKIE_NAME = 'session_token';
const USER_COOKIE_NAME = 'user_data';
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Stores the session authentication token in a cookie
 * @param {string} token - Authentication token to store
 * @param {boolean} [rememberMe=false] - If true, cookie expires in 7 days; otherwise, session cookie
 * @returns {void}
 */
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

/**
 * Retrieves the session authentication token from cookies
 * @returns {string | undefined} Session token or undefined if not found
 */
export function getSessionToken(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME);
}

/**
 * Removes the session authentication token from cookies
 * @returns {void}
 */
export function removeSessionToken(): void {
  Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Stores user profile data in a cookie
 * @param {User} user - User object to store
 * @param {boolean} [rememberMe=false] - If true, cookie expires in 7 days; otherwise, session cookie
 * @returns {void}
 */
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

/**
 * Retrieves user profile data from cookies
 * @returns {User | null} User object or null if not found or invalid
 */
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

/**
 * Removes user profile data from cookies
 * @returns {void}
 */
export function removeUserData(): void {
  Cookies.remove(USER_COOKIE_NAME, { path: '/' });
}

/**
 * Clears all session-related cookies (token and user data)
 * @returns {void}
 */
export function clearSessionCookies(): void {
  removeSessionToken();
  removeUserData();
}


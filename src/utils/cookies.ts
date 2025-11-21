import Cookies from 'js-cookie';
import type { User } from '../types';

const SESSION_COOKIE_NAME = 'session_token';
const USER_COOKIE_NAME = 'user_data';
const COOKIE_EXPIRY_DAYS = 7; // 7 días para "Recuérdame", sesión para sin "Recuérdame"

/**
 * Guarda el token de sesión en una cookie
 */
export function setSessionToken(token: string, rememberMe: boolean = false): void {
  const options: Cookies.CookieAttributes = {
    secure: import.meta.env.PROD, // Solo HTTPS en producción
    sameSite: 'strict',
    path: '/',
  };

  if (rememberMe) {
    // Si "Recuérdame" está activado, la cookie expira en 7 días
    options.expires = COOKIE_EXPIRY_DAYS;
  }
  // Si no está activado, la cookie es de sesión (se elimina al cerrar el navegador)

  Cookies.set(SESSION_COOKIE_NAME, token, options);
}

/**
 * Obtiene el token de sesión de la cookie
 */
export function getSessionToken(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME);
}

/**
 * Elimina el token de sesión de la cookie
 */
export function removeSessionToken(): void {
  Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
}

/**
 * Guarda los datos del usuario en una cookie
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
 * Obtiene los datos del usuario de la cookie
 */
export function getUserData(): User | null {
  const userData = Cookies.get(USER_COOKIE_NAME);
  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error al parsear datos de usuario de la cookie:', error);
    return null;
  }
}

/**
 * Elimina los datos del usuario de la cookie
 */
export function removeUserData(): void {
  Cookies.remove(USER_COOKIE_NAME, { path: '/' });
}

/**
 * Limpia todas las cookies de sesión
 */
export function clearSessionCookies(): void {
  removeSessionToken();
  removeUserData();
}


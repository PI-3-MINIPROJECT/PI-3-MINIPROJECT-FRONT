import { get, put, del } from './api';
import type { User } from '../types';

type ErrorWithStatus = Error & { status?: number };

/**
 * Extracts HTTP status code from an error object if present
 * @param {unknown} error - Error object to inspect
 * @returns {number | undefined} HTTP status code or undefined if not found
 */
function getStatusCode(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as ErrorWithStatus).status;
  }
  return undefined;
}

/**
 * Redirects the user to Google OAuth authentication endpoint
 * @returns {void}
 */
export function redirectToGoogleOAuth(): void {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  window.location.href = `${baseUrl}/api/auth/oauth/google`;
}

export function redirectToGitHubOAuth(): void {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  window.location.href = `${baseUrl}/api/auth/oauth/github`;
}

/**
 * Retrieves the current authenticated user's profile
 * @returns {Promise<import('./api').ApiResponse<User>>} Promise resolving to user profile response
 */
export async function getCurrentUser() {
  return get<User>('/api/users/profile');
}

/**
 * Updates the current user's profile information
 * @param {Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>} updates - Partial user data to update
 * @returns {Promise<import('./api').ApiResponse<User>>} Promise resolving to updated user profile response
 */
export async function updateProfile(updates: Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>) {
  return put<User>('/api/users/profile', updates);
}

/**
 * Deletes the current user's account
 * @returns {Promise<import('./api').ApiResponse<void>>} Promise resolving to deletion response
 */
export async function deleteAccount() {
  return del<void>('/api/users/profile');
}

/**
 * Converts authentication errors to user-friendly messages in Spanish
 * @param {unknown} error - Error object to handle
 * @returns {string} User-friendly error message in Spanish
 */
export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    const status = getStatusCode(error);
    const message = error.message.toLowerCase();
    
    if (
      message.includes('github') ||
      message.includes('oauth') ||
      message.includes('social') ||
      message.includes('provider') ||
      message.includes('creada con') ||
      message.includes('registered with')
    ) {
      return 'OAUTH_ERROR';
    }
    
    if (
      status === 401 ||
      error.message.includes('401') ||
      error.message.includes('No autenticado')
    ) {
      return 'Sesión expirada. Por favor, inicia sesión de nuevo.';
    }
    
    if (error.message.includes('403') || error.message.includes('No autorizado')) {
      return 'No tienes permisos para realizar esta acción.';
    }
    
    if (error.message.includes('409') || error.message.includes('ya registrado') || error.message.includes('already')) {
      return 'Este correo electrónico ya está registrado.';
    }
    
    if (error.message.includes('400') || error.message.includes('inválid')) {
      return 'Los datos proporcionados no son válidos.';
    }
    
    if (error.message.includes('500') || error.message.includes('servidor')) {
      return 'Error interno del servidor. Intenta de nuevo más tarde.';
    }
    
    return error.message;
  }
  
  return 'Error de conexión. Verifica tu conexión a internet.';
}

/**
 * Checks if the current user is authenticated by attempting to fetch their profile
 * @returns {Promise<boolean>} Promise resolving to true if user is authenticated, false otherwise
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await getCurrentUser();
    return response.success && !!response.data;
  } catch {
    return false;
  }
}
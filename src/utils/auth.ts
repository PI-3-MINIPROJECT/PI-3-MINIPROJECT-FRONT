import { get, put, del } from './api';
import type { User } from '../types';
import { getErrorMessage } from './errorMessages';

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
  const status = getStatusCode(error);
  const errorDetails = getErrorMessage(error, status);
  
  if (errorDetails.message === 'OAUTH_ERROR' || errorDetails.message === 'OAUTH_PROVIDER_CONFLICT') {
    return 'OAUTH_ERROR';
  }
  
  return errorDetails.message;
}

/**
 * Gets error details including field and action
 * @param {unknown} error - Error object to handle
 * @returns {{ message: string; field?: string; action?: string }} Error details
 */
export function getAuthErrorDetails(error: unknown): { message: string; field?: string; action?: string } {
  const status = getStatusCode(error);
  return getErrorMessage(error, status);
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
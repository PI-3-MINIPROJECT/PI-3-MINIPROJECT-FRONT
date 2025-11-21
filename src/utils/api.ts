import type { ApiResponse } from '../types';
import { getSessionToken } from './cookies';

type ApiErrorWithStatus = Error & {
  status?: number;
  isUnauthorized?: boolean;
};

/**
 * Converts a standard Error to an ApiErrorWithStatus with optional status code
 * @param {Error} error - The error to convert
 * @param {number} [status] - Optional HTTP status code
 * @param {Partial<ApiErrorWithStatus>} [extra] - Optional additional properties
 * @returns {ApiErrorWithStatus} Error with status information
 */
function toApiError(error: Error, status?: number, extra?: Partial<ApiErrorWithStatus>): ApiErrorWithStatus {
  const enriched = error as ApiErrorWithStatus;
  enriched.status = status;
  if (extra?.isUnauthorized !== undefined) {
    enriched.isUnauthorized = extra.isUnauthorized;
  }
  return enriched;
}

/**
 * Type guard to check if a value is a JSON record object
 * @param {unknown} value - Value to check
 * @returns {boolean} True if value is a record object
 */
function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Makes an HTTP request to the API endpoint with authentication headers
 * @template T - Type of the expected response data
 * @param {string} endpoint - API endpoint path (e.g., '/api/users/profile')
 * @param {RequestInit} [options={}] - Fetch API options (method, body, headers, etc.)
 * @returns {Promise<ApiResponse<T>>} Promise resolving to API response with success status and data
 * @throws {Error} Throws error if network request fails
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const fullUrl = `${API_URL}${endpoint}`;
  
  try {
    const token = getSessionToken();
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (options.headers) {
      new Headers(options.headers as HeadersInit).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include', // Importante para cookies de sesión
      headers,
    };

    const response = await fetch(fullUrl, fetchOptions);

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      let friendlyMessage: string | undefined;
      if (isJsonRecord(data)) {
        if (typeof data.message === 'string') {
          friendlyMessage = data.message;
        } else if (typeof data.error === 'string') {
          friendlyMessage = data.error;
        }
      }

      if (!friendlyMessage) {
        if (response.status === 404) {
          friendlyMessage = 'Recurso no encontrado';
        } else if (response.status === 401) {
          friendlyMessage = 'No autenticado';
        } else if (response.status === 409) {
          friendlyMessage = 'Conflicto en la solicitud';
        } else if (response.status === 400) {
          friendlyMessage = 'Solicitud inválida';
        } else if (response.status >= 500) {
          friendlyMessage = 'Error del servidor. Inténtalo más tarde';
        }
      }
      
      return {
        success: false,
        error: friendlyMessage || 'Ha ocurrido un error',
        message: friendlyMessage,
        status: response.status,
        raw: data,
      };
    }

    const payload =
      isJsonRecord(data) && 'data' in data ? (data as Record<string, unknown>).data : data;

    const message =
      isJsonRecord(data) && typeof data.message === 'string' ? data.message : undefined;

    return {
      success: true,
      data: payload as T,
      message,
      status: response.status,
      raw: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Performs a GET request to the API endpoint
 * @template T - Type of the expected response data
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<ApiResponse<T>>} Promise resolving to API response
 */
export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * Performs a POST request to the API endpoint
 * @template T - Type of the expected response data
 * @param {string} endpoint - API endpoint path
 * @param {unknown} body - Request body to send (will be JSON stringified)
 * @returns {Promise<ApiResponse<T>>} Promise resolving to API response
 */
export async function post<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Performs a PUT request to the API endpoint
 * @template T - Type of the expected response data
 * @param {string} endpoint - API endpoint path
 * @param {unknown} body - Request body to send (will be JSON stringified)
 * @returns {Promise<ApiResponse<T>>} Promise resolving to API response
 */
export async function put<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Performs a DELETE request to the API endpoint
 * @template T - Type of the expected response data
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<ApiResponse<T>>} Promise resolving to API response
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

/**
 * Registers a new user in the system
 * @param {import('../types').RegisterRequest} userData - User registration data (firstName, lastName, age, email, password)
 * @returns {Promise<import('../types').AuthResponse>} Promise resolving to authentication response with user data
 * @throws {Error} Throws error if registration fails (e.g., email already exists, validation errors)
 */
export async function register(userData: import('../types').RegisterRequest): Promise<import('../types').AuthResponse> {
  const response = await post<import('../types').User>('/api/auth/register', userData);
  
  if (response.success && response.data) {
    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      data: response.data
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error en el registro'),
    response.status
  );
}

/**
 * Authenticates a user with email and password
 * @param {import('../types').LoginRequest} credentials - Login credentials (email, password, rememberMe)
 * @returns {Promise<import('../types').AuthResponse>} Promise resolving to authentication response with user data and token
 * @throws {Error} Throws error if authentication fails (e.g., invalid credentials, user not found)
 */
export async function login(credentials: import('../types').LoginRequest): Promise<import('../types').AuthResponse> {
  const response = await post<import('../types').User>('/api/auth/login', credentials);
  
  if (response.success && response.data) {
    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: response.data
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error en el login'),
    response.status
  );
}

/**
 * Logs out the current user and invalidates the session
 * @returns {Promise<{success: boolean; message: string}>} Promise resolving to logout confirmation
 * @throws {Error} Throws error if logout fails
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await post<void>('/api/auth/logout', {});
  
  if (response.success) {
    return {
      success: true,
      message: 'Cierre de sesión exitoso'
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al cerrar sesión'),
    response.status
  );
}

/**
 * Requests a password reset link to be sent to the user's email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean; message: string; resetLink?: string}>} Promise resolving to reset link response
 * @throws {Error} Throws error if email not found or reset request fails
 */
export async function resetPassword(email: string): Promise<{ success: boolean; message: string; resetLink?: string }> {
  const response = await post<{ resetLink: string }>('/api/auth/reset-password', { email });
  
  if (response.success && response.data) {
    return {
      success: true,
      message: 'Enlace de recuperación generado',
      resetLink: response.data.resetLink
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al generar enlace de recuperación'),
    response.status
  );
}

/**
 * Confirms password reset with the verification code from email
 * @param {string} oobCode - Email verification code
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean; message: string; data?: unknown}>} Promise resolving to confirmation response
 * @throws {Error} Throws error if code is invalid or password reset fails
 */
export async function confirmPasswordReset(oobCode: string, newPassword: string): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await post<unknown>('/api/auth/confirm-password-reset', { oobCode, newPassword });
  
  if (response.success) {
    return {
      success: true,
      message: response.message || 'Contraseña restablecida exitosamente',
      data: response.data
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al restablecer contraseña'),
    response.status
  );
}

/**
 * Retrieves the current authenticated user's profile information
 * @returns {Promise<import('../types').User>} Promise resolving to user profile data
 * @throws {Error} Throws error if user is not authenticated or profile fetch fails
 */
export async function getCurrentUser(): Promise<import('../types').User> {
  const response = await get<import('../types').User>('/api/users/profile');
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al obtener perfil'),
    response.status
  );
}

/**
 * Updates the current user's profile information
 * @param {Partial<Omit<import('../types').User, 'uid' | 'createdAt' | 'updatedAt'>>} updates - Partial user data to update (name, last_name, age, email)
 * @returns {Promise<import('../types').User>} Promise resolving to updated user profile data
 * @throws {Error} Throws error if update fails (e.g., validation errors, unauthorized)
 */
export async function updateProfile(updates: Partial<Omit<import('../types').User, 'uid' | 'createdAt' | 'updatedAt'>>): Promise<import('../types').User> {
  const response = await put<import('../types').User>('/api/users/profile', updates);
  
  if (response.success && response.data) {
    return response.data;
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al actualizar perfil'),
    response.status
  );
}

/**
 * Updates the current user's password
 * @param {import('../types').UpdatePasswordRequest} passwordData - Password update data (currentPassword, newPassword, confirmPassword)
 * @returns {Promise<{success: boolean; message: string}>} Promise resolving to update confirmation
 * @throws {Error} Throws error if password update fails (e.g., current password incorrect, validation errors)
 */
export async function updatePassword(passwordData: import('../types').UpdatePasswordRequest): Promise<{ success: boolean; message: string }> {
  const response = await put<{ success: boolean; message: string }>('/api/auth/update-password', passwordData);
  
  if (response.success) {
    return {
      success: true,
      message: response.message || 'Contraseña actualizada exitosamente'
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al actualizar contraseña'),
    response.status
  );
}

/**
 * Permanently deletes the current user's account
 * @returns {Promise<{success: boolean; message: string}>} Promise resolving to deletion confirmation
 * @throws {Error} Throws error if account deletion fails
 */
export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const response = await del<void>('/api/users/profile');
  
  if (response.success) {
    return {
      success: true,
      message: 'Cuenta eliminada exitosamente'
    };
  }
  
  throw toApiError(
    new Error(response.error || response.message || 'Error al eliminar cuenta'),
    response.status
  );
}


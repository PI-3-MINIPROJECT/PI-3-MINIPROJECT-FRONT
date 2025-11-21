import type { ApiResponse } from '../types';
import { getSessionToken } from './cookies';

type ApiErrorWithStatus = Error & {
  status?: number;
  isUnauthorized?: boolean;
};

function toApiError(error: Error, status?: number, extra?: Partial<ApiErrorWithStatus>): ApiErrorWithStatus {
  const enriched = error as ApiErrorWithStatus;
  enriched.status = status;
  if (extra?.isUnauthorized !== undefined) {
    enriched.isUnauthorized = extra.isUnauthorized;
  }
  return enriched;
}

function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
      // Mensajes de error priorizando la respuesta del backend
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

export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function post<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function put<T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// Funciones de autenticación
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

// Funciones de gestión de usuarios
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


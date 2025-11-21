import type { ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const fullUrl = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(fullUrl, {
      credentials: 'include', // Importante para cookies de sesión
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
        message: data.message,
      };
    }

    return {
      success: true,
      data,
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
  
  throw new Error(response.error || response.message || 'Error en el registro');
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
  
  throw new Error(response.error || response.message || 'Error en el login');
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await post<void>('/api/auth/logout', {});
  
  if (response.success) {
    return {
      success: true,
      message: 'Cierre de sesión exitoso'
    };
  }
  
  throw new Error(response.error || response.message || 'Error al cerrar sesión');
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
  
  throw new Error(response.error || response.message || 'Error al generar enlace de recuperación');
}


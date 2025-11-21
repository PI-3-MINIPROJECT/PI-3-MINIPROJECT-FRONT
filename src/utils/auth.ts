import { get, put, del } from './api';
import type { User } from '../types';

type ErrorWithStatus = Error & { status?: number };

function getStatusCode(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as ErrorWithStatus).status;
  }
  return undefined;
}

export function redirectToGoogleOAuth(): void {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  window.location.href = `${baseUrl}/api/auth/oauth/google`;
}

export async function getCurrentUser() {
  return get<User>('/api/users/profile');
}

export async function updateProfile(updates: Partial<Omit<User, 'uid' | 'createdAt' | 'updatedAt'>>) {
  return put<User>('/api/users/profile', updates);
}

export async function deleteAccount() {
  return del<void>('/api/users/profile');
}

export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    const status = getStatusCode(error);
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

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await getCurrentUser();
    return response.success && !!response.data;
  } catch {
    return false;
  }
}
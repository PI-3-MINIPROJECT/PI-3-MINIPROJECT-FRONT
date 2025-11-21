// Utilidades adicionales para autenticación

/**
 * Redirige al usuario al endpoint de OAuth de Google
 */
export function redirectToGoogleOAuth(): void {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  window.location.href = `${baseUrl}/api/auth/oauth/google`;
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentUser() {
  const { get } = await import('./api');
  return get<import('../types').User>('/api/users/profile');
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateProfile(updates: Partial<Omit<import('../types').User, 'uid' | 'createdAt' | 'updatedAt'>>) {
  const { put } = await import('./api');
  return put<import('../types').User>('/api/users/profile', updates);
}

/**
 * Elimina la cuenta del usuario
 */
export async function deleteAccount() {
  const { del } = await import('./api');
  return del<void>('/api/users/profile');
}

/**
 * Maneja errores de autenticación de manera consistente
 */
export function handleAuthError(error: unknown): string {
  if (error instanceof Error) {
    // Errores específicos del backend
    if (error.message.includes('401') || error.message.includes('No autenticado')) {
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
 * Verifica si el usuario está autenticado consultando su perfil
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const response = await getCurrentUser();
    return response.success && !!response.data;
  } catch {
    return false;
  }
}
/**
 * Error message mapping from backend to user-friendly Spanish messages
 * Maps backend error messages to specific frontend error messages
 * 
 * This module provides centralized error handling for all API errors,
 * mapping backend error messages to user-friendly Spanish messages
 * with field-specific and action-specific information.
 */

interface ErrorMapping {
  pattern: RegExp | string;
  message: string;
  field?: string;
  action?: 'redirect' | 'clear' | 'retry';
}

/**
 * Error mappings organized by category
 */
const ERROR_MAPPINGS: ErrorMapping[] = [
  // 400 - Validation Errors - Registration
  {
    pattern: /la edad debe ser un número válido entre 1 y 120/i,
    message: 'La edad debe ser un número válido entre 1 y 120',
    field: 'age'
  },
  {
    pattern: /el correo electrónico no es válido/i,
    message: 'El correo electrónico no es válido',
    field: 'email'
  },
  {
    pattern: /la contraseña debe tener al menos 6 caracteres/i,
    message: 'La contraseña debe tener al menos 6 caracteres',
    field: 'password'
  },
  {
    pattern: /debe proporcionar un correo electrónico válido/i,
    message: 'Debe proporcionar un correo electrónico válido',
    field: 'email'
  },
  {
    pattern: /los nombres son obligatorios/i,
    message: 'Los nombres son obligatorios',
    field: 'firstName'
  },
  {
    pattern: /los nombres deben tener entre 2 y 50 caracteres/i,
    message: 'Los nombres deben tener entre 2 y 50 caracteres',
    field: 'firstName'
  },
  {
    pattern: /los nombres no pueden estar vacíos/i,
    message: 'Los nombres no pueden estar vacíos',
    field: 'firstName'
  },
  {
    pattern: /los apellidos son obligatorios/i,
    message: 'Los apellidos son obligatorios',
    field: 'lastName'
  },
  {
    pattern: /los apellidos deben tener entre 2 y 50 caracteres/i,
    message: 'Los apellidos deben tener entre 2 y 50 caracteres',
    field: 'lastName'
  },
  {
    pattern: /los apellidos no pueden estar vacíos/i,
    message: 'Los apellidos no pueden estar vacíos',
    field: 'lastName'
  },
  {
    pattern: /la edad debe ser un número entre 1 y 120/i,
    message: 'La edad debe ser un número entre 1 y 120',
    field: 'age'
  },
  {
    pattern: /email y contraseña son requeridos/i,
    message: 'Email y contraseña son requeridos'
  },
  {
    pattern: /la contraseña es requerida/i,
    message: 'La contraseña es requerida',
    field: 'password'
  },
  {
    pattern: /la contraseña actual es requerida/i,
    message: 'La contraseña actual es requerida',
    field: 'currentPassword'
  },
  {
    pattern: /la confirmación de contraseña es requerida/i,
    message: 'La confirmación de contraseña es requerida',
    field: 'confirmPassword'
  },
  {
    pattern: /las contraseñas no coinciden/i,
    message: 'Las contraseñas no coinciden',
    field: 'confirmPassword'
  },
  {
    pattern: /la nueva contraseña debe tener al menos 6 caracteres/i,
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
    field: 'newPassword'
  },
  {
    pattern: /el código de verificación es requerido/i,
    message: 'El código de verificación es requerido',
    field: 'code'
  },
  {
    pattern: /el código de recuperación es inválido/i,
    message: 'El código de recuperación es inválido',
    field: 'code'
  },
  {
    pattern: /el enlace de recuperación ha expirado/i,
    message: 'El enlace de recuperación ha expirado. Por favor, solicita un nuevo enlace.',
    action: 'retry'
  },
  {
    pattern: /el enlace de recuperación es inválido o ha expirado/i,
    message: 'El enlace de recuperación es inválido o ha expirado. Por favor, solicita un nuevo enlace.',
    action: 'retry'
  },
  {
    pattern: /no existe una cuenta con este correo electrónico/i,
    message: 'Si el correo existe, recibirás un enlace de recuperación. Verifica tu bandeja de entrada.'
  },
  {
    pattern: /error al enviar el email de recuperación/i,
    message: 'Error al enviar el email de recuperación. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /no hay sesión activa/i,
    message: 'No hay sesión activa',
    action: 'clear'
  },
  {
    pattern: /el correo ya está registrado/i,
    message: 'El correo ya está registrado. ¿Ya tienes cuenta? Inicia sesión o recupera tu contraseña.',
    field: 'email'
  },
  {
    pattern: /el correo ya está en uso/i,
    message: 'El correo ya está en uso. Por favor, usa otro correo electrónico.',
    field: 'email'
  },
  {
    pattern: /no email found in github account/i,
    message: 'No se encontró un correo electrónico en tu cuenta de GitHub. Por favor, verifica que tu cuenta de GitHub tenga un correo electrónico público configurado.'
  },
  {
    pattern: /la contraseña actual es incorrecta/i,
    message: 'La contraseña actual es incorrecta',
    field: 'currentPassword',
    action: 'retry'
  },
  
  // 401 - Authentication Errors
  {
    pattern: /usuario no encontrado/i,
    message: 'Credenciales incorrectas'
  },
  {
    pattern: /contraseña incorrecta/i,
    message: 'Credenciales incorrectas'
  },
  {
    pattern: /usuario deshabilitado/i,
    message: 'Tu cuenta ha sido deshabilitada. Por favor, contacta al soporte.',
    action: 'redirect'
  },
  {
    pattern: /credenciales de inicio de sesión inválidas/i,
    message: 'Credenciales incorrectas'
  },
  {
    pattern: /error de autenticación/i,
    message: 'Error de autenticación. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /user not authenticated/i,
    message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
    action: 'clear'
  },
  {
    pattern: /no hay sesión activa/i,
    message: 'No hay sesión activa. Por favor inicia sesión.',
    action: 'clear'
  },
  {
    pattern: /sesión expirada/i,
    message: 'Sesión expirada. Por favor inicia sesión nuevamente.',
    action: 'clear'
  },
  {
    pattern: /sesión revocada/i,
    message: 'Sesión revocada. Por favor inicia sesión nuevamente.',
    action: 'clear'
  },
  {
    pattern: /sesión inválida o expirada/i,
    message: 'Sesión inválida o expirada. Por favor inicia sesión nuevamente.',
    action: 'clear'
  },
  
  // 403 - Authorization Errors
  {
    pattern: /meeting is full/i,
    message: 'La reunión está llena (máximo 10 participantes)'
  },
  {
    pattern: /maximum 10 participants/i,
    message: 'La reunión está llena (máximo 10 participantes)'
  },
  {
    pattern: /only the host can delete the meeting/i,
    message: 'Solo el anfitrión puede eliminar la reunión'
  },
  
  // 404 - Not Found Errors
  {
    pattern: /user not found/i,
    message: 'Usuario no encontrado',
    action: 'redirect'
  },
  {
    pattern: /meeting not found/i,
    message: 'Reunión no encontrada',
    action: 'redirect'
  },
  {
    pattern: /route .* not found/i,
    message: 'Página no encontrada'
  },
  
  // 409 - Conflict Errors
  {
    pattern: /el correo ya está registrado/i,
    message: 'El correo ya está registrado. ¿Ya tienes cuenta? Inicia sesión o recupera tu contraseña.',
    field: 'email'
  },
  {
    pattern: /el correo ya está en uso/i,
    message: 'El correo ya está en uso. Por favor, usa otro correo electrónico.',
    field: 'email'
  },
  
  // 500 - Server Errors
  {
    pattern: /error al registrar usuario/i,
    message: 'Error al registrar usuario. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error durante el inicio de sesión/i,
    message: 'Error durante el inicio de sesión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error durante el cierre de sesión/i,
    message: 'Error durante el cierre de sesión',
    action: 'clear'
  },
  {
    pattern: /error al procesar la solicitud de recuperación/i,
    message: 'Error al procesar la solicitud. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error al restablecer la contraseña/i,
    message: 'Error al restablecer la contraseña. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /google oauth not configured/i,
    message: 'Google OAuth no está configurado en el servidor. Por favor, contacta al soporte.'
  },
  {
    pattern: /github oauth not configured/i,
    message: 'GitHub OAuth no está configurado en el servidor. Por favor, contacta al soporte.'
  },
  {
    pattern: /failed to obtain.*from google/i,
    message: 'Error al autenticar con Google. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /failed to obtain.*from github/i,
    message: 'Error al autenticar con GitHub. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /failed to verify.*token/i,
    message: 'Error al verificar la autenticación. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error creating or fetching firebase user/i,
    message: 'Error al crear o obtener el usuario. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching firebase user/i,
    message: 'Error al obtener el usuario. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /missing firebase_api_key/i,
    message: 'Error de configuración del servidor. Por favor, contacta al soporte.'
  },
  {
    pattern: /failed to sign in with custom token/i,
    message: 'Error al iniciar sesión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error during.*oauth/i,
    message: 'Error durante la autenticación. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /configuración del servidor incorrecta/i,
    message: 'Error de configuración del servidor. Por favor, contacta al soporte.'
  },
  {
    pattern: /error al actualizar la contraseña/i,
    message: 'Error al actualizar la contraseña. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching user profile/i,
    message: 'Error al obtener el perfil. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error al actualizar el perfil/i,
    message: 'Error al actualizar el perfil. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error deleting account/i,
    message: 'Error al eliminar la cuenta. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching user/i,
    message: 'Error al obtener el usuario. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error creating meeting/i,
    message: 'Error al crear la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching meetings/i,
    message: 'Error al obtener las reuniones. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching meeting/i,
    message: 'Error al obtener la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error joining meeting/i,
    message: 'Error al unirse a la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error leaving meeting/i,
    message: 'Error al salir de la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error deleting meeting/i,
    message: 'Error al eliminar la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error updating meeting/i,
    message: 'Error al actualizar la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error from chat backend/i,
    message: 'Error del servidor de chat. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /internal server error/i,
    message: 'Error interno del servidor. Por favor, intenta nuevamente más tarde.',
    action: 'retry'
  },
  
  // Chat Backend - 400 Bad Request
  {
    pattern: /user id is required/i,
    message: 'Debes estar autenticado para realizar esta acción',
    action: 'redirect'
  },
  {
    pattern: /title, date, and time are required/i,
    message: 'Por favor completa todos los campos obligatorios',
    field: 'title'
  },
  {
    pattern: /date must be in yyyy-mm-dd format/i,
    message: 'La fecha debe estar en formato YYYY-MM-DD (ej: 2024-12-25)',
    field: 'date'
  },
  {
    pattern: /time must be in hh:mm format/i,
    message: 'La hora debe estar en formato HH:mm (ej: 14:30)',
    field: 'time'
  },
  {
    pattern: /meeting id is required/i,
    message: 'ID de reunión inválido',
    action: 'redirect'
  },
  {
    pattern: /meeting id and user id are required/i,
    message: 'Error al procesar la solicitud. Por favor intenta de nuevo.',
    action: 'retry'
  },
  
  // Chat Backend - 403 Forbidden
  {
    pattern: /only the host can update the meeting/i,
    message: 'Solo el anfitrión puede editar esta reunión',
    action: 'clear'
  },
  {
    pattern: /only the host can delete the meeting/i,
    message: 'Solo el anfitrión puede eliminar esta reunión',
    action: 'clear'
  },
  
  // Chat Backend - 404 Not Found
  {
    pattern: /meeting not found/i,
    message: 'Esta reunión no existe o ha sido eliminada',
    action: 'redirect'
  },
  {
    pattern: /route .* not found/i,
    message: 'Ruta no encontrada',
    action: 'redirect'
  },
  
  // Chat Backend - 500 Internal Server Error
  {
    pattern: /error creating meeting/i,
    message: 'Error al crear la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching meetings/i,
    message: 'Error al obtener las reuniones. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching meeting/i,
    message: 'Error al obtener la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error joining meeting/i,
    message: 'Error al unirse a la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error leaving meeting/i,
    message: 'Error al salir de la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error deleting meeting/i,
    message: 'Error al eliminar la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error updating meeting/i,
    message: 'Error al actualizar la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching meeting information/i,
    message: 'Error al obtener información de la reunión. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching server statistics/i,
    message: 'Error al obtener estadísticas del servidor. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  {
    pattern: /error fetching today meetings/i,
    message: 'Error al obtener las reuniones de hoy. Por favor, intenta nuevamente.',
    action: 'retry'
  },
  
  // Socket.io Errors
  {
    pattern: /meeting id and user id are required/i,
    message: 'Error al conectarse. Por favor recarga la página.',
    action: 'retry'
  },
  {
    pattern: /meeting is full/i,
    message: 'Esta reunión está llena (máximo 10 participantes)',
    action: 'clear'
  },
  {
    pattern: /maximum \d+ participants/i,
    message: 'Esta reunión está llena (máximo 10 participantes)',
    action: 'clear'
  },
  {
    pattern: /failed to join meeting/i,
    message: 'No se pudo conectar a la reunión. Por favor intenta de nuevo.',
    action: 'retry'
  },
  {
    pattern: /meeting id, user id, and message are required/i,
    message: 'Por favor completa todos los campos para enviar el mensaje',
    field: 'message'
  },
  {
    pattern: /failed to send message/i,
    message: 'No se pudo enviar el mensaje. Se reintentará automáticamente.',
    action: 'retry'
  }
];

/**
 * Finds a matching error message from the error mappings
 * @param {string} errorMessage - Error message from backend
 * @returns {ErrorMapping | null} Matching error mapping or null
 */
function findErrorMapping(errorMessage: string): ErrorMapping | null {
  const lowerMessage = errorMessage.toLowerCase();
  
  for (const mapping of ERROR_MAPPINGS) {
    if (typeof mapping.pattern === 'string') {
      if (lowerMessage.includes(mapping.pattern.toLowerCase())) {
        return mapping;
      }
    } else {
      if (mapping.pattern.test(errorMessage) || mapping.pattern.test(lowerMessage)) {
        return mapping;
      }
    }
  }
  
  return null;
}

/**
 * Extracts error message from various error formats
 * @param {unknown} error - Error object from API
 * @returns {string} Extracted error message
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object') {
    if ('error' in error) {
      const errorObj = error.error;
      if (errorObj && typeof errorObj === 'object' && 'message' in errorObj) {
        return String(errorObj.message);
      }
      if (typeof errorObj === 'string') {
        return errorObj;
      }
    }
    
    if ('message' in error) {
      return String(error.message);
    }
  }
  
  return 'Error desconocido';
}

/**
 * Gets user-friendly error message from backend error
 * @param {unknown} error - Error object from API
 * @param {number} [statusCode] - HTTP status code
 * @returns {{ message: string; field?: string; action?: string }} Error details with user-friendly message
 */
export function getErrorMessage(error: unknown, statusCode?: number): { message: string; field?: string; action?: string } {
  const errorMessage = extractErrorMessage(error);
  const mapping = findErrorMapping(errorMessage);
  
  if (mapping) {
    return {
      message: mapping.message,
      field: mapping.field,
      action: mapping.action
    };
  }
  
  if (statusCode) {
    switch (statusCode) {
      case 400:
        return { message: errorMessage || 'Los datos proporcionados no son válidos' };
      case 401:
        return { 
          message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
          action: 'clear'
        };
      case 403:
        return { message: errorMessage || 'No tienes permisos para realizar esta acción' };
      case 404:
        return { message: errorMessage || 'Recurso no encontrado' };
      case 409:
        return { message: errorMessage || 'Conflicto en la solicitud' };
      case 500:
        return { 
          message: 'Error interno del servidor. Por favor, intenta nuevamente más tarde.',
          action: 'retry'
        };
      default:
        return { message: errorMessage || 'Ha ocurrido un error' };
    }
  }
  
  return { message: errorMessage || 'Ha ocurrido un error' };
}


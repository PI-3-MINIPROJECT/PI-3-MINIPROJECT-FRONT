# Integración con API Backend

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL del backend
VITE_API_URL=http://localhost:3000

# Configuración del entorno
NODE_ENV=development
```

### Backend Requirements

Para que la integración funcione correctamente, asegúrate de que el backend esté:

1. **Ejecutándose en el puerto 3000** (o actualiza `VITE_API_URL`)
2. **Configurado con CORS** para permitir requests desde `http://localhost:5173`
3. **Con cookies de sesión habilitadas** (configuración HTTP-only)

## 🚀 Funcionalidades Implementadas

### ✅ Registro de Usuario

- **Endpoint**: `POST /api/auth/register`
- **Ubicación**: `src/pages/Register/Register.tsx`
- **Funcionalidades**:
  - Validación de formulario completa
  - Conexión con API backend
  - Manejo de errores específicos
  - Redirección automática al login tras registro exitoso
  - Soporte para OAuth con Google

### 🔧 Utilidades de API

#### `src/utils/api.ts`
- Configuración base con `credentials: 'include'` para cookies
- Funciones genéricas: `get`, `post`, `put`, `del`
- Funciones específicas de auth: `register`, `login`, `logout`, `resetPassword`

#### `src/utils/auth.ts`
- Manejo consistente de errores de autenticación
- Utilidades para OAuth con Google
- Verificación de estado de autenticación
- Gestión de perfil de usuario

## 📝 Próximos Pasos

Para completar la integración, se recomienda implementar:

1. **Login** (`src/pages/Login/Login.tsx`)
2. **Recuperación de contraseña** (`src/pages/ForgotPassword/ForgotPassword.tsx`)
3. **Gestión de perfil** (`src/pages/Profile/Profile.tsx`)
4. **Dashboard con reuniones** (`src/pages/Dashboard/Dashboard.tsx`)
5. **Gestión de reuniones** (crear, unirse, etc.)
6. **Integración WebSocket/Socket.IO** para video conferencias

## 🔒 Autenticación

El sistema utiliza **cookies HTTP-only** para autenticación:
- No necesitas manejar tokens manualmente
- Las cookies se envían automáticamente con cada request
- La autenticación persiste entre sesiones del navegador

## 🐛 Debugging

### Errores Comunes

1. **CORS Error**: Verifica que el backend esté configurado para aceptar requests desde `http://localhost:5173`

2. **Network Error**: Asegúrate de que el backend esté ejecutándose en `http://localhost:3000`

3. **Cookie Issues**: Verifica que el backend esté configurado para enviar cookies con `SameSite: 'lax'` y `HttpOnly: true`

### Logs

Los errores se registran en la consola del navegador. Para debugging adicional, revisa:
- Network tab en DevTools
- Application tab > Cookies para verificar que se establezcan correctamente

## 📚 Documentación API

La documentación completa de la API está disponible en `FRONTEND_API_DOCUMENTATION.md`.
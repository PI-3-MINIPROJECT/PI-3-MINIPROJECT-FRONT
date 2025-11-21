# Instrucciones para configurar el backend

## Archivo .env del Backend

Asegúrate de que tu backend tenga un archivo `.env` con estas variables:

```env
# Puerto del servidor
PORT=3000

# CORS - URL del frontend
CORS_ORIGIN=http://localhost:5173

# Configuración del entorno
NODE_ENV=development

# Firebase (reemplaza con tus valores reales)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

# OAuth con Google (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH_CALLBACK_URL=http://localhost:3000/api/auth/oauth/google

# Configuración de sesiones
SESSION_COOKIE_EXPIRES_IN_MS=432000000

# URL del frontend (para redirecciones OAuth)
FRONTEND_URL=http://localhost:5173
```

## ¿Cómo verificar si funciona?

1. Reinicia tu backend después de crear/actualizar el archivo `.env`
2. Ve al frontend y prueba hacer login
3. Si aún sale error de CORS, verifica que el backend esté usando la variable correctamente

## Solución temporal si sigue fallando

Si continúa el error de CORS, puedes cambiar temporalmente en tu backend el archivo `server.ts`:

```javascript
// En lugar de:
origin: process.env.CORS_ORIGIN || 'http://localhost:5173',

// Usar directamente:
origin: 'http://localhost:5173',
```
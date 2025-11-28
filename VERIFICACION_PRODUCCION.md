# ✅ Verificación de Configuración para Producción

## 📋 Variables de Entorno Requeridas

### 🔴 OBLIGATORIAS en Producción

#### 1. `VITE_API_URL`
- **Descripción**: URL del backend API en producción
- **Uso**: Todas las llamadas a la API REST
- **Archivos que la usan**:
  - `src/utils/api.ts` (línea 35)
  - `src/utils/auth.ts` (líneas 24, 29)
- **Valor esperado**: `https://tu-backend-url.com` (NO `http://localhost:3000`)
- **Estado actual**: ⚠️ Debe configurarse en Vercel

#### 2. `VITE_CHAT_SERVER_URL`
- **Descripción**: URL del servidor de WebSocket/Socket.io para chat en tiempo real
- **Uso**: Conexiones WebSocket para chat y videoconferencia
- **Archivos que la usan**:
  - `src/services/socketService.ts` (línea 3)
  - `src/utils/meetingService.ts` (línea 4)
- **Valor esperado**: `https://tu-chat-server-url.com` (NO `http://localhost:4000`)
- **Estado actual**: ⚠️ Debe configurarse en Vercel
- **Comportamiento actual**: Si no está configurada en producción, lanza error

### 🟡 OPCIONALES (si se usa Firebase)

#### Variables de Firebase (solo si se implementa autenticación con Firebase)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 🔧 Configuración de Vercel

### Archivo: `vercel.json` ✅
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Estado**: ✅ Configurado correctamente
- Build command correcto
- Output directory correcto
- Rewrites para SPA configurados
- Headers de cache configurados

---

## ⚙️ Configuración de Vite

### Archivo: `vite.config.ts` ✅
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'auth': [...],
          'meetings': [...],
          'video': [...]
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
```

**Estado**: ✅ Configurado correctamente
- Code splitting configurado
- Chunks optimizados para producción
- Límite de advertencia de tamaño configurado

---

## 📝 Checklist de Configuración en Vercel

### Variables de Entorno

- [ ] **VITE_API_URL** configurada
  - Valor: URL del backend en producción (ej: `https://tu-backend.onrender.com`)
  - Ambientes: ✅ Production, ✅ Preview, ✅ Development
  
- [ ] **VITE_CHAT_SERVER_URL** configurada
  - Valor: URL del servidor de chat en producción (ej: `https://tu-chat-server.onrender.com`)
  - Ambientes: ✅ Production, ✅ Preview, ✅ Development

- [ ] Variables de Firebase (si aplica)
  - Todas las variables `VITE_FIREBASE_*` configuradas
  - Ambientes: ✅ Production, ✅ Preview, ✅ Development

### Configuración del Proyecto

- [ ] Framework detectado: `vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Despliegue

- [ ] Último despliegue exitoso
- [ ] Variables de entorno aplicadas al último despliegue
- [ ] Aplicación accesible en la URL de producción

---

## 🧪 Verificación Post-Despliegue

### 1. Verificar Variables de Entorno en el Navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Verificar API URL
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
// Debe mostrar: https://tu-backend-url.com (NO undefined ni localhost)

// Verificar Chat Server URL
console.log('VITE_CHAT_SERVER_URL:', import.meta.env.VITE_CHAT_SERVER_URL);
// Debe mostrar: https://tu-chat-server-url.com (NO undefined ni localhost)
```

### 2. Verificar Requests en Network Tab

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Intenta hacer login o cualquier acción que use la API
4. Verifica que las requests vayan a:
   - ✅ `https://tu-backend-url.com/api/...` (NO `http://localhost:3000`)

### 3. Verificar Conexión WebSocket

1. Abre la consola del navegador (F12)
2. Intenta crear o unirte a una reunión
3. Verifica en la consola:
   - ✅ "Socket conectado: [socket-id]" (NO errores de conexión)
   - ❌ Si ves "VITE_CHAT_SERVER_URL no está configurada", la variable falta

---

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: La app intenta conectarse a `localhost:3000`

**Causa**: `VITE_API_URL` no está configurada en Vercel

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Agrega `VITE_API_URL` con la URL del backend en producción
3. Asegúrate de marcar **Production**
4. Redesplega la aplicación

### Problema 2: Error "VITE_CHAT_SERVER_URL no está configurada"

**Causa**: `VITE_CHAT_SERVER_URL` no está configurada en Vercel

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Agrega `VITE_CHAT_SERVER_URL` con la URL del servidor de chat en producción
3. Asegúrate de marcar **Production**
4. Redesplega la aplicación

### Problema 3: Variables configuradas pero no funcionan

**Causa**: El build se hizo antes de agregar las variables

**Solución**:
1. Redesplega la aplicación después de agregar las variables
2. Las variables se inyectan durante el build, no en runtime

### Problema 4: Error de CORS

**Causa**: El backend no tiene configurado el dominio de Vercel en CORS

**Solución**:
1. Verifica que el backend tenga configurado CORS para aceptar requests desde:
   - `https://tu-dominio-vercel.vercel.app`
2. El backend debe tener `credentials: true` en la configuración de CORS

---

## 📊 Estado Actual del Código

### Manejo de Variables de Entorno

#### ✅ `src/utils/api.ts`
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```
- ✅ Tiene fallback para desarrollo local
- ⚠️ No valida en producción (debería lanzar error si falta)

#### ✅ `src/services/socketService.ts`
```typescript
const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || (import.meta.env.PROD ? '' : 'http://localhost:4000');

connect(): Socket {
  if (!SOCKET_URL) {
    throw new Error('VITE_CHAT_SERVER_URL no está configurada...');
  }
  // ...
}
```
- ✅ Valida que la variable exista antes de conectar
- ✅ Lanza error claro si falta en producción

#### ✅ `src/utils/cookies.ts`
```typescript
secure: import.meta.env.PROD
```
- ✅ Usa `secure: true` en producción (cookies HTTPS)

---

## 🎯 Recomendaciones

### 1. Mejorar Validación de Variables en Producción

Agregar validación en `src/utils/api.ts`:

```typescript
const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  
  if (import.meta.env.PROD) {
    const errorMsg = 'VITE_API_URL is not configured in production. Please set it in Vercel environment variables.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  return 'http://localhost:3000';
};

const API_URL = getApiUrl();
```

### 2. Crear Archivo `.env.example`

Crear un archivo `.env.example` con todas las variables necesarias:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Chat Server URL (WebSocket)
VITE_CHAT_SERVER_URL=http://localhost:4000

# Firebase (opcional)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## ✅ Resumen

### Configuración Correcta ✅
- ✅ `vite.config.ts` - Optimizado para producción
- ✅ `vercel.json` - Configurado correctamente
- ✅ `package.json` - Scripts de build correctos
- ✅ Manejo de cookies seguro en producción

### Pendiente de Configurar en Vercel ⚠️
- ⚠️ `VITE_API_URL` - **OBLIGATORIA**
- ⚠️ `VITE_CHAT_SERVER_URL` - **OBLIGATORIA**
- ⚠️ Variables de Firebase (si aplica)

### Mejoras Recomendadas
- [ ] Agregar validación de `VITE_API_URL` en producción
- [ ] Crear archivo `.env.example`
- [ ] Documentar proceso de configuración en Vercel

---

**Última actualización**: $(date)
**Estado general**: ⚠️ Requiere configuración de variables de entorno en Vercel


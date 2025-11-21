# Configuración de Vercel para Producción

## 🔴 Problema Actual

La aplicación en Vercel está intentando conectarse a `http://localhost:3000` porque la variable de entorno `VITE_API_URL` no está configurada o está usando el valor por defecto.

**Error**:
```
Access to fetch at 'http://localhost:3000/api/auth/login' from origin 'https://pi-3-miniproject-front.vercel.app' has been blocked by CORS policy
```

---

## ✅ Solución: Configurar Variables de Entorno en Vercel

### Paso 1: Obtener la URL del Backend en Producción

Primero, necesitas la URL de tu backend desplegado (probablemente en Render según la rúbrica).

**Ejemplo**: Si tu backend está en Render, la URL sería algo como:
```
https://tu-backend.onrender.com
```

### Paso 2: Configurar Variable de Entorno en Vercel

1. Ve a tu proyecto en **Vercel Dashboard**
2. Haz clic en **Settings** (Configuración)
3. Ve a **Environment Variables** (Variables de Entorno)
4. Haz clic en **Add New** (Agregar Nueva)

5. Configura la variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-backend.onrender.com` (reemplaza con tu URL real)
   - **Environment**: Selecciona las tres opciones:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

6. Haz clic en **Save** (Guardar)

### Paso 3: Redesplegar la Aplicación

Después de agregar la variable de entorno:

1. Ve a la pestaña **Deployments**
2. Haz clic en los **3 puntos** (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo push a tu repositorio

---

## 🔧 Configuración del Backend (CORS)

El backend también necesita estar configurado para aceptar requests desde el dominio de Vercel.

### En el Backend (Render o donde esté desplegado)

1. Ve a las **Environment Variables** del backend
2. Configura `CORS_ORIGIN` para incluir el dominio de Vercel:

```env
# Para desarrollo local
CORS_ORIGIN=http://localhost:5173

# Para producción (agregar el dominio de Vercel)
# Si el backend soporta múltiples orígenes, separa con comas:
CORS_ORIGIN=http://localhost:5173,https://pi-3-miniproject-front.vercel.app
```

**O** si el backend usa un array de orígenes permitidos, agrega:
```
https://pi-3-miniproject-front.vercel.app
```

### Verificar Configuración CORS en el Backend

El backend debe tener algo como esto (ejemplo con Express):

```typescript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'https://pi-3-miniproject-front.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Importante para cookies
}));
```

---

## 📋 Checklist de Configuración

### Frontend (Vercel)
- [ ] Variable `VITE_API_URL` configurada con la URL del backend en producción
- [ ] Variable configurada para Production, Preview y Development
- [ ] Aplicación redesplegada después de agregar la variable

### Backend (Render)
- [ ] Variable `CORS_ORIGIN` incluye `https://pi-3-miniproject-front.vercel.app`
- [ ] CORS configurado para aceptar `credentials: true`
- [ ] Backend redesplegado después de cambiar CORS

---

## 🧪 Verificación

Después de configurar todo:

1. **Verifica que la variable esté en Vercel**:
   - Ve a Settings → Environment Variables
   - Debe aparecer `VITE_API_URL` con la URL correcta

2. **Verifica en el navegador**:
   - Abre la consola del navegador (F12)
   - Ve a la pestaña Network
   - Intenta hacer login
   - Verifica que las requests vayan a la URL del backend en producción (no a localhost)

3. **Verifica CORS**:
   - Si aún hay error de CORS, verifica que el backend tenga configurado el dominio de Vercel

---

## 🔍 Debugging

Si después de configurar todo sigue fallando:

### 1. Verificar que la variable se esté usando

En el código, `VITE_API_URL` se usa así:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**Nota**: Las variables de entorno en Vite deben empezar con `VITE_` para estar disponibles en el cliente.

### 2. Verificar en el navegador

Abre la consola del navegador y ejecuta:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

Debería mostrar la URL del backend en producción (no `undefined` ni `http://localhost:3000`).

### 3. Verificar logs del backend

Revisa los logs del backend para ver si las requests están llegando y qué error de CORS está devolviendo.

---

## 📝 Resumen

**Problema**: La app en Vercel intenta conectarse a `localhost:3000` porque `VITE_API_URL` no está configurada.

**Solución**:
1. Configurar `VITE_API_URL` en Vercel con la URL del backend en producción
2. Configurar CORS en el backend para aceptar el dominio de Vercel
3. Redesplegar ambas aplicaciones

**URLs importantes**:
- Frontend: `https://pi-3-miniproject-front.vercel.app`
- Backend: `https://tu-backend.onrender.com` (o donde esté desplegado)


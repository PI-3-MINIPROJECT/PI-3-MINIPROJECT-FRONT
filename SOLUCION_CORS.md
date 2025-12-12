# Solución Rápida para Error de CORS

## 🔴 Error Común

```
Access to fetch at 'http://localhost:3000/api/auth/register' from origin 'http://localhost:5174' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solución Rápida

### Opción 1: Actualizar CORS en el Backend (Recomendado)

1. **Ve a tu proyecto backend**
2. **Abre el archivo `.env` del backend**
3. **Actualiza la variable `CORS_ORIGIN`**:

```env
# Si tu frontend está en el puerto 5174
CORS_ORIGIN=http://localhost:5174

# O para permitir múltiples puertos (si el backend lo soporta)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

4. **Reinicia el servidor backend** (muy importante)

### Opción 2: Usar el Puerto 5173 (Puerto por defecto de Vite)

Si prefieres usar el puerto por defecto:

1. **Detén el servidor de desarrollo actual**
2. **Ejecuta**:
```bash
npm run dev -- --port 5173
```

O configura `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5173
  },
  // ... resto de configuración
});
```

### Opción 3: Configurar CORS para Desarrollo Local (Backend)

Si tienes acceso al código del backend, puedes configurarlo para aceptar cualquier puerto local en desarrollo:

```typescript
// En el archivo de configuración del servidor (ej: server.ts)
import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
    : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // En desarrollo, permitir cualquier localhost
        if (!origin || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
  credentials: true
};

app.use(cors(corsOptions));
```

## 🔍 Verificación

1. **Reinicia el backend** después de cambiar `.env`
2. **Verifica que el frontend esté corriendo** en el puerto correcto
3. **Intenta hacer una petición** (ej: registro o login)
4. **Revisa la consola del navegador** - el error de CORS debería desaparecer

## 📝 Notas

- **El backend debe reiniciarse** después de cambiar variables de entorno
- Si el error persiste, verifica que el backend esté usando la variable `CORS_ORIGIN` correctamente
- En producción, asegúrate de configurar `CORS_ORIGIN` con el dominio correcto de Vercel


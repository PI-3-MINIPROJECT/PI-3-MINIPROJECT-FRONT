# Verificar Variable de Entorno en Vercel

## 🔍 Diagnóstico del Problema

El error indica que la aplicación está intentando conectarse a `http://localhost:3000` desde producción, lo que significa que la variable `VITE_API_URL` **no está configurada** o **no se está leyendo correctamente** en Vercel.

---

## ✅ Solución: Verificar y Configurar en Vercel

### Paso 1: Verificar si la Variable Existe

1. Ve a tu proyecto en **Vercel Dashboard**: https://vercel.com/dashboard
2. Selecciona tu proyecto: `pi-3-miniproject-front`
3. Ve a **Settings** (Configuración)
4. Haz clic en **Environment Variables** (Variables de Entorno)
5. Busca `VITE_API_URL` en la lista

**Si NO existe**:
- Necesitas agregarla (ver Paso 2)

**Si SÍ existe**:
- Verifica que el valor sea correcto (debe ser la URL del backend en producción, NO `http://localhost:3000`)
- Verifica que esté habilitada para **Production**

### Paso 2: Agregar/Actualizar la Variable

1. En **Environment Variables**, haz clic en **Add New** (Agregar Nueva)

2. Configura:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://tu-backend.onrender.com` (reemplaza con la URL real de tu backend)
   - **Environments**: Marca las tres opciones:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

3. Haz clic en **Save** (Guardar)

### Paso 3: Redesplegar

**IMPORTANTE**: Después de agregar o cambiar una variable de entorno, debes redesplegar:

1. Ve a la pestaña **Deployments**
2. Encuentra el último deployment
3. Haz clic en los **3 puntos** (⋯)
4. Selecciona **Redeploy**
5. O simplemente haz un nuevo push a tu repositorio

---

## 🧪 Verificar que Funciona

### Método 1: En el Navegador (Consola)

1. Abre tu aplicación en Vercel: `https://pi-3-miniproject-front.vercel.app`
2. Abre la consola del navegador (F12)
3. Ve a la pestaña **Console**
4. Ejecuta:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

**Resultado esperado**:
- ✅ Debe mostrar la URL del backend (ej: `https://tu-backend.onrender.com`)
- ❌ Si muestra `undefined` o `http://localhost:3000`, la variable no está configurada

### Método 2: En Network Tab

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Intenta hacer login
4. Busca la request a `/api/auth/login`
5. Verifica la URL completa:
   - ✅ Debe ser: `https://tu-backend.onrender.com/api/auth/login`
   - ❌ NO debe ser: `http://localhost:3000/api/auth/login`

---

## 🔧 Si la Variable Está Configurada pero No Funciona

### Problema 1: La Variable No se Está Leyendo

**Causa**: Vite necesita que las variables empiecen con `VITE_` para estar disponibles en el cliente.

**Solución**: Verifica que la variable se llame exactamente `VITE_API_URL` (no `API_URL` ni `REACT_APP_API_URL`)

### Problema 2: El Build se Hizo Antes de Agregar la Variable

**Causa**: Las variables de entorno se inyectan durante el build. Si agregaste la variable después del último build, no estará disponible.

**Solución**: Redesplega la aplicación después de agregar la variable.

### Problema 3: La Variable Está en el Ambiente Incorrecto

**Causa**: La variable está configurada solo para Development, pero no para Production.

**Solución**: Asegúrate de marcar **Production** cuando agregues la variable.

---

## 📝 Código Actualizado

He actualizado el código para que detecte cuando falta la variable en producción y muestre un error claro:

```typescript
// src/utils/api.ts
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
```

Ahora, si falta la variable en producción, verás un error claro en la consola del navegador.

---

## ✅ Checklist Final

- [ ] Variable `VITE_API_URL` existe en Vercel
- [ ] Valor es la URL del backend en producción (NO localhost)
- [ ] Variable está habilitada para **Production**
- [ ] Aplicación fue redesplegada después de agregar/cambiar la variable
- [ ] Verificado en consola del navegador que la variable se lee correctamente
- [ ] Verificado en Network tab que las requests van al backend correcto

---

## 🆘 Si Sigue Fallando

1. **Verifica los Build Logs en Vercel**:
   - Ve a Deployments → Último deployment → Build Logs
   - Busca si hay algún error relacionado con variables de entorno

2. **Verifica que el Backend Esté Desplegado**:
   - Asegúrate de que el backend esté corriendo en la URL que configuraste
   - Verifica que CORS esté configurado para aceptar requests desde Vercel

3. **Contacta al Equipo de Backend**:
   - Pide la URL exacta del backend en producción
   - Verifica que CORS esté configurado correctamente


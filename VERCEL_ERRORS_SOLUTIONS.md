# Soluciones Comunes para Errores en Vercel

## 🔍 Cómo Obtener el Error Exacto

1. Ve a tu proyecto en Vercel Dashboard
2. Haz clic en el deployment que falló
3. Revisa la pestaña **"Build Logs"** o **"Deployment Logs"**
4. Copia el mensaje de error completo

---

## ❌ Errores Comunes y Soluciones

### 1. Error: "Build Command Failed" o "Command 'npm run build' exited with 1"

**Causa**: Error durante el proceso de build (TypeScript, linting, o compilación)

**Solución**:
```bash
# Ejecuta localmente para ver el error:
npm run build

# Si hay errores de TypeScript:
npm run type-check

# Si hay errores de linting:
npm run lint
```

**Verificar**:
- ✅ Todos los archivos TypeScript compilan sin errores
- ✅ No hay errores de linting
- ✅ Todas las dependencias están instaladas

---

### 2. Error: "Module not found" o "Cannot find module"

**Causa**: Dependencia faltante o import incorrecto

**Solución**:
```bash
# Verifica que todas las dependencias estén en package.json
npm install

# Verifica que no haya imports incorrectos
npm run type-check
```

---

### 3. Error: "Environment Variable Missing"

**Causa**: Variables de entorno no configuradas en Vercel

**Solución**:
1. Ve a **Settings** → **Environment Variables** en Vercel
2. Agrega las siguientes variables (si las necesitas):
   ```
   VITE_API_URL=https://tu-backend-url.com
   ```
3. Asegúrate de configurarlas para **Production**, **Preview** y **Development**

**Nota**: Si `VITE_API_URL` no está configurada, el código usará `http://localhost:3000` por defecto, lo cual puede causar problemas en producción.

---

### 4. Error: "404 Not Found" al navegar a rutas

**Causa**: Configuración de SPA routing incorrecta

**Solución**: Verifica que `vercel.json` tenga la configuración correcta:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

✅ Ya está configurado correctamente en tu proyecto.

---

### 5. Error: "Build Output Directory Not Found"

**Causa**: Vercel no encuentra la carpeta `dist`

**Solución**: Verifica en `vercel.json`:
```json
{
  "outputDirectory": "dist"
}
```

✅ Ya está configurado correctamente.

---

### 6. Error: "TypeScript Errors" o "TS2307: Cannot find module"

**Causa**: Errores de TypeScript durante el build

**Solución**:
```bash
# Ejecuta localmente:
npm run type-check

# Corrige todos los errores antes de hacer push
```

---

### 7. Error: "ESLint Errors"

**Causa**: Errores de linting durante el build

**Solución**:
```bash
# Ejecuta localmente:
npm run lint

# O corrige automáticamente:
npm run lint:fix
```

---

### 8. Error: "Node Version Mismatch"

**Causa**: Vercel está usando una versión de Node.js diferente

**Solución**: Crea un archivo `.nvmrc` en la raíz del proyecto:
```
20
```

O especifica en `package.json`:
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

### 9. Error: "Out of Memory" o "Build Timeout"

**Causa**: El build es muy pesado o tarda mucho

**Solución**:
- Optimiza las dependencias
- Reduce el tamaño del bundle
- Verifica que no haya dependencias innecesarias

---

### 10. Error: "CORS Error" en producción

**Causa**: El backend no está configurado para aceptar requests desde el dominio de Vercel

**Solución**: Configura CORS en el backend para aceptar:
```
https://tu-proyecto.vercel.app
```

---

## 🔧 Verificación Pre-Deploy

Antes de hacer push, ejecuta localmente:

```bash
# 1. Verificar TypeScript
npm run type-check

# 2. Verificar Linting
npm run lint

# 3. Build completo
npm run build

# 4. Preview de producción
npm run preview
```

Si todos estos comandos pasan localmente, el deploy en Vercel debería funcionar.

---

## 📝 Checklist de Configuración en Vercel

- [ ] Framework detectado: **Vite**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Variables de entorno configuradas (si es necesario)
- [ ] Node.js version: 20.x (verificar en Settings)

---

## 🆘 Si el Error Persiste

1. **Copia el mensaje de error completo** de los logs de Vercel
2. **Ejecuta localmente** `npm run build` y comparte el output
3. **Verifica** que todas las dependencias estén en `package.json`
4. **Revisa** los logs de GitHub Actions (si usas CI/CD)

---

## 📞 Información Necesaria para Diagnosticar

Por favor, comparte:
1. El mensaje de error completo de Vercel
2. El output de `npm run build` ejecutado localmente
3. La sección de "Build Logs" de Vercel
4. Cualquier warning o error que aparezca


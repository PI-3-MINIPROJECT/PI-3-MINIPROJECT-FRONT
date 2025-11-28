# 🚀 Guía Rápida - Probar Integración de Reuniones

## ⚡ Inicio Rápido

### 1. Asegúrate de que los servidores estén corriendo:

```powershell
# Terminal 1: Backend Principal (puerto 3000)
cd path/to/user-backend
npm start

# Terminal 2: Backend de Chat (puerto 4000)
cd path/to/chat-backend
npm start

# Terminal 3: Frontend (puerto 5173)
cd C:\Users\HP\Music\PI-3-MINIPROJECT-FRONT
npm run dev
```

### 2. Verificar variables de entorno

El archivo `.env` del frontend debe tener:
```env
VITE_API_URL=http://localhost:3000
VITE_CHAT_SERVER_URL=http://localhost:4000
```

---

## 🧪 Prueba Manual Rápida

### Opción A: Desde la interfaz

1. Abre `http://localhost:5173`
2. **Inicia sesión** con tu cuenta
3. Ve a **"Crear reunión"**
4. Llena el formulario:
   - Título: "Test"
   - Fecha: Cualquier fecha futura
   - Hora: "10:00"
   - Duración: 60
   - Participantes: 10
5. Click **"Crear reunión"**
6. ✅ Deberías ver la página de éxito con el **Meeting ID** generado

### Opción B: Test automático desde consola

1. Abre `http://localhost:5173`
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**
4. Ejecuta:
   ```javascript
   // Importar el script de pruebas
   import('./src/utils/testChatConnection.ts').then(module => {
     window.chatTests = module;
     module.runAllTests();
   });
   ```

---

## 🔍 Verificar Conexión en Network Tab

### Al crear reunión:

1. Abre DevTools → Network Tab
2. Crea una reunión desde la interfaz
3. Busca la petición a: `http://localhost:4000/api/meetings`
4. Verifica:
   - ✅ Status: 200 OK
   - ✅ Response tiene `meetingId` generado
   - ✅ Response tiene todos los datos de la reunión

### Al unirse a reunión:

1. Copia un Meeting ID
2. Ve a "Unirse a reunión"
3. Pega el ID y únete
4. En Network, busca: `http://localhost:4000/api/meetings/{meetingId}/join`
5. Verifica:
   - ✅ Status: 200 OK
   - ✅ Response tiene usuario agregado en `participants`

---

## ❌ Problemas Comunes

### "Error de conexión"
- ✅ Verifica que el backend de chat esté corriendo en puerto 4000
- ✅ Ejecuta: `curl http://localhost:4000/health` en PowerShell

### "Debes iniciar sesión"
- ✅ Inicia sesión primero con el backend principal (puerto 3000)
- ✅ El frontend necesita `user.uid` del contexto de autenticación

### "Meeting not found" al unirse
- ✅ Verifica que el Meeting ID sea correcto
- ✅ El ID es generado por el backend, cópialo exactamente

### CORS Error
- ✅ El backend de chat debe tener en `.env`:
  ```
  CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
  ```

---

## 📊 Qué Esperar

### Crear Reunión:
```
Frontend (5173) → Backend Chat (4000) → Response con Meeting ID
                                      ↓
                              Página de Éxito
                        (Muestra ID generado)
```

### Unirse a Reunión:
```
Frontend (5173) → Backend Chat (4000) → Valida Meeting ID
                                      → Agrega usuario
                                      ↓
                              Página de Éxito
                        (Muestra info de reunión)
```

---

## ✅ Checklist de Verificación

- [ ] Backend principal corriendo (3000)
- [ ] Backend de chat corriendo (4000)
- [ ] Frontend corriendo (5173)
- [ ] Variables de entorno configuradas
- [ ] Usuario autenticado
- [ ] Crear reunión funciona
- [ ] Meeting ID se genera automáticamente
- [ ] Página de éxito muestra información
- [ ] Unirse a reunión funciona
- [ ] Botón de copiar ID funciona

---

## 🎯 Resultado Final Esperado

Al crear una reunión, verás:

```
┌─────────────────────────────────────┐
│   ✓ ¡Reunión creada exitosamente!  │
│                                     │
│   Detalles de la reunión           │
│                                     │
│   Título: Test                     │
│   Fecha: 1 de diciembre de 2024    │
│   Hora: 10:00                      │
│   Duración: 60 minutos             │
│   Participantes: 1 / 10            │
│                                     │
│   ID de la reunión                 │
│   ┌──────────────────┐             │
│   │ abc123def456     │  [Copiar]   │
│   └──────────────────┘             │
│                                     │
│   [ Ir a la sala ] [ Dashboard ]   │
└─────────────────────────────────────┘
```

---

## 💡 Tips

- El Meeting ID se genera **automáticamente** en el backend
- NO necesitas escribir el Meeting ID al crear
- El Meeting ID aparece en la página de éxito
- Usa el botón "Copiar" para compartir fácilmente
- Todos los datos se guardan en el backend de chat (puerto 4000)

---

## 📞 ¿Necesitas ayuda?

1. Revisa la consola del navegador (F12)
2. Verifica Network tab para ver las peticiones
3. Asegúrate de que ambos backends estén corriendo
4. Verifica que las variables de entorno sean correctas

---

**¡Todo está listo! 🎉**

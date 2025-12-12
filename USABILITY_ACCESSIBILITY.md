# Heurísticas de Usabilidad y Pautas WCAG de Accesibilidad Implementadas

Este documento proporciona una visión general completa de todas las heurísticas de usabilidad y pautas de accesibilidad WCAG implementadas en la plataforma de videoconferencia.

---

## Tabla de Contenidos

1. [Heurísticas de Usabilidad](#heurísticas-de-usabilidad)
   - [Heurística 1: Visibilidad del Estado del Sistema](#heurística-1-visibilidad-del-estado-del-sistema)
   - [Heurística 2: Prevención de Errores](#heurística-2-prevención-de-errores)
   - [Heurística 3: Consistencia y Estándares](#heurística-3-consistencia-y-estándares)
   - [Heurística 4: Reconocimiento en lugar de Recuerdo](#heurística-4-reconocimiento-en-lugar-de-recuerdo)
   - [Heurística 5: Flexibilidad y Eficiencia de Uso](#heurística-5-flexibilidad-y-eficiencia-de-uso)
   - [Heurística 6: Diseño Estético y Minimalista](#heurística-6-diseño-estético-y-minimalista)
   - [Heurística 7: Ayuda y Documentación](#heurística-7-ayuda-y-documentación)
   - [Heurística 8: Correspondencia entre el Sistema y el Mundo Real](#heurística-8-correspondencia-entre-el-sistema-y-el-mundo-real)
   - [Heurística 9: Control y Libertad del Usuario](#heurística-9-control-y-libertad-del-usuario)
   - [Heurística 10: Ayudar a Reconocer, Diagnosticar y Recuperarse de Errores](#heurística-10-ayudar-a-reconocer-diagnosticar-y-recuperarse-de-errores)

2. [Pautas de Accesibilidad WCAG](#pautas-de-accesibilidad-wcag)
   - [WCAG 2.1.1 Teclado (Operable)](#wcag-211-teclado-operable)
   - [WCAG 3.3.1 Identificación de Errores (Comprensible)](#wcag-331-identificación-de-errores-comprensible)
   - [WCAG 1.1.1 Contenido no Textual (Perceptible)](#wcag-111-contenido-no-textual-perceptible)
   - [WCAG 4.1.2 Name, Role, Value (Robusto)](#wcag-412-name-role-value-robusto)

3. [Resumen](#resumen)

---

## Heurísticas de Usabilidad

La aplicación implementa **10 Heurísticas de Usabilidad de Nielsen** para garantizar una experiencia intuitiva y fácil de usar.

### Heurística 1: Visibilidad del Estado del Sistema

**Principio**: "El sistema debe mantener siempre informado al usuario sobre lo que está sucediendo, a través de retroalimentación apropiada dentro de un tiempo razonable."

**Implementación**:
- **Estados de Carga**: Carga de autenticación, carga de perfil, estados de envío de formularios
- **Mensajes de Éxito**: Éxito en registro, éxito en inicio de sesión, confirmaciones de actualización de perfil
- **Mensajes de Error**: Errores de validación en tiempo real, manejo de errores de API, mensajes de error amigables
- **Retroalimentación Visual**: Estados de botones, indicadores de validación de entrada, listas de verificación de fortaleza de contraseña

**Ubicaciones Clave**:
- `src/contexts/AuthContext.tsx` - Estados de carga
- `src/pages/Login/Login.tsx` - Retroalimentación de envío de formularios
- `src/pages/Register/Register.tsx` - Indicadores de fortaleza de contraseña
- `src/components/Input/Input.tsx` - Estilos de estado de error

**Beneficios**:
- Los usuarios siempre saben cuándo el sistema está procesando su solicitud
- Previene envíos duplicados
- Reduce la ansiedad del usuario mediante retroalimentación clara

---

### Heurística 2: Prevención de Errores

**Principio**: "Mejor que buenos mensajes de error es un diseño cuidadoso que previene que ocurra un problema en primer lugar."

**Implementación**:
- **Validación de Formularios en Tiempo Real**: Validación a nivel de campo en eventos `onChange` y `onBlur`
- **Restricciones de Entrada**: Validación de formato de correo electrónico, requisitos de fortaleza de contraseña, validación de rango de edad
- **Confirmación de Contraseña**: Validación de coincidencia con comparación en tiempo real
- **Indicación de Campos Requeridos**: Marcadores visuales y validación de formularios
- **Diálogos de Confirmación**: La eliminación de cuenta requiere confirmación explícita

**Ubicaciones Clave**:
- `src/pages/Register/Register.tsx` - Validación completa de formularios
- `src/pages/EditProfile/EditProfile.tsx` - Validación de actualización de perfil
- `src/pages/Profile/Profile.tsx` - Modal de confirmación de eliminación de cuenta

**Beneficios**:
- Reduce errores en el envío de formularios
- Mejora la experiencia del usuario con orientación inmediata
- Previene que datos inválidos lleguen al backend

---

### Heurística 3: Consistencia y Estándares

**Principio**: "Los usuarios no deberían tener que preguntarse si diferentes palabras, situaciones o acciones significan lo mismo. Sigue las convenciones de la plataforma."

**Implementación**:
- **Biblioteca de Componentes Reutilizables**: Componentes `Button` e `Input` estandarizados
- **Consistencia de Navegación**: Misma estructura de encabezado y pie de página en todas las páginas
- **Patrones de Formularios**: Diseño de formularios consistente, orden de campos y retroalimentación de validación
- **Consistencia de Diseño Visual**: Esquema de colores consistente, tipografía y espaciado
- **Patrones de Interacción**: Estados de botones consistentes, efectos hover y patrones de envío de formularios

**Ubicaciones Clave**:
- `src/components/Button/Button.tsx` - Componente de botón reutilizable
- `src/components/Input/Input.tsx` - Componente de entrada estandarizado
- `src/components/Header/Header.tsx` - Navegación consistente
- `src/styles/_variables.scss` - Tokens de diseño

**Beneficios**:
- Curva de aprendizaje reducida
- Finalización de tareas más rápida
- Mayor confianza del usuario
- Mejor mantenibilidad

---

### Heurística 4: Reconocimiento en lugar de Recuerdo

**Principio**: "Minimiza la carga de memoria del usuario haciendo visibles los objetos, acciones y opciones. El usuario no debería tener que recordar información de una parte del diálogo a otra."

**Implementación**:
- **Etiquetas y Placeholders Visibles**: Todos los campos de formulario tienen etiquetas visibles con placeholders útiles
- **Indicadores Visuales**: Toggle de visibilidad de contraseña, indicadores de estado de conexión, indicadores de página activa
- **Visualización de Información Contextual**: Requisitos de contraseña visibles como lista de verificación, información de usuario mostrada en perfil
- **Ayuda y Orientación Inline**: Los mensajes de error aparecen inline con los campos, instrucciones de formulario visibles
- **Breadcrumbs de Navegación**: Indicadores de página activa, títulos de página claros
- **Opciones Visibles**: Botones de acción siempre visibles, menú de usuario accesible

**Ubicaciones Clave**:
- `src/pages/Register/Register.tsx` - Lista de verificación de requisitos de contraseña
- `src/pages/Login/Login.tsx` - Botón de toggle de contraseña
- `src/components/ChatRoom/ChatRoom.tsx` - Indicadores de estado de conexión
- `src/components/Header/Header.tsx` - Indicadores de navegación activa

**Beneficios**:
- Carga cognitiva reducida
- Finalización de tareas más rápida
- Menos errores
- Mejor accesibilidad

---

### Heurística 5: Flexibilidad y Eficiencia de Uso

**Principio**: "Los aceleradores — invisibles para el usuario novato — pueden acelerar la interacción para el usuario experto de tal manera que el sistema puede atender tanto a usuarios inexpertos como experimentados."

**Implementación**:
- **Navegación por Teclado**: Soporte completo de teclado con teclas Tab, Enter, Space y Escape
- **Múltiples Métodos de Entrada**: Toggle de visibilidad de contraseña, opción "Recuérdame"
- **Acciones Rápidas**: Enlaces de navegación directos, menú de usuario para acceso rápido
- **Diseño de Formularios Eficiente**: Auto-focus en el primer campo, valores predeterminados inteligentes, placeholders útiles

**Ubicaciones Clave**:
- Todas las páginas de formularios - Soporte de navegación por teclado
- `src/pages/Login/Login.tsx` - Toggle de contraseña y "Recuérdame"
- `src/components/Header/Header.tsx` - Botones de acción rápida

**Beneficios**:
- Atiende a todos los niveles de habilidad del usuario
- Finalización de tareas más rápida
- Fricción reducida
- Flexibilidad en métodos de interacción

---

### Heurística 6: Diseño Estético y Minimalista

**Principio**: "Las interfaces no deberían contener información que sea irrelevante o raramente necesaria. Cada unidad extra de información en una interfaz compite con las unidades relevantes de información y disminuye su visibilidad relativa."

**Implementación**:
- **Jerarquía Visual Limpia**: Cada página presenta una tarea principal, separación clara de secciones
- **Solo Información Esencial**: Solo campos de formulario necesarios, elementos de navegación relevantes
- **Revelación Progresiva**: Requisitos de contraseña mostrados solo cuando son relevantes, mensajes de error aparecen solo cuando son necesarios
- **Simplicidad Visual**: Esquema de colores consistente, tipografía clara, elementos de UI mínimos
- **CTAs Enfocados**: Botones de llamada a la acción claros, acciones secundarias apropiadamente desenfatizadas

**Ubicaciones Clave**:
- `src/pages/Login/Login.tsx` - Estilo limpio y minimalista
- `src/pages/Register/Register.tsx` - Solo campos esenciales
- `src/styles/_variables.scss` - Paleta de colores limitada
- `src/components/Button/Button.tsx` - Variantes de botón claras

**Beneficios**:
- Carga cognitiva reducida
- Finalización de tareas más rápida
- Mejor usabilidad
- Apariencia profesional

---

### Heurística 7: Ayuda y Documentación

**Principio**: "Aunque es mejor si el sistema puede usarse sin documentación, puede ser necesario proporcionar ayuda y documentación. Cualquier información de este tipo debe ser fácil de buscar, enfocada en la tarea del usuario, listar pasos concretos a realizar y no ser demasiado grande."

**Implementación**:
- **Ayuda y Orientación Inline**: Etiquetas y placeholders de campos, lista de verificación de requisitos de contraseña
- **Mensajes de Error Contextuales**: Descripciones de error específicas que explican qué salió mal y cómo solucionarlo
- **Etiquetas y Descripciones ARIA**: Soporte para lectores de pantalla, información de ayuda accesible
- **Indicadores Visuales**: Indicadores de estado, iconos funcionales
- **Instrucciones de Formularios**: Descripciones de campos, indicadores de campos requeridos
- **Navegación Útil**: Breadcrumbs y contexto, texto de enlace descriptivo

**Ubicaciones Clave**:
- `src/pages/Register/Register.tsx` - Instrucciones de requisitos de contraseña
- `src/pages/VideoConference/VideoConference.tsx` - Etiquetas ARIA en botones
- `src/components/Input/Input.tsx` - Etiquetas y placeholders
- `src/components/Header/Header.tsx` - Etiquetas ARIA de navegación

**Beneficios**:
- Curva de aprendizaje reducida
- Resolución de problemas autónoma
- Accesibilidad para todos los usuarios
- Mayor confianza del usuario

---

### Heurística 8: Correspondencia entre el Sistema y el Mundo Real

**Principio**: "El sistema debe hablar el lenguaje de los usuarios, con palabras, frases y conceptos familiares al usuario, en lugar de términos orientados al sistema. Sigue convenciones del mundo real, haciendo que la información aparezca en un orden natural y lógico."

**Implementación**:
- **Tooltips con Lenguaje Humano**: Todos los botones de control de videoconferencia tienen tooltips descriptivos con emojis y lenguaje conversacional
  - "🎤 Activar tu micrófono" en lugar de solo "Unmute"
  - "📹 Apagar tu cámara" en lugar de "Disable video"
  - "📞 Colgar y salir de la reunión" en lugar de "End call"
- **Iconografía Intuitiva**: Uso de iconos universalmente reconocidos
  - 🎤 para micrófono
  - 📹 para cámara
  - 💬 para chat
  - 👥 para participantes
  - 🖥️ para compartir pantalla
- **Terminología Familiar**: Uso de metáforas del mundo real
  - "Sala de Reunión" en vez de "Room ID"
  - "Colgar" en vez de "Disconnect"
  - "Conversación" en vez de "Chat"
  - "Personas" en vez de "Participantes"
- **Mensajes de Error Humanos**: Los errores utilizan lenguaje conversacional
  - "❌ No pudimos conectarte al chat" en lugar de "Connection error"
  - "💬 Conversación vacía - ¡Sé el primero en saludar!" en lugar de "No messages"
  - "Escribe tu mensaje aquí..." en lugar de "Type message"
- **Estados con Contexto**: Los estados del sistema usan lenguaje descriptivo
  - "Conectando al chat..." en lugar de "Loading..."
  - "X personas" en lugar de "X users"
  - "🟢 Conectado al chat" en lugar de solo un indicador verde

**Ubicaciones Clave**:
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 249-320 (tooltips en todos los botones de control)
  ```tsx
  <button
    aria-label={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
    title={isMuted ? '🎤 Activar tu micrófono' : '🔇 Silenciar tu micrófono'}
  >
  ```
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 82-90 (título "Conversación" y estados humanos)
  ```tsx
  <h3>Conversación</h3>
  <div aria-label={isConnected ? 'Conectado al chat' : 'Desconectado del chat'}>
  ```
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 97-100 (contador de personas)
  ```tsx
  {participantCount} {participantCount === 1 ? 'persona' : 'personas'}
  ```
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 138-141 (mensaje sin mensajes)
  ```tsx
  <p>💬 Conversación vacía</p>
  <p>¡Sé el primero en saludar!</p>
  ```

**Beneficios**:
- Reduce la curva de aprendizaje usando términos familiares
- Mejora la comprensión inmediata de las funciones
- Hace la interfaz más amigable y menos técnica
- Aumenta la confianza del usuario al usar metáforas conocidas

---

### Heurística 9: Control y Libertad del Usuario

**Principio**: "Los usuarios a menudo eligen funciones del sistema por error y necesitarán una 'salida de emergencia' claramente marcada para salir del estado no deseado sin tener que pasar por un diálogo extenso. Apoya deshacer y rehacer."

**Implementación**:
- **Confirmación antes de Acciones Críticas**: 
  - Modal de confirmación antes de salir de la reunión cuando hay otros participantes
  - Confirmación doble para eliminar cuenta (ya existente)
  - Advertencias claras sobre las consecuencias de las acciones
- **Navegación con Breadcrumbs**: Sistema de navegación de ruta visible en páginas clave
  - Muestra la ubicación actual del usuario
  - Permite volver rápidamente a páginas anteriores
  - Implementado en VideoConference, CreateMeeting
- **Botones de Cancelación Siempre Visibles**:
  - Botón "Cancelar" en formulario de crear reunión
  - Opción "Quedarme en la sala" en modal de salida
  - Botón de cerrar (X) en chat y modales
- **Escape de Modales**:
  - Los modales se pueden cerrar con la tecla Escape (ya existente)
  - Click fuera del modal para cerrar
  - Botón de cerrar claramente visible
- **Navegación Clara de Salida**:
  - Enlaces de navegación siempre accesibles en el header
  - Breadcrumbs que permiten volver al inicio
  - Botones de "Volver" o "Cancelar" en flujos críticos

**Ubicaciones Clave**:
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 17, 130-151 (modal de confirmación de salida)
  ```tsx
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const handleEndCall = () => {
    if (participants.length > 1) {
      setShowExitConfirm(true);
    } else {
      confirmEndCall();
    }
  };
  ```
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 179-189 (breadcrumbs)
  ```tsx
  <nav className="video-conference__breadcrumbs" aria-label="Navegación de ruta">
    <Link to="/explore">Inicio</Link>
    <span>/</span>
    <span aria-current="page">Sala de Reunión</span>
  </nav>
  ```
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 192-210 (modal de confirmación)
  ```tsx
  <div className="video-conference__modal" role="dialog">
    <h2>¿Salir de la reunión?</h2>
    <p>Hay otras personas en la sala. Si sales, dejarás de verlas y escucharlas.</p>
    <button onClick={cancelEndCall}>Quedarme en la sala</button>
    <button onClick={confirmEndCall}>Sí, salir de la reunión</button>
  </div>
  ```
- `src/pages/CreateMeeting/CreateMeeting.tsx` - Líneas 137-145 (breadcrumbs)
  ```tsx
  <nav className="create-meeting__breadcrumbs" aria-label="Navegación de ruta">
    <Link to="/explore">Inicio</Link>
    <span>/</span>
    <span aria-current="page">Nueva Reunión</span>
  </nav>
  ```
- `src/pages/CreateMeeting/CreateMeeting.tsx` - Líneas 227-238 (botones de acción)
  ```tsx
  <Button
    type="button"
    variant="secondary"
    onClick={() => navigate('/explore')}
  >
    Cancelar
  </Button>
  <Button type="submit" variant="primary">
    Crear reunión
  </Button>
  ```
- `src/pages/VideoConference/VideoConference.scss` - Líneas 755-897 (estilos para breadcrumbs y modal)

**Beneficios**:
- Los usuarios se sienten en control de sus acciones
- Reduce el miedo a cometer errores
- Previene pérdida accidental de trabajo o conexiones
- Facilita la navegación y orientación en la aplicación
- Aumenta la confianza del usuario

---


### Heurística 10: Ayudar a Reconocer, Diagnosticar y Recuperarse de Errores

**Principio**: "Los mensajes de error deben expresarse en lenguaje sencillo (sin códigos), indicar con precisión el problema y sugerir de manera constructiva una solución."

**Implementación**:
- **ErrorBoundary Component**: Captura errores de React y muestra una interfaz amigable de recuperación
  - Interfaz visual atractiva con explicación clara del problema
  - Sugerencias concretas de qué hacer (intentar de nuevo, volver al inicio, refrescar)
  - Botones de acción para recuperación inmediata
  - Detalles técnicos visibles solo en modo desarrollo
  
- **Reconexión Automática del Chat**: 
  - Socket service con reintentos automáticos (hasta 5 intentos)
  - Notificación visual "🔄 Intentando reconectar al chat..."
  - Feedback de éxito cuando se reconecta
  - Callbacks para notificar cambios de estado de conexión
  
- **Mensajes de Error Constructivos**:
  - Errores explican QUÉ salió mal
  - Incluyen CÓMO resolverlo
  - Botón "Reintentar" en errores de conexión
  - Sin códigos técnicos en mensajes al usuario
  
- **Recuperación Guiada**:
  - Opciones claras: "Intentar de nuevo" vs "Volver al inicio"
  - Navegación de emergencia siempre disponible
  - Estado de reconexión visible en tiempo real
  - Auto-recovery cuando es posible

**Ubicaciones Clave**:
- `src/components/ErrorBoundary/ErrorBoundary.tsx` - Componente completo de manejo de errores
  ```tsx
  class ErrorBoundary extends Component<Props, State> {
    static getDerivedStateFromError(error: Error): Partial<State> {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Error capturado:', error, errorInfo);
    }
  }
  ```
  
- `src/components/ErrorBoundary/ErrorBoundary.tsx` - Líneas 55-95 (interfaz de recuperación)
  ```tsx
  <div className="error-boundary__suggestions">
    <h2>¿Qué puedes hacer?</h2>
    <ul>
      <li><strong>Intenta de nuevo:</strong> A veces un error temporal se resuelve solo</li>
      <li><strong>Vuelve al inicio:</strong> Regresa a la página principal</li>
      <li><strong>Refresca la página:</strong> Recarga el navegador (F5 o Ctrl+R)</li>
      <li><strong>Verifica tu conexión:</strong> Asegúrate de estar conectado a internet</li>
    </ul>
  </div>
  <button onClick={this.handleRetry}>↻ Intentar de nuevo</button>
  <button onClick={this.handleReload}>🏠 Volver al inicio</button>
  ```

- `src/App.tsx` - Líneas 4, 81-119 (ErrorBoundary envuelve toda la app)
  ```tsx
  import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
  
  function App() {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <Routes>...</Routes>
        </AuthProvider>
      </ErrorBoundary>
    );
  }
  ```

- `src/services/socketService.ts` - Líneas 12-34 (sistema de reconexión automática)
  ```tsx
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  onReconnectionStatus(callback: (status: 'attempting' | 'success' | 'failed') => void): void {
    this.reconnectionCallbacks.push(callback);
  }
  ```

- `src/services/socketService.ts` - Líneas 51-90 (handlers de reconexión)
  ```tsx
  this.socket.on('connect_error', (error) => {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`🔄 Intento ${this.reconnectAttempts} de ${this.maxReconnectAttempts}`);
      this.notifyReconnectionStatus('attempting');
    } else {
      this.notifyReconnectionStatus('failed');
    }
  });
  
  this.socket.on('reconnect', (attemptNumber) => {
    console.log(`✅ Reconexión exitosa después de ${attemptNumber} intentos`);
    this.reconnectAttempts = 0;
    this.notifyReconnectionStatus('success');
  });
  ```

- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 18, 37-44 (estado de reconexión)
  ```tsx
  const [reconnecting, setReconnecting] = useState(false);
  
  useEffect(() => {
    if (!isConnected && !connectionError) {
      setReconnecting(true);
    } else {
      setReconnecting(false);
    }
  }, [isConnected, connectionError]);
  ```

- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 120-134 (UI de reconexión)
  ```tsx
  {reconnecting && !connectionError && (
    <div className="chat-reconnecting" role="status" aria-live="polite">
      🔄 Intentando reconectar al chat...
    </div>
  )}
  
  {connectionError && (
    <div className="connection-error" role="alert">
      ⚠️ No pudimos conectarte al chat. {connectionError}
      <button onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  )}
  ```

- `src/components/ErrorBoundary/ErrorBoundary.scss` - Estilos para ErrorBoundary
- `src/components/ChatRoom/ChatRoom.scss` - Líneas 93-137, 455-461 (estilos de reconexión)

**Beneficios**:
- **Recuperación Sin Fricción**: Los usuarios pueden resolver problemas sin ayuda técnica
- **Reduce Frustración**: Errores explicados claramente con soluciones prácticas
- **Mantiene Confianza**: El sistema ayuda activamente a recuperarse
- **Previene Abandono**: Los usuarios no se quedan atascados en estados de error
- **Transparencia**: Muestra qué está pasando (reconectando, intentando de nuevo)
- **Autonomía**: Los usuarios pueden solucionar problemas por sí mismos
- **Experiencia Resiliente**: La aplicación se recupera automáticamente cuando es posible

---

## Pautas de Accesibilidad WCAG

La aplicación implementa **4 pautas WCAG 2.1 Nivel A** que cubren los cuatro principios fundamentales: Perceptible, Operable, Comprensible y Robusto.

### WCAG 2.1.1 Teclado (Operable)

**Principio**: Operable  
**Directriz**: 2.1 Accesible por Teclado  
**Criterio de Éxito**: 2.1.1 Teclado  
**Nivel**: A (Nivel mínimo)

**Requisito**: "Toda la funcionalidad del contenido es operable a través de una interfaz de teclado sin requerir tiempos específicos para pulsaciones individuales de teclas."

**Implementación**:
- **Elementos Nativos Accesibles por Teclado**: Todos los botones usan elementos nativos `<button>`, todos los enlaces usan componentes React Router `<Link>`, todos los inputs de formulario usan elementos nativos `<input>`
- **Soporte de Navegación por Teclado**: Navegación con Tab, navegación inversa con Shift+Tab, activación con Enter/Space
- **Indicadores de Foco Visibles**: Estilos `focus-visible` personalizados con colores de alto contraste
- **Orden Lógico de Tabulación**: Flujo de navegación de arriba hacia abajo, de izquierda a derecha
- **Sin Trampas de Teclado**: Los diálogos modales pueden cerrarse con la tecla Escape
- **Etiquetas ARIA**: Todos los botones solo con iconos tienen atributos `aria-label` descriptivos
- **Atributos de Rol**: HTML semántico y roles ARIA para tecnologías de asistencia
- **Manejo de Estados Deshabilitados**: Indicación visual apropiada y prevención por teclado

**Ubicaciones Clave**:
- `src/components/Button/Button.tsx` - Elementos de botón nativos
- `src/components/Input/Input.tsx` - Input nativo con etiquetas
- `src/styles/_mixins.scss` - Mixin focus-visible
- `src/pages/Profile/Profile.tsx` - Manejo de teclado en modales
- `src/pages/VideoConference/VideoConference.tsx` - Etiquetas ARIA en controles

**Beneficios**:
- Acceso universal para usuarios que no pueden usar un mouse
- Eficiencia para usuarios avanzados
- Compatibilidad con lectores de pantalla
- Cumplimiento de WCAG 2.1 Nivel A

---

### WCAG 3.3.1 Identificación de Errores (Comprensible)

**Principio**: Comprensible  
**Directriz**: 3.3 Asistencia de Entrada  
**Criterio de Éxito**: 3.3.1 Identificación de Errores  
**Nivel**: A (Nivel mínimo)

**Requisito**: "Si se detecta automáticamente un error de entrada, el error se identifica y se describe al usuario en texto."

**Implementación**:
- **Mensajes de Error Inline**: Errores a nivel de campo mostrados directamente debajo de los inputs con texto rojo
- **Mensajes de Error Generales**: Errores a nivel de formulario mostrados prominentemente en la parte superior del formulario
- **Identificación de Errores en Tiempo Real**: Los errores aparecen al perder el foco y se limpian al cambiar
- **Descripciones de Error Específicas**: Mensajes de error accionables y específicos (no genéricos)
- **Atributos ARIA**: Los mensajes de error usan `role="alert"` para anuncio por lectores de pantalla
- **Persistencia de Mensajes de Error**: Los errores permanecen visibles hasta que se corrigen

**Ubicaciones Clave**:
- `src/components/Input/Input.tsx` - Visualización de mensajes de error
- `src/pages/Register/Register.tsx` - Errores a nivel de campo y generales
- `src/pages/Login/Login.tsx` - Identificación de errores
- `src/pages/EditProfile/EditProfile.tsx` - Manejo de errores de validación

**Beneficios**:
- Comunicación clara de errores
- Frustración reducida
- Accesibilidad para usuarios de lectores de pantalla
- Mejor experiencia de usuario
- Cumplimiento de WCAG 2.1 Nivel A

---

### WCAG 1.1.1 Contenido no Textual (Perceptible)

**Principio**: Perceptible  
**Directriz**: 1.1 Alternativas de Texto  
**Criterio de Éxito**: 1.1.1 Contenido no Textual  
**Nivel**: A (Nivel mínimo)

**Requisito**: "Todo el contenido no textual que se presenta al usuario tiene una alternativa de texto que sirve al mismo propósito."

**Implementación**:
- **Texto Alternativo Descriptivo para Imágenes**: Todas las imágenes incluyen atributos `alt` descriptivos
  - Imágenes de logo: `alt="konned logo"`
  - Imágenes de ilustración: `alt="Monitor con videoconferencia"`
  - Imágenes de características: `alt="Colaboración en tiempo real"`
- **Imágenes Funcionales**: Los enlaces de logo tienen texto alternativo descriptivo, los botones de iconos usan `aria-label`
- **Contexto y Propósito de Imágenes**: El texto alternativo transmite la misma información que los usuarios videntes obtienen
- **Compatibilidad con Lectores de Pantalla**: Los lectores de pantalla leen el texto alternativo en voz alta

**Ubicaciones Clave**:
- `src/pages/Home/Home.tsx` - Todas las imágenes tienen texto alternativo descriptivo
- `src/pages/About/About.tsx` - Texto alternativo de ilustración de misión
- `src/components/Header/Header.tsx` - Texto alternativo de logo
- `src/components/Footer/Footer.tsx` - Texto alternativo de logo
- `src/pages/Login/Login.tsx` - Texto alternativo de ilustración

**Beneficios**:
- Accesibilidad para usuarios de lectores de pantalla
- Beneficios de SEO a través del texto alternativo
- Confiabilidad si las imágenes fallan al cargar
- Cumplimiento de WCAG 2.1 Nivel A
- Diseño inclusivo

---

### WCAG 4.1.2: Name, Role, Value (Robusto)

**Principio**: Robusto  
**Directriz**: 4.1 Compatible  
**Criterio de Éxito**: 4.1.2 Nombre, Función, Valor  
**Nivel**: A (Nivel mínimo)

**Requisito**: "Para todos los componentes de la interfaz de usuario (incluyendo pero no limitado a: elementos de formulario, enlaces y componentes generados por scripts), el nombre y la función pueden ser determinados mediante programación; los estados, propiedades y valores que pueden ser establecidos por el usuario pueden ser establecidos mediante programación; y la notificación de cambios a estos ítems está disponible para agentes de usuario, incluyendo tecnologías de asistencia."

**Implementación**:
- **Roles ARIA Semánticos en Componentes Personalizados**:
  - Toolbar de controles de videoconferencia con `role="toolbar"`
  - Lista de reuniones con `role="list"` y `role="listitem"`
  - Regiones de chat con `role="region"`
  - Diálogos modales con `role="dialog"`
  - Estados de carga con `role="status"`
  - Alertas con `role="alert"`
  
- **Estados Dinámicos con aria-pressed**:
  - Botón de micrófono: `aria-pressed={!isMuted}` - indica si está activo o silenciado
  - Botón de cámara: `aria-pressed={isVideoOn}` - indica si la cámara está encendida
  - Botón de chat: `aria-pressed={showChat}` - indica si el chat está visible
  - Los estados cambian dinámicamente según la interacción del usuario
  
- **Actualizaciones en Tiempo Real con aria-live**:
  - Estado de conexión del chat: `aria-live="polite"` - anuncia cambios de conexión
  - Contador de participantes: `aria-live="polite"` - anuncia cuando alguien se une o sale
  - Mensajes de bienvenida: `aria-live="polite"` - anuncia mensajes del sistema
  - Indicador de carga: `aria-live="polite"` - anuncia estados de carga
  - Errores de conexión: `aria-live="assertive"` - anuncia errores inmediatamente
  
- **Nombres Accesibles Descriptivos**:
  - Todos los botones de iconos tienen `aria-label` descriptivos
  - Elementos interactivos tienen títulos tooltip con `title`
  - Regiones tienen `aria-label` o `aria-labelledby`
  - Formularios tienen labels asociados correctamente
  
- **Valores de Controles Personalizados**:
  - Inputs de formulario mantienen su valor sincronizado
  - Estados de toggle se comunican mediante aria-pressed
  - Spinners de carga están ocultos de lectores de pantalla con `aria-hidden="true"`
  
- **Navegación por Teclado Completa**:
  - Todos los elementos interactivos son accesibles por teclado
  - Items de reunión responden a Enter y Space
  - Modales pueden cerrarse con Escape
  - Focus management adecuado en modales

**Ubicaciones Clave**:
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 248-250 (toolbar con role)
  ```tsx
  <div className="video-conference__controls" role="toolbar" aria-label="Controles de videoconferencia">
  ```
  
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 251-260 (botón de micrófono con aria-pressed)
  ```tsx
  <button
    aria-label={isMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
    aria-pressed={!isMuted}
    title={isMuted ? '🎤 Activar tu micrófono' : '🔇 Silenciar tu micrófono'}
  >
  ```
  
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 273-280 (botón de cámara con aria-pressed)
  ```tsx
  <button
    aria-label={isVideoOn ? 'Apagar cámara' : 'Encender cámara'}
    aria-pressed={isVideoOn}
    title={isVideoOn ? '📹 Apagar tu cámara' : '📷 Encender tu cámara'}
  >
  ```
  
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 304-311 (botón de chat con aria-pressed)
  ```tsx
  <button
    aria-label={showChat ? 'Ocultar chat' : 'Mostrar chat'}
    aria-pressed={showChat}
    title={showChat ? '💬 Ocultar mensajes del chat' : '💬 Abrir chat para conversar'}
  >
  ```
  
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 81-83 (región con role)
  ```tsx
  <div className="chat-room" role="region" aria-label="Sala de chat">
  ```
  
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 87-93 (indicador de conexión con aria-live)
  ```tsx
  <span 
    role="status"
    aria-live="polite"
    aria-label={isConnected ? 'Conectado al chat' : 'Desconectado del chat'}
  >
  ```
  
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 96-102 (contador de participantes con aria-live)
  ```tsx
  <div 
    role="status"
    aria-live="polite"
    aria-label={`${participantCount} ${participantCount === 1 ? 'persona conectada' : 'personas conectadas'}`}
  >
  ```
  
- `src/components/ChatRoom/ChatRoom.tsx` - Líneas 114-117 (error con role="alert")
  ```tsx
  <div className="connection-error" role="alert" aria-live="assertive">
    ⚠️ No pudimos conectarte al chat. {connectionError}
  </div>
  ```
  
- `src/pages/Dashboard/Dashboard.tsx` - Líneas 73-76 (mensaje de bienvenida con aria-live)
  ```tsx
  <div className="dashboard__welcome-message" role="status" aria-live="polite">
    {welcomeMessage}
  </div>
  ```
  
- `src/pages/Dashboard/Dashboard.tsx` - Líneas 86-89 (sección de reuniones con aria-labelledby)
  ```tsx
  <section className="dashboard__meetings" aria-labelledby="meetings-title">
    <h2 id="meetings-title">Próximas reuniones</h2>
  ```
  
- `src/pages/Dashboard/Dashboard.tsx` - Líneas 91-94 (estado de carga con aria-live)
  ```tsx
  <div className="dashboard__meetings-loading" role="status" aria-live="polite">
    <div className="dashboard__meetings-spinner" aria-hidden="true"></div>
  ```
  
- `src/pages/Dashboard/Dashboard.tsx` - Líneas 108-120 (items de reunión con role y teclado)
  ```tsx
  <div 
    role="listitem"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMeetingClick(meeting);
      }
    }}
    aria-label={`Reunión: ${meeting.title} a las ${formatTime(meeting.time)}`}
  >
  ```
  
- `src/pages/VideoConference/VideoConference.tsx` - Líneas 192-195 (modal con role="dialog")
  ```tsx
  <div 
    className="video-conference__modal" 
    role="dialog" 
    aria-labelledby="exit-dialog-title" 
    aria-describedby="exit-dialog-desc"
  >
  ```

**Beneficios**:
- **Compatibilidad Total con Lectores de Pantalla**: Los usuarios con discapacidades visuales pueden usar toda la aplicación
- **Anuncios de Cambios Dinámicos**: Los cambios de estado se comunican automáticamente a tecnologías asistivas
- **Navegación sin Mouse Completa**: Usuarios que dependen del teclado tienen acceso completo
- **Cumplimiento del Principio Robusto**: La aplicación es compatible con tecnologías asistivas actuales y futuras
- **Experiencia Equivalente**: Usuarios con discapacidades tienen la misma experiencia que usuarios sin discapacidades
- **Cumplimiento Legal**: Cumple con WCAG 2.1 Nivel A para el principio Robusto

---

## Resumen

### Resumen de Heurísticas de Usabilidad

La aplicación implementa **10 de las 10 Heurísticas de Usabilidad de Nielsen** (100% de cumplimiento):

1. ✅ **Visibilidad del Estado del Sistema** - Los usuarios siempre informados sobre el estado del sistema
2. ✅ **Prevención de Errores** - Validación proactiva previene errores
3. ✅ **Consistencia y Estándares** - Patrones de interfaz predecibles
4. ✅ **Reconocimiento en lugar de Recuerdo** - Información visible, no memorizada
5. ✅ **Flexibilidad y Eficiencia** - Múltiples formas de realizar tareas
6. ✅ **Diseño Estético y Minimalista** - Interfaz limpia y enfocada
7. ✅ **Ayuda y Documentación** - Orientación contextual cuando se necesita
8. ✅ **Correspondencia entre el Sistema y el Mundo Real** - Lenguaje familiar y metáforas conocidas
9. ✅ **Control y Libertad del Usuario** - Fácil salida de estados no deseados con confirmaciones
10. ✅ **Ayudar a Reconocer, Diagnosticar y Recuperarse de Errores** - Recuperación guiada de errores

### Resumen de Accesibilidad WCAG

La aplicación implementa **4 pautas WCAG 2.1 Nivel A** cubriendo los **4 principios fundamentales**:

1. ✅ **WCAG 1.1.1 Contenido no Textual (Perceptible)** - Alternativas de texto para imágenes
2. ✅ **WCAG 2.1.1 Teclado (Operable)** - Accesibilidad completa por teclado
3. ✅ **WCAG 3.3.1 Identificación de Errores (Comprensible)** - Comunicación clara de errores
4. ✅ **WCAG 4.1.2 Name, Role, Value (Robusto)** - Compatibilidad con tecnologías asistivas

**Cobertura de los 4 Principios WCAG:**
- ✅ **Perceptible** (Principio 1): WCAG 1.1.1 implementado
- ✅ **Operable** (Principio 2): WCAG 2.1.1 implementado
- ✅ **Comprensible** (Principio 3): WCAG 3.3.1 implementado
- ✅ **Robusto** (Principio 4): WCAG 4.1.2 implementado

### Beneficios Combinados

Juntas, estas heurísticas y pautas de accesibilidad crean:
- **Diseño Inclusivo**: Accesible para usuarios con discapacidades visuales, motoras y cognitivas
- **Mejor Usabilidad**: Experiencia de usuario intuitiva, eficiente y amigable
- **Errores Reducidos**: Prevención proactiva y comunicación clara de errores con lenguaje humano
- **Control Total**: Los usuarios sienten que controlan la aplicación con opciones de salida y confirmaciones
- **Lenguaje Natural**: Uso de metáforas del mundo real y terminología familiar
- **Navegación Clara**: Breadcrumbs y opciones de volver facilitan la orientación
- **Calidad Profesional**: Cumple con los estándares internacionales de usabilidad y accesibilidad
- **Cumplimiento Total WCAG**: Cumple con los requisitos de WCAG 2.1 Nivel A para los **4 principios fundamentales**
- **Compatibilidad Universal**: Funciona con lectores de pantalla, navegación por teclado y tecnologías asistivas

### Mejoras Implementadas Recientemente

**Nuevas Heurísticas (3)**:
1. ✅ Heurística 8: Correspondencia entre el Sistema y el Mundo Real
2. ✅ Heurística 9: Control y Libertad del Usuario
3. ✅ Heurística 10: Ayudar a Reconocer, Diagnosticar y Recuperarse de Errores

**Nueva Pauta WCAG (1)**:
1. ✅ WCAG 4.1.2: Name, Role, Value (Robusto) - Completa el cumplimiento de los 4 principios

**Características Destacadas de las Nuevas Implementaciones**:
- 🎯 Tooltips descriptivos con emojis en todos los controles de videoconferencia
- 🔄 Confirmación modal antes de salir de reuniones activas
- 🗺️ Sistema de breadcrumbs en páginas clave (VideoConference, CreateMeeting)
- 🎤 Estados dinámicos con `aria-pressed` en botones de toggle (mic, cámara, chat)
- 📢 Anuncios en tiempo real con `aria-live` para cambios de estado
- 🎭 Roles ARIA semánticos en todos los componentes personalizados
- 💬 Lenguaje conversacional y humano en mensajes y etiquetas
- ↩️ Botones de cancelar/volver en flujos críticos
- 🛡️ ErrorBoundary para captura y recuperación de errores React
- 🔌 Reconexión automática del chat con feedback visual
- ✨ Mensajes de error constructivos con sugerencias de solución
- 🔄 Sistema de reintentos automáticos en conexiones

### Archivos de Documentación

- **Documentación Detallada de Heurísticas**: Ver `HEURISTICS.md`
- **Documentación Detallada de WCAG**: Ver `ACCESSIBILITY.md`
- **Este Documento de Resumen**: `USABILITY_ACCESSIBILITY.md`

---

## Referencias

### Heurísticas de Usabilidad
- Nielsen, J. (1994). *Usability Engineering*. Morgan Kaufmann.
- Nielsen Norman Group: [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/)

### Pautas WCAG
- [Pautas WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [WCAG 1.1.1 Contenido no Textual](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
- [WCAG 2.1.1 Teclado](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [WCAG 3.3.1 Identificación de Errores](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)
- [WCAG 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)

### ARIA y Accesibilidad
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Using ARIA](https://www.w3.org/TR/using-aria/)
- [ARIA States and Properties](https://www.w3.org/TR/wai-aria-1.2/#states_and_properties)

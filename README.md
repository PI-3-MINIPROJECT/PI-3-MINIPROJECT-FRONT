# VideoConference Platform - Frontend

Plataforma web de videoconferencia desarrollada con React, TypeScript y Vite.

## 📋 Descripción del Proyecto

Este proyecto forma parte del **750018C PROYECTO INTEGRADOR I 2025-2** - Mini proyecto #3: Plataforma de Videoconferencias.

La plataforma permite la creación de reuniones, chat en tiempo real, transmisión de voz y vídeo entre 2 y 10 participantes, con autenticación multicanal y una interfaz accesible y responsiva.

## 🚀 Tecnologías

- **Vite.js** - Build tool y dev server
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **SASS** - Preprocesador CSS
- **React Router** - Enrutamiento
- **Fetch API** - Comunicación con el backend

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/PI-3-MINIPROJECT/PI-3-MINIPROJECT-FRONT.git
cd PI-3-MINIPROJECT-FRONT
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con las configuraciones necesarias:
```
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header/         # Componente de navegación
│   └── Footer/         # Componente de pie de página
├── pages/              # Páginas de la aplicación
│   ├── Home/           # Página principal
│   ├── About/          # Página "Sobre nosotros"
│   └── Sitemap/        # Mapa del sitio
├── styles/             # Estilos globales SASS
│   ├── _variables.scss # Variables de diseño
│   ├── _mixins.scss    # Mixins reutilizables
│   └── main.scss       # Estilos principales
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y helpers
│   └── api.ts          # Funciones de API
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada
```

## 🎨 Características

### Sprint 1 (Actual)
- ✅ Estructura base del proyecto
- ✅ Componentes Header y Footer
- ✅ Páginas: Home, About, Sitemap
- ✅ Diseño responsivo
- ✅ Accesibilidad básica (WCAG)
- ✅ Routing con React Router
- ✅ 2 Heurísticas de Usabilidad implementadas y documentadas (ver [HEURISTICS.md](./HEURISTICS.md))

### Próximos Sprints
- Sprint 2: Chat en tiempo real
- Sprint 3: Transmisión de voz
- Sprint 4: Transmisión de video

## 🌐 Deployment

El proyecto está configurado para desplegarse en **Vercel** con despliegue automático mediante **GitHub Actions**.

### Configuración del Despliegue Automático con GitHub Actions

#### Paso 1: Obtener las Credenciales de Vercel

1. Inicia sesión en [Vercel](https://vercel.com)
2. Ve a [Account Settings](https://vercel.com/account/tokens) → **Tokens**
3. Crea un nuevo token con el nombre que prefieras (ej: "GitHub Actions Deploy")
4. Copia el token generado (solo se muestra una vez)

5. Ve a tu proyecto en Vercel → **Settings** → **General**
6. Copia los siguientes valores:
   - **Project ID** (lo encontrarás en la sección "Project ID")
   - **Organization ID** (lo encontrarás en la URL o en Settings de la organización)

#### Paso 2: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **New repository secret** y agrega los siguientes secrets:

   | Secret Name | Valor |
   |------------|-------|
   | `VERCEL_TOKEN` | El token que creaste en Vercel |
   | `VERCEL_ORG_ID` | Tu Organization ID de Vercel |
   | `VERCEL_PROJECT_ID` | Tu Project ID de Vercel |

#### Paso 3: Conectar el Repositorio a Vercel (Primera vez)

1. En Vercel, ve a tu dashboard y haz clic en **"Add New Project"** o **"Import Project"**
2. Conecta tu cuenta de GitHub si aún no lo has hecho
3. Selecciona el repositorio `PI-3-MINIPROJECT-FRONT`
4. Vercel detectará automáticamente que es un proyecto Vite
5. **No es necesario configurar el despliegue automático aquí**, ya que GitHub Actions lo hará

#### Paso 4: Configurar Variables de Entorno en Vercel

1. En la configuración del proyecto en Vercel, ve a **Settings** → **Environment Variables**
2. Agrega todas las variables de entorno necesarias:
   ```
   VITE_API_URL=https://tu-backend-url.com
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```
3. Asegúrate de configurarlas para los entornos: **Production**, **Preview** y **Development**

#### Paso 5: Verificar el Workflow

El proyecto ya incluye workflows de GitHub Actions configurados:

- **`.github/workflows/deploy.yml`**: Despliega automáticamente a Vercel en cada push a `main` o `master`
- **`.github/workflows/ci.yml`**: Ejecuta validaciones (lint, type-check, build) en cada push y PR

#### Paso 6: Activar el Despliegue Automático

1. Haz un push a la rama principal:
   ```bash
   git add .
   git commit -m "Configure GitHub Actions for automatic deployment"
   git push origin main
   ```
2. Ve a la pestaña **Actions** en tu repositorio de GitHub
3. Verás que el workflow se ejecuta automáticamente:
   - Primero ejecuta las validaciones (lint, type-check, build)
   - Si todo pasa, despliega automáticamente a Vercel
4. Puedes ver el progreso en tiempo real en GitHub Actions
5. Una vez completado, tu aplicación estará desplegada en Vercel

### Cómo Funciona el Workflow

1. **En cada push a `main` o `master`**:
   - Se ejecutan las validaciones (type-check, lint, build)
   - Si las validaciones pasan, se despliega automáticamente a Vercel en producción

2. **En cada Pull Request**:
   - Se ejecutan las validaciones para asegurar que el código es válido
   - No se despliega (solo valida)

3. **En cada push a otras ramas**:
   - Se ejecutan las validaciones del CI
   - No se despliega automáticamente

### Configuración Adicional

#### Dominio Personalizado

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

#### Notificaciones

Puedes configurar notificaciones en **Settings** → **Notifications** para recibir:
- Emails cuando un despliegue falla
- Notificaciones de Slack/Discord
- Webhooks personalizados

### Troubleshooting

- **Error de build**: Revisa los logs en el dashboard de Vercel
- **Variables de entorno no funcionan**: Asegúrate de que empiecen con `VITE_` para que Vite las incluya en el build
- **Rutas no funcionan**: El archivo `vercel.json` ya está configurado con rewrites para SPA

## 📝 Convenciones de Código

- **Idioma**: Código en inglés
- **Comentarios**: JSDoc para funciones y componentes
- **Estilo**: ESLint configurado
- **Accesibilidad**: WCAG 2.1 compliance progresivo

## 📚 Documentación Adicional

- **[HEURISTICS.md](./HEURISTICS.md)**: Documentación de las 2 heurísticas de usabilidad implementadas (Visibilidad del estado del sistema y Prevención de errores)
- **[ACCESSIBILITY.md](./ACCESSIBILITY.md)**: Documentación de la pauta WCAG 2.1.1 Keyboard (Operable) implementada
- **[API_INTEGRATION.md](./API_INTEGRATION.md)**: Documentación de integración con el backend
- **[FRONTEND_API_DOCUMENTATION.md](./FRONTEND_API_DOCUMENTATION.md)**: Documentación detallada de la API del frontend

## 👥 Equipo

Este proyecto es desarrollado por un equipo de 5 estudiantes con los siguientes roles:
- Frontend
- Backend
- Base de datos
- Gestión de proyectos & VCS
- Pruebas

## 📄 Licencia

Este proyecto es parte de un curso académico.

## 🔗 Enlaces

- [Repositorio Backend](https://github.com/PI-3-MINIPROJECT/PI-3-MINIPROJECT-BACK)
- [Documentación del Proyecto](./docs)

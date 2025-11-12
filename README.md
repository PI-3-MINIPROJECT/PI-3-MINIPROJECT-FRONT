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

### Próximos Sprints
- Sprint 2: Chat en tiempo real
- Sprint 3: Transmisión de voz
- Sprint 4: Transmisión de video

## 🌐 Deployment

El proyecto está configurado para desplegarse en **Vercel**.

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno en Vercel
3. El despliegue se realizará automáticamente en cada push a la rama principal

## 📝 Convenciones de Código

- **Idioma**: Código en inglés
- **Comentarios**: JSDoc para funciones y componentes
- **Estilo**: ESLint configurado
- **Accesibilidad**: WCAG 2.1 compliance progresivo

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

# 🏋️‍♂️ Frontend - Sistema de Gestión de Gimnasio

Aplicación web moderna desarrollada con React y Vite para la gestión integral de gimnasios, proporcionando una interfaz intuitiva y responsiva para administradores, entrenadores y socios.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Principales](#-componentes-principales)
- [Páginas y Rutas](#-páginas-y-rutas)
- [Estado y Contextos](#-estado-y-contextos)
- [Servicios de API](#-servicios-de-api)
- [Estilos y Temas](#-estilos-y-temas)
- [Testing](#-testing)
- [Build y Deployment](#-build-y-deployment)
- [Contribución](#-contribución)

## ✨ Características

### 🎨 Interfaz de Usuario Moderna
- Diseño responsivo con Material-UI y Tailwind CSS
- Tema claro/oscuro configurable
- Componentes reutilizables y accesibles
- Animaciones y transiciones suaves
- Iconografía consistente con Lucide React

### 📊 Dashboard Interactivo
- Métricas en tiempo real del gimnasio
- Gráficos y visualizaciones con Chart.js
- Widgets personalizables
- Alertas y notificaciones
- Resumen de actividades recientes

### 👥 Gestión de Socios
- Lista paginada y filtrable de socios
- Formularios de registro y edición
- Subida de fotografías con preview
- Historial de pagos y asistencia
- Estados de membresía visuales
- Búsqueda avanzada y filtros

### 🏃‍♂️ Gestión de Entrenadores
- Perfiles completos de entrenadores
- Calendario de disponibilidad
- Asignación de clases
- Gestión de especialidades
- Reportes de rendimiento

### 📅 Sistema de Clases
- Calendario interactivo de clases
- Reservas en tiempo real
- Control de capacidad visual
- Diferentes vistas (día, semana, mes)
- Gestión de horarios

### 💰 Gestión Financiera
- Dashboard financiero con gráficos
- Registro de pagos con múltiples métodos
- Generación de reportes
- Control de morosos
- Facturación automática

### 🏋️ Inventario de Equipos
- Catálogo visual de equipos
- Estados con códigos de color
- Programación de mantenimiento
- Historial de reparaciones
- Alertas de mantenimiento

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real
- Centro de notificaciones
- Configuración de alertas
- Integración con backend

## 🛠️ Tecnologías

### Core Framework
- **React 19.1.0** - Biblioteca de JavaScript para interfaces
- **Vite 6.3.5** - Herramienta de construcción ultrarrápida
- **TypeScript** - Tipado estático (opcional)

### UI y Estilos
- **Material-UI 7.1.0** - Componentes de interfaz
- **Tailwind CSS 4.1.6** - Framework de CSS utilitario
- **Lucide React 0.469.0** - Iconos modernos y consistentes
- **React QR Code 2.0.15** - Generación de códigos QR

### Enrutamiento y Estado
- **React Router DOM 7.6.0** - Enrutamiento del lado del cliente
- **React Context API** - Gestión de estado global
- **React Hooks** - Lógica de componentes

### Visualización de Datos
- **Chart.js 4.5.0** - Gráficos y visualizaciones
- **React Chart.js 2** - Integración de Chart.js con React

### HTTP y API
- **Axios 1.9.0** - Cliente HTTP para APIs
- **React Query** (opcional) - Gestión de estado del servidor

### Herramientas de Desarrollo
- **ESLint** - Linting de JavaScript/TypeScript
- **Prettier** - Formateo de código
- **Vite DevTools** - Herramientas de desarrollo

### Testing
- **Vitest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Jest DOM** - Utilidades de testing

## 🏗️ Arquitectura

```
gymfront/
├── public/                     # Archivos públicos
│   ├── index.html             # HTML principal
│   ├── favicon.ico            # Favicon
│   └── assets/                # Recursos estáticos
├── src/                       # Código fuente
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Punto de entrada
│   ├── components/            # Componentes reutilizables
│   │   ├── common/            # Componentes comunes
│   │   ├── forms/             # Formularios
│   │   ├── layout/            # Componentes de layout
│   │   ├── charts/            # Componentes de gráficos
│   │   └── ui/                # Componentes de UI básicos
│   ├── pages/                 # Páginas de la aplicación
│   │   ├── Dashboard/         # Dashboard principal
│   │   ├── Socios/            # Gestión de socios
│   │   ├── Entrenadores/      # Gestión de entrenadores
│   │   ├── Clases/            # Gestión de clases
│   │   ├── Pagos/             # Gestión de pagos
│   │   ├── Equipos/           # Gestión de equipos
│   │   ├── Auth/              # Autenticación
│   │   └── Settings/          # Configuraciones
│   ├── contexts/              # Contextos de React
│   │   ├── AuthContext.jsx    # Contexto de autenticación
│   │   ├── ThemeContext.jsx   # Contexto de tema
│   │   └── NotificationContext.jsx # Contexto de notificaciones
│   ├── services/              # Servicios de API
│   │   ├── api.js             # Configuración base de API
│   │   ├── authService.js     # Servicios de autenticación
│   │   ├── sociosService.js   # Servicios de socios
│   │   ├── entrenadoresService.js # Servicios de entrenadores
│   │   ├── clasesService.js   # Servicios de clases
│   │   ├── pagosService.js    # Servicios de pagos
│   │   └── equiposService.js  # Servicios de equipos
│   ├── hooks/                 # Hooks personalizados
│   │   ├── useAuth.js         # Hook de autenticación
│   │   ├── useApi.js          # Hook para APIs
│   │   └── useLocalStorage.js # Hook para localStorage
│   ├── utils/                 # Utilidades
│   │   ├── constants.js       # Constantes
│   │   ├── helpers.js         # Funciones auxiliares
│   │   ├── validators.js      # Validaciones
│   │   └── formatters.js      # Formateadores
│   ├── styles/                # Estilos globales
│   │   ├── globals.css        # Estilos globales
│   │   ├── components.css     # Estilos de componentes
│   │   └── utilities.css      # Utilidades CSS
│   └── assets/                # Recursos del proyecto
│       ├── images/            # Imágenes
│       ├── icons/             # Iconos personalizados
│       └── fonts/             # Fuentes personalizadas
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración de Vite
├── tailwind.config.js         # Configuración de Tailwind
├── eslint.config.js           # Configuración de ESLint
├── .gitignore                 # Archivos ignorados
└── README.md                  # Este archivo
```

## 🚀 Instalación

### Prerrequisitos
- Node.js 18.0 o superior
- npm 8.0+ o pnpm 7.0+ (recomendado)
- Git

### 1. Clonar y navegar al directorio
```bash
git clone <repository-url>
cd Sistema-de-Gestion-de-Gimnasio/gymfront
```

### 2. Instalar dependencias
```bash
# Con npm
npm install

# Con pnpm (recomendado)
pnpm install

# Con yarn
yarn install
```

### 3. Configurar variables de entorno (opcional)
```bash
# Crear archivo .env.local
cp .env.example .env.local

# Editar variables según sea necesario
```

### 4. Ejecutar servidor de desarrollo
```bash
# Con npm
npm run dev

# Con pnpm
pnpm dev

# Con yarn
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local` (opcional):

```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Sistema de Gestión de Gimnasio
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false

# Development
VITE_DEBUG_MODE=true
VITE_MOCK_API=false
```

### Configuración de Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  }
})
```

### Configuración de Tailwind CSS

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

## 📁 Estructura del Proyecto

### Componentes Principales

#### Layout Components
```
src/components/layout/
├── Header.jsx              # Barra de navegación superior
├── Sidebar.jsx             # Menú lateral
├── Footer.jsx              # Pie de página
├── Layout.jsx              # Layout principal
└── Breadcrumbs.jsx         # Navegación de migas
```

#### Common Components
```
src/components/common/
├── LoadingSpinner.jsx      # Indicador de carga
├── ErrorBoundary.jsx       # Manejo de errores
├── Modal.jsx               # Modal reutilizable
├── Table.jsx               # Tabla con paginación
├── SearchBar.jsx           # Barra de búsqueda
├── FilterPanel.jsx         # Panel de filtros
└── Pagination.jsx          # Componente de paginación
```

#### Form Components
```
src/components/forms/
├── SocioForm.jsx           # Formulario de socios
├── EntrenadorForm.jsx      # Formulario de entrenadores
├── ClaseForm.jsx           # Formulario de clases
├── PagoForm.jsx            # Formulario de pagos
├── EquipoForm.jsx          # Formulario de equipos
└── FormField.jsx           # Campo de formulario base
```

### Páginas y Rutas

```javascript
// src/App.jsx - Configuración de rutas
const routes = [
  { path: '/', component: Dashboard },
  { path: '/socios', component: SociosPage },
  { path: '/socios/:id', component: SocioDetail },
  { path: '/entrenadores', component: EntrenadoresPage },
  { path: '/clases', component: ClasesPage },
  { path: '/pagos', component: PagosPage },
  { path: '/equipos', component: EquiposPage },
  { path: '/reportes', component: ReportesPage },
  { path: '/configuracion', component: ConfiguracionPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
]
```

### Estado y Contextos

#### AuthContext
```javascript
// src/contexts/AuthContext.jsx
const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: false
})
```

#### ThemeContext
```javascript
// src/contexts/ThemeContext.jsx
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  colors: {},
  isDark: false
})
```

### Servicios de API

#### Configuración Base
```javascript
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptores para tokens JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### Servicios Específicos
```javascript
// src/services/sociosService.js
export const sociosService = {
  getAll: (params) => api.get('/api/socios/', { params }),
  getById: (id) => api.get(`/api/socios/${id}/`),
  create: (data) => api.post('/api/socios/', data),
  update: (id, data) => api.put(`/api/socios/${id}/`, data),
  delete: (id) => api.delete(`/api/socios/${id}/`),
  uploadPhoto: (id, file) => {
    const formData = new FormData()
    formData.append('foto', file)
    return api.patch(`/api/socios/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
```

## 🎨 Estilos y Temas

### Sistema de Colores
```css
/* src/styles/globals.css */
:root {
  /* Colores primarios */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  
  /* Colores secundarios */
  --color-secondary-50: #f8fafc;
  --color-secondary-500: #64748b;
  
  /* Estados */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Grises */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-900: #111827;
}
```

### Tema Oscuro
```css
[data-theme="dark"] {
  --color-background: #1f2937;
  --color-surface: #374151;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
}
```

### Componentes Estilizados
```css
/* src/styles/components.css */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors;
}

.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
```

## 🧪 Testing

### Configuración de Testing
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
```

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests específicos
npm run test -- SocioForm.test.jsx
```

### Ejemplo de Test
```javascript
// src/components/__tests__/SocioForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SocioForm } from '../forms/SocioForm'

describe('SocioForm', () => {
  test('renders form fields correctly', () => {
    render(<SocioForm />)
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  test('submits form with valid data', async () => {
    const onSubmit = vi.fn()
    render(<SocioForm onSubmit={onSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Juan' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))
    
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Juan' })
    )
  })
})
```

## 🏗️ Build y Deployment

### Scripts Disponibles
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,css,md}"
  }
}
```

### Build para Producción
```bash
# Crear build de producción
npm run build

# Preview del build
npm run preview

# Analizar bundle
npm run build -- --analyze
```

### Deployment

#### Netlify
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contribución

### Estándares de Código

1. **ESLint**: Seguir las reglas configuradas
2. **Prettier**: Formateo automático de código
3. **Conventional Commits**: Estructura de commits
4. **Component Structure**: Seguir patrones establecidos

### Estructura de Commits
```
feat: agregar componente de calendario para clases
fix: corregir validación en formulario de socios
style: actualizar estilos del dashboard
docs: actualizar documentación de componentes
test: agregar tests para servicio de pagos
refactor: optimizar componente de tabla
```

### Guía de Contribución

1. **Fork** el repositorio
2. **Crear rama** feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Seguir estándares** de código y testing
4. **Commit** cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
5. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
6. **Crear Pull Request**

### Code Review Checklist

- [ ] Código sigue estándares ESLint/Prettier
- [ ] Componentes son reutilizables y accesibles
- [ ] Tests cubren funcionalidad nueva
- [ ] Documentación actualizada
- [ ] Performance optimizado
- [ ] Responsive design implementado
- [ ] Manejo de errores incluido

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el frontend:

- **Documentación**: Ver este README
- **Issues**: Crear issue en el repositorio
- **Storybook**: `npm run storybook` (si está configurado)
- **Dev Tools**: Usar React DevTools

---

## 🔗 Enlaces Útiles

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!**

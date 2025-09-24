# 🏋️‍♂️ Sistema de Gestión de Gimnasio

Un sistema completo de gestión para gimnasios desarrollado con Django REST Framework y React, diseñado para optimizar la administración de socios, entrenadores, clases, equipamiento y finanzas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Testing](#-testing)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 👥 Gestión de Socios
- Registro y administración completa de socios
- Historial de membresías y pagos
- Control de acceso y asistencia
- Fotografías y documentos personales
- Estados de membresía (activa, suspendida, vencida)

### 🏃‍♂️ Gestión de Entrenadores
- Perfiles completos de entrenadores
- Especialidades y certificaciones
- Horarios y disponibilidad
- Asignación de clases y socios

### 📅 Sistema de Clases
- Programación de clases grupales
- Reservas y cancelaciones
- Control de capacidad
- Diferentes tipos de actividades
- Horarios flexibles

### 💰 Gestión Financiera
- Procesamiento de pagos (efectivo, tarjeta, transferencia)
- Diferentes tipos de membresías
- Facturación automática
- Reportes financieros
- Control de morosos

### 🏋️ Gestión de Equipamiento
- Inventario completo de equipos
- Programación de mantenimiento
- Estados y ubicaciones
- Historial de reparaciones

### 🔔 Sistema de Notificaciones
- Notificaciones automáticas
- Recordatorios de vencimiento
- Alertas de mantenimiento
- Configuración personalizable

## 🛠️ Tecnologías

### Backend
- **Django 5.1.7** - Framework web de Python
- **Django REST Framework** - API REST
- **Django CORS Headers** - Manejo de CORS
- **Djoser** - Autenticación y gestión de usuarios
- **JWT** - Autenticación basada en tokens
- **PostgreSQL/SQLite** - Base de datos
- **Pillow** - Procesamiento de imágenes
- **Django Filter** - Filtrado avanzado de APIs

### Frontend
- **React 19.1.0** - Biblioteca de JavaScript
- **Vite 6.3.5** - Herramienta de construcción
- **Material-UI 7.1.0** - Componentes de interfaz
- **Tailwind CSS 4.1.6** - Framework de CSS
- **Axios 1.9.0** - Cliente HTTP
- **React Router DOM 7.6.0** - Enrutamiento
- **Chart.js 4.5.0** - Gráficos y visualizaciones
- **React QR Code** - Generación de códigos QR
- **Lucide React** - Iconos

### Testing
- **Pytest** - Testing del backend
- **Vitest** - Testing del frontend
- **Testing Library** - Utilidades de testing

## 🏗️ Arquitectura

```
Sistema de Gestión de Gimnasio/
├── backend/                 # API Django REST Framework
│   ├── apps/
│   │   ├── core/           # Modelos principales (Socio, Entrenador, etc.)
│   │   └── Users/          # Gestión de usuarios y autenticación
│   ├── notifications/      # Sistema de notificaciones
│   └── gimnasio/          # Configuración del proyecto
├── gymfront/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── contexts/      # Contextos de React
│   │   ├── services/      # Servicios de API
│   │   └── styles/        # Estilos globales
└── test/                  # Suite de testing
    ├── backend/           # Tests del backend
    ├── frontend/          # Tests del frontend
    └── integration/       # Tests de integración
```

## 🚀 Instalación

### Prerrequisitos
- Python 3.8+
- Node.js 18+
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd Sistema-de-Gestion-de-Gimnasio
```

### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv env

# Activar entorno virtual
# Windows
env\Scripts\activate
# Linux/Mac
source env/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp gimnasio/.env.example gimnasio/.env
# Editar .env con tus configuraciones

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Poblar base de datos (opcional)
python populate_db.py

# Ejecutar servidor
python manage.py runserver
```

### 3. Configurar el Frontend

```bash
cd gymfront

# Instalar dependencias
npm install
# o
pnpm install

# Ejecutar servidor de desarrollo
npm run dev
# o
pnpm dev
```

## ⚙️ Configuración

### Variables de Entorno (Backend)

Crear archivo `.env` en `backend/gimnasio/`:

```env
# Django
SECRET_KEY=tu_clave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ORIGIN_WHITELIST=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Base de datos
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# Dominio
DOMAIN=localhost:8000
```

### Configuración del Frontend

El frontend se conecta automáticamente al backend en `http://127.0.0.1:8000`. Si necesitas cambiar esta configuración, edita los archivos en `src/services/`.

## 🎯 Uso

### Acceso al Sistema

1. **Backend Admin**: `http://127.0.0.1:8000/admin/`
2. **Frontend**: `http://localhost:5173`
3. **API Documentation**: `http://127.0.0.1:8000/api/`

### Funcionalidades Principales

1. **Dashboard**: Vista general del gimnasio
2. **Gestión de Socios**: CRUD completo de socios
3. **Gestión de Entrenadores**: Administración de personal
4. **Programación de Clases**: Calendario y reservas
5. **Control de Pagos**: Gestión financiera
6. **Inventario de Equipos**: Control de equipamiento
7. **Reportes**: Análisis y estadísticas

## 📚 API Documentation

### Endpoints Principales

```
# Autenticación
POST /auth/users/                    # Registro de usuario
POST /auth/jwt/create/               # Login
POST /auth/jwt/refresh/              # Refresh token

# Socios
GET    /api/socios/                  # Listar socios
POST   /api/socios/                  # Crear socio
GET    /api/socios/{id}/             # Obtener socio
PUT    /api/socios/{id}/             # Actualizar socio
DELETE /api/socios/{id}/             # Eliminar socio

# Entrenadores
GET    /api/entrenadores/            # Listar entrenadores
POST   /api/entrenadores/            # Crear entrenador

# Clases
GET    /api/clases/                  # Listar clases
POST   /api/clases/                  # Crear clase

# Pagos
GET    /api/pagos/                   # Listar pagos
POST   /api/pagos/                   # Registrar pago

# Equipos
GET    /api/equipos/                 # Listar equipos
POST   /api/equipos/                 # Crear equipo
```

## 🧪 Testing

### Ejecutar Tests del Backend
```bash
cd backend
pytest
```

### Ejecutar Tests del Frontend
```bash
cd gymfront
npm test
```

### Ejecutar Tests de Integración
```bash
cd test
npm test
```

### Ejecutar Todos los Tests
```bash
# Windows
.\test\run-tests.ps1

# Linux/Mac
./test/run-tests.sh
```

## 📁 Estructura del Proyecto

```
Sistema-de-Gestion-de-Gimnasio/
├── .gitignore                      # Gitignore principal
├── README.md                       # Este archivo
├── DER.png                         # Diagrama de entidad-relación
├── Gestion de Gimnasios.pdf        # Documentación del proyecto
├── Idea.docx                       # Documento de ideas
├── backend/                        # Backend Django
│   ├── .gitignore                  # Gitignore del backend
│   ├── requirements.txt            # Dependencias Python
│   ├── manage.py                   # Script de gestión Django
│   ├── populate_db.py              # Script para poblar BD
│   ├── gimnasio/                   # Configuración del proyecto
│   │   ├── settings.py             # Configuraciones Django
│   │   ├── urls.py                 # URLs principales
│   │   └── .env                    # Variables de entorno
│   ├── apps/                       # Aplicaciones Django
│   │   ├── core/                   # App principal
│   │   │   ├── models.py           # Modelos de datos
│   │   │   ├── views.py            # Vistas de la API
│   │   │   ├── serializers.py      # Serializadores
│   │   │   └── urls.py             # URLs de la app
│   │   └── Users/                  # App de usuarios
│   │       ├── models.py           # Modelo de usuario personalizado
│   │       ├── serializers.py      # Serializadores de usuario
│   │       └── views.py            # Vistas de autenticación
│   └── notifications/              # App de notificaciones
│       ├── models.py               # Modelos de notificaciones
│       ├── views.py                # API de notificaciones
│       └── serializers.py          # Serializadores
├── gymfront/                       # Frontend React
│   ├── .gitignore                  # Gitignore del frontend
│   ├── package.json                # Dependencias Node.js
│   ├── vite.config.js              # Configuración Vite
│   ├── tailwind.config.js          # Configuración Tailwind
│   ├── index.html                  # HTML principal
│   └── src/                        # Código fuente
│       ├── App.jsx                 # Componente principal
│       ├── main.jsx                # Punto de entrada
│       ├── components/             # Componentes reutilizables
│       ├── pages/                  # Páginas de la aplicación
│       ├── contexts/               # Contextos de React
│       ├── services/               # Servicios de API
│       ├── styles/                 # Estilos globales
│       └── assets/                 # Recursos estáticos
└── test/                           # Suite de testing
    ├── .gitignore                  # Gitignore de tests
    ├── README.md                   # Documentación de tests
    ├── package.json                # Dependencias de testing
    ├── run-tests.ps1               # Script para ejecutar tests
    ├── backend/                    # Tests del backend
    ├── frontend/                   # Tests del frontend
    └── integration/                # Tests de integración
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- **Backend**: Seguir PEP 8 para Python
- **Frontend**: Usar ESLint y Prettier
- **Commits**: Usar Conventional Commits
- **Testing**: Mantener cobertura > 80%

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Desarrollador**: Ariel Chacon Artola
- **Email**: [achacona1998@gmail.com]
- **GitHub**: [https://github.com/achacona1998]

## 🙏 Agradecimientos

- Django REST Framework por la excelente documentación
- React y Vite por las herramientas de desarrollo
- Material-UI por los componentes de interfaz
- La comunidad open source por las librerías utilizadas

---

⭐ Si este proyecto te ha sido útil, ¡no olvides darle una estrella!
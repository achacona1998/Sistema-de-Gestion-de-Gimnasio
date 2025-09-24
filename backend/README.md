# 🏋️‍♂️ Backend - Sistema de Gestión de Gimnasio

API REST desarrollada con Django REST Framework para la gestión completa de gimnasios, incluyendo socios, entrenadores, clases, pagos y equipamiento.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Modelos de Datos](#-modelos-de-datos)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contribución](#-contribución)

## ✨ Características

### 🔐 Autenticación y Autorización
- Sistema de usuarios personalizado con Djoser
- Autenticación JWT con refresh tokens
- Permisos granulares por endpoint
- Gestión de roles y permisos

### 👥 Gestión de Socios
- CRUD completo de socios
- Gestión de membresías y estados
- Historial de pagos y asistencia
- Subida de fotografías y documentos
- Filtrado y búsqueda avanzada

### 🏃‍♂️ Gestión de Entrenadores
- Perfiles completos de entrenadores
- Especialidades y certificaciones
- Horarios y disponibilidad
- Asignación de clases

### 📅 Sistema de Clases
- Programación de clases grupales
- Control de capacidad y reservas
- Diferentes tipos de actividades
- Gestión de horarios

### 💰 Gestión Financiera
- Procesamiento de pagos múltiples métodos
- Diferentes tipos de membresías
- Facturación y reportes
- Control de morosos

### 🏋️ Gestión de Equipamiento
- Inventario completo de equipos
- Estados y ubicaciones
- Programación de mantenimiento
- Historial de reparaciones

### 🔔 Sistema de Notificaciones
- Plantillas de notificaciones configurables
- Notificaciones automáticas
- Recordatorios y alertas
- Integración con frontend

## 🛠️ Tecnologías

### Core Framework
- **Django 5.1.7** - Framework web de Python
- **Django REST Framework 3.15.2** - Toolkit para APIs REST
- **Python 3.8+** - Lenguaje de programación

### Autenticación y Seguridad
- **Djoser 2.3.0** - Autenticación y gestión de usuarios
- **PyJWT 2.10.1** - JSON Web Tokens
- **Django CORS Headers 4.6.0** - Manejo de CORS

### Base de Datos y ORM
- **SQLite** (desarrollo) / **PostgreSQL** (producción)
- **Django ORM** - Object-Relational Mapping
- **Django Migrations** - Gestión de esquemas

### Utilidades
- **Pillow 11.1.0** - Procesamiento de imágenes
- **Django Filter 24.3** - Filtrado avanzado de APIs
- **Python Decouple** - Gestión de configuraciones

## 🏗️ Arquitectura

```
backend/
├── gimnasio/                   # Configuración del proyecto
│   ├── __init__.py
│   ├── settings.py             # Configuraciones Django
│   ├── urls.py                 # URLs principales
│   ├── wsgi.py                 # WSGI configuration
│   └── .env                    # Variables de entorno
├── apps/                       # Aplicaciones Django
│   ├── __init__.py
│   ├── core/                   # App principal
│   │   ├── __init__.py
│   │   ├── models.py           # Modelos principales
│   │   ├── views.py            # Vistas de la API
│   │   ├── serializers.py      # Serializadores DRF
│   │   ├── urls.py             # URLs de la app
│   │   ├── admin.py            # Configuración admin
│   │   ├── filters.py          # Filtros personalizados
│   │   └── permissions.py      # Permisos personalizados
│   └── Users/                  # App de usuarios
│       ├── __init__.py
│       ├── models.py           # Modelo de usuario personalizado
│       ├── serializers.py      # Serializadores de usuario
│       ├── views.py            # Vistas de autenticación
│       ├── urls.py             # URLs de usuarios
│       └── admin.py            # Admin de usuarios
├── notifications/              # App de notificaciones
│   ├── __init__.py
│   ├── models.py               # Modelos de notificaciones
│   ├── views.py                # API de notificaciones
│   ├── serializers.py          # Serializadores
│   ├── urls.py                 # URLs de notificaciones
│   └── admin.py                # Admin de notificaciones
├── media/                      # Archivos subidos
├── static/                     # Archivos estáticos
├── manage.py                   # Script de gestión Django
├── populate_db.py              # Script para poblar BD
├── requirements.txt            # Dependencias Python
└── .gitignore                  # Archivos ignorados
```

## 🚀 Instalación

### Prerrequisitos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Git

### 1. Clonar y navegar al directorio
```bash
git clone <repository-url>
cd Sistema-de-Gestion-de-Gimnasio/backend
```

### 2. Crear entorno virtual
```bash
# Crear entorno virtual
python -m venv env

# Activar entorno virtual
# Windows
env\Scripts\activate
# Linux/Mac
source env/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
```bash
# Copiar archivo de ejemplo (si existe)
cp gimnasio/.env.example gimnasio/.env

# O crear archivo .env manualmente
# Ver sección de Configuración
```

### 5. Configurar base de datos
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

### 6. Poblar base de datos (opcional)
```bash
python populate_db.py
```

### 7. Ejecutar servidor de desarrollo
```bash
python manage.py runserver
```

El servidor estará disponible en `http://127.0.0.1:8000/`

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en `gimnasio/`:

```env
# Django Core
SECRET_KEY=tu_clave_secreta_muy_segura_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ORIGIN_WHITELIST=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Database Configuration
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# Domain Configuration
DOMAIN=localhost:8000

# JWT Configuration (opcional)
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email Configuration (opcional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=tu_email@gmail.com
EMAIL_HOST_PASSWORD=tu_password_de_aplicacion

# Media Files
MEDIA_ROOT=media/
MEDIA_URL=/media/

# Static Files
STATIC_ROOT=static/
STATIC_URL=/static/
```

### Configuración de Base de Datos

#### SQLite (Desarrollo)
```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

#### PostgreSQL (Producción)
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=gimnasio_db
DB_USER=gimnasio_user
DB_PASSWORD=tu_password_seguro
DB_HOST=localhost
DB_PORT=5432
```

## 📊 Modelos de Datos

### Modelo de Usuario (Users/models.py)
```python
class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
```

### Modelos Principales (core/models.py)

#### Membresía
```python
class Membresia(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    duracion_dias = models.IntegerField()
    descripcion = models.TextField()
```

#### Socio
```python
class Socio(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    fecha_nacimiento = models.DateField()
    membresia = models.ForeignKey(Membresia, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_vencimiento = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    foto = models.ImageField(upload_to='socios/', blank=True, null=True)
```

#### Entrenador
```python
class Entrenador(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    especialidad = models.CharField(max_length=100)
    certificaciones = models.TextField()
    fecha_contratacion = models.DateField()
    salario = models.DecimalField(max_digits=10, decimal_places=2)
```

#### Clase
```python
class Clase(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    entrenador = models.ForeignKey(Entrenador, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField()
    duracion_minutos = models.IntegerField()
    capacidad_maxima = models.IntegerField()
    precio = models.DecimalField(max_digits=8, decimal_places=2)
```

#### Pago
```python
class Pago(models.Model):
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pago = models.DateTimeField()
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES)
    concepto = models.CharField(max_length=200)
    comprobante = models.CharField(max_length=100)
```

#### Equipo
```python
class Equipo(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    fecha_compra = models.DateField()
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADO_EQUIPO_CHOICES)
    ubicacion = models.CharField(max_length=100)
```

### Modelo de Notificaciones (notifications/models.py)
```python
class NotificationTemplate(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
```

## 🔌 API Endpoints

### Autenticación
```
POST   /auth/users/                    # Registro de usuario
POST   /auth/jwt/create/               # Login (obtener tokens)
POST   /auth/jwt/refresh/              # Refresh token
POST   /auth/jwt/verify/               # Verificar token
GET    /auth/users/me/                 # Perfil del usuario actual
PUT    /auth/users/me/                 # Actualizar perfil
```

### Socios
```
GET    /api/socios/                    # Listar socios
POST   /api/socios/                    # Crear socio
GET    /api/socios/{id}/               # Obtener socio específico
PUT    /api/socios/{id}/               # Actualizar socio completo
PATCH  /api/socios/{id}/               # Actualizar socio parcial
DELETE /api/socios/{id}/               # Eliminar socio

# Filtros disponibles
GET    /api/socios/?estado=activo      # Filtrar por estado
GET    /api/socios/?membresia=1        # Filtrar por membresía
GET    /api/socios/?search=nombre      # Búsqueda por nombre/apellido
```

### Entrenadores
```
GET    /api/entrenadores/              # Listar entrenadores
POST   /api/entrenadores/              # Crear entrenador
GET    /api/entrenadores/{id}/         # Obtener entrenador específico
PUT    /api/entrenadores/{id}/         # Actualizar entrenador
DELETE /api/entrenadores/{id}/         # Eliminar entrenador
```

### Clases
```
GET    /api/clases/                    # Listar clases
POST   /api/clases/                    # Crear clase
GET    /api/clases/{id}/               # Obtener clase específica
PUT    /api/clases/{id}/               # Actualizar clase
DELETE /api/clases/{id}/               # Eliminar clase

# Filtros disponibles
GET    /api/clases/?entrenador=1       # Filtrar por entrenador
GET    /api/clases/?fecha=2024-01-01   # Filtrar por fecha
```

### Pagos
```
GET    /api/pagos/                     # Listar pagos
POST   /api/pagos/                     # Registrar pago
GET    /api/pagos/{id}/                # Obtener pago específico
PUT    /api/pagos/{id}/                # Actualizar pago
DELETE /api/pagos/{id}/                # Eliminar pago

# Filtros disponibles
GET    /api/pagos/?socio=1             # Filtrar por socio
GET    /api/pagos/?metodo_pago=efectivo # Filtrar por método
GET    /api/pagos/?fecha_desde=2024-01-01 # Filtrar por rango de fechas
```

### Equipos
```
GET    /api/equipos/                   # Listar equipos
POST   /api/equipos/                   # Crear equipo
GET    /api/equipos/{id}/              # Obtener equipo específico
PUT    /api/equipos/{id}/              # Actualizar equipo
DELETE /api/equipos/{id}/              # Eliminar equipo

# Filtros disponibles
GET    /api/equipos/?estado=operativo  # Filtrar por estado
GET    /api/equipos/?tipo=cardio       # Filtrar por tipo
```

### Membresías
```
GET    /api/membresias/                # Listar membresías
POST   /api/membresias/                # Crear membresía
GET    /api/membresias/{id}/           # Obtener membresía específica
PUT    /api/membresias/{id}/           # Actualizar membresía
DELETE /api/membresias/{id}/           # Eliminar membresía
```

### Asistencia
```
GET    /api/asistencias/               # Listar asistencias
POST   /api/asistencias/               # Registrar asistencia
GET    /api/asistencias/{id}/          # Obtener asistencia específica

# Filtros disponibles
GET    /api/asistencias/?socio=1       # Filtrar por socio
GET    /api/asistencias/?fecha=2024-01-01 # Filtrar por fecha
```

### Notificaciones
```
GET    /api/notifications/templates/   # Listar plantillas
POST   /api/notifications/templates/   # Crear plantilla
GET    /api/notifications/templates/{id}/ # Obtener plantilla
PUT    /api/notifications/templates/{id}/ # Actualizar plantilla
DELETE /api/notifications/templates/{id}/ # Eliminar plantilla
```

## 🔐 Autenticación

### Configuración JWT

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### Uso de Tokens

1. **Obtener tokens**:
```bash
curl -X POST http://127.0.0.1:8000/auth/jwt/create/ \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "contraseña"}'
```

2. **Usar token de acceso**:
```bash
curl -X GET http://127.0.0.1:8000/api/socios/ \
  -H "Authorization: Bearer <access_token>"
```

3. **Renovar token**:
```bash
curl -X POST http://127.0.0.1:8000/auth/jwt/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<refresh_token>"}'
```

### Permisos

El sistema implementa permisos granulares:

- **IsAuthenticated**: Usuario autenticado
- **IsAdminUser**: Usuario administrador
- **IsOwnerOrReadOnly**: Propietario o solo lectura
- **Custom permissions**: Permisos personalizados por modelo

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
python manage.py test

# Tests específicos de una app
python manage.py test apps.core

# Tests con cobertura
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Estructura de Tests
```
backend/
├── apps/
│   ├── core/
│   │   └── tests/
│   │       ├── __init__.py
│   │       ├── test_models.py
│   │       ├── test_views.py
│   │       └── test_serializers.py
│   └── Users/
│       └── tests/
│           ├── __init__.py
│           ├── test_models.py
│           └── test_views.py
```

### Ejemplo de Test
```python
# apps/core/tests/test_models.py
from django.test import TestCase
from apps.core.models import Socio, Membresia

class SocioModelTest(TestCase):
    def setUp(self):
        self.membresia = Membresia.objects.create(
            nombre="Básica",
            precio=50.00,
            duracion_dias=30
        )
    
    def test_socio_creation(self):
        socio = Socio.objects.create(
            nombre="Juan",
            apellido="Pérez",
            email="juan@ejemplo.com",
            membresia=self.membresia
        )
        self.assertEqual(socio.nombre, "Juan")
        self.assertEqual(str(socio), "Juan Pérez")
```

## 🚀 Deployment

### Configuración para Producción

1. **Variables de entorno**:
```env
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
SECRET_KEY=clave_super_secreta_para_produccion
```

2. **Base de datos PostgreSQL**:
```bash
pip install psycopg2-binary
```

3. **Archivos estáticos**:
```bash
python manage.py collectstatic
```

4. **Migraciones**:
```bash
python manage.py migrate
```

### Docker (Opcional)

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### Comandos Útiles

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic

# Shell de Django
python manage.py shell

# Poblar base de datos
python populate_db.py

# Ejecutar servidor
python manage.py runserver

# Ejecutar en puerto específico
python manage.py runserver 8080
```

## 🤝 Contribución

### Estándares de Código

1. **PEP 8**: Seguir las convenciones de Python
2. **Docstrings**: Documentar funciones y clases
3. **Type hints**: Usar anotaciones de tipo cuando sea posible
4. **Tests**: Escribir tests para nuevas funcionalidades

### Estructura de Commits
```
feat: agregar endpoint para reportes de asistencia
fix: corregir validación de fechas en modelo Socio
docs: actualizar documentación de API
test: agregar tests para modelo Entrenador
```

### Pull Request Process

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el backend:

- **Documentación**: Ver este README
- **Issues**: Crear issue en el repositorio
- **API Docs**: `http://127.0.0.1:8000/api/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!**
# 🧪 Sistema de Tests - Gestión de Gimnasio

## 📋 Descripción General

Este directorio contiene una suite completa de tests para el Sistema de Gestión de Gimnasio, incluyendo tests unitarios y funcionales para tanto el backend (Django) como el frontend (React).

## 🏗️ Estructura del Proyecto

```
test/
├── backend/                    # Tests del backend (Django)
│   ├── test_models.py         # Tests de modelos de datos
│   ├── test_serializers.py    # Tests de serializers de API
│   ├── test_views.py          # Tests de vistas y endpoints
│   ├── pytest.ini            # Configuración de pytest
│   └── requirements-test.txt   # Dependencias de testing
├── frontend/                   # Tests del frontend (React)
│   ├── basic.test.js          # Tests básicos de JavaScript
│   ├── simple.test.js         # Tests simples de funcionalidad
│   ├── react-basic.test.jsx   # Tests básicos de React
│   ├── lucide.test.jsx        # Tests de iconos Lucide
│   ├── dashboard-components.test.jsx # Tests de componentes del dashboard
│   ├── vitest.config.js       # Configuración de Vitest
│   └── test-setup.js          # Setup global de tests

├── run-tests.ps1              # Script principal para ejecutar tests
└── README.md                  # Esta documentación
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Python 3.8+** con pip
- **Node.js 16+** con npm

### Ejecutar Todos los Tests

```powershell
# Ejecutar todos los tests
.\run-tests.ps1

# Con cobertura de código
.\run-tests.ps1 -Coverage

# Modo verbose para más detalles
.\run-tests.ps1 -Verbose

# Combinando opciones
.\run-tests.ps1 -Coverage -Verbose
```

### Ejecutar Tests Específicos

```powershell
# Solo tests del backend
.\run-tests.ps1 -TestType backend

# Solo tests del frontend
.\run-tests.ps1 -TestType frontend



# Frontend en modo watch (desarrollo)
.\run-tests.ps1 -TestType frontend -Watch
```

## 🐍 Tests del Backend (Django)

### Configuración

Los tests del backend utilizan **pytest** con las siguientes características:

- **Base de datos de test**: SQLite en memoria para velocidad
- **Fixtures**: Datos de prueba reutilizables
- **Mocking**: Para servicios externos y APIs
- **Cobertura**: Reportes HTML y terminal

### Estructura de Tests

#### `test_models.py` - Modelos de Datos
- ✅ Validación de modelos Django
- ✅ Relaciones entre entidades
- ✅ Métodos personalizados
- ✅ Constraints y validaciones
- ✅ Señales y hooks

#### `test_serializers.py` - Serializers de API
- ✅ Serialización de datos
- ✅ Validaciones de entrada
- ✅ Campos personalizados
- ✅ Métodos de transformación
- ✅ Relaciones anidadas

#### `test_views.py` - Vistas y Endpoints
- ✅ Endpoints de API REST
- ✅ Autenticación y permisos
- ✅ Filtrado y paginación
- ✅ Manejo de errores
- ✅ Respuestas HTTP

### Ejecutar Tests del Backend

```bash
# Desde el directorio test/backend
cd test/backend
python -m pytest . -v

# Con cobertura
python -m pytest . --cov=../../backend/apps --cov-report=html

# Test específico
python -m pytest test_models.py::TestSocioModel -v

# Usando el script principal
.\run-tests.ps1 -TestType backend
```

## ⚛️ Tests del Frontend (React)

### Configuración

Los tests del frontend utilizan **Vitest** con:

- **Testing Library**: Para testing de componentes React
- **jsdom**: Entorno de navegador simulado
- **MSW**: Mock Service Worker para APIs
- **Cobertura**: Reportes detallados

### Estructura de Tests

#### `basic.test.js` - Tests Básicos de JavaScript
- ✅ Funciones matemáticas básicas
- ✅ Manipulación de strings
- ✅ Operaciones con arrays
- ✅ Validaciones de datos

#### `simple.test.js` - Tests de Funcionalidad Simple
- ✅ Utilidades de formateo
- ✅ Validaciones de formularios
- ✅ Helpers de fecha y hora
- ✅ Funciones de cálculo

#### `react-basic.test.jsx` - Tests Básicos de React
- ✅ Renderizado de componentes
- ✅ Props y estado
- ✅ Eventos básicos
- ✅ Hooks fundamentales

#### `lucide.test.jsx` - Tests de Iconos Lucide
- ✅ Renderizado de iconos
- ✅ Props de iconos
- ✅ Tamaños y colores
- ✅ Accesibilidad

#### `dashboard-components.test.jsx` - Tests de Componentes del Dashboard
- ✅ Componentes de navegación
- ✅ Cards y widgets
- ✅ Tablas de datos
- ✅ Formularios básicos

### Ejecutar Tests del Frontend

```bash
# Desde el directorio test/frontend
cd test/frontend
npx vitest run

# Con cobertura
npx vitest run --coverage

# Modo watch
npx vitest

# Test específico
npx vitest run basic.test.js

# Usando el script principal
.\run-tests.ps1 -TestType frontend
```



## 📊 Reportes de Cobertura

### Backend
```bash
# Desde test/backend
cd test/backend
python -m pytest . --cov=../../backend/apps --cov-report=html

# Ver reporte
# Abrir: htmlcov/index.html
```

### Frontend
```bash
# Desde test/frontend
cd test/frontend
npx vitest run --coverage

# Ver reporte
# Abrir: coverage/index.html
```

## 🛠️ Configuración Avanzada

### Variables de Entorno para Tests

```bash
# Backend (.env.test)
DATABASE_URL=sqlite:///test.db
SECRET_KEY=test-secret-key
DEBUG=True
TESTING=True

# Frontend
NODE_ENV=test
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

### Configuración de CI/CD

```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16
      - name: Run Tests
        run: |
          cd test
          ./run-tests.ps1 -TestType all -Coverage
```

## 🐛 Debugging y Troubleshooting

### Problemas Comunes

#### Backend no responde
```bash
# Verificar que Django esté corriendo
curl http://127.0.0.1:8000/api/v1/

# Iniciar servidor
cd backend
python manage.py runserver
```

#### Tests del frontend fallan
```bash
# Limpiar cache de Vitest
npx vitest run --reporter=verbose

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

#### Base de datos de test corrupta
```bash
# Recrear migraciones
cd backend
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

### Logs y Debugging

```bash
# Backend con logs detallados
cd test/backend
python -m pytest . -v -s --log-cli-level=DEBUG

# Frontend con debugging
cd test/frontend
npx vitest run --reporter=verbose

# Frontend en modo watch con debugging
npx vitest --reporter=verbose
```

## 📈 Métricas y Objetivos

### Objetivos de Cobertura
- **Backend**: ≥ 90% cobertura de líneas
- **Frontend**: ≥ 85% cobertura de líneas

### Métricas Actuales
- ✅ **Tests Backend**: 85 tests pasando
- ✅ **Tests Frontend**: 19 tests pasando
- ✅ **Total**: 104 tests en la suite

## 🤝 Contribuir

### Agregar Nuevos Tests

1. **Backend**: Crear archivo en `test/backend/test_nuevo_modulo.py`
2. **Frontend**: Crear archivo en `test/frontend/nuevo_componente.test.jsx`

### Convenciones

- **Nombres**: Descriptivos y en español
- **Estructura**: Arrange → Act → Assert
- **Mocking**: Usar mocks para dependencias externas
- **Cleanup**: Siempre limpiar datos de test

### Ejemplo de Test

```javascript
// test/frontend/mi-componente.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('MiComponente', () => {
  it('debería renderizar correctamente', () => {
    // Arrange
    const titulo = 'Test'
    
    // Act
    render(<div>{titulo}</div>)
    
    // Assert
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
  
  it('debería mostrar el contenido esperado', () => {
    // Arrange & Act
    render(<h1>Mi Componente</h1>)
    
    // Assert
    expect(screen.getByRole('heading')).toHaveTextContent('Mi Componente')
  })
})
```

## 📞 Soporte

Para problemas con los tests:

1. **Revisar logs**: Usar modo verbose (`-Verbose`)
2. **Verificar dependencias**: Ejecutar `npm install` / `pip install -r requirements-test.txt`
3. **Limpiar cache**: Eliminar `node_modules`, `__pycache__`, etc.
4. **Documentación**: Consultar esta guía y comentarios en el código

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Mantenedor**: Sistema de Tests Automatizado
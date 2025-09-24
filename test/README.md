# 🧪 Test Suite - Sistema de Gestión de Gimnasio

Suite completa de pruebas para el sistema de gestión de gimnasio, incluyendo tests unitarios, de integración y end-to-end para garantizar la calidad y confiabilidad del software.

## 📋 Tabla de Contenidos

- [Visión General](#-visión-general)
- [Estructura de Tests](#-estructura-de-tests)
- [Tecnologías de Testing](#-tecnologías-de-testing)
- [Configuración](#-configuración)
- [Ejecución de Tests](#-ejecución-de-tests)
- [Tests del Backend](#-tests-del-backend)
- [Tests del Frontend](#-tests-del-frontend)
- [Tests de Integración](#-tests-de-integración)
- [Tests End-to-End](#-tests-end-to-end)
- [Cobertura de Código](#-cobertura-de-código)
- [Mejores Prácticas](#-mejores-prácticas)
- [CI/CD Integration](#-cicd-integration)
- [Troubleshooting](#-troubleshooting)

## 🎯 Visión General

Este directorio contiene todas las pruebas del sistema de gestión de gimnasio, organizadas por tipo y componente. El objetivo es mantener una cobertura de código superior al 80% y garantizar que todas las funcionalidades críticas estén probadas.

### Tipos de Tests Incluidos

- **🔧 Tests Unitarios**: Pruebas de componentes individuales
- **🔗 Tests de Integración**: Pruebas de interacción entre componentes
- **🌐 Tests End-to-End**: Pruebas de flujos completos de usuario
- **⚡ Tests de Performance**: Pruebas de rendimiento y carga
- **🔒 Tests de Seguridad**: Pruebas de vulnerabilidades y autenticación

## 📁 Estructura de Tests

```
test/
├── backend/                    # Tests del backend (Django)
│   ├── unit/                   # Tests unitarios
│   │   ├── test_models.py      # Tests de modelos
│   │   ├── test_views.py       # Tests de vistas
│   │   ├── test_serializers.py # Tests de serializadores
│   │   ├── test_services.py    # Tests de servicios
│   │   └── test_utils.py       # Tests de utilidades
│   ├── integration/            # Tests de integración
│   │   ├── test_api_endpoints.py # Tests de endpoints
│   │   ├── test_authentication.py # Tests de autenticación
│   │   ├── test_permissions.py # Tests de permisos
│   │   └── test_workflows.py   # Tests de flujos de trabajo
│   ├── fixtures/               # Datos de prueba
│   │   ├── users.json          # Usuarios de prueba
│   │   ├── socios.json         # Socios de prueba
│   │   ├── entrenadores.json   # Entrenadores de prueba
│   │   └── clases.json         # Clases de prueba
│   ├── factories/              # Factory Boy factories
│   │   ├── user_factory.py     # Factory de usuarios
│   │   ├── socio_factory.py    # Factory de socios
│   │   └── clase_factory.py    # Factory de clases
│   └── conftest.py             # Configuración de pytest
├── frontend/                   # Tests del frontend (React)
│   ├── unit/                   # Tests unitarios
│   │   ├── components/         # Tests de componentes
│   │   │   ├── SocioForm.test.jsx
│   │   │   ├── Dashboard.test.jsx
│   │   │   └── ClaseCalendar.test.jsx
│   │   ├── hooks/              # Tests de hooks
│   │   │   ├── useAuth.test.js
│   │   │   └── useApi.test.js
│   │   ├── services/           # Tests de servicios
│   │   │   ├── api.test.js
│   │   │   └── authService.test.js
│   │   └── utils/              # Tests de utilidades
│   │       ├── validators.test.js
│   │       └── formatters.test.js
│   ├── integration/            # Tests de integración
│   │   ├── user-flows/         # Flujos de usuario
│   │   │   ├── socio-registration.test.jsx
│   │   │   ├── clase-booking.test.jsx
│   │   │   └── payment-process.test.jsx
│   │   └── api-integration/    # Integración con API
│   │       ├── socios-api.test.js
│   │       └── auth-api.test.js
│   ├── mocks/                  # Mocks y stubs
│   │   ├── api-responses.js    # Respuestas de API mockeadas
│   │   ├── localStorage.js     # Mock de localStorage
│   │   └── router.js           # Mock de React Router
│   ├── setup/                  # Configuración de tests
│   │   ├── setupTests.js       # Setup global
│   │   ├── testUtils.jsx       # Utilidades de testing
│   │   └── mockProviders.jsx   # Providers mockeados
│   └── __snapshots__/          # Snapshots de componentes
├── e2e/                        # Tests end-to-end
│   ├── specs/                  # Especificaciones de tests
│   │   ├── auth.spec.js        # Tests de autenticación
│   │   ├── socios.spec.js      # Tests de gestión de socios
│   │   ├── clases.spec.js      # Tests de gestión de clases
│   │   ├── pagos.spec.js       # Tests de gestión de pagos
│   │   └── dashboard.spec.js   # Tests del dashboard
│   ├── fixtures/               # Datos para E2E
│   │   ├── test-data.json      # Datos de prueba
│   │   └── users.json          # Usuarios para E2E
│   ├── support/                # Comandos y utilidades
│   │   ├── commands.js         # Comandos personalizados
│   │   ├── helpers.js          # Funciones auxiliares
│   │   └── page-objects/       # Page Object Models
│   │       ├── LoginPage.js
│   │       ├── DashboardPage.js
│   │       └── SociosPage.js
│   └── screenshots/            # Screenshots de fallos
├── performance/                # Tests de performance
│   ├── load-tests/             # Tests de carga
│   │   ├── api-load.js         # Carga de API
│   │   └── frontend-load.js    # Carga de frontend
│   ├── stress-tests/           # Tests de estrés
│   └── benchmarks/             # Benchmarks
├── security/                   # Tests de seguridad
│   ├── auth-tests/             # Tests de autenticación
│   ├── injection-tests/        # Tests de inyección
│   └── xss-tests/              # Tests de XSS
├── reports/                    # Reportes de tests
│   ├── coverage/               # Reportes de cobertura
│   ├── junit/                  # Reportes JUnit
│   └── html/                   # Reportes HTML
├── docker/                     # Configuración Docker para tests
│   ├── Dockerfile.test         # Dockerfile para tests
│   └── docker-compose.test.yml # Compose para tests
├── scripts/                    # Scripts de testing
│   ├── run-all-tests.sh        # Ejecutar todos los tests
│   ├── setup-test-db.sh        # Configurar BD de prueba
│   ├── generate-coverage.sh    # Generar cobertura
│   └── cleanup-tests.sh        # Limpiar después de tests
├── .gitignore                  # Archivos ignorados
├── pytest.ini                 # Configuración de pytest
├── vitest.config.js            # Configuración de Vitest
├── playwright.config.js        # Configuración de Playwright
└── README.md                   # Este archivo
```

## 🛠️ Tecnologías de Testing

### Backend Testing (Django)
- **pytest 8.0+** - Framework principal de testing
- **pytest-django** - Integración con Django
- **pytest-cov** - Cobertura de código
- **factory-boy** - Generación de datos de prueba
- **pytest-mock** - Mocking avanzado
- **pytest-xdist** - Ejecución paralela
- **freezegun** - Manipulación de tiempo
- **responses** - Mock de requests HTTP

### Frontend Testing (React)
- **Vitest** - Framework de testing rápido
- **React Testing Library** - Testing de componentes
- **Jest DOM** - Matchers adicionales
- **MSW (Mock Service Worker)** - Mock de APIs
- **@testing-library/user-event** - Simulación de eventos
- **@testing-library/jest-dom** - Matchers para DOM

### End-to-End Testing
- **Playwright** - Automatización de navegadores
- **Cypress** (alternativo) - Testing E2E
- **Puppeteer** - Control de Chrome/Chromium

### Performance Testing
- **Artillery** - Tests de carga
- **Lighthouse CI** - Auditorías de performance
- **k6** - Tests de estrés

### Security Testing
- **Bandit** - Análisis de seguridad Python
- **Safety** - Vulnerabilidades en dependencias
- **OWASP ZAP** - Tests de seguridad web

## ⚙️ Configuración

### Prerrequisitos

```bash
# Backend
Python 3.11+
Django 5.1+
PostgreSQL 15+ (para tests de integración)

# Frontend
Node.js 18+
npm 8+ o pnpm 7+

# E2E
Chrome/Chromium
Firefox (opcional)
```

### Instalación de Dependencias

#### Backend
```bash
cd backend/
pip install -r requirements-test.txt

# O con poetry
poetry install --with test
```

#### Frontend
```bash
cd gymfront/
npm install

# Dependencias adicionales de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

#### E2E
```bash
cd test/
npm install playwright
npx playwright install
```

### Variables de Entorno para Tests

```bash
# test/.env.test
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/test_gym_db
DJANGO_SETTINGS_MODULE=gimnasio.settings.test
SECRET_KEY=test-secret-key-not-for-production
DEBUG=True
TESTING=True

# Frontend
VITE_API_BASE_URL=http://localhost:8000
VITE_TEST_MODE=true
```

### Configuración de Base de Datos de Prueba

```bash
# Crear BD de prueba
createdb test_gym_db

# Ejecutar migraciones
cd backend/
python manage.py migrate --settings=gimnasio.settings.test
```

## 🚀 Ejecución de Tests

### Scripts Principales

```bash
# Ejecutar todos los tests
./scripts/run-all-tests.sh

# Solo backend
./scripts/run-backend-tests.sh

# Solo frontend
./scripts/run-frontend-tests.sh

# Solo E2E
./scripts/run-e2e-tests.sh
```

### Tests del Backend

```bash
cd backend/

# Todos los tests
pytest

# Tests específicos
pytest test/backend/unit/test_models.py
pytest test/backend/integration/test_api_endpoints.py

# Con cobertura
pytest --cov=. --cov-report=html

# Tests paralelos
pytest -n auto

# Tests con marcadores
pytest -m "not slow"
pytest -m "integration"
```

### Tests del Frontend

```bash
cd gymfront/

# Todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Tests específicos
npm run test -- SocioForm.test.jsx

# Tests de integración
npm run test:integration
```

### Tests End-to-End

```bash
cd test/

# Todos los E2E
npx playwright test

# Tests específicos
npx playwright test auth.spec.js

# Con interfaz gráfica
npx playwright test --ui

# Solo Chrome
npx playwright test --project=chromium

# Modo debug
npx playwright test --debug
```

## 🔧 Tests del Backend

### Estructura de Tests Unitarios

```python
# test/backend/unit/test_models.py
import pytest
from django.core.exceptions import ValidationError
from core.models import Socio, Membresia
from test.backend.factories import SocioFactory, MembresiaFactory

class TestSocioModel:
    def test_socio_creation(self):
        """Test creación básica de socio"""
        socio = SocioFactory()
        assert socio.nombre
        assert socio.email
        assert str(socio) == f"{socio.nombre} {socio.apellido}"
    
    def test_socio_email_unique(self):
        """Test unicidad de email"""
        SocioFactory(email="test@example.com")
        with pytest.raises(ValidationError):
            SocioFactory(email="test@example.com")
    
    def test_socio_membresia_activa(self):
        """Test membresía activa"""
        socio = SocioFactory()
        membresia = MembresiaFactory(socio=socio, activa=True)
        assert socio.membresia_activa == membresia
```

### Tests de API

```python
# test/backend/integration/test_api_endpoints.py
import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from test.backend.factories import UserFactory, SocioFactory

User = get_user_model()

@pytest.mark.django_db
class TestSociosAPI:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
    
    def test_list_socios(self):
        """Test listar socios"""
        SocioFactory.create_batch(3)
        response = self.client.get('/api/socios/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 3
    
    def test_create_socio(self):
        """Test crear socio"""
        data = {
            'nombre': 'Juan',
            'apellido': 'Pérez',
            'email': 'juan@example.com',
            'telefono': '123456789'
        }
        response = self.client.post('/api/socios/', data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['nombre'] == 'Juan'
```

### Factories para Datos de Prueba

```python
# test/backend/factories/socio_factory.py
import factory
from django.contrib.auth import get_user_model
from core.models import Socio, Membresia

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')

class SocioFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Socio
    
    nombre = factory.Faker('first_name')
    apellido = factory.Faker('last_name')
    email = factory.Sequence(lambda n: f"socio{n}@example.com")
    telefono = factory.Faker('phone_number')
    fecha_nacimiento = factory.Faker('date_of_birth')
```

## ⚛️ Tests del Frontend

### Tests de Componentes

```javascript
// test/frontend/unit/components/SocioForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocioForm } from '../../../gymfront/src/components/forms/SocioForm'
import { TestProviders } from '../../setup/testUtils'

describe('SocioForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn()
  }

  const renderComponent = (props = {}) => {
    return render(
      <TestProviders>
        <SocioForm {...defaultProps} {...props} />
      </TestProviders>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders all form fields', () => {
    renderComponent()
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    renderComponent()
    
    const submitButton = screen.getByRole('button', { name: /guardar/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
    expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
  })

  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    renderComponent({ onSubmit: mockSubmit })
    
    await user.type(screen.getByLabelText(/nombre/i), 'Juan')
    await user.type(screen.getByLabelText(/apellido/i), 'Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    
    await user.click(screen.getByRole('button', { name: /guardar/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com'
      })
    })
  })
})
```

### Tests de Hooks

```javascript
// test/frontend/unit/hooks/useAuth.test.js
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../../../gymfront/src/hooks/useAuth'
import { AuthProvider } from '../../../gymfront/src/contexts/AuthContext'

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  test('initial state is unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  test('login updates authentication state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeTruthy()
  })
})
```

### Tests de Servicios

```javascript
// test/frontend/unit/services/api.test.js
import { vi } from 'vitest'
import axios from 'axios'
import { sociosService } from '../../../gymfront/src/services/sociosService'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('sociosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('getAll returns socios list', async () => {
    const mockSocios = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez' },
      { id: 2, nombre: 'María', apellido: 'García' }
    ]
    
    mockedAxios.get.mockResolvedValue({ data: { results: mockSocios } })
    
    const result = await sociosService.getAll()
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/socios/', { params: undefined })
    expect(result.data.results).toEqual(mockSocios)
  })

  test('create sends POST request', async () => {
    const newSocio = { nombre: 'Carlos', apellido: 'López' }
    const createdSocio = { id: 3, ...newSocio }
    
    mockedAxios.post.mockResolvedValue({ data: createdSocio })
    
    const result = await sociosService.create(newSocio)
    
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/socios/', newSocio)
    expect(result.data).toEqual(createdSocio)
  })
})
```

## 🌐 Tests End-to-End

### Configuración de Playwright

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'reports/junit/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  webServer: [
    {
      command: 'cd ../backend && python manage.py runserver 8000',
      port: 8000,
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'cd ../gymfront && npm run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI
    }
  ]
})
```

### Tests E2E de Autenticación

```javascript
// test/e2e/specs/auth.spec.js
import { test, expect } from '@playwright/test'
import { LoginPage } from '../support/page-objects/LoginPage'
import { DashboardPage } from '../support/page-objects/DashboardPage'

test.describe('Authentication', () => {
  let loginPage
  let dashboardPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)
    await loginPage.goto()
  })

  test('successful login redirects to dashboard', async () => {
    await loginPage.login('admin@example.com', 'password123')
    
    await expect(dashboardPage.welcomeMessage).toBeVisible()
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/)
  })

  test('invalid credentials show error message', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword')
    
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.errorMessage).toContainText('Credenciales inválidas')
  })

  test('logout clears session', async () => {
    await loginPage.login('admin@example.com', 'password123')
    await dashboardPage.logout()
    
    await expect(loginPage.page).toHaveURL(/.*login/)
  })
})
```

### Page Object Models

```javascript
// test/e2e/support/page-objects/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page
    this.emailInput = page.locator('[data-testid="email-input"]')
    this.passwordInput = page.locator('[data-testid="password-input"]')
    this.loginButton = page.locator('[data-testid="login-button"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email, password) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
```

## 📊 Cobertura de Código

### Configuración de Cobertura

```python
# pytest.ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = gimnasio.settings.test
python_files = tests.py test_*.py *_tests.py
addopts = 
    --cov=.
    --cov-report=html:reports/coverage/backend
    --cov-report=term-missing
    --cov-fail-under=80
    --strict-markers
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
```

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './reports/coverage/frontend',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Reportes de Cobertura

```bash
# Generar reporte completo
./scripts/generate-coverage.sh

# Ver reporte HTML
open reports/coverage/backend/index.html
open reports/coverage/frontend/index.html
```

## 📝 Mejores Prácticas

### Principios de Testing

1. **AAA Pattern**: Arrange, Act, Assert
2. **DRY**: Don't Repeat Yourself
3. **FIRST**: Fast, Independent, Repeatable, Self-validating, Timely
4. **Test Pyramid**: Más unitarios, menos E2E

### Convenciones de Naming

```python
# Backend
def test_should_create_socio_when_valid_data_provided():
    """Test descriptivo de lo que debe hacer"""
    pass

def test_should_raise_validation_error_when_email_is_duplicate():
    """Test de casos de error"""
    pass
```

```javascript
// Frontend
describe('SocioForm', () => {
  test('should render all required fields', () => {
    // Test implementation
  })

  test('should validate email format', () => {
    // Test implementation
  })
})
```

### Datos de Prueba

```python
# Usar factories en lugar de fixtures estáticas
socio = SocioFactory(
    nombre='Juan',
    email='juan@example.com'
)

# Evitar datos hardcodeados
# ❌ Malo
socio = Socio.objects.create(
    nombre='Juan Pérez',
    email='juan.perez@gmail.com'
)

# ✅ Bueno
socio = SocioFactory()
```

### Mocking Estratégico

```javascript
// Mock solo lo necesario
vi.mock('../services/api', () => ({
  sociosService: {
    getAll: vi.fn(),
    create: vi.fn()
  }
}))

// Evitar mocks excesivos que oculten bugs reales
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements-test.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest --cov=. --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd gymfront
          npm ci
      
      - name: Run tests
        run: |
          cd gymfront
          npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install Playwright
        run: |
          cd test
          npm ci
          npx playwright install
      
      - name: Run E2E tests
        run: |
          cd test
          npx playwright test
```

## 🔧 Troubleshooting

### Problemas Comunes

#### Tests Lentos
```bash
# Identificar tests lentos
pytest --durations=10

# Ejecutar solo tests rápidos
pytest -m "not slow"
```

#### Fallos Intermitentes
```bash
# Ejecutar test múltiples veces
pytest --count=10 test_flaky.py

# Usar seeds fijos para reproducibilidad
pytest --randomly-seed=12345
```

#### Problemas de Base de Datos
```bash
# Limpiar BD de prueba
python manage.py flush --settings=gimnasio.settings.test

# Recrear BD
dropdb test_gym_db && createdb test_gym_db
```

#### Problemas de Frontend
```bash
# Limpiar cache de Vitest
npx vitest --run --reporter=verbose --clearCache

# Verificar mocks
console.log(vi.mocked(apiService).getAll.mock.calls)
```

### Debugging Tests

```python
# Backend - usar pdb
import pdb; pdb.set_trace()

# O pytest con --pdb
pytest --pdb test_specific.py
```

```javascript
// Frontend - usar debugger
test('debug test', () => {
  debugger
  // test code
})

// O con console.log estratégico
console.log('State:', component.debug())
```

## 📞 Soporte y Recursos

### Documentación Adicional
- [Pytest Documentation](https://docs.pytest.org/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)

### Scripts Útiles
```bash
# Ver todos los scripts disponibles
ls -la scripts/

# Ayuda de scripts específicos
./scripts/run-all-tests.sh --help
```

### Contacto
Para problemas con tests o mejoras en la suite de pruebas, crear un issue en el repositorio con la etiqueta `testing`.

---

⚡ **Recuerda**: Los tests son código de producción. Manténlos limpios, legibles y actualizados.
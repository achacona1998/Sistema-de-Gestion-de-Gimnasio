import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender expect con matchers de testing-library
expect.extend(matchers);

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn()
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn()
}));

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock de window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
});

// Mock de window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn()
  }
});

// Mock de console.error para tests más limpios
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Configuración global para fetch mock
global.fetch = vi.fn();

// Helper para resetear mocks
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()]
  };
});

// Mock de servicios comunes
vi.mock('../../../gymfront/src/services/authService', () => ({
  default: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    verifyToken: vi.fn(),
    refreshToken: vi.fn(),
    changePassword: vi.fn(),
    requestPasswordReset: vi.fn()
  }
}));

vi.mock('../../../gymfront/src/services/sociosService', () => ({
  default: {
    getSocios: vi.fn(),
    getSocio: vi.fn(),
    createSocio: vi.fn(),
    updateSocio: vi.fn(),
    deleteSocio: vi.fn(),
    searchSocios: vi.fn(),
    getSociosStats: vi.fn(),
    exportSocios: vi.fn()
  }
}));

// Configuración de variables de entorno para tests
process.env.VITE_API_URL = 'http://localhost:8000';
process.env.NODE_ENV = 'test';

// Helper functions para tests
global.createMockUser = () => ({
  id: 1,
  email: 'test@test.com',
  first_name: 'Test',
  last_name: 'User',
  is_active: true,
  date_joined: '2024-01-01T00:00:00Z'
});

global.createMockSocio = (overrides = {}) => ({
  socio_id: 1,
  nombre: 'Juan Pérez',
  telefono: '123456789',
  correo: 'juan@test.com',
  direccion: 'Calle Test 123',
  fecha_nacimiento: '1990-05-15',
  fecha_registro: '2024-01-01',
  membresia: 'Básica',
  estado: 'Activo',
  ...overrides
});

global.createMockMembresia = (overrides = {}) => ({
  id: 1,
  nombre: 'Básica',
  precio: 50.00,
  duracion_dias: 30,
  descripcion: 'Membresía básica',
  activa: true,
  ...overrides
});

// Mock de notificaciones del navegador
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    close: vi.fn()
  }))
});

Object.defineProperty(Notification, 'permission', {
  writable: true,
  value: 'granted'
});

Object.defineProperty(Notification, 'requestPermission', {
  writable: true,
  value: vi.fn().mockResolvedValue('granted')
});

// Mock de localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn()
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn()
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Configuración para tests de componentes con contextos
export const renderWithProviders = (ui, options = {}) => {
  const {
    initialEntries = ['/'],
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Exportar helpers comunes
export {
  localStorageMock,
  sessionStorageMock
};
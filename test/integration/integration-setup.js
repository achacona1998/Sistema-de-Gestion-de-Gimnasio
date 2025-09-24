import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';

// Configuración global para tests de integración
const API_BASE_URL = 'http://127.0.0.1:8000';
const FRONTEND_URL = 'http://localhost:5173';

// Variables globales para los tests
global.API_BASE_URL = API_BASE_URL;
global.FRONTEND_URL = FRONTEND_URL;

// Configuración de axios para tests
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000;

// Helper para esperar que los servidores estén listos
const waitForServer = async (url, maxAttempts = 30, delay = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(url);
      return true;
    } catch (error) {
      if (i === maxAttempts - 1) {
        throw new Error(`Server at ${url} is not responding after ${maxAttempts} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Helper para autenticación en tests
const authenticateUser = async (credentials = { email: 'test@test.com', password: 'testpass123' }) => {
  try {
    const response = await axios.post('/api/auth/login/', credentials);
    const { access, refresh } = response.data;
    
    // Configurar headers de autorización
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    return { access, refresh, user: response.data.user };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

// Helper para crear usuario de prueba
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: 'test@test.com',
    password: 'testpass123',
    first_name: 'Test',
    last_name: 'User'
  };
  
  const user = { ...defaultUser, ...userData };
  
  try {
    const response = await axios.post('/api/auth/register/', user);
    return response.data;
  } catch (error) {
    // Si el usuario ya existe, intentar hacer login
    if (error.response?.status === 400) {
      return await authenticateUser({ email: user.email, password: user.password });
    }
    throw error;
  }
};

// Helper para limpiar datos de prueba
const cleanupTestData = async () => {
  try {
    // Limpiar socios de prueba
    const sociosResponse = await axios.get('/api/socios/');
    const testSocios = sociosResponse.data.results?.filter(socio => 
      socio.correo?.includes('test') || socio.nombre?.includes('Test')
    ) || [];
    
    for (const socio of testSocios) {
      try {
        await axios.delete(`/api/socios/${socio.socio_id}/`);
      } catch (error) {
        console.warn(`Failed to delete test socio ${socio.socio_id}:`, error.message);
      }
    }
    
    // Limpiar membresías de prueba
    const membresiasResponse = await axios.get('/api/membresias/');
    const testMembresias = membresiasResponse.data.results?.filter(membresia => 
      membresia.nombre?.includes('Test')
    ) || [];
    
    for (const membresia of testMembresias) {
      try {
        await axios.delete(`/api/membresias/${membresia.id}/`);
      } catch (error) {
        console.warn(`Failed to delete test membresia ${membresia.id}:`, error.message);
      }
    }
    
  } catch (error) {
    console.warn('Cleanup failed:', error.message);
  }
};

// Helper para verificar estado de la base de datos
const checkDatabaseConnection = async () => {
  try {
    await axios.get('/api/health/');
    return true;
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    return false;
  }
};

// Configuración antes de todos los tests
beforeAll(async () => {
  console.log('🚀 Iniciando configuración de tests de integración...');
  
  // Verificar que el backend esté corriendo
  try {
    await waitForServer(`${API_BASE_URL}/api/health/`);
    console.log('✅ Backend server is ready');
  } catch (error) {
    console.error('❌ Backend server is not available:', error.message);
    throw error;
  }
  
  // Verificar conexión a la base de datos
  const dbConnected = await checkDatabaseConnection();
  if (!dbConnected) {
    throw new Error('Database connection failed');
  }
  console.log('✅ Database connection verified');
  
  // Crear usuario de prueba
  try {
    await createTestUser();
    console.log('✅ Test user created/verified');
  } catch (error) {
    console.error('❌ Failed to create test user:', error.message);
    throw error;
  }
}, 60000);

// Configuración después de todos los tests
afterAll(async () => {
  console.log('🧹 Limpiando después de todos los tests...');
  
  // Limpiar datos de prueba
  await cleanupTestData();
  
  // Limpiar headers de autorización
  delete axios.defaults.headers.common['Authorization'];
  
  console.log('✅ Cleanup completed');
}, 30000);

// Configuración antes de cada test
beforeEach(async () => {
  // Limpiar mocks
  vi.clearAllMocks();
  
  // Autenticar usuario para cada test
  try {
    await authenticateUser();
  } catch (error) {
    console.warn('Authentication failed in beforeEach:', error.message);
  }
});

// Configuración después de cada test
afterEach(async () => {
  // Limpiar datos específicos del test si es necesario
  // Esto se puede personalizar por test
});

// Exportar helpers para uso en tests
export {
  API_BASE_URL,
  FRONTEND_URL,
  waitForServer,
  authenticateUser,
  createTestUser,
  cleanupTestData,
  checkDatabaseConnection
};

// Configuración de manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Mock de console para tests más limpios
const originalConsole = { ...console };
beforeAll(() => {
  // Silenciar logs innecesarios durante tests
  console.log = vi.fn();
  console.info = vi.fn();
  console.debug = vi.fn();
});

afterAll(() => {
  // Restaurar console original
  Object.assign(console, originalConsole);
});

// Configuración de variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.API_BASE_URL = API_BASE_URL;
process.env.FRONTEND_URL = FRONTEND_URL;

console.log('🔧 Integration test setup completed');
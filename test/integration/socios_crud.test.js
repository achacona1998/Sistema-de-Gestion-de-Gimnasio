import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import axios from 'axios';

// Configuración de la API base
const API_BASE_URL = 'http://127.0.0.1:8000';
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Variables globales para los tests
let authToken = null;
let testSocioId = null;
let createdSocioIds = [];

const testUser = {
  email: 'socios_test@test.com',
  password: 'testpassword123',
  first_name: 'Socios',
  last_name: 'Test'
};

const testSocio = {
  nombre: 'Juan Pérez Test',
  telefono: '123456789',
  correo: 'juan.test@example.com',
  direccion: 'Calle Test 123',
  fecha_nacimiento: '1990-05-15'
};

describe('Integration Tests - Socios CRUD Operations', () => {
  beforeAll(async () => {
    // Verificar que el servidor backend esté corriendo
    try {
      await api.get('/api/v1/');
    } catch (error) {
      throw new Error('Backend server is not running. Please start the Django server.');
    }

    // Crear usuario de prueba y obtener token
    try {
      await api.post('/auth/users/', testUser);
    } catch (error) {
      // Usuario ya existe, continuar
    }

    const loginResponse = await api.post('/auth/jwt/create/', {
      email: testUser.email,
      password: testUser.password
    });
    
    authToken = loginResponse.data.access;
  });

  afterAll(async () => {
    // Limpiar: eliminar todos los socios de prueba creados
    for (const socioId of createdSocioIds) {
      try {
        await api.delete(`/api/v1/socios/${socioId}/`, {
          headers: {
            'Authorization': `JWT ${authToken}`
          }
        });
      } catch (error) {
        console.warn(`Could not clean up socio ${socioId}:`, error.message);
      }
    }

    // Limpiar usuario de prueba
    try {
      await api.delete('/auth/users/me/', {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
    } catch (error) {
      console.warn('Could not clean up test user:', error.message);
    }
  });

  beforeEach(() => {
    testSocioId = null;
  });

  describe('Create Socio (POST)', () => {
    it('should create a new socio successfully', async () => {
      const response = await api.post('/api/v1/socios/', testSocio, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('socio_id');
      expect(response.data.nombre).toBe(testSocio.nombre);
      expect(response.data.telefono).toBe(testSocio.telefono);
      expect(response.data.correo).toBe(testSocio.correo);
      expect(response.data.direccion).toBe(testSocio.direccion);
      expect(response.data.fecha_nacimiento).toBe(testSocio.fecha_nacimiento);
      expect(response.data).toHaveProperty('fecha_registro');
      
      testSocioId = response.data.socio_id;
      createdSocioIds.push(testSocioId);
    });

    it('should validate required fields', async () => {
      const invalidSocio = {
        nombre: '', // Campo requerido vacío
        telefono: '123', // Muy corto
        correo: 'invalid-email' // Email inválido
      };

      try {
        await api.post('/api/v1/socios/', invalidSocio, {
          headers: {
            'Authorization': `JWT ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('nombre');
        expect(error.response.data).toHaveProperty('correo');
      }
    });

    it('should not allow duplicate email', async () => {
      // Crear primer socio
      const firstSocio = {
        ...testSocio,
        correo: 'duplicate@test.com'
      };
      
      const firstResponse = await api.post('/api/v1/socios/', firstSocio, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      createdSocioIds.push(firstResponse.data.socio_id);

      // Intentar crear segundo socio con el mismo email
      const duplicateSocio = {
        ...testSocio,
        nombre: 'Otro Nombre',
        correo: 'duplicate@test.com' // Mismo email
      };

      try {
        await api.post('/api/v1/socios/', duplicateSocio, {
          headers: {
            'Authorization': `JWT ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        expect.fail('Should have rejected duplicate email');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('correo');
      }
    });

    it('should reject request without authentication', async () => {
      try {
        await api.post('/api/v1/socios/', testSocio);
        expect.fail('Should have rejected unauthenticated request');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Read Socios (GET)', () => {
    beforeEach(async () => {
      // Crear un socio para las pruebas de lectura
      const response = await api.post('/api/v1/socios/', {
        ...testSocio,
        correo: `read_test_${Date.now()}@test.com`
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      testSocioId = response.data.socio_id;
      createdSocioIds.push(testSocioId);
    });

    it('should get list of socios', async () => {
      const response = await api.get('/api/v1/socios/', {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('results');
      expect(response.data).toHaveProperty('count');
      expect(Array.isArray(response.data.results)).toBe(true);
      expect(response.data.count).toBeGreaterThan(0);
      
      // Verificar que nuestro socio de prueba está en la lista
      const ourSocio = response.data.results.find(s => s.socio_id === testSocioId);
      expect(ourSocio).toBeDefined();
      expect(ourSocio.nombre).toBe(testSocio.nombre);
    });

    it('should get specific socio by ID', async () => {
      const response = await api.get(`/api/v1/socios/${testSocioId}/`, {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data.socio_id).toBe(testSocioId);
      expect(response.data.nombre).toBe(testSocio.nombre);
      expect(response.data.telefono).toBe(testSocio.telefono);
      expect(response.data.correo).toContain('read_test_');
    });

    it('should return 404 for non-existent socio', async () => {
      try {
        await api.get('/api/v1/socios/99999/', {
          headers: {
            'Authorization': `JWT ${authToken}`
          }
        });
        expect.fail('Should have returned 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('should support pagination', async () => {
      const response = await api.get('/api/v1/socios/?page=1&page_size=5', {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('results');
      expect(response.data).toHaveProperty('count');
      expect(response.data).toHaveProperty('next');
      expect(response.data).toHaveProperty('previous');
      expect(response.data.results.length).toBeLessThanOrEqual(5);
    });

    it('should support search functionality', async () => {
      const searchTerm = testSocio.nombre.split(' ')[0]; // Buscar por primer nombre
      
      const response = await api.get(`/api/v1/socios/?search=${searchTerm}`, {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('results');
      
      // Verificar que los resultados contienen el término de búsqueda
      response.data.results.forEach(socio => {
        expect(
          socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          socio.correo.toLowerCase().includes(searchTerm.toLowerCase())
        ).toBe(true);
      });
    });

    it('should reject request without authentication', async () => {
      try {
        await api.get('/api/v1/socios/');
        expect.fail('Should have rejected unauthenticated request');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Update Socio (PUT/PATCH)', () => {
    beforeEach(async () => {
      // Crear un socio para las pruebas de actualización
      const response = await api.post('/api/v1/socios/', {
        ...testSocio,
        correo: `update_test_${Date.now()}@test.com`
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      testSocioId = response.data.socio_id;
      createdSocioIds.push(testSocioId);
    });

    it('should update socio with PATCH (partial update)', async () => {
      const updateData = {
        nombre: 'Juan Pérez Actualizado',
        telefono: '987654321'
      };
      
      const response = await api.patch(`/api/v1/socios/${testSocioId}/`, updateData, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data.socio_id).toBe(testSocioId);
      expect(response.data.nombre).toBe(updateData.nombre);
      expect(response.data.telefono).toBe(updateData.telefono);
      expect(response.data.correo).toContain('update_test_'); // No debería cambiar
      expect(response.data.direccion).toBe(testSocio.direccion); // No debería cambiar
    });

    it('should update socio with PUT (full update)', async () => {
      const fullUpdateData = {
        nombre: 'María García Completa',
        telefono: '555666777',
        correo: `full_update_${Date.now()}@test.com`,
        direccion: 'Nueva Dirección 456',
        fecha_nacimiento: '1985-08-20'
      };
      
      const response = await api.put(`/api/v1/socios/${testSocioId}/`, fullUpdateData, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data.socio_id).toBe(testSocioId);
      expect(response.data.nombre).toBe(fullUpdateData.nombre);
      expect(response.data.telefono).toBe(fullUpdateData.telefono);
      expect(response.data.correo).toBe(fullUpdateData.correo);
      expect(response.data.direccion).toBe(fullUpdateData.direccion);
      expect(response.data.fecha_nacimiento).toBe(fullUpdateData.fecha_nacimiento);
    });

    it('should validate update data', async () => {
      const invalidUpdateData = {
        nombre: '', // Campo requerido vacío
        correo: 'invalid-email' // Email inválido
      };
      
      try {
        await api.patch(`/api/v1/socios/${testSocioId}/`, invalidUpdateData, {
          headers: {
            'Authorization': `JWT ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('nombre');
        expect(error.response.data).toHaveProperty('correo');
      }
    });

    it('should return 404 for non-existent socio update', async () => {
      try {
        await api.patch('/api/v1/socios/99999/', { nombre: 'Test' }, {
          headers: {
            'Authorization': `JWT ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
        expect.fail('Should have returned 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('should reject update without authentication', async () => {
      try {
        await api.patch(`/api/v1/socios/${testSocioId}/`, { nombre: 'Test' });
        expect.fail('Should have rejected unauthenticated request');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Delete Socio (DELETE)', () => {
    let socioToDelete = null;

    beforeEach(async () => {
      // Crear un socio específicamente para eliminar
      const response = await api.post('/api/v1/socios/', {
        ...testSocio,
        correo: `delete_test_${Date.now()}@test.com`
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      socioToDelete = response.data.socio_id;
    });

    it('should delete socio successfully', async () => {
      const response = await api.delete(`/api/v1/socios/${socioToDelete}/`, {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(response.status).toBe(204);
      
      // Verificar que el socio ya no existe
      try {
        await api.get(`/api/v1/socios/${socioToDelete}/`, {
          headers: {
            'Authorization': `JWT ${authToken}`
          }
        });
        expect.fail('Socio should have been deleted');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('should return 404 for non-existent socio deletion', async () => {
      try {
        await api.delete('/api/v1/socios/99999/', {
          headers: {
            'Authorization': `JWT ${authToken}`
          }
        });
        expect.fail('Should have returned 404');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it('should reject deletion without authentication', async () => {
      try {
        await api.delete(`/api/v1/socios/${socioToDelete}/`);
        expect.fail('Should have rejected unauthenticated request');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Complete CRUD Flow', () => {
    it('should complete full CRUD cycle', async () => {
      const uniqueEmail = `crud_flow_${Date.now()}@test.com`;
      
      // 1. CREATE
      const createResponse = await api.post('/api/v1/socios/', {
        ...testSocio,
        correo: uniqueEmail
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      expect(createResponse.status).toBe(201);
      const socioId = createResponse.data.socio_id;
      
      // 2. READ
      const readResponse = await api.get(`/api/v1/socios/${socioId}/`, {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(readResponse.status).toBe(200);
      expect(readResponse.data.correo).toBe(uniqueEmail);
      
      // 3. UPDATE
      const updateResponse = await api.patch(`/api/v1/socios/${socioId}/`, {
        nombre: 'Nombre Actualizado CRUD'
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.nombre).toBe('Nombre Actualizado CRUD');
      
      // 4. DELETE
      const deleteResponse = await api.delete(`/api/v1/socios/${socioId}/`, {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(deleteResponse.status).toBe(204);
      
      // 5. VERIFY DELETION
      try {
        await api.get(`/api/v1/socios/${socioId}/`, {
          headers: {
            'Authorization': `JWT ${authToken}`
          }
        });
        expect.fail('Socio should have been deleted');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const uniqueEmail = `consistency_${Date.now()}@test.com`;
      
      // Crear socio
      const createResponse = await api.post('/api/v1/socios/', {
        ...testSocio,
        correo: uniqueEmail
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const socioId = createResponse.data.socio_id;
      createdSocioIds.push(socioId);
      
      // Verificar que aparece en la lista
      const listResponse = await api.get('/api/v1/socios/', {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      const socioInList = listResponse.data.results.find(s => s.socio_id === socioId);
      expect(socioInList).toBeDefined();
      expect(socioInList.correo).toBe(uniqueEmail);
      
      // Actualizar y verificar consistencia
      await api.patch(`/api/v1/socios/${socioId}/`, {
        nombre: 'Nombre Consistencia'
      }, {
        headers: {
          'Authorization': `JWT ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Verificar que el cambio se refleja en GET individual
      const updatedResponse = await api.get(`/api/v1/socios/${socioId}/`, {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      expect(updatedResponse.data.nombre).toBe('Nombre Consistencia');
      
      // Verificar que el cambio se refleja en la lista
      const updatedListResponse = await api.get('/api/v1/socios/', {
        headers: {
          'Authorization': `JWT ${authToken}`
        }
      });
      
      const updatedSocioInList = updatedListResponse.data.results.find(s => s.socio_id === socioId);
      expect(updatedSocioInList.nombre).toBe('Nombre Consistencia');
    });
  });
});
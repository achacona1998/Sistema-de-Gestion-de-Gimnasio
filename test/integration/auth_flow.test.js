import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import axios from 'axios';

// Configuración de la API base
const API_BASE_URL = 'http://127.0.0.1:8000';
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Variables globales para los tests
let testUser = {
  email: 'integration_test@test.com',
  password: 'testpassword123',
  first_name: 'Integration',
  last_name: 'Test'
};

let authTokens = {
  access: null,
  refresh: null
};

describe('Integration Tests - Authentication Flow', () => {
  beforeAll(async () => {
    // Verificar que el servidor backend esté corriendo
    try {
      await api.get('/api/v1/');
    } catch (error) {
      throw new Error('Backend server is not running. Please start the Django server.');
    }
  });

  afterAll(async () => {
    // Limpiar: eliminar usuario de prueba si existe
    if (authTokens.access) {
      try {
        await api.delete('/auth/users/me/', {
          headers: {
            'Authorization': `JWT ${authTokens.access}`
          }
        });
      } catch (error) {
        // Ignorar errores de limpieza
        console.warn('Could not clean up test user:', error.message);
      }
    }
  });

  beforeEach(() => {
    // Limpiar tokens antes de cada test
    authTokens.access = null;
    authTokens.refresh = null;
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const response = await api.post('/auth/users/', testUser);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.email).toBe(testUser.email);
      expect(response.data.first_name).toBe(testUser.first_name);
      expect(response.data.last_name).toBe(testUser.last_name);
      expect(response.data).not.toHaveProperty('password');
    });

    it('should not allow duplicate email registration', async () => {
      // Intentar registrar el mismo usuario otra vez
      try {
        await api.post('/auth/users/', testUser);
        expect.fail('Should have thrown an error for duplicate email');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('email');
      }
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123', // Too short
        first_name: '',
        last_name: ''
      };

      try {
        await api.post('/auth/users/', invalidUser);
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('email');
        expect(error.response.data).toHaveProperty('password');
      }
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password
      };

      const response = await api.post('/auth/jwt/create/', loginData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('access');
      expect(response.data).toHaveProperty('refresh');
      expect(typeof response.data.access).toBe('string');
      expect(typeof response.data.refresh).toBe('string');
      
      // Guardar tokens para otros tests
      authTokens.access = response.data.access;
      authTokens.refresh = response.data.refresh;
    });

    it('should reject invalid credentials', async () => {
      const invalidLogin = {
        email: testUser.email,
        password: 'wrongpassword'
      };

      try {
        await api.post('/auth/jwt/create/', invalidLogin);
        expect.fail('Should have rejected invalid credentials');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('detail');
      }
    });

    it('should reject non-existent user', async () => {
      const nonExistentLogin = {
        email: 'nonexistent@test.com',
        password: 'password123'
      };

      try {
        await api.post('/auth/jwt/create/', nonExistentLogin);
        expect.fail('Should have rejected non-existent user');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Token Verification', () => {
    beforeEach(async () => {
      // Login para obtener tokens frescos
      const loginResponse = await api.post('/auth/jwt/create/', {
        email: testUser.email,
        password: testUser.password
      });
      authTokens.access = loginResponse.data.access;
      authTokens.refresh = loginResponse.data.refresh;
    });

    it('should verify valid access token', async () => {
      const response = await api.post('/auth/jwt/verify/', {
        token: authTokens.access
      });
      
      expect(response.status).toBe(200);
    });

    it('should reject invalid access token', async () => {
      try {
        await api.post('/auth/jwt/verify/', {
          token: 'invalid.token.here'
        });
        expect.fail('Should have rejected invalid token');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should get user info with valid token', async () => {
      const response = await api.get('/auth/users/me/', {
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe(testUser.email);
      expect(response.data.first_name).toBe(testUser.first_name);
      expect(response.data.last_name).toBe(testUser.last_name);
    });

    it('should reject requests without token', async () => {
      try {
        await api.get('/auth/users/me/');
        expect.fail('Should have rejected request without token');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Token Refresh', () => {
    beforeEach(async () => {
      // Login para obtener tokens frescos
      const loginResponse = await api.post('/auth/jwt/create/', {
        email: testUser.email,
        password: testUser.password
      });
      authTokens.access = loginResponse.data.access;
      authTokens.refresh = loginResponse.data.refresh;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await api.post('/auth/jwt/refresh/', {
        refresh: authTokens.refresh
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('access');
      expect(typeof response.data.access).toBe('string');
      expect(response.data.access).not.toBe(authTokens.access);
    });

    it('should reject invalid refresh token', async () => {
      try {
        await api.post('/auth/jwt/refresh/', {
          refresh: 'invalid.refresh.token'
        });
        expect.fail('Should have rejected invalid refresh token');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Protected API Access', () => {
    beforeEach(async () => {
      // Login para obtener tokens frescos
      const loginResponse = await api.post('/auth/jwt/create/', {
        email: testUser.email,
        password: testUser.password
      });
      authTokens.access = loginResponse.data.access;
      authTokens.refresh = loginResponse.data.refresh;
    });

    it('should access protected socios endpoint with valid token', async () => {
      const response = await api.get('/api/v1/socios/', {
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('results');
      expect(Array.isArray(response.data.results)).toBe(true);
    });

    it('should access protected membresias endpoint with valid token', async () => {
      const response = await api.get('/api/v1/membresias/', {
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('results');
      expect(Array.isArray(response.data.results)).toBe(true);
    });

    it('should reject access to protected endpoints without token', async () => {
      try {
        await api.get('/api/v1/socios/');
        expect.fail('Should have rejected access without token');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    it('should reject access with invalid token', async () => {
      try {
        await api.get('/api/v1/socios/', {
          headers: {
            'Authorization': 'JWT invalid.token.here'
          }
        });
        expect.fail('Should have rejected access with invalid token');
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Complete Authentication Flow', () => {
    it('should complete full auth flow: register -> login -> access protected resource -> refresh token', async () => {
      // 1. Registrar nuevo usuario para este test
      const uniqueUser = {
        email: `flow_test_${Date.now()}@test.com`,
        password: 'flowtest123',
        first_name: 'Flow',
        last_name: 'Test'
      };

      const registerResponse = await api.post('/auth/users/', uniqueUser);
      expect(registerResponse.status).toBe(201);

      // 2. Login con el nuevo usuario
      const loginResponse = await api.post('/auth/jwt/create/', {
        email: uniqueUser.email,
        password: uniqueUser.password
      });
      expect(loginResponse.status).toBe(200);
      
      const tokens = loginResponse.data;
      expect(tokens).toHaveProperty('access');
      expect(tokens).toHaveProperty('refresh');

      // 3. Acceder a recurso protegido
      const protectedResponse = await api.get('/api/v1/socios/', {
        headers: {
          'Authorization': `JWT ${tokens.access}`
        }
      });
      expect(protectedResponse.status).toBe(200);

      // 4. Refrescar token
      const refreshResponse = await api.post('/auth/jwt/refresh/', {
        refresh: tokens.refresh
      });
      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.data).toHaveProperty('access');

      // 5. Usar nuevo token para acceder a recurso protegido
      const newTokenResponse = await api.get('/api/v1/socios/', {
        headers: {
          'Authorization': `JWT ${refreshResponse.data.access}`
        }
      });
      expect(newTokenResponse.status).toBe(200);

      // Limpiar: eliminar usuario de prueba
      try {
        await api.delete('/auth/users/me/', {
          headers: {
            'Authorization': `JWT ${refreshResponse.data.access}`
          }
        });
      } catch (error) {
        console.warn('Could not clean up flow test user:', error.message);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle network timeouts gracefully', async () => {
      const slowApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 1 // 1ms timeout to force timeout
      });

      try {
        await slowApi.get('/api/v1/socios/');
        expect.fail('Should have timed out');
      } catch (error) {
        expect(error.code).toBe('ECONNABORTED');
      }
    });

    it('should handle malformed JSON responses', async () => {
      // Este test simula una respuesta malformada del servidor
      // En un entorno real, esto podría ocurrir durante problemas del servidor
      try {
        await api.post('/auth/jwt/create/', 'invalid json');
        expect.fail('Should have failed with malformed request');
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('Rate Limiting and Security', () => {
    it('should handle multiple rapid login attempts', async () => {
      const loginAttempts = [];
      
      // Intentar múltiples logins rápidos
      for (let i = 0; i < 5; i++) {
        loginAttempts.push(
          api.post('/auth/jwt/create/', {
            email: testUser.email,
            password: testUser.password
          })
        );
      }

      const results = await Promise.allSettled(loginAttempts);
      
      // Todos deberían ser exitosos (no hay rate limiting configurado en desarrollo)
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          expect(result.value.status).toBe(200);
        }
      });
    });

    it('should validate JWT token format', async () => {
      const invalidTokenFormats = [
        'Bearer invalid-token',
        'JWT',
        'JWT ',
        'invalid-format',
        ''
      ];

      for (const invalidToken of invalidTokenFormats) {
        try {
          await api.get('/api/v1/socios/', {
            headers: {
              'Authorization': invalidToken
            }
          });
          expect.fail(`Should have rejected token format: ${invalidToken}`);
        } catch (error) {
          expect(error.response.status).toBe(401);
        }
      }
    });
  });
});
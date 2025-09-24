import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import authService from '../../../gymfront/src/services/authService';

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
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock de fetch
global.fetch = vi.fn();

// Mock de window.location
delete window.location;
window.location = { href: '', assign: vi.fn() };

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('realiza login exitoso y guarda tokens', async () => {
      const mockResponse = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const credentials = {
        email: 'test@test.com',
        password: 'password123'
      };

      const result = await authService.login(credentials);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/auth/jwt/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'mock-access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'mock-refresh-token');
      expect(result).toEqual(mockResponse);
    });

    it('maneja errores de login correctamente', async () => {
      const mockError = {
        detail: 'Credenciales inválidas'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockError
      });

      const credentials = {
        email: 'test@test.com',
        password: 'wrongpassword'
      };

      await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('maneja errores de red', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const credentials = {
        email: 'test@test.com',
        password: 'password123'
      };

      await expect(authService.login(credentials)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('realiza registro exitoso', async () => {
      const mockResponse = {
        id: 1,
        email: 'newuser@test.com',
        first_name: 'New',
        last_name: 'User'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const userData = {
        email: 'newuser@test.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'User'
      };

      const result = await authService.register(userData);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/auth/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      expect(result).toEqual(mockResponse);
    });

    it('maneja errores de registro', async () => {
      const mockError = {
        email: ['Este email ya está en uso']
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError
      });

      const userData = {
        email: 'existing@test.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User'
      };

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('elimina tokens del localStorage', () => {
      localStorageMock.setItem('access_token', 'mock-token');
      localStorageMock.setItem('refresh_token', 'mock-refresh');

      authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    });

    it('redirige a la página de login', () => {
      authService.logout();
      expect(window.location.href).toBe('/login');
    });
  });

  describe('verifyToken', () => {
    it('verifica token válido exitosamente', async () => {
      const mockUserData = {
        id: 1,
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User'
      };

      localStorageMock.setItem('access_token', 'valid-token');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      });

      const result = await authService.verifyToken();

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/auth/users/me/', {
        method: 'GET',
        headers: {
          'Authorization': 'JWT valid-token',
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockUserData);
    });

    it('intenta renovar token cuando el access token es inválido', async () => {
      localStorageMock.setItem('access_token', 'invalid-token');
      localStorageMock.setItem('refresh_token', 'valid-refresh');

      // Primera llamada falla (token inválido)
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      // Segunda llamada para renovar token
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access: 'new-access-token' })
      });

      // Tercera llamada con nuevo token
      const mockUserData = {
        id: 1,
        email: 'test@test.com'
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUserData
      });

      const result = await authService.verifyToken();

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'new-access-token');
      expect(result).toEqual(mockUserData);
    });

    it('hace logout cuando no se puede renovar el token', async () => {
      localStorageMock.setItem('access_token', 'invalid-token');
      localStorageMock.setItem('refresh_token', 'invalid-refresh');

      // Primera llamada falla (token inválido)
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      // Segunda llamada para renovar token también falla
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      await expect(authService.verifyToken()).rejects.toThrow();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    });

    it('retorna null cuando no hay token', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = await authService.verifyToken();

      expect(result).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('renueva token exitosamente', async () => {
      const mockResponse = {
        access: 'new-access-token'
      };

      localStorageMock.setItem('refresh_token', 'valid-refresh');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await authService.refreshToken();

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/auth/jwt/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: 'valid-refresh' })
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'new-access-token');
      expect(result).toEqual(mockResponse);
    });

    it('maneja errores de renovación', async () => {
      localStorageMock.setItem('refresh_token', 'invalid-refresh');

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token inválido' })
      });

      await expect(authService.refreshToken()).rejects.toThrow('Token inválido');
    });
  });

  describe('changePassword', () => {
    it('cambia contraseña exitosamente', async () => {
      localStorageMock.setItem('access_token', 'valid-token');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const passwordData = {
        current_password: 'oldpass',
        new_password: 'newpass123'
      };

      await authService.changePassword(passwordData);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/auth/users/set_password/', {
        method: 'POST',
        headers: {
          'Authorization': 'JWT valid-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });
    });

    it('maneja errores de cambio de contraseña', async () => {
      localStorageMock.setItem('access_token', 'valid-token');

      const mockError = {
        current_password: ['Contraseña actual incorrecta']
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError
      });

      const passwordData = {
        current_password: 'wrongpass',
        new_password: 'newpass123'
      };

      await expect(authService.changePassword(passwordData)).rejects.toThrow();
    });
  });

  describe('requestPasswordReset', () => {
    it('solicita reset de contraseña exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await authService.requestPasswordReset('test@test.com');

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/auth/users/reset_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'test@test.com' })
      });
    });

    it('maneja errores de solicitud de reset', async () => {
      const mockError = {
        email: ['Email no encontrado']
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError
      });

      await expect(authService.requestPasswordReset('nonexistent@test.com')).rejects.toThrow();
    });
  });
});
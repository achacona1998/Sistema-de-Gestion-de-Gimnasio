import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import sociosService from '../../../gymfront/src/services/sociosService';

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

describe('SociosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    fetch.mockClear();
    localStorageMock.setItem('access_token', 'mock-token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSocios', () => {
    it('obtiene lista de socios exitosamente', async () => {
      const mockSocios = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            socio_id: 1,
            nombre: 'Juan Pérez',
            telefono: '123456789',
            correo: 'juan@test.com',
            membresia: 'Premium',
            fecha_registro: '2024-01-15'
          },
          {
            socio_id: 2,
            nombre: 'María García',
            telefono: '987654321',
            correo: 'maria@test.com',
            membresia: 'Básica',
            fecha_registro: '2024-01-20'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSocios
      });

      const result = await sociosService.getSocios();

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/socios/', {
        method: 'GET',
        headers: {
          'Authorization': 'JWT mock-token',
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockSocios);
    });

    it('obtiene socios con parámetros de paginación', async () => {
      const mockSocios = {
        count: 50,
        next: 'http://127.0.0.1:8000/api/v1/socios/?page=3',
        previous: 'http://127.0.0.1:8000/api/v1/socios/?page=1',
        results: []
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSocios
      });

      const params = {
        page: 2,
        page_size: 10,
        search: 'Juan'
      };

      const result = await sociosService.getSocios(params);

      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/v1/socios/?page=2&page_size=10&search=Juan',
        {
          method: 'GET',
          headers: {
            'Authorization': 'JWT mock-token',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual(mockSocios);
    });

    it('maneja errores de autorización', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token inválido' })
      });

      await expect(sociosService.getSocios()).rejects.toThrow('Token inválido');
    });

    it('maneja errores de red', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(sociosService.getSocios()).rejects.toThrow('Network error');
    });
  });

  describe('getSocio', () => {
    it('obtiene un socio específico exitosamente', async () => {
      const mockSocio = {
        socio_id: 1,
        nombre: 'Juan Pérez',
        telefono: '123456789',
        correo: 'juan@test.com',
        membresia: 'Premium',
        fecha_registro: '2024-01-15',
        direccion: 'Calle 123',
        fecha_nacimiento: '1990-05-15'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSocio
      });

      const result = await sociosService.getSocio(1);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/socios/1/', {
        method: 'GET',
        headers: {
          'Authorization': 'JWT mock-token',
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockSocio);
    });

    it('maneja error cuando el socio no existe', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Socio no encontrado' })
      });

      await expect(sociosService.getSocio(999)).rejects.toThrow('Socio no encontrado');
    });
  });

  describe('createSocio', () => {
    it('crea un nuevo socio exitosamente', async () => {
      const newSocio = {
        nombre: 'Carlos López',
        telefono: '555666777',
        correo: 'carlos@test.com',
        membresia: 'Básica',
        direccion: 'Avenida 456',
        fecha_nacimiento: '1985-08-20'
      };

      const mockResponse = {
        socio_id: 3,
        ...newSocio,
        fecha_registro: '2024-01-25'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse
      });

      const result = await sociosService.createSocio(newSocio);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/socios/', {
        method: 'POST',
        headers: {
          'Authorization': 'JWT mock-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSocio)
      });

      expect(result).toEqual(mockResponse);
    });

    it('maneja errores de validación', async () => {
      const invalidSocio = {
        nombre: '',
        telefono: '123',
        correo: 'invalid-email'
      };

      const mockError = {
        nombre: ['Este campo es requerido'],
        telefono: ['Número de teléfono inválido'],
        correo: ['Email inválido']
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError
      });

      await expect(sociosService.createSocio(invalidSocio)).rejects.toThrow();
    });

    it('maneja error de email duplicado', async () => {
      const duplicateSocio = {
        nombre: 'Test User',
        telefono: '123456789',
        correo: 'existing@test.com'
      };

      const mockError = {
        correo: ['Ya existe un socio con este email']
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError
      });

      await expect(sociosService.createSocio(duplicateSocio)).rejects.toThrow();
    });
  });

  describe('updateSocio', () => {
    it('actualiza un socio exitosamente', async () => {
      const updateData = {
        nombre: 'Juan Pérez Actualizado',
        telefono: '999888777',
        membresia: 'Premium'
      };

      const mockResponse = {
        socio_id: 1,
        ...updateData,
        correo: 'juan@test.com',
        fecha_registro: '2024-01-15'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await sociosService.updateSocio(1, updateData);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/socios/1/', {
        method: 'PATCH',
        headers: {
          'Authorization': 'JWT mock-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      expect(result).toEqual(mockResponse);
    });

    it('maneja errores de actualización', async () => {
      const updateData = {
        correo: 'invalid-email'
      };

      const mockError = {
        correo: ['Email inválido']
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError
      });

      await expect(sociosService.updateSocio(1, updateData)).rejects.toThrow();
    });
  });

  describe('deleteSocio', () => {
    it('elimina un socio exitosamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204
      });

      await sociosService.deleteSocio(1);

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/socios/1/', {
        method: 'DELETE',
        headers: {
          'Authorization': 'JWT mock-token',
          'Content-Type': 'application/json'
        }
      });
    });

    it('maneja error cuando el socio no existe', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: 'Socio no encontrado' })
      });

      await expect(sociosService.deleteSocio(999)).rejects.toThrow('Socio no encontrado');
    });

    it('maneja error de permisos insuficientes', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ detail: 'No tienes permisos para eliminar este socio' })
      });

      await expect(sociosService.deleteSocio(1)).rejects.toThrow('No tienes permisos para eliminar este socio');
    });
  });

  describe('getSociosStats', () => {
    it('obtiene estadísticas de socios exitosamente', async () => {
      const mockStats = {
        total_socios: 150,
        socios_activos: 120,
        socios_inactivos: 30,
        nuevos_este_mes: 15,
        membresias: {
          'Básica': 80,
          'Premium': 40,
          'VIP': 30
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats
      });

      const result = await sociosService.getSociosStats();

      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/socios/stats/', {
        method: 'GET',
        headers: {
          'Authorization': 'JWT mock-token',
          'Content-Type': 'application/json'
        }
      });

      expect(result).toEqual(mockStats);
    });

    it('maneja errores al obtener estadísticas', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Error interno del servidor' })
      });

      await expect(sociosService.getSociosStats()).rejects.toThrow('Error interno del servidor');
    });
  });

  describe('searchSocios', () => {
    it('busca socios por término exitosamente', async () => {
      const mockResults = {
        count: 2,
        results: [
          {
            socio_id: 1,
            nombre: 'Juan Pérez',
            correo: 'juan@test.com'
          },
          {
            socio_id: 5,
            nombre: 'Juana López',
            correo: 'juana@test.com'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults
      });

      const result = await sociosService.searchSocios('Juan');

      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/v1/socios/?search=Juan',
        {
          method: 'GET',
          headers: {
            'Authorization': 'JWT mock-token',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual(mockResults);
    });

    it('retorna resultados vacíos cuando no hay coincidencias', async () => {
      const mockResults = {
        count: 0,
        results: []
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults
      });

      const result = await sociosService.searchSocios('NoExiste');

      expect(result).toEqual(mockResults);
    });
  });

  describe('exportSocios', () => {
    it('exporta socios en formato CSV exitosamente', async () => {
      const mockCsvData = 'nombre,correo,telefono\nJuan Pérez,juan@test.com,123456789';

      fetch.mockResolvedValueOnce({
        ok: true,
        text: async () => mockCsvData,
        headers: {
          get: (header) => {
            if (header === 'content-type') return 'text/csv';
            if (header === 'content-disposition') return 'attachment; filename="socios.csv"';
            return null;
          }
        }
      });

      const result = await sociosService.exportSocios('csv');

      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/api/v1/socios/export/?format=csv',
        {
          method: 'GET',
          headers: {
            'Authorization': 'JWT mock-token'
          }
        }
      );

      expect(result).toBe(mockCsvData);
    });

    it('maneja errores de exportación', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ detail: 'Error al generar exportación' })
      });

      await expect(sociosService.exportSocios('pdf')).rejects.toThrow('Error al generar exportación');
    });
  });

  describe('manejo de tokens', () => {
    it('maneja solicitudes sin token de acceso', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(sociosService.getSocios()).rejects.toThrow('Token de acceso no encontrado');
    });

    it('incluye el token en todas las solicitudes autenticadas', async () => {
      const mockResponse = { results: [] };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await sociosService.getSocios();

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'JWT mock-token'
          })
        })
      );
    });
  });
});
import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente a las requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y renovar tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(
            'http://localhost:8000/auth/jwt/refresh/',
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Reintentar la request original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, limpiar tokens y redirigir al login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token, redirigir al login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Función para crear un servicio base con operaciones CRUD
export const createBaseService = (endpoint) => {
  return {
    // Obtener todos los registros
    getAll: async (params = {}) => {
      try {
        const response = await apiClient.get(`/${endpoint}/`, { params });
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    },

    // Obtener un registro por ID
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/${endpoint}/${id}/`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${endpoint} by ID:`, error);
        throw error;
      }
    },

    // Crear un nuevo registro
    create: async (data) => {
      try {
        const response = await apiClient.post(`/${endpoint}/`, data);
        return response.data;
      } catch (error) {
        console.error(`Error creating ${endpoint}:`, error);
        throw error;
      }
    },

    // Actualizar un registro
    update: async (id, data) => {
      try {
        const response = await apiClient.put(`/${endpoint}/${id}/`, data);
        return response.data;
      } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
        throw error;
      }
    },

    // Eliminar un registro
    delete: async (id) => {
      try {
        await apiClient.delete(`/${endpoint}/${id}/`);
        return true;
      } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
      }
    },

    // Actualizar parcialmente un registro
    patch: async (id, data) => {
      try {
        const response = await apiClient.patch(`/${endpoint}/${id}/`, data);
        return response.data;
      } catch (error) {
        console.error(`Error patching ${endpoint}:`, error);
        throw error;
      }
    },
  };
};

export default apiClient;
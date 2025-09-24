import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000';

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
      config.headers.Authorization = `JWT ${token}`;
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
          const response = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Reintentar la request original con el nuevo token
          originalRequest.headers.Authorization = `JWT ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, limpiar tokens y redirigir al login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token, redirigir al login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  // Login de usuario
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/jwt/create/', {
        email,
        password
      });
      
      const { access, refresh } = response.data;
      
      // Guardar tokens en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Obtener información del usuario
      const userResponse = await apiClient.get('/auth/users/me/');
      const user = userResponse.data;
      
      // Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user,
        tokens: { access, refresh }
      };
    } catch (error) {
      console.error('Error en login:', error);
      
      let errorMessage = 'Error de conexión';
      if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  // Registro de usuario
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/users/', {
        email: userData.email,
        password: userData.password,
        re_password: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone
      });
      
      return {
        success: true,
        user: response.data,
        message: 'Usuario registrado exitosamente. Por favor, verifica tu email.'
      };
    } catch (error) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error de conexión';
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Manejar errores específicos de campos
        if (errorData.email) {
          errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.password) {
          errorMessage = `Contraseña: ${errorData.password[0]}`;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
  
  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }
  
  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Obtener token de acceso
  getAccessToken() {
    return localStorage.getItem('access_token');
  }
  
  // Verificar y renovar token si es necesario
  async verifyToken() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      await apiClient.post('/auth/jwt/verify/', { token });
      return true;
    } catch (error) {
      // Si el token no es válido, intentar renovarlo
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await apiClient.post('/auth/jwt/refresh/', {
            refresh: refreshToken
          });
          
          localStorage.setItem('access_token', response.data.access);
          return true;
        } catch (refreshError) {
          this.logout();
          return false;
        }
      }
      
      this.logout();
      return false;
    }
  }
  
  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      await apiClient.post('/auth/users/set_password/', {
        current_password: currentPassword,
        new_password: newPassword,
        re_new_password: newPassword
      });
      
      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      let errorMessage = 'Error de conexión';
      if (error.response?.data?.current_password) {
        errorMessage = 'Contraseña actual incorrecta';
      } else if (error.response?.data?.new_password) {
        errorMessage = error.response.data.new_password[0];
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
  
  // Solicitar reset de contraseña
  async requestPasswordReset(email) {
    try {
      await apiClient.post('/auth/users/reset_password/', { email });
      
      return {
        success: true,
        message: 'Se ha enviado un email con instrucciones para restablecer tu contraseña'
      };
    } catch (error) {
      console.error('Error al solicitar reset:', error);
      
      return {
        success: false,
        error: 'Error al procesar la solicitud'
      };
    }
  }
}

// Exportar instancia única del servicio
const authService = new AuthService();
export default authService;

// También exportar el cliente de API para uso en otros servicios
export { apiClient };
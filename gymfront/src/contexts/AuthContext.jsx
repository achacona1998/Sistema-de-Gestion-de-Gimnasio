import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';

// Estados de autenticación
const AUTH_STATES = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated'
};

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  authState: AUTH_STATES.LOADING
};

// Reducer para manejar el estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authState: AUTH_STATES.AUTHENTICATED
      };
      
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        authState: AUTH_STATES.UNAUTHENTICATED
      };
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        authState: AUTH_STATES.UNAUTHENTICATED
      };
      
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
}

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      try {
        // Verificar si hay tokens válidos
        const isValid = await authService.verifyToken();
        
        if (isValid) {
          const user = authService.getCurrentUser();
          if (user) {
            dispatch({ 
              type: AUTH_ACTIONS.LOGIN_SUCCESS, 
              payload: { user } 
            });
          } else {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: { user: result.user } 
        });
        return { success: true };
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_FAILURE, 
          payload: result.error 
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de registro
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { 
          success: true, 
          message: result.message 
        };
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.SET_ERROR, 
          payload: result.error 
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = () => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Función para actualizar información del usuario
  const updateUser = (userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.UPDATE_USER, 
      payload: userData 
    });
    
    // Actualizar también en localStorage
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Función para cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      if (!result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.SET_ERROR, 
          payload: result.error 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Función para solicitar reset de contraseña
  const requestPasswordReset = async (email) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const result = await authService.requestPasswordReset(email);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      if (!result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.SET_ERROR, 
          payload: result.error 
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Error de conexión. Intenta nuevamente.';
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Valor del contexto
  const contextValue = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    authState: state.authState,
    
    // Acciones
    login,
    register,
    logout,
    updateUser,
    clearError,
    changePassword,
    requestPasswordReset,
    
    // Utilidades
    isAuthenticating: state.isLoading && state.authState === AUTH_STATES.LOADING,
    hasError: !!state.error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Dumbbell, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import gymInterior from '../../assets/gym-interior.svg';

const Register = ({ onToggleMode }) => {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Limpiar errores cuando el componente se monta o cambia el modo
  useEffect(() => {
    clearError();
    setValidationErrors({});
    setRegistrationSuccess(false);
    setSuccessMessage('');
  }, [clearError]);

  const validateForm = () => {
    const errors = {};
    
    // Validar nombre
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }
    
    // Validar apellido
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }
    
    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }
    
    // Validar contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }
    
    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (formData.phone && !/^[+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Formato de teléfono inválido';
    }
    
    // Validar términos
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error de validación del campo específico
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Limpiar error general
    if (error) {
      clearError();
    }
    
    // Limpiar mensaje de éxito
    if (registrationSuccess) {
      setRegistrationSuccess(false);
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    clearError();
    setValidationErrors({});
    setRegistrationSuccess(false);
    setSuccessMessage('');
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone.trim()
      });
      
      if (result.success) {
        setRegistrationSuccess(true);
        setSuccessMessage(result.message || 'Registro exitoso');
        
        // Limpiar formulario
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          acceptTerms: false
        });
        
        // Opcional: cambiar al modo login después de un tiempo
        setTimeout(() => {
          if (onToggleMode) {
            onToggleMode();
          }
        }, 3000);
      }
      // Si hay error, el contexto lo manejará automáticamente
    } catch (error) {
      console.error('Error inesperado en registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Imagen del gimnasio */}
          <div className="md:w-2/5 bg-gray-100 flex items-center justify-center p-8">
            <img 
              src={gymInterior} 
              alt="Interior del gimnasio" 
              className="w-full h-auto max-w-md rounded-lg shadow-lg"
            />
          </div>
          
          {/* Formulario de registro */}
          <div className="md:w-3/5 p-8 md:p-12">
            <div className="max-w-lg mx-auto">
              {/* Logo y título */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-500 p-2 rounded-lg mr-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-blue-500">GymPro</h1>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Crear Nueva Cuenta
                </h2>
                <p className="text-gray-600 text-sm">
                  Completa los datos para registrarte
                </p>
              </div>

              {/* Mostrar mensaje de éxito */}
              {registrationSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-green-700 text-sm font-medium">{successMessage}</p>
                    <p className="text-green-600 text-xs mt-1">Serás redirigido al login en unos segundos...</p>
                  </div>
                </div>
              )}
              
              {/* Mostrar error general */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-700 ${
                        validationErrors.firstName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      disabled={isSubmitting || isLoading}
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-700 ${
                        validationErrors.lastName 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      disabled={isSubmitting || isLoading}
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-700 ${
                      validationErrors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isLoading}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-700 ${
                      validationErrors.phone 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isLoading}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Contraseñas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-700 pr-12 ${
                          validationErrors.password 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        disabled={isSubmitting || isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting || isLoading}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition duration-200 text-gray-700 pr-12 ${
                          validationErrors.confirmPassword 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        disabled={isSubmitting || isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isSubmitting || isLoading}
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className={`w-4 h-4 text-blue-600 rounded focus:ring-2 mt-1 ${
                      validationErrors.acceptTerms 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting || isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Acepto los{' '}
                    <Link to="/terms" className="text-blue-500 hover:text-blue-600">
                      términos y condiciones
                    </Link>
                    {' '}y la{' '}
                    <Link to="/privacy" className="text-blue-500 hover:text-blue-600">
                      política de privacidad
                    </Link>
                  </span>
                </div>
                {validationErrors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.acceptTerms}</p>
                )}

                {/* Botón de registro */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading || registrationSuccess}
                  className={`w-full py-3 px-4 rounded-lg focus:ring-4 focus:ring-blue-200 transition duration-200 font-medium flex items-center justify-center space-x-2 ${
                    isSubmitting || isLoading || registrationSuccess
                      ? 'bg-blue-400 cursor-not-allowed text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {(isSubmitting || isLoading) && (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}
                  <span>
                    {isSubmitting || isLoading ? 'Creando cuenta...' : registrationSuccess ? 'Cuenta creada' : 'Crear cuenta'}
                  </span>
                </button>
              </form>

              {/* Link a login */}
              <div className="mt-6 text-center">
                <span className="text-gray-600 text-sm">¿Ya tienes una cuenta? </span>
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-blue-500 hover:text-blue-600 font-medium text-sm transition duration-200 underline"
                >
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
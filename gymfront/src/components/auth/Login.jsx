import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Dumbbell, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import gymInterior from "../../assets/gym-interior.svg";

const Login = ({ onToggleMode }) => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpiar errores cuando el componente se monta o cambia el modo
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [clearError]);

  const validateForm = () => {
    const errors = {};

    // Validar email
    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Formato de email inválido";
    }

    // Validar contraseña
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error de validación del campo específico
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Limpiar error general
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    clearError();
    setValidationErrors({});

    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // El login fue exitoso, el contexto manejará la redirección
        console.log("Login exitoso");
      }
      // Si hay error, el contexto lo manejará automáticamente
    } catch (error) {
      console.error("Error inesperado en login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="overflow-hidden w-full max-w-4xl bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Imagen del gimnasio */}
          <div className="flex justify-center items-center p-8 bg-gray-100 md:w-1/2">
            <img
              src={gymInterior}
              alt="Interior del gimnasio"
              className="w-full max-w-md h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Formulario de login */}
          <div className="p-8 md:w-1/2 md:p-12">
            <div className="mx-auto max-w-md">
              {/* Logo y título */}
              <div className="mb-8 text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="p-2 mr-3 bg-blue-500 rounded-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-blue-500">GymPro</h1>
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  Sistema de Gestión de Gimnasios
                </h2>
                <p className="text-sm text-gray-600">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {/* Mostrar error general */}
              {error && (
                <div className="flex items-center p-4 space-x-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ejemplo@correo.com"
                    className={`px-4 py-3 w-full text-gray-700 rounded-lg border transition duration-200 focus:ring-2 focus:border-transparent ${
                      validationErrors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={isSubmitting || isLoading}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`px-4 py-3 pr-12 w-full text-gray-700 rounded-lg border transition duration-200 focus:ring-2 focus:border-transparent ${
                        validationErrors.password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      disabled={isSubmitting || isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 text-gray-500 transform -translate-y-1/2 hover:text-gray-700"
                      disabled={isSubmitting || isLoading}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Recordarme y Olvidaste contraseña */}
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Recordarme
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-500 transition duration-200 hover:text-blue-600">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Botón de login */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className={`px-4 py-3 w-full font-medium text-white rounded-lg transition duration-200 focus:ring-4 focus:ring-blue-200 flex items-center justify-center space-x-2 ${
                    isSubmitting || isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}>
                  {(isSubmitting || isLoading) && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  <span>
                    {isSubmitting || isLoading
                      ? "Iniciando sesión..."
                      : "Iniciar sesión"}
                  </span>
                </button>
              </form>

              {/* Link a registro */}
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  ¿Nuevo en la plataforma?{" "}
                </span>
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-sm font-medium text-blue-500 underline transition duration-200 hover:text-blue-600">
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

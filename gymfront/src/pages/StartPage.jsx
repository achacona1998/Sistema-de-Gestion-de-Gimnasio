import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, BarChart3, Smartphone, CheckCircle, TrendingUp } from 'lucide-react';

const StartPage = () => {
  const features = [
    {
      id: 'socios',
      title: 'Gestión de Socios',
      icon: <Users className="w-12 h-12 text-blue-600" />,
      description: 'Registro completo de datos personales',
      features: [
        'Registro completo de datos personales',
        'Seguimiento de pagos y membresías',
        'Historial médico y objetivos',
        'Comunicación directa con los socios'
      ],
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      link: '/auth'
    },
    {
      id: 'asistencia',
      title: 'Control de Asistencia',
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
      description: 'Registro de entradas y salidas',
      features: [
        'Registro de entradas y salidas',
        'Estadísticas de frecuencia',
        'Alertas de inasistencia',
        'Reportes personalizados'
      ],
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      link: '/auth'
    },
    {
      id: 'clases',
      title: 'Gestión de Clases',
      icon: <Calendar className="w-12 h-12 text-purple-600" />,
      description: 'Programación de horarios',
      features: [
        'Programación de horarios',
        'Asignación de instructores',
        'Reservas online',
        'Capacidad y ocupación'
      ],
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      link: '/auth'
    },
    {
      id: 'reportes',
      title: 'Análisis y Reportes',
      icon: <BarChart3 className="w-12 h-12 text-orange-600" />,
      description: 'Obtén información valiosa sobre el rendimiento',
      features: [
        'Ingresos Mensuales',
        'Distribución de Socios'
      ],
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      link: '/auth'
    },
    {
      id: 'movil',
      title: 'Aplicación Móvil',
      icon: <Smartphone className="w-12 h-12 text-teal-600" />,
      description: 'Nuestro sistema incluye una aplicación móvil',
      features: [
        'Reservar clases',
        'Seguir su progreso',
        'Ver horarios',
        'Pagar membresías'
      ],
      bgColor: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenido a Sistema de Gestión de Gimnasios
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tu solución completa para administrar tu gimnasio de manera eficiente
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-3 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">GymPro</h2>
                <p className="text-gray-600">Versión 2.0</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Estamos emocionados de que te unas a nosotros. Antes de comenzar, te presentamos las principales funcionalidades que harán que la gestión de tu gimnasio sea más sencilla y efectiva.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <div key={feature.id} className={`${feature.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${feature.iconBg} p-3 rounded-lg`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-700 mb-4">{feature.description}</p>
              <ul className="space-y-2 mb-6">
                {feature.features.map((item, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {feature.link !== '#' && (
                <Link
                  to={feature.link}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                >
                  Explorar
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/auth"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Comenzar a usar el sistema
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
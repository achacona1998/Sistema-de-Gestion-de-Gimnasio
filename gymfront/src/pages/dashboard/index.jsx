import React, { useState, useEffect } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { reportService } from '../../services';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Target,
  Award,
  Zap
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await reportService.getDashboardData({ periodo: timeRange });
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
        // Usar datos por defecto en caso de error
        setDashboardData(getDefaultDashboardData());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Datos por defecto en caso de error
  const getDefaultDashboardData = () => ({
    ingresos: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datos: [25000, 28000, 32000, 35000, 38000, 42850]
    },
    gastos: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datos: [18000, 19000, 20000, 21000, 22000, 23000]
    },
    membresias: {
      premium: 45,
      basica: 30,
      estudiante: 15,
      familiar: 10
    },
    asistencia: {
      lunes: 120,
      martes: 135,
      miercoles: 110,
      jueves: 145,
      viernes: 160,
      sabado: 180,
      domingo: 95
    }
  });

  // Datos para el gráfico de ingresos
  const revenueData = {
    labels: dashboardData?.ingresos?.labels || ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ingresos",
        data: dashboardData?.ingresos?.datos || [25000, 28000, 32000, 35000, 38000, 42850],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        borderWidth: 3,
        fill: true,
      },
      {
        label: "Gastos",
        data: dashboardData?.gastos?.datos || [18000, 19000, 20000, 21000, 22000, 23000],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Datos para gráfico de dona - Distribución de membresías
  const membershipData = {
    labels: ['Premium', 'Básica', 'Estudiante', 'Familiar'],
    datasets: [
      {
        data: [
          dashboardData?.membresias?.premium || 45,
          dashboardData?.membresias?.basica || 30,
          dashboardData?.membresias?.estudiante || 15,
          dashboardData?.membresias?.familiar || 10
        ],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Datos para gráfico de barras - Asistencia por día
  const attendanceData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Asistencia',
        data: [
          dashboardData?.asistencia?.lunes || 120,
          dashboardData?.asistencia?.martes || 135,
          dashboardData?.asistencia?.miercoles || 110,
          dashboardData?.asistencia?.jueves || 145,
          dashboardData?.asistencia?.viernes || 160,
          dashboardData?.asistencia?.sabado || 180,
          dashboardData?.asistencia?.domingo || 95
        ],
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#374151",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#F3F4F6",
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    cutout: '60%',
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#F3F4F6",
        },
        border: {
          display: false,
        },
      },
    },
  };

  const MetricCard = ({ title, value, change, changeType, icon: Icon, color, subtitle }) => (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          <div className="flex items-center mt-3">
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : changeType === 'negative' ? (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            ) : (
              <Activity className="w-4 h-4 text-gray-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
            <span className="ml-1 text-sm text-gray-500">vs período anterior</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 border-dashed ${color} hover:bg-opacity-5 transition-all group`}
    >
      <div className="text-center">
        <Icon className={`w-8 h-8 mx-auto mb-3 ${color.replace('border-', 'text-').replace('hover:bg-opacity-5', '')}`} />
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );

  const ActivityItem = ({ type, title, description, time, status }) => {
    const getStatusIcon = () => {
      switch (status) {
        case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
        case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
        default: return <Clock className="w-4 h-4 text-blue-500" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <div className="px-6 py-6 bg-white border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Bienvenido de nuevo, Alejandro. Aquí tienes un resumen completo de tu gimnasio.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Hoy</option>
              <option value="weekly">Esta semana</option>
              <option value="monthly">Este mes</option>
              <option value="yearly">Este año</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Exportar Reporte
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Métricas principales mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Socios Activos"
            value="248"
            change="+12%"
            changeType="positive"
            icon={Users}
            color="bg-blue-100 text-blue-600"
            subtitle="23 nuevos este mes"
          />
          <MetricCard
            title="Ingresos Mensuales"
            value="$42,850"
            change="+8%"
            changeType="positive"
            icon={DollarSign}
            color="bg-green-100 text-green-600"
            subtitle="Meta: $45,000"
          />
          <MetricCard
            title="Asistencia Diaria"
            value="86"
            change="-3%"
            changeType="negative"
            icon={UserCheck}
            color="bg-purple-100 text-purple-600"
            subtitle="Promedio: 92"
          />
          <MetricCard
            title="Tasa de Retención"
            value="94%"
            change="+2%"
            changeType="positive"
            icon={Target}
            color="bg-orange-100 text-orange-600"
            subtitle="Objetivo: 95%"
          />
        </div>

        {/* Alertas y Notificaciones */}
        {dashboardData?.equipos_mantenimiento > 0 && (
          <div className="mb-8">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    {dashboardData.equipos_mantenimiento} equipos requieren mantenimiento
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Revisa el estado de los equipos en la sección de mantenimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de gráficos principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de Ingresos vs Gastos */}
          <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Análisis Financiero
                </h3>
                <p className="text-sm text-gray-600">Ingresos vs Gastos (Últimos 6 meses)</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-2">
                <button 
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedMetric === 'revenue' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ingresos
                </button>
                <button 
                  onClick={() => setSelectedMetric('profit')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedMetric === 'profit' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ganancia
                </button>
              </div>
            </div>
            <div className="h-80">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Distribución de Membresías */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Membresías</h3>
                <p className="text-sm text-gray-600">Distribución por tipo</p>
              </div>
            </div>
            <div className="h-64">
              <Doughnut data={membershipData} options={doughnutOptions} />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de socios:</span>
                <span className="font-semibold">248</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crecimiento mensual:</span>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segunda fila de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Asistencia Semanal */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Asistencia Semanal</h3>
                <p className="text-sm text-gray-600">Promedio de visitas por día</p>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">135 promedio</span>
              </div>
            </div>
            <div className="h-64">
              <Bar data={attendanceData} options={barOptions} />
            </div>
          </div>

          {/* Métricas de Rendimiento */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Métricas de Rendimiento</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Ocupación Promedio</span>
                  <span className="text-sm font-bold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Satisfacción del Cliente</span>
                  <span className="text-sm font-bold text-gray-900">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Utilización de Equipos</span>
                  <span className="text-sm font-bold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Clases Más Populares</span>
                  <span className="text-sm font-bold text-gray-900">Spinning</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección inferior con widgets adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Actividad Reciente */}
          <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Ver todas
              </button>
            </div>
            <div className="space-y-1">
              <ActivityItem
                type="member"
                title="Nuevo socio registrado"
                description="María González se unió con membresía Premium"
                time="Hace 15 minutos"
                status="success"
              />
              <ActivityItem
                type="payment"
                title="Pago procesado"
                description="Carlos Ruiz renovó su membresía mensual"
                time="Hace 1 hora"
                status="success"
              />
              <ActivityItem
                type="maintenance"
                title="Mantenimiento programado"
                description="Área de pesas cerrada mañana 10:00-12:00"
                time="Hace 2 horas"
                status="warning"
              />
              <ActivityItem
                type="class"
                title="Clase cancelada"
                description="Yoga matutino cancelado por enfermedad del instructor"
                time="Hace 3 horas"
                status="error"
              />
              <ActivityItem
                type="achievement"
                title="Meta alcanzada"
                description="200 socios activos este mes"
                time="Hace 5 horas"
                status="success"
              />
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
            <div className="space-y-4">
              <QuickActionCard
                title="Nuevo Socio"
                description="Registrar nuevo miembro"
                icon={Users}
                color="border-blue-300 hover:bg-blue-50"
                onClick={() => console.log('Nuevo socio')}
              />
              <QuickActionCard
                title="Nueva Clase"
                description="Programar clase grupal"
                icon={Calendar}
                color="border-green-300 hover:bg-green-50"
                onClick={() => console.log('Nueva clase')}
              />
              <QuickActionCard
                title="Reporte"
                description="Generar reporte mensual"
                icon={Award}
                color="border-purple-300 hover:bg-purple-50"
                onClick={() => console.log('Reporte')}
              />
            </div>
          </div>

          {/* Próximas Clases */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Próximas Clases</h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Ver calendario
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Spinning</p>
                  <p className="text-xs text-gray-600">16:00 - 17:00</p>
                  <p className="text-xs text-gray-500">18/24 participantes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">CrossFit</p>
                  <p className="text-xs text-gray-600">18:00 - 19:00</p>
                  <p className="text-xs text-gray-500">15/20 participantes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Yoga</p>
                  <p className="text-xs text-gray-600">19:00 - 20:00</p>
                  <p className="text-xs text-gray-500">12/15 participantes</p>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Administrar clases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { CalendarIcon, DocumentArrowDownIcon, ChartBarIcon, UsersIcon, CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline";
import classService from '../../services/classService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-01-31",
  });
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  // Datos simulados más completos
  const reportsData = {
    overview: {
      title: "Resumen General",
      metrics: [
        { label: "Total Socios", value: "245", change: "+12%", icon: UsersIcon, color: "blue" },
        { label: "Ingresos Mensuales", value: "$15,750", change: "+8%", icon: CurrencyDollarIcon, color: "green" },
        { label: "Asistencia Promedio", value: "68%", change: "+5%", icon: ChartBarIcon, color: "purple" },
        { label: "Clases Activas", value: "32", change: "+3", icon: ClockIcon, color: "orange" },
      ],
    },
    members: {
      title: "Reporte de Socios",
      metrics: [
        { label: "Nuevos Socios", value: "25", change: "+15%", icon: UsersIcon, color: "blue" },
        { label: "Renovaciones", value: "45", change: "+8%", icon: UsersIcon, color: "green" },
        { label: "Bajas", value: "8", change: "-2%", icon: UsersIcon, color: "red" },
        { label: "Total Activos", value: "212", change: "+12%", icon: UsersIcon, color: "purple" },
      ],
    },
    income: {
      title: "Reporte de Ingresos",
      metrics: [
        { label: "Membresías Nuevas", value: "$4,200", change: "+18%", icon: CurrencyDollarIcon, color: "green" },
        { label: "Renovaciones", value: "$8,500", change: "+12%", icon: CurrencyDollarIcon, color: "blue" },
        { label: "Clases Privadas", value: "$2,100", change: "+25%", icon: CurrencyDollarIcon, color: "purple" },
        { label: "Productos", value: "$950", change: "+5%", icon: CurrencyDollarIcon, color: "orange" },
      ],
    },
    attendance: {
      title: "Reporte de Asistencias",
      metrics: [
        { label: "Promedio Diario", value: "68", change: "+8%", icon: ChartBarIcon, color: "blue" },
        { label: "Hora Pico", value: "18:00", change: "=", icon: ClockIcon, color: "green" },
        { label: "Día Más Concurrido", value: "Lunes", change: "=", icon: CalendarIcon, color: "purple" },
        { label: "Total Mensual", value: "2,108", change: "+15%", icon: ChartBarIcon, color: "orange" },
      ],
    },
    classes: {
      title: "Reporte de Clases",
      metrics: [
        { label: "Clases Impartidas", value: "156", change: "+12%", icon: ClockIcon, color: "blue" },
        { label: "Total Asistentes", value: "1,248", change: "+18%", icon: UsersIcon, color: "green" },
        { label: "Promedio por Clase", value: "8", change: "+1", icon: ChartBarIcon, color: "purple" },
        { label: "Tasa de Ocupación", value: "75%", change: "+5%", icon: ChartBarIcon, color: "orange" },
      ],
    },
  };

  // Datos para gráficos
  const chartData = {
    income: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Ingresos',
          data: [12000, 15000, 13500, 16800, 14200, 15750],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
        {
          label: 'Gastos',
          data: [8000, 9500, 8800, 10200, 9100, 9800],
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
      ],
    },
    membership: {
      labels: ['Básica', 'Premium', 'VIP', 'Estudiante'],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderWidth: 2,
        },
      ],
    },
    attendance: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Asistencia',
          data: [85, 72, 68, 75, 82, 45, 38],
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const handleExport = (format) => {
    setLoading(true);
    // Simular exportación
    setTimeout(() => {
      const data = reportsData[selectedReport];
      if (format === 'csv') {
        const csvContent = data.metrics.map(item => `${item.label},${item.value},${item.change}`).join('\n');
        const blob = new Blob([`Métrica,Valor,Cambio\n${csvContent}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${selectedReport}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${selectedReport}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
      }
      setLoading(false);
    }, 1000);
  };

  const MetricCard = ({ metric }) => {
    const Icon = metric.icon;
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    };

    return (
      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[metric.color]}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className={`text-sm font-medium ${
            metric.change.includes('+') ? 'text-green-600' : 
            metric.change.includes('-') ? 'text-red-600' : 'text-gray-600'
          }`}>
            {metric.change}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
      </div>
    );
  };

  const [popularClasses, setPopularClasses] = useState([]);

  useEffect(() => {
    loadPopularClasses();
  }, []);

  // Cargar clases populares desde la API
  const loadPopularClasses = async () => {
    try {
      const response = await classService.getClasses();
      const classes = response.results || response;
      
      // Simular datos de popularidad basados en las clases existentes
      const classesWithStats = classes.map(cls => ({
        name: cls.nombre,
        participants: Math.floor(Math.random() * 25) + 10, // Simulado
        capacity: cls.capacidad || 30,
        percentage: Math.floor(Math.random() * 30) + 70 // Simulado entre 70-100%
      }));
      
      // Ordenar por porcentaje de ocupación y tomar los top 5
      const topClasses = classesWithStats
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
      
      setPopularClasses(topClasses);
    } catch (error) {
      console.error('Error loading popular classes:', error);
      // Fallback a datos por defecto
      setPopularClasses([
        { name: 'CrossFit', participants: 45, capacity: 50, percentage: 90 },
        { name: 'Yoga', participants: 38, capacity: 40, percentage: 95 },
        { name: 'Spinning', participants: 28, capacity: 30, percentage: 93 },
        { name: 'Pilates', participants: 22, capacity: 25, percentage: 88 },
        { name: 'Zumba', participants: 35, capacity: 45, percentage: 78 },
      ]);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
        <div className="flex space-x-3">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={() => handleExport(exportFormat)}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            {loading ? 'Exportando...' : 'Exportar'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tipo de Reporte
            </label>
            <select
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="overview">Resumen General</option>
              <option value="members">Socios</option>
              <option value="income">Ingresos</option>
              <option value="attendance">Asistencias</option>
              <option value="classes">Clases</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <input
              type="date"
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <input
              type="date"
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Período
            </label>
            <select className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          {reportsData[selectedReport].title}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reportsData[selectedReport].metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* Gráfico de Ingresos vs Gastos */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingresos vs Gastos</h3>
          <Bar data={chartData.income} options={chartOptions} />
        </div>

        {/* Gráfico de Distribución de Membresías */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Distribución de Membresías</h3>
          <Doughnut data={chartData.membership} options={doughnutOptions} />
        </div>
      </div>

      {/* Gráfico de Asistencia Semanal */}
      <div className="p-6 bg-white rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Asistencia Semanal</h3>
        <Line data={chartData.attendance} options={chartOptions} />
      </div>

      {/* Tabla de Clases Populares */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Clases Más Populares</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Clase</th>
                <th className="px-6 py-3">Participantes</th>
                <th className="px-6 py-3">Capacidad</th>
                <th className="px-6 py-3">Ocupación</th>
                <th className="px-6 py-3">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {popularClasses.map((classItem, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {classItem.name}
                  </td>
                  <td className="px-6 py-4">{classItem.participants}</td>
                  <td className="px-6 py-4">{classItem.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      classItem.percentage >= 90 ? 'bg-green-100 text-green-800' :
                      classItem.percentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {classItem.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          classItem.percentage >= 90 ? 'bg-green-600' :
                          classItem.percentage >= 80 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${classItem.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

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
import {
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import attendanceService from "../../services/attendanceService";
import classService from "../../services/classService";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

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

const AttendancePage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    search: "",
    status: "all",
    membershipType: "all",
    activity: "all",
  });

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState({
    memberId: "",
    memberName: "",
    activity: "",
  });

  const [stats, setStats] = useState({
    totalToday: 0,
    activeNow: 0,
    averageTime: "0h 0m",
    peakHour: "--:--",
  });

  // Datos para gráficos
  const [hourlyData, setHourlyData] = useState({
    labels: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    datasets: [
      {
        label: 'Asistencia por Hora',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  });

  const membershipData = {
    labels: ['Básica', 'Premium', 'VIP'],
    datasets: [
      {
        data: [40, 45, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const [weeklyData, setWeeklyData] = useState({
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Asistencia Semanal',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  });

  // Funciones para cargar datos desde la API
  const loadAttendances = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        fecha_entrada__date: filters.date,
        ordering: '-fecha_entrada'
      };
      const response = await attendanceService.getAttendances(apiFilters);
      
      // Transformar datos del backend al formato del frontend
      const transformedRecords = (response.results || response).map(record => ({
        id: record.asistencia_id,
        memberName: record.socio?.nombre || 'Usuario desconocido',
        memberId: record.socio?.socio_id || 'N/A',
        checkIn: new Date(record.fecha_entrada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        checkOut: record.fecha_salida ? new Date(record.fecha_salida).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null,
        date: new Date(record.fecha_entrada).toISOString().split('T')[0],
        status: record.fecha_salida ? 'completed' : 'active',
        duration: record.fecha_salida ? calculateDuration(record.fecha_entrada, record.fecha_salida) : null,
        membershipType: record.socio?.membresia?.tipo || 'N/A',
        activity: 'Gimnasio General', // Por ahora estático, se puede expandir
      }));
      
      setAttendanceRecords(transformedRecords);
      setError(null);
    } catch (err) {
      setError('Error al cargar las asistencias');
      showNotification('Error al cargar las asistencias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await attendanceService.getAttendanceStats(filters.date);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadChartData = async () => {
    try {
      // Cargar datos por horas
      const hourlyResponse = await attendanceService.getHourlyData(filters.date);
      setHourlyData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: hourlyResponse.data
        }]
      }));

      // Cargar datos semanales
      const weeklyResponse = await attendanceService.getWeeklyData();
      setWeeklyData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: weeklyResponse.data
        }]
      }));
    } catch (err) {
      console.error('Error loading chart data:', err);
    }
  };

  const calculateDuration = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const duration = Math.round((end - start) / (1000 * 60));
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  // Efectos para cargar datos
  useEffect(() => {
    loadAttendances();
    loadStats();
    loadChartData();
    loadActivities();
    loadMembers();
  }, [filters.date]);

  useEffect(() => {
    if (filters.search || filters.status !== 'all' || filters.membershipType !== 'all' || filters.activity !== 'all') {
      loadAttendances();
    }
  }, [filters.search, filters.status, filters.membershipType, filters.activity]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
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

  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);

  // Cargar actividades desde la API
  const loadActivities = async () => {
    try {
      const response = await classService.getClasses();
      const classes = response.results || response;
      
      // Extraer tipos únicos de clases como actividades
      const uniqueActivities = [...new Set(classes.map(cls => cls.nombre))];
      setActivities(uniqueActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      // Fallback a actividades por defecto
      setActivities([
        "Gimnasio General",
        "CrossFit",
        "Yoga",
        "Spinning",
        "Pilates",
        "Zumba",
        "Natación",
      ]);
    }
  };

  // Cargar miembros desde la API
  const loadMembers = async () => {
    try {
      const response = await api.get('/socios/');
      const socios = response.data.results || response.data;
      
      // Formatear datos para el selector
      const formattedMembers = socios.map(socio => ({
        id: socio.socio_id,
        name: `${socio.nombre} ${socio.apellido}`
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading members:', error);
      showNotification('Error al cargar la lista de miembros', 'error');
    }
  };

  const handleCheckIn = async () => {
    if (newCheckIn.memberId) {
      try {
        const attendanceData = {
          socio: newCheckIn.memberId,
          fecha_entrada: new Date().toISOString()
        };
        
        await attendanceService.createAttendance(attendanceData);
        showNotification('Check-in registrado exitosamente', 'success');
        
        // Recargar datos
        loadAttendances();
        loadStats();
        
        setNewCheckIn({ memberId: "", memberName: "", activity: "" });
        setShowCheckInModal(false);
      } catch (err) {
        showNotification('Error al registrar check-in', 'error');
        console.error('Error creating attendance:', err);
      }
    }
  };

  const handleCheckOut = async (recordId) => {
    try {
      const updateData = {
        fecha_salida: new Date().toISOString()
      };
      
      await attendanceService.updateAttendance(recordId, updateData);
      showNotification('Check-out registrado exitosamente', 'success');
      
      // Recargar datos
      loadAttendances();
      loadStats();
    } catch (err) {
      showNotification('Error al registrar check-out', 'error');
      console.error('Error updating attendance:', err);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDate = record.date === filters.date;
    const matchesSearch = record.memberName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         record.memberId.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === "all" || record.status === filters.status;
    const matchesMembership = filters.membershipType === "all" || record.membershipType === filters.membershipType;
    const matchesActivity = filters.activity === "all" || record.activity === filters.activity;
    
    return matchesDate && matchesSearch && matchesStatus && matchesMembership && matchesActivity;
  });

  const exportToCSV = () => {
    const csvContent = [
      ['Socio', 'ID', 'Entrada', 'Salida', 'Duración', 'Estado', 'Membresía', 'Actividad'],
      ...filteredRecords.map(record => [
        record.memberName,
        record.memberId,
        record.checkIn,
        record.checkOut || 'Activo',
        record.duration || 'En curso',
        record.status === 'active' ? 'Activo' : 'Completado',
        record.membershipType,
        record.activity
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistencia_${filters.date}.csv`;
    a.click();
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Control de Asistencias
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
          <button
            onClick={() => setShowCheckInModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Registrar Entrada
          </button>
        </div>
      </div>

      {/* Indicador de carga y errores */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando asistencias...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Hoy"
          value={stats.totalToday}
          icon={UserIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Activos Ahora"
          value={stats.activeNow}
          icon={ClockIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Tiempo Promedio"
          value={stats.averageTime}
          icon={ChartBarIcon}
          color="bg-purple-500"
        />
        <StatCard
          title="Hora Pico"
          value={stats.peakHour}
          icon={CalendarIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Asistencia por Hora</h3>
          <Bar data={hourlyData} options={chartOptions} />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Tipo de Membresía</h3>
          <Doughnut data={membershipData} options={doughnutOptions} />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tendencia Semanal</h3>
          <Line data={weeklyData} options={chartOptions} />
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o ID..."
                className="px-3 py-2 pl-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="completed">Completados</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Membresía
            </label>
            <select
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.membershipType}
              onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}
            >
              <option value="all">Todas</option>
              <option value="Básica">Básica</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Actividad
            </label>
            <select
              className="px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.activity}
              onChange={(e) => setFilters({ ...filters, activity: e.target.value })}
            >
              <option value="all">Todas</option>
              {activities.map(activity => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Asistencias */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Registros de Asistencia ({filteredRecords.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Socio
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Entrada
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Salida
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Duración
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Membresía
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actividad
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.memberName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{record.memberId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.checkIn}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.checkOut || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.duration || "En curso"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.status === "active" ? "Activo" : "Completado"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.membershipType === 'VIP' ? 'bg-yellow-100 text-yellow-800' :
                      record.membershipType === 'Premium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.membershipType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.activity}</div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {record.status === "active" ? (
                      <button
                        onClick={() => handleCheckOut(record.id)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Registrar Salida
                      </button>
                    ) : (
                      <button className="text-gray-600 hover:text-gray-900">
                        Ver Detalles
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Check-in */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Registrar Entrada
              </h3>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Socio
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCheckIn.memberId}
                    onChange={(e) => {
                      const member = members.find(m => m.id === e.target.value);
                      setNewCheckIn({
                        ...newCheckIn,
                        memberId: e.target.value,
                        memberName: member ? member.name : ""
                      });
                    }}
                  >
                    <option value="">Seleccionar socio...</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actividad
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCheckIn.activity}
                    onChange={(e) => setNewCheckIn({ ...newCheckIn, activity: e.target.value })}
                  >
                    <option value="">Seleccionar actividad...</option>
                    {activities.map(activity => (
                      <option key={activity} value={activity}>{activity}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCheckIn}
                disabled={!newCheckIn.memberId || !newCheckIn.activity}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Registrar Entrada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;

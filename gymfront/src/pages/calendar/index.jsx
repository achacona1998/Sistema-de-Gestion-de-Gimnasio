import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, Download } from 'lucide-react';
import classService from '../../services/classService';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('month');
  const [classesData, setClassesData] = useState({});
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Ajustar para que lunes sea 0

    const days = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getFullYear() === year && 
                     today.getMonth() === month && 
                     today.getDate() === day;
      days.push({
        day,
        isCurrentMonth: true,
        isToday
      });
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Cargar clases del mes actual
  const loadMonthClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await classService.getClassesByDateRange(
        startOfCurrentMonth.toISOString(),
        endOfCurrentMonth.toISOString()
      );
      
      // Organizar clases por día
      const classesByDay = {};
      const classes = response.results || response;
      
      classes.forEach(classItem => {
        const formattedClass = classService.formatClassForCalendar(classItem);
        const day = formattedClass.day;
        
        if (!classesByDay[day]) {
          classesByDay[day] = [];
        }
        classesByDay[day].push(formattedClass);
      });
      
      setClassesData(classesByDay);
    } catch (error) {
      console.error('Error loading month classes:', error);
      setError('Error al cargar las clases del mes');
      showNotification('Error al cargar las clases del mes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Cargar clases de hoy
  const loadTodayClasses = async () => {
    try {
      const response = await classService.getTodayClasses();
      const classes = response.results || response;
      
      const formattedClasses = await Promise.all(
        classes.map(classItem => classService.formatClassForToday(classItem))
      );
      
      setTodayClasses(formattedClasses);
    } catch (error) {
      console.error('Error loading today classes:', error);
      showNotification('Error al cargar las clases de hoy', 'error');
    }
  };

  // Efectos
  useEffect(() => {
    loadMonthClasses();
  }, [currentDate]);

  useEffect(() => {
    loadTodayClasses();
  }, []);

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Clases Grupales</h1>
            <p className="text-gray-600">Administra horarios, capacidad y reservas de clases grupales</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Gestión de Socios
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Clase
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando clases...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clases</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-gray-500">Esta semana</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reservas</p>
                <p className="text-2xl font-bold text-gray-900">187</p>
                <p className="text-xs text-gray-500">Esta semana</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ocupación</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
                <p className="text-xs text-gray-500">Promedio semanal</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Instructores</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500">Activos</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Calendario de Clases</h2>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['Hoy', 'Semana', 'Mes'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        selectedView === view
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((dayObj, index) => {
                const dayKey = dayObj.day.toString();
                const hasClasses = classesData[dayKey];
                
                return (
                  <div
                    key={index}
                    className={`min-h-[80px] p-1 border border-gray-100 ${
                      dayObj.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${
                      dayObj.isToday ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className={`text-sm ${
                      dayObj.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${
                      dayObj.isToday ? 'font-bold text-blue-600' : ''
                    }`}>
                      {dayObj.day}
                    </div>
                    
                    {hasClasses && dayObj.isCurrentMonth && (
                      <div className="mt-1 space-y-1">
                        {hasClasses.map((classItem, idx) => (
                          <div
                            key={idx}
                            className={`text-xs text-white p-1 rounded ${classItem.color} truncate`}
                          >
                            {classItem.time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Classes */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clases de Hoy</h3>
            <div className="space-y-3">
              {todayClasses.map((classItem, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-8 ${classItem.color} rounded`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{classItem.name}</p>
                        <p className="text-sm text-gray-600">{classItem.time}</p>
                        <p className="text-xs text-gray-500">Instructor: {classItem.instructor}</p>
                        <p className="text-xs text-gray-500">Capacidad: {classItem.capacity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Reservas: {classItem.reservations}</p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 ${classItem.color} rounded-full`}
                            style={{ width: `${(classItem.reservations / classItem.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Recordatorios de clase</p>
                  <p className="text-sm text-gray-600">Enviar 1 hora antes</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Cambios de horario</p>
                  <p className="text-sm text-gray-600">Notificar inmediatamente</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Cancelaciones</p>
                  <p className="text-sm text-gray-600">Notificar inmediatamente</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Plazas disponibles</p>
                  <p className="text-sm text-gray-600">Cuando hay menos de 3</p>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
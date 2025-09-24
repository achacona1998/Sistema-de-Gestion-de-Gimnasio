import React, { useState, useEffect } from "react";
import { Calendar, Clock, Users, MapPin, Star, Plus, Edit, Trash2, Filter, Search, UserCheck } from "lucide-react";
import classService from '../../services/classService';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const ClassModal = ({ classItem, onClose, onSubmit, instructors }) => {
  const [formData, setFormData] = useState({
    name: classItem?.name || "",
    instructor_id: classItem?.instructor_id || "",
    instructor: classItem?.instructor || "",
    description: classItem?.description || "",
    schedule: classItem?.schedule || "",
    duration: classItem?.duration || 60,
    capacity: classItem?.capacity || 15,
    level: classItem?.level || "Todos los niveles",
    room: classItem?.room || "",
    price: classItem?.price || 0,
    days: classItem?.days || [],
    start_date: classItem?.start_date || "",
    end_date: classItem?.end_date || "",
    equipment_needed: classItem?.equipment_needed || "",
    category: classItem?.category || "Fitness"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDayToggle = (day) => {
    const updatedDays = formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day];
    setFormData({ ...formData, days: updatedDays });
  };

  const weekDays = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="p-6 w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {classItem ? "Editar Clase" : "Nueva Clase Grupal"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Nombre de la Clase *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Instructor *
              </label>
              <select
                value={formData.instructor_id}
                onChange={(e) => {
                  const selectedInstructor = instructors.find(i => i.id === parseInt(e.target.value));
                  setFormData({ 
                    ...formData, 
                    instructor_id: e.target.value,
                    instructor: selectedInstructor?.name || ''
                  });
                }}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} - {instructor.specialty}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fitness">Fitness</option>
                <option value="Yoga">Yoga</option>
                <option value="Cardio">Cardio</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Danza">Danza</option>
                <option value="Artes Marciales">Artes Marciales</option>
                <option value="Aqua Fitness">Aqua Fitness</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Nivel
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Todos los niveles">Todos los niveles</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Horario *
              </label>
              <input
                type="time"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="15"
                max="180"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Capacidad Máxima *
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="50"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Sala/Ubicación *
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Precio por Clase
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Equipamiento Necesario
              </label>
              <input
                type="text"
                value={formData.equipment_needed}
                onChange={(e) => setFormData({ ...formData, equipment_needed: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Esterillas, mancuernas, bandas elásticas"
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Días de la Semana *
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {weekDays.map(day => (
                <label key={day.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.days.includes(day.key)}
                    onChange={() => handleDayToggle(day.key)}
                    className="text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe los objetivos y beneficios de la clase..."
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              {classItem ? "Actualizar Clase" : "Crear Clase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClassStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
      <div className="p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clases</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Clases Activas</p>
            <p className="text-2xl font-bold text-green-600">{stats.active || 0}</p>
          </div>
          <UserCheck className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Reservas Hoy</p>
            <p className="text-2xl font-bold text-purple-600">{stats.todayReservations || 0}</p>
          </div>
          <Clock className="w-8 h-8 text-purple-600" />
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Ocupación Promedio</p>
            <p className="text-2xl font-bold text-orange-600">{stats.averageOccupancy || 0}%</p>
          </div>
          <Users className="w-8 h-8 text-orange-600" />
        </div>
      </div>
    </div>
  );
};

const ClassesPage = () => {
  const { showNotification } = useNotification();
  
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Yoga Matutino",
      instructor: "Ana Martínez",
      instructor_id: 1,
      description: "Clase de yoga para comenzar el día con energía y relajación",
      schedule: "08:00",
      duration: 60,
      capacity: 15,
      enrolled: 12,
      level: "Todos los niveles",
      room: "Sala 1",
      price: 15.00,
      category: "Yoga",
      days: ['monday', 'wednesday', 'friday'],
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      equipment_needed: "Esterillas",
      rating: 4.8
    },
    {
      id: 2,
      name: "CrossFit Intensivo",
      instructor: "Carlos Ruiz",
      instructor_id: 2,
      description: "Entrenamiento funcional de alta intensidad",
      schedule: "10:00",
      duration: 45,
      capacity: 12,
      enrolled: 8,
      level: "Intermedio",
      room: "Área CrossFit",
      price: 20.00,
      category: "Fitness",
      days: ['tuesday', 'thursday', 'saturday'],
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      equipment_needed: "Kettlebells, barras, cajas",
      rating: 4.9
    },
    {
      id: 3,
      name: "Spinning Nocturno",
      instructor: "Laura Sánchez",
      instructor_id: 3,
      description: "Cardio intenso con música motivadora",
      schedule: "18:00",
      duration: 45,
      capacity: 20,
      enrolled: 15,
      level: "Todos los niveles",
      room: "Sala Spinning",
      price: 12.00,
      category: "Cardio",
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      start_date: "2024-01-01",
      end_date: "2024-12-31",
      equipment_needed: "Bicicletas estáticas",
      rating: 4.7
    }
  ]);

  const [instructors, setInstructors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    todayReservations: 0,
    averageOccupancy: 0,
  });

  // Cargar instructores desde la API
  const loadInstructors = async () => {
    try {
      const response = await api.get('/instructores/');
      const instructoresData = response.data.results || response.data;
      
      // Formatear datos para la interfaz
      const formattedInstructors = instructoresData.map(instructor => ({
        id: instructor.instructor_id,
        name: `${instructor.nombre} ${instructor.apellido}`,
        specialty: instructor.especialidad || 'General'
      }));
      setInstructors(formattedInstructors);
    } catch (error) {
      console.error('Error loading instructors:', error);
      showNotification('Error al cargar instructores', 'error');
    }
  };

  // Cargar estadísticas desde la API
  const loadClassStats = async () => {
    try {
      const classesResponse = await classService.getClasses();
      const classes = classesResponse.results || classesResponse;
      
      // Calcular estadísticas básicas
      const total = classes.length;
      const active = classes.filter(cls => cls.activa).length;
      
      // Para reservaciones de hoy y ocupación promedio, usar datos simulados por ahora
      // TODO: Implementar endpoints específicos para estas métricas
      setStats({
        total,
        active,
        todayReservations: Math.floor(Math.random() * 50) + 20, // Simulado
        averageOccupancy: Math.floor(Math.random() * 30) + 60, // Simulado
      });
    } catch (error) {
      console.error('Error loading class stats:', error);
      showNotification('Error al cargar estadísticas', 'error');
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    loadInstructors();
    loadClassStats();
  }, []);

  const handleCreateClass = (classData) => {
    const newClass = {
      ...classData,
      id: classes.length + 1,
      enrolled: 0,
      rating: 0
    };
    setClasses([...classes, newClass]);
    setShowModal(false);
  };

  const handleUpdateClass = (classId, classData) => {
    setClasses(classes.map(c => c.id === classId ? { ...c, ...classData } : c));
    setShowModal(false);
    setEditingClass(null);
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta clase?")) {
      setClasses(classes.filter(c => c.id !== classId));
    }
  };

  const handleReserveClass = (classId) => {
    setClasses(classes.map(c => 
      c.id === classId && c.enrolled < c.capacity 
        ? { ...c, enrolled: c.enrolled + 1 }
        : c
    ));
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || classItem.category === categoryFilter;
    const matchesLevel = !levelFilter || classItem.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getOccupancyColor = (enrolled, capacity) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const formatDays = (days) => {
    const dayNames = {
      monday: 'L', tuesday: 'M', wednesday: 'X', thursday: 'J',
      friday: 'V', saturday: 'S', sunday: 'D'
    };
    return days.map(day => dayNames[day]).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clases Grupales</h1>
          <p className="mt-1 text-gray-600">Administra horarios, instructores y reservas de clases</p>
        </div>
        <button
          onClick={() => {
            setEditingClass(null);
            setShowModal(true);
          }}
          className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Nueva Clase
        </button>
      </div>

      <ClassStats stats={stats} />

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar clases o instructores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                <option value="Fitness">Fitness</option>
                <option value="Yoga">Yoga</option>
                <option value="Cardio">Cardio</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Danza">Danza</option>
              </select>
              
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los niveles</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Todos los niveles">Todos los niveles</option>
              </select>
              
              <div className="flex rounded-lg border border-gray-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'} rounded-l-lg transition-colors`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'} rounded-r-lg transition-colors`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((classItem) => (
                <div key={classItem.id} className="bg-white rounded-lg border shadow-sm transition-shadow hover:shadow-md">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="mb-1 text-xl font-bold text-gray-800">{classItem.name}</h3>
                        <p className="mb-2 text-sm text-gray-600">{classItem.instructor}</p>
                        <span className="inline-block px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                          {classItem.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getOccupancyColor(classItem.enrolled, classItem.capacity)}`}>
                          {classItem.enrolled}/{classItem.capacity}
                        </span>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{classItem.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 w-4 h-4" />
                        <span>{classItem.schedule} ({classItem.duration} min)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2 w-4 h-4" />
                        <span>{formatDays(classItem.days)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-2 w-4 h-4" />
                        <span>{classItem.room}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="mr-2 w-4 h-4" />
                        <span>{classItem.level}</span>
                      </div>
                    </div>

                    {classItem.description && (
                      <p className="mb-4 text-sm text-gray-600 line-clamp-2">{classItem.description}</p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        ${classItem.price}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingClass(classItem);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 rounded-lg transition-colors hover:text-blue-800 hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="p-2 text-red-600 rounded-lg transition-colors hover:text-red-800 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReserveClass(classItem.id)}
                          disabled={classItem.enrolled >= classItem.capacity}
                          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            classItem.enrolled >= classItem.capacity
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {classItem.enrolled >= classItem.capacity ? "Completa" : "Reservar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-700">Clase</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Instructor</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Horario</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Días</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Ocupación</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Precio</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((classItem) => (
                    <tr key={classItem.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{classItem.name}</div>
                          <div className="text-sm text-gray-500">{classItem.category} - {classItem.level}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{classItem.instructor}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{classItem.schedule}</div>
                        <div className="text-xs text-gray-500">{classItem.duration} min</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{formatDays(classItem.days)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-medium ${getOccupancyColor(classItem.enrolled, classItem.capacity)}`}>
                          {classItem.enrolled}/{classItem.capacity}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-green-600">${classItem.price}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingClass(classItem);
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 rounded-lg transition-colors hover:text-blue-800 hover:bg-blue-50"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(classItem.id)}
                            className="p-2 text-red-600 rounded-lg transition-colors hover:text-red-800 hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ClassModal
          classItem={editingClass}
          instructors={instructors}
          onClose={() => {
            setShowModal(false);
            setEditingClass(null);
          }}
          onSubmit={(data) =>
            editingClass
              ? handleUpdateClass(editingClass.id, data)
              : handleCreateClass(data)
          }
        />
      )}
    </div>
  );
};

export default ClassesPage;

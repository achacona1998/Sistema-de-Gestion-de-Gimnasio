import React, { useState } from 'react';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  Cog6ToothIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationsPage = () => {
  const {
    notifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
  } = useNotifications();

  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    priority: 'all',
    read: 'all',
    search: '',
  });

  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      memberships: 'Membresías',
      payments: 'Pagos',
      classes: 'Clases',
      equipment: 'Equipamiento',
      reminders: 'Recordatorios',
    };
    return labels[category] || category;
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesCategory = filters.category === 'all' || notification.category === filters.category;
    const matchesType = filters.type === 'all' || notification.type === filters.type;
    const matchesPriority = filters.priority === 'all' || notification.priority === filters.priority;
    const matchesRead = filters.read === 'all' || 
      (filters.read === 'read' && notification.read) ||
      (filters.read === 'unread' && !notification.read);
    const matchesSearch = filters.search === '' ||
      notification.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      notification.message.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesType && matchesPriority && matchesRead && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => markAsRead(id));
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => deleteNotification(id));
    setSelectedNotifications([]);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
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
          Centro de Notificaciones
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            <Cog6ToothIcon className="mr-2 w-4 h-4" />
            Configuración
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <CheckIcon className="mr-2 w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total"
          value={notifications.length}
          icon={BellIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="No Leídas"
          value={unreadCount}
          icon={ExclamationTriangleIcon}
          color="bg-red-500"
        />
        <StatCard
          title="Hoy"
          value={notifications.filter(n => 
            new Date(n.timestamp).toDateString() === new Date().toDateString()
          ).length}
          icon={InformationCircleIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Alta Prioridad"
          value={notifications.filter(n => n.priority === 'high').length}
          icon={XCircleIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Filtros */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-800">
            <FunnelIcon className="mr-2 w-5 h-5" />
            Filtros
          </h2>
          <button
            onClick={() => setFilters({
              category: 'all',
              type: 'all',
              priority: 'all',
              read: 'all',
              search: '',
            })}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpiar filtros
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="px-3 py-2 pl-10 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="all">Todas</option>
              <option value="memberships">Membresías</option>
              <option value="payments">Pagos</option>
              <option value="classes">Clases</option>
              <option value="equipment">Equipamiento</option>
              <option value="reminders">Recordatorios</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">Todos</option>
              <option value="info">Información</option>
              <option value="success">Éxito</option>
              <option value="warning">Advertencia</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Prioridad
            </label>
            <select
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.read}
              onChange={(e) => setFilters({ ...filters, read: e.target.value })}
            >
              <option value="all">Todas</option>
              <option value="unread">No leídas</option>
              <option value="read">Leídas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Acciones en lote */}
      {selectedNotifications.length > 0 && (
        <div className="p-4 mb-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-800">
              {selectedNotifications.length} notificación(es) seleccionada(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Marcar como leídas
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Notificaciones */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Notificaciones ({filteredNotifications.length})
            </h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={handleSelectAll}
                  className="mr-2 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Seleccionar todas</span>
              </label>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Limpiar todas
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <BellIcon className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No hay notificaciones
              </h3>
              <p className="text-gray-500">
                {filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.priority !== 'all' || filters.read !== 'all'
                  ? 'No se encontraron notificaciones que coincidan con los filtros.'
                  : 'No tienes notificaciones en este momento.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="mt-1 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-2">
                          <h4 className={`text-sm font-medium text-gray-900 ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getPriorityColor(notification.priority)
                          }`}>
                            {notification.priority === 'high' ? 'Alta' :
                             notification.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                            {getCategoryLabel(notification.category)}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center ml-4 space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 rounded-md hover:text-blue-600"
                            title="Marcar como leída"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 rounded-md hover:text-red-600"
                          title="Eliminar"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Configuración */}
      {showSettings && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Configuración de Notificaciones
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Métodos de notificación */}
              <div>
                <h4 className="mb-3 font-medium text-gray-900 text-md">
                  Métodos de Notificación
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => updateSettings({ emailNotifications: e.target.checked })}
                      className="mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Notificaciones por email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => updateSettings({ pushNotifications: e.target.checked })}
                      className="mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Notificaciones push</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => updateSettings({ smsNotifications: e.target.checked })}
                      className="mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Notificaciones por SMS</span>
                  </label>
                </div>
              </div>

              {/* Categorías */}
              <div>
                <h4 className="mb-3 font-medium text-gray-900 text-md">
                  Categorías
                </h4>
                <div className="space-y-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateSettings({
                          categories: {
                            ...settings.categories,
                            [category]: e.target.checked
                          }
                        })}
                        className="mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {getCategoryLabel(category)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prioridades */}
              <div>
                <h4 className="mb-3 font-medium text-gray-900 text-md">
                  Prioridades
                </h4>
                <div className="space-y-3">
                  {Object.entries(settings.priorities).map(([priority, enabled]) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => updateSettings({
                          priorities: {
                            ...settings.priorities,
                            [priority]: e.target.checked
                          }
                        })}
                        className="mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Prioridad {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 space-x-3 border-t">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
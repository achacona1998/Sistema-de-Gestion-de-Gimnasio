import React, { createContext, useContext, useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Alias para compatibilidad
export const useNotification = useNotifications;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    categories: {
      memberships: true,
      payments: true,
      classes: true,
      equipment: true,
      reminders: true,
      system: true,
    },
    priorities: {
      high: true,
      medium: true,
      low: false,
    },
  });
  const [toasts, setToasts] = useState([]);

  // Cargar notificaciones al inicializar
  useEffect(() => {
    loadNotifications();
    loadSettings();
    loadUnreadCount();
  }, []);

  // Cargar notificaciones desde la API
  const loadNotifications = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotifications(params);
      
      // Transformar datos de la API al formato del frontend
      const transformedNotifications = data.results?.map(notification => ({
        id: notification.notification_id,
        type: notification.notification_type,
        title: notification.title,
        message: notification.message,
        timestamp: new Date(notification.created_at),
        read: notification.read,
        category: notification.category,
        priority: notification.priority,
        socio: notification.socio,
        reference_id: notification.reference_id,
        time_ago: notification.time_ago,
      })) || [];
      
      setNotifications(transformedNotifications);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Error al cargar las notificaciones');
      // Fallback a datos de ejemplo en caso de error
      setNotifications([
        {
          id: 1,
          type: 'info',
          title: 'Bienvenido al sistema',
          message: 'Sistema de notificaciones inicializado',
          timestamp: new Date(),
          read: false,
          category: 'system',
          priority: 'medium',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar configuración de notificaciones
  const loadSettings = async () => {
    try {
      const data = await notificationService.getSettings();
      setSettings({
        emailNotifications: data.email_notifications,
        pushNotifications: data.push_notifications,
        smsNotifications: data.sms_notifications,
        categories: {
          memberships: data.memberships_enabled,
          payments: data.payments_enabled,
          classes: data.classes_enabled,
          equipment: data.equipment_enabled,
          reminders: data.reminders_enabled,
          system: data.system_enabled,
        },
        priorities: {
          high: data.high_priority_enabled,
          medium: data.medium_priority_enabled,
          low: data.low_priority_enabled,
        },
      });
    } catch (err) {
      console.error('Error loading notification settings:', err);
    }
  };

  // Cargar conteo de no leídas
  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error loading unread count:', err);
      // Calcular desde las notificaciones locales como fallback
      const localUnreadCount = notifications.filter(n => !n.read).length;
      setUnreadCount(localUnreadCount);
    }
  };

  // Agregar nueva notificación
  const addNotification = async (notification) => {
    try {
      const newNotification = await notificationService.createNotification({
        title: notification.title,
        message: notification.message,
        notification_type: notification.type || 'info',
        category: notification.category || 'system',
        priority: notification.priority || 'medium',
        socio: notification.socio,
        reference_id: notification.reference_id,
      });
      
      // Agregar a la lista local
      const transformedNotification = {
        id: newNotification.notification_id,
        type: newNotification.notification_type,
        title: newNotification.title,
        message: newNotification.message,
        timestamp: new Date(newNotification.created_at),
        read: newNotification.read,
        category: newNotification.category,
        priority: newNotification.priority,
        socio: newNotification.socio,
        reference_id: newNotification.reference_id,
      };
      
      setNotifications(prev => [transformedNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Mostrar toast si está habilitado
      if (settings.categories[notification.category] && 
          settings.priorities[notification.priority]) {
        showToast(transformedNotification);
      }
      
      return transformedNotification;
    } catch (err) {
      console.error('Error creating notification:', err);
      throw err;
    }
  };

  // Marcar notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Actualizar localmente como fallback
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      // Actualizar localmente como fallback
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  // Limpiar todas las notificaciones
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Actualizar configuración
  const updateSettings = async (newSettings) => {
    try {
      const apiSettings = {
        email_notifications: newSettings.emailNotifications,
        push_notifications: newSettings.pushNotifications,
        sms_notifications: newSettings.smsNotifications,
        memberships_enabled: newSettings.categories.memberships,
        payments_enabled: newSettings.categories.payments,
        classes_enabled: newSettings.categories.classes,
        equipment_enabled: newSettings.categories.equipment,
        reminders_enabled: newSettings.categories.reminders,
        system_enabled: newSettings.categories.system,
        high_priority_enabled: newSettings.priorities.high,
        medium_priority_enabled: newSettings.priorities.medium,
        low_priority_enabled: newSettings.priorities.low,
      };
      
      await notificationService.updateSettings(apiSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error('Error updating notification settings:', err);
      throw err;
    }
  };

  // Mostrar toast
  const showToast = (notification) => {
    const toast = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
    };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  // Remover toast
  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  // Filtrar notificaciones
  const getFilteredNotifications = (filters = {}) => {
    return notifications.filter(notification => {
      if (filters.category && notification.category !== filters.category) {
        return false;
      }
      if (filters.priority && notification.priority !== filters.priority) {
        return false;
      }
      if (filters.read !== undefined && notification.read !== filters.read) {
        return false;
      }
      if (filters.type && notification.type !== filters.type) {
        return false;
      }
      return true;
    });
  };

  // Obtener estadísticas
  const getStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const byCategory = notifications.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {});
    const byPriority = notifications.reduce((acc, n) => {
      acc[n.priority] = (acc[n.priority] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total,
      unread,
      byCategory,
      byPriority,
    };
  };

  const value = {
    notifications,
    loading,
    error,
    unreadCount,
    settings,
    toasts,
    
    // Métodos
    loadNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    showToast,
    removeToast,
    getFilteredNotifications,
    getStats,
    loadUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
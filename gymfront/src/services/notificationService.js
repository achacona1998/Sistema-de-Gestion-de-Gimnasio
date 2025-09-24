import api from './api.js';

class NotificationService {
  // Obtener todas las notificaciones del usuario
  async getNotifications(params = {}) {
    try {
      const response = await api.get('/notifications/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Obtener el conteo de notificaciones no leídas
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread_count/');
      return response.data.unread_count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Marcar una notificación como leída
  async markAsRead(notificationId) {
    try {
      const response = await api.post(`/notifications/${notificationId}/mark_read/`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    try {
      const response = await api.post('/notifications/mark_all_read/');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Crear una nueva notificación
  async createNotification(notificationData) {
    try {
      const response = await api.post('/notifications/', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Eliminar una notificación
  async deleteNotification(notificationId) {
    try {
      await api.delete(`/notifications/${notificationId}/`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Obtener estadísticas de notificaciones
  async getStats() {
    try {
      const response = await api.get('/notifications/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  // Obtener configuración de notificaciones del usuario
  async getSettings() {
    try {
      const response = await api.get('/settings/my_settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  // Actualizar configuración de notificaciones
  async updateSettings(settings) {
    try {
      const response = await api.patch('/settings/my_settings/', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // Crear notificaciones en lote
  async bulkCreate(bulkData) {
    try {
      const response = await api.post('/notifications/bulk_create/', bulkData);
      return response.data;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // Obtener plantillas de notificaciones
  async getTemplates(params = {}) {
    try {
      const response = await api.get('/templates/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      throw error;
    }
  }

  // Crear plantilla de notificación
  async createTemplate(templateData) {
    try {
      const response = await api.post('/templates/', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification template:', error);
      throw error;
    }
  }

  // Activar/desactivar plantilla
  async toggleTemplate(templateId) {
    try {
      const response = await api.post(`/templates/${templateId}/toggle_active/`);
      return response.data;
    } catch (error) {
      console.error('Error toggling template:', error);
      throw error;
    }
  }

  // Obtener logs de notificaciones
  async getLogs(params = {}) {
    try {
      const response = await api.get('/logs/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notification logs:', error);
      throw error;
    }
  }

  // Obtener estadísticas de entrega
  async getDeliveryStats() {
    try {
      const response = await api.get('/logs/delivery_stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery stats:', error);
      throw error;
    }
  }
}

export default new NotificationService();
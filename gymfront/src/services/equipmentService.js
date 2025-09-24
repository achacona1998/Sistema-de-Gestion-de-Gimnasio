import api from './api.js';

class EquipmentService {
  // Obtener todo el equipamiento
  async getEquipment(params = {}) {
    try {
      const response = await api.get('/equipos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw error;
    }
  }

  // Obtener un equipo por ID
  async getEquipmentItem(id) {
    try {
      const response = await api.get(`/equipos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment item:', error);
      throw error;
    }
  }

  // Crear nuevo equipo
  async createEquipment(equipmentData) {
    try {
      const response = await api.post('/equipos/', equipmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw error;
    }
  }

  // Actualizar equipo
  async updateEquipment(id, equipmentData) {
    try {
      const response = await api.put(`/equipos/${id}/`, equipmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;
    }
  }

  // Eliminar equipo
  async deleteEquipment(id) {
    try {
      await api.delete(`/equipos/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting equipment:', error);
      throw error;
    }
  }

  // Obtener equipos disponibles
  async getAvailableEquipment() {
    try {
      const response = await api.get('/equipos/', {
        params: { estado: 'disponible' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available equipment:', error);
      throw error;
    }
  }

  // Obtener equipos en mantenimiento
  async getMaintenanceEquipment() {
    try {
      const response = await api.get('/equipos/', {
        params: { estado: 'mantenimiento' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance equipment:', error);
      throw error;
    }
  }

  // Obtener equipos fuera de servicio
  async getOutOfServiceEquipment() {
    try {
      const response = await api.get('/equipos/', {
        params: { estado: 'fuera_de_servicio' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching out of service equipment:', error);
      throw error;
    }
  }

  // Cambiar estado del equipo
  async changeEquipmentStatus(id, newStatus, notes = '') {
    try {
      const response = await api.patch(`/equipos/${id}/`, {
        estado: newStatus,
        notas_estado: notes
      });
      return response.data;
    } catch (error) {
      console.error('Error changing equipment status:', error);
      throw error;
    }
  }

  // Programar mantenimiento
  async scheduleMaintenanceEquipment(id, maintenanceData) {
    try {
      const response = await api.post(`/equipos/${id}/mantenimiento/`, maintenanceData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      throw error;
    }
  }

  // Obtener historial de mantenimiento
  async getMaintenanceHistory(equipmentId) {
    try {
      const response = await api.get(`/equipos/${equipmentId}/historial-mantenimiento/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      throw error;
    }
  }

  // Reportar problema
  async reportProblem(equipmentId, problemData) {
    try {
      const response = await api.post(`/equipos/${equipmentId}/reportar-problema/`, problemData);
      return response.data;
    } catch (error) {
      console.error('Error reporting problem:', error);
      throw error;
    }
  }

  // Obtener reportes de problemas
  async getProblemReports(equipmentId = null, params = {}) {
    try {
      const url = equipmentId ? `/equipos/${equipmentId}/problemas/` : '/equipos/problemas/';
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching problem reports:', error);
      throw error;
    }
  }

  // Resolver problema
  async resolveProblem(problemId, resolutionData) {
    try {
      const response = await api.patch(`/equipos/problemas/${problemId}/`, {
        estado: 'resuelto',
        ...resolutionData
      });
      return response.data;
    } catch (error) {
      console.error('Error resolving problem:', error);
      throw error;
    }
  }

  // Buscar equipos
  async searchEquipment(query, filters = {}) {
    try {
      const response = await api.get('/equipos/buscar/', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching equipment:', error);
      throw error;
    }
  }

  // Obtener equipos por categoría
  async getEquipmentByCategory(category) {
    try {
      const response = await api.get('/equipos/', {
        params: { categoria: category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by category:', error);
      throw error;
    }
  }

  // Obtener categorías de equipos
  async getEquipmentCategories() {
    try {
      const response = await api.get('/equipos/categorias/');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment categories:', error);
      throw error;
    }
  }

  // Obtener estadísticas de equipos
  async getEquipmentStats() {
    try {
      const response = await api.get('/equipos/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      throw error;
    }
  }

  // Obtener uso del equipo
  async getEquipmentUsage(equipmentId, params = {}) {
    try {
      const response = await api.get(`/equipos/${equipmentId}/uso/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment usage:', error);
      throw error;
    }
  }

  // Registrar uso del equipo
  async registerEquipmentUsage(equipmentId, usageData) {
    try {
      const response = await api.post(`/equipos/${equipmentId}/registrar-uso/`, usageData);
      return response.data;
    } catch (error) {
      console.error('Error registering equipment usage:', error);
      throw error;
    }
  }

  // Obtener equipos próximos a mantenimiento
  async getUpcomingMaintenance(days = 30) {
    try {
      const response = await api.get('/equipos/proximo-mantenimiento/', {
        params: { dias: days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming maintenance:', error);
      throw error;
    }
  }

  // Actualizar foto del equipo
  async updateEquipmentPhoto(equipmentId, photoFile) {
    try {
      const formData = new FormData();
      formData.append('foto', photoFile);
      
      const response = await api.patch(`/equipos/${equipmentId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating equipment photo:', error);
      throw error;
    }
  }

  // Generar código QR para el equipo
  async generateQRCode(equipmentId) {
    try {
      const response = await api.get(`/equipos/${equipmentId}/qr-code/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  // Obtener manual del equipo
  async getEquipmentManual(equipmentId) {
    try {
      const response = await api.get(`/equipos/${equipmentId}/manual/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment manual:', error);
      throw error;
    }
  }

  // Subir manual del equipo
  async uploadEquipmentManual(equipmentId, manualFile) {
    try {
      const formData = new FormData();
      formData.append('manual', manualFile);
      
      const response = await api.post(`/equipos/${equipmentId}/manual/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading equipment manual:', error);
      throw error;
    }
  }

  // Exportar inventario
  async exportInventory(format = 'pdf', filters = {}) {
    try {
      const response = await api.get('/equipos/exportar-inventario/', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting inventory:', error);
      throw error;
    }
  }

  // Importar equipos desde archivo
  async importEquipment(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/equipos/importar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing equipment:', error);
      throw error;
    }
  }

  // Obtener alertas de equipos
  async getEquipmentAlerts() {
    try {
      const response = await api.get('/equipos/alertas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment alerts:', error);
      throw error;
    }
  }

  // Marcar alerta como vista
  async markAlertAsViewed(alertId) {
    try {
      const response = await api.patch(`/equipos/alertas/${alertId}/`, {
        visto: true
      });
      return response.data;
    } catch (error) {
      console.error('Error marking alert as viewed:', error);
      throw error;
    }
  }

  // Configurar recordatorios de mantenimiento
  async setMaintenanceReminder(equipmentId, reminderData) {
    try {
      const response = await api.post(`/equipos/${equipmentId}/recordatorio-mantenimiento/`, reminderData);
      return response.data;
    } catch (error) {
      console.error('Error setting maintenance reminder:', error);
      throw error;
    }
  }
}

export default new EquipmentService();
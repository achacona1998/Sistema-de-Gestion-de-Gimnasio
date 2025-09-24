import apiClient, { createBaseService } from './apiClient.js';

// Crear servicio base para socios
const baseService = createBaseService('socios');

class SocioService {
  // Métodos CRUD básicos utilizando el servicio base
  async getSocios(params = {}) {
    return baseService.getAll(params);
  }

  async getSocio(id) {
    return baseService.getById(id);
  }

  async createSocio(socioData) {
    return baseService.create(socioData);
  }

  async updateSocio(id, socioData) {
    return baseService.update(id, socioData);
  }

  async deleteSocio(id) {
    return baseService.delete(id);
  }

  // Métodos específicos para socios

  // Buscar socios
  async searchSocios(query) {
    try {
      const response = await apiClient.get('/socios/buscar/', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching socios:', error);
      throw error;
    }
  }

  // Obtener estadísticas de socios
  async getSocioStats() {
    try {
      const response = await apiClient.get('/socios/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching socio stats:', error);
      throw error;
    }
  }

  // Obtener socios activos
  async getActiveSocios() {
    return this.getSocios({ activo: true });
  }

  // Obtener socios inactivos
  async getInactiveSocios() {
    return this.getSocios({ activo: false });
  }

  // Activar/Desactivar socio
  async toggleSocioStatus(id, activo) {
    return baseService.patch(id, { activo });  
  }

  // Obtener historial de pagos del socio
  async getSocioPayments(socioId) {
    try {
      const response = await apiClient.get(`/pagos/`, {
        params: { socio: socioId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching socio payments:', error);
      throw error;
    }
  }

  // Obtener clases del socio
  async getSocioClasses(socioId) {
    try {
      const response = await apiClient.get(`/socio-clases/`, {
        params: { socio: socioId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching socio classes:', error);
      throw error;
    }
  }

  // Obtener asistencias del socio
  async getSocioAttendance(socioId, params = {}) {
    try {
      const response = await apiClient.get(`/asistencias/`, {
        params: { socio: socioId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching socio attendance:', error);
      throw error;
    }
  }

  // Registrar asistencia
  async registerAttendance(socioId, claseId = null) {
    try {
      const response = await apiClient.post('/asistencias/', {
        socio: socioId,
        clase: claseId,
        fecha_hora: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error registering attendance:', error);
      throw error;
    }
  }

  // Obtener membresía actual del socio
  async getCurrentMembership(socioId) {
    try {
      const response = await apiClient.get(`/membresias/`, {
        params: { socio: socioId, activa: true }
      });
      return response.data.results?.[0] || null;
    } catch (error) {
      console.error('Error fetching current membership:', error);
      throw error;
    }
  }

  // Verificar acceso del socio
  async checkAccess(socioId) {
    try {
      const response = await apiClient.get(`/socios/${socioId}/verificar-acceso/`);
      return response.data;
    } catch (error) {
      console.error('Error checking socio access:', error);
      throw error;
    }
  }

  // Obtener perfil completo del socio
  async getSocioProfile(socioId) {
    try {
      const response = await apiClient.get(`/socios/${socioId}/perfil/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching socio profile:', error);
      throw error;
    }
  }

  // Actualizar foto del socio
  async updateSocioPhoto(socioId, photoFile) {
    try {
      const formData = new FormData();
      formData.append('foto', photoFile);
      
      const response = await apiClient.patch(`/socios/${socioId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating socio photo:', error);
      throw error;
    }
  }

  // Exportar datos de socios
  async exportSocios(format = 'csv', filters = {}) {
    try {
      const response = await apiClient.get('/socios/exportar/', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting socios:', error);
      throw error;
    }
  }

  // Importar socios desde archivo
  async importSocios(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/socios/importar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing socios:', error);
      throw error;
    }
  }
}

export default new SocioService();
import api from './api.js';

class TrainerService {
  // Obtener todos los entrenadores
  async getTrainers(params = {}) {
    try {
      const response = await api.get('/entrenadores/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainers:', error);
      throw error;
    }
  }

  // Obtener un entrenador por ID
  async getTrainer(id) {
    try {
      const response = await api.get(`/entrenadores/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer:', error);
      throw error;
    }
  }

  // Crear nuevo entrenador
  async createTrainer(trainerData) {
    try {
      const response = await api.post('/entrenadores/', trainerData);
      return response.data;
    } catch (error) {
      console.error('Error creating trainer:', error);
      throw error;
    }
  }

  // Actualizar entrenador
  async updateTrainer(id, trainerData) {
    try {
      const response = await api.put(`/entrenadores/${id}/`, trainerData);
      return response.data;
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  }

  // Eliminar entrenador
  async deleteTrainer(id) {
    try {
      await api.delete(`/entrenadores/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  }

  // Obtener entrenadores activos
  async getActiveTrainers() {
    try {
      const response = await api.get('/entrenadores/', {
        params: { activo: true }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active trainers:', error);
      throw error;
    }
  }

  // Obtener clases de un entrenador
  async getTrainerClasses(trainerId, params = {}) {
    try {
      const response = await api.get('/clases/', {
        params: { entrenador: trainerId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer classes:', error);
      throw error;
    }
  }

  // Obtener horario del entrenador
  async getTrainerSchedule(trainerId, startDate, endDate) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/horario/`, {
        params: {
          fecha_inicio: startDate,
          fecha_fin: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer schedule:', error);
      throw error;
    }
  }

  // Verificar disponibilidad del entrenador
  async checkAvailability(trainerId, dateTime, duration) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/disponibilidad/`, {
        params: {
          fecha_hora: dateTime,
          duracion: duration
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking trainer availability:', error);
      throw error;
    }
  }

  // Obtener especialidades del entrenador
  async getTrainerSpecialties(trainerId) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/especialidades/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer specialties:', error);
      throw error;
    }
  }

  // Actualizar especialidades del entrenador
  async updateTrainerSpecialties(trainerId, specialties) {
    try {
      const response = await api.put(`/entrenadores/${trainerId}/especialidades/`, {
        especialidades: specialties
      });
      return response.data;
    } catch (error) {
      console.error('Error updating trainer specialties:', error);
      throw error;
    }
  }

  // Obtener certificaciones del entrenador
  async getTrainerCertifications(trainerId) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/certificaciones/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer certifications:', error);
      throw error;
    }
  }

  // Agregar certificación
  async addCertification(trainerId, certificationData) {
    try {
      const response = await api.post(`/entrenadores/${trainerId}/certificaciones/`, certificationData);
      return response.data;
    } catch (error) {
      console.error('Error adding certification:', error);
      throw error;
    }
  }

  // Obtener estadísticas del entrenador
  async getTrainerStats(trainerId, params = {}) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/estadisticas/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      throw error;
    }
  }

  // Obtener evaluaciones del entrenador
  async getTrainerRatings(trainerId, params = {}) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/evaluaciones/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer ratings:', error);
      throw error;
    }
  }

  // Agregar evaluación
  async addRating(trainerId, ratingData) {
    try {
      const response = await api.post(`/entrenadores/${trainerId}/evaluaciones/`, ratingData);
      return response.data;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  // Buscar entrenadores
  async searchTrainers(query, filters = {}) {
    try {
      const response = await api.get('/entrenadores/buscar/', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching trainers:', error);
      throw error;
    }
  }

  // Obtener entrenadores por especialidad
  async getTrainersBySpecialty(specialty) {
    try {
      const response = await api.get('/entrenadores/', {
        params: { especialidad: specialty }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainers by specialty:', error);
      throw error;
    }
  }

  // Asignar entrenador a clase
  async assignToClass(trainerId, classId) {
    try {
      const response = await api.post(`/entrenadores/${trainerId}/asignar-clase/`, {
        clase: classId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning trainer to class:', error);
      throw error;
    }
  }

  // Desasignar entrenador de clase
  async unassignFromClass(trainerId, classId) {
    try {
      const response = await api.post(`/entrenadores/${trainerId}/desasignar-clase/`, {
        clase: classId
      });
      return response.data;
    } catch (error) {
      console.error('Error unassigning trainer from class:', error);
      throw error;
    }
  }

  // Obtener historial de clases
  async getClassHistory(trainerId, params = {}) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/historial-clases/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching class history:', error);
      throw error;
    }
  }

  // Actualizar foto del entrenador
  async updateTrainerPhoto(trainerId, photoFile) {
    try {
      const formData = new FormData();
      formData.append('foto', photoFile);
      
      const response = await api.patch(`/entrenadores/${trainerId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating trainer photo:', error);
      throw error;
    }
  }

  // Configurar horario de trabajo
  async setWorkingHours(trainerId, workingHours) {
    try {
      const response = await api.put(`/entrenadores/${trainerId}/horario-trabajo/`, {
        horario: workingHours
      });
      return response.data;
    } catch (error) {
      console.error('Error setting working hours:', error);
      throw error;
    }
  }

  // Obtener horario de trabajo
  async getWorkingHours(trainerId) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/horario-trabajo/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching working hours:', error);
      throw error;
    }
  }

  // Marcar ausencia
  async markAbsence(trainerId, absenceData) {
    try {
      const response = await api.post(`/entrenadores/${trainerId}/ausencias/`, absenceData);
      return response.data;
    } catch (error) {
      console.error('Error marking absence:', error);
      throw error;
    }
  }

  // Obtener ausencias
  async getAbsences(trainerId, params = {}) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/ausencias/`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching absences:', error);
      throw error;
    }
  }

  // Exportar reporte de entrenador
  async exportTrainerReport(trainerId, format = 'pdf', params = {}) {
    try {
      const response = await api.get(`/entrenadores/${trainerId}/reporte/`, {
        params: { format, ...params },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting trainer report:', error);
      throw error;
    }
  }

  // Obtener todas las especialidades disponibles
  async getAllSpecialties() {
    try {
      const response = await api.get('/entrenadores/especialidades/');
      return response.data;
    } catch (error) {
      console.error('Error fetching all specialties:', error);
      throw error;
    }
  }

  // Activar/Desactivar entrenador
  async toggleTrainerStatus(trainerId, activo) {
    try {
      const response = await api.patch(`/entrenadores/${trainerId}/`, { activo });
      return response.data;
    } catch (error) {
      console.error('Error toggling trainer status:', error);
      throw error;
    }
  }
}

export default new TrainerService();
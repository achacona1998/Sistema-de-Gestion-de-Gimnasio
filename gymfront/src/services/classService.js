import api from "./api.js";

class ClassService {
  // Obtener todas las clases
  async getClasses(params = {}) {
    try {
      const response = await api.get("/clases/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  }

  // Obtener una clase por ID
  async getClass(id) {
    try {
      const response = await api.get(`/clases/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching class:", error);
      throw error;
    }
  }

  // Crear nueva clase
  async createClass(classData) {
    try {
      const response = await api.post("/clases/", classData);
      return response.data;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  }

  // Actualizar clase
  async updateClass(id, classData) {
    try {
      const response = await api.put(`/clases/${id}/`, classData);
      return response.data;
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  }

  // Eliminar clase
  async deleteClass(id) {
    try {
      await api.delete(`/clases/${id}/`);
      return true;
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  }

  // Obtener clases por fecha
  async getClassesByDate(date) {
    try {
      const response = await api.get("/clases/", {
        params: { fecha: date },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching classes by date:", error);
      throw error;
    }
  }

  // Obtener clases por entrenador
  async getClassesByTrainer(trainerId) {
    try {
      const response = await api.get("/clases/", {
        params: { entrenador: trainerId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching classes by trainer:", error);
      throw error;
    }
  }

  // Obtener horario semanal
  async getWeeklySchedule(startDate) {
    try {
      const response = await api.get("/clases/horario-semanal/", {
        params: { fecha_inicio: startDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching weekly schedule:", error);
      throw error;
    }
  }

  // Inscribir socio a clase
  async enrollMember(classId, socioId) {
    try {
      const response = await api.post("/socio-clases/", {
        clase: classId,
        socio: socioId,
        fecha_inscripcion: new Date().toISOString().split("T")[0],
      });
      return response.data;
    } catch (error) {
      console.error("Error enrolling member:", error);
      throw error;
    }
  }

  // Desinscribir socio de clase
  async unenrollMember(enrollmentId) {
    try {
      await api.delete(`/socio-clases/${enrollmentId}/`);
      return true;
    } catch (error) {
      console.error("Error unenrolling member:", error);
      throw error;
    }
  }

  // Obtener inscripciones de una clase
  async getClassEnrollments(classId) {
    try {
      const response = await api.get("/socio-clases/", {
        params: { clase: classId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching class enrollments:", error);
      throw error;
    }
  }

  // Obtener disponibilidad de clase
  async getClassAvailability(classId) {
    try {
      const response = await api.get(`/clases/${classId}/disponibilidad/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching class availability:", error);
      throw error;
    }
  }

  // Marcar asistencia a clase
  async markAttendance(classId, socioId, attended = true) {
    try {
      const response = await api.post("/asistencias/", {
        clase: classId,
        socio: socioId,
        fecha_hora: new Date().toISOString(),
        asistio: attended,
      });
      return response.data;
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  }

  // Obtener asistencias de una clase
  async getClassAttendance(classId) {
    try {
      const response = await api.get("/asistencias/", {
        params: { clase: classId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching class attendance:", error);
      throw error;
    }
  }

  // Cancelar clase
  async cancelClass(classId, reason) {
    try {
      const response = await api.post(`/clases/${classId}/cancelar/`, {
        motivo: reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error canceling class:", error);
      throw error;
    }
  }

  // Reprogramar clase
  async rescheduleClass(classId, newDateTime) {
    try {
      const response = await api.post(`/clases/${classId}/reprogramar/`, {
        nueva_fecha_hora: newDateTime,
      });
      return response.data;
    } catch (error) {
      console.error("Error rescheduling class:", error);
      throw error;
    }
  }

  // Obtener estadísticas de clases
  async getClassStats(params = {}) {
    try {
      const response = await api.get("/clases/estadisticas/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching class stats:", error);
      throw error;
    }
  }

  // Obtener clases populares
  async getPopularClasses(limit = 10) {
    try {
      const response = await api.get("/clases/populares/", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching popular classes:", error);
      throw error;
    }
  }

  // Buscar clases
  async searchClasses(query, filters = {}) {
    try {
      const response = await api.get("/clases/buscar/", {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching classes:", error);
      throw error;
    }
  }

  // Obtener tipos de clase
  async getClassTypes() {
    try {
      const response = await api.get("/clases/tipos/");
      return response.data;
    } catch (error) {
      console.error("Error fetching class types:", error);
      throw error;
    }
  }

  // Duplicar clase
  async duplicateClass(classId, newDate) {
    try {
      const response = await api.post(`/clases/${classId}/duplicar/`, {
        nueva_fecha: newDate,
      });
      return response.data;
    } catch (error) {
      console.error("Error duplicating class:", error);
      throw error;
    }
  }

  // Crear clase recurrente
  async createRecurringClass(classData, recurrenceData) {
    try {
      const response = await api.post("/clases/recurrente/", {
        ...classData,
        recurrencia: recurrenceData,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating recurring class:", error);
      throw error;
    }
  }

  // Obtener conflictos de horario
  async getScheduleConflicts(classData) {
    try {
      const response = await api.post(
        "/clases/verificar-conflictos/",
        classData
      );
      return response.data;
    } catch (error) {
      console.error("Error checking schedule conflicts:", error);
      throw error;
    }
  }

  // Exportar horario
  async exportSchedule(format = "pdf", filters = {}) {
    try {
      const response = await api.get("/clases/exportar-horario/", {
        params: { format, ...filters },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error exporting schedule:", error);
      throw error;
    }
  }

  // Métodos específicos para el calendario

  // Obtener clases por rango de fechas (para calendario)
  async getClassesByDateRange(startDate, endDate) {
    try {
      const params = {
        horario__gte: startDate,
        horario__lte: endDate,
        ordering: "horario",
      };
      const response = await api.get("/clases/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching classes by date range:", error);
      throw error;
    }
  }

  // Obtener clases de hoy
  async getTodayClasses() {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const params = {
        horario__gte: startOfDay.toISOString(),
        horario__lt: endOfDay.toISOString(),
        ordering: "horario",
      };
      const response = await api.get("/clases/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching today classes:", error);
      throw error;
    }
  }

  // Formatear datos de clase para el calendario
  formatClassForCalendar(classData) {
    const classDate = new Date(classData.horario);
    const day = classDate.getDate();

    // Mapeo de colores por tipo de clase (basado en el nombre)
    const colorMap = {
      yoga: "bg-blue-500",
      pilates: "bg-green-500",
      spinning: "bg-purple-500",
      zumba: "bg-orange-500",
      crossfit: "bg-red-500",
      aerobicos: "bg-pink-500",
      natacion: "bg-cyan-500",
    };

    const className = classData.nombre.toLowerCase();
    const color = colorMap[className] || "bg-gray-500";

    return {
      day: day.toString(),
      type: classData.nombre,
      time: `${classDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      color: color,
      id: classData.clase_id,
      instructor: classData.entrenador?.nombre || "Sin asignar",
      capacity: classData.capacidad_max,
      fullDateTime: classData.horario,
    };
  }

  // Formatear datos de clase para la vista de hoy
  async formatClassForToday(classData) {
    const classDate = new Date(classData.horario);
    const endTime = new Date(classDate.getTime() + 60 * 60 * 1000); // Asumimos 1 hora de duración

    const colorMap = {
      yoga: "bg-blue-500",
      pilates: "bg-green-500",
      spinning: "bg-purple-500",
      zumba: "bg-orange-500",
      crossfit: "bg-red-500",
      aerobicos: "bg-pink-500",
      natacion: "bg-cyan-500",
    };

    const className = classData.nombre.toLowerCase();
    const color = colorMap[className] || "bg-gray-500";

    // Obtener inscripciones para esta clase
    let reservations = 0;
    try {
      const enrollments = await this.getClassEnrollments(classData.clase_id);
      reservations = (enrollments.results || enrollments).length;
    } catch (error) {
      console.error("Error getting enrollments:", error);
    }

    return {
      id: classData.clase_id,
      name: classData.nombre,
      time: `${classDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${endTime.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      instructor: classData.entrenador?.nombre || "Sin asignar",
      capacity: classData.capacidad_max,
      reservations: reservations,
      color: color,
    };
  }
}

export default new ClassService();

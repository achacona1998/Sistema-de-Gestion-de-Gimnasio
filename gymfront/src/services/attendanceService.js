import api from './api.js';

class AttendanceService {
  // Obtener todas las asistencias con filtros
  async getAttendances(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.socio) params.append('socio', filters.socio);
      if (filters.fecha_entrada) params.append('fecha_entrada', filters.fecha_entrada);
      if (filters.fecha_salida) params.append('fecha_salida', filters.fecha_salida);
      if (filters.ordering) params.append('ordering', filters.ordering);
      
      const response = await api.get(`/asistencias/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendances:', error);
      throw error;
    }
  }

  // Crear nueva asistencia (check-in)
  async createAttendance(attendanceData) {
    try {
      const response = await api.post('/asistencias/', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }

  // Actualizar asistencia (check-out)
  async updateAttendance(id, attendanceData) {
    try {
      const response = await api.patch(`/asistencias/${id}/`, attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }

  // Obtener asistencia por ID
  async getAttendanceById(id) {
    try {
      const response = await api.get(`/asistencias/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  // Obtener estadísticas de asistencia
  async getAttendanceStats(date = null) {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      
      const response = await api.get(`/asistencias/?${params.toString()}`);
      const attendances = response.data.results || response.data;
      
      // Calcular estadísticas del lado del cliente
      const today = date || new Date().toISOString().split('T')[0];
      const todayAttendances = attendances.filter(att => 
        att.fecha_entrada.startsWith(today)
      );
      
      const activeNow = todayAttendances.filter(att => !att.fecha_salida).length;
      const totalToday = todayAttendances.length;
      
      // Calcular tiempo promedio
      const completedToday = todayAttendances.filter(att => att.fecha_salida);
      let averageTime = '0h 0m';
      
      if (completedToday.length > 0) {
        const totalMinutes = completedToday.reduce((sum, att) => {
          const checkIn = new Date(att.fecha_entrada);
          const checkOut = new Date(att.fecha_salida);
          const duration = (checkOut - checkIn) / (1000 * 60); // minutos
          return sum + duration;
        }, 0);
        
        const avgMinutes = Math.round(totalMinutes / completedToday.length);
        const hours = Math.floor(avgMinutes / 60);
        const minutes = avgMinutes % 60;
        averageTime = `${hours}h ${minutes}m`;
      }
      
      // Calcular hora pico (simplificado)
      const hourCounts = {};
      todayAttendances.forEach(att => {
        const hour = new Date(att.fecha_entrada).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      
      const peakHour = Object.keys(hourCounts).reduce((a, b) => 
        hourCounts[a] > hourCounts[b] ? a : b, '0'
      );
      
      return {
        totalToday,
        activeNow,
        averageTime,
        peakHour: `${peakHour}:00`
      };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  }

  // Obtener datos para gráficos por horas
  async getHourlyData(date = null) {
    try {
      const params = new URLSearchParams();
      if (date) params.append('fecha_entrada__date', date);
      
      const response = await api.get(`/asistencias/?${params.toString()}`);
      const attendances = response.data.results || response.data;
      
      // Agrupar por horas
      const hourCounts = Array(24).fill(0);
      attendances.forEach(att => {
        const hour = new Date(att.fecha_entrada).getHours();
        hourCounts[hour]++;
      });
      
      // Retornar solo las horas de operación típicas (6:00 - 22:00)
      const operatingHours = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      const operatingData = [6, 8, 10, 12, 14, 16, 18, 20, 22].map(hour => hourCounts[hour]);
      
      return {
        labels: operatingHours,
        data: operatingData
      };
    } catch (error) {
      console.error('Error fetching hourly data:', error);
      throw error;
    }
  }

  // Obtener datos semanales
  async getWeeklyData() {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);
      
      const params = new URLSearchParams();
      params.append('fecha_entrada__date__gte', startDate.toISOString().split('T')[0]);
      params.append('fecha_entrada__date__lte', endDate.toISOString().split('T')[0]);
      
      const response = await api.get(`/asistencias/?${params.toString()}`);
      const attendances = response.data.results || response.data;
      
      // Agrupar por días de la semana
      const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayCounts = Array(7).fill(0);
      
      attendances.forEach(att => {
        const dayOfWeek = new Date(att.fecha_entrada).getDay();
        dayCounts[dayOfWeek]++;
      });
      
      // Reordenar para que empiece en Lunes
      const reorderedData = [dayCounts[1], dayCounts[2], dayCounts[3], dayCounts[4], dayCounts[5], dayCounts[6], dayCounts[0]];
      const reorderedLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      
      return {
        labels: reorderedLabels,
        data: reorderedData
      };
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      throw error;
    }
  }
}

export default new AttendanceService();
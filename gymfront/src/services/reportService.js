import api from './api.js';

class ReportService {
  // Obtener dashboard general
  async getDashboardData(params = {}) {
    try {
      const response = await api.get('/reportes/dashboard/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Obtener estadísticas de socios
  async getMemberStats(params = {}) {
    try {
      const response = await api.get('/reportes/socios/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching member stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas de membresías
  async getMembershipStats(params = {}) {
    try {
      const response = await api.get('/reportes/membresias/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching membership stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas de pagos
  async getPaymentStats(params = {}) {
    try {
      const response = await api.get('/reportes/pagos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas de clases
  async getClassStats(params = {}) {
    try {
      const response = await api.get('/reportes/clases/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching class stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas de asistencia
  async getAttendanceStats(params = {}) {
    try {
      const response = await api.get('/reportes/asistencia/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas de equipos
  async getEquipmentStats(params = {}) {
    try {
      const response = await api.get('/reportes/equipos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment stats:', error);
      throw error;
    }
  }

  // Obtener estadísticas de entrenadores
  async getTrainerStats(params = {}) {
    try {
      const response = await api.get('/reportes/entrenadores/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      throw error;
    }
  }

  // Obtener reporte de ingresos
  async getRevenueReport(startDate, endDate, groupBy = 'day') {
    try {
      const response = await api.get('/reportes/ingresos/', {
        params: {
          fecha_inicio: startDate,
          fecha_fin: endDate,
          agrupar_por: groupBy
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      throw error;
    }
  }

  // Obtener reporte de retención de socios
  async getRetentionReport(params = {}) {
    try {
      const response = await api.get('/reportes/retencion/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching retention report:', error);
      throw error;
    }
  }

  // Obtener reporte de crecimiento
  async getGrowthReport(params = {}) {
    try {
      const response = await api.get('/reportes/crecimiento/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching growth report:', error);
      throw error;
    }
  }

  // Obtener reporte de ocupación de clases
  async getClassOccupancyReport(params = {}) {
    try {
      const response = await api.get('/reportes/ocupacion-clases/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching class occupancy report:', error);
      throw error;
    }
  }

  // Obtener reporte de uso de equipos
  async getEquipmentUsageReport(params = {}) {
    try {
      const response = await api.get('/reportes/uso-equipos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment usage report:', error);
      throw error;
    }
  }

  // Obtener reporte de performance de entrenadores
  async getTrainerPerformanceReport(params = {}) {
    try {
      const response = await api.get('/reportes/performance-entrenadores/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer performance report:', error);
      throw error;
    }
  }

  // Obtener reporte de morosidad
  async getDelinquencyReport(params = {}) {
    try {
      const response = await api.get('/reportes/morosidad/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching delinquency report:', error);
      throw error;
    }
  }

  // Obtener reporte de cancelaciones
  async getCancellationReport(params = {}) {
    try {
      const response = await api.get('/reportes/cancelaciones/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cancellation report:', error);
      throw error;
    }
  }

  // Obtener reporte de horas pico
  async getPeakHoursReport(params = {}) {
    try {
      const response = await api.get('/reportes/horas-pico/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching peak hours report:', error);
      throw error;
    }
  }

  // Obtener reporte de satisfacción
  async getSatisfactionReport(params = {}) {
    try {
      const response = await api.get('/reportes/satisfaccion/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching satisfaction report:', error);
      throw error;
    }
  }

  // Obtener métricas en tiempo real
  async getRealTimeMetrics() {
    try {
      const response = await api.get('/reportes/tiempo-real/');
      return response.data;
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      throw error;
    }
  }

  // Obtener comparación de períodos
  async getPeriodComparison(currentStart, currentEnd, previousStart, previousEnd) {
    try {
      const response = await api.get('/reportes/comparacion-periodos/', {
        params: {
          periodo_actual_inicio: currentStart,
          periodo_actual_fin: currentEnd,
          periodo_anterior_inicio: previousStart,
          periodo_anterior_fin: previousEnd
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching period comparison:', error);
      throw error;
    }
  }

  // Obtener pronósticos
  async getForecast(metric, periods = 12) {
    try {
      const response = await api.get('/reportes/pronostico/', {
        params: {
          metrica: metric,
          periodos: periods
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  }

  // Exportar reporte
  async exportReport(reportType, format = 'pdf', params = {}) {
    try {
      const response = await api.get(`/reportes/${reportType}/exportar/`, {
        params: { format, ...params },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Programar reporte automático
  async scheduleReport(reportConfig) {
    try {
      const response = await api.post('/reportes/programar/', reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  }

  // Obtener reportes programados
  async getScheduledReports() {
    try {
      const response = await api.get('/reportes/programados/');
      return response.data;
    } catch (error) {
      console.error('Error fetching scheduled reports:', error);
      throw error;
    }
  }

  // Cancelar reporte programado
  async cancelScheduledReport(reportId) {
    try {
      await api.delete(`/reportes/programados/${reportId}/`);
      return true;
    } catch (error) {
      console.error('Error canceling scheduled report:', error);
      throw error;
    }
  }

  // Obtener alertas de negocio
  async getBusinessAlerts() {
    try {
      const response = await api.get('/reportes/alertas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching business alerts:', error);
      throw error;
    }
  }

  // Configurar alerta de negocio
  async configureBusinessAlert(alertConfig) {
    try {
      const response = await api.post('/reportes/alertas/', alertConfig);
      return response.data;
    } catch (error) {
      console.error('Error configuring business alert:', error);
      throw error;
    }
  }

  // Obtener KPIs principales
  async getMainKPIs(params = {}) {
    try {
      const response = await api.get('/reportes/kpis/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching main KPIs:', error);
      throw error;
    }
  }

  // Obtener análisis de cohortes
  async getCohortAnalysis(params = {}) {
    try {
      const response = await api.get('/reportes/cohortes/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cohort analysis:', error);
      throw error;
    }
  }

  // Obtener análisis de segmentación
  async getSegmentationAnalysis(params = {}) {
    try {
      const response = await api.get('/reportes/segmentacion/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching segmentation analysis:', error);
      throw error;
    }
  }

  // Obtener reporte personalizado
  async getCustomReport(reportConfig) {
    try {
      const response = await api.post('/reportes/personalizado/', reportConfig);
      return response.data;
    } catch (error) {
      console.error('Error fetching custom report:', error);
      throw error;
    }
  }

  // Guardar reporte personalizado
  async saveCustomReport(reportName, reportConfig) {
    try {
      const response = await api.post('/reportes/personalizado/guardar/', {
        nombre: reportName,
        configuracion: reportConfig
      });
      return response.data;
    } catch (error) {
      console.error('Error saving custom report:', error);
      throw error;
    }
  }

  // Obtener reportes guardados
  async getSavedReports() {
    try {
      const response = await api.get('/reportes/guardados/');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      throw error;
    }
  }

  // Ejecutar reporte guardado
  async runSavedReport(reportId, params = {}) {
    try {
      const response = await api.post(`/reportes/guardados/${reportId}/ejecutar/`, params);
      return response.data;
    } catch (error) {
      console.error('Error running saved report:', error);
      throw error;
    }
  }
}

export default new ReportService();
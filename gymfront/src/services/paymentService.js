import api from './api.js';

class PaymentService {
  // Obtener todos los pagos
  async getPayments(params = {}) {
    try {
      const response = await api.get('/pagos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  // Obtener un pago por ID
  async getPayment(id) {
    try {
      const response = await api.get(`/pagos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  // Crear nuevo pago
  async createPayment(paymentData) {
    try {
      const response = await api.post('/pagos/', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Actualizar pago
  async updatePayment(id, paymentData) {
    try {
      const response = await api.put(`/pagos/${id}/`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  // Eliminar pago
  async deletePayment(id) {
    try {
      await api.delete(`/pagos/${id}/`);
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  // Procesar pago
  async processPayment(paymentData) {
    try {
      const response = await api.post('/pagos/procesar/', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Obtener pagos por socio
  async getPaymentsBySocio(socioId, params = {}) {
    try {
      const response = await api.get('/pagos/', {
        params: { socio: socioId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments by socio:', error);
      throw error;
    }
  }

  // Obtener pagos pendientes
  async getPendingPayments(params = {}) {
    try {
      const response = await api.get('/pagos/', {
        params: { estado: 'pendiente', ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  }

  // Obtener pagos vencidos
  async getOverduePayments(params = {}) {
    try {
      const response = await api.get('/pagos/vencidos/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue payments:', error);
      throw error;
    }
  }

  // Marcar pago como pagado
  async markAsPaid(paymentId, paymentDetails = {}) {
    try {
      const response = await api.post(`/pagos/${paymentId}/marcar-pagado/`, {
        fecha_pago: new Date().toISOString().split('T')[0],
        ...paymentDetails
      });
      return response.data;
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      throw error;
    }
  }

  // Generar recibo
  async generateReceipt(paymentId) {
    try {
      const response = await api.get(`/pagos/${paymentId}/recibo/`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }

  // Enviar recordatorio de pago
  async sendPaymentReminder(paymentId, method = 'email') {
    try {
      const response = await api.post(`/pagos/${paymentId}/recordatorio/`, {
        metodo: method
      });
      return response.data;
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      throw error;
    }
  }

  // Obtener estadísticas de pagos
  async getPaymentStats(params = {}) {
    try {
      const response = await api.get('/pagos/estadisticas/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  }

  // Obtener ingresos por período
  async getRevenueByPeriod(startDate, endDate, groupBy = 'day') {
    try {
      const response = await api.get('/pagos/ingresos/', {
        params: {
          fecha_inicio: startDate,
          fecha_fin: endDate,
          agrupar_por: groupBy
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by period:', error);
      throw error;
    }
  }

  // Aplicar descuento
  async applyDiscount(paymentId, discountData) {
    try {
      const response = await api.post(`/pagos/${paymentId}/descuento/`, discountData);
      return response.data;
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    }
  }

  // Procesar reembolso
  async processRefund(paymentId, refundData) {
    try {
      const response = await api.post(`/pagos/${paymentId}/reembolso/`, refundData);
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Obtener métodos de pago disponibles
  async getPaymentMethods() {
    try {
      const response = await api.get('/pagos/metodos/');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  // Configurar pago automático
  async setupAutomaticPayment(socioId, paymentMethodId, membershipId) {
    try {
      const response = await api.post('/pagos/automatico/', {
        socio: socioId,
        metodo_pago: paymentMethodId,
        membresia: membershipId
      });
      return response.data;
    } catch (error) {
      console.error('Error setting up automatic payment:', error);
      throw error;
    }
  }

  // Cancelar pago automático
  async cancelAutomaticPayment(automaticPaymentId) {
    try {
      const response = await api.delete(`/pagos/automatico/${automaticPaymentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error canceling automatic payment:', error);
      throw error;
    }
  }

  // Obtener historial de transacciones
  async getTransactionHistory(params = {}) {
    try {
      const response = await api.get('/pagos/transacciones/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Exportar reporte de pagos
  async exportPaymentReport(format = 'pdf', filters = {}) {
    try {
      const response = await api.get('/pagos/exportar/', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting payment report:', error);
      throw error;
    }
  }

  // Verificar estado de pago
  async verifyPaymentStatus(paymentId) {
    try {
      const response = await api.get(`/pagos/${paymentId}/verificar-estado/`);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment status:', error);
      throw error;
    }
  }

  // Calcular próximo pago
  async calculateNextPayment(socioId, membershipId) {
    try {
      const response = await api.get('/pagos/calcular-proximo/', {
        params: {
          socio: socioId,
          membresia: membershipId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating next payment:', error);
      throw error;
    }
  }

  // Obtener balance del socio
  async getSocioBalance(socioId) {
    try {
      const response = await api.get(`/pagos/balance/${socioId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching socio balance:', error);
      throw error;
    }
  }
}

export default new PaymentService();
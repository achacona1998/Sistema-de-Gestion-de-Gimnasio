import apiClient, { createBaseService } from './apiClient.js';

// Crear servicio base para membresías
const baseService = createBaseService('membresias');

class MembershipService {
  // Métodos CRUD básicos utilizando el servicio base
  async getMemberships(params = {}) {
    return baseService.getAll(params);
  }

  async getMembership(id) {
    return baseService.getById(id);
  }

  async createMembership(membershipData) {
    return baseService.create(membershipData);
  }

  async updateMembership(id, membershipData) {
    return baseService.update(id, membershipData);
  }

  async deleteMembership(id) {
    return baseService.delete(id);
  }

  // Métodos específicos para membresías

  // Obtener tipos de membresía
  async getMembershipTypes() {
    try {
      const response = await apiClient.get("/membresias/tipos/");
      return response.data;
    } catch (error) {
      console.error("Error fetching membership types:", error);
      throw error;
    }
  }

  // Obtener estadísticas de membresías
  async getMembershipStats() {
    try {
      const response = await apiClient.get("/membresias/estadisticas/");
      return response.data;
    } catch (error) {
      console.error("Error fetching membership stats:", error);
      throw error;
    }
  }

  // Renovar membresía
  async renewMembership(id, renewalData) {
    try {
      const response = await apiClient.post(
        `/membresias/${id}/renovar/`,
        renewalData
      );
      return response.data;
    } catch (error) {
      console.error("Error renewing membership:", error);
      throw error;
    }
  }

  // Suspender membresía
  async suspendMembership(id, reason) {
    try {
      const response = await apiClient.post(`/membresias/${id}/suspender/`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error suspending membership:", error);
      throw error;
    }
  }

  // Reactivar membresía
  async reactivateMembership(id) {
    try {
      const response = await apiClient.post(`/membresias/${id}/reactivar/`);
      return response.data;
    } catch (error) {
      console.error("Error reactivating membership:", error);
      throw error;
    }
  }

  // Obtener historial de membresía
  async getMembershipHistory(socioId) {
    try {
      const response = await apiClient.get(`/membresias/historial/${socioId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching membership history:", error);
      throw error;
    }
  }

  // Verificar estado de membresía
  async checkMembershipStatus(socioId) {
    try {
      const response = await apiClient.get(`/membresias/estado/${socioId}/`);
      return response.data;
    } catch (error) {
      console.error("Error checking membership status:", error);
      throw error;
    }
  }
}

export default new MembershipService();

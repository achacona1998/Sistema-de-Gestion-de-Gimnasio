// Exportar el cliente API y el creador de servicios base
export { default as apiClient, createBaseService } from './apiClient.js';

// Exportar todos los servicios de la aplicación
export { default as authService } from './authService.js';
export { default as notificationService } from './notificationService.js';
export { default as membershipService } from './membershipService.js';
export { default as socioService } from './socioService.js';
export { default as classService } from './classService.js';
export { default as paymentService } from './paymentService.js';
export { default as trainerService } from './trainerService.js';
export { default as equipmentService } from './equipmentService.js';
export { default as reportService } from './reportService.js';

// Exportar funciones de la API
export { services } from './api.js';

// Importar todos los servicios
import apiClient from './apiClient.js';
import authService from './authService.js';
import notificationService from './notificationService.js';
import membershipService from './membershipService.js';
import socioService from './socioService.js';
import classService from './classService.js';
import paymentService from './paymentService.js';
import trainerService from './trainerService.js';
import equipmentService from './equipmentService.js';
import reportService from './reportService.js';
import { services as apiServices } from './api.js';

// Exportar como objeto para facilitar el uso
const services = {
  apiClient,
  auth: authService,
  notifications: notificationService,
  memberships: membershipService,
  socios: socioService,
  classes: classService,
  payments: paymentService,
  trainers: trainerService,
  equipment: equipmentService,
  reports: reportService,
  api: apiServices
};

export default services;
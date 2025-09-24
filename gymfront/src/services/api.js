import apiClient, { createBaseService } from './apiClient.js';

// Crear servicios base para cada entidad
const sociosService = createBaseService('socios');
const membresiasService = createBaseService('membresias');
const entrenadoresService = createBaseService('entrenadores');
const clasesService = createBaseService('clases');
const pagosService = createBaseService('pagos');
const asistenciasService = createBaseService('asistencias');
const socioClasesService = createBaseService('socio-clases');
const equiposService = createBaseService('equipos');


// Funciones para socios (miembros)
export const fetchMembers = async (page, search, status) => {
  return sociosService.getAll({ page, search, status });
};

export const createMember = async (memberData) => {
  return sociosService.create(memberData);
};

export const updateMember = async (memberId, memberData) => {
  return sociosService.update(memberId, memberData);
};

export const deleteMember = async (memberId) => {
  return sociosService.delete(memberId);
};

// ============ MEMBRESÍAS ============
export const fetchMembresias = async (page = 1, search = "") => {
  return membresiasService.getAll({ page, search });
};

export const createMembresia = async (membresiaData) => {
  return membresiasService.create(membresiaData);
};

export const updateMembresia = async (membresiaId, membresiaData) => {
  return membresiasService.update(membresiaId, membresiaData);
};

export const deleteMembresia = async (membresiaId) => {
  return membresiasService.delete(membresiaId);
};

// ============ ENTRENADORES ============
export const fetchEntrenadores = async (page = 1, search = "") => {
  return entrenadoresService.getAll({ page, search });
};

export const createEntrenador = async (entrenadorData) => {
  return entrenadoresService.create(entrenadorData);
};

export const updateEntrenador = async (entrenadorId, entrenadorData) => {
  return entrenadoresService.update(entrenadorId, entrenadorData);
};

export const deleteEntrenador = async (entrenadorId) => {
  return entrenadoresService.delete(entrenadorId);
};

// ============ CLASES ============
export const fetchClases = async (page = 1, search = "") => {
  return clasesService.getAll({ page, search });
};

export const createClase = async (claseData) => {
  return clasesService.create(claseData);
};

export const updateClase = async (claseId, claseData) => {
  return clasesService.update(claseId, claseData);
};

export const deleteClase = async (claseId) => {
  return clasesService.delete(claseId);
};

// ============ PAGOS ============
export const fetchPagos = async (page = 1, search = "") => {
  return pagosService.getAll({ page, search });
};

export const createPago = async (pagoData) => {
  return pagosService.create(pagoData);
};

export const updatePago = async (pagoId, pagoData) => {
  return pagosService.update(pagoId, pagoData);
};

export const deletePago = async (pagoId) => {
  return pagosService.delete(pagoId);
};

// ============ ASISTENCIAS ============
export const fetchAsistencias = async (page = 1, search = "") => {
  return asistenciasService.getAll({ page, search });
};

export const createAsistencia = async (asistenciaData) => {
  return asistenciasService.create(asistenciaData);
};

export const updateAsistencia = async (asistenciaId, asistenciaData) => {
  return asistenciasService.update(asistenciaId, asistenciaData);
};

export const deleteAsistencia = async (asistenciaId) => {
  return asistenciasService.delete(asistenciaId);
};

// ============ SOCIO-CLASES ============
export const fetchSocioClases = async (page = 1, search = "") => {
  return socioClasesService.getAll({ page, search });
};

export const createSocioClase = async (socioClaseData) => {
  return socioClasesService.create(socioClaseData);
};

export const updateSocioClase = async (socioClaseId, socioClaseData) => {
  return socioClasesService.update(socioClaseId, socioClaseData);
};

export const deleteSocioClase = async (socioClaseId) => {
  return socioClasesService.delete(socioClaseId);
};

// ============ EQUIPOS ============
export const fetchEquipos = async (page = 1, search = "") => {
  return equiposService.getAll({ page, search });
};

export const createEquipo = async (equipoData) => {
  return equiposService.create(equipoData);
};

export const updateEquipo = async (equipoId, equipoData) => {
  return equiposService.update(equipoId, equipoData);
};

export const deleteEquipo = async (equipoId) => {
  return equiposService.delete(equipoId);
};

// Exportar los servicios para uso en otros módulos
export const services = {
  socios: sociosService,
  membresias: membresiasService,
  entrenadores: entrenadoresService,
  clases: clasesService,
  pagos: pagosService,
  asistencias: asistenciasService,
  socioClases: socioClasesService,
  equipos: equiposService
};

// Exportar como default
export default apiClient;

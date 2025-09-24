// Archivo para probar las llamadas a la API
import { socioService, membershipService, apiClient } from './index.js';

// Función para probar las llamadas a la API
async function testApiCalls() {
  console.log('Iniciando pruebas de API...');
  
  try {
    // Probar llamadas del servicio de socios
    console.log('Probando socioService.getSocios()...');
    const socios = await socioService.getSocios();
    console.log('Socios obtenidos:', socios);
    
    // Probar llamadas del servicio de membresías
    console.log('Probando membershipService.getMemberships()...');
    const membresias = await membershipService.getMemberships();
    console.log('Membresías obtenidas:', membresias);
    
    // Probar llamada directa al cliente API
    console.log('Probando llamada directa a apiClient...');
    const response = await apiClient.get('/socios/');
    console.log('Respuesta directa:', response.data);
    
    console.log('Todas las pruebas completadas con éxito!');
  } catch (error) {
    console.error('Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
testApiCalls();

// Exportar la función de prueba para uso externo
export default testApiCalls;
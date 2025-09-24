import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configuración del entorno de testing para integración
    environment: 'node',
    
    // Archivos de configuración global
    setupFiles: ['./integration-setup.js'],
    
    // Patrones de archivos de test
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'
    ],
    
    // Archivos a excluir
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**'
    ],
    
    // Configuración de reportes
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './integration-test-results.json'
    },
    
    // Configuración de timeouts (más largos para tests de integración)
    testTimeout: 30000,
    hookTimeout: 30000,
    
    // Configuración de globals
    globals: true,
    
    // Ejecutar tests secuencialmente para evitar conflictos
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    
    // Configuración de retry para tests de integración
    retry: 2,
    
    // Configuración de mocks
    mockReset: true,
    clearMocks: true,
    restoreMocks: true
  },
  
  // Configuración de define para variables de entorno
  define: {
    'process.env.NODE_ENV': '"test"',
    'process.env.API_BASE_URL': '"http://127.0.0.1:8000"'
  }
});
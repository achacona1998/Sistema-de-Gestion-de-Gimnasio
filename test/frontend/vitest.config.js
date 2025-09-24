import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Configuración del entorno de testing
    environment: 'jsdom',
    
    // Archivos de configuración global
    setupFiles: ['./test-setup.js'],
    
    // Patrones de archivos de test
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    // Archivos a excluir
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**'
    ],
    
    // Configuración de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        '**/test/**',
        '**/*.config.js',
        '**/*.config.ts'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // Configuración de reportes
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results.json',
      html: './test-results.html'
    },
    
    // Configuración de timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Configuración de globals
    globals: true,
    
    // Configuración de mocks
    mockReset: true,
    clearMocks: true,
    restoreMocks: true
  },
  
  // Configuración de resolución de módulos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../gymfront/src'),
      '@components': path.resolve(__dirname, '../../gymfront/src/components'),
      '@services': path.resolve(__dirname, '../../gymfront/src/services'),
      '@contexts': path.resolve(__dirname, '../../gymfront/src/contexts'),
      '@utils': path.resolve(__dirname, '../../gymfront/src/utils'),
      '@assets': path.resolve(__dirname, '../../gymfront/src/assets')
    }
  },
  
  // Configuración de define para variables de entorno
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});
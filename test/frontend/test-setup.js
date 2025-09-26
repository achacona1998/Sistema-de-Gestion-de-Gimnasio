import { expect, afterEach, beforeEach, vi } from 'vitest';
import React from 'react';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock para Chart.js
vi.mock('chart.js', () => {
  const mockChart = {
    register: vi.fn()
  };
  
  return {
    Chart: mockChart,
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(),
    PointElement: vi.fn(),
    LineElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
    ArcElement: vi.fn(),
    BarElement: vi.fn()
  };
});

// Mock para react-chartjs-2
vi.mock('react-chartjs-2', () => {
  const MockChart = (props) => {
    return React.createElement('div', { 
      'data-testid': props['data-testid'] || 'mock-chart',
      className: 'mock-chart'
    }, props.children || 'Mock Chart');
  };

  return {
    Line: MockChart,
    Doughnut: MockChart,
    Bar: MockChart
  };
});

// Mock para lucide-react
vi.mock('lucide-react', () => {
  const createMockIcon = (name) => {
    const MockIcon = (props) => {
      const { className, ...otherProps } = props;
      return React.createElement('div', {
        'data-testid': `mock-${name.toLowerCase()}`,
        className: `mock-icon ${className || ''}`.trim(),
        children: name,
        ...otherProps
      });
    };
    MockIcon.displayName = `Mock${name}`;
    return MockIcon;
  };

  return {
    Users: createMockIcon('Users'),
    DollarSign: createMockIcon('DollarSign'),
    Calendar: createMockIcon('Calendar'),
    TrendingUp: createMockIcon('TrendingUp'),
    TrendingDown: createMockIcon('TrendingDown'),
    Clock: createMockIcon('Clock'),
    UserCheck: createMockIcon('UserCheck'),
    AlertTriangle: createMockIcon('AlertTriangle'),
    CheckCircle: createMockIcon('CheckCircle'),
    XCircle: createMockIcon('XCircle'),
    Activity: createMockIcon('Activity'),
    Target: createMockIcon('Target'),
    Award: createMockIcon('Award'),
    Zap: createMockIcon('Zap'),
    Eye: createMockIcon('Eye'),
    EyeOff: createMockIcon('EyeOff'),
    Dumbbell: createMockIcon('Dumbbell'),
    AlertCircle: createMockIcon('AlertCircle'),
    Loader2: createMockIcon('Loader2'),
    Settings: createMockIcon('Settings')
  };
});

// Limpiar después de cada test
afterEach(() => {
  cleanup();
});

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock básico de fetch
global.fetch = vi.fn();

// Mock de console.error para tests más limpios
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});
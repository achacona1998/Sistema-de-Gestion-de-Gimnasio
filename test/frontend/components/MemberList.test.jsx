import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MemberList from '../../../gymfront/src/components/members/MemberList';
import { AuthProvider } from '../../../gymfront/src/contexts/AuthContext';
import { NotificationProvider } from '../../../gymfront/src/contexts/NotificationContext';
import * as socioService from '../../../gymfront/src/services/socioService';

// Mock del servicio de socios
vi.mock('../../../gymfront/src/services/socioService', () => ({
  getSocios: vi.fn(),
  deleteSocio: vi.fn(),
  getSocioStats: vi.fn()
}));

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Datos de prueba
const mockSocios = {
  results: [
    {
      id: 1,
      nombre: 'Juan Pérez',
      telefono: '555-1234',
      correo: 'juan@email.com',
      membresia: 1,
      membresia_tipo: 'Básica',
      fecha_registro: '2024-01-15T10:30:00Z',
      activo: true
    },
    {
      id: 2,
      nombre: 'María García',
      telefono: '555-5678',
      correo: 'maria@email.com',
      membresia: 2,
      membresia_tipo: 'Premium',
      fecha_registro: '2024-02-20T14:15:00Z',
      activo: true
    }
  ],
  count: 2,
  next: null,
  previous: null
};

const mockStats = {
  total_socios: 2,
  socios_activos: 2,
  socios_inactivos: 0,
  nuevos_este_mes: 1
};

// Componente wrapper para providers
const TestWrapper = ({ children }) => {
  const mockAuthValue = {
    user: { id: 1, email: 'test@test.com' },
    isAuthenticated: true,
    loading: false
  };

  const mockNotificationValue = {
    showNotification: vi.fn()
  };

  return (
    <AuthProvider value={mockAuthValue}>
      <NotificationProvider value={mockNotificationValue}>
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
};

describe('MemberList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socioService.getSocios.mockResolvedValue(mockSocios);
    socioService.getSocioStats.mockResolvedValue(mockStats);
  });

  it('renderiza correctamente la lista de socios', async () => {
    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    // Verificar que se muestra el título
    expect(screen.getByText('Gestión de Socios')).toBeInTheDocument();

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
    });

    // Verificar que se muestran los datos correctos
    expect(screen.getByText('juan@email.com')).toBeInTheDocument();
    expect(screen.getByText('maria@email.com')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('555-5678')).toBeInTheDocument();
  });

  it('muestra las estadísticas correctamente', async () => {
    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total socios
      expect(screen.getByText('Socios Activos')).toBeInTheDocument();
    });
  });

  it('permite buscar socios', async () => {
    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText(/buscar socios/i);
    
    fireEvent.change(searchInput, { target: { value: 'Juan' } });
    
    await waitFor(() => {
      expect(socioService.getSocios).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Juan'
        })
      );
    });
  });

  it('permite filtrar por estado', async () => {
    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    const statusFilter = screen.getByDisplayValue('todos');
    
    fireEvent.change(statusFilter, { target: { value: 'activo' } });
    
    await waitFor(() => {
      expect(socioService.getSocios).toHaveBeenCalledWith(
        expect.objectContaining({
          activo: 'activo'
        })
      );
    });
  });

  it('maneja la paginación correctamente', async () => {
    const mockSociosWithPagination = {
      ...mockSocios,
      next: 'http://localhost:8000/api/v1/socios/?page=2',
      count: 25
    };

    socioService.getSocios.mockResolvedValue(mockSociosWithPagination);

    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    // Verificar que se muestra información de paginación
    expect(screen.getByText(/mostrando/i)).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay socios', async () => {
    socioService.getSocios.mockResolvedValue({
      results: [],
      count: 0,
      next: null,
      previous: null
    });

    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron socios/i)).toBeInTheDocument();
    });
  });

  it('maneja errores de carga correctamente', async () => {
    socioService.getSocios.mockRejectedValue(new Error('Error de red'));

    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
    });
  });

  it('permite eliminar un socio', async () => {
    socioService.deleteSocio.mockResolvedValue({});
    
    // Mock de window.confirm
    window.confirm = vi.fn(() => true);

    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    // Buscar y hacer clic en el botón de eliminar
    const deleteButtons = screen.getAllByText(/eliminar/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(socioService.deleteSocio).toHaveBeenCalledWith(1);
    });
  });

  it('muestra estado de carga', () => {
    socioService.getSocios.mockImplementation(() => new Promise(() => {})); // Promise que nunca se resuelve

    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('navega a la página de edición al hacer clic en editar', async () => {
    const mockNavigate = vi.fn();
    
    vi.doMock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
      Link: ({ children, to }) => <a href={to}>{children}</a>
    }));

    render(
      <TestWrapper>
        <MemberList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText(/editar/i);
    fireEvent.click(editButtons[0]);

    // Verificar que se navega a la página correcta
    expect(mockNavigate).toHaveBeenCalledWith('/members/edit/1');
  });
});
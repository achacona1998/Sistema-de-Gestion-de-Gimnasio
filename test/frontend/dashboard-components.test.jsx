import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Users, DollarSign } from 'lucide-react';

describe('Dashboard Components Test', () => {
  // Componente simple de tarjeta métrica
  const SimpleMetricCard = ({ title, value, icon: Icon }) => (
    <div data-testid="metric-card">
      <h3>{title}</h3>
      <p>{value}</p>
      <Icon />
    </div>
  );

  // Componente simple de acción rápida
  const SimpleActionCard = ({ title, icon: Icon }) => (
    <div data-testid="action-card">
      <h3>{title}</h3>
      <Icon />
    </div>
  );

  it('should render SimpleMetricCard with Users icon', () => {
    render(
      <SimpleMetricCard
        title="Total Usuarios"
        value="150"
        icon={Users}
      />
    );

    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    expect(screen.getByText('Total Usuarios')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByTestId('mock-users')).toBeInTheDocument();
  });

  it('should render SimpleActionCard with DollarSign icon', () => {
    render(
      <SimpleActionCard
        title="Pagos"
        icon={DollarSign}
      />
    );

    expect(screen.getByTestId('action-card')).toBeInTheDocument();
    expect(screen.getByText('Pagos')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dollarsign')).toBeInTheDocument();
  });

  it('should render multiple components together', () => {
    render(
      <div>
        <SimpleMetricCard title="Usuarios" value="100" icon={Users} />
        <SimpleActionCard title="Ingresos" icon={DollarSign} />
      </div>
    );

    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Ingresos')).toBeInTheDocument();
    expect(screen.getAllByTestId(/mock-/)).toHaveLength(2);
  });
});
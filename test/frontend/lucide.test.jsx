import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Users, DollarSign, TrendingUp, Calendar, Settings } from 'lucide-react';

describe('Lucide React Icons Test', () => {
  it('should render Users icon', () => {
    render(<Users />);
    
    expect(screen.getByTestId('mock-users')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('should render DollarSign icon', () => {
    render(<DollarSign />);
    
    expect(screen.getByTestId('mock-dollarsign')).toBeInTheDocument();
    expect(screen.getByText('DollarSign')).toBeInTheDocument();
  });

  it('should render TrendingUp icon', () => {
    render(<TrendingUp />);
    
    expect(screen.getByTestId('mock-trendingup')).toBeInTheDocument();
    expect(screen.getByText('TrendingUp')).toBeInTheDocument();
  });

  it('should render Calendar icon', () => {
    render(<Calendar />);
    
    expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });

  it('should render Settings icon', () => {
    render(<Settings />);
    
    expect(screen.getByTestId('mock-settings')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should apply custom className to icons', () => {
    render(<Users className="w-6 h-6 text-blue-500" />);
    
    const iconElement = screen.getByTestId('mock-users');
    expect(iconElement).toHaveClass('mock-icon');
    expect(iconElement).toHaveClass('w-6');
    expect(iconElement).toHaveClass('h-6');
    expect(iconElement).toHaveClass('text-blue-500');
  });
});
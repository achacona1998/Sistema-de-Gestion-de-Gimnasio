import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  CreditCard,
  Calendar,
  ClipboardList,
  BarChart3,
  CalendarDays,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      active: isActive('/dashboard')
    },
    {
      path: '/members',
      icon: Users,
      label: 'Socios',
      active: isActive('/members')
    },
    {
      path: '/memberships',
      icon: CreditCard,
      label: 'Membresías',
      active: isActive('/memberships')
    },
    {
      path: '/classes',
      icon: Calendar,
      label: 'Clases',
      active: isActive('/classes')
    },
    {
      path: '/attendance',
      icon: ClipboardList,
      label: 'Asistencia',
      active: isActive('/attendance')
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Reportes',
      active: isActive('/reports')
    },
    {
      path: '/calendar',
      icon: CalendarDays,
      label: 'Calendario',
      active: isActive('/calendar')
    },
    {
      path: '/notifications',
      icon: Bell,
      label: 'Notificaciones',
      active: isActive('/notifications')
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Configuración',
      active: isActive('/settings')
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-blue-600 min-h-screen flex flex-col lg:flex md:w-64 sm:w-16 sm:hover:w-64 transition-all duration-300">
      {/* Logo */}
      <div className="p-6 border-b border-blue-500">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
          </div>
          <h1 className="text-white text-xl font-bold">GymPro</h1>
        </div>
        <p className="text-blue-200 text-sm mt-1">Sistema de Gestión de Gimnasio</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                    item.active
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-3 text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

// Componente Modal para crear/editar membresías
const MembershipModal = ({ isOpen, onClose, membership, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '1',
    durationType: 'mes',
    description: '',
    features: [],
    isActive: true,
    maxMembers: '',
    color: '#3B82F6'
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (membership) {
      setFormData({
        name: membership.name || '',
        price: membership.price?.replace('$', '') || '',
        duration: membership.duration?.split(' ')[0] || '1',
        durationType: membership.duration?.split(' ')[1] || 'mes',
        description: membership.description || '',
        features: membership.features || [],
        isActive: membership.isActive ?? true,
        maxMembers: membership.maxMembers || '',
        color: membership.color || '#3B82F6'
      });
    } else {
      setFormData({
        name: '',
        price: '',
        duration: '1',
        durationType: 'mes',
        description: '',
        features: [],
        isActive: true,
        maxMembers: '',
        color: '#3B82F6'
      });
    }
  }, [membership, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const membershipData = {
      ...formData,
      id: membership?.id || Date.now(),
      price: `$${formData.price}`,
      duration: `${formData.duration} ${formData.durationType}${formData.duration > 1 ? 'es' : ''}`
    };
    onSave(membershipData);
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {membership ? 'Editar Membresía' : 'Nueva Membresía'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Membresía
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Plan Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={formData.durationType}
                onChange={(e) => setFormData(prev => ({ ...prev, durationType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="día">Día(s)</option>
                <option value="semana">Semana(s)</option>
                <option value="mes">Mes(es)</option>
                <option value="año">Año(s)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la membresía..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Características
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Agregar característica..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                  <span className="text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Límite de Miembros
              </label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sin límite"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Membresía Activa</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {membership ? 'Actualizar' : 'Crear'} Membresía
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de estadísticas
const MembershipStats = ({ memberships }) => {
  const totalMemberships = memberships.length;
  const activeMemberships = memberships.filter(m => m.isActive).length;
  const totalRevenue = memberships.reduce((sum, m) => {
    const price = parseFloat(m.price.replace('$', ''));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
  const avgPrice = totalMemberships > 0 ? totalRevenue / totalMemberships : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Membresías</p>
            <p className="text-2xl font-semibold text-gray-900">{totalMemberships}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Activas</p>
            <p className="text-2xl font-semibold text-gray-900">{activeMemberships}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
            <p className="text-2xl font-semibold text-gray-900">${avgPrice.toFixed(0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Ingresos Potenciales</p>
            <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([
    {
      id: 1,
      name: "Plan Básico",
      price: "$30",
      duration: "1 mes",
      description: "Perfecto para comenzar tu rutina de ejercicios",
      features: [
        "Acceso a área de pesas",
        "Acceso a cardio",
        "Casillero básico",
      ],
      isActive: true,
      maxMembers: 100,
      color: "#10B981"
    },
    {
      id: 2,
      name: "Plan Premium",
      price: "$50",
      duration: "1 mes",
      description: "La opción más popular con beneficios adicionales",
      features: [
        "Acceso a área de pesas",
        "Acceso a cardio",
        "Acceso a clases grupales",
        "Casillero premium",
        "Evaluación física mensual",
      ],
      isActive: true,
      maxMembers: 50,
      color: "#3B82F6"
    },
    {
      id: 3,
      name: "Plan Anual",
      price: "$450",
      duration: "12 meses",
      description: "El mejor valor con descuentos y beneficios exclusivos",
      features: [
        "Acceso a área de pesas",
        "Acceso a cardio",
        "Acceso a clases grupales",
        "Casillero premium",
        "Evaluación física mensual",
        "2 sesiones PT mensuales",
        "Descuento en suplementos",
      ],
      isActive: true,
      maxMembers: 25,
      color: "#8B5CF6"
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
      (filterActive === 'active' && membership.isActive) ||
      (filterActive === 'inactive' && !membership.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleCreateMembership = () => {
    setEditingMembership(null);
    setIsModalOpen(true);
  };

  const handleEditMembership = (membership) => {
    setEditingMembership(membership);
    setIsModalOpen(true);
  };

  const handleSaveMembership = (membershipData) => {
    if (editingMembership) {
      setMemberships(prev => prev.map(m => 
        m.id === editingMembership.id ? membershipData : m
      ));
    } else {
      setMemberships(prev => [...prev, membershipData]);
    }
  };

  const handleDeleteMembership = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta membresía?')) {
      setMemberships(prev => prev.filter(m => m.id !== id));
    }
  };

  const toggleMembershipStatus = (id) => {
    setMemberships(prev => prev.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Membresías</h1>
          <p className="text-gray-600 mt-2">Administra los planes de membresía del gimnasio</p>
        </div>
        <button 
          onClick={handleCreateMembership}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Membresía
        </button>
      </div>

      <MembershipStats memberships={memberships} />

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar membresías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las membresías</option>
              <option value="active">Solo activas</option>
              <option value="inactive">Solo inactivas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de membresías */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredMemberships.map((membership) => (
          <div
            key={membership.id}
            className={`relative p-6 bg-white rounded-lg shadow-md transition-all hover:shadow-lg ${
              !membership.isActive ? 'opacity-60' : ''
            }`}
            style={{ borderTop: `4px solid ${membership.color}` }}
          >
            {/* Badge de estado */}
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                membership.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {membership.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {membership.name}
              </h3>
              {membership.description && (
                <p className="text-sm text-gray-600 mb-4">{membership.description}</p>
              )}
              <div className="mb-4">
                <span className="text-4xl font-bold" style={{ color: membership.color }}>
                  {membership.price}
                </span>
                <span className="text-gray-600">/{membership.duration}</span>
              </div>
              {membership.maxMembers && (
                <p className="text-sm text-gray-500">Límite: {membership.maxMembers} miembros</p>
              )}
            </div>

            <div className="mb-6">
              <ul className="space-y-2">
                {membership.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckIcon className="mr-2 w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center space-x-2">
              <button
                onClick={() => toggleMembershipStatus(membership.id)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  membership.isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {membership.isActive ? 'Desactivar' : 'Activar'}
              </button>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditMembership(membership)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteMembership(membership.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMemberships.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron membresías</p>
          <button 
            onClick={handleCreateMembership}
            className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Crear primera membresía
          </button>
        </div>
      )}

      <MembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        membership={editingMembership}
        onSave={handleSaveMembership}
      />
    </div>
  );
};

export default MembershipsPage;

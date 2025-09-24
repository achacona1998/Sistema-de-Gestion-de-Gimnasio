import React from "react";
import { Users, UserPlus, Search, Filter, Edit, Trash2, Mail, Calendar, Activity } from "lucide-react";
import { socioService } from '../../services';

const MemberModal = ({ member, onClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: member?.name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    membership: member?.membership || "",
    status: member?.status || "active",
    expiration_date: member?.expiration_date || "",
    birth_date: member?.birth_date || "",
    emergency_contact: member?.emergency_contact || "",
    notes: member?.notes || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex fixed inset-0 justify-center items-center p-4 bg-black bg-opacity-50 z-50">
      <div className="p-6 w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {member ? "Editar Socio" : "Nuevo Socio"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Tipo de Membresía *
              </label>
              <select
                value={formData.membership}
                onChange={(e) => setFormData({ ...formData, membership: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar membresía</option>
                <option value="Básica">Básica</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
                <option value="Estudiante">Estudiante</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Contacto de Emergencia
              </label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre y teléfono"
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Información adicional sobre el socio..."
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {member ? "Actualizar" : "Crear Socio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MemberStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Socios</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">{stats.active || 0}</p>
          </div>
          <Activity className="w-8 h-8 text-green-600" />
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Por Vencer</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.expiring || 0}</p>
          </div>
          <Calendar className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Nuevos (Este mes)</p>
            <p className="text-2xl font-bold text-purple-600">{stats.newThisMonth || 0}</p>
          </div>
          <UserPlus className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

const MemberList = () => {
  const [members, setMembers] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [membershipFilter, setMembershipFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState({});

  React.useEffect(() => {
    fetchMembers();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter, membershipFilter]);

  const fetchStats = async () => {
    try {
      const statsData = await socioService.getSocioStats();
      setStats({
        total: statsData.total || 0,
        active: statsData.activos || 0,
        expiring: statsData.proximos_vencer || 0,
        newThisMonth: statsData.nuevos_mes || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        total: 0,
        active: 0,
        expiring: 0,
        newThisMonth: 0
      });
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const response = await socioService.getSocios(params);
      setMembers(response.results || response.data || []);
      setTotalPages(Math.ceil((response.count || response.total || 0) / 10));
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (memberData) => {
    try {
      // Simulando creación
      console.log("Creating member:", memberData);
      fetchMembers();
      setShowModal(false);
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handleUpdateMember = async (memberId, memberData) => {
    try {
      // Simulando actualización
      console.log("Updating member:", memberId, memberData);
      fetchMembers();
      setShowModal(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("¿Está seguro de que desea eliminar este socio?")) {
      try {
        // Simulando eliminación
        console.log("Deleting member:", memberId);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "pending":
        return "Pendiente";
      case "suspended":
        return "Suspendido";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Socios</h1>
          <p className="text-gray-600 mt-1">Administra la información de todos los miembros del gimnasio</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Socio
        </button>
      </div>

      <MemberStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
                <option value="suspended">Suspendido</option>
              </select>
              
              <select
                value={membershipFilter}
                onChange={(e) => setMembershipFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las membresías</option>
                <option value="Básica">Básica</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
                <option value="Estudiante">Estudiante</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-700">Socio</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Contacto</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Membresía</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Vencimiento</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">ID: {member.id}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <Mail className="w-4 h-4" />
                            {member.email}
                          </div>
                          {member.phone && (
                            <div className="text-sm text-gray-500">{member.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {member.membership}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                          {getStatusText(member.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{member.expiration_date}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setShowModal(true);
                            }}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Mostrando {members.length} de {stats.total || 0} socios
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <MemberModal
          member={editingMember}
          onClose={() => {
            setShowModal(false);
            setEditingMember(null);
          }}
          onSubmit={(data) =>
            editingMember
              ? handleUpdateMember(editingMember.id, data)
              : handleCreateMember(data)
          }
        />
      )}
    </div>
  );
};

export default MemberList;

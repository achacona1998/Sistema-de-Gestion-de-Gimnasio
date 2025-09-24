import { useState, useEffect } from "react";
import axios from "axios";

const MembershipList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get("/api/memberships/");
        setMemberships(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las membresías");
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Planes de Membresía</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memberships.map((membership) => (
          <div
            key={membership.membresia_id}
            className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-2 text-xl font-semibold">{membership.tipo}</h3>
            <p className="mb-4 text-gray-600">{membership.descripcion}</p>
            <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
              <span>Duración: {membership.duracion_meses} meses</span>
              <span className="text-lg font-bold text-blue-600">
                ${membership.precio_mensual}/mes
              </span>
            </div>
            <button
              className="px-4 py-2 w-full text-white bg-blue-600 rounded transition-colors hover:bg-blue-700"
              onClick={() => handleSelectMembership(membership.membresia_id)}>
              Seleccionar Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipList;

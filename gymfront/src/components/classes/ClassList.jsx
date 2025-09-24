import { useState, useEffect } from "react";
import axios from "axios";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("/api/classes/");
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las clases");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Clases Disponibles</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <div
            key={classItem.clase_id}
            className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-2 text-xl font-semibold">{classItem.nombre}</h3>
            <p className="mb-4 text-gray-600">
              Instructor: {classItem.entrenador_nombre}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Capacidad: {classItem.capacidad_max} personas</span>
              <span>{new Date(classItem.horario).toLocaleString()}</span>
            </div>
            <button
              className="px-4 py-2 mt-4 w-full text-white bg-blue-600 rounded transition-colors hover:bg-blue-700"
              onClick={() => handleReserveClass(classItem.clase_id)}>
              Reservar Clase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassList;

import { useState, useEffect } from "react";
import axios from "axios";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await axios.get("/api/attendances/");
        setAttendances(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las asistencias");
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  const handleCheckIn = async (socioId) => {
    try {
      await axios.post("/api/attendances/", { socio: socioId });
      // Recargar la lista de asistencias
      fetchAttendances();
    } catch (err) {
      setError("Error al registrar la entrada");
    }
  };

  const handleCheckOut = async (asistenciaId) => {
    try {
      await axios.patch(`/api/attendances/${asistenciaId}/`, {
        fecha_salida: new Date().toISOString(),
      });
      // Recargar la lista de asistencias
      fetchAttendances();
    } catch (err) {
      setError("Error al registrar la salida");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Control de Asistencias</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Socio
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Entrada
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Salida
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendances.map((attendance) => (
              <tr key={attendance.asistencia_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {attendance.socio_nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(attendance.fecha_entrada).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {attendance.fecha_salida
                    ? new Date(attendance.fecha_salida).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!attendance.fecha_salida && (
                    <button
                      onClick={() => handleCheckOut(attendance.asistencia_id)}
                      className="px-3 py-1 text-white bg-green-600 rounded transition-colors hover:bg-green-700">
                      Registrar Salida
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <button
          onClick={() => handleCheckIn(/* socioId */)} // Aquí deberías pasar el ID del socio actual
          className="px-4 py-2 text-white bg-blue-600 rounded transition-colors hover:bg-blue-700">
          Registrar Entrada
        </button>
      </div>
    </div>
  );
};

export default AttendanceList;

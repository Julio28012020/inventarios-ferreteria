import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supplierService from "../services/supplierService";

export const NewSupplierPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado que refleja exactamente la estructura de tu SupplierRequestDto
  const [formData, setFormData] = useState({
    nit: "",
    businessName: "",
    address: "",
    city: "",
    contacts: [
      {
        name: "",
        department: "",
        email: "",
        phone: "",
      },
    ],
  });

  // Maneja cambios en los campos principales del proveedor
  const handleSupplierChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Maneja cambios específicos del contacto (posición 0 del arreglo)
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newContacts = [...prev.contacts];
      newContacts[0] = {
        ...newContacts[0],
        [name]: value,
      };
      return { ...prev, contacts: newContacts };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación: El contacto es obligatorio
    const contact = formData.contacts[0];
    if (!contact.name || (!contact.email && !contact.phone)) {
      setError("El contacto es obligatorio. Ingresa al menos su nombre y un teléfono o correo.");
      return;
    }

    setLoading(true);
    try {
      await supplierService.createSupplier(formData);
      // Si es exitoso, redirigimos a la lista de proveedores
      navigate("/proveedores");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Ocurrió un error al crear el proveedor.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Nuevo Proveedor</h1>
        <p className="text-gray-500">Registra un nuevo proveedor y su contacto principal</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tarjeta: Datos del Proveedor */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Datos de la Empresa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIT *
              </label>
              <input
                type="text"
                name="nit"
                required
                value={formData.nit}
                onChange={handleSupplierChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 900123456-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razón Social *
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleSupplierChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de la empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleSupplierChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Medellín"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleSupplierChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dirección física"
              />
            </div>
          </div>
        </div>

        {/* Tarjeta: Datos del Contacto */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Contacto Principal (Obligatorio)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Contacto *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.contacts[0].name}
                onChange={handleContactChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre de quien atiende"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo / Departamento
              </label>
              <input
                type="text"
                name="department"
                value={formData.contacts[0].department}
                onChange={handleContactChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Ventas, Soporte..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.contacts[0].phone}
                onChange={handleContactChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Teléfono móvil o fijo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.contacts[0].email}
                onChange={handleContactChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="correo@empresa.com"
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4">
          <Link
            to="/proveedores"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Guardando..." : "Guardar Proveedor"}
          </button>
        </div>
      </form>
    </div>
  );
};
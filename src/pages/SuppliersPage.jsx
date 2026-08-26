import { useState } from "react";
import { Link } from "react-router-dom";
import { useSuppliers } from "../hooks/useSuppliers";

export const SuppliersPage = () => {
  const { suppliers, loading, error } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para controlar qué contactos se muestran en el modal
  const [selectedSupplierContacts, setSelectedSupplierContacts] = useState(null);

  // Filtrar proveedores por nit o razón social
  const filteredSuppliers = suppliers?.filter((supplier) => {
    const term = searchTerm.toLowerCase();
    const nit = (supplier.nit || "").toLowerCase();
    const businessName = (supplier.businessName || "").toLowerCase();

    return nit.includes(term) || businessName.includes(term);
  }) || [];

  const handleDeleteClick = (id) => {
    console.log("Eliminar proveedor:", id);
  };

  return (
    <div className="relative">
      <div className="p-8">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Lista Proveedores
            </h1>
            <p className="text-gray-500">Gestión de tus proveedores</p>
          </div>

          <Link
            to="/proveedores/nuevo"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>➕</span>
            Nuevo Proveedor
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por NIT o Razón Social"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Cargando */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 font-medium">
              Cargando proveedores...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6"
            role="alert"
          >
            <p className="font-bold">Error de conexión</p>
            <p>{error}</p>
          </div>
        )}

        {/* Tabla de Proveedores */}
        {!loading && !error && (
          <>
            {filteredSuppliers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No se encontraron proveedores que coincidan con la búsqueda.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
                      <th className="p-4 font-medium">NIT</th>
                      <th className="p-4 font-medium">Razón Social</th>
                      <th className="p-4 font-medium">Ciudad</th>
                      <th className="p-4 font-medium">Dirección</th>
                      <th className="p-4 font-medium text-center">Contactos</th>
                      <th className="p-4 font-medium text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.nit} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-900 font-medium">{supplier.nit}</td>
                        <td className="p-4 text-sm text-gray-900">{supplier.businessName}</td>
                        <td className="p-4 text-sm text-gray-600">{supplier.city}</td>
                        <td className="p-4 text-sm text-gray-600">{supplier.address}</td>
                        <td className="p-4 text-sm text-center">
                          <button
                            onClick={() => setSelectedSupplierContacts({ businessName: supplier.businessName, contacts: supplier.contacts })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors font-medium text-xs"
                            disabled={!supplier.contacts || supplier.contacts.length === 0}
                          >
                            👥 Ver ({supplier.contacts?.length || 0})
                          </button>
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center justify-center gap-3">
                            <Link
                              to={`/proveedores/editar/${supplier.nit}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(supplier.nit)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Contactos */}
      {selectedSupplierContacts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Contactos - {selectedSupplierContacts.businessName}
              </h3>
              <button 
                onClick={() => setSelectedSupplierContacts(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {selectedSupplierContacts.contacts && selectedSupplierContacts.contacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSupplierContacts.contacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-1">{contact.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{contact.department || "Sin departamento"}</p>
                      
                      <div className="space-y-1 mt-3">
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="text-gray-400">📞</span> {contact.phone || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="text-gray-400">✉️</span> {contact.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay contactos registrados.</p>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedSupplierContacts(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

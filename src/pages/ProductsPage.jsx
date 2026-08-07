import { useProducts } from '../hooks/useProducts';

const ProductsPage = () => {
  // Consumimos nuestro Custom Hook
  const { products, loading, error } = useProducts();

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventario de Ferretería</h1>
        <p className="text-gray-500">Gestión de productos y existencias</p>
      </header>

      {/* Manejo del estado: Cargando */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 font-medium">Cargando catálogo...</span>
        </div>
      )}

      {/* Manejo del estado: Error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6" role="alert">
          <p className="font-bold">Error de conexión</p>
          <p>{error}</p>
        </div>
      )}

      {/* Manejo del estado: Éxito (Renderizado de la tabla) */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th scope="col" className="px-6 py-4">Código</th>
                <th scope="col" className="px-6 py-4">Nombre</th>
                <th scope="col" className="px-6 py-4">Unidad de Medida</th>
                <th scope="col" className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No hay productos registrados en el inventario.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.code || 'N/A'}</td>
                    <td className="px-6 py-4">{product.name || 'Sin nombre'}</td>
                    <td className="px-6 py-4 text-gray-600">{product.unitOfMeasure || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {product.status || 'Activo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
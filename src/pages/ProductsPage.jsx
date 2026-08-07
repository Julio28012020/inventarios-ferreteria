import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const ProductsPage = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado múltiple (Búsqueda por código, nombre, marca, categoría, referencia)
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const code = (product.code || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const reference = (product.reference || '').toLowerCase();

    return (
      code.includes(term) ||
      name.includes(term) ||
      brand.includes(term) ||
      category.includes(term) ||
      reference.includes(term)
    );
  });

  return (
    <div className="p-8">
      {/* Cabecera con Título y Botón Nuevo Producto */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventario de Ferretería</h1>
          <p className="text-gray-500">Gestión de productos, existencias y catálogos</p>
        </div>
        <Link
          to="/inventario/nuevo"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span>➕</span> Nuevo Producto
        </Link>
      </div>

      {/* Barra de Búsqueda Inteligente */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por código, nombre, marca, categoría o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Estados: Cargando */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 font-medium">Cargando catálogo...</span>
        </div>
      )}

      {/* Estados: Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6" role="alert">
          <p className="font-bold">Error de conexión</p>
          <p>{error}</p>
        </div>
      )}

      {/* Estados: Listado en Tarjetas (Cards) */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con la búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold tracking-wider">
                        {product.code || 'S/C'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        (product.status || 'ACTIVO') === 'ACTIVO' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status || 'ACTIVO'}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-snug">
                      {product.name || 'Sin nombre'}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium text-gray-500">Marca:</span> {product.brand || 'No especificada'}</p>
                      <p><span className="font-medium text-gray-500">Categoría:</span> {product.category || 'General'}</p>
                      <p><span className="font-medium text-gray-500">Referencia:</span> {product.reference || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Unidad: <strong className="text-gray-700">{product.unitOfMeasure || 'UNIDAD'}</strong></span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Ver detalles →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
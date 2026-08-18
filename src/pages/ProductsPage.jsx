import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import Alert from '../components/ui/Alert';
import productService from '../services/productService';

const ProductsPage = () => {
  const { products, loading, error } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');

  // Descontinuar producto
  const handleDeleteClick = async (product) => {

    const result = await Alert.question({
      title: '¿Descontinuar producto?',
      text: `¿Está seguro de que desea descontinuar "${product.name}"?`,
      confirmText: 'Sí, descontinuar',
      cancelText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {

      // Enviar solicitud al backend
      await productService.deleteProduct(product.id);

      await Alert.success({
        title: 'Producto descontinuado',
        text: `El producto "${product.name}" fue descontinuado correctamente.`,
      });

      // Recargar la lista
      window.location.reload();

    } catch (error) {

      console.error('Error descontinuando producto:', error);

      await Alert.error({
        title: 'Error',
        text: 'No se pudo descontinuar el producto.',
      });
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter((product) => {

    const term = searchTerm.toLowerCase();

    const code = (product.code || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    const brand = (product.brand?.name || '').toLowerCase();
    const category = (product.category?.name || '').toLowerCase();

    return (
      code.includes(term) ||
      name.includes(term) ||
      brand.includes(term) ||
      category.includes(term)
    );
  });

  return (
    <div className="p-8">

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Inventario de Ferretería
          </h1>

          <p className="text-gray-500">
            Gestión de productos, existencias y catálogos
          </p>
        </div>

        <Link
          to="/inventario/nuevo"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span>➕</span>
          Nuevo Producto
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
            placeholder="Buscar por código, nombre, marca o categoría..."
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
            Cargando catálogo...
          </span>

        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm mb-6"
          role="alert"
        >
          <p className="font-bold">
            Error de conexión
          </p>

          <p>
            {error}
          </p>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">

              <p className="text-gray-500 text-lg">
                No se encontraron productos que coincidan con la búsqueda.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteClick}
                />
              ))}

            </div>

          )}
        </>
      )}

    </div>
  );
};

export default ProductsPage;
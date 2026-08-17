import React from 'react';
import { Link } from 'react-router-dom';

const unitLabels = {
  BOX: { singular: 'Caja', plural: 'Cajas' },
  GALLON: { singular: 'Galón', plural: 'Galones' },
  INCH: { singular: 'Pulgada', plural: 'Pulgadas' },
  KILOGRAM: { singular: 'Kilogramo', plural: 'Kilogramos' },
  LITER: { singular: 'Litro', plural: 'Litros' },
  METER: { singular: 'Metro', plural: 'Metros' },
  SQUARE_METER: { singular: 'Metro cuadrado', plural: 'Metros cuadrados' },
  PACK: { singular: 'Paquete', plural: 'Paquetes' },
  POUND: { singular: 'Libra', plural: 'Libras' },
  PIECE: { singular: 'Unidad', plural: 'Unidades' },
  QUART: { singular: 'Cuarto', plural: 'Cuartos' },
  ROLL: { singular: 'Rollo', plural: 'Rollos' },
  TON: { singular: 'Tonelada', plural: 'Toneladas' }
};

export const ProductCard = ({ product, onDelete }) => {
  if (!product) return null;

  const isStockCritical =
    product.currentStock <= product.minimumStock;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(value || 0);

  const unitInfo = unitLabels[product.unitOfMeasure] || {
    singular: 'Unidad',
    plural: 'Unidades'
  };

  const stock = product.currentStock ?? 0;

  const unit = stock === 1
    ? unitInfo.singular
    : unitInfo.plural;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">

      {/* Código y estado */}
      <div className="flex justify-between items-start gap-2 mb-3">
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold tracking-wider">
          {product.code || 'S/C'}
        </span>

        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${(product.status || 'ACTIVE') === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}
        >
          {product.status || 'ACTIVE'}
        </span>
      </div>

      {/* Nombre del producto */}
      <div className="mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {product.name || 'Sin nombre'}
        </h3>
      </div>

      {/* URL de la imagen */}
      {product.imageUrl && (
        <div className="mb-4 w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name || 'Imagen del producto'}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Marca */}
      <p>
        <span className="font-medium text-gray-500">
          Marca:
        </span>{' '}
        <strong className="text-gray-800">
          {product.brand?.name || 'No especificada'}
        </strong>
      </p>

      {/* Categoría */}
      <p>
        <span className="font-medium text-gray-500">
          Categoría:
        </span>{' '}
        <strong className="text-gray-800">
          {product.category?.name || 'General'}
        </strong>
      </p>

      {/* Precio de compra */}
      <p>
        <span className="font-medium text-gray-500">
          Precio compra:
        </span>{' '}
        <strong className="text-gray-800">
          {formatCurrency(product.purchasePrice)}
        </strong>
      </p>

      {/* Unidad */}
      <p>
        <span className="font-medium text-gray-500">
          Unidad:
        </span>{' '}
        <strong className="text-gray-800">
          {unitInfo.singular}
        </strong>
      </p>

      {/* Stock */}
      <p>
        📦{' '}
        <span className="font-medium text-gray-500">
          Stock:
        </span>{' '}
        <strong
          className={
            isStockCritical
              ? 'text-red-600'
              : 'text-gray-800'
          }
        >
          {stock} {unit}
        </strong>
      </p>

      {/* Stock mínimo */}
      <p>
        ⚠️{' '}
        <span className="font-medium text-gray-500">
          Stock mínimo:
        </span>{' '}
        <strong className="text-gray-800">
          {product.minimumStock ?? 0}
        </strong>
      </p>

      {/* Precio de venta y acciones */}
      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">

        <span className="text-sm text-gray-500">
          💰{' '}
          <strong className="text-green-700">
            {formatCurrency(product.salePrice)}
          </strong>
        </span>

        <div className="flex items-center gap-3">

          {/* Editar */}
          <Link
            to={`/inventario/editar/${product.id}`}
            className="text-blue-600 hover:text-blue-800 text-lg transition-transform hover:scale-110"
            title="Editar producto"
          >
            ✏️
          </Link>

          {/* Ocultar */}
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="text-red-600 hover:text-red-800 text-lg transition-transform hover:scale-110"
            title="Ocultar producto"
          >
            🗑️
          </button>

        </div>
      </div>

    </div>
  );
};

export default ProductCard;
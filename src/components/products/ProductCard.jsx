import React from 'react';

export const ProductCard = ({ product, onEdit }) => {
    // 1. Validar que product exista antes de hacer cualquier operación
  if (!product) return null; 
  // Validación para saber si el inventario está en un nivel crítico
  const isStockCritical = product.currentStock <= product.minimumStock;

  // Formateador de moneda automático para los precios
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP', // Cambia a 'USD', 'MXN', etc., según tu moneda
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="max-w-sm w-full rounded-xl overflow-hidden shadow-sm bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      
      {/* Contenedor de Imagen y Estados */}
      <div className="relative bg-slate-50 h-48 w-full flex items-center justify-center overflow-hidden border-b border-slate-100">
        <img 
          className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-300" 
          src={product.imageUrl || 'https://placeholder.com'} 
          alt={product.name}
        />
        
        {/* Badge de Estado del Producto */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm text-white ${
          product.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-rose-600'
        }`}>
          {product.status}
        </span>
        
        {/* Código SKU único mapeado desde tu base de datos */}
        <span className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] tracking-wider px-2 py-0.5 rounded font-mono">
          SKU: {product.code}
        </span>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-base font-bold text-slate-800 line-clamp-1 flex-grow" title={product.name}>
            {product.name}
          </h3>
        </div>
        
        {/* Identificador de la Marca */}
        <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
          Marca ID: {product.brandId}
        </p>

        {/* Descripción corta con límite de 2 líneas */}
        <p className="text-slate-500 text-xs line-clamp-2 min-h-[32px] mb-4">
          {product.description || 'Sin descripción detallada registrada.'}
        </p>

        {/* Módulo de Inventario con Alerta Visual */}
        <div className={`rounded-lg p-3 flex justify-between items-center text-xs border ${
          isStockCritical 
            ? 'bg-rose-50 border-rose-100 text-rose-900' 
            : 'bg-slate-50 border-slate-100 text-slate-700'
        }`}>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-70">Stock Actual</p>
            <p className={`text-base font-black ${isStockCritical ? 'text-rose-600' : 'text-slate-800'}`}>
              {product.currentStock} <span className="text-xs font-normal opacity-80">{product.unitOfMeasure?.toLowerCase()}(s)</span>
            </p>
          </div>
          <div className="text-right border-l border-slate-200 pl-3">
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-70">Mínimo</p>
            <p className="text-sm font-bold">{product.minimumStock}</p>
          </div>
        </div>
      </div>

      {/* Pie de Tarjeta: Precios de venta y Acciones */}
      <div className="px-5 pb-5 pt-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Precio Público</p>
          <p className="text-xl font-black text-slate-900">
            {formatCurrency(product.salePrice)}
          </p>
        </div>
        
        {/* Dispara la función onEdit pasando el código del producto */}
        {onEdit && (
          <button 
            onClick={() => onEdit(product.code)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            title="Editar producto"
          >
            <svg xmlns="http://w3.org" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

    </div>
  );
};



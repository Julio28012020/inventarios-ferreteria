import React, { useEffect, useState } from 'react';
import productService from './services/productService'; // El archivo de Axios que creamos antes
import { ProductCard } from './components/products/ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        
        // Verificación de seguridad: asegurarnos que llegue un arreglo
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error conectando al backend:", err);
        setError("No se pudo cargar el inventario. Verifique el servidor.");
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  // 🛑 CONTROL DE FLUJO: Si está cargando o hay error, NO renderiza las tarjetas
  if (loading) return <div className="p-8 text-center font-bold text-slate-600">Cargando productos desde la ferretería...</div>;
  if (error) return <div className="p-8 text-center font-bold text-rose-600">{error}</div>;
  if (products.length === 0) return <div className="p-8 text-center text-slate-500">No hay productos registrados en el inventario.</div>;

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-black text-slate-800 mb-6 uppercase">📦 Inventario de Ferretería</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          // Envia el objeto iterado directamente a la propiedad 'product'
          <ProductCard key={prod.code} product={prod} />
        ))}
      </div>
    </div>
  );
}

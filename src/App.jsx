import React, { useEffect, useState } from 'react';
import productService from './services/productService'; // El archivo de Axios que creamos antes
import { ProductCard } from './components/products/ProductCard';
import { ProductForm } from './components/products/ProductForm';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const handleCreate = () => {
  setShowForm(true);
};

  //CONTROL DE FLUJO
  if (loading) {
    return <div>Cargando productos desde la ferretería...</div>;
  }

  if (error) {
   return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div>No hay productos registrados en el inventario.</div>;
  }

   return (
  <div className="p-8 bg-slate-100 min-h-screen">

    <div className="flex items-center justify-between mb-6">

      <h1 className="text-2xl font-black text-slate-800 uppercase">
        📦 Inventario de Ferretería
      </h1>

      <button
        onClick={handleCreate}
        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg"
      >
        + Nuevo producto
      </button>

    </div>

    {showForm && (
      <ProductForm />
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {products.map((prod) => (
        <ProductCard
          key={prod.code}
          product={prod}
        />
      ))}

    </div>

  </div>
);
}

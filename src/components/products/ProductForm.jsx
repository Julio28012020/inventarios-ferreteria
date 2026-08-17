import React, { useEffect, useState } from 'react';
import brandService from '../../services/brandService';
import productService from '../../services/productService';


export const ProductForm = () => {

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [brands, setBrands] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [minimumStock, setMinimumStock] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('PIECE');
  const [status, setStatus] = useState('ACTIVE');

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await brandService.getAllBrands();

        if (Array.isArray(data)) {
          setBrands(data);
        } else {
          setBrands([]);
        }

      } catch (error) {
        console.error('Error cargando las marcas:', error);
      }
    };

    loadBrands();
  }, []);

      const handleSubmit = async (e) => {
    e.preventDefault();

    // Construimos el objeto EXACTAMENTE como lo pide Product.java
    const productData = {
      code: code,
      name: name,
      description: description,
      brandId: Number(brandId),
      imageUrl: imageUrl,
      purchasePrice: Number(purchasePrice),
      salePrice: Number(salePrice),
      currentStock: Number(currentStock),
      minimumStock: Number(minimumStock),
      unitOfMeasure: unitOfMeasure, // Asegúrate de elegir una opción del select
      status: status // Asegúrate de elegir una opción del select
    };

    console.log(productData);

    try {
      // Enviamos el objeto plano por Axios
      await productService.createProduct(productData);
      alert('¡Producto guardado con éxito!');
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Hubo un error al guardar el producto');
    }
  };



  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >

      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Nuevo producto
      </h2>

      {/* Código */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Código / SKU
        </label>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ej: MART-002"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Nombre */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nombre del producto
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Martillo de 16 onzas"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Descripción */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Descripción
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Martillo de acero con mango ergonómico."
          rows="3"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Marca */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Marca
        </label>

        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="">
            Seleccione una marca
          </option>

          {[...brands]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
        </select>
      </div>

      {/* URL imagen */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          URL de la imagen
        </label>

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Ej: https://ejemplo.com/martillo.jpg"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Precio de compra */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Precio de compra
        </label>

        <input
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          placeholder="Ej: 25000"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Precio de venta */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Precio de venta
        </label>

        <input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          placeholder="Ej: 35000"
          min="0"
          step="0.01"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Stock actual */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Stock actual
        </label>

        <input
          type="number"
          value={currentStock}
          onChange={(e) => setCurrentStock(e.target.value)}
          placeholder="Ej: 20"
          min="0"
          step="0.01"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Stock mínimo */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Stock mínimo
        </label>

        <input
          type="number"
          value={minimumStock}
          onChange={(e) => setMinimumStock(e.target.value)}
          placeholder="Ej: 5"
          min="0"
          step="0.01"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>

      {/* Unidad de medida */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Unidad de medida
        </label>

        <select
          value={unitOfMeasure}
          onChange={(e) => setUnitOfMeasure(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="BOX">Caja</option>
          <option value="GALLON">Galón</option>
          <option value="INCH">Pulgada</option>
          <option value="KILOGRAM">Kilogramo</option>
          <option value="LITER">Litro</option>
          <option value="METER">Metro</option>
          <option value="SQUARE_METER">Metro cuadrado</option>
          <option value="PACK">Paquete</option>
          <option value="POUND">Libra</option>
          <option value="PIECE">Unidad</option>
          <option value="QUART">Cuarto</option>
          <option value="ROLL">Rollo</option>
          <option value="TON">Tonelada</option>
        </select>
      </div>

      {/* Estado */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Estado
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        >
          <option value="ACTIVE">Activo</option>
          <option value="DISCONTINUED">Descontinuado</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      </div>

      {/* Botón */}
      <div className="mt-6">
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg"
        >
          Guardar producto
        </button>
      </div>

    </form>
  );
};
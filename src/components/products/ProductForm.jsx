import React, { useState } from 'react';

export const ProductForm = () => {

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Formulario enviado');
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
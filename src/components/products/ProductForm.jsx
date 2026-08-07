import React from 'react';

export const ProductForm = () => {

  const [code, setCode] = useState('');
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">

      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Nuevo producto
      </h2>

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
      
    </div>
  );
};
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import brandService from "../services/brandService";
import productService from "../services/productService";
import Alert from "../components/ui/Alert";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(true);

  // Cargar marcas
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await brandService.getAllBrands();

        if (Array.isArray(data)) {
          setBrands(data);
        }
      } catch (error) {
        console.error('Error cargando las marcas:', error);
      }
    };

    loadBrands();
  }, []);

  // Cargar producto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await productService.getProductById(id);

        setCode(product.code || '');
        setName(product.name || '');
        setDescription(product.description || '');
        setBrandId(product.brand?.id || product.brandId || '');
        setImageUrl(product.imageUrl || '');
        setPurchasePrice(product.purchasePrice || '');
        setSalePrice(product.salePrice || '');
        setCurrentStock(product.currentStock || '');
        setMinimumStock(product.minimumStock || '');
        setUnitOfMeasure(product.unitOfMeasure || 'PIECE');
        setStatus(product.status || 'ACTIVE');

      } catch (error) {
        console.error('Error cargando el producto:', error);

        await Alert.error({
          title: 'Error al cargar',
          text: 'No se pudo cargar el producto.',
        });

        navigate('/inventario/productos');

      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      await Alert.warning({
        title: 'Código requerido',
        text: 'Debe ingresar el código o SKU del producto.',
      });
      return;
    }

    if (!name.trim()) {
      await Alert.warning({
        title: 'Nombre requerido',
        text: 'Debe ingresar el nombre del producto.',
      });
      return;
    }

    if (!brandId) {
      await Alert.warning({
        title: 'Marca requerida',
        text: 'Debe seleccionar una marca.',
      });
      return;
    }

    if (!salePrice || Number(salePrice) < 0) {
      await Alert.warning({
        title: 'Precio de venta inválido',
        text: 'Ingrese un precio de venta válido.',
      });
      return;
    }

    if (!minimumStock || Number(minimumStock) < 0) {
      await Alert.warning({
        title: 'Stock mínimo inválido',
        text: 'Ingrese un stock mínimo válido.',
      });
      return;
    }

    const result = await Alert.question({
      title: '¿Guardar cambios?',
      text: `Se actualizará la información del producto "${name}".`,
      confirmText: 'Sí, guardar cambios',
      cancelText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      return;
    }

    const productData = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      brandId: Number(brandId),
      imageUrl: imageUrl.trim(),
      purchasePrice: Number(purchasePrice),
      salePrice: Number(salePrice),
      minimumStock: Number(minimumStock),
      unitOfMeasure,
      status
    };

    try {

      await productService.updateProduct(id, productData);

      await Alert.success({
        title: 'Producto actualizado',
        text: `El producto "${name}" fue actualizado correctamente.`,
        confirmText: 'Continuar',
      });

      navigate('/inventario/productos');

    } catch (error) {

      console.error('Error actualizando producto:', error);

      await Alert.error({
        title: 'No se pudo actualizar',
        text:
          error.response?.data?.message ||
          'Ocurrió un error al actualizar el producto.',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">
          Cargando producto...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ✏️ Editar producto
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >

        {/* Código */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Código / SKU
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Precio compra */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Precio de compra
          </label>

          <input
            type="number"
            value={purchasePrice}
            disabled
            className="w-full border border-slate-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 cursor-not-allowed"
          />

          <p className="text-xs text-gray-500 mt-1">
            El precio de compra no se puede modificar desde la edición.
          </p>
        </div>

        {/* Precio venta */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Precio de venta
          </label>

          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            min="0"
            step="0.01"
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Stock actual - NO EDITABLE */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Stock actual
          </label>

          <input
            type="number"
            value={currentStock}
            disabled
            className="w-full border border-slate-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 cursor-not-allowed"
          />

          <p className="text-xs text-gray-500 mt-1">
            El stock se modifica mediante movimientos de inventario.
          </p>
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
            min="0"
            step="0.01"
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Unidad */}
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
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div className="mt-6 flex gap-3">

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg"
          >
            💾 Guardar cambios
          </button>

          <button
            type="button"
            onClick={() => navigate('/inventario/productos')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-2 rounded-lg"
          >
            ↩️ Cancelar
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditProductPage;
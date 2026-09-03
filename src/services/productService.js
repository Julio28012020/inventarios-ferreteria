import axiosClient from '../config/axiosClient';

const productService = {

  // Obtener todos los productos para Inventario
  getAllProducts: async () => {
    const response = await axiosClient.get('/products');
    return response.data;
  },

  // Obtener solo productos activos para Ventas
  getActiveProducts: async () => {
    const response = await axiosClient.get('/products/active');
    return response.data;
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  // Crear un producto
  createProduct: async (productData) => {
    const response = await axiosClient.post('/products', productData);
    return response.data;
  },

  // Actualizar un producto por ID
  updateProduct: async (id, productData) => {
    const response = await axiosClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Descontinuar un producto por ID
  deleteProduct: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },

};

export default productService;
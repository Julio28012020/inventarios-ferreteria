import axiosClient from '../config/axiosClient';

const productService = {

  // Obtener todos los productos
  getAllProducts: async () => {
    const response = await axiosClient.get('/products');
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

};

export default productService;
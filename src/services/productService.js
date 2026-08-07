import axiosClient from '../config/axiosClient';

const productService = {
  
  getAllProducts: async () => {
    const response = await axiosClient.get('/products');
    return response.data;
  },

  getProductByCode: async (code) => {
    const response = await axiosClient.get(`/products/${code}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosClient.post('/products', productData);
    return response.data;
  },

  updateProduct: async (code, productData) => {
    const response = await axiosClient.put(`/products/${code}`, productData);
    return response.data;
  },

  deleteProduct: async (code) => {
    const response = await axiosClient.delete(`/products/${code}`);
    return response.data;
  }
};

export default productService;

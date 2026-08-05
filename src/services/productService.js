import axios from 'axios';

// Cambia esta URL por la dirección real de tu backend de Spring Boot
const API_BASE_URL = 'http://localhost:8080/products';

const productService = {
  /**
   * Obtiene todos los productos del inventario
   * @returns {Promise<Array>} Lista de productos
   */
  getAllProducts: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  },

  /**
   * Busca un producto específico por su código único (code)
   * @param {string} code - Código único del producto
   * @returns {Promise<Object>} Datos del producto
   */
  getProductByCode: async (code) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el producto con código ${code}:`, error);
      throw error;
    }
  },

  /**
   * Registra un nuevo producto en la ferretería
   * @param {Object} productData - Objeto con los datos que mapean la entidad Product
   * @returns {Promise<Object>} Producto guardado
   */
  createProduct: async (productData) => {
    try {
      const response = await axios.post(API_BASE_URL, productData);
      return response.data;
    } catch (error) {
      console.error("Error al crear el producto:", error);
      throw error;
    }
  },

  /**
   * Actualiza un producto existente buscando por su código
   * @param {string} code - Código del producto a editar
   * @param {Object} productData - Nuevos datos modificados
   * @returns {Promise<Object>} Producto actualizado
   */
  updateProduct: async (code, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${code}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el producto con código ${code}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un producto del sistema o lo cambia de estado
   * @param {string} code - Código del producto a eliminar
   */
  deleteProduct: async (code) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el producto con código ${code}:`, error);
      throw error;
    }
  }
};

export default productService;

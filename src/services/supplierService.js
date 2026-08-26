import axios from 'axios';

// Ajusta esta URL base dependiendo de la configuración de tu backend en Spring Boot
// Si usas Vite, podrías usar: const API_URL = `${import.meta.env.VITE_API_URL}/api/suppliers`;
const API_URL = 'http://localhost:8080/api/suppliers';

/**
 * Obtiene la lista de todos los proveedores
 */
const getAllSuppliers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Obtiene un proveedor específico por su NIT
 */
const getSupplierByNit = async (nit) => {
    const response = await axios.get(`${API_URL}/${nit}`);
    return response.data;
};

/**
 * Crea un nuevo proveedor
 * @param {Object} supplierData - Objeto que coincide con SupplierRequestDto
 */
const createSupplier = async (supplierData) => {
    const response = await axios.post(API_URL, supplierData);
    return response.data;
};

/**
 * Actualiza un proveedor existente
 * @param {String} nit - El NIT del proveedor a actualizar
 * @param {Object} supplierData - Objeto con los datos actualizados
 */
const updateSupplier = async (nit, supplierData) => {
    const response = await axios.put(`${API_URL}/${nit}`, supplierData);
    return response.data;
};

/**
 * Elimina un proveedor por su NIT
 */
const deleteSupplier = async (nit) => {
    const response = await axios.delete(`${API_URL}/${nit}`);
    return response.data;
};

const supplierService = {
    getAllSuppliers,
    getSupplierByNit,
    createSupplier,
    updateSupplier,
    deleteSupplier
};

export default supplierService;
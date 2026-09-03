import axios from 'axios';

const API_URL = 'http://localhost:8080/api/customers';

/**
 * Obtiene todos los clientes
 */
const getAllCustomers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Obtiene un cliente por ID
 */
const getCustomerById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Crea un nuevo cliente
 */
const createCustomer = async (customerData) => {
    const response = await axios.post(API_URL, customerData);
    return response.data;
};

/**
 * Actualiza un cliente
 */
const updateCustomer = async (id, customerData) => {
    const response = await axios.put(`${API_URL}/${id}`, customerData);
    return response.data;
};

/**
 * Elimina un cliente
 */
const deleteCustomer = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

const customerService = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};

export default customerService;
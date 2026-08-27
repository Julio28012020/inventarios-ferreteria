import axiosClient from '../config/axiosClient';

const saleService = {

    // Crear una venta
    createSale: async (saleData) => {
        const response = await axiosClient.post('/sales', saleData);
        return response.data;
    },

    // Obtener todas las ventas
    getSales: async () => {
        const response = await axiosClient.get('/sales');
        return response.data;
    },

    // Obtener una venta
    getSaleById: async (id) => {
        const response = await axiosClient.get(`/sales/${id}`);
        return response.data;
    },

};

export default saleService;
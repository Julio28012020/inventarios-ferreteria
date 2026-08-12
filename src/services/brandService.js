import axiosClient from '../config/axiosClient';

const brandService = {

    getAllBrands: async () => {
        try {
            const response = await axiosClient.get('/brands');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las marcas:', error);
            throw error;
        }
    }

};

export default brandService;
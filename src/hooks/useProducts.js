import { useState, useEffect } from 'react';
import productService from '../services/productService';

export const useProducts = (onlyActive = false) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = onlyActive
                ? await productService.getActiveProducts()
                : await productService.getAllProducts();

            setProducts(data);

        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                'Ocurrió un error al intentar conectar con el servidor.';

            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [onlyActive]);

    return {
        products,
        loading,
        error,
        refreshProducts: loadProducts
    };
};
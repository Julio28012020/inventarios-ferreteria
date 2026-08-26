import { useState, useEffect, useCallback } from 'react'; // 1. Importa useCallback
import supplierService from '../services/supplierService';

export const useSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Envuelve la función en useCallback
    const loadSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await supplierService.getAllSuppliers();
            setSuppliers(data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error de conexión.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []); // 3. Arreglo vacío porque no depende de variables externas que cambien

    // 4. Ahora agregas loadSuppliers al arreglo de dependencias
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadSuppliers();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [loadSuppliers]);

    return {
        suppliers,
        loading,
        error,
        refreshSuppliers: loadSuppliers 
    };
};
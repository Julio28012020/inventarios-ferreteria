import { useState, useEffect, useCallback } from 'react';
import customerService from '../services/customerService';

export const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await customerService.getAllCustomers();
            setCustomers(data);
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || 'Error de conexión.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadCustomers();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [loadCustomers]);

    return {
        customers,
        loading,
        error,
        refreshCustomers: loadCustomers
    };
}
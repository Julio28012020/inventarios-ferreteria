import { useState, useEffect } from 'react';
import productService from '../services/productService';

export const useProducts = () => {
    // 1. Definición de los estados
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Función principal para cargar los datos
    const loadProducts = async () => {
        setLoading(true); // Iniciamos el estado de carga
        setError(null);   // Limpiamos errores previos
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            // Aquí aprovechamos el GlobalExceptionHandler del backend
            // Si el backend envía un mensaje de error limpio, lo tomamos; si no, usamos un genérico.
            const errorMessage = err.response?.data?.message || 'Ocurrió un error al intentar conectar con el servidor.';
            setError(errorMessage);
        } finally {
            setLoading(false); // Apagamos la carga sin importar si falló o fue exitoso
        }
    };

    // 3. Ejecutar la carga automáticamente cuando el componente que use este hook se monte en pantalla
    useEffect(() => {
        loadProducts();
    }, []);

    // 4. Exponemos los estados y funciones para que la vista los pueda utilizar
    return {
        products,
        loading,
        error,
        refreshProducts: loadProducts // Por si necesitamos recargar la lista manualmente después de crear un producto
    };
};
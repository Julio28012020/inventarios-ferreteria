import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import saleService from "../services/saleService";
import Alert from "../components/ui/Alert";

const SalesPage = () => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("salesCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [searchTerm, setSearchTerm] = useState("");
    const [processingSale, setProcessingSale] = useState(false);

    const { products, loading, error } = useProducts();

    useEffect(() => {
        localStorage.setItem("salesCart", JSON.stringify(cart));
    }, [cart]);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agregar producto al carrito
    const addToCart = async (product) => {
        const currentStock = Number(product.currentStock);

        if (currentStock <= 0) {
            await Alert.warning({
                title: "Producto sin stock",
                text: `El producto ${product.name} no tiene unidades disponibles.`
            });

            return;
        }

        const existingProduct = cart.find(
            (item) => item.id === product.id
        );

        if (existingProduct) {
            if (existingProduct.quantity >= currentStock) {
                await Alert.warning({
                    title: "Stock insuficiente",
                    text: `No puedes agregar más unidades de ${product.name}.`
                });

                return;
            }

            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);
        }
    };

    // Aumentar cantidad
    const increaseQuantity = async (item) => {
        const currentStock = Number(item.currentStock);

        if (item.quantity >= currentStock) {
            await Alert.warning({
                title: "Stock insuficiente",
                text: `No hay más unidades disponibles de ${item.name}.`
            });

            return;
        }

        setCart(
            cart.map((product) =>
                product.id === item.id
                    ? {
                        ...product,
                        quantity: product.quantity + 1
                    }
                    : product
            )
        );
    };

    // Disminuir cantidad
    const decreaseQuantity = (item) => {
        if (item.quantity === 1) {
            setCart(
                cart.filter(
                    (product) => product.id !== item.id
                )
            );

            return;
        }

        setCart(
            cart.map((product) =>
                product.id === item.id
                    ? {
                        ...product,
                        quantity: product.quantity - 1
                    }
                    : product
            )
        );
    };

    // Eliminar producto
    const removeFromCart = async (item) => {
        const confirmation = await Alert.question({
            title: "¿Eliminar producto?",
            text: `¿Deseas eliminar ${item.name} del carrito?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar"
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        setCart(
            cart.filter(
                (product) => product.id !== item.id
            )
        );
    };

    // Calcular total
    const calculateTotal = () => {
        return cart.reduce(
            (total, item) =>
                total + Number(item.salePrice) * item.quantity,
            0
        );
    };

    // Finalizar venta
    const finalizeSale = async () => {
        if (cart.length === 0) {
            await Alert.warning({
                title: "Carrito vacío",
                text: "Agrega al menos un producto antes de finalizar la venta."
            });

            return;
        }

        const confirmation = await Alert.question({
            title: "¿Finalizar venta?",
            text: "¿Está seguro de que desea registrar esta venta?",
            confirmText: "Sí, finalizar",
            cancelText: "Cancelar"
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        const saleData = {
            paymentMethod: paymentMethod,
            details: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            setProcessingSale(true);

            await saleService.createSale(saleData);

            localStorage.removeItem("salesCart");

            setCart([]);

            await Alert.success({
                title: "Venta realizada",
                text: "La venta se registró correctamente."
            });
        } catch (error) {
            console.error("Error al crear la venta:", error);

            const message =
                error.response?.data?.message ||
                "No fue posible registrar la venta.";

            await Alert.error({
                title: "Error al registrar la venta",
                text: message
            });
        } finally {
            setProcessingSale(false);
        }
    };

    const total = calculateTotal();

    return (
        <div className="p-6">

            {/* Encabezado */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Nueva venta
                </h1>

                <p className="text-gray-500 mt-1">
                    Selecciona los productos que deseas vender
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Productos */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Productos
                    </h2>

                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                        {loading && (
                            <p className="text-gray-500">
                                Cargando productos...
                            </p>
                        )}

                        {error && (
                            <p className="text-red-500">
                                {error}
                            </p>
                        )}

                        {!loading && !error && filteredProducts.length === 0 && (
                            <p className="text-gray-500">
                                No se encontraron productos.
                            </p>
                        )}

                        {!loading && !error && filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                            >

                                <h3 className="font-semibold text-gray-800">
                                    {product.name}
                                </h3>

                                <p className="text-gray-500 text-sm">
                                    Código: {product.code}
                                </p>

                                <p className="text-blue-600 font-bold mt-2">
                                    ${Number(product.salePrice).toLocaleString("es-CO")}
                                </p>

                                <p className="text-gray-500 text-sm">
                                    Stock: {product.currentStock}
                                </p>

                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={Number(product.currentStock) <= 0}
                                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition"
                                >
                                    {Number(product.currentStock) <= 0
                                        ? "Sin stock"
                                        : "Agregar"}
                                </button>

                            </div>
                        ))}

                    </div>

                </div>

                {/* Carrito */}
                <div className="bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Carrito
                    </h2>

                    {cart.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-lg">
                                El carrito está vacío
                            </p>

                            <p className="text-sm mt-1">
                                Agrega productos para comenzar
                            </p>
                        </div>
                    )}

                    {cart.length > 0 && (
                        <div className="space-y-4">

                            {cart.map((item) => {
                                const subtotal =
                                    Number(item.salePrice) *
                                    item.quantity;

                                return (
                                    <div
                                        key={item.id}
                                        className="border-b border-gray-200 pb-4"
                                    >

                                        {/* Producto */}
                                        <div className="flex justify-between items-start">

                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {item.name}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    ${Number(item.salePrice).toLocaleString("es-CO")}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                🗑️
                                            </button>

                                        </div>

                                        {/* Cantidad */}
                                        <div className="flex items-center justify-between mt-3">

                                            <div className="flex items-center border border-gray-300 rounded-lg">

                                                <button
                                                    onClick={() => decreaseQuantity(item)}
                                                    className="px-3 py-1 text-lg hover:bg-gray-100"
                                                >
                                                    −
                                                </button>

                                                <span className="px-4 font-semibold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => increaseQuantity(item)}
                                                    className="px-3 py-1 text-lg hover:bg-gray-100"
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <p className="font-bold text-gray-800">
                                                ${subtotal.toLocaleString("es-CO")}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                            {/* Totales */}
                            <div className="mt-6 border-t border-gray-200 pt-5">

                                <div className="flex justify-between text-gray-600">
                                    <span>
                                        Subtotal
                                    </span>

                                    <span>
                                        ${total.toLocaleString("es-CO")}
                                    </span>
                                </div>

                                <div className="flex justify-between mt-2 text-xl font-bold text-gray-800">
                                    <span>
                                        Total
                                    </span>

                                    <span>
                                        ${total.toLocaleString("es-CO")}
                                    </span>
                                </div>

                            </div>

                            {/* Método de pago */}
                            <div className="mt-5">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Método de pago
                                </label>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="CASH">
                                        Efectivo
                                    </option>

                                    <option value="CARD">
                                        Tarjeta
                                    </option>

                                    <option value="TRANSFER">
                                        Transferencia
                                    </option>
                                </select>

                            </div>

                            {/* Finalizar venta */}
                            <button
                                onClick={finalizeSale}
                                disabled={processingSale}
                                className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                            >
                                {processingSale
                                    ? "Registrando venta..."
                                    : "Finalizar venta"}
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default SalesPage;
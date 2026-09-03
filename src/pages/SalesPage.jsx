import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import saleService from "../services/saleService";
import customerService from "../services/customerService";
import Alert from "../components/ui/Alert";

const SalesPage = () => {
    const navigate = useNavigate();

    // CARRITO
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("salesCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // CLIENTE
    const [customers, setCustomers] = useState([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // VENTA
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [searchTerm, setSearchTerm] = useState("");
    const [processingSale, setProcessingSale] = useState(false);

    const {
        products,
        loading,
        error
    } = useProducts(true);

    // GUARDAR CARRITO
    useEffect(() => {
        localStorage.setItem(
            "salesCart",
            JSON.stringify(cart)
        );
    }, [cart]);

    // CARGAR CLIENTES
    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoadingCustomers(true);

                const data =
                    await customerService.getAllCustomers();

                setCustomers(data);
            } catch (error) {
                console.error(
                    "Error al cargar clientes:",
                    error
                );
            } finally {
                setLoadingCustomers(false);
            }
        };

        loadCustomers();
    }, []);

    // FILTRAR PRODUCTOS
    const filteredProducts = products.filter((product) =>
        product.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        product.code
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // FILTRAR CLIENTES
    const filteredCustomers = customers.filter((customer) => {
        const term = customerSearch.toLowerCase();

        return (
            customer.fullName
                ?.toLowerCase()
                .includes(term) ||
            customer.documentNumber
                ?.toLowerCase()
                .includes(term)
        );
    });

    // AGREGAR PRODUCTO
    const addToCart = async (product) => {
        const currentStock = Number(product.currentStock);

        if (currentStock <= 0) {
            await Alert.warning({
                title: "Producto sin stock",
                text:
                    `El producto ${product.name} no tiene unidades disponibles.`
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
                    text:
                        `No puedes agregar más unidades de ${product.name}.`
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

    // AUMENTAR CANTIDAD
    const increaseQuantity = async (item) => {
        const currentStock = Number(item.currentStock);

        if (item.quantity >= currentStock) {
            await Alert.warning({
                title: "Stock insuficiente",
                text:
                    `No hay más unidades disponibles de ${item.name}.`
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

    // DISMINUIR CANTIDAD
    const decreaseQuantity = (item) => {
        if (item.quantity === 1) {
            setCart(
                cart.filter(
                    (product) =>
                        product.id !== item.id
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

    // ELIMINAR PRODUCTO
    const removeFromCart = async (item) => {
        const confirmation = await Alert.question({
            title: "¿Eliminar producto?",
            text:
                `¿Deseas eliminar ${item.name} del carrito?`,
            confirmText: "Sí, eliminar",
            cancelText: "Cancelar"
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        setCart(
            cart.filter(
                (product) =>
                    product.id !== item.id
            )
        );
    };

    // SELECCIONAR CLIENTE
    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch("");
    };

    // QUITAR CLIENTE
    const removeCustomer = () => {
        setSelectedCustomer(null);
        setCustomerSearch("");
    };

    // CALCULAR TOTAL
    const calculateTotal = () => {
        return cart.reduce(
            (total, item) =>
                total +
                Number(item.salePrice) *
                item.quantity,
            0
        );
    };

    // FINALIZAR VENTA
    const finalizeSale = async () => {
        if (cart.length === 0) {
            await Alert.warning({
                title: "Carrito vacío",
                text:
                    "Agrega al menos un producto antes de finalizar la venta."
            });

            return;
        }

        const confirmation = await Alert.question({
            title: "¿Finalizar venta?",
            text:
                "¿Está seguro de que desea registrar esta venta?",
            confirmText: "Sí, finalizar",
            cancelText: "Cancelar"
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        const saleData = {
            customerId: selectedCustomer?.id || null,

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
            setSelectedCustomer(null);
            setCustomerSearch("");

            await Alert.success({
                title: "Venta realizada",
                text:
                    "La venta se registró correctamente."
            });
        } catch (error) {
            console.error(
                "Error al crear la venta:",
                error
            );

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

            {/* ENCABEZADO */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Nueva venta
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Selecciona los productos que deseas vender
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/ventas/historial")
                    }
                    className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-3 rounded-lg transition"
                >
                    📋 Historial de ventas
                </button>

            </div>

            {/* CONTENIDO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* PRODUCTOS */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Productos
                    </h2>

                    <input
                        type="text"
                        placeholder="Buscar producto por nombre o código..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
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

                        {!loading &&
                            !error &&
                            filteredProducts.length === 0 && (
                                <p className="text-gray-500">
                                    No se encontraron productos.
                                </p>
                            )}

                        {!loading &&
                            !error &&
                            filteredProducts.map(
                                (product) => (
                                    <div
                                        key={product.id}
                                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition bg-white"
                                    >

                                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">

                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    Sin imagen
                                                </span>
                                            )}

                                        </div>

                                        <div className="p-4">

                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {product.name}
                                            </h3>

                                            <p className="text-gray-500 text-sm mt-1">
                                                Código: {product.code}
                                            </p>

                                            <p className="text-blue-600 font-bold text-lg mt-2">
                                                $
                                                {Number(
                                                    product.salePrice
                                                ).toLocaleString(
                                                    "es-CO"
                                                )}
                                            </p>

                                            <p className="text-gray-500 text-sm">
                                                Stock: {product.currentStock}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                                disabled={
                                                    Number(
                                                        product.currentStock
                                                    ) <= 0
                                                }
                                                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition"
                                            >
                                                {Number(
                                                    product.currentStock
                                                ) <= 0
                                                    ? "Sin stock"
                                                    : "Agregar"}
                                            </button>

                                        </div>

                                    </div>
                                )
                            )}

                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-6">

                    {/* CLIENTE */}
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <div className="flex items-center justify-between mb-4">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    👤 Cliente
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Cliente de la venta
                                </p>
                            </div>

                            {selectedCustomer && (
                                <button
                                    type="button"
                                    onClick={removeCustomer}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Quitar
                                </button>
                            )}

                        </div>

                        {!selectedCustomer ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o documento..."
                                    value={customerSearch}
                                    onChange={(e) =>
                                        setCustomerSearch(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {loadingCustomers && (
                                    <p className="text-sm text-gray-500 mt-3">
                                        Cargando clientes...
                                    </p>
                                )}

                                {!loadingCustomers &&
                                    customerSearch.trim() !== "" &&
                                    filteredCustomers.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-3">
                                            No se encontraron clientes.
                                        </p>
                                    )}

                                {customerSearch.trim() !== "" &&
                                    filteredCustomers.length > 0 && (
                                        <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">

                                            {filteredCustomers.map(
                                                (customer) => (
                                                    <button
                                                        key={customer.id}
                                                        type="button"
                                                        onClick={() =>
                                                            selectCustomer(
                                                                customer
                                                            )
                                                        }
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
                                                    >
                                                        <p className="font-semibold text-gray-800">
                                                            {
                                                                customer.fullName
                                                            }
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                customer.documentType
                                                            }{" "}
                                                            {
                                                                customer.documentNumber
                                                            }
                                                        </p>
                                                    </button>
                                                )
                                            )}

                                        </div>
                                    )}

                                {customerSearch.trim() === "" && (
                                    <div className="mt-3 bg-gray-50 rounded-lg p-3">

                                        <p className="text-sm text-gray-500">
                                            No se ha seleccionado un cliente.
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            La venta se registrará como consumidor final.
                                        </p>

                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">

                                <p className="font-semibold text-gray-800">
                                    {selectedCustomer.fullName}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedCustomer.documentType}{" "}
                                    {selectedCustomer.documentNumber}
                                </p>

                                {selectedCustomer.phone && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        📞 {selectedCustomer.phone}
                                    </p>
                                )}

                            </div>
                        )}

                    </div>

                    {/* CARRITO */}
                    <div className="bg-white rounded-xl shadow-sm p-6">

                        <div className="flex items-center justify-between mb-4">

                            <h2 className="text-xl font-semibold text-gray-800">
                                🛒 Carrito
                            </h2>

                            {cart.length > 0 && (
                                <span className="text-sm text-gray-500">
                                    {cart.length} producto
                                    {cart.length !== 1
                                        ? "s"
                                        : ""}
                                </span>
                            )}

                        </div>

                        {cart.length === 0 && (
                            <div className="text-center py-8 text-gray-400">

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
                                        Number(
                                            item.salePrice
                                        ) *
                                        item.quantity;

                                    return (
                                        <div
                                            key={item.id}
                                            className="border-b border-gray-200 pb-4"
                                        >

                                            <div className="flex justify-between items-start gap-3">

                                                <div className="min-w-0">

                                                    <h3 className="font-semibold text-gray-800 truncate">
                                                        {item.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        $
                                                        {Number(
                                                            item.salePrice
                                                        ).toLocaleString(
                                                            "es-CO"
                                                        )}
                                                        {" "}×{" "}
                                                        {item.quantity}
                                                    </p>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    🗑️
                                                </button>

                                            </div>

                                            <div className="flex items-center justify-between mt-3">

                                                <div className="flex items-center border border-gray-300 rounded-lg">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item
                                                            )
                                                        }
                                                        className="px-3 py-1 text-lg hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="px-4 font-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item
                                                            )
                                                        }
                                                        className="px-3 py-1 text-lg hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                                <p className="font-bold text-gray-800">
                                                    $
                                                    {subtotal.toLocaleString(
                                                        "es-CO"
                                                    )}
                                                </p>

                                            </div>

                                        </div>
                                    );
                                })}

                                {/* TOTALES */}
                                <div className="border-t border-gray-200 pt-4">

                                    <div className="flex justify-between text-gray-600">

                                        <span>
                                            Subtotal
                                        </span>

                                        <span>
                                            $
                                            {total.toLocaleString(
                                                "es-CO"
                                            )}
                                        </span>

                                    </div>

                                    <div className="flex justify-between mt-2 text-xl font-bold text-gray-800">

                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            $
                                            {total.toLocaleString(
                                                "es-CO"
                                            )}
                                        </span>

                                    </div>

                                </div>

                                {/* MÉTODO DE PAGO */}
                                <div className="pt-2">

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Método de pago
                                    </label>

                                    <select
                                        value={paymentMethod}
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
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

                                <button
                                    type="button"
                                    onClick={finalizeSale}
                                    disabled={processingSale}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                                >
                                    {processingSale
                                        ? "Registrando venta..."
                                        : "✓ Finalizar venta"}
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SalesPage;
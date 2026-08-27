import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import saleService from "../services/saleService";
import Alert from "../components/ui/Alert";

const SalesHistoryPage = () => {

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    // Cargar ventas
    const loadSales = async () => {
        try {
            setLoading(true);

            const data = await saleService.getSales();

            setSales(data);

        } catch (error) {

            console.error("Error al cargar las ventas:", error);

            await Alert.error({
                title: "Error",
                text: "No fue posible cargar el historial de ventas."
            });

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSales();
    }, []);

    // Filtrar ventas por número
    const filteredSales = sales.filter((sale) =>
        sale.id.toString().includes(searchTerm.trim())
    );

    // Formatear fecha
    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short"
        });
    };

    // Formatear dinero
    const formatCurrency = (value) => {

        return Number(value || 0).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        });
    };

    // Método de pago
    const getPaymentMethod = (method) => {

        switch (method) {

            case "CASH":
                return "Efectivo";

            case "CARD":
                return "Tarjeta";

            case "TRANSFER":
                return "Transferencia";

            default:
                return method || "-";
        }
    };

    // Estado de venta
    const getStatus = (status) => {

        switch (status) {

            case "COMPLETED":
                return "Completada";

            case "PENDING":
                return "Pendiente";

            case "CANCELLED":
                return "Cancelada";

            default:
                return status || "-";
        }
    };

    return (
        <div className="p-6">

            {/* Encabezado */}
            <div className="mb-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">
                            Historial de ventas
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Consulta las ventas realizadas y sus facturas.
                        </p>

                    </div>

                    {/* Nueva venta */}
                    <button
                        onClick={() => navigate("/ventas")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition"
                    >
                        + Nueva venta
                    </button>

                </div>

            </div>

            {/* Buscador */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex-1">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar venta
                        </label>

                        <input
                            type="text"
                            placeholder="Buscar por número de venta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Cantidad de ventas */}
                    <div className="text-gray-600">

                        <p className="text-sm">
                            Ventas encontradas
                        </p>

                        <p className="text-2xl font-bold text-gray-800">
                            {filteredSales.length}
                        </p>

                    </div>

                </div>

            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {loading ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            Cargando ventas...
                        </p>

                    </div>

                ) : filteredSales.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500 text-lg">
                            No se encontraron ventas.
                        </p>

                        {searchTerm && (
                            <p className="text-gray-400 text-sm mt-2">
                                Intenta buscar con otro número de venta.
                            </p>
                        )}

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            {/* Cabecera */}
                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Venta
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Fecha
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Método de pago
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Total
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Estado
                                    </th>

                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">
                                        Acción
                                    </th>

                                </tr>

                            </thead>

                            {/* Ventas */}
                            <tbody>

                                {filteredSales.map((sale) => (

                                    <tr
                                        key={sale.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >

                                        {/* Número de venta */}
                                        <td className="px-6 py-4">

                                            <span className="font-bold text-gray-800">
                                                #{sale.id}
                                            </span>

                                        </td>

                                        {/* Fecha */}
                                        <td className="px-6 py-4 text-gray-600">

                                            {formatDate(sale.createdAt)}

                                        </td>

                                        {/* Método de pago */}
                                        <td className="px-6 py-4 text-gray-600">

                                            {getPaymentMethod(
                                                sale.paymentMethod
                                            )}

                                        </td>

                                        {/* Total */}
                                        <td className="px-6 py-4">

                                            <span className="font-bold text-gray-800">
                                                {formatCurrency(sale.total)}
                                            </span>

                                        </td>

                                        {/* Estado */}
                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                                    sale.status === "COMPLETED"
                                                        ? "bg-green-100 text-green-700"
                                                        : sale.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : sale.status === "CANCELLED"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                            >

                                                {getStatus(sale.status)}

                                            </span>

                                        </td>

                                        {/* Acción */}
                                        <td className="px-6 py-4 text-center">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/ventas/${sale.id}`
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
                                            >

                                                Ver factura

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default SalesHistoryPage;
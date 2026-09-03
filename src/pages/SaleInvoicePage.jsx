import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import saleService from "../services/saleService";
import Alert from "../components/ui/Alert";

const SaleInvoicePage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadSale = async () => {

        try {

            setLoading(true);

            const data = await saleService.getSaleById(id);

            setSale(data);

        } catch (error) {

            console.error("Error al cargar la factura:", error);

            await Alert.error({
                title: "Error",
                text: "No fue posible cargar la factura."
            });

            navigate("/ventas");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadSale();
    }, [id]);

    const formatCurrency = (value) => {

        return Number(value || 0).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        });

    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString("es-CO", {
            dateStyle: "long",
            timeStyle: "short"
        });

    };

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

    const getStatusClass = (status) => {

        switch (status) {

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";

        }
    };

    if (loading) {

        return (
            <div className="p-10 text-center text-gray-500">
                Cargando factura...
            </div>
        );

    }

    if (!sale) {
        return null;
    }

    return (

        <div className="p-6">

            {/* ENCABEZADO */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Factura #{String(sale.id).padStart(6, "0")}
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Detalle de la venta
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/ventas")}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                    ← Volver
                </button>

            </div>

            {/* FACTURA */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">

                {/* CABECERA */}
                <div className="p-8 border-b border-gray-200">

                    <div className="flex flex-col md:flex-row md:justify-between gap-6">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                🔨 EL CLAVO AZUL
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Ferretería
                            </p>

                        </div>

                        <div className="md:text-right">

                            <p className="text-sm text-gray-500">
                                FACTURA
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                #{String(sale.id).padStart(6, "0")}
                            </p>

                        </div>

                    </div>

                </div>

                {/* INFORMACIÓN DE LA VENTA */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200">

                    <div>

                        <p className="text-sm text-gray-500">
                            Fecha
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {formatDate(sale.createdAt)}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Método de pago
                        </p>

                        <p className="font-semibold text-gray-800 mt-1">
                            {getPaymentMethod(sale.paymentMethod)}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Estado
                        </p>

                        <span
                            className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                sale.status
                            )}`}
                        >
                            {getStatus(sale.status)}
                        </span>

                    </div>

                </div>

                {/* CLIENTE */}
                <div className="p-8 border-b border-gray-200">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Cliente
                    </h3>

                    {sale.customerId ? (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Nombre completo
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {sale.customerName}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Documento
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {sale.customerDocumentNumber}
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="font-semibold text-gray-800">
                                Consumidor final
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Esta venta no fue asociada a un cliente registrado.
                            </p>

                        </div>

                    )}

                </div>

                {/* PRODUCTOS */}
                <div className="p-8">

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Productos
                    </h3>

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="border-b border-gray-200">

                                <tr>

                                    <th className="text-left py-3 text-sm text-gray-500">
                                        Producto
                                    </th>

                                    <th className="text-center py-3 text-sm text-gray-500">
                                        Cantidad
                                    </th>

                                    <th className="text-right py-3 text-sm text-gray-500">
                                        Precio
                                    </th>

                                    <th className="text-right py-3 text-sm text-gray-500">
                                        Subtotal
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {sale.details?.map((detail, index) => (

                                    <tr
                                        key={`${detail.productId}-${index}`}
                                        className="border-b border-gray-100"
                                    >

                                        <td className="py-4">

                                            <p className="font-semibold text-gray-800">
                                                {detail.productName}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Código: {detail.productCode}
                                            </p>

                                        </td>

                                        <td className="text-center py-4 text-gray-700">
                                            {detail.quantity}
                                        </td>

                                        <td className="text-right py-4 text-gray-700">
                                            {formatCurrency(detail.unitPrice)}
                                        </td>

                                        <td className="text-right py-4 font-semibold text-gray-800">
                                            {formatCurrency(detail.subtotal)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* TOTAL */}
                <div className="px-8 pb-8">

                    <div className="flex justify-end">

                        <div className="w-full md:w-80 border-t border-gray-200 pt-5">

                            <div className="flex justify-between items-center">

                                <span className="text-lg font-semibold text-gray-700">
                                    TOTAL
                                </span>

                                <span className="text-2xl font-bold text-gray-800">
                                    {formatCurrency(sale.total)}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* BOTONES */}
                <div className="p-8 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/ventas")}
                        className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-white transition"
                    >
                        Volver
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        🖨️ Imprimir factura
                    </button>

                </div>

            </div>

        </div>
    );
};

export default SaleInvoicePage;
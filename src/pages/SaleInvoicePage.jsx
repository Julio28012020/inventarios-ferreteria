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

        return new Date(date).toLocaleString("es-CO");

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
                return method;

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

            {/* Encabezado */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Factura #{sale.id}
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Detalle de la venta
                    </p>

                </div>

                <button
                    onClick={() => navigate("/ventas")}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                    ← Volver
                </button>

            </div>

            {/* Factura */}

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">

                {/* Cabecera */}

                <div className="p-8 border-b border-gray-200">

                    <div className="flex justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                🔨 EL CLAVO AZUL
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Ferretería
                            </p>

                        </div>

                        <div className="text-right">

                            <p className="text-sm text-gray-500">
                                FACTURA
                            </p>

                            <p className="text-xl font-bold text-gray-800">
                                #{String(sale.id).padStart(6, "0")}
                            </p>

                        </div>

                    </div>

                </div>

                {/* Información */}

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200">

                    <div>

                        <p className="text-sm text-gray-500">
                            Fecha
                        </p>

                        <p className="font-semibold text-gray-800">
                            {formatDate(sale.registrationDate)}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Método de pago
                        </p>

                        <p className="font-semibold text-gray-800">
                            {getPaymentMethod(sale.paymentMethod)}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Estado
                        </p>

                        <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                            {sale.status === "COMPLETED"
                                ? "Completada"
                                : sale.status}
                        </span>

                    </div>

                </div>

                {/* Productos */}

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

                                {sale.details?.map((detail) => (

                                    <tr
                                        key={detail.productId}
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

                                        <td className="text-center py-4">
                                            {detail.quantity}
                                        </td>

                                        <td className="text-right py-4">
                                            {formatCurrency(detail.unitPrice)}
                                        </td>

                                        <td className="text-right py-4 font-semibold">
                                            {formatCurrency(detail.subtotal)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

                {/* Total */}

                <div className="p-8 border-t border-gray-200">

                    <div className="flex justify-end">

                        <div className="w-full md:w-80">

                            <div className="flex justify-between text-xl font-bold text-gray-800">

                                <span>
                                    TOTAL
                                </span>

                                <span>
                                    {formatCurrency(sale.total)}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Botones */}

                <div className="p-8 bg-gray-50 flex justify-end gap-3">

                    <button
                        onClick={() => navigate("/ventas")}
                        className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-white transition"
                    >
                        Volver
                    </button>

                    <button
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
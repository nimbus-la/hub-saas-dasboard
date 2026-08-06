"use client";

import GenericButton from "@/components/buttons/GenericButton";
import { CashierOrder } from "../../types/cashier";

interface PaymentSummaryProps {
    order: CashierOrder;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function PaymentSummary({
    order,
    onConfirm,
    onCancel,
}: PaymentSummaryProps) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-neutral-900">
                Resumen del pedido
            </h2>

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-neutral-500">
                        Orden
                    </span>

                    <span className="font-semibold">
                        #{order.orderNumber}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-500">
                        Mesa
                    </span>

                    <span className="font-semibold">
                        {order.table}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-500">
                        Mesero
                    </span>

                    <span className="font-semibold">
                        {order.waiter}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-500">
                        Productos
                    </span>

                    <span className="font-semibold">
                        {order.items}
                    </span>
                </div>

                <hr className="border-neutral-200" />

                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                        Total
                    </span>

                    <span className="text-3xl font-bold text-primary">
                        $
                        {order.total.toLocaleString("es-CO")}
                    </span>
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <GenericButton
                    className="w-full"
                    label="Confirmar Pago"
                    onClick={onConfirm}
                />

                <GenericButton
                    className="w-full"
                    variant="secondary"
                    label="Cancelar"
                    onClick={onCancel}
                />
            </div>
        </div>
    );
}
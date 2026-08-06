"use client";

import { ArrowLeft } from "lucide-react";
import { CashierOrder } from "../../types/cashier";

interface PaymentHeaderProps {
    order: CashierOrder;
    onBack: () => void;
}

export default function PaymentHeader({
    order,
    onBack,
}: PaymentHeaderProps) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <button
                type="button"
                onClick={onBack}
                className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary"
            >
                <ArrowLeft size={18} />
                Volver
            </button>

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Pago Orden #{order.orderNumber}
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Mesa {order.table} • {order.waiter}
                    </p>
                </div>

                <div className="rounded-2xl bg-primary/5 px-6 py-4 text-right">
                    <p className="text-sm text-neutral-500">
                        Total a pagar
                    </p>

                    <h2 className="mt-1 text-4xl font-bold text-primary">
                        $
                        {order.total.toLocaleString("es-CO")}
                    </h2>
                </div>
            </div>
        </div>
    );
}
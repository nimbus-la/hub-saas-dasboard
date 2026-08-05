"use client";

import GenericButton from "@/components/buttons/GenericButton";
import { Receipt, User } from "lucide-react";

interface OrderCardProps {
    orderNumber: string;
    table: string;
    waiter: string;
    total: number;
    items: number;
    status: "pending" | "paid";
    onPay: () => void;
}

export default function OrderCard({
    orderNumber,
    table,
    waiter,
    total,
    items,
    status,
    onPay,
}: OrderCardProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">

            {/* Header */}
            <div className="border-b border-neutral-200 p-5">

                <div className="mb-4 flex items-center justify-between">

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "pending"
                                ? "bg-warning-lighter text-warning-main"
                                : "bg-success-lighter text-success-main"
                            }`}
                    >
                        {status === "pending"
                            ? "Pendiente"
                            : "Pagada"}
                    </span>

                    <Receipt
                        size={18}
                        className="text-neutral-500"
                    />

                </div>

                <h3 className="text-xl font-semibold text-neutral-900">
                    Mesa {table}
                </h3>

                <p className="mt-1 text-sm text-neutral-500">
                    Orden #{orderNumber}
                </p>

            </div>

            {/* Body */}
            <div className="space-y-4 p-5">

                <div className="flex items-center gap-2 text-sm text-neutral-600">

                    <User size={16} />

                    <span>{waiter}</span>

                </div>

                <div className="flex items-center justify-between">

                    <span className="text-sm text-neutral-500">
                        Productos
                    </span>

                    <span className="font-medium">
                        {items}
                    </span>

                </div>

                <div className="border-t border-neutral-200 pt-4">

                    <div className="flex items-center justify-between">

                        <span className="font-medium">
                            Total
                        </span>

                        <span className="text-xl font-bold text-primary">
                            $
                            {total.toLocaleString("es-CO")}
                        </span>

                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 p-5">

                <GenericButton
                    className="w-full"
                    label={
                        status === "paid"
                            ? "Pagada"
                            : "Cobrar"
                    }
                    disabled={status === "paid"}
                    onClick={onPay}
                />

            </div>

        </div>
    );
}
"use client";

import OrderCard from "./OrderCard";
import type { CashierOrder } from "../pages/CashierPage";

interface OrderGridProps {
    orders: CashierOrder[];
    onPay: (orderId: string) => void;
}

export default function OrderGrid({
    orders,
    onPay,
}: OrderGridProps) {
    if (orders.length === 0) {
        return (
            <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white">
                <p className="text-sm text-neutral-500">
                    No hay órdenes para mostrar.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    orderNumber={order.orderNumber}
                    table={order.table}
                    waiter={order.waiter}
                    total={order.total}
                    items={order.items}
                    status={order.status}
                    onPay={() => onPay(order.id)}
                />
            ))}
        </div>
    );
}
"use client";

import { CashierOrder } from "../../types/cashier";
import OrderCard from "../layout/OrderCard";

interface OrderGridProps {
    orders: CashierOrder[];
    onOpenPayment: (orderId: string) => void;
}

export default function OrderGrid({
    orders,
    onOpenPayment,
}: OrderGridProps) {
    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-neutral-500">
                No hay órdenes para mostrar.
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
                    onOpenPayment={() => onOpenPayment(order.id)}
                />
            ))}
        </div>
    );
}
"use client";

import { useMemo, useState } from "react";

import { INITIAL_ORDERS } from "../data/cashierOrders";
import type { CashierOrder } from "../types/cashier";
import type { OrderTab } from "../components/orders/OrderTabs";

export default function useOrders(
    search: string,
    tab: OrderTab,
) {
    const [orders, setOrders] =
        useState(INITIAL_ORDERS);

    const [selectedOrder, setSelectedOrder] =
        useState<CashierOrder | null>(null);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const searchMatch =
                order.orderNumber.includes(search) ||
                order.table.includes(search) ||
                order.waiter
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const tabMatch =
                tab === "all"
                    ? true
                    : order.status === tab;

            return searchMatch && tabMatch;
        });
    }, [orders, search, tab]);

    const handlePay = (id: string) => {
        setOrders((previous) =>
            previous.map((order) =>
                order.id === id
                    ? {
                          ...order,
                          status: "paid",
                      }
                    : order,
            ),
        );

        setSelectedOrder(null);
    };

    const handleOpenPayment = (
        id: string,
    ) => {
        const order = orders.find(
            (order) => order.id === id,
        );

        if (!order) return;

        setSelectedOrder(order);
    };

    const handleBackPayment = () => {
        setSelectedOrder(null);
    };

    return {
        orders,
        filteredOrders,
        selectedOrder,
        handlePay,
        handleOpenPayment,
        handleBackPayment,
    };
}
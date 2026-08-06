"use client";

import { useMemo } from "react";

import type { CashierOrder } from "../types/cashier";

export default function useCashSummary(
    orders: CashierOrder[],
) {
    const cashSales = useMemo(() => {
        return orders
            .filter(
                (order) =>
                    order.status === "paid" &&
                    order.paymentMethod === "cash",
            )
            .reduce(
                (total, order) => total + order.total,
                0,
            );
    }, [orders]);

    const totalSales = useMemo(() => {
        return orders.reduce(
            (total, order) => total + order.total,
            0,
        );
    }, [orders]);

    return {
        cashSales,
        totalSales,
    };
}
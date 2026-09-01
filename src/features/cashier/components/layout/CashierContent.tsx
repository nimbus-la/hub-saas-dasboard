"use client";

import CashOpenSummary from "../dashboard/CashOpenSummary";
import OrderGrid from "../orders/OrderGrid";
import OrderSearch from "../orders/OrderSearch";
import OrderTabs, { OrderTab } from "../orders/OrderTabs";

import type { CashierOrder } from "../../types/cashier";

interface CashierContentProps {
    initialAmount: number;
    cashSales: number;
    totalSales: number;
    totalOrders: number;

    search: string;
    onSearchChange: (value: string) => void;

    tab: OrderTab;
    onTabChange: (value: OrderTab) => void;

    orders: CashierOrder[];
    onOpenPayment: (orderId: string) => void;
}

export default function CashierContent({
    initialAmount,
    cashSales,
    totalSales,
    totalOrders,
    search,
    onSearchChange,
    tab,
    onTabChange,
    orders,
    onOpenPayment,
}: CashierContentProps) {
    return (
        <>
            <CashOpenSummary
                initialAmount={initialAmount}
                cashSales={cashSales}
                totalSales={totalSales}
                totalOrders={totalOrders}
            />

            <OrderSearch
                value={search}
                onChange={onSearchChange}
            />

            <OrderTabs
                value={tab}
                onValueChange={onTabChange}
            />

            <OrderGrid
                orders={orders}
                onOpenPayment={onOpenPayment}
            />
        </>
    );
}
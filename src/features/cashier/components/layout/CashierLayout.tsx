"use client";

import CashClosedDashboard from "../dashboard/CashClosedDashboard";
import CashierContent from "./CashierContent";
import CashierHeader from "./CashierHeader";

import type { CashierOrder } from "../../types/cashier";
import type { OrderTab } from "../orders/OrderTabs";

interface CashierLayoutProps {
    isCashOpen: boolean;

    initialAmount: number;
    cashSales: number;
    totalSales: number;
    totalOrders: number;

    search: string;
    onSearchChange: (value: string) => void;

    tab: OrderTab;
    onTabChange: (value: OrderTab) => void;

    orders: CashierOrder[];

    onOpenCash: () => void;
    onCloseCash: () => void;

    onOpenPayment: (orderId: string) => void;
}

export default function CashierLayout({
    isCashOpen,
    initialAmount,
    cashSales,
    totalSales,
    totalOrders,
    search,
    onSearchChange,
    tab,
    onTabChange,
    orders,
    onOpenCash,
    onCloseCash,
    onOpenPayment,
}: CashierLayoutProps) {
    return (
        <div className="space-y-6">
            <CashierHeader
                isOpen={isCashOpen}
                onOpenCash={onOpenCash}
                onCloseCash={onCloseCash}
            />

            {!isCashOpen ? (
                <CashClosedDashboard
                    onOpenCash={onOpenCash}
                />
            ) : (
                <CashierContent
                    initialAmount={initialAmount}
                    cashSales={cashSales}
                    totalSales={totalSales}
                    totalOrders={totalOrders}
                    search={search}
                    onSearchChange={onSearchChange}
                    tab={tab}
                    onTabChange={onTabChange}
                    orders={orders}
                    onOpenPayment={onOpenPayment}
                />
            )}
        </div>
    );
}
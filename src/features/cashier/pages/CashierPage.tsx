"use client";

import { useState } from "react";
import { OrderTab } from "../components/orders/OrderTabs";
import PaymentPage from "./PaymentPage";
import useOrders from "../hooks/useOrders";
import useCashRegister from "../hooks/useCashRegister";
import useCashSummary from "../hooks/useCashSummary";
import CashierDialogs from "../components/dialogs/CashierDialogs";
import CashierLayout from "../components/layout/CashierLayout";

export default function CashierPage() {

    const [search, setSearch] = useState("");

    const [tab, setTab] = useState<OrderTab>("pending");


    const {
        orders,
        filteredOrders,
        selectedOrder,
        handlePay,
        handleOpenPayment,
        handleBackPayment,
    } = useOrders(search, tab);

    const {
        isCashOpen,
        initialAmount,
        showOpenDialog,
        showCloseDialog,
        handleOpenCash,
        handleConfirmOpenCash,
        handleCloseDialog,
        handleCloseCash,
        handleConfirmCloseCash,
        handleCloseCashDialog,
    } = useCashRegister();

    const {
        cashSales,
        totalSales,
    } = useCashSummary(orders);
    if (selectedOrder) {
        return (
            <PaymentPage
                order={selectedOrder}
                onBack={handleBackPayment}
                onConfirm={() => handlePay(selectedOrder.id)}
            />
        );
    }
    return (
        <>
            <CashierLayout
                isCashOpen={isCashOpen}
                initialAmount={initialAmount}
                cashSales={cashSales}
                totalSales={totalSales}
                totalOrders={orders.length}
                search={search}
                onSearchChange={setSearch}
                tab={tab}
                onTabChange={setTab}
                orders={filteredOrders}
                onOpenCash={handleOpenCash}
                onCloseCash={handleCloseCash}
                onOpenPayment={handleOpenPayment}
            />

            <CashierDialogs
                showOpenDialog={showOpenDialog}
                showCloseDialog={showCloseDialog}
                initialAmount={initialAmount}
                cashSales={cashSales}
                onCloseOpenDialog={handleCloseDialog}
                onConfirmOpenDialog={handleConfirmOpenCash}
                onCloseCloseDialog={handleCloseCashDialog}
                onConfirmCloseDialog={handleConfirmCloseCash}
            />
        </>
    );
}
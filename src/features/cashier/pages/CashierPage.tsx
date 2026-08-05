"use client";

import { useMemo, useState } from "react";

import CashierHeader from "../components/CashierHeader";
import CashClosedDashboard from "../components/CashClosedDashboard";
import OrderGrid from "../components/OrderGrid";
import OrderSearch from "../components/OrderSearch";
import OrderTabs, { OrderTab } from "../components/OrderTabs";
import OpenCashDialog from "../components/OpenCashDialog";
import CashOpenSummary from "../components/CashOpenSummary";
import CloseCashDialog from "../components/CloseCashDialog";

export interface CashierOrder {
    id: string;
    orderNumber: string;
    table: string;
    waiter: string;
    total: number;
    items: number;
    status: "pending" | "paid";
    paymentMethod?: "cash" | "card" | "nequi" | "daviplata";
}

const INITIAL_ORDERS: CashierOrder[] = [
    {
        id: "1",
        orderNumber: "105",
        table: "5",
        waiter: "Juan Pérez",
        total: 86500,
        items: 5,
        status: "pending",
        paymentMethod: "cash",
    },
    {
        id: "2",
        orderNumber: "106",
        table: "8",
        waiter: "María López",
        total: 42000,
        items: 3,
        status: "pending",
        paymentMethod: "card",
    },
    {
        id: "3",
        orderNumber: "107",
        table: "3",
        waiter: "Carlos Ruiz",
        total: 51000,
        items: 4,
        status: "paid",
        paymentMethod: "cash",
    },
];

export default function CashierPage() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    const [search, setSearch] = useState("");

    const [tab, setTab] = useState<OrderTab>("pending");

    const [isCashOpen, setIsCashOpen] = useState(false);

    const [initialAmount, setInitialAmount] = useState(0);

    const [showOpenDialog, setShowOpenDialog] = useState(false);

    const [showCloseDialog, setShowCloseDialog] = useState(false);

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
    };

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

    const handleOpenCash = () => {
        setShowOpenDialog(true);
    };

    const handleConfirmOpenCash = (amount: number) => {
        setInitialAmount(amount);
        setIsCashOpen(true);
        setShowOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setShowOpenDialog(false);
    };

    const handleCloseCash = () => {
        setShowCloseDialog(true);
    };
    const handleConfirmCloseCash = () => {
        setShowCloseDialog(false);

        setIsCashOpen(false);

        setInitialAmount(0);
    };

    const handleCloseCashDialog = () => {
        setShowCloseDialog(false);
    };
    return (
        <>
            <div className="space-y-6">

                <CashierHeader
                    isOpen={isCashOpen}
                    onOpenCash={handleOpenCash}
                    onCloseCash={handleCloseCash}
                />

                {!isCashOpen ? (
                    <CashClosedDashboard
                        onOpenCash={handleOpenCash}
                    />
                ) : (

                    <>
                        <CashOpenSummary
                            initialAmount={initialAmount}
                            cashSales={cashSales}
                            totalSales={totalSales}
                            totalOrders={orders.length}
                        />
                        <OrderSearch
                            value={search}
                            onChange={setSearch}
                        />

                        <OrderTabs
                            value={tab}
                            onValueChange={(value) =>
                                setTab(value as OrderTab)
                            }
                        />

                        <OrderGrid
                            orders={filteredOrders}
                            onPay={handlePay}
                        />
                    </>
                )}

            </div>

            <OpenCashDialog
                isOpen={showOpenDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmOpenCash}
            />
            <CloseCashDialog
                isOpen={showCloseDialog}
                initialAmount={initialAmount}
                cashSales={cashSales}
                onClose={handleCloseCashDialog}
                onConfirm={handleConfirmCloseCash}
            />
        </>
    );
}
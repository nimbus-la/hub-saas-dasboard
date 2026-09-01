import type { CashierOrder } from "../types/cashier";

export const INITIAL_ORDERS: CashierOrder[] = [
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
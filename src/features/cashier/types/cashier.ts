export type OrderStatus =
    | "pending"
    | "paid";

export type PaymentMethod =
    | "cash"
    | "card"
    | "nequi"
    | "daviplata";

export interface CashierOrder {
    id: string;
    orderNumber: string;
    table: string;
    waiter: string;
    total: number;
    items: number;
    status: OrderStatus;
    paymentMethod?: PaymentMethod;
}
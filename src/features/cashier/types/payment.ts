export type PaymentMethod =
    | "cash"
    | "card"
    | "nequi"
    | "bank";

export interface PaymentMethodItem {
    id: PaymentMethod;
    title: string;
    description: string;
}
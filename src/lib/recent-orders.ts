// ── Datos: órdenes recientes ────────────────────────────────────────────────
// Módulo de datos desacoplado del componente. Reemplaza `getRecentOrders` por tu
// servicio cuando esté listo (puede volverse async y devolver el mismo shape).

export type OrderStatus = "completado" | "pendiente" | "cancelado";

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    amount: number;      // Monto total de la orden (COP, pesos enteros)
    status: OrderStatus;
    placedAt: string;    // Fecha ISO 8601 (YYYY-MM-DD) — se formatea en la vista
}

/** Etiqueta visible de cada estado; el color lo resuelve la capa de UI. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    completado: "Completado",
    pendiente: "Pendiente",
    cancelado: "Cancelado",
};

export function getRecentOrders(): Order[] {
    return [
        { id: "o1", orderNumber: "2323", customerName: "Devon Lane", customerEmail: "devon.lane@example.com", amount: 78_400, status: "completado", placedAt: "2026-07-28" },
        { id: "o2", orderNumber: "2458", customerName: "Darrell Steward", customerEmail: "darrell.steward@example.com", amount: 42_900, status: "completado", placedAt: "2026-07-26" },
        { id: "o3", orderNumber: "6289", customerName: "Darlene Robertson", customerEmail: "darlene.robertson@example.com", amount: 128_300, status: "cancelado", placedAt: "2026-07-23" },
        { id: "o4", orderNumber: "3869", customerName: "Courtney Henry", customerEmail: "courtney.henry@example.com", amount: 35_500, status: "pendiente", placedAt: "2026-07-21" },
        { id: "o5", orderNumber: "1247", customerName: "Eleanor Pena", customerEmail: "eleanor.pena@example.com", amount: 96_700, status: "completado", placedAt: "2026-07-18" },
    ];
}

// ── Datos: productos más vendidos (nivel global) ────────────────────────────
// Módulo de datos desacoplado del componente. Reemplaza `getTopProducts` por tu
// servicio cuando esté listo (puede volverse async y devolver el mismo shape).

export type ProductAccent = "success" | "warning" | "info" | "secondary" | "error";

export interface TopProduct {
    id: string;
    name: string;
    category: string;
    emoji: string;          // placeholder de miniatura (luego: URL de foto real)
    accent: ProductAccent;  // color del fondo del avatar (token del design system)
    units: number;          // unidades vendidas
    price: number;          // precio unitario (MXN)
    revenue: number;        // ventas totales (MXN)
}

export function getTopProducts(): TopProduct[] {
    return [
        { id: "p1", name: "Hamburguesa Clásica", category: "Platos fuertes", emoji: "🍔", accent: "warning", units: 3184, price: 130.30, revenue: 414920 },
        { id: "p2", name: "Tacos al Pastor", category: "Antojitos", emoji: "🌮", accent: "error", units: 2971, price: 120.00, revenue: 356520 },
        { id: "p3", name: "Pizza Margherita", category: "Platos fuertes", emoji: "🍕", accent: "success", units: 2043, price: 189.50, revenue: 387170 },
        { id: "p4", name: "Limonada Natural", category: "Bebidas", emoji: "🥤", accent: "info", units: 1888, price: 50.00, revenue: 94400 },
        { id: "p5", name: "Alitas BBQ", category: "Entradas", emoji: "🍗", accent: "secondary", units: 1562, price: 140.00, revenue: 218680 },
    ];
}
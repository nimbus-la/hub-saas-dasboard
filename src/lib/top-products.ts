// ── Datos: productos más vendidos (nivel global) ────────────────────────────
// Módulo de datos desacoplado del componente. Reemplaza `getTopProducts` por tu
// servicio cuando esté listo (puede volverse async y devolver el mismo shape).

export interface TopProduct {
    id: string;
    name: string;
    category: string;
    units: number;   // unidades vendidas
    revenue: number; // ingresos generados (MXN)
}

export function getTopProducts(): TopProduct[] {
    return [
        { id: "p1", name: "Hamburguesa Clásica", category: "Platos fuertes", units: 3184, revenue: 414920 },
        { id: "p2", name: "Tacos al Pastor", category: "Antojitos", units: 2971, revenue: 356520 },
        { id: "p3", name: "Pizza Margherita", category: "Platos fuertes", units: 2043, revenue: 387170 },
        { id: "p4", name: "Limonada Natural", category: "Bebidas", units: 1888, revenue: 94400 },
        { id: "p5", name: "Alitas BBQ", category: "Entradas", units: 1562, revenue: 218680 },
    ];
}
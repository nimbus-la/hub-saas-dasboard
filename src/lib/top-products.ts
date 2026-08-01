// ── Datos: productos más vendidos (nivel global) ────────────────────────────
// Módulo de datos desacoplado del componente. Reemplaza `getTopProducts` por tu
// servicio cuando esté listo (puede volverse async y devolver el mismo shape).
//
// `image` apunta hoy a un SVG local en /public/products. Cuando lleguen las
// fotos reales basta con cambiar la ruta; si el origen es remoto, recuerda
// declarar el dominio en `images.remotePatterns` de next.config.ts.

export type ProductAccent = "warning" | "error" | "success" | "info" | "secondary";

export interface TopProduct {
    id: string;
    name: string;
    category: string;
    image: string;          // miniatura (ruta pública o URL)
    accent: ProductAccent;  // color de la porción y del marco (token del design system)
    units: number;          // unidades vendidas
    price: number;          // precio unitario (MXN)
    revenue: number;        // ventas totales (MXN)
}

/** Producto ya posicionado dentro del top, con su peso sobre el total. */
export interface RankedProduct extends TopProduct {
    rank: number;   // 1 = más vendido
    share: number;  // % de unidades sobre el total del top
}

export interface TopProductsData {
    products: RankedProduct[];
    /** Unidades sumadas del top (denominador de `share`). */
    totalUnits: number;
}

/** El dona deja de ser legible con más de 5 porciones (ver charts.csv). */
export const TOP_PRODUCTS_LIMIT = 5;

// ── Color de cada porción (= token `*-main` de style.css) ───────────────────
// Fallback para el canvas cuando aún no se puede leer el CSS (ver theme.ts).
export const ACCENT_COLORS: Record<ProductAccent, string> = {
    warning: "#FFAB00",
    error: "#FF5630",
    success: "#22C55E",
    info: "#00B8D9",
    secondary: "#8E33FF",
};

const PRODUCTS: TopProduct[] = [
    { id: "p1", name: "Hamburguesa Clásica", category: "Platos fuertes", image: "/products/hamburguesa.svg", accent: "warning", units: 3184, price: 130.30, revenue: 414_920 },
    { id: "p2", name: "Tacos al Pastor", category: "Antojitos", image: "/products/tacos.svg", accent: "error", units: 2971, price: 120.00, revenue: 356_520 },
    { id: "p3", name: "Pizza Margherita", category: "Platos fuertes", image: "/products/pizza.svg", accent: "success", units: 2043, price: 189.50, revenue: 387_170 },
    { id: "p4", name: "Limonada Natural", category: "Bebidas", image: "/products/limonada.svg", accent: "info", units: 1888, price: 50.00, revenue: 94_400 },
    { id: "p5", name: "Alitas BBQ", category: "Entradas", image: "/products/alitas.svg", accent: "secondary", units: 1562, price: 140.00, revenue: 218_680 },
];

/**
 * Top de productos ordenado por unidades vendidas (descendente), con el
 * ranking y el porcentaje ya calculados para no repetir la cuenta en la vista.
 */
export function getTopProducts(limit: number = TOP_PRODUCTS_LIMIT): TopProductsData {
    const ranked = [...PRODUCTS]
        .sort((a, b) => b.units - a.units)
        .slice(0, limit);

    const totalUnits = ranked.reduce((sum, product) => sum + product.units, 0);

    return {
        totalUnits,
        products: ranked.map((product, index) => ({
            ...product,
            rank: index + 1,
            share: totalUnits === 0 ? 0 : (product.units / totalUnits) * 100,
        })),
    };
}

// ── Formatos (es-MX) ────────────────────────────────────────────────────────
const shareFormatter = new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const priceFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
});

/** `3.184` */
export const formatUnits = (units: number): string => units.toLocaleString("es-MX");

/** `$130.30` */
export const formatUnitPrice = (price: number): string => priceFormatter.format(price);

/** `27,3%` */
export const formatShare = (share: number): string => `${shareFormatter.format(share)}%`;

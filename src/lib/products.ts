// ── Datos: catálogo de productos ────────────────────────────────────────────
// Módulo de datos desacoplado de la vista. Reemplaza `getProducts` por tu
// servicio cuando esté listo (puede volverse async y devolver el mismo shape).
//
// `image` apunta hoy a un SVG local en /public/products. Cuando lleguen las
// fotos reales basta con cambiar la ruta; si el origen es remoto, recuerda
// declarar el dominio en `images.remotePatterns` de next.config.ts.

import { formatNumber } from "@/lib/format";
import type { BadgeTone } from "@/interfaces";

/**
 * Estado operativo del producto.
 *
 *   · disponible    — se puede vender sin restricciones
 *   · stock-bajo    — vendible, pero algún insumo está por agotarse
 *   · no-disponible — publicado pero sin insumos para prepararlo
 *   · inactivo      — retirado de la carta por decisión del equipo
 */
export type ProductStatus =
    | "disponible"
    | "stock-bajo"
    | "no-disponible"
    | "inactivo";

export interface Product {
    id: string;
    name: string;
    category: string;
    image: string;              // miniatura (ruta pública o URL)
    price: number;              // precio de venta en COP (pesos enteros)
    status: ProductStatus;
    ingredientsCount: number;   // insumos que componen la receta
    /**
     * Aviso operativo que emite el servicio (ej. "Sin carne de res molida").
     *
     * Es de solo lectura para la interfaz: se muestra cuando viene y desaparece
     * cuando el servicio deja de mandarlo. Nadie la edita desde la tarjeta.
     */
    alert?: string;
}

// ── Presentación de los estados ─────────────────────────────────────────────
// El tono se resuelve aquí (no en la tarjeta) para que cualquier vista que
// muestre un producto — tarjeta, tabla o detalle — pinte el mismo color.

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
    disponible: "Disponible",
    "stock-bajo": "Stock bajo",
    "no-disponible": "No disponible",
    inactivo: "Inactivo",
};

export const PRODUCT_STATUS_TONES: Record<ProductStatus, BadgeTone> = {
    disponible: "success",
    "stock-bajo": "warning",
    "no-disponible": "error",
    inactivo: "neutral",
};

/**
 * ¿El producto no se puede vender ahora mismo?
 *
 * Vive aquí y no en la tarjeta porque es una regla de negocio: cualquier vista
 * que quiera apagar un producto —tarjeta, tabla o detalle— debe apagar los
 * mismos. `stock-bajo` no entra: todavía se vende.
 */
export const isProductUnavailable = (status: ProductStatus): boolean =>
    status === "no-disponible" || status === "inactivo";

/** Orden de las pestañas: el estado nunca las reordena, la categoría sí. */
export const PRODUCT_CATEGORIES = [
    "Platos fuertes",
    "Antojitos",
    "Entradas",
    "Ensaladas",
    "Bebidas",
    "Postres",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/** Valor de la pestaña que no filtra por categoría. */
export const ALL_CATEGORIES = "todas";

/** Opciones del selector de tamaño de página. */
export const PRODUCT_PAGE_SIZES = [8, 12, 24] as const;

export const DEFAULT_PRODUCT_PAGE_SIZE = 12;

const PRODUCTS: Product[] = [
    // ── Platos fuertes ──────────────────────────────────────────────────────
    { id: "p01", name: "Hamburguesa Clásica", category: "Platos fuertes", image: "/products/hamburguesa.svg", price: 28000, status: "disponible", ingredientsCount: 9 },
    { id: "p02", name: "Hamburguesa Doble BBQ", category: "Platos fuertes", image: "/products/hamburguesa.svg", price: 38000, status: "no-disponible", ingredientsCount: 11, alert: "Sin carne de res molida" },
    { id: "p03", name: "Hamburguesa de Pollo Crispy", category: "Platos fuertes", image: "/products/hamburguesa.svg", price: 32000, status: "disponible", ingredientsCount: 10 },
    { id: "p04", name: "Pizza Margherita", category: "Platos fuertes", image: "/products/pizza.svg", price: 42000, status: "disponible", ingredientsCount: 6 },
    { id: "p05", name: "Pizza Pepperoni", category: "Platos fuertes", image: "/products/pizza.svg", price: 46000, status: "stock-bajo", ingredientsCount: 7, alert: "Quedan 2 paquetes de pepperoni" },
    { id: "p06", name: "Pizza Cuatro Quesos", category: "Platos fuertes", image: "/products/pizza.svg", price: 48000, status: "inactivo", ingredientsCount: 8 },

    // ── Antojitos ───────────────────────────────────────────────────────────
    { id: "p07", name: "Tacos al Pastor", category: "Antojitos", image: "/products/tacos.svg", price: 22000, status: "disponible", ingredientsCount: 8 },
    { id: "p08", name: "Tacos de Bistec", category: "Antojitos", image: "/products/tacos.svg", price: 24000, status: "stock-bajo", ingredientsCount: 7, alert: "Quedan 3 kg de bistec" },
    { id: "p09", name: "Quesadillas de Chorizo", category: "Antojitos", image: "/products/tacos.svg", price: 19000, status: "disponible", ingredientsCount: 5 },
    { id: "p10", name: "Gringas de Pastor", category: "Antojitos", image: "/products/tacos.svg", price: 23000, status: "disponible", ingredientsCount: 6 },

    // ── Entradas ────────────────────────────────────────────────────────────
    { id: "p11", name: "Alitas BBQ", category: "Entradas", image: "/products/alitas.svg", price: 30000, status: "disponible", ingredientsCount: 5 },
    { id: "p12", name: "Alitas Búfalo", category: "Entradas", image: "/products/alitas.svg", price: 30000, status: "disponible", ingredientsCount: 6 },
    { id: "p13", name: "Dedos de Queso", category: "Entradas", image: "/products/alitas.svg", price: 24000, status: "no-disponible", ingredientsCount: 4, alert: "Sin queso mozzarella en barra" },

    // ── Ensaladas ───────────────────────────────────────────────────────────
    { id: "p14", name: "Ensalada César", category: "Ensaladas", image: "/products/ensalada.svg", price: 26000, status: "disponible", ingredientsCount: 7 },
    { id: "p15", name: "Ensalada Griega", category: "Ensaladas", image: "/products/ensalada.svg", price: 28000, status: "stock-bajo", ingredientsCount: 8, alert: "Queso feta para 2 días" },

    // ── Bebidas ─────────────────────────────────────────────────────────────
    { id: "p16", name: "Limonada Natural", category: "Bebidas", image: "/products/limonada.svg", price: 9000, status: "disponible", ingredientsCount: 3 },
    { id: "p17", name: "Agua de Horchata", category: "Bebidas", image: "/products/limonada.svg", price: 9000, status: "disponible", ingredientsCount: 5 },
    { id: "p18", name: "Café Americano", category: "Bebidas", image: "/products/cafe.svg", price: 6000, status: "disponible", ingredientsCount: 2 },
    { id: "p19", name: "Capuchino", category: "Bebidas", image: "/products/cafe.svg", price: 9500, status: "stock-bajo", ingredientsCount: 4, alert: "Leche deslactosada por agotarse" },

    // ── Postres ─────────────────────────────────────────────────────────────
    { id: "p20", name: "Helado Artesanal", category: "Postres", image: "/products/postre.svg", price: 12000, status: "disponible", ingredientsCount: 4 },
    { id: "p21", name: "Pay de Queso", category: "Postres", image: "/products/postre.svg", price: 14000, status: "inactivo", ingredientsCount: 9 },
    { id: "p22", name: "Brownie con Helado", category: "Postres", image: "/products/postre.svg", price: 18000, status: "disponible", ingredientsCount: 8 },
];

/** Catálogo completo, en el orden en que se muestra en la carta. */
export function getProducts(): Product[] {
    return PRODUCTS;
}

// ── Etiquetas del dominio ───────────────────────────────────────────────────
// Solo el texto que acompaña a la cifra: el formato del número lo pone
// `@/lib/format`, y los precios se pintan con `formatCurrency` directamente.

/** `1 producto` · `22 productos` */
export const formatProductCount = (count: number): string =>
    `${formatNumber(count)} ${count === 1 ? "producto" : "productos"}`;

/** `Sin ingredientes` · `1 ingrediente` · `9 ingredientes` */
export const formatIngredients = (count: number): string => {
    if (count === 0) return "Sin ingredientes";

    return `${formatNumber(count)} ${count === 1 ? "ingrediente" : "ingredientes"}`;
};

/**
 * Filtra por nombre y categoría.
 *
 * La búsqueda ignora acentos y mayúsculas: escribir "cafe" encuentra "Café
 * Americano", que es como la gente teclea de verdad. Se busca también en la
 * categoría para que "postre" traiga toda la sección.
 */
export function filterProducts(
    products: Product[],
    { query, category }: { query: string; category: string }
): Product[] {
    const term = normalizeText(query.trim());

    return products.filter((product) => {
        const matchesCategory =
            category === ALL_CATEGORIES || product.category === category;

        if (!matchesCategory) return false;
        if (!term) return true;

        return (
            normalizeText(product.name).includes(term) ||
            normalizeText(product.category).includes(term)
        );
    });
}

/** Minúsculas y sin diacríticos: "Café" → "cafe". */
function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

/** Cuántos productos hay por categoría dentro de una colección ya filtrada. */
export function countByCategory(products: Product[]): Record<string, number> {
    return products.reduce<Record<string, number>>((counts, product) => {
        counts[product.category] = (counts[product.category] ?? 0) + 1;

        return counts;
    }, {});
}

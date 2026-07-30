// ── Configuración del gráfico de dona (Chart.js) ────────────────────────────
// Mismo criterio que `sales-chart-config.ts`: aquí vive todo lo que no es React
// (tokens del tema, dataset y opciones) como funciones puras.

import type { ChartDataset, ChartOptions } from "chart.js";
import { readCssVariable } from "@/lib/theme";
import {
    ACCENT_COLORS,
    type ProductAccent,
    type RankedProduct,
} from "@/lib/top-products";

// ── Ajustes visuales ────────────────────────────────────────────────────────
const CUTOUT = "88%";               // anillo fino: el centro es para la métrica
// Mayor que el grosor del anillo: Chart.js lo recorta a la mitad del trazo, así
// que los extremos quedan siempre en cápsula sin depender del tamaño del canvas.
const SEGMENT_BORDER_RADIUS = 20;
const SEGMENT_SPACING = 7;          // aire uniforme entre porciones
const HOVER_OFFSET = 8;             // cuánto sale la porción activa
const CANVAS_PADDING = HOVER_OFFSET + 2; // evita que el desplazamiento se recorte
const ANIMATION_DURATION_MS = 700;

/**
 * Traduce el acento del producto al hex del token `*-main`.
 * SOLO en cliente: usa `getComputedStyle` (ver `readCssVariable`).
 */
export function resolveAccentColor(accent: ProductAccent): string {
    return readCssVariable(`--color-${accent}-main`, ACCENT_COLORS[accent]);
}

/**
 * Una porción por producto, en el mismo orden que `products`: la lista de abajo
 * y el índice activo se apoyan en ese orden.
 */
export function buildTopProductsDataset(
    products: RankedProduct[]
): ChartDataset<"doughnut", number[]> {
    const sliceColors = products.map((product) => resolveAccentColor(product.accent));

    return {
        label: "Unidades vendidas",
        data: products.map((product) => product.units),
        backgroundColor: sliceColors,
        // Chart.js oscurece la porción activa por defecto; con el mismo color el
        // punto de la lista y su porción siguen siendo el mismo token (el aviso
        // de "activa" ya lo da el desplazamiento).
        hoverBackgroundColor: sliceColors,
        borderWidth: 0,
        hoverBorderWidth: 0,
        borderRadius: SEGMENT_BORDER_RADIUS,
        spacing: SEGMENT_SPACING,
        hoverOffset: HOVER_OFFSET,
    };
}

interface TopProductsChartOptionsParams {
    /** Con `true` se desactiva la animación de entrada. */
    prefersReducedMotion: boolean;
    /** Sincroniza el hover del canvas con la lista (null = sin porción activa). */
    onActiveIndexChange: (index: number | null) => void;
}

export function buildTopProductsChartOptions({
    prefersReducedMotion,
    onActiveIndexChange,
}: TopProductsChartOptionsParams): ChartOptions<"doughnut"> {
    return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: CUTOUT,
        layout: { padding: CANVAS_PADDING },
        animation: prefersReducedMotion
            ? false
            : { duration: ANIMATION_DURATION_MS, easing: "easeOutQuart" },
        onHover: (_event, elements) => {
            onActiveIndexChange(elements[0]?.index ?? null);
        },
        plugins: {
            legend: { display: false }, // la lista de productos hace de leyenda
            // Sin tooltip: el centro de la dona ya muestra el dato exacto del
            // producto señalado, y un globo encima lo taparía duplicándolo.
            tooltip: { enabled: false },
        },
    };
}

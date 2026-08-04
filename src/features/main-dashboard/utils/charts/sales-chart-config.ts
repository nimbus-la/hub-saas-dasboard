// ── Configuración del gráfico de ventas (Chart.js) ──────────────────────────
// Todo lo que no es React vive aquí: lectura de tokens del tema, construcción
// de datasets y de opciones. Son funciones puras, así que se pueden ajustar
// (o testear) sin tocar el componente.

import type { ChartDataset, ChartOptions, ScriptableContext } from "chart.js";
import { hexToRgba, readCssVariable } from "@/lib/theme";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { type SalesSeries } from "@/lib/branch-sales";

// ── Ajustes visuales ────────────────────────────────────────────────────────
const GRID_LINE_OPACITY = 0.7;          // rejilla apenas perceptible
const AREA_GRADIENT_OPACITY = 0.16;     // degradado bajo la línea
const LINE_TENSION = 0.4;               // curva suave
const LINE_WIDTH = 2.5;
const POINT_HOVER_RADIUS = 5;
const POINT_HOVER_BORDER_WIDTH = 3;
const POINT_HIT_RADIUS = 24;            // área de toque cómoda en móvil
// Colchón entre el área de trazado y el borde del canvas. El punto en hover mide
// POINT_HOVER_RADIUS + borde/2 = 6.5px de radio y el primer/último dato caen justo
// sobre el borde (`offset: false`), así que sin este margen se dibujarían cortados.
// Lo compensa el `-mx-2` del contenedor: la línea sigue alineada con la tarjeta.
const EDGE_GUTTER = 8;

const ANIMATION_DURATION_MS = 700;
const Y_AXIS_HEADROOM = "6%";           // el pico nunca toca la última línea
// Tope, no objetivo: Chart.js elige el paso "redondo" que quepa por debajo.
// Con 7 sale $0→$5M de millón en millón en Meses y $0→$1.2M de 200K en 200K
// en Semanas, sin amontonar las líneas de la rejilla.
const Y_AXIS_MAX_TICKS = 7;
const X_AXIS_TICK_PADDING = 14;         // deja aire para el marcador del crosshair
const Y_AXIS_TICK_PADDING = 14;         // aire entre los importes y la rejilla
const AXIS_FONT_SIZE = 12;

export interface SalesChartTheme {
    fontFamily: string;
    axisLabelColor: string;
    gridLineColor: string;
    guideLineColor: string;
    markerColor: string;
    tooltipBackgroundColor: string;
    tooltipTitleColor: string;
}

/**
 * Traduce los tokens de `style.css` a valores que Chart.js pueda pintar sobre
 * el canvas. SOLO en cliente (ver `readCssVariable`).
 */
export function readSalesChartTheme(): SalesChartTheme {
    const neutral300 = readCssVariable("--color-neutral-300", "#DFE3E8");
    const neutral400 = readCssVariable("--color-neutral-400", "#C4CDD5");
    const neutral500 = readCssVariable("--color-neutral-500", "#919EAB");
    const neutral800 = readCssVariable("--color-neutral-800", "#1C252E");

    return {
        fontFamily: getComputedStyle(document.body).fontFamily,
        axisLabelColor: neutral500,
        gridLineColor: hexToRgba(neutral300, GRID_LINE_OPACITY),
        guideLineColor: neutral400,
        markerColor: neutral800,
        tooltipBackgroundColor: neutral800,
        tooltipTitleColor: neutral400,
    };
}

/**
 * Un dataset por sucursal, en el mismo orden que `series` (el componente se
 * apoya en ese orden para alternar la visibilidad desde la leyenda).
 */
export function buildSalesDatasets(
    series: SalesSeries[],
    hiddenSeriesIds: ReadonlySet<string>
): ChartDataset<"line", number[]>[] {
    return series.map((branchSeries) => ({
        label: branchSeries.name,
        data: branchSeries.data,
        borderColor: branchSeries.color,
        hidden: hiddenSeriesIds.has(branchSeries.id),
        backgroundColor: (context: ScriptableContext<"line">) =>
            buildAreaGradient(context, branchSeries.color),
        fill: true,
        // Chart.js recorta cada dataset contra el área de trazado y calcula el
        // margen con el radio en reposo (0), no con el de hover: los puntos de
        // los extremos salían partidos por la mitad. Con este margen caben enteros.
        clip: EDGE_GUTTER,
        tension: LINE_TENSION,
        borderWidth: LINE_WIDTH,
        borderCapStyle: "round",
        borderJoinStyle: "round",
        pointRadius: 0,                             // sin puntos visibles...
        pointHoverRadius: POINT_HOVER_RADIUS,       // ...salvo al hacer hover
        pointHitRadius: POINT_HIT_RADIUS,
        pointBackgroundColor: branchSeries.color,
        pointHoverBackgroundColor: branchSeries.color,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: POINT_HOVER_BORDER_WIDTH,
    }));
}

/**
 * Degradado que se desvanece hacia abajo. Solo se pinta cuando queda UNA
 * sucursal visible: con varias, las áreas se solapan y ensucian los datos.
 */
function buildAreaGradient(
    context: ScriptableContext<"line">,
    color: string
): CanvasGradient | string {
    const { chart } = context;
    const { chartArea, ctx: canvasContext } = chart;

    if (!chartArea) return "transparent"; // aún no hay área en el primer frame

    const visibleDatasetCount = chart.data.datasets.filter((_dataset, index) =>
        chart.isDatasetVisible(index)
    ).length;

    if (visibleDatasetCount > 1) return "transparent";

    const gradient = canvasContext.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
    );
    gradient.addColorStop(0, hexToRgba(color, AREA_GRADIENT_OPACITY));
    gradient.addColorStop(1, hexToRgba(color, 0));

    return gradient;
}

interface SalesChartOptionsParams {
    theme: SalesChartTheme;
    /** Con `true` se desactiva la animación de entrada. */
    prefersReducedMotion: boolean;
    /** Piso opcional del eje Y; sin él la escala se adapta a los datos. */
    suggestedYMax?: number | undefined;
}

export function buildSalesChartOptions({
    theme,
    prefersReducedMotion,
    suggestedYMax,
}: SalesChartOptionsParams): ChartOptions<"line"> {
    const axisFont = {
        family: theme.fontFamily,
        size: AXIS_FONT_SIZE,
        weight: 500 as const,
    };

    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: prefersReducedMotion
            ? false
            : { duration: ANIMATION_DURATION_MS, easing: "easeOutQuart" },
        // Un único hover por punto del eje X: muestra todas las sucursales a la vez.
        interaction: { mode: "index", intersect: false },
        layout: {
            padding: {
                top: EDGE_GUTTER,
                right: EDGE_GUTTER,
                bottom: 0,
                left: EDGE_GUTTER,
            },
        },
        plugins: {
            legend: { display: false }, // leyenda propia: interactiva y con totales
            tooltip: {
                backgroundColor: theme.tooltipBackgroundColor,
                padding: { x: 14, y: 12 },
                cornerRadius: 10,
                caretSize: 0,
                caretPadding: 14,
                titleColor: theme.tooltipTitleColor,
                titleFont: { family: theme.fontFamily, size: 12, weight: 500 },
                titleMarginBottom: 8,
                bodyColor: "#fff",
                bodyFont: { family: theme.fontFamily, size: 13, weight: 600 },
                bodySpacing: 6,
                usePointStyle: true, // punto redondo por serie, no cuadrado
                boxPadding: 6,
                callbacks: {
                    label: (tooltipItem) =>
                        ` ${tooltipItem.dataset.label}: ${formatCurrency(Number(tooltipItem.parsed.y))}`,
                    labelPointStyle: () => ({ pointStyle: "circle", rotation: 0 }),
                },
            },
        },
        scales: {
            x: {
                // Sin `offset`: el primer y el último punto caen sobre los bordes
                // y la línea ocupa todo el ancho del área de trazado.
                offset: false,
                // Chart.js aplica `ticks.padding` también en horizontal (ver
                // Scale#_calculatePadding), así que el aire pensado para separar
                // las etiquetas del eje metía además X_AXIS_TICK_PADDING px muertos
                // a cada lado y el trazado no llegaba al borde de la tarjeta. Lo
                // anulamos después del ajuste: el aire vertical se conserva.
                afterFit: (scale) => {
                    scale.paddingLeft = 0;
                    scale.paddingRight = 0;
                },
                border: { display: false },
                grid: { display: false },
                ticks: {
                    // `inner`: las etiquetas de los extremos se alinean hacia
                    // adentro (las del medio siguen centradas en su punto). Así
                    // "Ene" no invade la columna de importes ni "Dic" se sale por
                    // la derecha, y el gráfico deja de reservar ese hueco a los
                    // lados: aprovecha todo el ancho de la tarjeta.
                    align: "inner",
                    color: theme.axisLabelColor,
                    padding: X_AXIS_TICK_PADDING,
                    maxRotation: 0,
                    autoSkipPadding: 16,
                    font: axisFont,
                },
            },
            y: {
                beginAtZero: true,
                grace: Y_AXIS_HEADROOM,
                ...(suggestedYMax ? { suggestedMax: suggestedYMax } : {}),
                border: { display: false },
                grid: { color: theme.gridLineColor, drawTicks: false },
                ticks: {
                    color: theme.axisLabelColor,
                    padding: Y_AXIS_TICK_PADDING,
                    maxTicksLimit: Y_AXIS_MAX_TICKS,
                    font: axisFont,
                    callback: (value) => formatCurrencyCompact(Number(value)),
                },
            },
        },
    };
}

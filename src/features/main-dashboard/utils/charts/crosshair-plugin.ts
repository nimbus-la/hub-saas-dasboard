// ── Plugin de Chart.js: guía vertical del hover ─────────────────────────────
// Dibuja una línea punteada que cae desde el punto más alto del periodo activo
// hasta el eje X, rematada por un triángulo que ancla la posición en el tiempo.
//
// Se pinta en `afterDatasetsDraw` (no antes) para que el degradado del área no
// lo tape cuando queda una sola sucursal visible.

import type { Chart, Plugin } from "chart.js";

const GUIDE_DASH_PATTERN = [4, 4];
const GUIDE_LINE_WIDTH = 1;

const MARKER_HALF_WIDTH = 5;
const MARKER_HEIGHT = 7;
const MARKER_OFFSET_FROM_AXIS = 3;

interface CrosshairPluginOptions {
    /** Color de la línea punteada. */
    guideLineColor: string;
    /** Color del triángulo sobre el eje X. */
    markerColor: string;
}

export function createCrosshairPlugin({
    guideLineColor,
    markerColor,
}: CrosshairPluginOptions): Plugin<"line"> {
    return {
        id: "crosshair",

        afterDatasetsDraw(chart: Chart<"line">) {
            const activeElements = chart.tooltip?.getActiveElements() ?? [];
            const [firstActiveElement] = activeElements;
            if (!firstActiveElement) return;

            const { ctx: canvasContext, chartArea } = chart;
            const guideX = firstActiveElement.element.x;
            const highestPointY = Math.min(
                ...activeElements.map(({ element }) => element.y)
            );

            canvasContext.save();
            drawGuideLine(canvasContext, {
                x: guideX,
                fromY: highestPointY,
                toY: chartArea.bottom,
                color: guideLineColor,
            });
            drawAxisMarker(canvasContext, {
                x: guideX,
                axisY: chartArea.bottom,
                color: markerColor,
            });
            canvasContext.restore();
        },
    };
}

interface GuideLineParams {
    x: number;
    fromY: number;
    toY: number;
    color: string;
}

function drawGuideLine(
    canvasContext: CanvasRenderingContext2D,
    { x, fromY, toY, color }: GuideLineParams
): void {
    canvasContext.beginPath();
    canvasContext.setLineDash(GUIDE_DASH_PATTERN);
    canvasContext.lineWidth = GUIDE_LINE_WIDTH;
    canvasContext.strokeStyle = color;
    canvasContext.moveTo(x, fromY);
    canvasContext.lineTo(x, toY);
    canvasContext.stroke();
}

interface AxisMarkerParams {
    x: number;
    axisY: number;
    color: string;
}

function drawAxisMarker(
    canvasContext: CanvasRenderingContext2D,
    { x, axisY, color }: AxisMarkerParams
): void {
    const baseY = axisY + MARKER_OFFSET_FROM_AXIS;

    canvasContext.setLineDash([]); // el triángulo es sólido, no punteado
    canvasContext.beginPath();
    canvasContext.moveTo(x - MARKER_HALF_WIDTH, baseY);
    canvasContext.lineTo(x + MARKER_HALF_WIDTH, baseY);
    canvasContext.lineTo(x, baseY + MARKER_HEIGHT);
    canvasContext.closePath();
    canvasContext.fillStyle = color;
    canvasContext.fill();
}

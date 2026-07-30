"use client";

// ── Dona de participación por producto (Chart.js) ───────────────────────────
// Componente PRESENTACIONAL y CONTROLADO: recibe los productos y el índice
// activo por props; el hover del canvas se comunica hacia arriba para que la
// lista de abajo resalte el mismo producto (y al revés).
//
// La métrica del centro es HTML, no canvas: se mantiene nítida en cualquier
// densidad de pantalla y respeta el tamaño de texto del sistema.

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import { cn } from "@/lib/utils";
import { formatShare, formatUnits, type RankedProduct } from "@/lib/top-products";
import {
    buildTopProductsChartOptions,
    buildTopProductsDataset,
} from "../../../utils/charts/top-products-chart-config";

interface TopProductsDonutProps {
    products: RankedProduct[];
    /** Unidades sumadas del top: es la métrica en reposo del centro. */
    totalUnits: number;
    activeIndex: number | null;
    onActiveIndexChange: (index: number | null) => void;
    className?: string;
}

export default function TopProductsDonut({
    products,
    totalUnits,
    activeIndex,
    onActiveIndexChange,
    className,
}: TopProductsDonutProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<"doughnut"> | null>(null);

    // El gráfico se crea una vez por juego de datos: la referencia evita que el
    // callback quede congelado en ese render.
    const onActiveIndexChangeRef = useRef(onActiveIndexChange);
    useEffect(() => {
        onActiveIndexChangeRef.current = onActiveIndexChange;
    }, [onActiveIndexChange]);

    const activeProduct = activeIndex === null ? null : products[activeIndex] ?? null;

    // ── Crea / recrea el gráfico cuando cambian los datos ────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || products.length === 0) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const chart = new Chart(canvas, {
            type: "doughnut",
            data: {
                labels: products.map((product) => product.name),
                datasets: [buildTopProductsDataset(products)],
            },
            options: buildTopProductsChartOptions({
                prefersReducedMotion,
                onActiveIndexChange: (index) => onActiveIndexChangeRef.current(index),
            }),
        });

        chartInstanceRef.current = chart;

        return () => {
            chart.destroy();
            chartInstanceRef.current = null;
        };
    }, [products]);

    // ── Refleja en la dona el producto activo (venga del canvas o de la lista) ─
    useEffect(() => {
        const chart = chartInstanceRef.current;
        if (!chart) return;

        const currentActive = chart.getActiveElements();
        const isAlreadyActive =
            activeIndex === null
                ? currentActive.length === 0
                : currentActive[0]?.index === activeIndex;

        if (isAlreadyActive) return; // el hover del canvas ya lo aplicó

        chart.setActiveElements(
            activeIndex === null ? [] : [{ datasetIndex: 0, index: activeIndex }]
        );
        // `render` y no `update`: repinta con el estilo activo (la porción sale)
        // sin recalcular el dataset ni re-animar el barrido de entrada.
        chart.render();
    }, [activeIndex]);

    return (
        <div className={cn("relative h-52 w-full sm:h-56", className)}>
            <canvas
                ref={canvasRef}
                role="img"
                aria-label={`Dona de participación en unidades vendidas. ${products
                    .map((product) => `${product.name}, ${formatShare(product.share)}`)
                    .join("; ")}. El detalle está en la lista siguiente.`}
            />

            {/* ── Métrica del centro (sigue al producto señalado) ─────────── */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 px-14 text-center">
                <span className="w-full truncate text-xs font-medium text-neutral-500">
                    {activeProduct ? activeProduct.name : "Unidades vendidas"}
                </span>

                <span className="text-[26px] leading-none font-bold tracking-tight tabular-nums text-neutral-800">
                    {formatUnits(activeProduct ? activeProduct.units : totalUnits)}
                </span>

                <span className="w-full truncate text-xs text-neutral-500 tabular-nums">
                    {activeProduct
                        ? `${formatShare(activeProduct.share)} del total`
                        : `Top ${products.length} · Este mes`}
                </span>
            </div>
        </div>
    );
};

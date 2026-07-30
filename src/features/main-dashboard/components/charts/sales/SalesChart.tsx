"use client";

// ── Gráfico comparativo de ventas por sucursal (Chart.js) ───────────────────
// Componente PRESENTACIONAL y CONTROLADO: recibe los datos (labels/series) y el
// estado de los filtros por props. No genera datos ni lee el DOM en el render,
// así que es seguro para SSR/hydration.
//
// Aquí queda solo el ciclo de vida del gráfico y el maquetado. Lo demás vive en:
//   · sales-chart-config.ts → tema, datasets y opciones de Chart.js
//   · crosshair-plugin.ts   → guía vertical del hover
//   · use-hidden-series.ts  → estado de la leyenda
//
// Requiere: pnpm add chart.js

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    formatMoneyFull,
    type PeriodKey,
    type SalesSeries,
} from "@/lib/branch-sales";

import SalesChartDataTable from "./SalesChartDataTable";
import SalesChartLegend from "./SalesChartLegend";
import SalesChartPeriodFilter from "./SalesChartPeriodFilter";
import { createCrosshairPlugin } from "../../../utils/charts/crosshair-plugin";
import {
    buildSalesChartOptions,
    buildSalesDatasets,
    readSalesChartTheme,
} from "../../../utils/charts/sales-chart-config";
import { useHiddenSeries } from "../../../hooks/use-hidden-series";

const DEFAULT_DELTA_PERCENTAGE = 18;

interface SalesChartProps {
    labels: string[];
    series: SalesSeries[];
    period: PeriodKey;
    onPeriodChange: (period: PeriodKey) => void;
    /** Variación vs. el periodo anterior (ej. 18, -3.2). El signo define ▲/▼. */
    delta?: number;
    /**
     * Piso opcional del eje Y (crece si los datos lo superan). Sin valor, la
     * escala se ajusta al periodo: un piso fijo aplasta las series de "Días",
     * cuyos importes son un orden de magnitud menores que los de "Meses".
     */
    minYMax?: number;
    className?: string | undefined;
    // Reservados para cuando el selector de sucursal viva en el navbar.
    branch?: string;
    onBranchChange?: (branch: string) => void;
}

export default function SalesChart({
    labels,
    series,
    period,
    onPeriodChange,
    delta = DEFAULT_DELTA_PERCENTAGE,
    minYMax,
    className,
}: SalesChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    const { hiddenSeriesIds, latestHiddenSeriesIdsRef, toggleSeries } =
        useHiddenSeries(series.length);

    const hasData = labels.length > 0 && series.length > 0;
    const isPositiveDelta = delta >= 0;
    const TrendIcon = isPositiveDelta ? TrendingUp : TrendingDown;

    // La métrica de cabecera refleja lo que se está viendo, no el total absoluto.
    const visibleSalesTotal = series
        .filter((branchSeries) => !hiddenSeriesIds.has(branchSeries.id))
        .reduce((runningTotal, branchSeries) => runningTotal + branchSeries.total, 0);

    // ── Crea / recrea el gráfico cuando cambian los datos ────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !hasData) return;

        const theme = readSalesChartTheme();
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const chart = new Chart(canvas, {
            type: "line",
            data: {
                labels,
                datasets: buildSalesDatasets(series, latestHiddenSeriesIdsRef.current),
            },
            plugins: [
                createCrosshairPlugin({
                    guideLineColor: theme.guideLineColor,
                    markerColor: theme.markerColor,
                }),
            ],
            options: buildSalesChartOptions({
                theme,
                prefersReducedMotion,
                suggestedYMax: minYMax,
            }),
        });

        chartInstanceRef.current = chart;

        return () => {
            chart.destroy();
            chartInstanceRef.current = null;
        };
    }, [labels, series, minYMax, hasData, latestHiddenSeriesIdsRef]);

    // ── Sincroniza la leyenda con el gráfico (sin recrearlo) ─────────────────
    useEffect(() => {
        const chart = chartInstanceRef.current;
        if (!chart) return;

        series.forEach((branchSeries, datasetIndex) => {
            chart.setDatasetVisibility(
                datasetIndex,
                !hiddenSeriesIds.has(branchSeries.id)
            );
        });
        chart.update();
    }, [hiddenSeriesIds, series]);

    return (
        <section
            aria-labelledby="sales-chart-title"
            className={cn(
                "flex w-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-6",
                className
            )}
        >
            {/* ── Cabecera: métrica principal + periodo ───────────────────── */}
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                    <h3
                        id="sales-chart-title"
                        className="text-sm font-medium text-neutral-500"
                    >
                        Ventas por sucursal
                    </h3>

                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <p className="text-[28px] leading-none font-bold tracking-tight tabular-nums text-neutral-800">
                            {formatMoneyFull(visibleSalesTotal)}
                        </p>

                        <span
                            className={cn(
                                "flex items-center gap-1 text-sm font-semibold tabular-nums",
                                isPositiveDelta ? "text-success-main" : "text-error-main"
                            )}
                        >
                            <TrendIcon size={16} aria-hidden="true" />
                            {isPositiveDelta ? "+" : ""}
                            {delta}%
                            <span className="sr-only"> vs. el periodo anterior</span>
                        </span>
                    </div>
                </div>

                <SalesChartPeriodFilter
                    period={period}
                    onPeriodChange={onPeriodChange}
                />
            </div>

            {hasData && (
                <SalesChartLegend
                    series={series}
                    hiddenSeriesIds={hiddenSeriesIds}
                    onToggleSeries={toggleSeries}
                />
            )}

            {/* ── Lienzo del gráfico ─────────────────────────────────────── */}
            <div className="relative mt-4 h-76 w-full sm:h-84">
                {hasData ? (
                    <canvas
                        ref={canvasRef}
                        role="img"
                        aria-label={`Evolución de ventas por sucursal (${labels.at(0)} a ${labels.at(-1)}). Total del periodo: ${formatMoneyFull(visibleSalesTotal)}. Los valores exactos están en la tabla siguiente.`}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 rounded-xl bg-neutral-100/60">
                        <p className="text-sm font-semibold text-neutral-800">
                            Sin datos para este periodo
                        </p>
                        <p className="text-sm text-neutral-500">
                            Prueba con otro rango de fechas.
                        </p>
                    </div>
                )}
            </div>

            {hasData && <SalesChartDataTable labels={labels} series={series} />}
        </section>
    );
};

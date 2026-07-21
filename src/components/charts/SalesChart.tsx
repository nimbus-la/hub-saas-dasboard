"use client";

// ── Gráfico comparativo de ventas por sucursal (Chart.js) ───────────────────
// Componente PRESENTACIONAL y CONTROLADO: recibe los datos (labels/series) y el
// estado de los filtros por props. No genera datos ni lee el DOM en el render,
// así que es seguro para SSR/hydration.
//
// Requiere: pnpm add chart.js
// Ubicación sugerida: src/components/charts/BranchSalesChart.tsx

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { cn } from "@/lib/utils";
import {
    BRANCHES,
    PERIODS,
    fmtMoney,
    fmtMoneyFull,
    type PeriodKey,
    type SalesSeries,
} from "@/lib/branch-sales";


interface BranchSalesChartProps {
    labels: string[];
    series: SalesSeries[];
    period: PeriodKey;
    branch: string;
    onPeriodChange: (period: PeriodKey) => void;
    onBranchChange: (branch: string) => void;
    deltaText?: string;   // ej. "(+18%)"
    minYMax?: number;     // piso del eje Y (crece si los datos lo superan)
    className?: string | undefined;
}

// Lee una variable CSS del tema. SOLO se usa dentro de useEffect (cliente),
// por eso no rompe la hidratación. Con respaldo por si la var no existe.
function cssVar(name: string, fallback: string): string {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
}


export default function SalesChart({
    labels,
    series,
    period,
    branch,
    onPeriodChange,
    onBranchChange,
    deltaText = "(+18%)",
    minYMax = 800_000,
    className,
}: BranchSalesChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ── Crea / recrea el gráfico cuando cambian los datos ────────────────────
    useEffect(() => {
        if (!canvasRef.current) return;

        const datasets = series.map((s, i, arr) => {
            const r = 6;
            const isBottom = i === 0;
            const isTop = i === arr.length - 1;
            const borderRadius =
                arr.length === 1
                    ? r
                    : {
                        topLeft: isTop ? r : 0,
                        topRight: isTop ? r : 0,
                        bottomLeft: isBottom ? r : 0,
                        bottomRight: isBottom ? r : 0,
                    };

            return {
                label: s.name,
                data: s.data,
                backgroundColor: s.color,
                stack: "ventas",
                borderRadius,
                borderSkipped: false,
                categoryPercentage: 0.65,
                barPercentage: 0.85,
                maxBarThickness: 30,
            };
        });

        const neutral500 = cssVar("--color-neutral-500", "#919EAB");
        const neutral300 = cssVar("--color-neutral-300", "#DFE3E8");
        const neutral800 = cssVar("--color-neutral-800", "#1C252E");

        // ── Plugin: dibuja las líneas del grid PUNTEADAS ────────────────────
        // En Chart.js v4 `grid.borderDash` no puntea las líneas de forma fiable,
        // así que las pintamos con setLineDash para un resultado garantizado.
        const dashedGrid = {
            id: "dashedGrid",
            beforeDatasetsDraw(c: Chart) {
                const { ctx, chartArea, scales } = c;
                const y = scales['y'];
                if (!y) return;
                ctx.save();
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 1;
                ctx.strokeStyle = neutral300;
                y.ticks.forEach((_tick, i) => {
                    const yPix = y.getPixelForTick(i);
                    ctx.beginPath();
                    ctx.moveTo(chartArea.left, yPix);
                    ctx.lineTo(chartArea.right, yPix);
                    ctx.stroke();
                });
                ctx.restore();
            },
        };

        const chart = new Chart(canvasRef.current, {
            type: "bar",
            data: { labels, datasets },
            plugins: [dashedGrid],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { display: false }, // leyenda propia con totales
                    tooltip: {
                        backgroundColor: neutral800,
                        padding: 12,
                        cornerRadius: 8,
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        callbacks: {
                            label: (ctx) => `  ${ctx.dataset.label}: ${fmtMoneyFull(Number(ctx.parsed.y))}`,
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        border: { display: false },
                        grid: { display: false },
                        ticks: { color: neutral500, font: { size: 12 } },
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        suggestedMax: minYMax, // piso de 800k; crece si los datos lo superan
                        border: { display: false },
                        grid: { display: false }, // las líneas punteadas las dibuja el plugin
                        ticks: {
                            color: neutral500,
                            padding: 10,
                            maxTicksLimit: 5,
                            font: { size: 12 },
                            callback: (value) => fmtMoney(Number(value)),
                        },
                    },
                },
            },
        });

        return () => chart.destroy();
    }, [labels, series]);

    return (
        <div
            className={cn(
                "flex w-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-6",
                "shadow-[0_1px_2px_rgba(145,158,171,0.16)]",
                className
            )}
        >
            {/* ── Cabecera: título + controles ───────────────────────────── */}
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-neutral-800">Ventas por sucursal</h3>
                    <p className="text-sm text-neutral-500">
                        <span className="font-semibold text-success-main">{deltaText}</span> vs. el periodo anterior
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* ── Filtro de periodo ──────────────────────────────── */}
                    <div className="inline-flex rounded-lg border border-neutral-200 p-0.5">
                        {PERIODS.map((p) => (
                            <button
                                key={p.key}
                                type="button"
                                onClick={() => onPeriodChange(p.key)}
                                data-selected={period === p.key}
                                className={cn(
                                    "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                    "text-neutral-600 hover:bg-neutral-100",
                                    "data-[selected=true]:bg-primary-main/10 data-[selected=true]:text-primary-main",
                                    "data-[selected=true]:hover:bg-primary-main/20"
                                )}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Selector de sucursal (TEMPORAL, para pruebas) ──── */}
                    <select
                        value={branch}
                        onChange={(e) => onBranchChange(e.target.value)}
                        className={cn(
                            "h-9 cursor-pointer rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium",
                            "text-neutral-700 outline-none focus-visible:ring-3 focus-visible:ring-neutral-200"
                        )}
                    >
                        <option value="todas">Todas las sucursales</option>
                        {BRANCHES.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Leyenda con totales (color estático → sin hydration issues) ─ */}
            <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                {series.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-sm text-neutral-600">{s.name}</span>
                        <span className="text-base font-bold text-neutral-800">{fmtMoney(s.total)}</span>
                    </div>
                ))}
            </div>

            {/* ── Lienzo del gráfico ─────────────────────────────────────── */}
            <div className="relative h-[340px] w-full">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};
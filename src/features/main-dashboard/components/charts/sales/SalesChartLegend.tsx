"use client";

// ── Leyenda interactiva del gráfico de ventas ───────────────────────────────
// Cada sucursal es un botón que muestra su total y alterna su línea en el
// gráfico. El estado oculto se distingue por forma (punto hueco) además de por
// color, para no depender solo del color.

import { formatCurrencyCompact } from "@/lib/format";
import { type SalesSeries } from "@/lib/branch-sales";
import { cn } from "@/lib/utils";

interface SalesChartLegendProps {
    series: SalesSeries[];
    hiddenSeriesIds: ReadonlySet<string>;
    onToggleSeries: (seriesId: string) => void;
}

export default function SalesChartLegend({
    series,
    hiddenSeriesIds,
    onToggleSeries,
}: SalesChartLegendProps) {
    return (
        <div className="-mx-2 mt-5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
            {series.map((branchSeries) => {
                const isHidden = hiddenSeriesIds.has(branchSeries.id);

                return (
                    <button
                        key={branchSeries.id}
                        type="button"
                        onClick={() => onToggleSeries(branchSeries.id)}
                        aria-pressed={!isHidden}
                        data-hidden={isHidden}
                        className={cn(
                            "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2",
                            "transition-colors duration-150 ease-out motion-reduce:transition-none",
                            "hover:bg-neutral-100",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className="size-2.5 shrink-0 rounded-full border-2 transition-colors"
                            style={{
                                borderColor: isHidden
                                    ? "var(--color-neutral-400)"
                                    : branchSeries.color,
                                backgroundColor: isHidden ? "transparent" : branchSeries.color,
                            }}
                        />

                        <span
                            className={cn(
                                "text-sm whitespace-nowrap",
                                isHidden ? "text-neutral-400" : "text-neutral-600"
                            )}
                        >
                            {branchSeries.name}
                        </span>

                        <span
                            className={cn(
                                "text-sm font-bold tabular-nums whitespace-nowrap",
                                isHidden ? "text-neutral-400" : "text-neutral-800"
                            )}
                        >
                            {formatCurrencyCompact(branchSeries.total)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

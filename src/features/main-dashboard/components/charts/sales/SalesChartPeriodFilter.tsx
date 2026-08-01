"use client";

// ── Selector de periodo del gráfico de ventas ───────────────────────────────
// Segmented control controlado: recibe el periodo activo y notifica el cambio.

import { PERIODS, type PeriodKey } from "@/lib/branch-sales";
import { cn } from "@/lib/utils";

interface SalesChartPeriodFilterProps {
    period: PeriodKey;
    onPeriodChange: (period: PeriodKey) => void;
}

export default function SalesChartPeriodFilter({
    period,
    onPeriodChange,
}: SalesChartPeriodFilterProps) {
    return (
        <div
            role="group"
            aria-label="Periodo del gráfico"
            className="inline-flex shrink-0 rounded-xl bg-neutral-100 p-1"
        >
            {PERIODS.map((periodOption) => {
                const isSelected = periodOption.key === period;

                return (
                    <button
                        key={periodOption.key}
                        type="button"
                        onClick={() => onPeriodChange(periodOption.key)}
                        aria-pressed={isSelected}
                        data-selected={isSelected}
                        className={cn(
                            "cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-medium",
                            "transition-colors duration-150 ease-out motion-reduce:transition-none",
                            "text-neutral-600 hover:text-neutral-800",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main",
                            "data-[selected=true]:bg-white data-[selected=true]:font-semibold",
                            "data-[selected=true]:text-neutral-800",
                            "data-[selected=true]:shadow-[0_1px_2px_rgba(145,158,171,0.24)]"
                        )}
                    >
                        {periodOption.label}
                    </button>
                );
            })}
        </div>
    );
};

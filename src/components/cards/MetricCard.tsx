// ── Tarjeta de métrica para el Dashboard ────────────────────────────────────
// Muestra un ícono alusivo (en un cuadro con color pastel), un valor destacado,
// un título y un indicador de tendencia (▲/▼) con el porcentaje de variación.
//
// El color del ícono se define con la variante `color` (usa los tokens
// `*-lighter` / `*-main`); el color de la tendencia se deriva del signo de `delta`.

import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


// ── Cuadro del ícono (fondo pastel + ícono en color principal) ──────────────
const iconBox = cva(
    "flex size-11 shrink-0 items-center justify-center rounded-xl",
    {
        variants: {
            color: {
                success: "bg-success-lighter text-success-main",
                info: "bg-info-lighter text-info-main",
                warning: "bg-warning-lighter text-warning-main",
                error: "bg-error-lighter text-error-main",
                primary: "bg-primary-lighter text-primary-main",
                secondary: "bg-secondary-lighter text-secondary-main",
            },
        },
        defaultVariants: { color: "success" },
    }
);


interface MetricCardProps extends VariantProps<typeof iconBox> {
    icon: LucideIcon;
    label: string;
    value: string | number;
    delta: number;              // Variación (ej. 12.5, -3.2). El signo define ▲/▼
    deltaLabel?: string;        // Texto secundario (ej. "vs. mes anterior")
    className?: string;
};


export default function MetricCard({
    icon: Icon,
    label,
    value,
    delta,
    deltaLabel = "vs. mes anterior",
    color,
    className,
}: MetricCardProps) {
    const isPositive = delta >= 0;

    // Color de la tendencia según el signo de la variación
    const trendColor = isPositive ? "text-success-main" : "text-error-main";

    // Formatea números con separador de miles; los strings se dejan tal cual
    const displayValue =
        typeof value === "number" ? value.toLocaleString("en-US") : value;

    return (
        <div
            className={cn(
                "flex w-full min-w-0 flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6",
                "shadow-[0_1px_2px_rgba(145,158,171,0.16)]",
                className
            )}
        >
            {/* ── Ícono + valor ──────────────────────────────────────────── */}
            <div className="flex min-w-0 items-center gap-3">
                <div className={cn(iconBox({ color }))}>
                    <Icon size={22} strokeWidth={2} />
                </div>
                <span className="min-w-0 text-[32px] font-bold leading-tight tracking-tight tabular-nums text-neutral-800 [overflow-wrap:anywhere]">
                    {displayValue}
                </span>
            </div>

            {/* ── Título + tendencia ─────────────────────────────────────── */}
            <div className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate text-sm font-semibold text-neutral-800">
                    {label}
                </span>

                <div className="flex min-w-0 items-center gap-2 text-sm">
                    {isPositive &&
                        <TrendingUp
                            size={18}
                            className={trendColor}
                        />
                    }

                    {!isPositive &&
                        <TrendingDown
                            size={18}
                            className={trendColor}
                        />
                    }

                    <span className={cn("shrink-0 font-semibold", trendColor)}>
                        {isPositive ? "+" : ""}
                        {delta}%
                    </span>
                    <span className="truncate text-neutral-500">{deltaLabel}</span>
                </div>
            </div>
        </div>
    );
};
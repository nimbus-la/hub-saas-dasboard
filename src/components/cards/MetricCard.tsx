import { TrendingDown, TrendingUp } from "lucide-react";

import type { MetricCardProps } from "@/interfaces";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE_BY_SIZE } from "@/tokens";

import {
    metricCardDeltaLabelVariants,
    metricCardDeltaVariants,
    metricCardFooterVariants,
    metricCardHeaderVariants,
    metricCardIconVariants,
    metricCardLabelVariants,
    metricCardTrendToneVariants,
    metricCardTrendVariants,
    metricCardValueVariants,
    metricCardVariants,
} from "./metric-card.style";


/**
 * MetricCard
 *
 * Tarjeta de métrica del dashboard: un icono en su cuadro de color, la cifra
 * protagonista, el título y la variación respecto al periodo anterior.
 *
 * La familia semántica la elige quien la usa con `color`; el color de la
 * tendencia no, que sale del signo de `delta` — una caída pintada de verde
 * sería una mentira que la API no debería permitir.
 */
export default function MetricCard({
    icon: Icon,
    label,
    value,
    delta,
    deltaLabel = messages.components.metricCard.deltaLabel,
    color,
    className,
}: MetricCardProps) {
    const trend = delta >= 0 ? "up" : "down";
    const trendTone = metricCardTrendToneVariants({ trend });

    // Los números se formatean con separador de miles; los strings se dejan
    // tal cual, así una métrica puede llegar ya formateada como importe o
    // porcentaje.
    const displayValue = typeof value === "number" ? formatNumber(value) : value;

    const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

    return (
        <div className={cn(metricCardVariants(), className)}>
            {/* ── Icono + cifra ──────────────────────────────────────────── */}
            <div className={metricCardHeaderVariants()}>
                <div className={metricCardIconVariants({ color })}>
                    <Icon
                        size={ICON_SIZE["2xl"]}
                        strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                    />
                </div>

                <span className={metricCardValueVariants()}>{displayValue}</span>
            </div>

            {/* ── Título + tendencia ─────────────────────────────────────── */}
            <div className={metricCardFooterVariants()}>
                <span className={metricCardLabelVariants()}>{label}</span>

                <div className={metricCardTrendVariants()}>
                    <TrendIcon
                        size={ICON_SIZE.lg}
                        strokeWidth={ICON_STROKE_BY_SIZE.lg}
                        className={trendTone}
                        aria-hidden="true"
                    />

                    <span className={cn(metricCardDeltaVariants(), trendTone)}>
                        {trend === "up" ? "+" : ""}
                        {delta}%
                    </span>

                    <span className={metricCardDeltaLabelVariants()}>
                        {deltaLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};

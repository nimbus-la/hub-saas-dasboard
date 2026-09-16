import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/** Contenedor del aviso y la barra de cifras. */
export const pricingSummaryVariants = cva(["flex flex-col", SPACING_CLASS.gap.md]);


/**
 * Barra con el costo y la ganancia.
 *
 * Misma forma que el total de la receta: fondo gris para separarla de los
 * campos, y las dos cifras a los extremos.
 */
export const pricingTotalsVariants = cva([
    "flex flex-wrap items-baseline justify-between bg-neutral-100",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
]);


export const pricingFigureVariants = cva(["flex min-w-0 flex-col"], {
    variants: {
        align: { start: "items-start", end: "items-end text-right" },
    },
    defaultVariants: { align: "start" },
});


export const pricingFigureLabelVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/** Si falta alguna cantidad en la receta, cambia de texto y de color. */
export const pricingFigureHintVariants = cva([TYPOGRAPHY.caption], {
    variants: {
        pending: { true: "text-warning-darker", false: "text-neutral-600" },
    },
    defaultVariants: { pending: false },
});


/**
 * Las cifras. Van en ancho fijo porque cambian con cada tecla y si no, el
 * importe baila de lado mientras se escribe.
 */
export const pricingAmountVariants = cva(["tabular-nums", TYPOGRAPHY.h4], {
    variants: {
        tone: {
            neutral: "text-neutral-800",
            success: "text-success-darker",
            error: "text-error-darker",
        },
    },
    defaultVariants: { tone: "neutral" },
});

import { cva } from "class-variance-authority";

import { DURATION_CLASS, EASING_CLASS, RADIUS_SEMANTIC, SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/** Contenedor del aviso y el desglose. */
export const pricingSummaryVariants = cva(["flex flex-col", SPACING_CLASS.gap.md]);


/**
 * El desglose del precio.
 *
 * Fondo hundido y borde, como el total de la receta: es un resultado de lo que
 * se escribió arriba, no un campo más del formulario. Las filas van en columna
 * porque las dos primeras suman y la tercera es su total, y eso solo se lee si
 * las cifras comparten el mismo borde derecho.
 */
export const pricingBreakdownVariants = cva([
    "flex flex-col border border-neutral-200 bg-neutral-100",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.gap.md,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
]);


/** El rótulo y, a su derecha, el aviso de que se está calculando. */
export const pricingBreakdownHeaderVariants = cva([
    "flex items-baseline justify-between",
    SPACING_CLASS.gap.sm,
]);


/** Rótulo del bloque. Va en overline para no competir con las cifras. */
export const pricingBreakdownTitleVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.overline,
]);


/** "Calculando…", discreto: es un estado de paso, no un resultado. */
export const pricingCalculatingVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);


/**
 * Las filas, una debajo de otra.
 *
 * Mientras llega el cálculo nuevo se atenúan: siguen siendo legibles, pero no
 * se leen como el resultado de lo que se acaba de escribir. Solo cambia la
 * opacidad, así que nada se mueve de sitio.
 */
export const pricingRowsVariants = cva(
    [
        "flex flex-col transition-opacity motion-reduce:transition-none",
        DURATION_CLASS.fast,
        EASING_CLASS.out,
        SPACING_CLASS.gap.md,
    ],
    {
        variants: {
            stale: { true: "opacity-60", false: "opacity-100" },
        },
        defaultVariants: { stale: false },
    }
);


/**
 * Una fila del desglose: el concepto a la izquierda y su cifra a la derecha.
 *
 * La del total se separa con una línea y un poco de aire, que es como cierra
 * cualquier cuenta: lo de arriba se suma, lo de abajo es el resultado.
 */
export const pricingRowVariants = cva(
    ["flex flex-wrap items-baseline justify-between", SPACING_CLASS.gap.lg],
    {
        variants: {
            total: { true: "border-t border-neutral-300 pt-3", false: "" },
        },
        defaultVariants: { total: false },
    }
);


/** Concepto y su explicación, apilados. */
export const pricingRowTextVariants = cva(["flex min-w-0 flex-col"]);


export const pricingRowLabelVariants = cva([], {
    variants: {
        total: {
            true: ["text-neutral-900", TYPOGRAPHY.subtitleLg],
            false: ["text-neutral-800", TYPOGRAPHY.subtitleMd],
        },
    },
    defaultVariants: { total: false },
});


/** De dónde sale la cifra. En ámbar cuando todavía no está completa. */
export const pricingRowHintVariants = cva([TYPOGRAPHY.caption], {
    variants: {
        pending: { true: "text-warning-darker", false: "text-neutral-600" },
    },
    defaultVariants: { pending: false },
});


/**
 * Las cifras. Van en ancho fijo porque cambian con cada tecla y si no, el
 * importe baila de lado mientras se escribe.
 */
export const pricingAmountVariants = cva(["shrink-0 tabular-nums"], {
    variants: {
        tone: {
            neutral: "text-neutral-800",
            strong: "text-neutral-900",
            success: "text-success-darker",
            error: "text-error-darker",
        },
        size: { sm: TYPOGRAPHY.subtitleLg, md: TYPOGRAPHY.h4, lg: TYPOGRAPHY.h3 },
    },
    defaultVariants: { tone: "neutral", size: "md" },
});


/**
 * Lo que ocupa el lugar de una cifra que todavía no se puede calcular.
 *
 * Se limita el ancho para que la frase no empuje al concepto contra el borde
 * izquierdo cuando la fila cabe en una sola línea.
 */
export const pricingAmountPendingVariants = cva(
    ["max-w-xs text-neutral-600", TYPOGRAPHY.caption],
    {
        variants: {
            /** `start` cuando ocupa el lugar de todo el desglose y no de una cifra. */
            align: { end: "text-right", start: "text-left" },
        },
        defaultVariants: { align: "end" },
    }
);

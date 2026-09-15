import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de RecipeSummary
 *
 * Va debajo de la tabla. Primero el aviso de insumos agotados, si lo hay, y
 * al final el costo total, que es lo último que se quiere ver después de
 * revisar la receta.
 */


/** Contenedor del aviso y el total. */
export const recipeSummaryVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
]);


/** Barra del costo total, sobre fondo gris para separarla de la tabla. */
export const recipeTotalVariants = cva([
    "flex flex-wrap items-baseline justify-between bg-neutral-100",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.gap.sm,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
]);


/** Título del total y la explicación de cómo se calcula. */
export const recipeTotalTextVariants = cva(["flex min-w-0 flex-col"]);


export const recipeTotalLabelVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/**
 * Explica de dónde sale la cifra. Si falta alguna cantidad, cambia de texto y
 * de color para avisar que el total todavía no está completo.
 */
export const recipeTotalHintVariants = cva([TYPOGRAPHY.caption], {
    variants: {
        pending: {
            true: "text-warning-darker",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { pending: false },
});


/**
 * El importe. Usa cifras de ancho fijo porque cambia con cada tecla, y así el
 * número no se mueve de lado mientras se escribe.
 */
export const recipeTotalAmountVariants = cva([
    "text-neutral-800 tabular-nums",
    TYPOGRAPHY.h4,
]);

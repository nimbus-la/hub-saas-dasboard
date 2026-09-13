import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de RecipeSummary
 *
 * Cierra la lista: primero el aviso —si lo hay— y después el total. Ese orden
 * no es casual. El aviso explica una consecuencia sobre el producto y el total
 * es una cifra que se consulta, así que lo último que queda en pantalla al
 * terminar de leer la receta es lo que cuesta.
 *
 * El total va dentro de la misma caja que la lista, separado por una línea y
 * sobre fondo hundido: es el pie de una tabla, no una tarjeta aparte. Ponerlo
 * fuera lo dejaría flotando sin decir de qué es la suma.
 */


/**
 * Banda del aviso, dentro del panel.
 *
 * El aviso va **entre** la lista y el total y no debajo de la tarjeta: es una
 * consecuencia de lo que hay en la lista, y sacándolo fuera dejaría de leerse
 * como parte de ella. La banda le da el relleno y la línea que lo separa de la
 * última fila; el aviso pone su propio borde y su tinte.
 */
export const recipeNoticeVariants = cva([
    "border-t border-neutral-200 bg-white",
    SPACING_CLASS.padding.lg,
]);


/** Pie del panel: la línea del total. */
export const recipeTotalVariants = cva([
    "flex flex-wrap items-baseline justify-between",
    "border-t border-neutral-200 bg-neutral-100",
    SPACING_CLASS.gap.sm,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
]);


/** Bloque de la izquierda: rótulo y explicación de la cuenta. */
export const recipeTotalTextVariants = cva(["flex min-w-0 flex-col"]);


/** `Costo total de la receta`. */
export const recipeTotalLabelVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/** De dónde sale la cifra, o qué falta para que esté completa. */
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
 * El importe.
 *
 * `tabular-nums` porque la cifra cambia con cada tecla que se escribe en una
 * cantidad: sin ella el total baila de ancho a cada pulsación y arrastra
 * consigo el rótulo de al lado.
 */
export const recipeTotalAmountVariants = cva([
    "text-neutral-800 tabular-nums",
    TYPOGRAPHY.h4,
]);

import { cva } from "class-variance-authority";

import { SPACING_CLASS, TRANSITION, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de IngredientSearchResult
 *
 * Cada resultado es un botón que ocupa toda la fila, así se puede tocar en
 * cualquier parte y no hay que apuntarle a un ícono pequeño.
 */


/**
 * El botón de la fila.
 *
 * El alto no se fija. La miniatura de 40px con 8px arriba y abajo da 56px, y
 * si un nombre ocupa dos líneas la fila crece en lugar de recortarlo.
 *
 * El anillo de foco va por dentro porque la fila toca los bordes de la caja, y
 * uno por fuera quedaría recortado.
 */
export const ingredientSearchResultVariants = cva([
    "flex w-full cursor-pointer items-center text-left",
    SPACING_CLASS.gap.md,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.sm,
    TRANSITION.colors,
    "hover:bg-neutral-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-main/30",
]);


/** Nombre arriba, SKU y costo debajo. */
export const ingredientSearchResultTextVariants = cva(["flex min-w-0 flex-1 flex-col"]);


export const ingredientSearchResultNameVariants = cva([
    "truncate text-neutral-800",
    TYPOGRAPHY.subtitleSm,
]);


/** El SKU y el costo ayudan a no confundir dos insumos con nombres parecidos. */
export const ingredientSearchResultMetaVariants = cva([
    "truncate text-neutral-600",
    TYPOGRAPHY.caption,
]);


export const ingredientSearchResultStockVariants = cva([
    "flex shrink-0 flex-col items-end text-right",
]);


/** Las cifras usan ancho fijo para que queden alineadas de una fila a otra. */
export const ingredientSearchResultStockValueVariants = cva(
    ["tabular-nums", TYPOGRAPHY.subtitleSm],
    {
        variants: {
            outOfStock: {
                true: "text-error-darker",
                false: "text-neutral-800",
            },
        },
        defaultVariants: { outOfStock: false },
    }
);


export const ingredientSearchResultStockHintVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);


/** Ícono de añadir al final de la fila. Su tamaño se pasa por prop. */
export const ingredientSearchResultIconVariants = cva(["shrink-0 text-neutral-500"]);

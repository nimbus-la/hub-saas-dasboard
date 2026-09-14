import { cva } from "class-variance-authority";

import { TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de RecipeQuantityCell
 *
 * La unidad va dentro del campo como sufijo porque no se elige, viene dada
 * por el insumo.
 */


/** Abreviatura de la unidad dentro del campo. */
export const recipeQuantityUnitVariants = cva([
    "select-none text-neutral-600",
    TYPOGRAPHY.labelSm,
]);

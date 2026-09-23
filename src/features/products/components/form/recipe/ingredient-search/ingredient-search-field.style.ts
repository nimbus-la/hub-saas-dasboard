import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de IngredientSearchField
 *
 * Los resultados aparecen debajo del campo, dentro de la página, y no en un
 * menú flotante. Un menú flotante se cierra cada vez que se elige algo, y aquí
 * lo normal es añadir varios insumos seguidos. Como no flota, se separa con
 * borde y no con sombra.
 */


/** Bloque del buscador, con el campo y lo que aparece debajo. */
export const ingredientSearchVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.sm,
]);


/** Caja de los resultados. */
export const ingredientSearchResultsVariants = cva([
    "overflow-hidden border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
]);


/**
 * Lista de resultados.
 *
 * Tiene alto máximo para que, con el navegador muy ampliado, la lista se
 * desplace dentro de su caja en vez de empujar el resto del paso fuera de la
 * pantalla.
 */
export const ingredientSearchListVariants = cva([
    "max-h-80 overflow-y-auto",
    "divide-y divide-neutral-200",
]);


/** Aviso al pie cuando hay más coincidencias de las que se muestran. */
export const ingredientSearchFooterVariants = cva([
    "border-t border-neutral-200 bg-neutral-100 text-neutral-600",
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.sm,
    TYPOGRAPHY.caption,
]);


/** Mensaje cuando la búsqueda no deja nada para añadir. */
export const ingredientSearchEmptyVariants = cva([
    "border border-neutral-200 bg-white text-neutral-600",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.padding.lg,
    TYPOGRAPHY.bodySm,
]);

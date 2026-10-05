import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de LoadMore
 *
 * Misma línea y mismo aire que el pie de `Pagination`: los dos cierran una
 * lista, y una pantalla que cambie de uno a otro no debería moverse.
 */


/** Pie de la lista. */
export const loadMoreVariants = cva([
    "flex flex-col items-center justify-center text-center",
    "border-t border-neutral-200 pt-4",
    SPACING_CLASS.gap.sm,
]);


/** Estado de la carga: cuántos van, si viene más o si falló. */
export const loadMoreTextVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodySm,
]);


/**
 * Centinela del scroll infinito.
 *
 * Un píxel de alto basta: lo que importa es que exista en el flujo para que el
 * observador lo vea entrar. Sin alto, algunos navegadores no lo cuentan como
 * visible.
 */
export const loadMoreSentinelVariants = cva(["h-px w-full"]);

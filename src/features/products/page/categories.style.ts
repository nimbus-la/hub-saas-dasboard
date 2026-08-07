import { cva } from "class-variance-authority";

import { SPACING_CLASS } from "@/tokens";


/**
 * Estilos de la pantalla de categorías
 *
 * Mismo esqueleto que la lista de productos: `gap-6` entre el encabezado y el
 * cuerpo —son dos bloques distintos— y `gap-4` dentro del cuerpo, donde
 * filtros y tabla son partes de una misma herramienta. Que el interior vaya
 * más apretado que el exterior es lo que hace que se lean como un grupo.
 */


/** Pila de la pantalla. */
export const categoriesPageVariants = cva([
    "flex w-full flex-col",
    SPACING_CLASS.gap.xl,
]);


/** Cuerpo: filtros y tabla. */
export const categoriesPageBodyVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.lg,
]);

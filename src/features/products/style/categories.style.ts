import { cva } from "class-variance-authority";

import { SPACING_CLASS } from "@/tokens";


/**
 * Estilos de la pantalla de categorías. Sigue la misma estructura que la
 * lista de productos. Hay más espacio entre el encabezado y el cuerpo que
 * dentro del cuerpo, para que la barra y la tabla se lean como un grupo.
 */


/** Contenedor de toda la pantalla. */
export const categoriesPageVariants = cva([
    "flex w-full flex-col",
    SPACING_CLASS.gap.xl,
]);


/** Cuerpo de la pantalla, con la barra y la tabla. */
export const categoriesPageBodyVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.lg,
]);


/**
 * Paginación. La línea de arriba la separa de la tabla para que no parezca
 * otra fila. Se ve igual que en la lista de productos.
 */
export const categoriesPagePaginationVariants = cva([
    "border-t border-neutral-200 pt-4",
]);

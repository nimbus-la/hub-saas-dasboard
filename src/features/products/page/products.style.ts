import { cva } from "class-variance-authority";

import { SPACING_CLASS } from "@/tokens";


/**
 * Estilos de la pantalla de productos
 *
 * Dos ritmos: `gap-6` entre el encabezado y el cuerpo —son dos bloques
 * distintos— y `gap-4` dentro del cuerpo, donde buscador, pestañas, rejilla y
 * paginación son partes de una misma herramienta. Que el interior vaya más
 * apretado que el exterior es lo que hace que se lean como un grupo.
 */


/** Pila de la pantalla. */
export const productsPageVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.xl,
]);


/** Cuerpo: filtros, rejilla y pie. */
export const productsPageBodyVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.lg,
]);


/**
 * Buscador dentro de la fila de filtros.
 *
 * Lo único que la pantalla decide del campo: cuánto ocupa. El alto, el radio,
 * la tipografía y el salto a 16px en móvil salen enteros de la receta de
 * `TextField`. Un tope de 20rem a partir de `sm` porque un buscador más largo
 * deja de ayudar a leer lo que se escribe.
 */
export const productsPageSearchVariants = cva(["w-full sm:max-w-xs"]);


/**
 * Pie de paginación.
 *
 * La línea lo separa de la rejilla; el relleno superior le da el aire que la
 * línea por sí sola no da.
 */
export const productsPagePaginationVariants = cva([
    "border-t border-neutral-200 pt-4",
]);

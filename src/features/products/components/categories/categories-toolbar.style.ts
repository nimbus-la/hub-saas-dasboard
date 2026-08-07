import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de CategoriesToolbar
 *
 * Buscar, acotar por estado y crear. Los tres son la misma herramienta, así
 * que van en una fila con `gap-3` —el escalón corto— y no separados como
 * bloques.
 *
 * En móvil la fila se rompe en columna y cada control ocupa el ancho entero:
 * un buscador de media pantalla junto a un selector de media pantalla no deja
 * leer ninguno de los dos.
 */


/** Fila de filtros. Columna en móvil, fila a partir de `sm`. */
export const categoriesToolbarVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
    "sm:flex-row sm:flex-wrap sm:items-center",
]);


/**
 * Buscador.
 *
 * Lo único que la pantalla decide del campo: cuánto ocupa. Un tope de 20rem a
 * partir de `sm` porque un buscador más largo deja de ayudar a leer lo que se
 * escribe.
 */
export const categoriesToolbarSearchVariants = cva(["w-full sm:max-w-xs"]);


/**
 * Selector de estado.
 *
 * Ancho fijo a partir de `sm` y no `w-auto`: el campo cambiaría de anchura al
 * pasar de "Todos los estados" a "Activa", y con él se movería el botón de
 * crear que tiene al lado.
 */
export const categoriesToolbarFilterVariants = cva(["w-full sm:w-56"]);


/** Acción principal: siempre pegada al margen derecho en escritorio. */
export const categoriesToolbarActionVariants = cva([
    "w-full sm:ms-auto sm:w-auto",
]);


/**
 * Resumen de lo que hay en pantalla.
 *
 * Solo aparece cuando hay un filtro puesto. Sin filtros sobra —el contador del
 * encabezado ya dice cuántas hay— y una línea que siempre repite el mismo
 * número deja de leerse.
 */
export const categoriesToolbarSummaryVariants = cva([
    "flex flex-wrap items-center",
    SPACING_CLASS.gap.sm,
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);

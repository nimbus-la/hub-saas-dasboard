import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de EmployeesToolbar
 *
 * Buscar, acotar por estado y crear. Los tres son la misma herramienta, así
 * que van en una fila con las separaciones del sistema y no separados como
 * bloques.
 *
 * En móvil la fila se rompe en columna y cada control ocupa el ancho entero:
 * un buscador de media pantalla junto a un selector de media pantalla no deja
 * leer ninguno de los dos.
 */


/** Fila de filtros. Columna en móvil, fila a partir de `sm`. */
export const employeesToolbarVariants = cva([
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
export const employeesToolbarSearchVariants = cva(["w-full sm:max-w-xs"]);


/** Selector de estado. Ver el argumento de `categoriesToolbarFilterVariants`. */
export const employeesToolbarFilterVariants = cva(["w-full sm:w-auto"]);


/** Acción principal: siempre pegada al margen derecho en escritorio. */
export const employeesToolbarActionVariants = cva([
    "w-full sm:ms-auto sm:w-auto",
]);


/**
 * Resumen de lo que hay en pantalla.
 *
 * Solo aparece cuando hay un filtro puesto. Sin filtros sobra —el contador del
 * encabezado ya dice cuántos hay— y una línea que siempre repite el mismo
 * número deja de leerse.
 */
export const employeesToolbarSummaryVariants = cva([
    "flex flex-wrap items-center",
    SPACING_CLASS.gap.sm,
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);
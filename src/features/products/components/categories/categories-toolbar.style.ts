import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de la barra de categorías. Buscador, filtro y botón de crear van en
 * una misma fila porque se usan juntos. En móvil pasan a columna y cada uno
 * ocupa todo el ancho, para que se puedan leer.
 */


/** Contenedor de la barra y del resumen de filtros. */
export const categoriesToolbarRootVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
]);


/** Fila de controles. Es columna en móvil y fila desde pantallas pequeñas. */
export const categoriesToolbarVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
    "sm:flex-row sm:flex-wrap sm:items-center",
]);


/** Buscador. Tiene un ancho máximo porque más largo no ayuda a leer lo escrito. */
export const categoriesToolbarSearchVariants = cva(["w-full sm:max-w-xs"]);


/**
 * Selector de estado. Toma el ancho de su texto, porque solo muestra fondo al
 * pasar el cursor. Cambiar de opción no mueve el botón de crear, que va
 * pegado a la derecha.
 */
export const categoriesToolbarFilterVariants = cva(["w-full sm:w-auto"]);


/** Botón de crear, pegado a la derecha en escritorio. */
export const categoriesToolbarActionVariants = cva([
    "w-full sm:ms-auto sm:w-auto",
]);


/**
 * Resumen de resultados. Solo se muestra con filtros activos, porque sin
 * filtros el contador del encabezado ya dice cuántas categorías hay.
 */
export const categoriesToolbarSummaryVariants = cva([
    "flex flex-wrap items-center",
    SPACING_CLASS.gap.sm,
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);

import { cva } from "class-variance-authority";

import {
    FONT_WEIGHT_CLASS,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
} from "@/tokens";


/**
 * Estilos de la tabla de categorías. DataTable dibuja la tabla, y aquí solo
 * están el panel que la contiene y el aspecto de cada celda.
 */


/**
 * Panel que contiene la tabla. Usa borde y no sombra porque es una superficie
 * fija. Oculta lo que sobra para que el scroll horizontal no se salga por las
 * esquinas redondeadas.
 */
export const categoriesTablePanelVariants = cva([
    "w-full min-w-0 overflow-hidden",
    "border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.padding.lg,
    "sm:p-6",
]);


/** Nombre de la categoría, que es lo primero que se busca en cada fila. */
export const categoriesTableNameVariants = cva([
    "text-neutral-800",
    FONT_WEIGHT_CLASS.semibold,
]);


/**
 * Descripción, cortada en dos líneas. En una sola línea estiraría la columna
 * y con tres cada fila parecería un párrafo.
 */
export const categoriesTableDescriptionVariants = cva([
    "line-clamp-2 text-neutral-600",
]);


/** Raya que se muestra cuando no hay descripción, en gris claro. */
export const categoriesTableEmptyDescriptionVariants = cva([
    "text-neutral-400 select-none",
]);


/**
 * Botones de editar y eliminar, alineados a la derecha. No se parten en dos
 * líneas aunque la pantalla sea angosta.
 */
export const categoriesTableActionsVariants = cva([
    "flex items-center justify-end whitespace-nowrap",
    SPACING_CLASS.gap.xs,
]);


/** Botón de eliminar. Se pone rojo solo al pasar el cursor. */
export const categoriesTableDeleteVariants = cva([
    "text-neutral-500 hover:text-error-dark",
]);

import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de TitleSubtitleCell
 *
 * Ambos textos truncan en una línea para que todas las filas conserven la
 * misma altura sin importar el largo del contenido.
 */


/** Raíz: elemento visual opcional + bloque de texto. */
export const titleSubtitleCellVariants = cva([
    "flex min-w-0 items-center",
    SPACING_CLASS.gap.md,
]);


/** Hueco del avatar, icono o miniatura. */
export const titleSubtitleCellMediaVariants = cva(["shrink-0"]);


/** Pila de los dos textos. */
export const titleSubtitleCellTextVariants = cva(["flex min-w-0 flex-col"]);


/** Título: es la cabecera de la celda, no cuerpo de tabla. */
export const titleSubtitleCellTitleVariants = cva([
    "truncate text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/** Subtítulo: correo, categoría, SKU… */
export const titleSubtitleCellSubtitleVariants = cva([
    "truncate text-neutral-500",
    TYPOGRAPHY.bodyXs,
]);

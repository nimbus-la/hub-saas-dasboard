import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    RADIUS_FULL_CLASS,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/** Cuerpo del paso. */
export const productRecipeStepVariants = cva([
    "flex flex-col border-0 p-0",
    SPACING_CLASS.gap.xl,
]);


/** Bloque de la lista: su encabezado y la tarjeta. */
export const productRecipeListVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
]);


/** Encabezado del bloque: nombre de la lista y cuántos insumos lleva. */
export const productRecipeListHeaderVariants = cva([
    "flex flex-wrap items-center justify-between",
    SPACING_CLASS.gap.sm,
]);


/** `Insumos de la receta`. */
export const productRecipeListTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


/** `3 insumos` — el contador, en la esquina opuesta. */
export const productRecipeListCountVariants = cva([
    "text-neutral-600 tabular-nums",
    TYPOGRAPHY.caption,
]);


/** Tarjeta que contiene cabecera, filas, aviso y total. */
export const productRecipeCardVariants = cva([
    "overflow-hidden border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
]);


/** Filas. La línea separadora va entre ellas, no alrededor. */
export const productRecipeRowsVariants = cva([
    "divide-y divide-neutral-200",
]);


/* -------------------------------------------------------------------------- */
/*  Receta vacía                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Estado vacío.
 *
 * Copia la caja del estado vacío del catálogo —círculo de 56px, texto
 * centrado— porque es la misma situación: un hueco donde debería haber
 * contenido. Repetir su forma evita que la app tenga dos maneras de decir
 * "aquí todavía no hay nada".
 */
export const productRecipeEmptyVariants = cva([
    "flex flex-col items-center justify-center text-center",
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.xl,
    SPACING_CLASS.paddingY["2xl"],
]);


/** Círculo del icono — el lado del control `2xl`, decorativo por el radio. */
export const productRecipeEmptyIconVariants = cva([
    "flex items-center justify-center bg-neutral-200 text-neutral-600",
    CONTROL_SIZE["2xl"].squareClass,
    RADIUS_FULL_CLASS,
]);


/** Bloque de texto del estado vacío. */
export const productRecipeEmptyTextVariants = cva([
    "flex max-w-sm flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Título del estado vacío. */
export const productRecipeEmptyTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


/** Qué hacer para llenarlo. */
export const productRecipeEmptyMessageVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);

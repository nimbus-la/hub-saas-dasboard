import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    RADIUS_FULL_CLASS,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de ProductStepPlaceholder
 *
 * Copia la caja del estado vacío de la lista de productos —círculo de 56px,
 * texto centrado, `py-8`— porque es la misma situación: un hueco donde debería
 * haber contenido. Repetir su forma evita que la app tenga dos maneras de
 * decir "aquí todavía no hay nada".
 */


/** Caja del paso pendiente. */
export const productStepPlaceholderVariants = cva([
    "flex flex-col items-center justify-center text-center",
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.xl,
    SPACING_CLASS.paddingY["2xl"],
]);


/** Círculo del icono — el lado del control `2xl`, decorativo por el radio. */
export const productStepPlaceholderIconVariants = cva([
    "flex items-center justify-center bg-neutral-200 text-neutral-600",
    CONTROL_SIZE["2xl"].squareClass,
    RADIUS_FULL_CLASS,
]);


/** Bloque de texto. */
export const productStepPlaceholderTextVariants = cva([
    "flex max-w-sm flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Nombre del paso pendiente. */
export const productStepPlaceholderTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


/** Qué se pedirá aquí cuando el paso exista. */
export const productStepPlaceholderMessageVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);

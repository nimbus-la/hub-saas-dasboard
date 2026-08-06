import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de ProductsEmptyState
 *
 * El relleno vertical baja a `py-8` (32px), el tope de la escala de espaciado.
 * Antes eran 64px, que no salen de ninguna parte: el estado vacío ocupa el
 * hueco de la rejilla y no necesita reservarlo con aire inventado.
 */


/** Caja del estado vacío. */
export const productsEmptyStateVariants = cva([
    "flex flex-col items-center justify-center text-center",
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.xl,
    SPACING_CLASS.paddingY["2xl"],
]);


/**
 * Círculo del icono.
 *
 * 56px es el lado del control `2xl`, el único de ese tamaño en el sistema. No
 * es un control —no se pulsa— pero sí una superficie de ese diámetro, y el
 * radio de píldora deja claro que es decorativa.
 */
export const productsEmptyStateIconVariants = cva([
    "flex items-center justify-center bg-neutral-200",
    CONTROL_SIZE["2xl"].squareClass,
    RADIUS_SEMANTIC.pill,
]);


/**
 * Bloque de texto.
 *
 * `gap-1` y no el `gap-1.5` de antes: el interlineado que trae la rampa ya
 * aporta los 2px que se le quitan a la separación.
 */
export const productsEmptyStateTextVariants = cva([
    "flex max-w-sm flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Titular del estado vacío. */
export const productsEmptyStateTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


/** Explicación: qué se buscó y qué hacer ahora. */
export const productsEmptyStateMessageVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);

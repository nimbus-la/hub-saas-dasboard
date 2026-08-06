import { cva } from "class-variance-authority";

import {
    FONT_WEIGHT_CLASS,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    SURFACE_SIZE,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de ProductCard
 *
 * La tarjeta se divide en tres superficies con densidad propia —la foto, el
 * cuerpo y la barra de acciones—, así que no hay un único escalón de
 * `SURFACE_SIZE` que valga para todo: el cuerpo es `lg` (p-4) y la barra de
 * acciones `md` (p-3), que es la que va más apretada por llevar controles.
 *
 * El eje `dimmed` es el estado de un producto que no se puede vender. Apaga
 * solo lo decorativo —superficie y foto—, nunca el texto ni los botones:
 * bajarles el contraste sería quitar accesibilidad para ganar estilo.
 */


/** Raíz. */
export const productCardVariants = cva(
    [
        "flex min-w-0 flex-col overflow-hidden",
        RADIUS_SEMANTIC.surface,
        "border border-neutral-200",
        TRANSITION.colors,
        "hover:border-neutral-300",
    ],
    {
        variants: {
            dimmed: {
                true: "bg-neutral-100",
                false: "bg-white",
            },
        },
        defaultVariants: { dimmed: false },
    }
);


/**
 * Marco de la foto.
 *
 * El 4:3 reserva el hueco antes de que la imagen llegue: sin él la rejilla
 * entera saltaría al cargar cada miniatura.
 */
export const productCardMediaVariants = cva(
    ["relative aspect-4/3 overflow-hidden"],
    {
        variants: {
            dimmed: {
                true: "bg-neutral-200",
                false: "bg-neutral-100",
            },
        },
        defaultVariants: { dimmed: false },
    }
);


/** Insignia de estado sobre la foto. */
export const productCardBadgeVariants = cva(["absolute top-3 right-3"]);


/**
 * Cuerpo: categoría, nombre y la línea de insumos y precio.
 *
 * `gap-1` y no `gap-2`: los tres son un mismo bloque de identificación, y la
 * rampa tipográfica ya trae su propio interlineado.
 */
export const productCardBodyVariants = cva([
    "flex min-w-0 flex-1 flex-col",
    SURFACE_SIZE.lg.paddingClass,
    SPACING_CLASS.gap.xs,
]);


/**
 * Categoría.
 *
 * `neutral-600` y no `500`: a 11px la categoría necesita los 4.5:1 sobre
 * blanco que el gris claro no alcanza.
 */
export const productCardCategoryVariants = cva([
    "truncate text-neutral-600",
    TYPOGRAPHY.overline,
]);


/**
 * Nombre del producto.
 *
 * Dos líneas como máximo: así todas las tarjetas de una fila mantienen la
 * misma altura aunque los nombres varíen.
 */
export const productCardNameVariants = cva([
    "line-clamp-2 text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/**
 * Línea de insumos y precio.
 *
 * `mt-auto` la ancla abajo: el precio queda siempre a la misma altura en toda
 * la fila, que es lo que permite compararlos de un barrido vertical.
 */
export const productCardMetaVariants = cva([
    "mt-auto flex min-w-0 items-baseline justify-between pt-2",
    SPACING_CLASS.gap.sm,
]);


/** Recuento de insumos. */
export const productCardIngredientsVariants = cva([
    "flex min-w-0 items-center text-neutral-600",
    SPACING_SEMANTIC.inline,
    TYPOGRAPHY.bodyXs,
]);


/**
 * Precio.
 *
 * Cifras tabulares: sin ellas los precios de la rejilla no alinean sus dígitos
 * y la columna se ve temblorosa.
 */
export const productCardPriceVariants = cva([
    "shrink-0 tabular-nums text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


/** Contenedor de la alerta del servicio. */
export const productCardAlertWrapperVariants = cva(["px-3 pb-3"]);


/**
 * Alerta del servicio (solo lectura).
 *
 * Va en `body-xs` como el recuento de insumos, así que el peso es lo único que
 * la distingue: sin el semibold las dos líneas de 12px se leerían como el
 * mismo rango de información. Es el caso puntual para el que existe
 * `FONT_WEIGHT_CLASS`.
 */
export const productCardAlertVariants = cva([
    "flex items-start",
    SPACING_SEMANTIC.inline,
    SURFACE_SIZE.md.radiusClass,
    SPACING_CLASS.paddingX.md,
    SPACING_CLASS.paddingY.sm,
    "bg-warning-lighter text-warning-darker wrap-anywhere",
    TYPOGRAPHY.bodyXs,
    FONT_WEIGHT_CLASS.semibold,
]);


/** Icono de la alerta. `mt-px` lo alinea ópticamente con la primera línea. */
export const productCardAlertIconVariants = cva([
    "mt-px shrink-0 text-warning-dark",
]);


/** Barra de acciones. */
export const productCardActionsVariants = cva([
    "flex items-center border-t border-neutral-200",
    SURFACE_SIZE.md.paddingClass,
    SURFACE_SIZE.md.gapClass,
]);

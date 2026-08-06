import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    SURFACE_SIZE,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de MetricCard
 *
 * La tarjeta es una superficie `xl` —el escalón por defecto de la familia,
 * `COMPONENT_DEFAULT_SIZE.surface`— y de ahí salen relleno, separación y radio
 * de una vez. No lleva sombra a propósito: la regla de elevación reserva la
 * sombra para lo que flota sobre el contenido, y una tarjeta estática se
 * separa del fondo con borde.
 *
 * El eje `color` sí vive aquí: es la identidad de la métrica —qué familia
 * semántica la representa— y no la comparte con nadie.
 */


/** Raíz. */
export const metricCardVariants = cva([
    "flex w-full min-w-0 flex-col",
    SURFACE_SIZE.xl.paddingClass,
    SURFACE_SIZE.xl.gapClass,
    SURFACE_SIZE.xl.radiusClass,
    "border border-neutral-200 bg-white",
]);


/** Cabecera: cuadro del icono + cifra. */
export const metricCardHeaderVariants = cva([
    "flex min-w-0 items-center",
    SPACING_CLASS.gap.md,
]);


/**
 * Cuadro del icono — fondo pastel y glifo en el tono principal.
 *
 * El lado sale de `CONTROL_SIZE.lg` (44px) porque es el único 44 del sistema,
 * pero el radio es de superficie y no de control: el cuadro no es pulsable, y
 * con `rounded-lg` se leería como un botón desactivado junto a la cifra.
 */
export const metricCardIconVariants = cva(
    [
        "flex shrink-0 items-center justify-center",
        CONTROL_SIZE.lg.squareClass,
        RADIUS_SEMANTIC.surface,
    ],
    {
        variants: {
            color: {
                success: "bg-success-lighter text-success-main",
                info: "bg-info-lighter text-info-main",
                warning: "bg-warning-lighter text-warning-main",
                error: "bg-error-lighter text-error-main",
                primary: "bg-primary-lighter text-primary-main",
                secondary: "bg-secondary-lighter text-secondary-main",
            },
        },
        defaultVariants: { color: "success" },
    }
);


/**
 * La cifra — lo único que se lee desde el otro lado de la mesa.
 *
 * `wrap-anywhere` porque un importe en COP sin abreviar desborda la tarjeta
 * antes que partirse solo.
 */
export const metricCardValueVariants = cva([
    "min-w-0 tabular-nums wrap-anywhere text-neutral-800",
    TYPOGRAPHY.displaySm,
]);


/**
 * Pie: título de la métrica y su tendencia.
 *
 * `gap-1` y no `gap-2`: el título y su tendencia son un mismo bloque, y el
 * interlineado de `subtitle-md` ya aporta el aire que falta.
 */
export const metricCardFooterVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Título de la métrica. */
export const metricCardLabelVariants = cva([
    "truncate text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/** Fila de la tendencia. */
export const metricCardTrendVariants = cva([
    "flex min-w-0 items-center",
    SPACING_SEMANTIC.inline,
    TYPOGRAPHY.bodyMd,
]);


/**
 * Color de la tendencia — lo comparten el icono y el porcentaje.
 *
 * Va en un `cva` propio para que el `.tsx` no tenga que elegir clases: el
 * componente solo traduce el signo de `delta` a `up` o `down`.
 */
export const metricCardTrendToneVariants = cva("", {
    variants: {
        trend: {
            up: "text-success-main",
            down: "text-error-main",
        },
    },
    defaultVariants: { trend: "up" },
});


/** Porcentaje de variación. */
export const metricCardDeltaVariants = cva([
    "shrink-0",
    TYPOGRAPHY.subtitleMd,
]);


/** Texto de contexto de la tendencia ("vs. mes anterior"). */
export const metricCardDeltaLabelVariants = cva(["truncate text-neutral-500"]);

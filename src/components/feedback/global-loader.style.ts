import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    ELEVATION,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    TYPOGRAPHY,
    Z_INDEX_CLASS,
} from "@/tokens";


/**
 * Estilos del GlobalLoader
 *
 * Una tarjeta pequeña sobre un velo, centrada como el `ConfirmDialog`: la
 * espera interrumpe la pantalla igual que una pregunta, así que usa la misma
 * forma y el mismo velo. Nada de pantalla completa con logotipo; en un panel
 * de trabajo lo que importa es que se sigue viendo dónde se estaba.
 */


/**
 * Capa que cubre la pantalla.
 *
 * Está siempre montada y solo cambia si recibe clics: así la región que lee
 * el lector de pantalla existe antes de que llegue el texto, y el velo puede
 * terminar su salida sin desmontarse a medias.
 *
 * El cursor no cambia mientras bloquea: la espera ya la cuenta la tarjeta, y
 * en las respuestas rápidas un cursor de carga que aparece y se va sería el
 * mismo parpadeo que el retraso del velo quiere evitar.
 */
export const globalLoaderVariants = cva(
    ["fixed inset-0 flex items-center justify-center", Z_INDEX_CLASS.loader],
    {
        variants: {
            blocking: {
                true: "pointer-events-auto",
                false: "pointer-events-none",
            },
        },

        defaultVariants: { blocking: false },
    }
);


/** Velo. Mismo tono y desenfoque que el del `ConfirmDialog`. */
export const globalLoaderBackdropVariants = cva([
    "absolute inset-0",
    "bg-neutral-900/40 supports-backdrop-filter:backdrop-blur-xs",
]);


/**
 * Tarjeta.
 *
 * Icono arriba y texto debajo, en un ancho corto: con dos o tres palabras
 * ("Eliminando producto…") una tarjeta más ancha se ve vacía.
 */
export const globalLoaderCardVariants = cva([
    "relative flex min-w-56 max-w-[calc(100%-2rem)] flex-col items-center text-center",
    SPACING_SEMANTIC.card,
    SPACING_CLASS.gap.md,
    RADIUS_SEMANTIC.overlay,
    "border border-neutral-200 bg-white",
    ELEVATION["2xl"].class,
]);


/**
 * Medallón del icono, como el del `ConfirmDialog` pero en el tono principal:
 * esperar no es un peligro.
 */
export const globalLoaderMediaVariants = cva([
    "flex shrink-0 items-center justify-center",
    CONTROL_SIZE["2xl"].squareClass,
    RADIUS_SEMANTIC.pill,
    "bg-primary-main/10 text-primary-dark",
]);


/** El giro se apaga con movimiento reducido; el texto basta. */
export const globalLoaderSpinnerVariants = cva([
    "animate-spin motion-reduce:animate-none",
]);


export const globalLoaderMessageVariants = cva([
    "text-neutral-700",
    TYPOGRAPHY.bodyMd,
]);

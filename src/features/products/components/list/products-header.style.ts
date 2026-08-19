import { cva } from "class-variance-authority";

import { SPACING_CLASS, SPACING_SEMANTIC, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de ProductsHeader
 *
 * El total del catálogo se pinta con `StatusBadge` en vez de con una píldora
 * propia: es exactamente su tono `neutral`, y tenerlo aquí a mano significaba
 * mantener dos insignias que ya divergían en radio.
 *
 * Va en el escalón `xs` y no en el `sm` por defecto. La banda visual del
 * título —de la altura de mayúscula a la línea base— mide 18px: una insignia
 * de 24 sobresale 3,8px por arriba y 2,2 por abajo, y esa asimetría se lee
 * como que la insignia flota. Con 20px el desbordamiento baja a 1,8 y 0,2, y
 * de paso iguala a los contadores de las pestañas, que ya son `xs`.
 */


/** Fila del encabezado. Envuelve antes que apretar el botón contra el título. */
export const productsHeaderVariants = cva([
    "flex flex-wrap items-start justify-between",
    "gap-x-4 gap-y-3",
]);


/** Columna de título y descripción. */
export const productsHeaderTextVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Título con su contador al lado. */
export const productsHeaderTitleRowVariants = cva([
    "flex flex-wrap items-center",
    SPACING_SEMANTIC.inline,
]);


/**
 * Título de la pantalla.
 *
 * `h3` de la rampa y no `h1`: el nivel semántico lo pone la etiqueta, el
 * tamaño lo pone el rol visual, y 36px de `text-h1` convertirían el encabezado
 * de un panel en una portada.
 */
export const productsHeaderTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.h3,
]);


/** Cifras del contador — el resto lo pone `StatusBadge`. */
export const productsHeaderCountVariants = cva(["tabular-nums"]);


/** Descripción bajo el título. */
export const productsHeaderDescriptionVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);

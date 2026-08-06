import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de ProductFormHeader
 *
 * Mismo ritmo que el encabezado de la lista —`gap-1` entre título y bajada—
 * para que las dos pantallas de productos se lean como la misma familia. Lo
 * que cambia es la flecha: aquí hay de dónde volver.
 */


/** Fila del encabezado: flecha a la izquierda, textos a la derecha. */
export const productFormHeaderVariants = cva([
    "flex items-center",
    SPACING_CLASS.gap.md,
]);


/**
 * Flecha de regreso.
 *
 * Se pinta con el `cva` de GenericButton en vez de duplicar sus clases, pero
 * se monta sobre un `<Link>`: un botón que navega no se puede abrir en otra
 * pestaña, no anuncia destino al lector de pantalla y rompe el gesto de volver
 * del navegador. El estilo es de botón; la semántica, de enlace.
 *
 * `mt-0.5` (2px) alinea el centro óptico del icono con la primera línea del
 * título: la caja del control mide 40px y la banda de mayúsculas del `h3`
 * empieza más abajo que el borde de la caja.
 */
export const productFormBackVariants = cva([
    genericButtonVariants({ variant: "ghost", size: "md", iconOnly: true }),
    "mt-0.5 shrink-0 text-neutral-600 hover:text-neutral-800",
]);


/** Columna de título y bajada. */
export const productFormHeaderTextVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.xs,
]);


/**
 * Título de la pantalla.
 *
 * `h3` como en la lista: el nivel semántico lo pone la etiqueta `<h1>`, el
 * tamaño lo pone el rol visual, y un panel de trabajo no lleva portada.
 */
export const productFormTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.h3,
]);


/** Bajada: qué se va a hacer aquí y en cuántos pasos. */
export const productFormSubtitleVariants = cva([
    "max-w-prose text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);

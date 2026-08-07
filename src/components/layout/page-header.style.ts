import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import { SPACING_CLASS, SPACING_SEMANTIC, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de PageHeader
 *
 * El encabezado de cualquier pantalla del panel: flecha de regreso opcional,
 * título, insignia de contexto y bajada. Antes vivía dentro del formulario de
 * producto; se subió aquí cuando la segunda pantalla necesitó exactamente lo
 * mismo, que es la señal de que había dejado de ser una pieza de esa pantalla.
 *
 * El ritmo es `gap-1` entre título y bajada —forman un bloque— y `gap-3` entre
 * la flecha y los textos: la flecha es otra cosa, y pegarla al título la
 * convertiría en parte de él.
 */


/** Fila del encabezado: flecha y textos a la izquierda, acciones a la derecha. */
export const pageHeaderVariants = cva([
    "flex flex-wrap items-start justify-between",
    "gap-x-4 gap-y-3",
]);


/** Bloque de la izquierda: flecha + columna de textos. */
export const pageHeaderLeadVariants = cva([
    "flex min-w-0 items-start",
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
export const pageHeaderBackVariants = cva([
    genericButtonVariants({ variant: "ghost", size: "md", iconOnly: true }),
    "mt-0.5 shrink-0 text-neutral-600 hover:text-neutral-800",
]);


/** Columna de título y bajada. */
export const pageHeaderTextVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Título con su insignia al lado. */
export const pageHeaderTitleRowVariants = cva([
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
export const pageHeaderTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.h3,
]);


/** Bajada: qué se hace en esta pantalla. */
export const pageHeaderSubtitleVariants = cva([
    "max-w-prose text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);


/** Acciones del encabezado. Nunca se encogen: son el destino de la pantalla. */
export const pageHeaderActionsVariants = cva([
    "flex shrink-0 items-center",
    SPACING_CLASS.gap.md,
]);

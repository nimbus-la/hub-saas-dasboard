import { cva } from "class-variance-authority";

import {
    FOCUS_RING,
    RADIUS_FULL_CLASS,
    RADIUS_SEMANTIC,
    SIDEBAR,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de SidebarGroup
 *
 * Cabecera de sección plegable. El chevron está siempre visible —no solo en
 * hover— para que la capacidad de plegar sea descubrible; el hover solo la
 * refuerza con contraste y un desplazamiento sutil del texto.
 *
 * El relleno lateral es el mismo `SIDEBAR.paddingX` que usan los items: el
 * título de sección tiene que arrancar en la misma vertical que sus etiquetas.
 */


/** Cabecera plegable. */
export const sidebarGroupHeaderVariants = cva([
    "group relative flex w-full cursor-pointer items-center",
    SIDEBAR.paddingXClass,
    SPACING_CLASS.paddingY.xs,
    RADIUS_SEMANTIC.control,
    FOCUS_RING.default,
]);


/**
 * Flecha.
 *
 * Fuera del flujo: en reposo no reserva espacio, así el título arranca
 * alineado con las etiquetas de segundo nivel.
 */
export const sidebarGroupChevronWrapperVariants = cva([
    "absolute left-3 flex items-center",
]);


/**
 * El glifo.
 *
 * La lista de la transición nombra `rotate` además de `transform`: en Tailwind
 * v4 `rotate-90` escribe la propiedad `rotate`, así que sin ella el giro sería
 * instantáneo. Ver la trampa 4 de `docs/tailwind.md`.
 */
export const sidebarGroupChevronVariants = cva(
    [
        "text-neutral-400 group-hover:text-neutral-800",
        "transition-[transform,rotate,color] duration-200 ease-out",
        "motion-reduce:transition-none",
    ],
    {
        variants: {
            open: {
                true: "rotate-90",
                false: "rotate-0",
            },
        },
        defaultVariants: { open: false },
    }
);


/** Título de sección — es justo para lo que existe `overline`. */
export const sidebarGroupLabelVariants = cva([
    "truncate text-neutral-500 group-hover:text-neutral-800",
    TYPOGRAPHY.overline,
]);


/** Separador que sustituye al título en modo riel. */
export const sidebarGroupRailSeparatorVariants = cva([
    "mx-auto mb-3 h-px w-8 bg-neutral-300",
    RADIUS_FULL_CLASS,
]);


/** Lista de items de la sección. */
export const sidebarGroupListVariants = cva([SPACING_CLASS.stack.xs]);

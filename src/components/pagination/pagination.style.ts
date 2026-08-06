import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    FOCUS_RING,
    FONT_WEIGHT_CLASS,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de Pagination 
 * 
 * Todo el pie va en el escalón `sm` del sistema: la paginación es un
 * utensilio, no contenido. Ocupa el pie del panel y no debe competir con las
 * tarjetas que hay encima. Se compensa el tamaño reducido dejando 4px de
 * aire entre casillas y usando `FOCUS_RING.offset`, el contorno desplazado
 * que no se pierde sobre un relleno sólido.
 *
 * El componente no expone `size`: el escalón es una decisión del pie, no de
 * quien lo coloca. Si algún día hace falta, la receta ya está indexada por
 * tamaño y basta con abrir el eje.
 */


/** La receta que gobierna el pie entero. */
const CONTROL = CONTROL_SIZE.sm;


/** Raíz. */
export const paginationVariants = cva([
    "flex w-full min-w-0 flex-col",
    SPACING_CLASS.gap.lg,
    "md:flex-row md:items-center md:justify-between",
]);


/**
 * Resumen del rango visible ("Mostrando 1–12 de 22 productos").
 *
 * Es prosa, no etiqueta de control: va en la rampa de cuerpo.
 */
export const paginationSummaryVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyXs,
]);


/**
 * Las cifras dentro del resumen.
 *
 * El semibold es el caso puntual para el que existe `FONT_WEIGHT_CLASS`: son
 * el dato que se busca al mirar el pie, y sin peso propio se pierden dentro
 * de la frase.
 */
export const paginationSummaryValueVariants = cva([
    "tabular-nums text-neutral-800",
    FONT_WEIGHT_CLASS.semibold,
]);


/**
 * Bloque de controles.
 *
 * `gap-x-6` (24px) separa dos grupos distintos —el tamaño de página y las
 * casillas—; `gap-y-3` (12px) es el aire de cuando se apilan al envolver.
 * Van literales porque `SPACING_CLASS` no tiene eje por dirección, y
 * componerlas con una plantilla las dejaría fuera del escaneo de Tailwind.
 */
export const paginationControlsVariants = cva([
    "flex flex-wrap items-center justify-between",
    "gap-x-6 gap-y-3",
]);


/** Grupo del selector de tamaño de página. */
export const paginationPageSizeVariants = cva([
    "flex shrink-0 items-center",
    SPACING_SEMANTIC.inline,
]);


/** Etiqueta del selector. */
export const paginationLabelVariants = cva([
    "shrink-0 text-neutral-600",
    CONTROL.typographyClass,
]);


/**
 * Caja del selector.
 *
 * Ancho fijo: con `auto` la casilla cambia de tamaño al pasar de 8 a 24 y
 * arrastra los números de página de sitio.
 */
export const paginationSelectWrapperVariants = cva(["relative w-18"]);


/**
 * Selector nativo de tamaño de página.
 *
 * Es un campo, así que sigue la receta de control y la transición de campo.
 * El relleno derecho no sale de la escala de espaciado sino del hueco que
 * necesita el chevron: 12px de margen + 14px de icono + aire.
 */
export const paginationSelectVariants = cva([
    "w-full cursor-pointer appearance-none border border-neutral-300 bg-white",
    CONTROL.heightClass,
    CONTROL.radiusClass,
    "py-0",
    SPACING_CLASS.paddingX.md,
    "pr-8",
    "text-neutral-800",

    // 16px en móvil evita el zoom automático de iOS al enfocar; en pantallas
    // grandes baja a la escala densa del panel.
    TYPOGRAPHY.labelLg,
    "sm:text-label-sm",

    TRANSITION.input,
    "hover:border-neutral-400",
    "focus-visible:border-primary-main",
    FOCUS_RING.default,
]);


/** Chevron del selector. */
export const paginationSelectIconVariants = cva([
    "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500",
]);


/**
 * Lista de casillas.
 *
 * Envuelve en varias líneas antes que desbordar: con muchas páginas, nueve
 * controles no caben en un móvil.
 */
export const paginationListVariants = cva([
    "flex flex-wrap items-center justify-end",
    SPACING_CLASS.gap.xs,
]);


/** Base compartida por los números de página y las flechas. */
const controlBase = [
    "inline-flex shrink-0 cursor-pointer items-center justify-center",
    CONTROL.squareClass,
    CONTROL.radiusClass,
    CONTROL.typographyClass,
    "tabular-nums",
    TRANSITION.colors,
    FOCUS_RING.offset,
];


/**
 * Número de página.
 *
 * La página actual se rellena en sólido: es el único punto de color del bloque
 * y el que responde a "¿dónde estoy?" sin tener que leer el resumen.
 */
export const paginationPageVariants = cva(controlBase, {
    variants: {
        selected: {
            true: [
                "bg-primary-main text-white hover:bg-primary-dark",
                FONT_WEIGHT_CLASS.semibold,
            ],
            false: "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800",
        },
    },
    defaultVariants: { selected: false },
});


/**
 * Flecha anterior / siguiente.
 *
 * Sin borde: dibujarlo convertía dos utilidades secundarias en los elementos
 * más pesados del pie. El hover y el estado deshabilitado bastan para que se
 * lean como botones.
 *
 * En el extremo se deshabilita en lugar de ocultarse: si desapareciera, el
 * resto de los controles se desplazaría bajo el cursor.
 */
export const paginationArrowVariants = cva([
    ...controlBase,
    "text-neutral-600",
    "hover:bg-neutral-200 hover:text-neutral-800",
    "disabled:cursor-not-allowed disabled:text-neutral-400",
    "disabled:hover:bg-transparent disabled:hover:text-neutral-400",
]);


/** Puntos suspensivos entre bloques de páginas. */
export const paginationEllipsisVariants = cva([
    "inline-flex shrink-0 select-none items-center justify-center text-neutral-500",
    CONTROL.squareClass,
    CONTROL.typographyClass,
]);

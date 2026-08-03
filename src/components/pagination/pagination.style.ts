import { cva } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*  Estilos de Pagination                                                      */
/*                                                                             */
/*  Controles de 32px: la paginación es un utensilio, no contenido. Ocupa el   */
/*  pie del panel y no debe competir con las tarjetas que hay encima. Se       */
/*  compensa el tamaño reducido dejando 4px de aire entre casillas y anillos   */
/*  de foco desplazados, para que sigan siendo fáciles de acertar.             */
/* -------------------------------------------------------------------------- */

/** Base compartida por los números de página y las flechas. */
const controlBase = [
    "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center",
    "rounded-md text-xs font-medium tabular-nums",
    "transition-colors duration-150 ease-out motion-reduce:transition-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main",
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
            true: "bg-primary-main font-semibold text-white hover:bg-primary-dark",
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
export const paginationEllipsisVariants = cva(
    "inline-flex size-8 shrink-0 select-none items-center justify-center text-xs text-neutral-500"
);

/** Selector nativo de tamaño de página. */
export const paginationSelectVariants = cva([
    "h-8 w-full cursor-pointer appearance-none rounded-md border border-neutral-300 bg-white",
    "py-0 pl-2.5 pr-7 font-medium text-neutral-800",
    // 16px en móvil evita el zoom automático de iOS al enfocar; en pantallas
    // grandes baja a la escala densa del panel.
    "text-base sm:text-xs",
    "transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    "hover:border-neutral-400",
    "focus-visible:border-primary-main focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary-main/15",
]);

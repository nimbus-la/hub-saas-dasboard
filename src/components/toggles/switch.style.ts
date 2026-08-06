import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    FOCUS_RING,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos del Switch
 *
 * El control es de Base UI: un `<span>` con estado en atributos `data-*` y un
 * `<input>` oculto al lado. Los estados se pintan sobre esos atributos, que
 * hay que escribir literales —`data-[checked]:`, `data-disabled:`— porque una
 * variante no se puede componer sin salirse del escaneo de Tailwind.
 *
 * La geometría del interruptor —alto y ancho del carril, lado de la perilla,
 * el recorrido del `translate`— NO sale de `CONTROL_SIZE`, y es a propósito:
 * son cuatro medidas que solo funcionan juntas. El carril `md` mide 24px de
 * alto, el borde y el relleno se comen 4, quedan 20 para la perilla y 20 de
 * recorrido; tocar cualquiera de las cuatro sin las otras tres deja la perilla
 * descentrada o asomando. Es la misma razón por la que `p-0.5` (2px) se queda
 * fuera de la retícula: no es espaciado, es el hueco que centra la perilla.
 *
 * Lo que sí sale del sistema: radio, transiciones, anillo de foco y la
 * tipografía de la etiqueta, que es la del control de su mismo escalón.
 */


/**
 * Raíz cuando hay etiqueta.
 *
 * El texto va a la izquierda y el control a la derecha: en una lista de
 * ajustes las perillas quedan alineadas en una sola columna y el ojo recorre
 * estados, no etiquetas.
 */
export const switchVariants = cva([
    "flex items-start justify-between",
    SPACING_CLASS.gap.lg,
]);


/** Carril. Encendido = color de marca; apagado = gris neutro. */
export const switchTrackVariants = cva(
    [
        "relative inline-flex shrink-0 cursor-pointer items-center",
        RADIUS_SEMANTIC.pill,
        "border border-transparent bg-neutral-400 p-0.5",
        TRANSITION.colors,
        "hover:bg-neutral-500",
        FOCUS_RING.default,
        "data-[checked]:bg-primary-main data-[checked]:hover:bg-primary-dark",

        // Deshabilitado: gris plano en vez de translúcido, para que el carril no
        // deje ver el fondo de la fila y siga leyéndose como un control.
        "data-disabled:cursor-not-allowed data-disabled:bg-neutral-300",
        "data-disabled:hover:bg-neutral-300",
        "data-disabled:data-[checked]:bg-primary-light",
    ],
    {
        variants: {
            size: {
                sm: "h-5 w-9",
                md: "h-6 w-11",
            },
        },
        defaultVariants: { size: "md" },
    }
);


/** Perilla. Se desplaza con `translate` para no provocar reflujo. */
export const switchThumbVariants = cva(
    ["block bg-white", RADIUS_SEMANTIC.pill, TRANSITION.transform],
    {
        variants: {
            size: {
                sm: "size-4 data-[checked]:translate-x-4",
                md: "size-5 data-[checked]:translate-x-5",
            },
        },
        defaultVariants: { size: "md" },
    }
);


/** Etiqueta visible. Comparte tipografía con el control de su mismo escalón. */
export const switchLabelVariants = cva("block select-none", {
    variants: {
        size: {
            sm: CONTROL_SIZE.sm.typographyClass,
            md: CONTROL_SIZE.md.typographyClass,
        },
        disabled: {
            true: "cursor-not-allowed text-neutral-400",
            false: "cursor-pointer text-neutral-800",
        },
    },
    defaultVariants: { size: "md", disabled: false },
});


/** Aclaración bajo la etiqueta: es una ayuda, y para eso está `caption`. */
export const switchDescriptionVariants = cva(["mt-1", TYPOGRAPHY.caption], {
    variants: {
        disabled: {
            true: "text-neutral-400",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { disabled: false },
});

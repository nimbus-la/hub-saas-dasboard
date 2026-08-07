import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    RADIUS_FULL_CLASS,
    SPACING_CLASS,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de ProductFormStepper
 *
 * Es un indicador, no un control: no se pulsa, así que no toma alto de
 * `CONTROL_SIZE` ni lleva anillo de foco. Del sistema saca el lado del círculo
 * (`size-8`, el cuadrado del control `sm`), la rampa tipográfica, la
 * transición de color y la escala de espaciado.
 *
 * Los tres estados se distinguen por peso visual y no sólo por color: el paso
 * actual va relleno, los hechos en tinte suave y con palomita, y los que
 * faltan en gris. Quien no distinga el morado del gris sigue viendo cuál está
 * lleno y cuál lleva marca.
 */


/** Barra del indicador — la cabecera del panel del formulario. */
export const stepperVariants = cva([
    "border-b border-neutral-200",
    "px-4 py-4 sm:px-6",
]);


/**
 * Fila de pasos.
 *
 * `gap-2` y no más: el aire entre un paso y el siguiente lo pone la línea que
 * los une, que se estira con el espacio disponible.
 */
export const stepperListVariants = cva([
    "flex items-center",
    SPACING_CLASS.gap.sm,
    "sm:gap-3",
]);


/**
 * Cada paso.
 *
 * Todos crecen menos el último, que no tiene línea que estirar: dejarle el
 * `flex-1` le regalaría un hueco a la derecha y descentraría la fila.
 */
export const stepperItemVariants = cva(
    ["flex min-w-0 items-center", SPACING_CLASS.gap.sm, "sm:gap-3"],
    {
        variants: {
            last: {
                true: "shrink-0",
                false: "flex-1",
            },
        },
        defaultVariants: { last: false },
    }
);


/**
 * Círculo con el número del paso.
 *
 * 32px es el lado del control `sm`. No es un control —no se pulsa— pero sí una
 * superficie de ese diámetro, y a menos de 32 el número deja de leerse cómodo
 * junto a un texto de 13px.
 */
export const stepperMarkerVariants = cva(
    [
        "flex shrink-0 items-center justify-center select-none",
        CONTROL_SIZE.sm.squareClass,
        RADIUS_FULL_CLASS,
        TYPOGRAPHY.labelSm,
        "tabular-nums",
        TRANSITION.colors,
    ],
    {
        variants: {
            state: {
                /* Hecho: tinte suave — ya no compite por la atención. */
                complete: "bg-primary-lighter text-primary-dark",

                /*
                 * Actual: relleno y con halo. El anillo va al 15%, la misma
                 * opacidad con la que los campos dibujan su foco, para que la
                 * pantalla tenga un solo lenguaje de "aquí estás".
                 */
                current: "bg-primary-main text-white ring-4 ring-primary-main/15",

                /* Pendiente: gris de superficie, sin peso. */
                upcoming: "bg-neutral-200 text-neutral-600",
            },
        },
        defaultVariants: { state: "upcoming" },
    }
);


/**
 * Bloque de texto del paso.
 *
 * Por debajo de `sm` sólo se lee el paso actual: tres rótulos y tres círculos
 * no caben en 375px sin partirse, y un rótulo truncado a "Prec…" no informa de
 * nada. Los demás siguen ahí como número, que es lo que el indicador tiene que
 * comunicar en un móvil.
 */
export const stepperTextVariants = cva(["min-w-0 flex-col"], {
    variants: {
        state: {
            complete: "hidden sm:flex",
            current: "flex",
            upcoming: "hidden sm:flex",
        },
    },
    defaultVariants: { state: "upcoming" },
});


/**
 * Rótulo del paso.
 *
 * El grosor no cambia entre estados —sólo el color—: subir a semibold al
 * llegar al paso ensancha el texto y desplaza la línea que va detrás.
 */
export const stepperLabelVariants = cva(["truncate", TYPOGRAPHY.subtitleSm], {
    variants: {
        state: {
            complete: "text-neutral-700",
            current: "text-neutral-800",
            upcoming: "text-neutral-600",
        },
    },
    defaultVariants: { state: "upcoming" },
});


/**
 * Qué se pide en el paso.
 *
 * Aparece en `xl` y no antes: el panel llega a su ancho máximo cuando la
 * ventana pasa de 1280px —por debajo manda el hueco que deja el menú lateral—
 * y sólo entonces caben las tres descripciones sin cortarse.
 */
export const stepperHintVariants = cva([
    "hidden truncate text-neutral-600 xl:block",
    TYPOGRAPHY.caption,
]);


/**
 * Línea que une dos pasos.
 *
 * Se tiñe cuando el paso de su izquierda está hecho: el avance se lee de un
 * vistazo en la línea, sin contar círculos. `min-w-4` evita que se reduzca a
 * un punto cuando los rótulos ocupan la fila entera.
 */
export const stepperConnectorVariants = cva(
    ["h-px min-w-4 flex-1", TRANSITION.colors],
    {
        variants: {
            done: {
                true: "bg-primary-light",
                false: "bg-neutral-300",
            },
        },
        defaultVariants: { done: false },
    }
);

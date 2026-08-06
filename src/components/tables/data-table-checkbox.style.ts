import { cva } from "class-variance-authority";

import { CONTROL_SIZE, RADIUS_CLASS, TRANSITION } from "@/tokens";


/**
 * Estilos de DataTableCheckbox
 *
 * El input nativo va oculto —accesible y navegable con teclado— y el recuadro
 * que se ve es un `span` pintado a mano. Como el anillo de foco se dibuja sobre
 * ese hermano y no sobre el input, no puede salir de `FOCUS_RING`: la variante
 * `peer-focus-visible:` hay que escribirla delante de cada clase. Se replican
 * sus valores a mano para que el foco se vea igual que en el resto de la app.
 */


/**
 * Área de clic.
 *
 * Un cuadrado de control completo alrededor de un recuadro de 18px: el objetivo
 * táctil es el del sistema aunque lo que se vea sea mucho más pequeño.
 */
export const dataTableCheckboxVariants = cva(
    ["inline-flex items-center justify-center", CONTROL_SIZE.md.squareClass],
    {
        variants: {
            disabled: {
                true: "cursor-not-allowed",
                false: "cursor-pointer",
            },
        },
        defaultVariants: { disabled: false },
    }
);


/**
 * Recuadro visible.
 *
 * 18px es el escalón `lg` de la escala de iconos, que es lo que le corresponde
 * a un control que acompaña a un texto de 14px.
 *
 * El borde es `border` (1px). Antes decía `border-[1.5px]`, pero Tailwind v4
 * nunca generó esa clase —no hay regla para ella en el CSS servido— así que lo
 * que se ha visto siempre es 1px. Se deja escrito lo que de verdad se pinta.
 */
export const dataTableCheckboxBoxVariants = cva(
    [
        "flex size-4.5 shrink-0 items-center justify-center border",
        RADIUS_CLASS.sm,
        TRANSITION.colors,

        // Espeja `FOCUS_RING.default` — ver la nota de arriba.
        "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-main/30",
    ],
    {
        variants: {
            marked: {
                true: "border-primary-main bg-primary-main text-white",
                false: "border-neutral-400 bg-white text-transparent",
            },
            disabled: {
                true: "border-neutral-300 bg-neutral-200 opacity-60",
                false: "",
            },
        },

        // El hover solo se insinúa cuando hay algo que marcar.
        compoundVariants: [
            {
                marked: false,
                disabled: false,
                class: "peer-hover:border-primary-main",
            },
        ],

        defaultVariants: { marked: false, disabled: false },
    }
);

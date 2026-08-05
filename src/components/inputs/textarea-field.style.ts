import { cva } from "class-variance-authority";

import { CONTROL_SIZE, TRANSITION } from "@/tokens";

/* -------------------------------------------------------------------------- */
/*  Estilos del TextAreaField                                                  */
/*                                                                             */
/*  Espeja al escalón `md` de `text-field.style.ts` en radio, relleno, borde,  */
/*  colores y anillo de foco: puestos uno debajo del otro los dos campos deben */
/*  leerse como el mismo control, solo que uno crece.                          */
/*                                                                             */
/*  No expone eje `size` — el alto lo decide `rows`, no la escala.             */
/* -------------------------------------------------------------------------- */

export const textAreaVariants = cva(
    [
        "block w-full border bg-white px-4 py-2",
        CONTROL_SIZE.md.radiusClass,
        "text-neutral-800",
        "placeholder:font-normal placeholder:text-neutral-600",
        "selection:bg-primary-lighter selection:text-primary-darker",

        // 16px en móvil evita el zoom automático de iOS al enfocar; en pantalla
        // grande baja a la escala densa del panel. `leading-relaxed` sustituye
        // al interlineado corto de la etiqueta: aquí hay párrafos, no una línea
        // centrada en una caja.
        "text-label-lg md:text-label-md leading-relaxed",

        // Solo vertical: el ancho lo manda la rejilla del formulario y dejar
        // estirar en horizontal rompería la columna.
        "resize-y",

        TRANSITION.input,
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:border-neutral-300",
        "disabled:bg-neutral-100 disabled:text-neutral-600",
    ],
    {
        variants: {
            invalid: {
                false: [
                    "border-neutral-300 hover:border-neutral-400",
                    "focus-visible:border-primary-main",
                    "focus-visible:ring-2 focus-visible:ring-primary-main/15",
                ],
                true: [
                    "border-error-main hover:border-error-main",
                    "focus-visible:border-error-main",
                    "focus-visible:ring-2 focus-visible:ring-error-main/15",
                ],
            },
        },
        defaultVariants: { invalid: false },
    }
);

/** Etiqueta superior. Mismos valores que el resto de campos. */
export const textAreaLabelVariants = cva(
    "mb-1 block text-label-sm select-none",
    {
        variants: {
            disabled: {
                true: "text-neutral-400",
                false: "text-neutral-800",
            },
        },
        defaultVariants: { disabled: false },
    }
);

/** Texto de ayuda / mensaje de error. */
export const textAreaHelperVariants = cva("text-caption", {
    variants: {
        invalid: {
            true: "text-error-dark",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { invalid: false },
});

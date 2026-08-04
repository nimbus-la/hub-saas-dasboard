import { cva } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*  Estilos del TextAreaField                                                  */
/*                                                                             */
/*  Tokens de marca definidos en style.css: primary-*, neutral-*, error-*.     */
/*                                                                             */
/*  Espeja a `text-field.style.ts` en borde, radio, colores y anillo de foco:   */
/*  puestos uno debajo del otro los dos campos deben leerse como el mismo       */
/*  control, solo que uno crece.                                                */
/* -------------------------------------------------------------------------- */

export const textAreaVariants = cva(
    [
        "block w-full rounded-lg border bg-white px-3.5 py-2.5",
        "font-medium text-neutral-800",
        "placeholder:font-normal placeholder:text-neutral-600",
        "selection:bg-primary-lighter selection:text-primary-darker",
        // 16px en móvil evita el zoom automático de iOS al enfocar.
        "text-base md:text-sm",
        "leading-6",
        // Solo vertical: el ancho lo manda la rejilla del formulario y dejar
        // estirar en horizontal rompería la columna.
        "resize-y",
        "transition-[color,background-color,border-color,box-shadow]",
        "duration-150 ease-out motion-reduce:transition-none",
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
    "mb-1 block text-xs font-medium select-none",
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
export const textAreaHelperVariants = cva("text-xs", {
    variants: {
        invalid: {
            true: "text-error-dark",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { invalid: false },
});
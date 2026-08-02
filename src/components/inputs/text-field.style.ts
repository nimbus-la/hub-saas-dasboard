import { cva } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*  Estilos del TextField                                                      */
/*                                                                             */
/*  Tokens de marca definidos en style.css: primary-*, neutral-*, error-*.     */
/*                                                                             */
/*  El campo se monta sobre InputGroup, así que los estados se pintan en el    */
/*  contenedor con variantes `has-*` y bajan al <input> por selectores de      */
/*  slot. Misma mecánica que InputSelector para que ambos campos compartan     */
/*  alto, radios y colores.                                                    */
/*                                                                             */
/*  Las clases se escriben literales a propósito: Tailwind escanea el código   */
/*  fuente y no detecta nombres construidos por interpolación.                 */
/* -------------------------------------------------------------------------- */

/**
 * Campo (InputGroup): alto, borde, fondo y los cinco estados
 * — normal, hover, foco, error y deshabilitado.
 */
export const textFieldVariants = cva(
    [
        "w-full rounded-lg border bg-white",
        "transition-[color,background-color,border-color,box-shadow]",
        "duration-150 ease-out motion-reduce:transition-none",

        // ── Texto ────────────────────────────────────────────────────────
        "[&_[data-slot=input-group-control]]:h-full",
        "[&_[data-slot=input-group-control]]:bg-transparent",
        "[&_[data-slot=input-group-control]]:font-medium",
        "[&_[data-slot=input-group-control]]:text-neutral-800",
        "[&_[data-slot=input-group-control]]:placeholder:font-normal",
        "[&_[data-slot=input-group-control]]:placeholder:text-neutral-600",
        "[&_[data-slot=input-group-control]]:selection:bg-primary-lighter",
        "[&_[data-slot=input-group-control]]:selection:text-primary-darker",

        // ── Iconos ───────────────────────────────────────────────────────
        "[&_svg]:text-neutral-500",
        "hover:[&_svg]:text-neutral-600",

        // Los botones "x" y del ojo viven en botones fantasma: sin fondo
        // propio, solo el icono se oscurece al pasar por encima.
        "[&_[data-slot=input-group-addon][data-align=inline-end]]:mr-0",
        "[&_[data-slot=input-group-button]]:hover:bg-transparent",
        "[&_[data-slot=input-group-button]:hover_svg]:text-neutral-800",

        // ── Deshabilitado ────────────────────────────────────────────────
        // InputGroup baja la opacidad del grupo entero; aquí se sustituye por
        // colores planos para que el texto no quede translúcido sobre el gris.
        "has-disabled:cursor-not-allowed has-disabled:border-neutral-300",
        "has-disabled:bg-neutral-100",
        "has-disabled:hover:border-neutral-300",
        "has-disabled:[&_[data-slot=input-group-control]]:text-neutral-600",
        "has-disabled:[&_[data-slot=input-group-control]]:placeholder:text-neutral-600",
        "has-disabled:[&_svg]:text-neutral-400",
        "has-disabled:hover:[&_svg]:text-neutral-400",
    ],
    {
        variants: {
            size: {
                sm: [
                    "h-9",
                    "[&_[data-slot=input-group-control]]:pl-3",
                    "[&_[data-slot=input-group-control]]:pr-3",
                    // 16px en móvil evita el zoom automático de iOS al enfocar;
                    // a partir de `md` baja a la escala densa del panel.
                    "[&_[data-slot=input-group-control]]:text-base",
                    "md:[&_[data-slot=input-group-control]]:text-sm",
                    "[&_svg]:size-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-3",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                md: [
                    "h-10",
                    "[&_[data-slot=input-group-control]]:pl-3.5",
                    "[&_[data-slot=input-group-control]]:pr-3.5",
                    "[&_[data-slot=input-group-control]]:text-base",
                    "md:[&_[data-slot=input-group-control]]:text-sm",
                    "[&_svg]:size-4.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-3.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2.5",
                ],
                lg: [
                    "h-12",
                    "[&_[data-slot=input-group-control]]:pl-4",
                    "[&_[data-slot=input-group-control]]:pr-4",
                    "[&_[data-slot=input-group-control]]:text-base",
                    "[&_svg]:size-5",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3.5",
                ],
            },

            /**
             * Color del borde y del anillo de foco.
             *
             * El anillo es el único adorno del campo y aparece solo con el
             * foco: 2px al 15% de opacidad, un contorno pegado al borde en vez
             * de un halo difuso.
             */
            tone: {
                /* Normal → hover → foco. */
                default: [
                    "border-neutral-300 hover:border-neutral-400",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/15",
                ],
                /*
                 * Error: borde rojo permanente, sin anillo hasta que hay foco.
                 * InputGroup pinta un anillo fijo con `aria-invalid`, así que se
                 * anula y se vuelve a encender con el foco. La regla de foco
                 * apila los dos `has-*` para ganar en especificidad sin depender
                 * del orden del stylesheet.
                 */
                invalid: [
                    "border-error-main hover:border-error-main",
                    "has-[[data-slot][aria-invalid=true]]:border-error-main",
                    "has-[[data-slot][aria-invalid=true]]:ring-0",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:has-[[data-slot][aria-invalid=true]]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:has-[[data-slot][aria-invalid=true]]:ring-error-main/15",
                ],
                /*
                 * Solo lectura: fondo gris claro y borde inerte al hover, pero
                 * sigue siendo enfocable — de ahí el anillo neutro, que lo
                 * distingue del deshabilitado sin insinuar que se puede editar.
                 */
                readOnly: [
                    "bg-neutral-100 border-neutral-300 hover:border-neutral-300",
                    "[&_[data-slot=input-group-control]]:cursor-default",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-neutral-400",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-neutral-400/20",
                ],
            },
        },
        defaultVariants: { size: "md", tone: "default" },
    }
);

/**
 * Etiqueta superior.
 *
 * Va un escalón por debajo del texto del campo y pegada a él: la etiqueta
 * pertenece al control, no al bloque anterior. Comparte tamaño y separación
 * con el texto de ayuda, de modo que ambos enmarcan el campo por igual.
 */
export const textFieldLabelVariants = cva(
    "block font-medium select-none",
    {
        variants: {
            size: {
                sm: "mb-1 text-xs",
                md: "mb-1 text-xs",
                lg: "mb-1.5 text-sm",
            },
            disabled: {
                true: "text-neutral-400",
                false: "text-neutral-800",
            },
        },
        defaultVariants: { size: "md", disabled: false },
    }
);

/**
 * Fila inferior: texto de ayuda a la izquierda y contador a la derecha.
 * Se reserva el alto aunque solo haya contador, para que el campo no salte
 * al aparecer un mensaje de error.
 */
export const textFieldFooterVariants = cva(
    "flex items-start justify-between gap-4",
    {
        variants: {
            size: {
                sm: "mt-1",
                md: "mt-1",
                lg: "mt-1.5",
            },
        },
        defaultVariants: { size: "md" },
    }
);

/** Texto de ayuda / mensaje de error. */
export const textFieldHelperVariants = cva("", {
    variants: {
        size: {
            sm: "text-xs",
            md: "text-xs",
            lg: "text-sm",
        },
        invalid: {
            true: "text-error-dark",
            false: "text-neutral-600",
        },
        disabled: {
            true: "text-neutral-400",
            false: "",
        },
    },
    defaultVariants: { size: "md", invalid: false, disabled: false },
});

/**
 * Contador de caracteres. Cifras tabulares para que el ancho no baile
 * mientras se escribe.
 */
export const textFieldCountVariants = cva(
    "shrink-0 tabular-nums select-none",
    {
        variants: {
            size: {
                sm: "text-xs",
                md: "text-xs",
                lg: "text-sm",
            },
            invalid: {
                true: "text-error-dark",
                false: "text-neutral-600",
            },
            disabled: {
                true: "text-neutral-400",
                false: "",
            },
        },
        defaultVariants: { size: "md", invalid: false, disabled: false },
    }
);

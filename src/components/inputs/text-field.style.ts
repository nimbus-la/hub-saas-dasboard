import { cva } from "class-variance-authority";

import { CONTROL_SIZE, TRANSITION } from "@/tokens";


/**
 * Estilos del TextField
 * 
 * El campo se monta sobre InputGroup, así que los estados se pintan en el
 * contenedor con variantes `has-*` y bajan al <input> por selectores de
 * slot. Misma mecánica que InputSelector para que ambos campos compartan
 * alto, radios y colores.
 * 
 * Sobre los tokens: alto y radio se leen directos de `CONTROL_SIZE`, pero
 * el relleno, la tipografía y el tamaño del icono viven dentro de un slot y
 * hay que escribirlos con su variante delante. Esa clase compuesta no se
 * puede armar por interpolación —Tailwind escanea el código fuente y no la
 * vería—, así que va literal, con el mismo escalón que marca la receta:
 * `px-4` es el `paddingXClass` de `CONTROL_SIZE.md` y `text-label-md` su
 * `typographyClass`. Si la receta cambia, hay que bajar aquí a la vez.
 */


/**
 * Campo (InputGroup): alto, borde, fondo y los cinco estados
 * — normal, hover, foco, error y deshabilitado.
 */
export const textFieldVariants = cva(
    [
        "w-full border bg-white",
        TRANSITION.input,

        // ── Texto ────────────────────────────────────────────────────────
        // El grosor lo trae la etiqueta tipográfica (500); aquí solo se
        // devuelve el placeholder a regular para que no compita con el valor.
        "[&_[data-slot=input-group-control]]:h-full",
        "[&_[data-slot=input-group-control]]:bg-transparent",
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
            /*
             * Cada escalón es el mismo de `CONTROL_SIZE`, así que un campo y un
             * botón del mismo tamaño puestos en la misma fila cuadran al píxel.
             *
             * El texto sube a 16px por debajo de `md`: es el mínimo con el que
             * iOS no hace zoom automático al enfocar. A partir de ahí baja a la
             * escala densa del panel.
             */
            size: {
                sm: [
                    CONTROL_SIZE.sm.heightClass,
                    CONTROL_SIZE.sm.radiusClass,
                    "[&_[data-slot=input-group-control]]:px-3",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "md:[&_[data-slot=input-group-control]]:text-label-sm",
                    "[&_svg]:size-3.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-3",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                md: [
                    CONTROL_SIZE.md.heightClass,
                    CONTROL_SIZE.md.radiusClass,
                    "[&_[data-slot=input-group-control]]:px-4",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "md:[&_[data-slot=input-group-control]]:text-label-md",
                    "[&_svg]:size-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                lg: [
                    CONTROL_SIZE.lg.heightClass,
                    CONTROL_SIZE.lg.radiusClass,
                    "[&_[data-slot=input-group-control]]:px-4",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "[&_svg]:size-4.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3",
                ],
                xl: [
                    CONTROL_SIZE.xl.heightClass,
                    CONTROL_SIZE.xl.radiusClass,
                    "[&_[data-slot=input-group-control]]:px-6",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "[&_svg]:size-5",
                    "[&_[data-slot=input-group-addon][data-align=inline-start]]:pl-6",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3",
                ],
            },

            /**
             * Color del borde y del anillo de foco.
             *
             * El anillo es el único adorno del campo y aparece solo con el
             * foco: 2px al 15% de opacidad, un contorno pegado al borde en vez
             * de un halo difuso. No usa `FOCUS_RING` porque no lo dispara el
             * propio elemento sino el `has-*` del contenedor.
             */
            tone: {
                /* Normal → hover → foco. */
                default: [
                    "border-neutral-300 hover:border-neutral-400",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/15",
                ],
                /* Error: borde rojo permanente, anillo solo con el foco. */
                invalid: [
                    "border-error-main hover:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-error-main/15",
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
    "block select-none",
    {
        variants: {
            size: {
                sm: "mb-1 text-label-sm",
                md: "mb-1 text-label-sm",
                lg: "mb-2 text-label-md",
                xl: "mb-2 text-label-md",
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
                lg: "mt-2",
                xl: "mt-2",
            },
        },
        defaultVariants: { size: "md" },
    }
);

/** Texto de ayuda / mensaje de error. */
export const textFieldHelperVariants = cva("text-caption", {
    variants: {
        invalid: {
            true: "text-error-dark",
            false: "text-neutral-600",
        },
        disabled: {
            true: "text-neutral-400",
            false: "",
        },
    },
    defaultVariants: { invalid: false, disabled: false },
});

/**
 * Contador de caracteres. Cifras tabulares para que el ancho no baile
 * mientras se escribe.
 */
export const textFieldCountVariants = cva(
    "shrink-0 text-caption tabular-nums select-none",
    {
        variants: {
            invalid: {
                true: "text-error-dark",
                false: "text-neutral-600",
            },
            disabled: {
                true: "text-neutral-400",
                false: "",
            },
        },
        defaultVariants: { invalid: false, disabled: false },
    }
);

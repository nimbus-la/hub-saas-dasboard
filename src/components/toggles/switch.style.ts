import { cva } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*  Estilos del Switch                                                         */
/*                                                                             */
/*  Tokens de marca definidos en style.css: primary-*, neutral-*.              */
/*                                                                             */
/*  El control es de Base UI: un <span> con estado en atributos `data-*` y un  */
/*  <input> oculto al lado. Los estados se pintan sobre esos atributos.        */
/* -------------------------------------------------------------------------- */

/** Carril del interruptor. Encendido = color de marca; apagado = gris neutro. */
export const switchTrackVariants = cva(
    [
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
        "border border-transparent bg-neutral-400 p-0.5",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-neutral-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/25",
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
    [
        "block rounded-full bg-white",
        "transition-transform duration-150 ease-out motion-reduce:transition-none",
    ],
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

/** Etiqueta visible del interruptor. */
export const switchLabelVariants = cva("block font-medium select-none", {
    variants: {
        size: {
            sm: "text-xs",
            md: "text-sm",
        },
        disabled: {
            true: "cursor-not-allowed text-neutral-400",
            false: "cursor-pointer text-neutral-800",
        },
    },
    defaultVariants: { size: "md", disabled: false },
});
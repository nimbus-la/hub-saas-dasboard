import { cva } from "class-variance-authority";

import { CONTROL_SIZE, ELEVATION, RADIUS_CLASS, TRANSITION } from "@/tokens";


/**
 * Estilos del InputSelector
 * 
 * El control es un combobox editable: el propio campo filtra las opciones,
 * así que los estados se pintan sobre el InputGroup con variantes `has-*`.
 * 
 * Los escalones son los de `CONTROL_SIZE`, los mismos que usa TextField:
 * los dos campos tienen que alinearse al ponerlos en la misma fila de un
 * formulario. Lo que va dentro de un slot (relleno, tipografía, iconos) se
 * escribe literal con su variante delante, porque una clase compuesta por
 * interpolación no la vería el escáner de Tailwind; el escalón, eso sí, es
 * el que marca la receta — ver la nota de `text-field.style.ts`.
 */


/**
 * Campo (InputGroup): alto, borde, fondo y los cinco estados
 * — normal, hover, seleccionado (foco/abierto), error y deshabilitado.
 */
export const inputSelectorFieldVariants = cva(
    [
        "w-full border bg-white",
        TRANSITION.input,

        // ── Texto ────────────────────────────────────────────────────────
        // El grosor lo trae la etiqueta tipográfica (500); el placeholder
        // vuelve a regular para que no compita con el valor elegido.
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
        // El chevron se tiñe de marca mientras el panel está abierto.
        // Base UI marca `data-popup-open` en todos los controles del campo,
        // así que se acota al botón del chevron para no teñir también la "x".
        "[&_[data-slot=input-group-button][data-popup-open]_svg]:text-primary-main",

        // El chevron y la "x" viven en botones fantasma: sin fondo propio.
        "[&_[data-slot=input-group-addon][data-align=inline-end]]:mr-0",
        "[&_[data-slot=input-group-button]]:hover:bg-transparent",
        "[&_[data-slot=combobox-clear]]:hover:bg-transparent",
        "[&_[data-slot=combobox-clear]:hover_svg]:text-neutral-800",

        // ── Deshabilitado ────────────────────────────────────────────────
        "has-disabled:cursor-not-allowed has-disabled:border-neutral-300",
        "has-disabled:bg-neutral-200 has-disabled:opacity-100",
        "has-disabled:hover:border-neutral-300",
        "has-disabled:[&_[data-slot=input-group-control]]:text-neutral-400",
        "has-disabled:[&_[data-slot=input-group-control]]:placeholder:text-neutral-400",
        "has-disabled:[&_svg]:text-neutral-400",
        "has-disabled:hover:[&_svg]:text-neutral-400",
    ],
    {
        variants: {
            /*
             * El texto sube a 16px por debajo de `md`: es el mínimo con el que
             * iOS no hace zoom automático al enfocar el campo.
             */
            size: {
                sm: [
                    CONTROL_SIZE.sm.heightClass,
                    CONTROL_SIZE.sm.radiusClass,
                    "[&_[data-slot=input-group-control]]:pl-3",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "md:[&_[data-slot=input-group-control]]:text-label-sm",
                    "[&_svg]:size-3.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                md: [
                    CONTROL_SIZE.md.heightClass,
                    CONTROL_SIZE.md.radiusClass,
                    "[&_[data-slot=input-group-control]]:pl-4",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "md:[&_[data-slot=input-group-control]]:text-label-md",
                    "[&_svg]:size-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                lg: [
                    CONTROL_SIZE.lg.heightClass,
                    CONTROL_SIZE.lg.radiusClass,
                    "[&_[data-slot=input-group-control]]:pl-4",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "[&_svg]:size-4.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3",
                ],
                xl: [
                    CONTROL_SIZE.xl.heightClass,
                    CONTROL_SIZE.xl.radiusClass,
                    "[&_[data-slot=input-group-control]]:pl-6",
                    "[&_[data-slot=input-group-control]]:text-label-lg",
                    "[&_svg]:size-5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3",
                ],
            },
            invalid: {
                /*
                 * Normal → hover → seleccionado.
                 * El anillo es el único adorno del campo y aparece solo con el
                 * foco: 2px al 15% de opacidad, un contorno pegado al borde de
                 * marca en vez de un halo difuso. Al abrir el panel el input
                 * conserva el foco, así que el estado se mantiene mientras se
                 * elige una opción.
                 */
                false: [
                    "border-neutral-300 hover:border-neutral-400",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/15",
                ],
                /* Error: borde rojo permanente, anillo solo con el foco. */
                true: [
                    "border-error-main hover:border-error-main",
                    // El chevron acompaña al color del error, no al de marca.
                    "[&_[data-slot=input-group-button][data-popup-open]_svg]:text-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-error-main/15",
                ],
            },
        },
        defaultVariants: { size: "md", invalid: false },
    }
);

/** Addon del icono izquierdo: sólo aporta el padding inicial del campo. */
export const inputSelectorLeftIconVariants = cva("", {
    variants: {
        size: {
            sm: "pl-3",
            md: "pl-4",
            lg: "pl-4",
            xl: "pl-6",
        },
    },
    defaultVariants: { size: "md" },
});

/**
 * Etiqueta superior.
 *
 * Va un escalón por debajo del texto del campo y pegada a él: la etiqueta
 * pertenece al control, no al bloque anterior. Comparte tamaño y separación
 * con el texto de ayuda, de modo que ambos enmarcan el campo por igual.
 *
 * Los valores están sincronizados con `text-field.style.ts`: los dos campos
 * deben alinearse al ponerlos en la misma fila de un formulario.
 */
export const inputSelectorLabelVariants = cva(
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

/** Texto de ayuda / mensaje de error. Espeja a la etiqueta. */
export const inputSelectorHelperVariants = cva("text-caption", {
    variants: {
        size: {
            sm: "mt-1",
            md: "mt-1",
            lg: "mt-2",
            xl: "mt-2",
        },
        invalid: {
            true: "text-error-dark",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { size: "md", invalid: false },
});

/**
 * Panel flotante de opciones.
 *
 * `ELEVATION.lg` es el escalón que el sistema reserva para desplegables y
 * popovers; la sombra ya viene teñida con el neutro de marca, así que el panel
 * no necesita color propio.
 */
export const inputSelectorContentVariants = cva([
    "min-w-(--anchor-width) border border-neutral-200 bg-white p-0 ring-0",
    RADIUS_CLASS.lg,
    ELEVATION.lg.class,
    "motion-reduce:animate-none motion-reduce:transition-none",
]);

/**
 * Lista scrolleable. `ComboboxList` llega con `no-scrollbar`, que oculta la
 * barra; aquí se reactiva en versión fina. Los selectores se duplican (`&&`)
 * para superar en especificidad a esa utilidad sin depender del orden.
 */
export const inputSelectorListVariants = cva([
    "max-h-60 overflow-y-auto p-1 overscroll-contain",
    "[&&]:[scrollbar-width:thin]",
    "[&&]:[scrollbar-color:var(--color-neutral-300)_transparent]",
    "[&&::-webkit-scrollbar]:block [&&::-webkit-scrollbar]:w-1.5",
    "[&&::-webkit-scrollbar-track]:bg-transparent",
    "[&&::-webkit-scrollbar-thumb]:rounded-full",
    "[&&::-webkit-scrollbar-thumb]:bg-neutral-300",
]);

/**
 * Opción del panel.
 *
 * El texto va un punto por encima de la etiqueta del campo: en la lista se lee
 * en vertical y de corrido, no de un vistazo como el valor ya elegido.
 */
export const inputSelectorItemVariants = cva(
    [
        "cursor-pointer text-neutral-800",
        RADIUS_CLASS.md,
        TRANSITION.colors,

        /*
         * `selected` y `highlighted` empatan en especificidad, así que se
         * separan con variantes explícitas en vez de confiar en el orden.
         */
        "[&[data-highlighted]:not([data-selected])]:bg-neutral-100",
        "[&[data-highlighted]:not([data-selected])]:text-neutral-800",
        "[&[data-selected]]:bg-primary-lighter/60",
        "[&[data-selected]]:font-medium",
        "[&[data-selected]]:text-primary-dark",
        "[&[data-selected][data-highlighted]]:bg-primary-lighter",
        "data-disabled:cursor-not-allowed data-disabled:text-neutral-400 data-disabled:opacity-100",
    ],
    {
        variants: {
            size: {
                sm: "gap-2 px-2 py-1.5 text-body-sm",
                md: "gap-2 px-3 py-2 text-body-md",
                lg: "gap-3 px-3 py-2.5 text-body-lg",
                xl: "gap-3 px-4 py-2.5 text-body-lg",
            },
        },
        defaultVariants: { size: "md" },
    }
);

/** Mensaje de "sin resultados". */
export const inputSelectorEmptyVariants = cva(
    "text-center text-neutral-600",
    {
        variants: {
            size: {
                sm: "px-3 py-5 text-caption",
                md: "px-3 py-6 text-body-md",
                lg: "px-4 py-7 text-body-md",
                xl: "px-4 py-7 text-body-md",
            },
        },
        defaultVariants: { size: "md" },
    }
);

import { cva } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*  Estilos del InputSelector                                                  */
/*                                                                             */
/*  Tokens de marca definidos en style.css: primary-*, neutral-*, error-*.     */
/*                                                                             */
/*  El control es un combobox editable: el propio campo filtra las opciones,   */
/*  así que los estados se pintan sobre el InputGroup con variantes `has-*`.   */
/*                                                                             */
/*  Las clases se escriben literales a propósito: Tailwind escanea el código   */
/*  fuente y no detecta nombres construidos por interpolación.                 */
/* -------------------------------------------------------------------------- */

/**
 * Campo (InputGroup): alto, borde, fondo y los cinco estados
 * — normal, hover, seleccionado (foco/abierto), error y deshabilitado.
 */
export const inputSelectorFieldVariants = cva(
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
            size: {
                sm: [
                    "h-9",
                    "[&_[data-slot=input-group-control]]:pl-3",
                    "[&_[data-slot=input-group-control]]:text-sm",
                    "[&_svg]:size-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                md: [
                    "h-10",
                    "[&_[data-slot=input-group-control]]:pl-3.5",
                    "[&_[data-slot=input-group-control]]:text-sm",
                    "[&_svg]:size-4.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2.5",
                ],
                lg: [
                    "h-12",
                    "[&_[data-slot=input-group-control]]:pl-4",
                    "[&_[data-slot=input-group-control]]:text-base",
                    "[&_svg]:size-5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3.5",
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
                /*
                 * Error: borde rojo permanente, sin anillo hasta que hay foco.
                 * El InputGroup pinta un anillo fijo con `aria-invalid`, así que
                 * se anula y se vuelve a encender con el foco. La regla de foco
                 * apila los dos `has-*` para ganar en especificidad sin depender
                 * del orden del stylesheet.
                 */
                true: [
                    "border-error-main hover:border-error-main",
                    // El chevron acompaña al color del error, no al de marca.
                    "[&_[data-slot=input-group-button][data-popup-open]_svg]:text-error-main",
                    "has-[[data-slot][aria-invalid=true]]:border-error-main",
                    "has-[[data-slot][aria-invalid=true]]:ring-0",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:has-[[data-slot][aria-invalid=true]]:ring-2",
                    "has-[[data-slot=input-group-control]:focus-visible]:has-[[data-slot][aria-invalid=true]]:ring-error-main/15",
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
            md: "pl-3.5",
            lg: "pl-4",
        },
    },
    defaultVariants: { size: "md" },
});

/** Etiqueta superior. */
export const inputSelectorLabelVariants = cva(
    "block font-medium select-none",
    {
        variants: {
            size: {
                sm: "mb-1.5 text-xs",
                md: "mb-1.5 text-sm",
                lg: "mb-2 text-sm",
            },
            disabled: {
                true: "text-neutral-400",
                false: "text-neutral-800",
            },
        },
        defaultVariants: { size: "md", disabled: false },
    }
);

/** Texto de ayuda / mensaje de error. */
export const inputSelectorHelperVariants = cva("", {
    variants: {
        size: {
            sm: "mt-1 text-xs",
            md: "mt-1.5 text-xs",
            lg: "mt-1.5 text-sm",
        },
        invalid: {
            true: "text-error-dark",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { size: "md", invalid: false },
});

/** Panel flotante de opciones. */
export const inputSelectorContentVariants = cva([
    "min-w-(--anchor-width) rounded-lg border border-neutral-200 bg-white p-0",
    "shadow-lg shadow-neutral-900/8 ring-0",
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

/** Opción del panel. */
export const inputSelectorItemVariants = cva(
    [
        "cursor-pointer rounded-md text-neutral-800",
        "transition-colors duration-100 motion-reduce:transition-none",

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
                sm: "gap-2 py-1.5 pr-2.5 pl-2.5 text-sm",
                md: "gap-2 py-2 pr-3 pl-3 text-sm",
                lg: "gap-2.5 py-2.5 pr-3.5 pl-3.5 text-base",
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
                sm: "px-3 py-5 text-xs",
                md: "px-3 py-6 text-sm",
                lg: "px-4 py-7 text-sm",
            },
        },
        defaultVariants: { size: "md" },
    }
);

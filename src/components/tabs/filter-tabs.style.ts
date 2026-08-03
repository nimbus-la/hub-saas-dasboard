import { cva } from "class-variance-authority";

/* -------------------------------------------------------------------------- */
/*  Estilos de FilterTabs                                                      */
/*                                                                             */
/*  Pestañas subrayadas: la línea inferior recorre todo el grupo y la pestaña  */
/*  activa la pinta en color de marca. El subrayado vive en el propio botón    */
/*  (borde inferior de 2px) para que no haya un indicador flotante que         */
/*  desalinear.                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Pestaña individual.
 *
 * Sin márgenes negativos: el contenedor que hace scroll no debe tener nada
 * que sobresalga en vertical o el navegador añadiría una barra de scroll
 * vertical de 1px junto a las pestañas.
 */
export const filterTabVariants = cva(
    [
        "relative inline-flex shrink-0 cursor-pointer items-center gap-2",
        "border-b-2 px-1 pt-1 pb-3 whitespace-nowrap",
        "text-sm transition-colors duration-150 ease-out motion-reduce:transition-none",

        // El contorno del foco se recorta por abajo (la pestaña llega al borde
        // del contenedor con scroll), así que el fondo lo acompaña para que la
        // pestaña enfocada se distinga igual.
        "focus-visible:rounded-t-sm focus-visible:bg-neutral-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-primary-main",

        // ── Inactiva ─────────────────────────────────────────────────────
        "border-transparent font-medium text-neutral-600",
        "hover:border-neutral-300 hover:text-neutral-800",

        // ── Activa ───────────────────────────────────────────────────────
        "data-[selected=true]:border-primary-main",
        "data-[selected=true]:font-semibold data-[selected=true]:text-primary-main",
        "data-[selected=true]:hover:border-primary-main",
        "data-[selected=true]:hover:text-primary-dark",
    ]
);

/**
 * Contador de la pestaña.
 *
 * Cifras tabulares: al filtrar cambian todos los números a la vez y con
 * anchos proporcionales las pestañas bailarían de sitio.
 */
export const filterTabCountVariants = cva(
    [
        "inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5",
        "text-[11px] font-semibold tabular-nums",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
    ],
    {
        variants: {
            selected: {
                true: "bg-primary-lighter text-primary-dark",
                // neutral-700 sobre neutral-200 da 7,7:1; con el 600 se queda
                // en 4,4:1, por debajo del mínimo para un texto de 11px.
                false: "bg-neutral-200 text-neutral-700",
            },
        },
        defaultVariants: { selected: false },
    }
);

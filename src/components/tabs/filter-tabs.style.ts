import { cva } from "class-variance-authority";

import {
    BADGE_SIZE,
    CONTROL_SIZE,
    FOCUS_RING,
    RADIUS_FULL_CLASS,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de FilterTabs
 *
 * Pestañas subrayadas: la línea inferior recorre todo el grupo y la pestaña
 * activa la pinta en color de marca. El subrayado vive en el propio botón
 * (borde inferior de 2px) para que no haya un indicador flotante que
 * desalinear.
 *
 * La pestaña toma su relleno horizontal de `CONTROL_SIZE`, pero no su alto, y
 * es a propósito: una pestaña subrayada no es una caja, es texto con una línea
 * debajo. Fijarle `h-10` centraría el texto y despegaría el subrayado; el alto
 * lo pone el relleno vertical, que ya cae en la retícula de 4px (`pt-1`,
 * `pb-3`).
 *
 * El relleno horizontal sí es el del control, y hace doble trabajo: separa una
 * pestaña de la siguiente Y extiende su subrayado hasta tocar el de la vecina.
 * Por eso la lista no lleva `gap` — ver `filterTabsListVariants`.
 */


/** Contenedor: la línea divisoria que recorre el grupo entero. */
export const filterTabsVariants = cva(["w-full min-w-0 border-b border-neutral-200"]);


/**
 * Carril con scroll.
 *
 * La línea divisoria vive fuera de él; dentro solo van las pestañas, que lo
 * arrastran en horizontal cuando no caben. El tirón de 1px hace que el
 * subrayado de la pestaña activa tape la línea en lugar de apilarse encima.
 */
export const filterTabsScrollerVariants = cva([
    "-mb-px w-full min-w-0 overflow-x-auto pt-1",
]);


/**
 * Lista de pestañas.
 *
 * Sin `gap`: la separación la pone el relleno de cada pestaña. Con hueco entre
 * ellas el subrayado del hover se dibujaba como un trozo suelto flotando entre
 * dos vacíos; pegadas, los bordes inferiores se tocan y la línea se lee
 * continua de un extremo al otro del grupo.
 *
 * El único relleno que queda aquí es el que necesita el contorno del foco para
 * no recortarse contra el borde del carril.
 */
export const filterTabsListVariants = cva([
    "flex min-w-max items-end",
    SPACING_CLASS.paddingX.xs,
]);


/**
 * Pestaña individual.
 *
 * Sin márgenes negativos: el contenedor que hace scroll no debe tener nada
 * que sobresalga en vertical o el navegador añadiría una barra de scroll
 * vertical de 1px junto a las pestañas.
 */
export const filterTabVariants = cva([
    "relative inline-flex shrink-0 cursor-pointer items-center",
    SPACING_SEMANTIC.inline,

    // La separación del grupo vive aquí, no en un `gap`: es lo que hace que el
    // subrayado del hover llegue hasta el borde de la pestaña vecina. Los dos
    // escalones reproducen los 24px de móvil y los 32 de escritorio que antes
    // repartían el relleno y el hueco entre sí.
    // Simétrico en todas, incluida la primera: el contenido va centrado dentro
    // de su propio subrayado. Alinear la primera etiqueta con el borde de la
    // página la dejaba descentrada respecto a su línea, que se nota más.
    CONTROL_SIZE.sm.paddingXClass,
    "sm:px-4",

    "border-b-2 pt-1 pb-3 whitespace-nowrap",
    TYPOGRAPHY.labelMd,
    TRANSITION.colors,

    // El contorno del foco se recorta por abajo (la pestaña llega al borde
    // del contenedor con scroll), así que el fondo lo acompaña para que la
    // pestaña enfocada se distinga igual.
    "focus-visible:rounded-t-sm focus-visible:bg-neutral-100",
    FOCUS_RING.offset,

    // ── Inactiva ─────────────────────────────────────────────────────────
    "border-transparent text-neutral-600",
    "hover:border-neutral-300 hover:text-neutral-800",

    // ── Activa ───────────────────────────────────────────────────────────
    // El grosor va literal y no por `FONT_WEIGHT_CLASS`: la variante `data-*`
    // hay que escribirla delante de la clase, y eso no se puede componer sin
    // salirse del escaneo de Tailwind.
    "data-[selected=true]:border-primary-main",
    "data-[selected=true]:font-semibold data-[selected=true]:text-primary-main",
    "data-[selected=true]:hover:border-primary-main",
    "data-[selected=true]:hover:text-primary-dark",
]);


/**
 * Contador de la pestaña.
 *
 * Es una insignia, así que sale de `BADGE_SIZE.xs` —el escalón más bajo, que
 * es el que corresponde a algo que acompaña a un texto de 14px—. Solo se le
 * cambia el radio: `rounded-full` y un ancho mínimo igual al alto para que un
 * número de una cifra quede redondo y no ovalado.
 *
 * Cifras tabulares: al filtrar cambian todos los números a la vez y con
 * anchos proporcionales las pestañas bailarían de sitio.
 */
export const filterTabCountVariants = cva(
    [
        "inline-flex min-w-5 items-center justify-center",
        BADGE_SIZE.xs.heightClass,
        BADGE_SIZE.xs.paddingXClass,
        BADGE_SIZE.xs.typographyClass,
        RADIUS_FULL_CLASS,
        "tabular-nums",
        TRANSITION.colors,
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

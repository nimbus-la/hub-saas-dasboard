import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    ELEVATION,
    FOCUS_RING,
    RADIUS_SEMANTIC,
    SIDEBAR,
    SPACING_CLASS,
    TRANSITION,
    TYPOGRAPHY,
    Z_INDEX_CLASS,
} from "@/tokens";


/**
 * Estilos del Sidebar
 *
 * El armazón sale entero de `SIDEBAR` y de `Z_INDEX`: ancho desplegado y de
 * riel, alto del encabezado, relleno de la zona de navegación y las capas del
 * velo y del drawer. Son medidas que aparecen en más de un sitio —el ancho lo
 * necesita también el desplazamiento del contenido— y desincronizarlas se nota
 * al instante.
 *
 * Las variantes con prefijo (`md:w-20`, `md:translate-x-0`) van literales: una
 * variante no se puede anteponer a una clase compuesta sin salirse del escaneo
 * de Tailwind.
 */


/** Velo que cubre la página cuando el drawer está abierto. */
export const sidebarOverlayVariants = cva([
    "fixed inset-0 bg-neutral-900/50 md:hidden",
    Z_INDEX_CLASS.overlay,
]);


/**
 * Panel.
 *
 * La transición sale de `TRANSITION.transform`, que nombra `translate` además
 * de `width`. Escrita a mano como `transition-[width,transform]` el drawer
 * entraba de golpe: en Tailwind v4 `-translate-x-full` escribe la propiedad
 * `translate` y una lista que solo diga `transform` no la anima. Ver la trampa
 * 4 de `docs/tailwind.md`.
 */
export const sidebarVariants = cva(
    [
        "fixed inset-y-0 left-0 flex flex-col border-r border-neutral-200 bg-white",
        SIDEBAR.widthClass,
        Z_INDEX_CLASS.drawer,
        TRANSITION.transform,
        "md:translate-x-0",
    ],
    {
        variants: {
            collapsed: {
                true: "md:w-20",
                false: "md:w-64",
            },
            open: {
                true: "translate-x-0",
                false: "-translate-x-full",
            },
        },
        defaultVariants: { collapsed: false, open: false },
    }
);


/** Encabezado — su alto cuadra con el de la barra superior. */
export const sidebarHeaderVariants = cva(
    ["flex shrink-0 items-center border-b border-neutral-200", SIDEBAR.headerHeightClass],
    {
        variants: {
            rail: {
                true: "justify-center px-0",
                false: ["justify-between", SPACING_CLASS.paddingX.lg],
            },
        },
        defaultVariants: { rail: false },
    }
);


/** Enlace del logotipo. */
export const sidebarLogoVariants = cva([
    "flex min-w-0 items-center",
    SPACING_CLASS.gap.xs,
    RADIUS_SEMANTIC.control,
    FOCUS_RING.default,
]);


/** Palabra de marca. El tracking cerrado es de logotipo, no de la rampa. */
export const sidebarWordmarkVariants = cva([
    "truncate text-neutral-900",
    TYPOGRAPHY.subtitleMd,
    "tracking-tight",
]);


/**
 * Botones de icono del encabezado.
 *
 * Escalón `sm` (32px) y no el `md` de los de la Navbar: colapsar y cerrar son
 * acciones secundarias de una superficie que en móvil ni siquiera se ve, así
 * que no compiten por ser objetivo táctil.
 */
export const sidebarIconButtonVariants = cva([
    "flex shrink-0 cursor-pointer items-center justify-center text-neutral-600",
    CONTROL_SIZE.sm.squareClass,
    CONTROL_SIZE.sm.radiusClass,
    TRANSITION.colors,
    "hover:bg-neutral-100 hover:text-neutral-800",
    FOCUS_RING.default,
    "active:scale-95 motion-reduce:active:scale-100",
]);


/** Grupo de botones del encabezado. */
export const sidebarHeaderActionsVariants = cva([
    "flex items-center",
    SPACING_CLASS.gap.xs,
]);


/** Zona de navegación. */
export const sidebarNavVariants = cva([
    "flex-1 overflow-y-auto",
    SIDEBAR.paddingXClass,
    SPACING_CLASS.paddingY.lg,
]);


/** Pila de secciones. */
export const sidebarSectionsVariants = cva([SPACING_CLASS.stack.xl]);


/**
 * Botón de expandir en modo riel.
 *
 * Va medio fuera del borde y a la altura del logo: `top-5` no sale de la
 * escala de espaciado sino de centrarlo en el encabezado (64/2 menos la mitad
 * de sus 24px de lado).
 */
export const sidebarExpandButtonVariants = cva([
    "absolute -right-3 top-5 hidden cursor-pointer items-center justify-center md:flex",
    Z_INDEX_CLASS.sticky,
    CONTROL_SIZE.xs.squareClass,
    RADIUS_SEMANTIC.pill,
    "border border-neutral-300 bg-white text-neutral-500",
    ELEVATION.sm.class,
    TRANSITION.colors,
    "hover:bg-neutral-100 hover:text-neutral-800",
    FOCUS_RING.default,
]);

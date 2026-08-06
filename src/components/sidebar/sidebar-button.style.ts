import { cva } from "class-variance-authority";

import {
    BADGE_SIZE,
    CONTROL_SIZE,
    FOCUS_RING,
    RADIUS_FULL_CLASS,
    RADIUS_SEMANTIC,
    SIDEBAR,
    SPACING_CLASS,
    TRANSITION,
} from "@/tokens";


/**
 * Estilos de SidebarButton
 *
 * Dos niveles jerárquicos: `secondary` —item con icono— y `tertiary`, el
 * sub-item de solo texto que cuelga del riel vertical del padre.
 *
 * ── La cadena horizontal ────────────────────────────────────────────────────
 * El relleno lateral NO sale de `CONTROL_SIZE`: sale de `SIDEBAR.paddingX`
 * (12px) y es el mismo para los tres escalones a propósito. De ese 12 cuelgan
 * otras tres medidas repartidas por la familia:
 *
 *   · el riel del submenú (`ml-5.25` = 12 + 18/2) en SidebarNavItem
 *   · la sangría del título de sección en SidebarGroup
 *   · el desplazamiento del indicador de selección (`-left-3`)
 *
 * Si el relleno cambiara con el tamaño, el riel dejaría de caer bajo el icono
 * del padre. Por eso el eje `size` toca solo alto y tipografía, que es lo que
 * de verdad varía entre niveles.
 */


/** Relleno lateral compartido — el ancla de la cadena. */
const HORIZONTAL_PADDING = SIDEBAR.paddingXClass;


export const sidebarButtonVariants = cva(
    // ── Base ────────────────────────────────────────────────────────────────
    [
        "group relative flex w-full cursor-pointer select-none items-center",
        SPACING_CLASS.gap.md,
        HORIZONTAL_PADDING,
        RADIUS_SEMANTIC.control,
        TRANSITION.colors,
        FOCUS_RING.default,

        // ── hover ─────────────────────────────────────────────────────────
        "hover:bg-neutral-200 hover:text-neutral-800",

        // ── selected ──────────────────────────────────────────────────────
        "data-[selected=true]:bg-primary-main/10",
        "data-[selected=true]:text-primary-main",
        "data-[selected=true]:font-semibold",
        "data-[selected=true]:hover:bg-primary-main/15",
        "data-[selected=true]:hover:text-primary-main",

        // ── highlighted: padre colapsado con una página hija activa ───────
        "data-[highlighted=true]:text-neutral-900",
        "data-[highlighted=true]:font-semibold",

        // ── disabled ──────────────────────────────────────────────────────
        "disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400",
        "aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-neutral-400",
    ],
    {
        variants: {
            // ── Nivel jerárquico ──────────────────────────────────────────
            level: {
                secondary: "text-neutral-700",
                tertiary: "text-neutral-600",
            },

            // ── Tamaño: solo alto y tipografía, ver la nota de arriba ─────
            size: {
                sm: [CONTROL_SIZE.sm.heightClass, CONTROL_SIZE.sm.typographyClass],
                md: [CONTROL_SIZE.md.heightClass, CONTROL_SIZE.md.typographyClass],
                lg: [CONTROL_SIZE.lg.heightClass, CONTROL_SIZE.lg.typographyClass],
            },

            // ── Modo riel (sidebar colapsado en escritorio) ───────────────
            rail: {
                true: "justify-center px-0",
                false: "",
            },
        },

        defaultVariants: { level: "secondary", size: "md", rail: false },
    }
);


/**
 * Indicador de selección (barra izquierda).
 *
 * El desplazamiento negativo lo saca de la píldora: en `secondary` aterriza en
 * el borde del sidebar; en `tertiary`, justo sobre el riel que dibuja
 * SidebarNavItem (12 + 18/2 + borde + 14 → 15px a la izquierda del sub-item).
 * Son medidas de la cadena horizontal, no de la retícula.
 */
export const sidebarButtonIndicatorVariants = cva(
    [
        "pointer-events-none absolute top-1/2 -translate-y-1/2 bg-primary-main opacity-0",
        TRANSITION.opacity,
        "group-data-[selected=true]:opacity-100",
    ],
    {
        variants: {
            level: {
                secondary: "-left-3 h-5 w-[3px] rounded-r-full",
                tertiary: "-left-[15px] h-8 w-[1.4px] rounded-full",
            },
        },
        defaultVariants: { level: "secondary" },
    }
);


/** Icono del item. */
export const sidebarButtonIconVariants = cva(["shrink-0"]);


/** Etiqueta. */
export const sidebarButtonLabelVariants = cva(["truncate"]);


/** Zona derecha: insignia "Nuevo" y chevron del acordeón. */
export const sidebarButtonTrailingVariants = cva([
    "ml-auto flex shrink-0 items-center",
    SPACING_CLASS.gap.sm,
]);


/** Insignia "Nuevo" — la misma receta que cualquier otro contador del sistema. */
export const sidebarButtonBadgeVariants = cva([
    "inline-flex items-center justify-center",
    BADGE_SIZE.xs.heightClass,
    BADGE_SIZE.xs.paddingXClass,
    BADGE_SIZE.xs.typographyClass,
    RADIUS_FULL_CLASS,
    "bg-primary-main text-white",
]);


/**
 * Chevron del acordeón.
 *
 * La lista de la transición nombra `rotate` además de `transform`: en Tailwind
 * v4 `rotate-90` escribe la propiedad `rotate`, así que sin ella el giro sería
 * instantáneo. Ver la trampa 4 de `docs/tailwind.md`.
 */
export const sidebarButtonChevronVariants = cva(
    [
        "text-current opacity-60",
        "transition-[transform,rotate,opacity] duration-200 ease-out",
        "motion-reduce:transition-none",
        "group-hover:opacity-100",
    ],
    {
        variants: {
            expanded: {
                true: "rotate-90",
                false: "rotate-0",
            },
        },
        defaultVariants: { expanded: false },
    }
);

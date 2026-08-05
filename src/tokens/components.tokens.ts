import { AvatarSizeToken, BadgeSizeToken, ControlSizeToken, SurfaceSizeToken } from "@/interfaces";
import { RADIUS_CLASS } from "./radius.tokens";
import { ICON_SIZE, ICON_SIZE_CLASS } from "./icons.tokens";
import { TYPOGRAPHY } from "./typography.tokens";
import type { SizeMap } from "./scale.tokens";


/**
 * Tamaños de componente
 *
 * Aquí está la parte del design system que el CSS no puede expresar: qué token
 * usa cada componente en cada tamaño. Esto son RECETAS — combinaciones cerradas
 * de alto, relleno, separación, icono, radio y tipografía. Se eligen juntos
 * porque juntos funcionan: un botón de 40px con texto de 12px y radio de 18px
 * no está "un poco mal", está mal en tres sitios a la vez.
 *
 * Un componente con prop `size` lee su fila entera de aquí. Así un botón `md` y
 * un input `md` alineados en la misma fila comparten alto al píxel.
 *
 * Alturas: 24 · 32 · 40 · 44 · 48 · 56 — todas múltiplos de 4. No salen de la
 * escala de espaciado: son alturas de control, no ritmo de layout.
 */


/* -------------------------------------------------------------------------- */
/*  Controles: botones, inputs, selectores, pestañas                           */
/* -------------------------------------------------------------------------- */

export const CONTROL_SIZE = {
    /** 24px — densidades extremas: filtros de tabla, chips accionables. */
    xs: {
        height: 24,
        heightClass: "h-6",
        squareClass: "size-6",
        paddingXClass: "px-2",
        gapClass: "gap-1",
        iconSize: ICON_SIZE.xs,
        iconClass: ICON_SIZE_CLASS.xs,
        radiusClass: RADIUS_CLASS.sm,
        typographyClass: TYPOGRAPHY.labelXs,
    },

    /** 32px — acciones secundarias, barras de herramientas, paginación. */
    sm: {
        height: 32,
        heightClass: "h-8",
        squareClass: "size-8",
        paddingXClass: "px-3",
        gapClass: "gap-2",
        iconSize: ICON_SIZE.sm,
        iconClass: ICON_SIZE_CLASS.sm,
        radiusClass: RADIUS_CLASS.md,
        typographyClass: TYPOGRAPHY.labelSm,
    },

    /** 40px — el tamaño por defecto del panel. */
    md: {
        height: 40,
        heightClass: "h-10",
        squareClass: "size-10",
        paddingXClass: "px-4",
        gapClass: "gap-2",
        iconSize: ICON_SIZE.md,
        iconClass: ICON_SIZE_CLASS.md,
        radiusClass: RADIUS_CLASS.lg,
        typographyClass: TYPOGRAPHY.labelMd,
    },

    /** 44px — objetivo táctil cómodo; acción principal de un formulario. */
    lg: {
        height: 44,
        heightClass: "h-11",
        squareClass: "size-11",
        paddingXClass: "px-4",
        gapClass: "gap-2",
        iconSize: ICON_SIZE.lg,
        iconClass: ICON_SIZE_CLASS.lg,
        radiusClass: RADIUS_CLASS.lg,
        typographyClass: TYPOGRAPHY.labelLg,
    },

    /** 48px — campos de formularios amplios y buscadores destacados. */
    xl: {
        height: 48,
        heightClass: "h-12",
        squareClass: "size-12",
        paddingXClass: "px-6",
        gapClass: "gap-3",
        iconSize: ICON_SIZE.xl,
        iconClass: ICON_SIZE_CLASS.xl,
        radiusClass: RADIUS_CLASS.xl,
        typographyClass: TYPOGRAPHY.labelLg,
    },

    /** 56px — llamadas a la acción de página completa (onboarding, login). */
    "2xl": {
        height: 56,
        heightClass: "h-14",
        squareClass: "size-14",
        paddingXClass: "px-6",
        gapClass: "gap-3",
        iconSize: ICON_SIZE["2xl"],
        iconClass: ICON_SIZE_CLASS["2xl"],
        radiusClass: RADIUS_CLASS.xl,
        typographyClass: TYPOGRAPHY.labelXl,
    },
} as const satisfies SizeMap<ControlSizeToken>;



/* -------------------------------------------------------------------------- */
/*  Insignias y etiquetas                                                      */
/* -------------------------------------------------------------------------- */

/**
 * La insignia es una etiqueta, no un control: va siempre un par de escalones
 * por debajo del control al que acompaña para que no parezca pulsable.
 */
export const BADGE_SIZE = {
    xs: {
        heightClass: "h-5",
        paddingXClass: "px-1",
        gapClass: "gap-1",
        iconSize: ICON_SIZE.xs,
        iconClass: ICON_SIZE_CLASS.xs,
        radiusClass: RADIUS_CLASS.sm,
        typographyClass: TYPOGRAPHY.labelXs,
    },

    sm: {
        heightClass: "h-6",
        paddingXClass: "px-2",
        gapClass: "gap-1",
        iconSize: ICON_SIZE.xs,
        iconClass: ICON_SIZE_CLASS.xs,
        radiusClass: RADIUS_CLASS.sm,
        typographyClass: TYPOGRAPHY.labelSm,
    },

    md: {
        heightClass: "h-7",
        paddingXClass: "px-2",
        gapClass: "gap-1",
        iconSize: ICON_SIZE.sm,
        iconClass: ICON_SIZE_CLASS.sm,
        radiusClass: RADIUS_CLASS.md,
        typographyClass: TYPOGRAPHY.labelSm,
    },

    lg: {
        heightClass: "h-8",
        paddingXClass: "px-3",
        gapClass: "gap-2",
        iconSize: ICON_SIZE.md,
        iconClass: ICON_SIZE_CLASS.md,
        radiusClass: RADIUS_CLASS.md,
        typographyClass: TYPOGRAPHY.labelMd,
    },

    xl: {
        heightClass: "h-9",
        paddingXClass: "px-3",
        gapClass: "gap-2",
        iconSize: ICON_SIZE.md,
        iconClass: ICON_SIZE_CLASS.md,
        radiusClass: RADIUS_CLASS.lg,
        typographyClass: TYPOGRAPHY.labelMd,
    },

    "2xl": {
        heightClass: "h-10",
        paddingXClass: "px-4",
        gapClass: "gap-2",
        iconSize: ICON_SIZE.lg,
        iconClass: ICON_SIZE_CLASS.lg,
        radiusClass: RADIUS_CLASS.lg,
        typographyClass: TYPOGRAPHY.labelLg,
    },
} as const satisfies SizeMap<BadgeSizeToken>;



/* -------------------------------------------------------------------------- */
/*  Avatares y miniaturas                                                      */
/* -------------------------------------------------------------------------- */

export const AVATAR_SIZE = {
    xs: {
        size: 24,
        sizeClass: "size-6",
        typographyClass: TYPOGRAPHY.labelXs,
        radiusClass: RADIUS_CLASS.sm,
    },

    sm: {
        size: 32,
        sizeClass: "size-8",
        typographyClass: TYPOGRAPHY.labelSm,
        radiusClass: RADIUS_CLASS.sm,
    },

    md: {
        size: 40,
        sizeClass: "size-10",
        typographyClass: TYPOGRAPHY.labelMd,
        radiusClass: RADIUS_CLASS.md,
    },

    lg: {
        size: 48,
        sizeClass: "size-12",
        typographyClass: TYPOGRAPHY.labelMd,
        radiusClass: RADIUS_CLASS.md,
    },

    xl: {
        size: 64,
        sizeClass: "size-16",
        typographyClass: TYPOGRAPHY.labelLg,
        radiusClass: RADIUS_CLASS.lg,
    },

    "2xl": {
        size: 80,
        sizeClass: "size-20",
        typographyClass: TYPOGRAPHY.labelXl,
        radiusClass: RADIUS_CLASS.lg,
    },
} as const satisfies SizeMap<AvatarSizeToken>;



/* -------------------------------------------------------------------------- */
/*  Superficies: tarjetas, paneles, popovers                                   */
/* -------------------------------------------------------------------------- */

/** Relleno y separación siguen la escala de `SPACING`, escalón a escalón. */
export const SURFACE_SIZE = {
    xs: { paddingClass: "p-1", gapClass: "gap-1", radiusClass: RADIUS_CLASS.md },
    sm: { paddingClass: "p-2", gapClass: "gap-2", radiusClass: RADIUS_CLASS.md },
    md: { paddingClass: "p-3", gapClass: "gap-2", radiusClass: RADIUS_CLASS.lg },
    lg: { paddingClass: "p-4", gapClass: "gap-3", radiusClass: RADIUS_CLASS.xl },
    xl: { paddingClass: "p-6", gapClass: "gap-4", radiusClass: RADIUS_CLASS.xl },
    "2xl": { paddingClass: "p-8", gapClass: "gap-6", radiusClass: RADIUS_CLASS["2xl"] },
} as const satisfies SizeMap<SurfaceSizeToken>;



/* -------------------------------------------------------------------------- */
/*  Filas de tabla y lista                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Alto de fila. La densidad de la tabla es una decisión de producto, no de
 * estilo. El número se conserva porque lo pide cualquier virtualización.
 */
export const ROW_HEIGHT = {
    xs: 32,
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
    "2xl": 72,
} as const satisfies SizeMap<number>;


export const ROW_HEIGHT_CLASS = {
    xs: "h-8",
    sm: "h-10",
    md: "h-12",
    lg: "h-14",
    xl: "h-16",
    "2xl": "h-18",
} as const satisfies SizeMap<string>;



/** Tamaño por defecto de cada familia de componentes. */
export const COMPONENT_DEFAULT_SIZE = {
    control: "md",
    badge: "sm",
    avatar: "md",
    surface: "xl",
    row: "md",
} as const;

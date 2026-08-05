import type { SizeMap } from "./scale.tokens";


/**
 * Radios de esquina
 *
 * Los valores viven en `@theme` (`--radius-xs` … `--radius-2xl`), así que el
 * nombre del token y el de la utilidad coinciden: `RADIUS_CLASS.md` es
 * `rounded-md`. Este archivo existe por dos motivos: dar el mapa indexable por
 * `size` que consumen las recetas de `components.tokens.ts`, y nombrar el radio
 * por USO, que es como se decide en la práctica.
 *
 * Escala: 4 · 6 · 8 · 10 · 14 · 18 px.
 */

/** Utilidad de radio por escalón de la escala. */
export const RADIUS_CLASS = {
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
} as const satisfies SizeMap<string>;


/** Píldora — chips, avatares y todo lo circular. */
export const RADIUS_FULL_CLASS = "rounded-full";


/**
 * Radios con nombre de uso.
 *
 * El radio comunica jerarquía: cuanto más grande la superficie, más redondeada.
 * Un control de 32px con radio de 18px parece un chip, no un botón.
 */
export const RADIUS_SEMANTIC = {
    /** Insignias, tags y contadores. */
    badge: RADIUS_CLASS.md,
    /** Botones e inputs. */
    control: RADIUS_CLASS.lg,
    /** Tarjetas, paneles y celdas de tabla. */
    surface: RADIUS_CLASS.xl,
    /** Modales, drawers y hojas. */
    overlay: RADIUS_CLASS["2xl"],
    /** Avatares y botones circulares. */
    pill: RADIUS_FULL_CLASS,
} as const;


export type RadiusToken = keyof typeof RADIUS_CLASS;
export type RadiusSemanticToken = keyof typeof RADIUS_SEMANTIC;

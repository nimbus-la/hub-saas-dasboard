import { cva } from "class-variance-authority";

import { BadgeSizeToken } from "@/interfaces";
import { BADGE_SIZE } from "@/tokens";


/**
 * Estilos de StatusBadge
 *
 * El eje `size` no escribe medidas: las toma enteras de `BADGE_SIZE`, la
 * receta del design system. La insignia va un par de escalones por debajo del
 * control al que acompaña —una `sm` junto a un botón `md`— para que se lea
 * como etiqueta y no como algo pulsable.
 *
 * El eje `tone` sí vive aquí: es la identidad de la insignia —qué color
 * confirma, cuál avisa, cuál alarma— y no la comparte con nadie.
 */


/**
 * Aplana una receta de tamaño en las clases que necesita una insignia.
 *
 * Las clases salen literales de `components.tokens.ts`, que es lo que Tailwind
 * escanea; aquí solo se reordenan. Por eso se puede componer con una función
 * sin romper la generación de utilidades.
 */
const badgeSize = (token: BadgeSizeToken) => [
    token.heightClass,
    token.paddingXClass,
    token.gapClass,
    token.radiusClass,
    token.typographyClass,
];


export const statusBadgeVariants = cva(
    // ── Base — todo lo que no depende de tamaño ni de color ──────────────────
    // El alto lo fija la receta, así que no hay relleno vertical: centrar con
    // `items-center` es lo que mantiene la insignia alineada con el texto de
    // la fila en la que va.
    [
        "inline-flex max-w-full items-center justify-center",
        "truncate select-none",
    ],
    {
        variants: {
            // ── Tono semántico ──────────────────────────────────────────────
            tone: {
                success: "bg-success-lighter text-success-dark",
                warning: "bg-warning-lighter text-warning-dark",
                error: "bg-error-lighter text-error-dark",
                info: "bg-info-lighter text-info-dark",
                primary: "bg-primary-lighter text-primary-dark",
                neutral: "bg-neutral-200 text-neutral-700",
            },

            // ── Tamaño — alto, relleno, separación, radio y texto ────────────
            size: {
                xs: badgeSize(BADGE_SIZE.xs),
                sm: badgeSize(BADGE_SIZE.sm),
                md: badgeSize(BADGE_SIZE.md),
                lg: badgeSize(BADGE_SIZE.lg),
                xl: badgeSize(BADGE_SIZE.xl),
                "2xl": badgeSize(BADGE_SIZE["2xl"]),
            },
        },

        defaultVariants: { tone: "neutral", size: "sm" },
    }
);

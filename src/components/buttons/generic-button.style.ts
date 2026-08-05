import { cva } from "class-variance-authority";

import { ControlSizeToken } from "@/interfaces";
import { CONTROL_SIZE, FOCUS_RING, TRANSITION } from "@/tokens";


/**
 * Estilos de GenericButton
 * 
 * El eje `size` no escribe medidas: las toma enteras de `CONTROL_SIZE`, la
 * receta del design system. Así un botón `md` y un campo `md` puestos en la
 * misma fila comparten alto, radio y tipografía al píxel, y ajustar la
 * escala se hace en un sitio en vez de en cada componente.
 * 
 * El eje `variant` sí vive aquí: es la identidad del botón — qué color pesa
 * más, cuál avisa, cuál desaparece — y no la comparte con nadie.
 */


/**
 * Aplana una receta de tamaño en las clases que necesita un botón con texto.
 *
 * Las clases salen literales de `components.tokens.ts`, que es lo que Tailwind
 * escanea; aquí solo se reordenan. Por eso se puede componer con una función
 * sin romper la generación de utilidades.
 */
const controlSize = (token: ControlSizeToken) => [
    token.heightClass,
    token.paddingXClass,
    token.gapClass,
    token.radiusClass,
    token.typographyClass,
];


export const genericButtonVariants = cva(
    // ── Base — todo lo que no depende de tamaño ni de color ──────────────────
    [
        "inline-flex cursor-pointer select-none items-center justify-center",
        TRANSITION.colors,
        FOCUS_RING.default,
        "disabled:cursor-not-allowed",
    ],
    {
        variants: {
            // ── Estilo ──────────────────────────────────────────────────────
            variant: {
                primary: [
                    "bg-primary-main text-white",
                    "hover:bg-primary-dark",
                    "data-[selected=true]:bg-primary-main",
                    "disabled:bg-neutral-400 disabled:text-white",
                ],
                secondary: [
                    "bg-white text-neutral-500",
                    "hover:bg-neutral-200",
                    "data-[selected=true]:bg-primary-main/10 data-[selected=true]:text-primary-main",
                    "disabled:bg-white disabled:text-neutral-300",
                ],
                ghost: [
                    "bg-transparent text-neutral-600",
                    "hover:bg-neutral-200",

                    // ── selected ──────────────────────────────────────────────────
                    "data-[selected=true]:bg-primary-main/10",
                    "data-[selected=true]:text-primary-main",
                    "data-[selected=true]:font-semibold",

                    // ── selected + hover ──────────────────────────────────────────
                    "data-[selected=true]:hover:bg-primary-main/20",
                    "disabled:bg-white disabled:text-neutral-300",
                ],

                // Destructivo discreto: el color hace el aviso sin competir con
                // el primario. Para eliminar, archivar o cancelar de verdad.
                danger: [
                    "bg-transparent text-error-main",
                    "hover:bg-error-lighter hover:text-error-dark",
                    "disabled:bg-white disabled:text-neutral-300",
                ],
            },

            // ── Tamaño — alto, relleno, separación, radio y texto ────────────
            size: {
                xs: controlSize(CONTROL_SIZE.xs),
                sm: controlSize(CONTROL_SIZE.sm),
                md: controlSize(CONTROL_SIZE.md),
                lg: controlSize(CONTROL_SIZE.lg),
                xl: controlSize(CONTROL_SIZE.xl),
                "2xl": controlSize(CONTROL_SIZE["2xl"]),
            },

            align: {
                start: "justify-start",
                center: "justify-center",
                end: "justify-end",
            },

            // ── Modo icono solo (cuadrado) ──────────────────────────────────
            iconOnly: {
                true: "",
                false: "",
            },

            // ── Ancho completo ──────────────────────────────────────────────
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            },
        },

        // ── Combinaciones especiales (icon only → cuadrado) ─────────────────
        // El lado se fija con la clase cuadrada de la receta y se anula el
        // relleno horizontal: con el ancho ya cerrado, el `px` solo estrecharía
        // la caja hasta aplastar el icono.
        compoundVariants: [
            { iconOnly: true, size: "xs", class: [CONTROL_SIZE.xs.squareClass, "px-0"] },
            { iconOnly: true, size: "sm", class: [CONTROL_SIZE.sm.squareClass, "px-0"] },
            { iconOnly: true, size: "md", class: [CONTROL_SIZE.md.squareClass, "px-0"] },
            { iconOnly: true, size: "lg", class: [CONTROL_SIZE.lg.squareClass, "px-0"] },
            { iconOnly: true, size: "xl", class: [CONTROL_SIZE.xl.squareClass, "px-0"] },
            { iconOnly: true, size: "2xl", class: [CONTROL_SIZE["2xl"].squareClass, "px-0"] },
        ],

        defaultVariants: {
            variant: "primary",
            size: "md",
            align: "center",
            iconOnly: false,
            fullWidth: false,
        },
    }
);

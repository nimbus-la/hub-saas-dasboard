import { cva } from "class-variance-authority";

import { CONTROL_SIZE, FOCUS_RING, TRANSITION } from "@/tokens";


/**
 * Estilos de LinkButton  
 * 
 * Sólo texto: ni fondo ni borde. De la receta de tamaño toma únicamente la
 * tipografía y la separación — alto, relleno y radio pertenecen a una caja, y
 * este botón no la tiene. Compartir el eje `size` con GenericButton es lo que
 * hace que un "Ver todos" junto a un botón `sm` no se lea más grande.
 */


export const linkButtonVariants = cva(
    // ── Base ─────────────────────────────────────────────────────────────────
    [
        "group inline-flex w-fit shrink-0 cursor-pointer items-center",
        "rounded-sm bg-transparent text-primary-main",

        // El texto va un grosor por encima del que trae la etiqueta del
        // sistema: sin fondo que lo sostenga, un enlace en `medium` se pierde
        // al lado de cualquier botón sólido.
        "font-semibold",

        TRANSITION.colors,
        "hover:text-primary-dark",
        FOCUS_RING.offset,

        // ── Deshabilitado ─────────────────────────────────────────────────
        "disabled:cursor-not-allowed disabled:text-neutral-400",
    ],
    {
        variants: {
            // ── Tamaño — texto y separación con el icono ────────────────────
            size: {
                xs: [CONTROL_SIZE.xs.typographyClass, CONTROL_SIZE.xs.gapClass],
                sm: [CONTROL_SIZE.sm.typographyClass, CONTROL_SIZE.sm.gapClass],
                md: [CONTROL_SIZE.md.typographyClass, CONTROL_SIZE.md.gapClass],
                lg: [CONTROL_SIZE.lg.typographyClass, CONTROL_SIZE.lg.gapClass],
                xl: [CONTROL_SIZE.xl.typographyClass, CONTROL_SIZE.xl.gapClass],
                "2xl": [CONTROL_SIZE["2xl"].typographyClass, CONTROL_SIZE["2xl"].gapClass],
            },
        },
        defaultVariants: { size: "md" },
    }
);


/**
 * Texto del enlace.
 *
 * El subrayado se aplica sólo aquí y no en el contenedor para que la línea no
 * cruce los iconos y quede a la altura correcta de la tipografía. Se dispara
 * desde el estado del padre (`group`), no del propio span.
 */
export const linkButtonLabel = cva([
    "underline-offset-2",
    TRANSITION.colors,
    "group-hover:underline group-focus-visible:underline",
    "group-disabled:no-underline",
]);

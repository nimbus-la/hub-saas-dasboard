import { ElevationToken } from "@/interfaces";
import type { SizeMap } from "./scale.tokens";


/**
 * Elevación
 *
 * La sombra indica distancia respecto a la página: cuanto más "flotante" es
 * un elemento, más difusa y desplazada su sombra. En un panel claro basta
 * con muy poco — una tarjeta con sombra de modal parece despegada.
 *
 * Regla: las superficies estáticas (tarjetas, tablas) se separan con borde,
 * no con sombra. La sombra se reserva para lo que aparece por encima del
 * contenido: menús, popovers, drawers y modales.
 *
 * Los valores CSS están en `@theme` (`--shadow-xs` … `--shadow-2xl`), teñidos
 * con el neutro de marca. Aquí solo se registra qué escalón toca en cada caso,
 * que es la decisión que se equivoca la gente, no el número de píxeles.
 */

export const ELEVATION = {
    xs: {
        class: "shadow-xs",
        usage: "Botones y campos en reposo",
    },

    sm: {
        class: "shadow-sm",
        usage: "Tarjetas que necesitan despegarse del fondo",
    },

    md: {
        class: "shadow-md",
        usage: "Hover de tarjeta interactiva",
    },

    lg: {
        class: "shadow-lg",
        usage: "Desplegables, popovers y menús contextuales",
    },

    xl: {
        class: "shadow-xl",
        usage: "Drawers y paneles laterales",
    },

    "2xl": {
        class: "shadow-2xl",
        usage: "Modales a pantalla completa",
    },
} as const satisfies SizeMap<ElevationToken>;


/** Sin sombra — el estado de casi todo. */
export const ELEVATION_NONE = "shadow-none";


/**
 * Anillo de foco.
 *
 * Único en toda la app: mismo grosor, mismo color y mismo desplazamiento en
 * cualquier control. Es el elemento que hace navegable la interfaz con teclado
 * y no debe variar por componente.
 */
export const FOCUS_RING = {
    /** Anillo por defecto — para superficies claras. */
    default:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30",

    /** Contorno desplazado — para controles sólidos donde el anillo se pierde. */
    offset:
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main",

    /** Anillo de error. */
    invalid:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-main/30",
} as const;


export type ElevationTokenName = keyof typeof ELEVATION;

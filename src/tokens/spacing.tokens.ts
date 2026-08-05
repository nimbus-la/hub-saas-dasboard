import type { SizeMap } from "./scale.tokens";


/**
 * Espaciado
 *
 * Retícula de 4px. La escala salta 4-8-12-16-24-32: pares cercanos abajo
 * (donde se separan elementos de un mismo grupo) y saltos amplios arriba
 * (donde se separan bloques). Evitar valores fuera de la escala — si algo
 * "necesita" 18px casi siempre es que le toca 16 o 24.
 *
 * Es el único eje del sistema que NO se declara en `@theme`, y la razón vale
 * la pena recordarla: el namespace `--spacing-*` de Tailwind lo comparten
 * `p-*`, `m-*`, `gap-*`, `size-*`… y también `w-*` y `max-w-*`, que resuelven
 * contra la escala de contenedores. Nombrar ese namespace con la escala de
 * camiseta hace que `max-w-sm` deje de ser 24rem y pase a ser 8px en todo el
 * proyecto, sin aviso. Así que el valor lo sigue poniendo la escala numérica
 * de Tailwind (`p-3` = 12px) y estos mapas ponen el nombre del sistema.
 */

/** Escala de espaciado en px — para cálculos en JS. */
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
} as const satisfies SizeMap<number>;


/**
 * Utilidad de Tailwind por escalón y por eje.
 *
 * Se agrupan por eje porque es como se consumen dentro de un `cva`: se elige
 * el eje y se indexa por el `size` del componente. Van escritas literales —
 * Tailwind escanea el código fuente y no detecta clases construidas por
 * interpolación.
 */
export const SPACING_CLASS = {
    /** Separación entre hijos de un contenedor flex/grid. */
    gap: {
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
        xl: "gap-6",
        "2xl": "gap-8",
    },

    /** Relleno en los cuatro lados. */
    padding: {
        xs: "p-1",
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
        xl: "p-6",
        "2xl": "p-8",
    },

    /** Relleno horizontal. */
    paddingX: {
        xs: "px-1",
        sm: "px-2",
        md: "px-3",
        lg: "px-4",
        xl: "px-6",
        "2xl": "px-8",
    },

    /** Relleno vertical. */
    paddingY: {
        xs: "py-1",
        sm: "py-2",
        md: "py-3",
        lg: "py-4",
        xl: "py-6",
        "2xl": "py-8",
    },

    /** Separación vertical entre hermanos (pilas). */
    stack: {
        xs: "space-y-1",
        sm: "space-y-2",
        md: "space-y-3",
        lg: "space-y-4",
        xl: "space-y-6",
        "2xl": "space-y-8",
    },
} as const satisfies Record<string, SizeMap<string>>;


/**
 * Espaciados con nombre de uso.
 *
 * Atajos para las decisiones que se repiten en cada pantalla. Si dos sitios
 * distintos usan el mismo escalón por motivos distintos, conviene que cada uno
 * entre por su alias: el día que uno cambie, el otro no se arrastra.
 */
export const SPACING_SEMANTIC = {
    /** Aire entre un icono y su texto dentro de un control. */
    inline: "gap-2",
    /** Aire entre campos consecutivos de un formulario. */
    field: "space-y-4",
    /** Relleno interior de tarjetas y paneles. */
    card: "p-6",
    /** Separación entre secciones de una página. */
    section: "gap-8",
} as const;


export type SpacingToken = keyof typeof SPACING;
export type SpacingAxis = keyof typeof SPACING_CLASS;

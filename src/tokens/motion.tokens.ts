/**
 * Movimiento
 * 
 * Duraciones cortas: en un panel de trabajo la animación confirma que algo
 * pasó, no cuenta una historia. Por encima de 300ms la interfaz se siente
 * lenta aunque responda igual de rápido.
 * 
 * Todo lo que se mueva debe respetar `prefers-reduced-motion`; de ahí que
 * las clases compuestas de abajo incluyan `motion-reduce:transition-none`.
 *
 * Este es el único bloque que sí vive en los dos lados, y con motivo:
 * framer-motion necesita la duración como número y la curva como string de
 * cubic-bezier, cosas que no se pueden sacar de una clase de Tailwind. En CSS
 * solo se declara `--ease-emphasized`, que es la curva que Tailwind no trae.
 */


/** Duraciones en milisegundos. */
export const DURATION = {
    /** Cambios de color: hover, focus, estados. */
    instant: 100,
    /** Valor por defecto. */
    fast: 150,
    /** Desplegar, plegar, deslizar. */
    normal: 200,
    /** Entradas de panel y drawers. */
    slow: 300,
    /** Transiciones de página. */
    slower: 500,
} as const;

export const DURATION_CLASS = {
    instant: "duration-100",
    fast: "duration-150",
    normal: "duration-200",
    slow: "duration-300",
    slower: "duration-500",
} as const;



/** Curvas de aceleración. */
export const EASING = {
    /** Salidas de pantalla: arranca rápido y frena. */
    out: "cubic-bezier(0, 0, 0.2, 1)",
    /** Entradas: arranca lento. */
    in: "cubic-bezier(0.4, 0, 1, 1)",
    /** Movimiento de un punto a otro dentro de la pantalla. */
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    /** Rebote sutil para confirmaciones. */
    emphasized: "cubic-bezier(0.2, 0, 0, 1.2)",
} as const;

export const EASING_CLASS = {
    out: "ease-out",
    in: "ease-in",
    inOut: "ease-in-out",
    /* Declarada en `@theme` como `--ease-emphasized`. */
    emphasized: "ease-emphasized",
} as const;



/**
 * Transiciones ya compuestas, listas para pegar en un `cva`.
 *
 * Se limita la propiedad animada a propósito: `transition-all` obliga al
 * navegador a vigilar todo el estilo del elemento y arrastra propiedades que
 * no se querían animar.
 */
export const TRANSITION = {
    /** Hover y foco de cualquier control. */
    colors:
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
    /** Campos: color, fondo, borde y anillo a la vez. */
    input:
        "transition-[color,background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    /** Aparición y desaparición. */
    opacity:
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
    /**
     * Desplazamientos y cambios de tamaño (sidebar colapsando, perilla de un
     * interruptor).
     *
     * La lista nombra `translate`, `scale` y `rotate` además de `transform`, y
     * hace falta: Tailwind v4 dejó de meter esas tres en la propiedad
     * `transform` y cada una escribe la suya. Una lista que solo diga
     * `transform` deja `translate-x-*` sin animar —el elemento salta— y no hay
     * forma de notarlo sin medir `getComputedStyle`, porque la clase se aplica
     * y el elemento acaba donde debe.
     */
    transform:
        "transition-[width,transform,translate,scale,rotate] duration-200 ease-out motion-reduce:transition-none",
    /** Sombra al elevar una tarjeta. */
    elevation:
        "transition-shadow duration-200 ease-out motion-reduce:transition-none",
} as const;


export type DurationToken = keyof typeof DURATION;
export type EasingToken = keyof typeof EASING;
export type TransitionToken = keyof typeof TRANSITION;

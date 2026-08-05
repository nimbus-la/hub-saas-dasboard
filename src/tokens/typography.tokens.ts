/**
 * Tipografía
 *
 * Familia: Plus Jakarta Sans, cargada en app/layout.tsx y expuesta como
 * `--font-sans` en style.css.
 *
 * Los VALORES (tamaño, interlineado, grosor, tracking) viven en el bloque
 * `@theme` de `style.css`, que es lo único que los necesita: Tailwind genera
 * una utilidad por estilo — `text-body-md`, `text-h3`, `text-label-sm` — que
 * aplica las cuatro propiedades de golpe. Este archivo solo pone NOMBRE a esas
 * utilidades, para que un componente pida `TYPOGRAPHY.h3` y no una clase suelta
 * escrita a mano.
 *
 * La rampa se organiza por ROL, no por tamaño suelto: cada estilo fija tamaño,
 * interlineado, grosor y tracking a la vez porque son inseparables — elegirlos
 * por separado es de donde salen los textos que "no terminan de cuadrar".
 *
 * ¿Necesitas el número (Chart.js, canvas)? `readCssVariable("--text-body-md")`
 * de `lib/theme.ts`, igual que se hace con los colores.
 */


/* ── Grosores ──────────────────────────────────────────────────────────────── */

/**
 * Cada estilo de la rampa ya trae su grosor. Este mapa es solo para las
 * excepciones — una celda de tabla que se pone en semibold al destacarse.
 * Fuera de estos cuatro no se sale.
 */
export const FONT_WEIGHT_CLASS = {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
} as const;


/* ── Rampa tipográfica ─────────────────────────────────────────────────────── */

/**
 * Rampa completa. Cada entrada es la utilidad que hay que poner en el JSX.
 *
 * - display* → portadas, cifras protagonistas, estados vacíos grandes.
 * - h1…h6    → jerarquía de contenido dentro de una página.
 * - subtitle*→ texto de apoyo de un título o cabecera de tarjeta.
 * - body*    → párrafos y celdas de tabla.
 * - label*   → texto dentro de controles (botones, inputs, pestañas).
 * - caption  → notas al pie, ayudas, metadatos.
 * - overline → rótulo de sección en mayúsculas (grupos del sidebar).
 * - code     → identificadores, SKU, valores monoespaciados.
 */
export const TYPOGRAPHY = {
    displayLg: "text-display-lg",
    displayMd: "text-display-md",
    displaySm: "text-display-sm",

    h1: "text-h1",
    h2: "text-h2",
    h3: "text-h3",
    h4: "text-h4",
    h5: "text-h5",
    h6: "text-h6",

    subtitleLg: "text-subtitle-lg",
    subtitleMd: "text-subtitle-md",
    subtitleSm: "text-subtitle-sm",

    bodyLg: "text-body-lg",
    bodyMd: "text-body-md",
    bodySm: "text-body-sm",
    bodyXs: "text-body-xs",

    labelXl: "text-label-xl",
    labelLg: "text-label-lg",
    labelMd: "text-label-md",
    labelSm: "text-label-sm",
    labelXs: "text-label-xs",

    caption: "text-caption",

    /* La caja tipográfica no puede llevar `text-transform`, así que el
       uppercase viaja en la clase. */
    overline: "text-overline uppercase",

    /* El tamaño lo pone el token; la familia monoespaciada, `font-mono`. */
    code: "font-mono text-code",
} as const;


export type TypographyTokenName = keyof typeof TYPOGRAPHY;
export type FontWeightToken = keyof typeof FONT_WEIGHT_CLASS;


/**
 * Estilo tipográfico por defecto de la interfaz: el que se asume cuando un
 * texto no declara nada.
 */
export const TYPOGRAPHY_DEFAULT: TypographyTokenName = "bodyMd";

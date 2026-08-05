/**
 * Recetas de tamaño
 *
 * Cada receta guarda CLASES, no medidas: los valores viven en `@theme`
 * (`--spacing-*`, `--radius-*`, `--text-*`) y Tailwind ya genera la utilidad.
 * Solo se conservan números donde JavaScript los necesita de verdad, y cada
 * uno lleva escrito para qué.
 */


/** Receta completa de un control interactivo (botón, input, selector…). */
export interface ControlSizeToken {
    /**
     * Alto total en px. Único número del control: lo piden los cálculos de
     * anclaje (popovers, menús) y la virtualización de listas.
     */
    height: number;

    /** Clase de alto. */
    heightClass: string;

    /** Clase cuadrada — modo solo icono. */
    squareClass: string;

    /** Relleno horizontal. */
    paddingXClass: string;

    /** Separación entre icono y texto. */
    gapClass: string;

    /** Tamaño del icono en px — para la prop `size` de lucide. */
    iconSize: number;

    /** El mismo tamaño como clase, para iconos estilados por CSS. */
    iconClass: string;

    /** Radio de esquina. */
    radiusClass: string;

    /** Estilo tipográfico del texto del control. */
    typographyClass: string;
};



/** Insignias, tags y contadores. */
export interface BadgeSizeToken {
    heightClass: string;
    paddingXClass: string;
    gapClass: string;

    /** Para la prop `size` de lucide. */
    iconSize: number;

    iconClass: string;
    radiusClass: string;
    typographyClass: string;
};



/** Avatares y miniaturas. */
export interface AvatarSizeToken {
    /** Lado en px — lo necesitan `width` y `height` de next/image. */
    size: number;

    sizeClass: string;

    /** Tipografía de las iniciales cuando no hay imagen. */
    typographyClass: string;

    /** Radio de la variante cuadrada (miniatura de producto). */
    radiusClass: string;
};



/** Tarjetas, paneles y popovers. */
export interface SurfaceSizeToken {
    /** Relleno interior. */
    paddingClass: string;

    /** Separación entre bloques internos. */
    gapClass: string;

    radiusClass: string;
};

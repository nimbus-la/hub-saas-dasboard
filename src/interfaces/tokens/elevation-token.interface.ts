/**
 * Escalón de elevación.
 *
 * El valor CSS de cada sombra vive en `@theme` (`--shadow-*`); aquí solo se
 * nombra la utilidad y para qué sirve.
 */
export interface ElevationToken {
    /** Utilidad de Tailwind. */
    class: string;

    /** Para qué está pensado este escalón. */
    usage: string;
};

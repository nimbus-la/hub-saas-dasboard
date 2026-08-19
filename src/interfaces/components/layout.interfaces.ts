import type { ReactNode } from "react";


/**
 * Props del encabezado de pantalla.
 *
 * Los textos llegan por props en vez de estar escritos en el componente porque
 * todas las pantallas del panel comparten esta cabecera y solo se diferencian
 * en lo que dice.
 */
export interface PageHeaderProps {
    title: string;
    /** Bajada bajo el título: qué se hace en esta pantalla. */
    subtitle?: string;

    /**
     * Destino de la flecha de regreso.
     *
     * Sin él no se dibuja flecha: una pantalla de primer nivel no tiene a dónde
     * volver, y una flecha que lleva al mismo sitio que el menú es ruido.
     */
    backHref?: string;
    /**
     * Texto accesible de la flecha.
     *
     * Nombra el destino, no la dirección: "Atrás" a secas obliga a adivinar a
     * dónde lleva a quien navega con lector de pantalla.
     */
    backLabel?: string;

    /** Insignia junto al título: un contador, un estado del conjunto. */
    badge?: ReactNode;
    /** Acción principal de la pantalla, alineada al margen derecho. */
    actions?: ReactNode;

    className?: string;
}

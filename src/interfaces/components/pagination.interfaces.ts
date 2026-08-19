import type { Plural } from "@/messages";

export interface PaginationProps {
    /** Página actual, empezando en 1. */
    page: number;
    pageSize: number;
    /** Total de elementos ya filtrados (no el del catálogo completo). */
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    /** Opciones del selector de tamaño de página. */
    pageSizeOptions?: readonly number[];
    /**
     * Nombre del elemento listado para el resumen ("Mostrando 1–12 de 22
     * productos").
     *
     * Es un `Plural` del catálogo de textos y no una cadena suelta: qué forma
     * le toca a cada cantidad lo decide `formatPlural` con las reglas del
     * idioma, no un `=== 1` dentro de este componente.
     */
    itemLabel?: Plural;
    className?: string;
}

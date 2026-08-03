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
     * productos"). En singular y plural porque el español no lo deduce.
     */
    itemLabel?: { singular: string; plural: string };
    className?: string;
}

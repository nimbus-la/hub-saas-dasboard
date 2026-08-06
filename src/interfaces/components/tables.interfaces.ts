import type { ChangeEvent, ReactNode } from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";


/* ── DataTable ─────────────────────────────────────────────────────────────── */

export interface DataTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    /** Muestra la columna de checkboxes al inicio de la tabla. */
    enableRowSelection?: boolean;
    /** Id estable por fila: conserva la selección al reordenar o refrescar. */
    getRowId?: (row: TData) => string;
    /** Notifica las filas seleccionadas — útil para acciones en lote. */
    onSelectedRowsChange?: (selectedRows: TData[]) => void;
    /** Orden inicial, p. ej. `[{ id: "placedAt", desc: true }]`. */
    initialSorting?: SortingState;
    /** Contenido de la última columna (menú de acciones de la fila). */
    renderRowActions?: (row: TData) => ReactNode;
    /** Texto mostrado cuando la colección viene vacía. */
    emptyMessage?: string;
    className?: string;
};


/* ── Checkbox de selección ─────────────────────────────────────────────────── */

export interface DataTableCheckboxProps {
    /** Etiqueta accesible (no visible). Obligatoria: el checkbox no tiene texto. */
    label: string;
    checked: boolean;
    /** Selección parcial — se pinta como guion en lugar de palomita. */
    indeterminate?: boolean;
    disabled?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};


/* ── Celda de título + subtítulo ───────────────────────────────────────────── */

export interface TitleSubtitleCellProps {
    title: ReactNode;
    /** Línea secundaria (correo, categoría, SKU…). Se omite si no se pasa. */
    subtitle?: ReactNode;
    /** Elemento visual a la izquierda: avatar, ícono o miniatura. */
    media?: ReactNode;
    className?: string;
};

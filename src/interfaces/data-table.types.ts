// ── Tipos compartidos del DataTable ─────────────────────────────────────────
// Amplía `ColumnMeta` de TanStack Table para que cada columna pueda declarar su
// alineación y clases extra de forma tipada, sin `any` ni castings en el render.

import type { RowData } from "@tanstack/react-table";

/** Alineación horizontal del contenido de una columna. */
export type ColumnAlign = "left" | "center" | "right";

declare module "@tanstack/react-table" {
    // Los parámetros de tipo no se usan aquí, pero el declaration merging de
    // TypeScript exige repetir la firma original de la interfaz de TanStack.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        /** Alineación del encabezado y de sus celdas. Por defecto "left". */
        align?: ColumnAlign;
        /** Clases extra aplicadas sólo a la celda de encabezado (`th`). */
        headerClassName?: string;
        /** Clases extra aplicadas sólo a las celdas del cuerpo (`td`). */
        cellClassName?: string;
    }
}

/** Clases de alineación compartidas entre encabezado y celdas. */
export const ALIGNMENT_CLASSNAMES: Record<ColumnAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export const DEFAULT_COLUMN_ALIGN: ColumnAlign = "left";

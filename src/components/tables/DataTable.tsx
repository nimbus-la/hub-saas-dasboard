"use client";

// ── Tabla de datos genérica y reutilizable ──────────────────────────────────
// Envoltorio delgado sobre TanStack Table (@tanstack/react-table) que resuelve
// lo repetitivo de cualquier tabla del producto:
//
//   · Columna de selección múltiple (checkbox), activable con `enableRowSelection`
//   · Ordenamiento por columna, desactivable con `enableSorting` en cada columna
//   · Columna final de acciones por fila mediante `renderRowActions`
//   · Estado vacío y scroll horizontal en pantallas angostas
//
// El componente no conoce el dominio: los datos y las columnas llegan por props,
// así la misma tabla sirve para órdenes, productos, usuarios, etc.
//
// Uso mínimo:
//   const columns: ColumnDef<Order>[] = [{ accessorKey: "amount", header: "Monto" }];
//   <DataTable data={orders} columns={columns} enableRowSelection />
//
// Cada columna puede afinar su presentación con `meta`:
//   { accessorKey: "amount", header: "Monto", meta: { align: "right" } }

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type RowSelectionState,
    type SortDirection,
    type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import DataTableCheckbox from "./DataTableCheckbox";
import { ALIGNMENT_CLASSNAMES, DEFAULT_COLUMN_ALIGN } from "../../interfaces/data-table.types";


// Ids reservados de las columnas que genera el propio contenedor.
const SELECTION_COLUMN_ID = "row-selection";
const ACTIONS_COLUMN_ID = "row-actions";

const DEFAULT_EMPTY_MESSAGE = "Aún no hay registros para mostrar.";

// Ancho mínimo antes de activar el scroll horizontal (evita celdas comprimidas).
const MIN_TABLE_WIDTH = "min-w-[40rem]";


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


export default function DataTable<TData, TValue>({
    data,
    columns,
    enableRowSelection = false,
    getRowId,
    onSelectedRowsChange,
    initialSorting = [],
    renderRowActions,
    emptyMessage = DEFAULT_EMPTY_MESSAGE,
    className,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Las columnas de selección y acciones se añaden aquí para que cada
    // consumidor declare únicamente las columnas propias de su dominio.
    const tableColumns = useMemo(() => {
        const composedColumns = [...columns];

        if (enableRowSelection) {
            composedColumns.unshift(createSelectionColumn<TData, TValue>());
        }

        if (renderRowActions) {
            composedColumns.push(createActionsColumn<TData, TValue>(renderRowActions));
        }

        return composedColumns;
    }, [columns, enableRowSelection, renderRowActions]);

    // TanStack Table devuelve funciones que el React Compiler no puede memoizar,
    // por lo que omite este componente. Es el comportamiento esperado: la propia
    // instancia de la tabla ya cachea internamente sus modelos de filas.
    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns: tableColumns,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        enableRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        ...(getRowId && { getRowId: (row: TData) => getRowId(row) }),
    });

    // Expone la selección hacia arriba sin obligar al consumidor a controlarla.
    useEffect(() => {
        if (!onSelectedRowsChange) return;

        const selectedRows = table
            .getSelectedRowModel()
            .rows.map((row) => row.original);

        onSelectedRowsChange(selectedRows);
    }, [rowSelection, onSelectedRowsChange, table]);

    const rows = table.getRowModel().rows;
    const visibleColumnCount = table.getVisibleLeafColumns().length;

    return (
        <div className={cn("w-full min-w-0 overflow-x-auto", className)}>
            {/* `border-separate` permite redondear las esquinas del encabezado;
                por eso las líneas divisorias van en las celdas y no en la fila. */}
            <table className={cn("w-full border-separate border-spacing-0 text-sm", MIN_TABLE_WIDTH)}>
                {/* ── Encabezado ─────────────────────────────────────────── */}
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const { align = DEFAULT_COLUMN_ALIGN, headerClassName } =
                                    header.column.columnDef.meta ?? {};

                                const isSortable = header.column.getCanSort();
                                const sortDirection = header.column.getIsSorted();
                                const headerContent = flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                );

                                return (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        aria-sort={resolveAriaSort(isSortable, sortDirection)}
                                        className={cn(
                                            "bg-neutral-100 px-4 py-3",
                                            "text-xs font-semibold whitespace-nowrap text-neutral-600",
                                            "first:rounded-l-lg last:rounded-r-lg",
                                            ALIGNMENT_CLASSNAMES[align],
                                            headerClassName
                                        )}
                                    >
                                        {isSortable ? (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={cn(
                                                    "group inline-flex cursor-pointer items-center gap-1.5 rounded-sm",
                                                    "transition-colors duration-150 hover:text-neutral-800",
                                                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main",
                                                    align === "right" && "flex-row-reverse"
                                                )}
                                            >
                                                {headerContent}
                                                <SortIndicator direction={sortDirection} />
                                            </button>
                                        ) : (
                                            headerContent
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>

                {/* ── Cuerpo ─────────────────────────────────────────────── */}
                <tbody>
                    {rows.map((row) => (
                        <tr
                            key={row.id}
                            data-selected={row.getIsSelected()}
                            className={cn(
                                "transition-colors duration-150 hover:bg-neutral-50",
                                "data-[selected=true]:bg-primary-lighter/25",
                                "last:[&>td]:border-b-0"
                            )}
                        >
                            {row.getVisibleCells().map((cell) => {
                                const { align = DEFAULT_COLUMN_ALIGN, cellClassName } =
                                    cell.column.columnDef.meta ?? {};

                                return (
                                    <td
                                        key={cell.id}
                                        className={cn(
                                            "border-b border-neutral-200 px-4 py-3.5",
                                            "text-sm text-neutral-600",
                                            ALIGNMENT_CLASSNAMES[align],
                                            cellClassName
                                        )}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}

                    {/* ── Estado vacío ───────────────────────────────────── */}
                    {rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={visibleColumnCount}
                                className="px-4 py-12 text-center text-sm text-neutral-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


// ─── Columna de selección (checkbox al inicio) ────────────────────────────────

function createSelectionColumn<TData, TValue>(): ColumnDef<TData, TValue> {
    return {
        id: SELECTION_COLUMN_ID,
        enableSorting: false,
        meta: {
            align: "center",
            headerClassName: "w-12 px-2",
            cellClassName: "w-12 px-2",
        },
        header: ({ table }) => (
            <DataTableCheckbox
                label="Seleccionar todas las filas"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <DataTableCheckbox
                label="Seleccionar fila"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
    };
}


// ─── Columna de acciones (última columna) ─────────────────────────────────────

function createActionsColumn<TData, TValue>(
    renderRowActions: (row: TData) => ReactNode
): ColumnDef<TData, TValue> {
    return {
        id: ACTIONS_COLUMN_ID,
        enableSorting: false,
        meta: {
            align: "right",
            headerClassName: "w-16",
            cellClassName: "w-16",
        },
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => renderRowActions(row.original),
    };
}


// ─── Indicador de ordenamiento ────────────────────────────────────────────────

// Chevrons en lugar de flechas: sin astil pesan menos y no compiten con el dato.
const SORT_ICONS = {
    asc: ChevronUp,
    desc: ChevronDown,
} as const;

function SortIndicator({ direction }: { direction: SortDirection | false }) {
    // Sin ordenar se muestra el doble chevron atenuado: comunica que la columna
    // es ordenable sin depender del hover para descubrirlo.
    const Icon = direction ? SORT_ICONS[direction] : ChevronsUpDown;

    return (
        <Icon
            size={14}
            strokeWidth={2}
            aria-hidden
            className={cn(
                "shrink-0 transition-opacity duration-150",
                // La columna activa se distingue por opacidad y peso de gris,
                // no por color: la paleta se mantiene neutral de principio a fin.
                direction
                    ? "text-neutral-700"
                    : "text-neutral-500 opacity-40 group-hover:opacity-100"
            )}
        />
    );
}

/** Traduce el estado de orden de TanStack al valor de `aria-sort` del `th`. */
function resolveAriaSort(
    isSortable: boolean,
    direction: SortDirection | false
): "ascending" | "descending" | "none" | undefined {
    if (!isSortable) return undefined;
    if (direction === "asc") return "ascending";
    if (direction === "desc") return "descending";
    return "none";
}

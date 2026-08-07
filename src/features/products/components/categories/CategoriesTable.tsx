"use client";

import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/badges/StatusBadge";
import GenericButton from "@/components/buttons/GenericButton";
import DataTable from "@/components/tables/DataTable";
import { cn } from "@/lib/utils";
import {
    EMPTY_DESCRIPTION,
    formatCategoryStatus,
    getCategoryStatusTone,
    type Category,
} from "@/lib/categories";
import { ICON_TOKENS } from "@/tokens";

import {
    categoriesTableActionsVariants,
    categoriesTableDeleteVariants,
    categoriesTableDescriptionVariants,
    categoriesTableEmptyDescriptionVariants,
    categoriesTableNameVariants,
    categoriesTablePanelVariants,
} from "./categories-table.style";
import { formatDate } from "@/lib/format";


/**
 * Tabla de categorías.
 *
 * Envuelve al `DataTable` del sistema con las columnas del dominio. No guarda
 * estado: recibe la lista ya filtrada y devuelve la intención —editar,
 * eliminar— hacia arriba. Confirmar el borrado no es cosa suya: la fila solo
 * avisa de que alguien lo pidió.
 */


// ── Columnas ────────────────────────────────────────────────────────────────
// Constante de módulo: la referencia es estable entre renders, así el DataTable
// no recalcula su modelo de columnas innecesariamente.
const categoryColumns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        meta: { headerClassName: "w-56", cellClassName: "w-56" },
        cell: ({ row }) => (
            <span className={categoriesTableNameVariants()}>
                {row.original.name}
            </span>
        ),
    },
    {
        accessorKey: "description",
        header: "Descripción",
        // Sin ordenamiento: ordenar alfabéticamente un texto libre no responde
        // a ninguna pregunta que alguien se haga delante de esta tabla.
        enableSorting: false,
        cell: ({ row }) => {
            const { description } = row.original;

            if (!description) {
                return (
                    <span
                        className={categoriesTableEmptyDescriptionVariants()}
                        aria-label="Sin descripción"
                    >
                        {EMPTY_DESCRIPTION}
                    </span>
                );
            }

            // El texto completo queda en el `title` para lo que se recorta:
            // dos líneas cubren casi todas las descripciones, y quien necesite
            // el resto no tiene que abrir el modal de edición para leerlo.
            return (
                <span
                    title={description}
                    className={categoriesTableDescriptionVariants()}
                >
                    {description}
                </span>
            );
        },
    },
    {
        accessorKey: "active",
        header: "Estado",
        meta: { headerClassName: "w-32", cellClassName: "w-32" },
        cell: ({ row }) => (
            <StatusBadge
                tone={getCategoryStatusTone(row.original.active)}
                label={formatCategoryStatus(row.original.active)}
            />
        ),
    },
    {
        accessorKey: "placedAt",
        header: "Fecha de actualización",
        meta: { headerClassName: "w-32", cellClassName: "w-32" },
        cell: ({ row }) => (
            <time dateTime={row.original.placedAt} className="tabular-nums">
                {formatDate(row.original.placedAt)}
            </time>
        ),
    },
];


interface CategoriesTableProps {
    categories: Category[];
    onEditCategory: (category: Category) => void;
    onDeleteCategory: (category: Category) => void;
    /** Qué decir cuando no hay filas. Cambia según haya filtros puestos. */
    emptyMessage: string;
    className?: string;
}

export default function CategoriesTable({
    categories,
    onEditCategory,
    onDeleteCategory,
    emptyMessage,
    className,
}: CategoriesTableProps) {
    return (
        <div className={cn(categoriesTablePanelVariants(), className)}>
            <DataTable
                data={categories}
                columns={categoryColumns}
                enableRowSelection
                getRowId={(category) => category.id}
                emptyMessage={emptyMessage}
                renderRowActions={(category) => (
                    <div className={categoriesTableActionsVariants()}>
                        {/* La etiqueta nombra la categoría y no solo la acción:
                            con ocho filas iguales, ocho botones que dicen
                            "Editar" no se distinguen entre sí al navegar por
                            la lista de controles de un lector de pantalla. */}
                        <GenericButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={ICON_TOKENS.EDIT}
                            aria-label={`Editar ${category.name}`}
                            title="Editar"
                            onClick={() => onEditCategory(category)}
                        />

                        <GenericButton
                            type="button"
                            variant="danger"
                            size="sm"
                            icon={ICON_TOKENS.DELETE}
                            aria-label={`Eliminar ${category.name}`}
                            title="Eliminar"
                            onClick={() => onDeleteCategory(category)}
                            className={categoriesTableDeleteVariants()}
                        />
                    </div>
                )}
            />
        </div>
    );
};

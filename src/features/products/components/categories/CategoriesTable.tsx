"use client";

import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/badges/StatusBadge";
import GenericButton from "@/components/buttons/GenericButton";
import DataTable from "@/components/tables/DataTable";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import { ICON_TOKENS } from "@/tokens";

import { CategoryList } from "../../interfaces";
import { EMPTY_DESCRIPTION, formatCategoryStatus, getCategoryStatusTone } from "../../libs";
import {
    categoriesTableActionsVariants,
    categoriesTableDateVariants,
    categoriesTableDeleteVariants,
    categoriesTableDescriptionVariants,
    categoriesTableEmptyDescriptionVariants,
    categoriesTableNameVariants,
    categoriesTablePanelVariants,
} from "./categories-table.style";


const message = messages.products.categories.table;

/**
 * Tabla de categorías. No guarda estado, solo muestra la lista que recibe y
 * avisa a la pantalla cuando alguien quiere editar o eliminar una fila.
 */


// Las columnas se definen fuera del componente para que la tabla no las
// recalcule en cada render.
const categoryColumns: ColumnDef<CategoryList>[] = [
    {
        accessorKey: "name",
        header: message.name,
        meta: { headerClassName: "w-56", cellClassName: "w-56" },
        cell: ({ row }) => (
            <span className={categoriesTableNameVariants()}>
                {row.original.name}
            </span>
        ),
    },
    {
        accessorKey: "description",
        header: message.description,
        // No se ordena porque ordenar descripciones por letra no le sirve a nadie.
        enableSorting: false,
        cell: ({ row }) => {
            const { description } = row.original;

            if (!description) {
                return (
                    <span
                        className={categoriesTableEmptyDescriptionVariants()}
                        aria-label={message.noDescription}
                    >
                        {EMPTY_DESCRIPTION}
                    </span>
                );
            }

            // La descripción se corta en dos líneas, y el texto completo se ve
            // al pasar el cursor por encima.
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
        accessorKey: "isActive",
        header: message.status,
        meta: { headerClassName: "w-32", cellClassName: "w-32" },
        cell: ({ row }) => (
            <StatusBadge
                tone={getCategoryStatusTone(row.original.isActive)}
                label={formatCategoryStatus(row.original.isActive)}
            />
        ),
    },
    {
        // Se ordena por la fecha ISO, que sí queda en orden cronológico. La
        // fecha formateada empieza por el día y se ordenaría mal.
        accessorKey: "updatedAt",
        header: message.updatedAt,
        // La fecha incluye la hora, así que necesita más ancho que el estado.
        meta: { headerClassName: "w-48", cellClassName: "w-48" },
        cell: ({ row }) => {
            const { updatedAt } = row.original;

            return (
                <time dateTime={updatedAt} className={categoriesTableDateVariants()}>
                    {formatDate(updatedAt)}
                </time>
            );
        },
    },
];


interface CategoriesTableProps {
    categories: CategoryList[];
    onEditCategory: (category: CategoryList) => void;
    onDeleteCategory: (category: CategoryList) => void;
    /** Texto que se muestra cuando no hay filas. Cambia si hay filtros activos. */
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
                        {/* La etiqueta incluye el nombre de la categoría para que
                            un lector de pantalla distinga los botones de cada fila. */}
                        <GenericButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={ICON_TOKENS.EDIT}
                            aria-label={formatMessage(message.editCategory, {
                                name: category.name,
                            })}
                            title={message.edit}
                            onClick={() => onEditCategory(category)}
                        />

                        <GenericButton
                            type="button"
                            variant="danger"
                            size="sm"
                            icon={ICON_TOKENS.DELETE}
                            aria-label={formatMessage(message.deleteCategory, {
                                name: category.name,
                            })}
                            title={message.delete}
                            onClick={() => onDeleteCategory(category)}
                            className={categoriesTableDeleteVariants()}
                        />
                    </div>
                )}
            />
        </div>
    );
}

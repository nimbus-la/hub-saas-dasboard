"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, GenericButton, StatusBadge, TitleSubtitleCell } from "@/components";
import { formatIngredientQuantity } from "@/lib/ingredients";
import { formatMessage, messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import type { RecipeRow, RecipeTableProps } from "../../interfaces";
import RecipeQuantityCell from "./RecipeQuantityCell";
import {
    recipeMetaVariants,
    recipeNameVariants,
    recipeSkuVariants,
    recipeStockHintVariants,
    recipeStockValueVariants,
    recipeStockVariants,
    recipeTableRowVariants,
} from "./recipe-table.style";


const recipeMessages = messages.products.create.recipe.list;
const stockMessages = messages.products.create.recipe.stock;


// Las columnas se declaran fuera del componente a propósito. `flexRender` usa
// cada `cell` como si fuera un componente, y si las columnas se crearan en
// cada render, React desmontaría el campo de cantidad con cada tecla y se
// perdería el foco.
const recipeColumns: ColumnDef<RecipeRow>[] = [
    {
        id: "ingredient",
        header: recipeMessages.columns.ingredient,
        cell: ({ row }) => {
            const { ingredient, isOutOfStock } = row.original;

            return (
                <TitleSubtitleCell
                    title={
                        <span className={recipeNameVariants({ outOfStock: isOutOfStock })}>
                            {ingredient.name}
                        </span>
                    }
                    subtitle={
                        <span className={recipeMetaVariants({ outOfStock: isOutOfStock })}>
                            <span className={recipeSkuVariants()}>{ingredient.sku}</span>

                            {ingredient.isPerishable && (
                                <StatusBadge size="xs" tone="neutral" label={recipeMessages.perishable} />
                            )}
                        </span>
                    }
                />
            );
        },
    },
    {
        id: "quantity",
        header: recipeMessages.columns.quantity,
        // 10rem alcanza para un campo `sm` con cinco dígitos y la unidad.
        meta: { headerClassName: "w-40", cellClassName: "w-40" },
        cell: ({ row }) => <RecipeQuantityCell row={row.original} />,
    },
    {
        id: "stock",
        header: recipeMessages.columns.stock,
        meta: { align: "right", headerClassName: "w-36", cellClassName: "w-36" },
        cell: ({ row }) => {
            const { ingredient, isOutOfStock } = row.original;

            return (
                <div className={recipeStockVariants()}>
                    <span className={recipeStockValueVariants({ outOfStock: isOutOfStock })}>
                        {formatIngredientQuantity(ingredient.stock, ingredient.unit)}
                    </span>

                    <span className={recipeStockHintVariants({ outOfStock: isOutOfStock })}>
                        {isOutOfStock ? stockMessages.outOfStock : stockMessages.available}
                    </span>
                </div>
            );
        },
    },
];


/**
 * Tabla de insumos de la receta.
 *
 * Arma las columnas de la receta sobre el `DataTable` del sistema, igual que
 * `CategoriesTable`. Los valores de cantidad los maneja react-hook-form desde
 * cada celda, así que la tabla solo avisa hacia arriba cuando hay que quitar
 * una línea.
 */
export default function RecipeTable({ rows, onRemove, className }: RecipeTableProps) {
    return (
        <DataTable
            data={rows}
            columns={recipeColumns}
            // Se usa el id que react-hook-form le da a cada línea, que no cambia
            // aunque la fila se mueva de posición al quitar otra.
            getRowId={(row) => row.id}
            // La tabla se edita, y ordenarla movería la fila en la que se está
            // escribiendo.
            enableSorting={false}
            getRowClassName={(row) =>
                recipeTableRowVariants({ outOfStock: row.isOutOfStock })
            }
            renderRowActions={(row) => (
                // No pide confirmación porque todavía es un borrador y volver a
                // añadir el insumo toma dos clics.
                <GenericButton
                    type="button"
                    variant="danger"
                    size="sm"
                    icon={ICON_TOKENS.DELETE}
                    aria-label={formatMessage(recipeMessages.remove, {
                        name: row.ingredient.name,
                    })}
                    onClick={() => onRemove(row.index)}
                />
            )}
            {...(className && { className })}
        />
    );
};

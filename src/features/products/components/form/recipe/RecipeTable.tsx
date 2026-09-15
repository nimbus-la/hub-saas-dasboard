"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DataTable,
    GenericButton,
    StatusBadge,
    TitleSubtitleCell,
} from "@/components";
import { formatIngredientQuantity } from "@/lib/ingredients";
// Las iniciales de un producto sirven igual para un insumo, porque solo
// dependen del nombre.
import { getProductInitials } from "@/lib/products";
import { formatMessage, messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import type { RecipeRow } from "../../../interfaces";
import { RecipeOptionalCell, RecipeQuantityCell } from "./cells";
import {
    RECIPE_COLUMN_CLASS,
    recipeMetaVariants,
    recipeNameVariants,
    recipeSkuVariants,
    recipeStockHintVariants,
    recipeStockValueVariants,
    recipeStockVariants,
    recipeTableRowVariants,
} from "./recipe-table.style";


interface RecipeTableProps {
    rows: RecipeRow[];
    /** Recibe la posición de la línea dentro de la receta del formulario. */
    onRemove: (index: number) => void;
    className?: string;
}


const recipeMessages = messages.products.create.recipe.list;
const stockMessages = messages.products.create.recipe.stock;


/**
 * Id del botón de quitar de una fila, para poder devolverle el foco.
 *
 * Se arma con el id del insumo y no con el de react-hook-form, porque ese
 * último es aleatorio y sale distinto en el servidor y en el navegador.
 */
const getRemoveButtonId = (ingredientId: string): string =>
    `recipe-remove-${ingredientId}`;


// Las columnas se declaran fuera del componente a propósito. `flexRender` usa
// cada `cell` como si fuera un componente, y si las columnas se crearan en
// cada render, React desmontaría el campo de cantidad con cada tecla y se
// perdería el foco.
const recipeColumns: ColumnDef<RecipeRow>[] = [
    {
        id: "ingredient",
        header: recipeMessages.columns.ingredient,
        meta: {
            headerClassName: RECIPE_COLUMN_CLASS.ingredient,
            cellClassName: RECIPE_COLUMN_CLASS.ingredient,
        },
        cell: ({ row }) => {
            const { ingredient, isOutOfStock } = row.original;

            return (
                <TitleSubtitleCell
                    media={
                        // Es decorativa porque el nombre va justo al lado.
                        <Avatar size="md" shape="square" aria-hidden="true">
                            {ingredient.image && <AvatarImage src={ingredient.image} alt="" />}
                            <AvatarFallback>{getProductInitials(ingredient.name)}</AvatarFallback>
                        </Avatar>
                    }
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
        meta: {
            headerClassName: RECIPE_COLUMN_CLASS.quantity,
            cellClassName: RECIPE_COLUMN_CLASS.quantity,
        },
        cell: ({ row }) => <RecipeQuantityCell row={row.original} />,
    },
    {
        id: "stock",
        header: recipeMessages.columns.stock,
        meta: {
            align: "right",
            headerClassName: RECIPE_COLUMN_CLASS.stock,
            cellClassName: RECIPE_COLUMN_CLASS.stock,
        },
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
    {
        id: "optional",
        header: recipeMessages.columns.optional,
        meta: {
            align: "center",
            headerClassName: RECIPE_COLUMN_CLASS.optional,
            cellClassName: RECIPE_COLUMN_CLASS.optional,
        },
        cell: ({ row }) => <RecipeOptionalCell row={row.original} />,
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
    // Insumo cuya fila debe recibir el foco cuando termine de quitarse la anterior.
    const focusAfterRemoveId = React.useRef<string | null>(null);

    // Cuando se quita una fila, su botón desaparece y el foco se perdería. Lo
    // pasamos al botón de quitar de la fila siguiente, o al de la anterior si
    // era la última, para que quien usa el teclado pueda seguir quitando sin
    // volver a recorrer toda la página.
    React.useEffect(() => {
        if (!focusAfterRemoveId.current) return;

        document.getElementById(getRemoveButtonId(focusAfterRemoveId.current))?.focus();
        focusAfterRemoveId.current = null;
    }, [rows]);

    const handleRemove = (row: RecipeRow) => {
        const position = rows.findIndex((current) => current.id === row.id);
        const neighbor = rows[position + 1] ?? rows[position - 1];

        focusAfterRemoveId.current = neighbor?.ingredient.id ?? null;
        onRemove(row.index);
    };

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
                    id={getRemoveButtonId(row.ingredient.id)}
                    type="button"
                    variant="danger"
                    size="sm"
                    icon={ICON_TOKENS.DELETE}
                    aria-label={formatMessage(recipeMessages.remove, {
                        name: row.ingredient.name,
                    })}
                    onClick={() => handleRemove(row)}
                />
            )}
            {...(className && { className })}
        />
    );
};

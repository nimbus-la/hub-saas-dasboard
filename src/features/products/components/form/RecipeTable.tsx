"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, GenericButton, StatusBadge, TextField, TitleSubtitleCell } from "@/components";
import { formatNumber } from "@/lib/format";
import { formatMessage, messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import {
    recipeMetaVariants,
    recipeNameVariants,
    recipeSkuVariants,
    recipeStockHintVariants,
    recipeStockValueVariants,
    recipeStockVariants,
    recipeTableRowVariants,
    recipeUnitVariants,
} from "./recipe-table.style";
import type { MockRecipeLine } from "../../interfaces";


/** Lo que dice esta tabla. Ver `@/messages`. */
const recipeMessages = messages.products.create.recipe.list;

/** Existencias — el mismo par de palabras que usa el buscador. */
const recipeStockMessages = messages.products.create.recipe.stock;


/**
 * Tabla de insumos de la receta.
 *
 * Envuelve al `DataTable` del sistema con las columnas del dominio, igual que
 * `CategoriesTable`. No guarda estado: recibe las líneas y devuelve hacia arriba
 * la intención —cambiar una cantidad, quitar un insumo—.
 */


/**
 * Cambio de cantidad, para la celda que lo necesita.
 *
 * Va por contexto y no por una columna que lo capture: las columnas tienen que
 * ser una constante de módulo (ver abajo). Provisional: cuando la receta viva en
 * el formulario, la celda usará `useFormContext` y este contexto sobra.
 */
const QuantityChangeContext = React.createContext<
    (index: number, quantity: string) => void
>(() => {});


/** Celda de cantidad. Componente con nombre porque usa hooks. */
function RecipeQuantityCell({ line }: { line: MockRecipeLine }) {
    const onQuantityChange = React.useContext(QuantityChangeContext);
    const { ingredient, index, quantity } = line;

    return (
        <TextField
            size="sm"
            // `text` con `inputMode`: `number` trae su propio spinner, que
            // aparecería encima del sufijo de unidad, y en algunos navegadores
            // cambia el valor al girar la rueda del ratón sobre el campo.
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={quantity}
            onChange={(value) => onQuantityChange(index, value)}
            aria-label={formatMessage(recipeMessages.quantityLabel, {
                name: ingredient.name,
                unit: ingredient.unitName,
            })}
            rightIcon={<span className={recipeUnitVariants()}>{ingredient.unit}</span>}
        />
    );
}


// ── Columnas ────────────────────────────────────────────────────────────────
// Constante de módulo, y aquí no es opcional: `flexRender` monta cada `cell`
// con `React.createElement(cell)`, así que la función ES el tipo del componente.
// Declaradas dentro del componente, cada tecla crearía un tipo nuevo, React
// desmontaría el campo y se perdería el foco en cada pulsación.
const recipeColumns: ColumnDef<MockRecipeLine>[] = [
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
        // 10rem: un campo `sm` con cinco dígitos y el sufijo de unidad dentro.
        meta: { headerClassName: "w-40", cellClassName: "w-40" },
        cell: ({ row }) => <RecipeQuantityCell line={row.original} />,
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
                        {`${formatNumber(ingredient.stock)} ${ingredient.unit}`}
                    </span>

                    <span className={recipeStockHintVariants({ outOfStock: isOutOfStock })}>
                        {isOutOfStock ? recipeStockMessages.outOfStock : recipeStockMessages.available}
                    </span>
                </div>
            );
        },
    },
];


interface RecipeTableProps {
    lines: MockRecipeLine[];
    onQuantityChange: (index: number, quantity: string) => void;
    onRemove: (index: number) => void;
    className?: string;
}

export default function RecipeTable({
    lines,
    onQuantityChange,
    onRemove,
    className,
}: RecipeTableProps) {
    return (
        <QuantityChangeContext.Provider value={onQuantityChange}>
            <DataTable
                data={lines}
                columns={recipeColumns}
                // El insumo no se repite en una receta, así que su id es
                // estable al quitar filas aunque cambie el `index`.
                getRowId={(line) => line.ingredient.id}
                // Tabla editable: reordenar movería la fila que se escribe.
                enableSorting={false}
                getRowClassName={(line) =>
                    recipeTableRowVariants({ outOfStock: line.isOutOfStock })
                }
                renderRowActions={(line) => (
                    // Sin confirmación: es un borrador y volver a añadir el
                    // insumo son dos pulsaciones.
                    <GenericButton
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={ICON_TOKENS.DELETE}
                        aria-label={formatMessage(recipeMessages.remove, {
                            name: line.ingredient.name,
                        })}
                        onClick={() => onRemove(line.index)}
                    />
                )}
                {...(className && { className })}
            />
        </QuantityChangeContext.Provider>
    );
};

"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Switch } from "@/components";
import { formatMessage, messages } from "@/messages";

import type { ProductFormValues, RecipeRow } from "../../../../interfaces";


interface RecipeOptionalCellProps {
    row: RecipeRow;
}


const recipeMessages = messages.products.create.recipe.list;


/**
 * Interruptor para marcar un insumo de la receta como opcional.
 *
 * Un insumo opcional es uno que el cliente puede pedir sin él. Marcarlo no
 * cambia el costo de la receta ni el aviso de agotados: si está agotado, el
 * producto se sigue publicando como no disponible.
 *
 * No lleva reglas porque las dos opciones son válidas.
 */
export default function RecipeOptionalCell({ row }: RecipeOptionalCellProps) {
    const { control } = useFormContext<ProductFormValues>();
    const { ingredient, index } = row;

    return (
        <Controller
            control={control}
            name={`recipe.${index}.isOptional`}
            render={({ field }) => (
                <Switch
                    size="sm"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label={formatMessage(recipeMessages.optionalLabel, {
                        name: ingredient.name,
                    })}
                />
            )}
        />
    );
};

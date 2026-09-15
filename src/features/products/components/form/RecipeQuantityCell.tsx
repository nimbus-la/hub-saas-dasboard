"use client";

import { Controller, useFormContext } from "react-hook-form";

import { NumberField } from "@/components";
import { getUnitAbbreviation, getUnitName } from "@/lib/ingredients";
import { formatMessage, messages } from "@/messages";

import type { ProductFormValues, RecipeRow } from "../../interfaces";
import { RECIPE_VALIDATION, getRecipeQuantityRules } from "../../libs";


interface RecipeQuantityCellProps {
    row: RecipeRow;
}


const recipeMessages = messages.products.create.recipe.list;


/**
 * Campo de cantidad de una línea de la receta.
 *
 * Usa `NumberField`, que muestra los puntos de miles mientras se escribe y
 * entrega la cantidad como número. Va dentro de un `Controller` porque el
 * campo entrega el número en `onChange` y no el evento del input. El `ref` que
 * pasa el `Controller` es el que permite llevar el foco a este campo cuando
 * falla.
 */
export default function RecipeQuantityCell({ row }: RecipeQuantityCellProps) {
    const { control } = useFormContext<ProductFormValues>();
    const { ingredient, index } = row;

    return (
        <Controller
            control={control}
            name={`recipe.${index}.quantity`}
            rules={getRecipeQuantityRules(ingredient.unit)}
            render={({ field, fieldState }) => (
                <NumberField
                    ref={field.ref}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={field.disabled ?? false}
                    size="sm"
                    maxDecimals={RECIPE_VALIDATION.quantity.maxDecimals}
                    error={fieldState.error?.message ?? false}
                    aria-label={formatMessage(recipeMessages.quantityLabel, {
                        name: ingredient.name,
                        unit: getUnitName(ingredient.unit),
                    })}
                    suffix={getUnitAbbreviation(ingredient.unit)}
                />
            )}
        />
    );
};

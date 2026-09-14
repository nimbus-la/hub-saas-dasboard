"use client";

import { Controller, useFormContext } from "react-hook-form";

import { TextField } from "@/components";
import { getUnitAbbreviation, getUnitName } from "@/lib/ingredients";
import { formatMessage, messages } from "@/messages";

import type { ProductFormValues, RecipeQuantityCellProps } from "../../interfaces";
import { getRecipeQuantityRules } from "../../libs";
import { recipeQuantityUnitVariants } from "./recipe-quantity-cell.style";


const recipeMessages = messages.products.create.recipe.list;


/**
 * Campo de cantidad de una línea de la receta.
 *
 * Usa `Controller` porque `TextField` entrega el texto en `onChange` y no el
 * evento del input, que es lo que espera `register`. El `ref` que pasa el
 * `Controller` es el que permite llevar el foco a este campo cuando falla.
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
                <TextField
                    {...field}
                    size="sm"
                    // Se usa `text` con `inputMode="decimal"` en lugar de
                    // `number`, porque ese tipo agrega flechas que tapan la
                    // unidad y cambia el valor si se mueve la rueda del mouse.
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    error={fieldState.error?.message ?? false}
                    aria-label={formatMessage(recipeMessages.quantityLabel, {
                        name: ingredient.name,
                        unit: getUnitName(ingredient.unit),
                    })}
                    rightIcon={
                        <span className={recipeQuantityUnitVariants()}>
                            {getUnitAbbreviation(ingredient.unit)}
                        </span>
                    }
                />
            )}
        />
    );
};

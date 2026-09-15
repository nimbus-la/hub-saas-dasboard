"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { formatPlural, messages } from "@/messages";

import { useRecipeLines } from "../../hooks/use-recipe-lines";
import IngredientSearchField from "./IngredientSearchField";
import RecipeEmptyState from "./RecipeEmptyState";
import RecipeSummary from "./RecipeSummary";
import RecipeTable from "./RecipeTable";
import {
    productRecipeListCountVariants,
    productRecipeListHeaderVariants,
    productRecipeListTitleVariants,
    productRecipeListVariants,
    productRecipeStepVariants,
} from "./product-recipe-step.style";


interface ProductRecipeStepProps {
    className?: string;
}


const recipeMessages = messages.products.create.recipe;


/**
 * Paso 2 del formulario de producto, la receta y sus insumos.
 *
 * Tiene que ir dentro del `FormProvider` del alta. La receta vive en
 * react-hook-form a través de `useRecipeLines`, y este componente solo decide
 * qué mostrar según haya o no insumos.
 */
export default function ProductRecipeStep({ className }: ProductRecipeStepProps) {
    const { rows, lines, selectedIds, addIngredient, removeLine, error } = useRecipeLines();

    const hasRows = rows.length > 0;

    const searchRef = React.useRef<HTMLInputElement>(null);
    const previousRowCount = React.useRef(rows.length);

    // Si se quita la última fila, la tabla desaparece junto con el botón que
    // tenía el foco. Lo llevamos al buscador, que es donde se sigue armando la
    // receta.
    React.useEffect(() => {
        if (previousRowCount.current > 0 && rows.length === 0) {
            searchRef.current?.focus();
        }

        previousRowCount.current = rows.length;
    }, [rows.length]);

    return (
        // El `legend` no se ve porque el nombre del paso ya aparece en el
        // indicador de arriba, pero sí lo lee el lector de pantalla.
        <fieldset className={cn(productRecipeStepVariants(), className)}>
            <legend className="sr-only">{recipeMessages.legend}</legend>

            <IngredientSearchField
                ref={searchRef}
                selectedIds={selectedIds}
                error={error}
                onAdd={addIngredient}
            />

            <div className={productRecipeListVariants()}>
                <div className={productRecipeListHeaderVariants()}>
                    <h3 className={productRecipeListTitleVariants()}>
                        {recipeMessages.list.title}
                    </h3>

                    {/* Se anuncia al cambiar porque, si la lista queda más
                        abajo en la pantalla, quien añade un insumo no la ve. */}
                    <p aria-live="polite" className={productRecipeListCountVariants()}>
                        {formatPlural(recipeMessages.list.count, rows.length)}
                    </p>
                </div>

                {hasRows ? (
                    <>
                        <RecipeTable rows={rows} onRemove={removeLine} />
                        <RecipeSummary lines={lines} />
                    </>
                ) : (
                    <RecipeEmptyState />
                )}
            </div>
        </fieldset>
    );
};

import type * as React from "react";

import type { Ingredient } from "@/lib/ingredients";

import type { RecipeRow } from "./recipe.interfaces";


export interface ProductRecipeStepProps {
    className?: string;
}


export interface RecipeTableProps {
    rows: RecipeRow[];
    /** Recibe la posición de la línea dentro de la receta del formulario. */
    onRemove: (index: number) => void;
    className?: string;
}


export interface RecipeQuantityCellProps {
    row: RecipeRow;
}


export interface RecipeEmptyStateProps {
    className?: string;
}


export interface IngredientSearchFieldProps {
    /** Ids de los insumos que ya están en la receta, para no volver a ofrecerlos. */
    selectedIds: readonly string[];
    onAdd: (ingredient: Ingredient) => void;
    /** Llega al campo de búsqueda, para poder devolverle el foco desde afuera. */
    ref?: React.Ref<HTMLInputElement>;
    className?: string;
}


export interface IngredientSearchResultProps {
    ingredient: Ingredient;
    onAdd: (ingredient: Ingredient) => void;
}

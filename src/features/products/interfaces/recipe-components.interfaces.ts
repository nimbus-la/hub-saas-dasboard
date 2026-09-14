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

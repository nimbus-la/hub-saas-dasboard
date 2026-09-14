import type { RegisterOptions, UseFieldArrayProps } from "react-hook-form";

import type { Ingredient } from "@/lib/ingredients";

import type { ProductFormValues } from "./products.interface";


/* -------------------------------------------------------------------------- */
/*  Reglas del formulario                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Ruta del campo de cantidad de una línea, por ejemplo `recipe.2.quantity`.
 * react-hook-form necesita la ruta exacta para tipar bien las reglas y el
 * valor del `Controller`.
 */
export type ProductRecipeQuantityPath = `recipe.${number}.quantity`;


/** Reglas del campo de cantidad de una línea. */
export type ProductRecipeQuantityRules = RegisterOptions<
    ProductFormValues,
    ProductRecipeQuantityPath
>;


/** Reglas de la receta completa, las que recibe `useFieldArray`. */
export type ProductRecipeRules = NonNullable<
    UseFieldArrayProps<ProductFormValues, "recipe">["rules"]
>;


/* -------------------------------------------------------------------------- */
/*  Receta resuelta                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Una línea de la receta con su insumo ya buscado en el inventario.
 *
 * El formulario solo guarda el id del insumo y la cantidad tal como se
 * escribió. Esta interfaz junta eso con los datos del insumo y con lo que
 * cuesta la cantidad indicada.
 *
 * `quantity` y `cost` quedan en `null` mientras lo escrito no sea una cantidad
 * válida, así sabemos si el total ya se puede dar por bueno.
 */
export interface RecipeLine {
    /**
     * Posición de la línea dentro de `recipe` en el formulario. Con ella se
     * nombra el campo de cantidad y se quita la línea, y se guarda aquí porque
     * una línea cuyo insumo ya no existe no se muestra y las posiciones de la
     * lista dejan de coincidir con las del formulario.
     */
    index: number;
    ingredient: Ingredient;
    quantity: number | null;
    cost: number | null;
    isOutOfStock: boolean;
}


/**
 * Una fila de la tabla de la receta.
 *
 * Se arma con los `fields` de `useFieldArray` y no con los valores observados,
 * porque `fields` cambia en el mismo momento en que se quita o se añade una
 * línea. `id` es la clave que react-hook-form genera para cada línea.
 *
 * No trae la cantidad porque de eso se encarga el campo de cada fila.
 */
export type RecipeRow = Pick<RecipeLine, "index" | "ingredient" | "isOutOfStock"> & {
    id: string;
};


/**
 * En qué situación está el buscador de insumos.
 *
 * - `idle` cuando no se ha escrito nada.
 * - `results` cuando hay insumos para añadir.
 * - `empty` cuando ningún insumo del inventario coincide.
 * - `allAdded` cuando todo lo que coincide ya está en la receta.
 * - `full` cuando la receta llegó al tope de insumos.
 */
export type IngredientSearchStatus = "idle" | "results" | "empty" | "allAdded" | "full";


/** Lo que devuelve una búsqueda de insumos para la receta. */
export interface IngredientSearchResult {
    status: IngredientSearchStatus;
    /** Insumos que se muestran, ya sin los que están en la receta. */
    results: Ingredient[];
    /** Coincidencias que se pueden añadir pero no caben en la lista. */
    hiddenCount: number;
}


/**
 * Lo que cuesta la receta.
 *
 * `isComplete` es falso cuando alguna línea todavía no tiene una cantidad
 * válida. En ese caso el total solo suma las líneas que sí la tienen.
 */
export interface RecipeCost {
    total: number;
    isComplete: boolean;
}

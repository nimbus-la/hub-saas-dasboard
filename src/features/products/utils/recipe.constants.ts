import type { ProductRecipeFormValues } from "../interfaces";


/**
 * Límites de la receta.
 *
 * La cantidad mínima es 0,01 y no 0, porque una línea con cero de algo no
 * aporta nada a la receta. El máximo de 100.000 alcanza para cualquier plato
 * medido en gramos o mililitros y evita cifras escritas por error.
 *
 * El tope de 40 insumos es para que la lista se pueda revisar de un vistazo.
 * Una receta más larga casi siempre son dos recetas juntas.
 */
export const RECIPE_VALIDATION = {
    quantity: { min: 0.01, max: 100_000, maxDecimals: 2 },
    minIngredients: 1,
    maxIngredients: 40,
} as const;


/**
 * Cuántos resultados muestra el buscador de insumos.
 *
 * La lista aparece dentro del formulario y empuja el contenido hacia abajo, así
 * que se limita a seis. Si hay más, se invita a afinar la búsqueda.
 */
export const RECIPE_SEARCH_RESULTS = 6;


/**
 * Valores con los que entra un insumo nuevo a la receta.
 *
 * La cantidad empieza vacía a propósito. Si pusiéramos un 1 por defecto, lo
 * más probable es que se quedara así sin que nadie lo revisara.
 */
export const DEFAULT_RECIPE_LINE_VALUES: Omit<ProductRecipeFormValues, "itemId"> = {
    quantity: "",
    isOptional: false,
};

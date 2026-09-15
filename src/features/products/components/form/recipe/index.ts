// ── Paso 2: receta e insumos ────────────────────────────────────────────────
// `ProductRecipeStep` es lo único que monta `CreateProduct`; el resto son las
// piezas con las que se arma: la tabla de líneas, el resumen de costo y el
// estado vacío. El buscador y las celdas quedan un nivel más abajo porque son
// material de estas piezas, no del paso.
export { default as ProductRecipeStep } from './ProductRecipeStep';
export { default as RecipeEmptyState } from './RecipeEmptyState';
export { default as RecipeSummary } from './RecipeSummary';
export { default as RecipeTable } from './RecipeTable';

export * from './cells';
export * from './ingredient-search';

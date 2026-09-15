// ── Celdas de la tabla de receta ────────────────────────────────────────────
// Material de `RecipeTable`, no piezas de pantalla: cada una se monta dentro de
// una columna y habla con el formulario por `useFormContext`, así que la tabla
// no tiene que pasarles nada más que la fila. Por eso viven aquí abajo y no en
// `recipe/`, donde están las piezas que el paso sí compone.
export { default as RecipeOptionalCell } from './RecipeOptionalCell';
export { default as RecipeQuantityCell } from './RecipeQuantityCell';

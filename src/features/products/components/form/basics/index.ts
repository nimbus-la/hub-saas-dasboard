// ── Paso 1: datos básicos ───────────────────────────────────────────────────
// Nombre, categoría, descripción y foto. `ProductImageField` está aquí y no en
// `@/components` porque solo lo usa este paso: sube, previsualiza y borra la
// foto del producto con las reglas de `libs/product-image`.
export { default as ProductBasicsStep } from './ProductBasicsStep';
export { default as ProductImageField } from './ProductImageField';

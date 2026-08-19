// ── Formulario del producto ─────────────────────────────────────────────────
// Piezas del alta por pasos. Todas de presentación: el estado del formulario
// lo lleva react-hook-form desde `hooks/use-product-form.ts`, y el reparto de
// la pantalla, `page/CreateProduct.tsx`.
//
// La cabecera no está aquí: se subió a `@/components/layout/PageHeader` cuando
// la pantalla de categorías necesitó exactamente la misma fila —flecha,
// título y bajada—, que es la señal de que había dejado de ser una pieza del
// formulario.
export { default as ProductBasicsStep } from './ProductBasicsStep';
export { default as ProductFormStepper } from './ProductFormStepper';
export { default as ProductImageField } from './ProductImageField';
export { default as ProductStepPlaceholder } from './ProductStepPlaceholder';

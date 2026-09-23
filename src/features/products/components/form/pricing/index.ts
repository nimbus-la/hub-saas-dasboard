// ── Paso 3: precio y disponibilidad ─────────────────────────────────────────
// `ProductPricingStep` es lo único que monta `CreateProduct`; el resto son las
// piezas con las que se arma: el resumen de costo y ganancia, y las sucursales
// que pueden salirse del precio global.
export { default as BranchPricingCard } from './BranchPricingCard';
export { default as BranchPricingList } from './BranchPricingList';
export { default as PricingSummary } from './PricingSummary';
export { default as ProductPricingStep } from './ProductPricingStep';

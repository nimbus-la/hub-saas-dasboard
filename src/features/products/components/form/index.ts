// ── Alta de producto ────────────────────────────────────────────────────────
// La zona se parte por paso del asistente, con el mismo nombre que el `step.id`
// de `PRODUCT_FORM_STEPS`: `stepper/` es el armazón, `basics/` el paso 1,
// `recipe/` el paso 2 y `pricing/` el paso 3. `CreateProduct` solo monta el
// indicador y el paso que toque; las demás piezas se exportan porque son la API
// pública de su carpeta, y quien componga un paso nuevo las va a necesitar.
export * from './basics';
export * from './pricing';
export * from './recipe';
export * from './stepper';

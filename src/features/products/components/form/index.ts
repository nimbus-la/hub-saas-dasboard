// ── Alta de producto ────────────────────────────────────────────────────────
// La zona se parte por paso del asistente, con el mismo nombre que el `step.id`
// de `PRODUCT_FORM_STEPS`: `stepper/` es el armazón, `basics/` el paso 1 y
// `recipe/` el paso 2. `CreateProduct` solo monta cuatro de estas piezas; las
// demás se exportan porque son la API pública de su carpeta, y quien componga
// un paso nuevo las va a necesitar.
export * from './basics';
export * from './recipe';
export * from './stepper';

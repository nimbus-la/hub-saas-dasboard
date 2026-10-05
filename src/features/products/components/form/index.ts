// ── Formulario de producto ──────────────────────────────────────────────────
// La zona se parte por paso del asistente, con el mismo nombre que el `step.id`
// de `PRODUCT_FORM_STEPS`: `basics/` el paso 1, `recipe/` el paso 2 y
// `pricing/` el paso 3. `layout/` es la pantalla que los reúne, la misma para
// crear y para editar, y `stepper/` el indicador de pasos que va dentro. Las
// demás piezas se exportan porque son la API pública de su carpeta, y quien
// componga un paso nuevo las va a necesitar.
export * from './basics';
export * from './layout';
export * from './pricing';
export * from './recipe';
export * from './stepper';

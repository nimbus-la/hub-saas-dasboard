// ── Piezas del módulo de productos ──────────────────────────────────────────
// Cada carpeta declara su propia API pública en su `index.ts`; aquí sólo se
// juntan. Los componentes se exportan por nombre (`export { default as … }`)
// porque `export *` no arrastra las exportaciones por defecto.

export * from './categories';
export * from './form';
export * from './list';

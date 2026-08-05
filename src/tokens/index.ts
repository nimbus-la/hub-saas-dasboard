/* -------------------------------------------------------------------------- */
/*  Design system — punto de entrada único                                     */
/*                                                                             */
/*  Todo se importa desde `@/tokens`. Aquí viven las recetas, el espaciado y    */
/*  los números que JavaScript necesita; los valores de radio, tipografía,      */
/*  sombra y color están en `src/style/style.css` y se consumen como            */
/*  utilidades de Tailwind (`rounded-lg`, `text-body-md`). Ver README.md.       */
/* -------------------------------------------------------------------------- */

export * from './scale.tokens';
export * from './spacing.tokens';
export * from './radius.tokens';
export * from './typography.tokens';
export * from './icons.tokens';
export * from './components.tokens';
export * from './layout.tokens';
export * from './elevation.tokens';
export * from './motion.tokens';

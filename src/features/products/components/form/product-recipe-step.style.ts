import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Cuerpo del paso.
 *
 * Es un `fieldset`, y el navegador le da por defecto un ancho mínimo igual al
 * de su contenido. Con `min-w-0` la tabla puede desplazarse de lado en
 * pantallas estrechas en lugar de estirar todo el formulario.
 */
export const productRecipeStepVariants = cva([
    "flex min-w-0 flex-col border-0 p-0",
    SPACING_CLASS.gap.xl,
]);


/** Bloque de la lista, con su encabezado, la tabla y el resumen. */
export const productRecipeListVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
]);


/** Encabezado de la lista, con el título y cuántos insumos lleva. */
export const productRecipeListHeaderVariants = cva([
    "flex flex-wrap items-center justify-between",
    SPACING_CLASS.gap.sm,
]);


/**
 * Título de la lista. Recibe el foco cuando se quita el último insumo, y ese
 * foco no se dibuja porque el título no es un control.
 */
export const productRecipeListTitleVariants = cva([
    "text-neutral-800 focus-visible:outline-none",
    TYPOGRAPHY.subtitleLg,
]);


/** Contador de insumos, en la esquina opuesta al título. */
export const productRecipeListCountVariants = cva([
    "text-neutral-600 tabular-nums",
    TYPOGRAPHY.caption,
]);

import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    RADIUS_FULL_CLASS,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de RecipeEmptyState
 *
 * Tiene la misma forma que el estado vacío del catálogo, con el círculo de
 * 56px y el texto centrado, para que en toda la app "todavía no hay nada" se
 * vea igual.
 */


/** Marco del estado vacío. Sin él quedaría un texto suelto en medio del paso. */
export const recipeEmptyStateVariants = cva([
    "flex flex-col items-center justify-center text-center",
    "border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.xl,
    SPACING_CLASS.paddingY["2xl"],
]);


/** Círculo del icono, con el lado del control `2xl`. */
export const recipeEmptyStateIconVariants = cva([
    "flex items-center justify-center bg-neutral-200 text-neutral-600",
    CONTROL_SIZE["2xl"].squareClass,
    RADIUS_FULL_CLASS,
]);


export const recipeEmptyStateTextVariants = cva([
    "flex max-w-sm flex-col",
    SPACING_CLASS.gap.xs,
]);


export const recipeEmptyStateTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


export const recipeEmptyStateMessageVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);

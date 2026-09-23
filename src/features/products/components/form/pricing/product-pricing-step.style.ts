import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Cuerpo del paso.
 *
 * Con `min-w-0` las tarjetas de sucursal pueden encogerse en pantallas
 * estrechas en lugar de estirar el formulario entero, lo mismo que hace el
 * paso de la receta con su tabla.
 */
export const productPricingStepVariants = cva([
    "flex min-w-0 flex-col border-0 p-0",
    SPACING_CLASS.gap.xl,
]);


/** El margen y el precio, uno al lado del otro a partir de `md`. */
export const productPricingGridVariants = cva([
    "grid grid-cols-1 md:grid-cols-2",
    SPACING_CLASS.gap.lg,
]);


/**
 * Caja de la disponibilidad global.
 *
 * Va sobre una superficie propia porque no es un campo más de la rejilla: es
 * la decisión de si el producto sale a la venta, y las sucursales de abajo la
 * heredan.
 */
export const productPricingAvailabilityVariants = cva([
    "border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
]);


/** Bloque de sucursales, con su encabezado y las tarjetas. */
export const productPricingBranchesVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
]);


export const productPricingBranchesHeaderVariants = cva([
    "flex flex-wrap items-center justify-between",
    SPACING_CLASS.gap.sm,
]);


export const productPricingBranchesTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleLg,
]);


export const productPricingBranchesCountVariants = cva([
    "text-neutral-600 tabular-nums",
    TYPOGRAPHY.caption,
]);


export const productPricingBranchesHintVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodySm,
]);


/** Las tarjetas, una debajo de otra. */
export const productPricingCardsVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.md,
]);

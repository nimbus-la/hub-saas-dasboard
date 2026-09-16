import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Tarjeta de una sucursal.
 *
 * La que se sale del precio global se marca con el borde de la marca. Es la
 * diferencia que importa de un vistazo cuando hay cuatro tarjetas seguidas y
 * solo una no hereda.
 */
export const branchPricingCardVariants = cva(
    [
        "flex flex-col border bg-white",
        RADIUS_SEMANTIC.surface,
        SPACING_CLASS.gap.md,
        SPACING_CLASS.paddingX.lg,
        SPACING_CLASS.paddingY.md,
    ],
    {
        variants: {
            custom: { true: "border-primary-main", false: "border-neutral-200" },
        },
        defaultVariants: { custom: false },
    }
);


/** Nombre y estado a un lado, el interruptor de personalizar al otro. */
export const branchPricingHeaderVariants = cva([
    "flex flex-wrap items-center justify-between",
    SPACING_CLASS.gap.md,
]);


export const branchPricingIdentityVariants = cva([
    "flex min-w-0 items-center",
    SPACING_CLASS.gap.sm,
]);


export const branchPricingNameVariants = cva([
    "truncate text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/**
 * Cuerpo de la tarjeta.
 *
 * Dos columnas a partir de `sm` porque son dos datos cortos —el precio y si se
 * vende— y apilados dejan la tarjeta el doble de alta sin ganar nada.
 */
export const branchPricingBodyVariants = cva([
    "grid grid-cols-1 items-start sm:grid-cols-2",
    SPACING_CLASS.gap.lg,
]);


export const branchPricingFieldVariants = cva(["flex min-w-0 flex-col", SPACING_CLASS.gap.xs]);


export const branchPricingLabelVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.labelSm,
]);


/** El valor heredado. En gris, para que no parezca algo escrito ahí. */
export const branchPricingInheritedVariants = cva([
    "text-neutral-800 tabular-nums",
    TYPOGRAPHY.subtitleMd,
]);


export const branchPricingHintVariants = cva([TYPOGRAPHY.caption], {
    variants: {
        tone: { neutral: "text-neutral-600", off: "text-error-darker" },
    },
    defaultVariants: { tone: "neutral" },
});

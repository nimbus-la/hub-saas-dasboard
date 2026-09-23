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


/** Nombre y estado a un lado, la acción que cambia el modo al otro. */
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
 * Al personalizarla se separa del encabezado con una línea: lo de arriba deja
 * de ser un resumen y pasa a ser el título de un par de campos que hay que
 * rellenar, y la línea es lo que marca ese cambio de papel.
 */
export const branchPricingBodyVariants = cva(["flex min-w-0 flex-col"], {
    variants: {
        divided: {
            true: ["border-t border-neutral-200 pt-4", SPACING_CLASS.gap.lg],
            false: SPACING_CLASS.gap.sm,
        },
    },
    defaultVariants: { divided: false },
});


/**
 * Lo que hereda la sucursal, en una sola fila.
 *
 * Son dos datos de tres palabras: apilados dejaban la tarjeta el doble de alta
 * sin decir nada más, y en una rejilla de dos columnas el segundo quedaba
 * perdido en mitad del ancho del panel.
 */
export const branchPricingInheritedVariants = cva([
    "flex flex-wrap items-baseline",
    SPACING_CLASS.gap.xl,
]);


export const branchPricingFieldVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.xs,
]);


export const branchPricingLabelVariants = cva(["text-neutral-600", TYPOGRAPHY.labelSm]);


/** El valor heredado. En rojo cuando la sucursal no vende el producto. */
export const branchPricingValueVariants = cva(["tabular-nums", TYPOGRAPHY.subtitleMd], {
    variants: {
        tone: { neutral: "text-neutral-800", off: "text-error-darker" },
    },
    defaultVariants: { tone: "neutral" },
});


export const branchPricingHintVariants = cva(["text-neutral-600", TYPOGRAPHY.caption]);


/**
 * El campo del precio propio.
 *
 * Acotado, porque un importe de cinco cifras en un campo del ancho del panel
 * se lee como si esperase una frase.
 */
export const branchPricingPriceVariants = cva(["w-full sm:max-w-xs"]);


/**
 * El interruptor de la disponibilidad.
 *
 * Va debajo del precio y con su propia línea porque es la otra decisión de la
 * tarjeta, no un detalle del campo de arriba.
 */
export const branchPricingAvailabilityVariants = cva(["border-t border-neutral-200 pt-4"]);

import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";

/**
 * La página es una columna y la tarjeta crece con `flex-1`: así ocupa el alto
 * de la ventana menos el relleno sin tener que restarlo a mano con `calc`.
 */
export const loginPageVariants = cva(
    "flex min-h-screen flex-col bg-neutral-100 p-4 sm:p-6"
);

export const loginPageCardVariants = cva(
    "relative mx-auto flex w-full max-w-4xl flex-1 overflow-hidden rounded-2xl bg-white shadow-xl"
);

export const loginPageBrandVariants = cva([
    "absolute left-6 top-6 z-10 flex items-center",
    SPACING_CLASS.gap.sm,
]);

/** Palabra de marca. El tracking cerrado es de logotipo, como en el menú lateral. */
export const loginPageBrandNameVariants = cva([
    TYPOGRAPHY.h5,
    "tracking-tight text-neutral-900",
]);

/**
 * El `pt-24` de las pantallas estrechas no es separación de la escala: deja
 * sitio a la marca, que va posicionada encima. Desde `lg` el formulario se
 * centra en su mitad y la marca ya no lo pisa.
 */
export const loginPageFormSectionVariants = cva(
    "flex w-full items-center justify-center px-6 pb-8 pt-24 sm:px-8 lg:w-1/2 lg:py-8"
);

export const loginPageShowcaseSectionVariants = cva(
    "hidden lg:flex lg:w-1/2"
);

export const loginPageShowcaseVariants = cva(
    "flex w-full flex-col bg-primary-main p-8 text-white"
);

export const loginPageShowcaseTitleVariants = cva(
    TYPOGRAPHY.h3
);

export const loginPageShowcaseDescriptionVariants = cva([
    "mt-3 max-w-md text-white/80",
    TYPOGRAPHY.bodyMd,
]);

export const loginPagePreviewVariants = cva(
    "mt-6 flex flex-1 items-center justify-center"
);

export const loginPagePreviewFrameVariants = cva(
    "w-full max-w-md overflow-hidden rounded-2xl"
);

export const loginPagePreviewImageVariants = cva(
    "block h-auto w-full object-contain"
);

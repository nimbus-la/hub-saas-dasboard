import { cva } from "class-variance-authority";

export const loginPageVariants = cva(
    "min-h-screen bg-neutral-100 px-4 py-4 sm:px-6 sm:py-6"
);

export const loginPageCardVariants = cva(
    "relative mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl sm:min-h-[calc(100vh-3rem)]"
);

export const loginPageBrandVariants = cva(
    "absolute left-5 top-5 z-10 flex items-center gap-2 sm:left-6 sm:top-5"
);

export const loginPageBrandNameVariants = cva(
    "text-lg font-bold text-neutral-900"
);

export const loginPageFormSectionVariants = cva(
    "flex w-full items-center justify-center px-6 pb-8 pt-24 sm:px-10 sm:pb-10 sm:pt-28 lg:w-1/2 lg:px-12 lg:py-10"
);

export const loginPageShowcaseSectionVariants = cva(
    "hidden lg:flex lg:w-1/2"
);

export const loginPageShowcaseVariants = cva(
    "flex w-full flex-col bg-primary-main px-8 pb-8 pt-20 text-white xl:px-10"
);

export const loginPageShowcaseTitleVariants = cva(
    "text-h3"
);

export const loginPageShowcaseDescriptionVariants = cva(
    "mt-3 max-w-md text-body-md text-white/80"
);

export const loginPagePreviewVariants = cva(
    "mt-5 flex flex-1 items-center justify-center"
);

export const loginPagePreviewFrameVariants = cva(
    "w-full max-w-md overflow-hidden rounded-2xl"
);

export const loginPagePreviewImageVariants = cva(
    "block h-auto w-full object-contain"
);
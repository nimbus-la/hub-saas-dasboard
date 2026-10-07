import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";

export const loginFormVariants = cva(
  "w-full max-w-md"
);

export const loginFormHeaderVariants = cva([
  "flex flex-col text-center",
  SPACING_CLASS.gap.sm,
]);

// `text-h2` ya fija el grosor: un `font-bold` encima solo lo repetiría.
export const loginFormTitleVariants = cva([
  TYPOGRAPHY.h2,
  "text-neutral-900",
]);

export const loginFormSubtitleVariants = cva([
  TYPOGRAPHY.bodySm,
  "text-neutral-600",
]);

/**
 * Pila de campos. Misma separación que el resto de formularios
 * (`SPACING_SEMANTIC.field` en su versión de `flex`).
 */
export const loginFormFieldsVariants = cva([
  "mt-8 flex w-full flex-col",
  SPACING_CLASS.gap.lg,
]);

export const loginFormActionsVariants = cva(
  "mt-6"
);

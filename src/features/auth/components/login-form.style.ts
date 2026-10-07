import { cva } from "class-variance-authority";

export const loginFormVariants = cva(
  "w-full max-w-md"
);

export const loginFormHeaderVariants = cva(
  "flex flex-col gap-2 text-center"
);

export const loginFormTitleVariants = cva(
  "text-h2 font-bold text-neutral-900"
);

export const loginFormSubtitleVariants = cva(
  "text-body-sm text-neutral-600"
);

export const loginFormFieldsVariants = cva(
  "mt-8 flex w-full max-w-md flex-col gap-5"
);

export const loginFormActionsVariants = cva(
  "mt-6"
);
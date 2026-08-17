import { cva } from "class-variance-authority";

export const loginFormVariants = cva(
  "w-full max-w-md"
);

export const loginFormHeaderVariants = cva(
  "flex flex-col gap-2"
);

export const loginFormFieldsVariants = cva(
  "flex flex-col gap-5"
);

export const loginFormOptionsVariants = cva(
  "flex items-center justify-between gap-4"
);

export const loginFormSocialVariants = cva(
  "grid grid-cols-2 gap-3"
);

export const loginFormDividerVariants = cva(
  "flex items-center gap-4"
);

export const loginFormFooterVariants = cva(
  "text-center"
);
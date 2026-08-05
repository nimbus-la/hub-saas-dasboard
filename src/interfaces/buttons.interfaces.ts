import type { ButtonHTMLAttributes } from "react";

import { VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { genericButtonVariants, linkButtonVariants } from "@/components";


export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof genericButtonVariants> {
    label?: string;
    icon?: LucideIcon;
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;
    selected?: boolean;
};


/** Escalón de la escala del sistema con el que se pinta un botón. */
export type ButtonSize = NonNullable<ButtonProps["size"]>;


export interface LinkButtonProps extends VariantProps<typeof linkButtonVariants> {
    label: string;
    /** Ruta de destino. Si se define, se renderiza como enlace de Next. */
    href?: string;
    /** Acción a ejecutar. Se usa cuando no hay `href` (se renderiza como botón). */
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};

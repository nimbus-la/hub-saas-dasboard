import { linkButtonVariants } from "@/components/buttons/buttons.style";
import { VariantProps } from "class-variance-authority";

export interface LinkButtonProps extends VariantProps<typeof linkButtonVariants> {
    label: string;
    /** Ruta de destino. Si se define, se renderiza como enlace de Next. */
    href?: string;
    /** Acción a ejecutar. Se usa cuando no hay `href` (se renderiza como botón). */
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};
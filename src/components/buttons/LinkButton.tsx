import Link from "next/link";

import { LinkButtonProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { linkButtonVariants } from "./buttons.style";


export default function LinkButton({
    label,
    href,
    onClick,
    size = "medium",
    disabled = false,
    className,
}: LinkButtonProps) {
    const classes = cn(linkButtonVariants({ size }), className);

    // El subrayado se aplica sólo al texto (no a los íconos) para que la línea
    // quede limpia y a la altura correcta de la tipografía.
    const content = (
        <>
            <span
                className={cn(
                    "underline-offset-2 transition-colors duration-150",
                    "group-hover:underline group-focus-visible:underline",
                    "group-disabled:no-underline"
                )}
            >
                {label}
            </span>
        </>
    );

    // Un enlace deshabilitado seguiría siendo navegable: en ese caso se degrada
    // a <button disabled>, que sí comunica el estado a los lectores de pantalla.
    if (href && !disabled) {
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            disabled={disabled}
            className={classes}
            {...(onClick && { onClick })}
        >
            {content}
        </button>
    );
};

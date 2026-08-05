import Link from "next/link";

import { LinkButtonProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { linkButtonLabel, linkButtonVariants } from "./link-button.style";


export default function LinkButton({
    label,
    href,
    onClick,
    size = "md",
    disabled = false,
    className,
}: LinkButtonProps) {
    const classes = cn(linkButtonVariants({ size }), className);

    const content = <span className={linkButtonLabel()}>{label}</span>;

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

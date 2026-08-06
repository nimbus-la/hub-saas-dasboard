import Link from "next/link";

import { cn } from "@/lib/utils";
import { CONTROL_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import {
    productFormBackVariants,
    productFormHeaderTextVariants,
    productFormHeaderVariants,
    productFormSubtitleVariants,
    productFormTitleVariants,
} from "./product-form-header.style";


/**
 * Encabezado del formulario de producto
 * 
 * Flecha de regreso, título y bajada. Va por encima del panel: dice dónde
 * estás y cómo salir antes de pedirte nada.
 *
 * Los textos llegan por props en vez de estar escritos aquí, porque el alta y
 * la edición comparten esta cabecera y sólo se diferencian en lo que dice.
 */

interface ProductFormHeaderProps {
    title: string;
    subtitle: string;
    /** Destino de la flecha de regreso. */
    backHref: string;
    /**
     * Texto accesible de la flecha.
     *
     * Nombra el destino, no la dirección: "Atrás" a secas obliga a adivinar a
     * dónde lleva a quien navega con lector de pantalla.
     */
    backLabel: string;
    className?: string;
}

export default function ProductFormHeader({
    title,
    subtitle,
    backHref,
    backLabel,
    className,
}: ProductFormHeaderProps) {
    return (
        <div className={cn(productFormHeaderVariants(), className)}>
            <Link
                href={backHref}
                aria-label={backLabel}
                className={productFormBackVariants()}
            >
                <ICON_TOKENS.BACK
                    size={CONTROL_SIZE.md.iconSize}
                    strokeWidth={ICON_STROKE_BY_SIZE.md}
                    aria-hidden="true"
                />
            </Link>

            <div className={productFormHeaderTextVariants()}>
                <h1 className={productFormTitleVariants()}>{title}</h1>

                <p className={productFormSubtitleVariants()}>{subtitle}</p>
            </div>
        </div>
    );
};
